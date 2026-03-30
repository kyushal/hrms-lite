from sqlalchemy.orm import Session
from datetime import date
import models, schemas


def get_employees(db: Session):
    return db.query(models.Employee).all()


def get_employee_by_emp_id(db: Session, employee_id: str):
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()


def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()


def create_employee(db: Session, emp: schemas.EmployeeCreate):
    db_emp = models.Employee(**emp.model_dump())
    db.add(db_emp)
    db.commit()
    db.refresh(db_emp)
    return db_emp


def delete_employee(db: Session, emp: models.Employee):
    db.delete(emp)
    db.commit()


def get_attendance(db: Session, employee_id: str = None):
    q = db.query(models.Attendance)
    if employee_id:
        q = q.filter(models.Attendance.employee_id == employee_id)
    return q.order_by(models.Attendance.date.desc()).all()


def get_attendance_by_date(db: Session, employee_id: str, att_date: date):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id,
        models.Attendance.date == att_date
    ).first()


def create_attendance(db: Session, att: schemas.AttendanceCreate):
    db_att = models.Attendance(**att.model_dump())
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return db_att
