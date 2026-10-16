import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessions } from "../data/sessions.js";
import CodeEditor from "../components/CodeEditor.jsx";

export default function CodeReader() {
  const [activeSession, setActiveSession] = useState(sessions[0].id);
  const session = sessions.find((s) => s.id === activeSession);
  const navigate = useNavigate();

  const openInPlayground = (item) => {
    navigate(`/playground?lang=${item.lang || "c"}&code=${encodeURIComponent(item.code)}`);
  };

  return (
    <div>
      <h1 className="page-title">Code Reader</h1>
      <p className="page-sub">
        Read-only archive of every code, grouped by session — with the logic, concept and workflow
        behind each one.
      </p>

      <div className="chips">
        {sessions.map((s) => (
          <button
            key={s.id}
            className={"chip" + (s.id === activeSession ? " active" : "")}
            onClick={() => setActiveSession(s.id)}
          >
            {s.name.split("—")[0].trim()}
          </button>
        ))}
      </div>

      <section className="session-head">
        <h2>{session.name}</h2>
        <p className="page-sub">{session.description}</p>
        <div className="overview">
          <span className="overview-label">codes in this session —</span>
          {session.items.map((item, i) => (
            <a
              key={item.id}
              className="overview-item"
              href={`#read-${item.id}`}
            >
              <span className="ov-index">{i + 1}</span>
              {item.title}
            </a>
          ))}
        </div>
      </section>

      {session.items.map((item, i) => (
        <section className="code-block" id={`read-${item.id}`} key={item.id}>
          <div className="block-head">
            <span className="block-index">{String(i + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
          </div>

          <p className="question">{item.question}</p>

          <CodeEditor value={item.code} readOnly rows={12} />

          <div className="cards">
            <div className="card">
              <h4>logic</h4>
              <p>{item.logic}</p>
            </div>
            <div className="card">
              <h4>concept</h4>
              <p>{item.concept}</p>
            </div>
            <div className="card">
              <h4>workflow</h4>
              <p>{item.workflow}</p>
            </div>
          </div>

          <div className="actions">
            <button className="primary" onClick={() => openInPlayground(item)}>
              open in playground →
            </button>
            {item.sampleInput && <span className="hint">sample input: {item.sampleInput.replace(/\n/g, " ⏎ ")}</span>}
          </div>
        </section>
      ))}
    </div>
  );
}
