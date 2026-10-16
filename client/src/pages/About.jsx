export default function About() {
  return (
    <div>
      <h1 className="page-title">About</h1>

      <div className="cards">
        <div className="card wide">
          <h4>the developer</h4>
          <ul className="about-list">
            <li><span>name</span> Your Name</li>
            <li><span>course</span> B.E. / B.Tech — branch</li>
            <li><span>lab</span> Programming Problem Solving (PPL) Lab</li>
            <li><span>email</span> you@example.com</li>
            <li><span>github</span> github.com/your-username</li>
          </ul>
          <p className="hint">edit these details in client/src/pages/About.jsx</p>
        </div>

        <div className="card wide">
          <h4>the application</h4>
          <p>
            A minimal, terminal-styled portfolio for the PPL lab. It lists every program practiced
            in the lab, grouped by session, and lets you compile and run C/C++ code directly in the
            browser — no local IDE needed.
          </p>
          <ul className="about-list">
            <li><span>lab sessions</span> session overview, click-to-jump code blocks with an editable code box and mini terminal</li>
            <li><span>playground</span> a blank editor + terminal for any C/C++ program, with stdin support</li>
            <li><span>code reader</span> read-only codes with logic, concept &amp; workflow notes, one click to the playground</li>
          </ul>
        </div>

        <div className="card">
          <h4>how it works</h4>
          <p>
            The React client sends your code to a small Node.js/Express server, which writes it to a
            temporary file, compiles it with <code>gcc</code>/<code>g++</code>, runs the binary with
            your stdin, and streams the compiler messages and output back into the terminal. Files
            are deleted after every run, with a 6-second limit so infinite loops can't hang the
            server.
          </p>
        </div>

        <div className="card">
          <h4>tech stack</h4>
          <ul className="about-list">
            <li><span>frontend</span> React 18, React Router, Vite</li>
            <li><span>backend</span> Node.js, Express, CORS</li>
            <li><span>compiler</span> GCC / G++ (MinGW on Windows)</li>
            <li><span>styling</span> hand-rolled CSS, flexbox, no frameworks</li>
            <li><span>editor</span> syntax-highlighted textarea overlay</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
