import { useCallback, useEffect, useRef, useState } from "react";

const IDLE = { status: "idle", compileOutput: "", output: "", exitCode: null, error: null };

/**
 * Runs code on the server as a live session:
 *   POST /api/run            -> compile + start the program (stdin stays open)
 *   GET  /api/run/:id        -> poll output/status while it runs
 *   POST /api/run/:id/input  -> send one typed line to the program
 *   DELETE /api/run/:id      -> kill it
 */
export function useRunner() {
  const [state, setState] = useState(IDLE);
  const sessionRef = useRef(null);
  const pollRef = useRef(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const killSession = useCallback(() => {
    if (sessionRef.current) {
      fetch(`/api/run/${sessionRef.current}`, { method: "DELETE" }).catch(() => {});
      sessionRef.current = null;
    }
  }, []);

  const poll = useCallback(async () => {
    const id = sessionRef.current;
    if (!id) return;
    try {
      const res = await fetch(`/api/run/${id}`);
      if (res.status === 404) {
        stopPolling();
        sessionRef.current = null;
        return;
      }
      const data = await res.json();
      setState((s) => ({
        ...s,
        status: data.status,
        output: data.output || "",
        exitCode: data.exitCode ?? null,
        error: data.error || null,
      }));
      if (data.status !== "running") {
        stopPolling();
        sessionRef.current = null;
      }
    } catch {
      stopPolling();
    }
  }, [stopPolling]);

  const run = useCallback(
    async (code, language) => {
      stopPolling();
      killSession();
      setState({ ...IDLE, status: "compiling" });
      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.sessionId) {
          sessionRef.current = data.sessionId;
          setState({
            status: "running",
            compileOutput: data.compileOutput || "",
            output: "",
            exitCode: null,
            error: null,
          });
          pollRef.current = setInterval(poll, 300);
          poll(); // paint the first prompt immediately
        } else {
          setState({
            status: data.status || "server_error",
            compileOutput: data.compileOutput || "",
            output: "",
            exitCode: null,
            error: data.error || null,
          });
        }
      } catch (err) {
        setState({ ...IDLE, status: "server_error", error: err.message });
      }
    },
    [poll, killSession, stopPolling]
  );

  const sendInput = useCallback(
    async (line) => {
      const id = sessionRef.current;
      if (!id) return;
      try {
        await fetch(`/api/run/${id}/input`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ line }),
        });
      } catch {
        /* the session may have just ended */
      }
      poll(); // show the echo + fresh output right away
    },
    [poll]
  );

  const stop = useCallback(() => {
    stopPolling();
    killSession();
    setState(IDLE);
  }, [stopPolling, killSession]);

  // clean up when the component unmounts (tab change, page leave)
  useEffect(() => stop, [stop]);

  return { state, run, sendInput, stop, running: state.status === "running" };
}
