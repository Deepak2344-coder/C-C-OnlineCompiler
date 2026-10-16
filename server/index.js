const express = require("express");
const cors = require("cors");
const fsp = require("fs/promises");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 5000;

const COMPILE_TIMEOUT = 20000; // 20s to compile
const RUN_LIMIT = Number(process.env.PPL_RUN_MS) || 120000; // hard cap per program run
const IDLE_LIMIT = 90000; // kill a running session with no activity
const MAX_OUTPUT = 200000; // cap per-session output
const MAX_SESSIONS = 20;

app.use(cors());
app.use(express.json({ limit: "64kb" }));

/**
 * Programs run with stdout as a pipe, so C streams would be fully buffered and
 * prompts like printf("Enter: ") would not show until the program ends.
 * This helper file (linked with the user's code, never merged into it) makes
 * stdout/stderr unbuffered before main() runs — the user's source stays
 * untouched, so compiler errors keep exact line numbers and snippets.
 */
const INIT_SOURCE_C = `#include <stdio.h>
#include <stdlib.h>
__attribute__((constructor)) static void __ppl_setup(void) {
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
}
`;
const INIT_SOURCE_CPP = `#include <cstdio>
#include <cstdlib>
__attribute__((constructor)) static void __ppl_setup() {
    setvbuf(stdout, NULL, _IONBF, 0);
    setvbuf(stderr, NULL, _IONBF, 0);
}
`;

/**
 * Spawn a process, capture stdout/stderr, enforce a timeout.
 * Never throws — resolves with { code, stdout, stderr, timedOut, spawnError }.
 */
function run(cmd, args, { timeout = 10000, cwd } = {}) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd, args, { cwd, windowsHide: true });
    } catch (e) {
      return resolve({ code: -1, stdout: "", stderr: String(e), timedOut: false, spawnError: true });
    }

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill(); } catch (_) {}
    }, timeout);

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ code: -1, stdout, stderr: stderr + String(err), timedOut, spawnError: true });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });
  });
}

/** Live run sessions: id -> { proc, dir, status, output, ... } */
const sessions = new Map();

function removeDir(dir) {
  fsp.rm(dir, { recursive: true, force: true }).catch(() => {});
}

function killSession(session, status, error) {
  if (session.status !== "running") return;
  session.status = status;
  session.error = error || session.error;
  clearTimeout(session.timer);
  try { session.proc.kill(); } catch (_) {}
}

// housekeeping: kill abandoned sessions, forget finished ones
setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) {
    const idle = now - s.lastActivity > IDLE_LIMIT;
    if (s.status === "running" && idle) {
      killSession(s, "timeout", "Session timed out — no activity.");
    } else if (s.status !== "running" && idle) {
      sessions.delete(id);
    }
  }
}, 15000).unref();

app.get("/api/status", async (_req, res) => {
  const [c, cpp] = await Promise.all([
    run("gcc", ["--version"], { timeout: 5000 }),
    run("g++", ["--version"], { timeout: 5000 }),
  ]);
  res.json({ gcc: c.code === 0 && !c.spawnError, gcpp: cpp.code === 0 && !c.spawnError, platform: process.platform });
});

/** Compile the code and start it running, waiting for input. */
app.post("/api/run", async (req, res) => {
  const body = req.body || {};
  const code = typeof body.code === "string" ? body.code : "";
  const language = body.language === "cpp" ? "cpp" : "c";

  if (!code.trim()) return res.status(400).json({ status: "server_error", error: "No code provided." });
  if (code.length > 100 * 1024) return res.status(400).json({ status: "server_error", error: "Code too long (max 100 KB)." });

  const compiler = language === "cpp" ? "g++" : "gcc";
  const dir = await fsp.mkdtemp(path.join(os.tmpdir(), "ppl-"));
  const src = path.join(dir, language === "cpp" ? "main.cpp" : "main.c");
  const init = path.join(dir, language === "cpp" ? "ppl_init.cpp" : "ppl_init.c");
  const bin = path.join(dir, language === "cpp" ? "prog_cpp.exe" : "prog_c.exe");

  await fsp.writeFile(src, code, "utf8");
  await fsp.writeFile(init, language === "cpp" ? INIT_SOURCE_CPP : INIT_SOURCE_C, "utf8");

  // ---- compile (user file + buffering helper, linked together) ----
  // -lm pulls in libm (sqrt/pow). glibc needs it explicitly; g++ links it itself.
  const linkFlags = language === "cpp" ? ["-O2"] : ["-O2", "-lm"];
  const c = await run(compiler, [src, init, "-o", bin, ...linkFlags], { timeout: COMPILE_TIMEOUT, cwd: dir });
  // shorten temp paths in diagnostics: "C:\...\ppl-xxx\main.c:2:5" -> "main.c:2:5"
  const compileOutput = (c.stdout + c.stderr)
    .split(dir + path.sep)
    .join("")
    .split(dir + "/")
    .join("")
    .trim();

  if (c.spawnError) {
    removeDir(dir);
    return res.json({ status: "server_error", compileOutput, error: `Compiler '${compiler}' not found on the server PATH.` });
  }
  if (c.timedOut) {
    removeDir(dir);
    return res.json({ status: "timeout", compileOutput, error: "Compilation timed out." });
  }
  if (c.code !== 0) {
    removeDir(dir);
    return res.json({ status: "compile_error", compileOutput: compileOutput || "Compilation failed." });
  }

  // ---- run (keep it alive for interactive input) ----
  while (sessions.size >= MAX_SESSIONS) {
    const oldest = sessions.keys().next().value;
    killSession(sessions.get(oldest), "timeout", "Too many sessions — oldest one was closed.");
    sessions.delete(oldest);
  }

  const proc = spawn(bin, [], { cwd: dir, windowsHide: true });
  const session = {
    id: crypto.randomUUID(),
    proc,
    dir,
    status: "running",
    output: "",
    compileOutput,
    exitCode: null,
    error: null,
    lastActivity: Date.now(),
    timer: null,
  };
  sessions.set(session.id, session);

  session.timer = setTimeout(() => {
    killSession(session, "timeout", `Program stopped: it ran longer than ${Math.round(RUN_LIMIT / 1000)}s.`);
  }, RUN_LIMIT);

  const append = (chunk) => {
    if (session.output.length < MAX_OUTPUT) session.output += chunk.toString();
  };
  proc.stdout.on("data", append);
  proc.stderr.on("data", append);
  proc.on("error", (err) => {
    session.status = "server_error";
    session.error = String(err);
  });
  proc.on("close", (code) => {
    clearTimeout(session.timer);
    if (session.status === "running") session.status = "exited";
    session.exitCode = code;
    removeDir(dir);
    // keep the final state readable for a while, then forget it
    setTimeout(() => sessions.delete(session.id), 120000).unref();
  });

  res.json({ sessionId: session.id, status: "running", compileOutput });
});

/** Poll the state of a running (or finished) session. */
app.get("/api/run/:id", (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: "Session ended." });
  s.lastActivity = Date.now();
  res.json({ status: s.status, output: s.output, exitCode: s.exitCode, error: s.error });
});

/** Send one line of input to the running program. */
app.post("/api/run/:id/input", (req, res) => {
  const s = sessions.get(req.params.id);
  if (!s) return res.status(404).json({ error: "Session ended." });
  if (s.status !== "running") return res.status(409).json({ error: "Program is not running." });

  const line = String((req.body && req.body.line) || "").replace(/\r/g, "").slice(0, 4096);
  s.output += "\u0001" + line + "\u0001\n"; // sentinel so the client can style the echo
  try { s.proc.stdin.write(line + "\n"); } catch (_) {}
  s.lastActivity = Date.now();
  res.json({ ok: true });
});

/** Kill a session (used when the user clears or leaves the page). */
app.delete("/api/run/:id", (req, res) => {
  const s = sessions.get(req.params.id);
  if (s) {
    killSession(s, "timeout", "Stopped.");
    removeDir(s.dir);
    sessions.delete(req.params.id);
  }
  res.json({ ok: true });
});

/* ============================================================
   Bug reports — stored in server/data/bugs.json
   Anyone can POST a report; only the owner (with the admin key)
   can read or delete them. No email required.
   ============================================================ */
const DATA_DIR = path.join(__dirname, "data");
const BUGS_FILE = path.join(DATA_DIR, "bugs.json");
const ADMIN_KEY = process.env.ADMIN_KEY || "ppl-admin"; // change this (or set env var)

async function loadBugs() {
  try {
    return JSON.parse(await fsp.readFile(BUGS_FILE, "utf8"));
  } catch {
    return [];
  }
}
async function saveBugs(list) {
  await fsp.mkdir(DATA_DIR, { recursive: true });
  await fsp.writeFile(BUGS_FILE, JSON.stringify(list, null, 2), "utf8");
}
function isAuthorized(req) {
  const key = req.query.key || req.headers["x-admin-key"];
  return key === ADMIN_KEY;
}

// Submit a bug report (public)
app.post("/api/bugs", async (req, res) => {
  const b = req.body || {};
  const message = String(b.message || "").trim();
  if (!message) return res.status(400).json({ error: "Please describe the problem." });
  if (message.length > 5000) return res.status(400).json({ error: "Too long (max 5000 characters)." });

  const report = {
    id: crypto.randomUUID(),
    message,
    page: String(b.page || "").slice(0, 300),
    contact: String(b.contact || "").slice(0, 200), // optional, never required
    code: String(b.code || "").slice(0, 10000), // optional pasted snippet
    userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
    createdAt: new Date().toISOString(),
    read: false,
  };

  const list = await loadBugs();
  list.unshift(report); // newest first
  await saveBugs(list);
  res.json({ ok: true, id: report.id });
});

// List reports (owner only)
app.get("/api/bugs", async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Wrong admin key." });
  res.json({ bugs: await loadBugs() });
});

// Delete one report (owner only)
app.delete("/api/bugs/:id", async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Wrong admin key." });
  const list = (await loadBugs()).filter((x) => x.id !== req.params.id);
  await saveBugs(list);
  res.json({ ok: true });
});

// Mark all as read (owner only)
app.post("/api/bugs/read-all", async (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Wrong admin key." });
  const list = await loadBugs();
  for (const r of list) r.read = true;
  await saveBugs(list);
  res.json({ ok: true });
});

/* ============================================================
   Serve the built client from this same process.

   Locally, Vite serves the UI on :5173 and proxies /api here, so client/dist
   does not exist yet and this block is a no-op. On Render, `npm run build`
   produces client/dist and this is what the public actually sees.
   ============================================================ */
const CLIENT_DIST = path.join(__dirname, "..", "client", "dist");

app.use(express.static(CLIENT_DIST));

// SPA fallback — React Router owns /sessions, /reader, /playground and /admin,
// so any non-API GET must receive index.html instead of a 404. API paths are
// skipped so a mistyped endpoint still returns JSON rather than the HTML shell.
app.use((req, res, next) => {
  if (req.method !== "GET" || req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(CLIENT_DIST, "index.html"), (err) => {
    if (err) next(); // no build present — fall through to the normal 404
  });
});

app.listen(PORT, () => {
  console.log(`PPL server running at http://localhost:${PORT}`);
});
