import { useState } from "react";
import { submitBug } from "../api.js";

/**
 * Floating "Report a bug" button (bottom-right) that opens a small form.
 * Reports are saved to the server — no email needed from the reporter.
 */
export default function BugButton() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ message: "", contact: "", code: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const openForm = () => {
    setForm({ message: "", contact: "", code: "" });
    setState("idle");
    setError("");
    setOpen(true);
  };

  const send = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setState("sending");
    setError("");
    try {
      await submitBug({
        message: form.message,
        contact: form.contact,
        code: form.code,
        page: window.location.pathname + window.location.search,
      });
      setState("done");
      setTimeout(() => setOpen(false), 1800);
    } catch (err) {
      setState("error");
      setError(err.message);
    }
  };

  return (
    <>
      <button className="bug-fab" onClick={openForm} title="Report a bug">
        report a bug
      </button>

      {open && (
        <div className="bug-overlay" onClick={() => setOpen(false)}>
          <div className="bug-modal" onClick={(e) => e.stopPropagation()}>
            <button className="bug-close" onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>

            {state === "done" ? (
              <div className="bug-thanks">
                <h3>Thanks!</h3>
                <p>Your report was sent. I’ll look into it.</p>
              </div>
            ) : (
              <form onSubmit={send}>
                <h3>Report a bug</h3>
                <p className="bug-sub">
                  Tell me what went wrong — no email needed. The page and any pasted code are
                  attached automatically.
                </p>

                <label className="bug-label">
                  What happened? <span className="bug-req">*</span>
                </label>
                <textarea
                  className="bug-input"
                  rows={4}
                  required
                  value={form.message}
                  onChange={set("message")}
                  placeholder="e.g. The compile button did nothing on the Playground tab…"
                />

                <label className="bug-label">Code (optional)</label>
                <textarea
                  className="bug-input bug-code"
                  rows={4}
                  value={form.code}
                  onChange={set("code")}
                  placeholder="Paste the code that caused it, if relevant…"
                  spellCheck={false}
                />

                <label className="bug-label">Email or username (optional)</label>
                <input
                  className="bug-input"
                  type="text"
                  value={form.contact}
                  onChange={set("contact")}
                  placeholder="only if you want a reply"
                />

                {state === "error" && <p className="bug-error">{error}</p>}

                <div className="bug-actions">
                  <button type="button" className="ghost" onClick={() => setOpen(false)}>
                    cancel
                  </button>
                  <button type="submit" className="primary" disabled={state === "sending"}>
                    {state === "sending" ? "sending…" : "send report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
