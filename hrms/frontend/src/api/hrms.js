const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Something went wrong");
  }
  return data;
}

// Employees
export const getEmployees = () => request("/employees");
export const createEmployee = (body) =>
  request("/employees", { method: "POST", body: JSON.stringify(body) });
export const deleteEmployee = (employee_id) =>
  request(`/employees/${employee_id}`, { method: "DELETE" });

// Attendance
export const getAttendance = (employee_id) =>
  request(`/attendance${employee_id ? `?employee_id=${employee_id}` : ""}`);
export const markAttendance = (body) =>
  request("/attendance", { method: "POST", body: JSON.stringify(body) });
export const getAttendanceSummary = (employee_id) =>
  request(`/attendance/${employee_id}/summary`);

// Dashboard
export const getDashboardSummary = () => request("/dashboard/summary");
