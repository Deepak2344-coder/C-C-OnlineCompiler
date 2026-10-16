import { useMemo, useState } from "react";
import { sessions } from "../data/sessions.js";
import { useRunner } from "../hooks/useRunner.js";
import CodeEditor from "../components/CodeEditor.jsx";
import Terminal from "../components/Terminal.jsx";

function CodeBlock({ item, index, code, onCodeChange, onReset }) {
  const { state, run, sendInput, stop, running } = useRunner();

  const runCode = () => run(code, item.lang || "c");

  return (
    <section className="code-block" id={`block-${item.id}`}>
      <div className="block-head">
        <span className="block-index">{String(index + 1).padStart(2, "0")}</span>
        <h3>{item.title}</h3>
        <button className="ghost" onClick={onReset} title="Restore original code">
          reset
        </button>
      </div>

      <p className="question">{item.question}</p>
      {item.sampleInput && (
        <span className="sample">sample input: {item.sampleInput.replace(/\n/g, " ⏎ ")}</span>
      )}

      <CodeEditor
        value={code}
        onChange={onCodeChange}
        rows={12}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            runCode();
          }
        }}
      />

      <div className="actions">
        <button className="primary" disabled={state.status === "compiling" || running} onClick={runCode}>
          {state.status === "compiling" ? "compiling…" : running ? "running…" : "▶ compile & run"}
        </button>
        <span className="hint">type the program's input straight into the terminal below</span>
      </div>

      <Terminal state={state} onInput={sendInput} onStop={stop} />
    </section>
  );
}

export default function LabSessions() {
  const [activeSession, setActiveSession] = useState(sessions[0].id);
  const session = useMemo(() => sessions.find((s) => s.id === activeSession), [activeSession]);

  const [edits, setEdits] = useState({}); // itemId -> edited code

  const scrollTo = (id) => {
    document.getElementById(`block-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setCode = (item, code) => setEdits((e) => ({ ...e, [item.id]: code }));

  const resetCode = (item) =>
    setEdits((e) => {
      const next = { ...e };
      delete next[item.id];
      return next;
    });

  return (
    <div>
      <h1 className="page-title">Lab Sessions</h1>
      <p className="page-sub">
        Pick a session, read the overview, click a code to jump straight to it — edit, compile and
        type input in the terminal while your program runs.
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
            <button key={item.id} className="overview-item" onClick={() => scrollTo(item.id)}>
              <span className="ov-index">{i + 1}</span>
              {item.title}
            </button>
          ))}
        </div>
      </section>

      {session.items.map((item, i) => (
        <CodeBlock
          key={item.id}
          item={item}
          index={i}
          code={edits[item.id] ?? item.code}
          onCodeChange={(code) => setCode(item, code)}
          onReset={() => resetCode(item)}
        />
      ))}
    </div>
  );
}
