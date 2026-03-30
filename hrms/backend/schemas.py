from pydantic import BaseModel, EmailStr, field_validator
from datetime import date
from typing import Literal


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator("employee_id", "full_name", "department")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be blank")
        return v.strip()


class EmployeeOut(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    model_config = {"from_attributes": True}


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: Literal["Present", "Absent"]


class AttendanceOut(BaseModel):
    id: int
    employee_id: str
    date: date
    status: str

    model_config = {"from_attributes": True}
