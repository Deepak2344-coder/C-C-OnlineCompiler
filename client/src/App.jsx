import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import LabSessions from "./pages/LabSessions.jsx";
import Playground from "./pages/Playground.jsx";
import CodeReader from "./pages/CodeReader.jsx";
import About from "./pages/About.jsx";
import Admin from "./pages/Admin.jsx";
import BugButton from "./components/BugButton.jsx";

const TABS = [
  { to: "/", label: "Lab Sessions", end: true },
  { to: "/playground", label: "Playground" },
  { to: "/reader", label: "Code Reader" },
  { to: "/about", label: "About" },
];

/* Public site layout — topbar + tabs + footer + bug button */
function PublicLayout() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark">{"$>"}</span>
            <span className="brand-name">PPL Code Lab</span>
          </div>
          <nav className="tabs">
            {TABS.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) => "tab" + (isActive ? " active" : "")}
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <footer className="footer">
        <span>PPL Code Lab — compile &amp; run C/C++ right in your browser</span>
        <span className="footer-sep">·</span>
        <NavLink to="/admin" className="footer-admin">
          admin
        </NavLink>
      </footer>

      <BugButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LabSessions />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/reader" element={<CodeReader />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* private admin — fully separate layout */}
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
