import { useEffect, useState } from "react";
import { getEmployees, getAttendance, markAttendance, getAttendanceSummary } from "../api/hrms";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), status: "Present" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    getEmployees().then(setEmployees).catch(() => setError("Failed to load employees"));
  }, []);

  const loadRecords = (empId) => {
    if (!empId) { setRecords([]); setSummary(null); return; }
    setLoading(true);
    setError("");
    Promise.all([getAttendance(empId), getAttendanceSummary(empId)])
      .then(([r, s]) => { setRecords(r); setSummary(s); })
      .catch(() => setError("Failed to load attendance"))
      .finally(() => setLoading(false));
  };

  const handleEmpChange = (e) => {
    setSelectedEmp(e.target.value);
    loadRecords(e.target.value);
  };

  const handleMark = async () => {
    setFormError("");
    if (!selectedEmp) return setFormError("Select an employee first");
    if (!form.date) return setFormError("Date is required");
    setSubmitting(true);
    try {
      await markAttendance({ employee_id: selectedEmp, date: form.date, status: form.status });
      setShowModal(false);
      loadRecords(selectedEmp);
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <div className="section-header">
          <span className="section-title">Attendance Records</span>
          <button
            className="btn btn-primary"
            onClick={() => { setFormError(""); setShowModal(true); }}
          >
            + Mark Attendance
          </button>
        </div>

        <div className="emp-select-row">
          <label>Filter by Employee</label>
          <select value={selectedEmp} onChange={handleEmpChange}>
            <option value="">— Select employee —</option>
            {employees.map((e) => (
              <option key={e.id} value={e.employee_id}>
                {e.employee_id} — {e.full_name}
              </option>
            ))}
          </select>
        </div>

        {!selectedEmp ? (
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-text">Select an employee to view attendance</div>
          </div>
        ) : loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◉</div>
            <div className="empty-text">No attendance records yet</div>
            <div className="empty-sub">Mark attendance for this employee</div>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Day</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const d = new Date(r.date + "T00:00:00");
                    return (
                      <tr key={r.id}>
                        <td>{d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                        <td style={{ color: "var(--text3)" }}>{d.toLocaleDateString("en-IN", { weekday: "long" })}</td>
                        <td>
                          <span className={`badge ${r.status === "Present" ? "badge-green" : "badge-red"}`}>
                            {r.status === "Present" ? "✓" : "✗"} {r.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {summary && (
              <div className="summary-row">
                <div className="summary-pill">
                  <div className="val">{summary.total_days}</div>
                  <div className="lbl">Total Days</div>
                </div>
                <div className="summary-pill">
                  <div className="val val-green">{summary.present}</div>
                  <div className="lbl">Present</div>
                </div>
                <div className="summary-pill">
                  <div className="val val-red">{summary.absent}</div>
                  <div className="lbl">Absent</div>
                </div>
                <div className="summary-pill">
                  <div className="val" style={{ color: "var(--accent)" }}>
                    {summary.total_days > 0 ? Math.round((summary.present / summary.total_days) * 100) : 0}%
                  </div>
                  <div className="lbl">Attendance Rate</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-title">Mark Attendance</div>
            {formError && <div className="error-banner">{formError}</div>}
            <div className="form-grid">
              <div className="form-group full">
                <label>Employee</label>
                <select
                  value={selectedEmp}
                  onChange={(e) => setSelectedEmp(e.target.value)}
                >
                  <option value="">— Select employee —</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.employee_id}>
                      {e.employee_id} — {e.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleMark} disabled={submitting}>
                {submitting ? "Saving…" : "Mark Attendance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
