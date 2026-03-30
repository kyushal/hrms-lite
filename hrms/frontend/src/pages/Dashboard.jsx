import { useEffect, useState } from "react";
import { getDashboardSummary, getEmployees } from "../api/hrms";

export default function Dashboard({ onNavigate }) {
  const [summary, setSummary] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getDashboardSummary(), getEmployees()])
      .then(([s, e]) => { setSummary(s); setEmployees(e); })
      .catch(() => setError("Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Employees</div>
          <div className="stat-value">{summary?.total_employees ?? 0}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Present Today</div>
          <div className="stat-value">{summary?.present_today ?? 0}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Absent Today</div>
          <div className="stat-value">{summary?.absent_today ?? 0}</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Marked Today</div>
          <div className="stat-value">{summary?.marked_today ?? 0}</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Recent Employees</span>
          <button className="btn btn-ghost" onClick={() => onNavigate("employees")}>View All →</button>
        </div>

        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-text">No employees yet</div>
            <div className="empty-sub">Add your first employee to get started</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 6).map((e) => (
                  <tr key={e.id}>
                    <td><span className="badge badge-blue">{e.employee_id}</span></td>
                    <td>{e.full_name}</td>
                    <td><span className="dept-chip">{e.department}</span></td>
                    <td>{e.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
