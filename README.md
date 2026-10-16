# PPL Code Lab

A minimal, terminal-styled website for the PPL lab — list every program practiced in the lab,
read them with their logic/concept/workflow, and **compile & run C/C++ code right in the
browser**.

## Tabs

1. **Lab Sessions** — pick a session, see the overview of codes, click one to autoscroll to its
   block. Each block has the question, an editable (prefilled) code box with a *compile & run*
   button, a stdin box and a mini terminal showing compiler messages and output.
2. **Playground** — a full empty code box + terminal. Write any C/C++ program and run it
   (`Ctrl+Enter` also runs). C / C++ toggle.
3. **Code Reader** — all codes per session, read-only, each with **logic**, **concept** and
   **workflow** notes and an *open in playground* button that loads the code there.
4. **About** — about you and the application (edit `client/src/pages/About.jsx`).

## Tech

- **Frontend:** React 18 + React Router + Vite, hand-rolled minimal CSS (flexbox), custom
  syntax-highlighted editor overlay.
- **Backend:** Node.js + Express. `POST /api/compile` writes the code to a temp file, compiles
  with `gcc`/`g++`, runs the binary with your stdin (6 s limit, 200 KB output cap), returns the
  compiler messages + output, then deletes the temp folder.
- **Compiler:** needs `gcc` and `g++` on the PATH (MinGW on Windows). Check with
  `GET /api/status`.

## Run it

```powershell
# terminal 1 — server on http://localhost:5000
cd server
npm install
npm run dev

# terminal 2 — client on http://localhost:5173
cd client
npm install
npm run dev
```

Or, from the project root (runs both together):

```powershell
npm install
npm run dev
```

Open http://localhost:5173.

### Single-port production build

```powershell
npm run build     # builds client/dist
npm start         # Express serves the API + the built site on http://localhost:5000
```

## Add your own sessions / codes

Edit `client/src/data/sessions.js`. Each item needs:

```js
{
  id: "s1q1",            // unique
  title: "Hello with user input",
  question: "Write a C program to …",
  sampleInput: "Alex",   // optional, prefills stdin
  code: `#include <stdio.h> … `,
  logic: "…",
  concept: "…",
  workflow: "…",
}
```

Sessions appear automatically in both the Lab Sessions and Code Reader tabs.

## Safety notes

- Every compile/run happens in a fresh temp folder that is deleted afterwards.
- Programs are killed after 6 seconds (infinite loops can't hang the server).
- The server is for **local / lab use**. If you expose it publicly, add authentication and run
  the compiler inside a sandbox (Docker) — compiling arbitrary code on a bare server is not safe
  on the open internet.
