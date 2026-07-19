import csv
import io
import re
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from database import get_db
from models import AuthUser, College, CollegeAdmin, Role, StaffMember, StudentRecord
from passlib.context import CryptContext

router = APIRouter(prefix="/api/super-admin", tags=["super-admin"])
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
DEFAULT_IMPORT_PASSWORD = "Welcome@123"
LEGACY_IMPORT_PASSWORDS = {"Welcome@123", "Welcom@123"}


def _get_csv_value(row: dict, *candidate_names: str) -> Optional[str]:
    for candidate in candidate_names:
        if candidate in row:
            return row.get(candidate)
    normalized_candidates = {name.strip().lower() for name in candidate_names if name}
    for key, value in row.items():
        if isinstance(key, str) and key.strip().lower() in normalized_candidates:
            return value
    return None


def _normalize_import_password(raw_password: Optional[str]) -> str:
    password = (raw_password or "").strip()
    if not password:
        return DEFAULT_IMPORT_PASSWORD
    if password in LEGACY_IMPORT_PASSWORDS:
        return DEFAULT_IMPORT_PASSWORD
    return password


def _valid_phone(phone: Optional[str]) -> bool:
    if not phone:
        return False
    return bool(re.fullmatch(r"[0-9+()\-\s]{7,15}", phone.strip()))


def _valid_date(value: Optional[str]) -> bool:
    if not value:
        return False
    try:
        datetime.strptime(value.strip(), "%Y-%m-%d")
        return True
    except ValueError:
        return False


def _get_super_admin_role(db: Session) -> Role:
    role = db.query(Role).filter(Role.slug == "super_admin").first()
    if not role:
        raise HTTPException(status_code=500, detail="Super admin role not configured")
    return role


def _get_or_create_college(db: Session, code: Optional[str], name: Optional[str]) -> College:
    college_code = (code or name or "GENFINIX").strip().upper()
    if not college_code:
        college_code = "GENFINIX"
    college = db.query(College).filter(College.code == college_code).first()
    if not college:
        college = College(code=college_code, name=(name or college_code).strip())
        db.add(college)
        db.flush()
    return college


def _ensure_unique_email(db: Session, email: str) -> None:
    if db.query(AuthUser).filter(AuthUser.email == email).first():
        raise HTTPException(status_code=400, detail=f"Email already exists: {email}")


def _generate_unique_username(db: Session, email: str) -> str:
    base = email.split("@", 1)[0]
    username = base
    suffix = 1
    while db.query(AuthUser).filter(AuthUser.username == username).first():
        username = f"{base}{suffix}"
        suffix += 1
    return username


@router.post("/bulk-import/staff", status_code=status.HTTP_200_OK)
def bulk_import_staff(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = file.file.read().decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    role = _get_super_admin_role(db)
    imported = 0
    failed = 0
    duplicate_employee_ids = 0
    duplicate_emails = 0
    validation_errors = []

    for row_index, row in enumerate(rows, start=1):
        employee_id = ( _get_csv_value(row, "employee_id", "Employee ID") or "").strip()
        full_name = (_get_csv_value(row, "full_name", "Full Name") or "").strip()
        email = (_get_csv_value(row, "email", "Email") or "").strip()
        phone_number = (_get_csv_value(row, "phone_number", "Phone Number") or "").strip()
        designation = (_get_csv_value(row, "designation", "Designation") or "").strip()
        department = (_get_csv_value(row, "department", "Department") or "").strip()
        specialization = (_get_csv_value(row, "specialization", "Specialization") or "").strip()
        qualification = (_get_csv_value(row, "qualification", "Qualification") or "").strip()
        years_of_experience = (_get_csv_value(row, "years_of_experience", "Years of Experience") or "").strip()
        joining_date = (_get_csv_value(row, "joining_date", "Joining Date") or "").strip()
        status = (_get_csv_value(row, "status", "Status") or "").strip()

        if not all([employee_id, full_name, email, phone_number, designation, department, specialization, qualification, years_of_experience, joining_date, status]):
            failed += 1
            validation_errors.append({"row": row_index, "error": "Required fields cannot be empty"})
            continue

        if db.query(StaffMember).filter(StaffMember.employee_id == employee_id).first():
            duplicate_employee_ids += 1
            failed += 1
            validation_errors.append({"row": row_index, "error": f"Duplicate employee ID: {employee_id}"})
            continue

        if db.query(AuthUser).filter(AuthUser.email == email).first():
            duplicate_emails += 1
            failed += 1
            validation_errors.append({"row": row_index, "error": f"Duplicate email: {email}"})
            continue

        if not _valid_phone(phone_number):
            failed += 1
            validation_errors.append({"row": row_index, "error": "Phone number is invalid"})
            continue

        if not _valid_date(joining_date):
            failed += 1
            validation_errors.append({"row": row_index, "error": "Joining date must be YYYY-MM-DD"})
            continue

        if status not in {"Active", "Inactive"}:
            failed += 1
            validation_errors.append({"row": row_index, "error": "Status must be Active or Inactive"})
            continue

        college = _get_or_create_college(db, _get_csv_value(row, "college_code", "College Code"), _get_csv_value(row, "college_name", "College Name"))
        password = DEFAULT_IMPORT_PASSWORD
        user = AuthUser(
            full_name=full_name,
            email=email,
            username=email.split("@", 1)[0],
            password_hash=pwd_context.hash(password),
            role_id=role.id,
            college_id=college.id,
            must_change_password=True,
        )
        db.add(user)
        db.flush()
        db.add(StaffMember(
            user_id=user.id,
            college_id=college.id,
            employee_id=employee_id,
            department=department,
            title=designation,
            is_active=status == "Active",
        ))
        imported += 1

    db.commit()
    return {
        "total_rows": len(rows),
        "imported": imported,
        "failed": failed,
        "duplicate_employee_ids": duplicate_employee_ids,
        "duplicate_emails": duplicate_emails,
        "validation_errors": validation_errors,
        "message": "Staff accounts imported successfully",
    }


@router.post("/bulk-import/students", status_code=status.HTTP_200_OK)
def bulk_import_students(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = file.file.read().decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(content))
    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV file is empty")

    role = db.query(Role).filter(Role.slug == "student").first()
    if not role:
        raise HTTPException(status_code=500, detail="Student role not configured")

    total_rows = len(rows)
    imported = 0
    failed = 0
    duplicate_emails = 0
    duplicate_register_numbers = 0
    missing_required_fields = 0
    row_errors = []

    for row_index, row in enumerate(rows, start=1):
        full_name = (_get_csv_value(row, "full_name", "Full Name") or "").strip()
        email = (_get_csv_value(row, "email", "Email") or "").strip()
        register_number = (_get_csv_value(row, "roll_number", "roll_number", "register_number", "Register Number") or "").strip()
        college_code = (_get_csv_value(row, "college_code", "College Code") or "").strip()
        college_name = (_get_csv_value(row, "college_name", "College Name") or "").strip()

        if not full_name or not email or not register_number or not (college_code or college_name):
            missing_required_fields += 1
            failed += 1
            row_errors.append({"row": row_index, "error": "Missing required fields"})
            continue

        if db.query(AuthUser).filter(AuthUser.email == email).first():
            duplicate_emails += 1
            failed += 1
            row_errors.append({"row": row_index, "error": f"Duplicate email: {email}"})
            continue

        if db.query(StudentRecord).filter(StudentRecord.register_number == register_number).first():
            duplicate_register_numbers += 1
            failed += 1
            row_errors.append({"row": row_index, "error": f"Duplicate register number: {register_number}"})
            continue

        try:
            college = _get_or_create_college(db, college_code, college_name)
        except HTTPException as exc:
            missing_required_fields += 1
            failed += 1
            row_errors.append({"row": row_index, "error": exc.detail})
            continue

        username = _generate_unique_username(db, email)
        default_password = _normalize_import_password(_get_csv_value(row, "password", "Password"))
        if not default_password:
            default_password = DEFAULT_IMPORT_PASSWORD
        user = AuthUser(
            full_name=full_name,
            email=email,
            username=username,
            password_hash=pwd_context.hash(default_password),
            role_id=role.id,
            college_id=college.id,
            register_number=register_number,
            must_change_password=True,
        )
        db.add(user)
        db.flush()
        db.add(StudentRecord(
            user_id=user.id,
            college_id=college.id,
            register_number=register_number,
            department=_get_csv_value(row, "department", "Department") or "General",
            batch_year=_get_csv_value(row, "batch_year", "Batch Year") or "2025",
            section=_get_csv_value(row, "section", "Section") or "A",
        ))
        imported += 1

    db.commit()
    return {
        "total_rows": total_rows,
        "imported": imported,
        "failed": failed,
        "duplicate_emails": duplicate_emails,
        "duplicate_register_numbers": duplicate_register_numbers,
        "missing_required_fields": missing_required_fields,
        "errors": row_errors,
        "message": "Student bulk import completed",
    }
