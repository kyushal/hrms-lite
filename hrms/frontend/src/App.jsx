import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import "./index.css";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "employees", label: "Employees", icon: "◈" },
  { id: "attendance", label: "Attendance", icon: "◉" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">HR</span>
          <span className="brand-name">HRMS<em>Lite</em></span>
        </div>
        <nav>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="admin-badge">
            <span className="admin-dot" />
            Admin
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1 className="page-title">
              {NAV.find((n) => n.id === page)?.label}
            </h1>
            <p className="page-sub">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        </header>

        <div className="page-body">
          {page === "dashboard" && <Dashboard onNavigate={setPage} />}
          {page === "employees" && <Employees />}
          {page === "attendance" && <Attendance />}
        </div>
      </main>
    </div>
  );
}
