from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import models, schemas, crud
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Employees ───────────────────────────────────────────────────────────────

@app.get("/employees", response_model=List[schemas.EmployeeOut])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)


@app.post("/employees", response_model=schemas.EmployeeOut, status_code=201)
def create_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    if crud.get_employee_by_emp_id(db, emp.employee_id):
        raise HTTPException(status_code=409, detail="Employee ID already exists")
    if crud.get_employee_by_email(db, emp.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    return crud.create_employee(db, emp)


@app.get("/employees/{employee_id}", response_model=schemas.EmployeeOut)
def get_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp


@app.delete("/employees/{employee_id}", status_code=204)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    crud.delete_employee(db, emp)


# ─── Attendance ───────────────────────────────────────────────────────────────

@app.get("/attendance", response_model=List[schemas.AttendanceOut])
def list_attendance(employee_id: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.get_attendance(db, employee_id)


@app.post("/attendance", response_model=schemas.AttendanceOut, status_code=201)
def mark_attendance(att: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, att.employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    existing = crud.get_attendance_by_date(db, att.employee_id, att.date)
    if existing:
        raise HTTPException(status_code=409, detail="Attendance already marked for this date")
    return crud.create_attendance(db, att)


@app.get("/attendance/{employee_id}/summary")
def attendance_summary(employee_id: str, db: Session = Depends(get_db)):
    emp = crud.get_employee_by_emp_id(db, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    records = crud.get_attendance(db, employee_id)
    total = len(records)
    present = sum(1 for r in records if r.status == "Present")
    absent = total - present
    return {"employee_id": employee_id, "total_days": total, "present": present, "absent": absent}


@app.get("/dashboard/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    employees = crud.get_employees(db)
    attendance = crud.get_attendance(db)
    today = date.today()
    today_records = [a for a in attendance if a.date == today]
    present_today = sum(1 for r in today_records if r.status == "Present")
    return {
        "total_employees": len(employees),
        "present_today": present_today,
        "absent_today": len(today_records) - present_today,
        "marked_today": len(today_records),
    }
