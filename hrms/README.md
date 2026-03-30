# HRMS Lite

A lightweight Human Resource Management System built with **FastAPI**, **PostgreSQL**, and **React**.

---

## 📸 Features

- **Employee Management** — Add, view, and delete employees
- **Attendance Management** — Mark daily attendance (Present / Absent) per employee
- **Dashboard Summary** — Live counts of total employees, present/absent today
- **Attendance Summary** — Total present days, absent days, and attendance rate per employee
- Clean dark-themed professional UI with loading, empty, and error states

---

## 🛠 Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18 + Vite               |
| Styling    | Plain CSS (custom design system) |
| Backend    | Python 3.11 + FastAPI         |
| Database   | PostgreSQL                    |
| ORM        | SQLAlchemy 2.0                |
| Validation | Pydantic v2                   |
| Frontend Deploy | Vercel                   |
| Backend Deploy  | Render                   |

---

## 📁 Project Structure

```
hrms/
├── backend/
│   ├── main.py          # FastAPI app & all routes
│   ├── models.py        # SQLAlchemy DB models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── crud.py          # Database operations
│   ├── database.py      # DB connection & session
│   ├── requirements.txt
│   └── Procfile         # For Render deployment
└── frontend/
    ├── src/
    │   ├── api/hrms.js      # API client (all fetch calls)
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Employees.jsx
    │   │   └── Attendance.jsx
    │   ├── App.jsx          # Layout + navigation
    │   ├── main.jsx
    │   └── index.css        # Full design system
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Running Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running locally

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
cd hrms-lite
```

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a PostgreSQL database
psql -U postgres -c "CREATE DATABASE hrms_lite;"

# Set the DATABASE_URL environment variable
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms_lite"
# Windows: set DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hrms_lite

# Run the server (tables are auto-created on startup)
uvicorn main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set the backend URL
cp .env.example .env.local
# Edit .env.local → VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🌐 Deployment

### Backend → Render

1. Push the `backend/` folder (or the whole repo) to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add a **PostgreSQL** database on Render and copy the **Internal Database URL**
5. Set environment variable:
   - `DATABASE_URL` → *(paste the Internal Database URL)*
6. Deploy — tables are auto-created on first boot

### Frontend → Vercel

1. Import the `frontend/` folder into [Vercel](https://vercel.com)
2. Set environment variable in Vercel dashboard:
   - `VITE_API_URL` → `https://your-render-backend.onrender.com`
3. Deploy

---

## 📡 API Endpoints

| Method | Endpoint                            | Description                        |
|--------|-------------------------------------|------------------------------------|
| GET    | `/employees`                        | List all employees                 |
| POST   | `/employees`                        | Create a new employee              |
| GET    | `/employees/{employee_id}`          | Get single employee                |
| DELETE | `/employees/{employee_id}`          | Delete employee (cascades attendance) |
| GET    | `/attendance`                       | List all attendance records        |
| GET    | `/attendance?employee_id=EMP001`    | Filter attendance by employee      |
| POST   | `/attendance`                       | Mark attendance                    |
| GET    | `/attendance/{employee_id}/summary` | Present/absent counts per employee |
| GET    | `/dashboard/summary`                | Today's dashboard stats            |

---

## ✅ Validations

- Employee ID must be unique
- Email must be valid format and unique
- All fields are required
- Duplicate attendance for same employee + date is rejected
- Deleting an employee cascades and removes all their attendance records
- Proper HTTP status codes: `201` Created, `204` No Content, `404` Not Found, `409` Conflict, `422` Validation Error

---

## 📝 Assumptions & Limitations

- Single admin user — no authentication or role management
- No pagination (suitable for small to medium datasets)
- Departments are a fixed predefined list in the frontend
- Leave management, payroll, and other HR features are out of scope
- Attendance can only be marked once per employee per date (no edits)
