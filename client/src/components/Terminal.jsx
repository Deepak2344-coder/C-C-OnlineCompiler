import { useEffect, useRef, useState } from "react";

const STATUS = {
  idle: { label: "ready", cls: "st-idle" },
  compiling: { label: "compiling…", cls: "st-run" },
  running: { label: "running", cls: "st-run" },
  exited: { label: "success", cls: "st-ok" },
  compile_error: { label: "compile error", cls: "st-err" },
  runtime_error: { label: "runtime error", cls: "st-err" },
  timeout: { label: "stopped", cls: "st-warn" },
  server_error: { label: "server error", cls: "st-err" },
};

/** Renders output, styling user-typed lines (wrapped in \u0001 by the server). */
function OutputText({ text }) {
  const parts = text.split("\u0001");
  return (
    <pre className="t-block">
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} className="t-echo">
            {"> " + p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </pre>
  );
}

/**
 * Terminal with a live prompt: while the program is running you type input
 * here and press Enter — it goes straight to the program's stdin.
 */
export default function Terminal({ state, onInput, onStop }) {
  const { status, output, compileOutput, error, exitCode } = state;
  const running = status === "running";
  const [line, setLine] = useState("");
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  // follow the output like a real terminal
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [output, status]);

  // focus the prompt as soon as the program starts waiting for input
  useEffect(() => {
    if (running && inputRef.current) inputRef.current.focus();
  }, [running]);

  const meta = STATUS[status] || STATUS.idle;

  const submit = (e) => {
    e.preventDefault();
    if (!running) return;
    onInput?.(line);
    setLine("");
  };

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dots" aria-hidden="true">● ● ●</span>
        <span className="terminal-title">terminal</span>
        <span className={`status-chip ${meta.cls}`}>{meta.label}</span>
        {running && (
          <button className="ghost tiny" onClick={onStop} title="Stop the program">
            stop
          </button>
        )}
      </div>

      <div className="terminal-body" ref={bodyRef}>
        {!compileOutput && !output && !error && status === "idle" && (
          <div className="t-muted">compile a program and interact with it here…</div>
        )}
        {status === "compiling" && <div className="t-muted">compiling…</div>}

        {compileOutput && (
          <>
            <div className="t-muted">— compiler —</div>
            <pre className="t-block t-err">{compileOutput}</pre>
          </>
        )}

        {output && (
          <>
            <div className="t-muted">— output —</div>
            <OutputText text={output} />
          </>
        )}

        {status === "exited" && (
          <div className="t-muted">— program finished (exit code {exitCode ?? 0}) —</div>
        )}
        {error && <pre className="t-block t-err">{error}</pre>}

        {running ? (
          <form className="t-input-row" onSubmit={submit}>
            <span className="t-dollar">$</span>
            <input
              ref={inputRef}
              className="t-input"
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="type input and press Enter…"
              spellCheck={false}
              autoComplete="off"
              aria-label="Program input"
            />
          </form>
        ) : (
          <div className="t-prompt">
            <span className="t-dollar">$</span> <span className="t-cursor">▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
