import { useEffect, useState } from "react";
import { getEmployees, createEmployee, deleteEmployee } from "../api/hrms";

const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations", "Legal"];

const EMPTY_FORM = { employee_id: "", full_name: "", email: "", department: "" };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = () => {
    setLoading(true);
    getEmployees()
      .then(setEmployees)
      .catch(() => setError("Failed to load employees"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async () => {
    setFormError("");
    const { employee_id, full_name, email, department } = form;
    if (!employee_id.trim() || !full_name.trim() || !email.trim() || !department) {
      return setFormError("All fields are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setFormError("Enter a valid email address");
    }
    setSubmitting(true);
    try {
      await createEmployee(form);
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(deleteTarget);
      setDeleteTarget(null);
      load();
    } catch (e) {
      setError(e.message);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <div className="section-header">
          <span className="section-title">All Employees</span>
          <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setFormError(""); setShowModal(true); }}>
            + Add Employee
          </button>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <div className="empty-text">No employees found</div>
            <div className="empty-sub">Click "Add Employee" to create the first record</div>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id}>
                    <td><span className="badge badge-blue">{e.employee_id}</span></td>
                    <td>{e.full_name}</td>
                    <td><span className="dept-chip">{e.department}</span></td>
                    <td>{e.email}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => setDeleteTarget(e.employee_id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Add New Employee</div>
            {formError && <div className="error-banner">{formError}</div>}
            <div className="form-grid">
              {[
                { key: "employee_id", label: "Employee ID", placeholder: "e.g. EMP001" },
                { key: "full_name", label: "Full Name", placeholder: "e.g. John Doe" },
                { key: "email", label: "Email Address", placeholder: "john@company.com", type: "email" },
              ].map(({ key, label, placeholder, type }) => (
                <div className="form-group" key={key}>
                  <label>{label}</label>
                  <input
                    type={type || "text"}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Department</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Saving…" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-title">Confirm Delete</div>
            <p style={{ color: "var(--text2)", fontSize: 14 }}>
              Are you sure you want to delete employee <strong style={{ color: "var(--text)" }}>{deleteTarget}</strong>?
              This will also remove all attendance records.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
