import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBugs, deleteBug, markAllRead } from "../api.js";

const KEY_STORE = "ppl-admin-key";

function formatWhen(iso) {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `today ${time}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + time;
}

export default function Admin() {
  const [key, setKey] = useState(() => localStorage.getItem(KEY_STORE) || "");
  const [keyInput, setKeyInput] = useState("");
  const [bugs, setBugs] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null); // expand a report's code

  const load = async (k) => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchBugs(k);
      setBugs(list);
      localStorage.setItem(KEY_STORE, k);
      setKey(k);
    } catch (err) {
      setError(err.message);
      setBugs(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unlock = (e) => {
    e.preventDefault();
    if (keyInput.trim()) load(keyInput.trim());
  };

  const remove = async (id) => {
    setBugs((b) => b.filter((x) => x.id !== id));
    try {
      await deleteBug(id, key);
    } catch {
      load(key);
    }
  };

  const readAll = async () => {
    setBugs((b) => b.map((x) => ({ ...x, read: true })));
    try {
      await markAllRead(key);
    } catch {
      load(key);
    }
  };

  const lock = () => {
    localStorage.removeItem(KEY_STORE);
    setKey("");
    setKeyInput("");
    setBugs(null);
  };

  const unread = bugs ? bugs.filter((b) => !b.read).length : 0;
  const withContact = bugs ? bugs.filter((b) => b.contact).length : 0;

  return (
    <div className="admin-app">
      {/* private header — no public tabs */}
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <div className="brand">
            <span className="brand-mark">{"$>"}</span>
            <span className="brand-name">PPL Code Lab</span>
            <span className="admin-badge">admin</span>
          </div>
          <nav className="admin-nav">
            <Link to="/" className="tab">
              ← view site
            </Link>
          </nav>
        </div>
      </header>

      <main className="admin-page">
        <h1 className="page-title">Bug Reports</h1>
        <p className="page-sub">
          Private console — reports submitted via the “report a bug” button land here. Nothing is
          emailed; everything is stored on this server.
        </p>

        {!key ? (
          <div className="admin-lock">
            <form className="admin-unlock" onSubmit={unlock}>
              <label className="bug-label">Admin key</label>
              <input
                className="bug-input"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="default: ppl-admin"
                autoFocus
              />
              {error && <p className="bug-error">{error}</p>}
              <div className="bug-actions">
                <button type="submit" className="primary">
                  unlock
                </button>
              </div>
              <p className="admin-hint">
                Default key is <code>ppl-admin</code> — change it in <code>server/index.js</code>.
              </p>
            </form>
          </div>
        ) : (
          <div>
            <div className="admin-bar">
              <span className="admin-count">
                {bugs ? `${bugs.length} report${bugs.length === 1 ? "" : "s"}` : "…"}
                {unread > 0 && <span className="admin-unread">{unread} new</span>}
              </span>
              <button className="ghost" onClick={() => load(key)} disabled={loading}>
                {loading ? "loading…" : "refresh"}
              </button>
              {unread > 0 && (
                <button className="ghost" onClick={readAll}>
                  mark all read
                </button>
              )}
              <button className="ghost" onClick={lock}>
                lock
              </button>
            </div>

            {bugs && bugs.length > 0 && (
              <p className="admin-summary">
                {withContact} with contact · {bugs.length - withContact} anonymous
              </p>
            )}

            {error && <p className="bug-error">{error}</p>}
            {!bugs && !error && <p className="page-sub">Loading…</p>}

            {bugs && bugs.length === 0 && (
              <div className="admin-empty">
                <div className="admin-empty-mark">{"$>"}</div>
                <p>No reports yet.</p>
                <p className="admin-hint">
                  Use the “report a bug” button on the site to send a test report — it will show up
                  here instantly.
                </p>
              </div>
            )}

            {bugs &&
              bugs.map((b) => (
                <div className={"card bug-card" + (b.read ? "" : " unread")} key={b.id}>
                  <div className="bug-card-head">
                    <span className="bug-date">
                      {formatWhen(b.createdAt)}
                      {!b.read && <span className="admin-unread">new</span>}
                    </span>
                    <button className="ghost tiny" onClick={() => remove(b.id)}>
                      delete
                    </button>
                  </div>

                  <p className="bug-message">{b.message}</p>

                  {b.code && (
                    <>
                      <button
                        className="ghost tiny bug-toggle"
                        onClick={() => setOpenId(openId === b.id ? null : b.id)}
                      >
                        {openId === b.id ? "hide code" : "show code"}
                      </button>
                      {openId === b.id && <pre className="bug-snippet">{b.code}</pre>}
                    </>
                  )}

                  <p className="bug-meta">
                    page: <code>{b.page || "—"}</code>
                    {b.contact && (
                      <>
                        {"  ·  "}contact: <code>{b.contact}</code>
                      </>
                    )}
                  </p>
                  {b.userAgent && <p className="bug-agent">{b.userAgent}</p>}
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
