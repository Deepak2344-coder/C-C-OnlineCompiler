import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getServerStatus } from "../api.js";
import { useRunner } from "../hooks/useRunner.js";
import CodeEditor from "../components/CodeEditor.jsx";
import Terminal from "../components/Terminal.jsx";

const STARTER_C = `#include <stdio.h>

int main() {
    printf("Hello, PPL lab!\\n");
    return 0;
}
`;

const STARTER_CPP = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, PPL lab!" << endl;
    return 0;
}
`;

export default function Playground() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code");
  const initialLang = searchParams.get("lang") === "cpp" ? "cpp" : "c";

  const [language, setLanguage] = useState(initialLang);
  const [code, setCode] = useState(initialCode || (initialLang === "cpp" ? STARTER_CPP : STARTER_C));
  const [compilers, setCompilers] = useState(null);

  const { state, run, sendInput, stop, running } = useRunner();

  useEffect(() => {
    getServerStatus()
      .then(setCompilers)
      .catch(() => setCompilers({ gcc: false, gcpp: false }));
  }, []);

  const missing =
    compilers && ((language === "c" && !compilers.gcc) || (language === "cpp" && !compilers.gcpp));

  const runCode = () => run(code, language);

  const switchLang = (lang) => {
    setLanguage(lang);
    // Replace starter templates only if the box still holds one of them.
    if (code === STARTER_C || code === STARTER_CPP || code.trim() === "") {
      setCode(lang === "cpp" ? STARTER_CPP : STARTER_C);
    }
  };

  return (
    <div>
      <h1 className="page-title">Playground</h1>
      <p className="page-sub">
        A blank canvas — write any C or C++ program, hit run, and answer its prompts directly in
        the terminal. <span className="hint">tip: Ctrl+Enter runs the code</span>
      </p>

      <div className="toolbar">
        <div className="seg">
          <button className={language === "c" ? "active" : ""} onClick={() => switchLang("c")}>
            C
          </button>
          <button className={language === "cpp" ? "active" : ""} onClick={() => switchLang("cpp")}>
            C++
          </button>
        </div>
        <button className="primary" disabled={state.status === "compiling" || running} onClick={runCode}>
          {state.status === "compiling" ? "compiling…" : running ? "running…" : "▶ compile & run"}
        </button>
        <button
          className="ghost"
          onClick={() => {
            stop();
            setCode(language === "cpp" ? STARTER_CPP : STARTER_C);
          }}
        >
          clear
        </button>
        <span className="hint">compiled with {language === "cpp" ? "g++" : "gcc"}</span>
      </div>

      {missing && (
        <div className="banner">
          {language === "cpp" ? "g++" : "gcc"} was not found on the server. Install MinGW (Windows)
          or gcc (Linux/macOS) and make sure it is on the PATH, then restart the server.
        </div>
      )}

      <CodeEditor
        value={code}
        onChange={setCode}
        rows={18}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            runCode();
          }
        }}
      />

      <div className="actions">
        <span className="hint">
          the program's input is typed into the terminal — no separate input box
        </span>
      </div>

      <Terminal state={state} onInput={sendInput} onStop={stop} />
    </div>
  );
}
