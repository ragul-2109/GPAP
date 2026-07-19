from datetime import datetime, timedelta, timezone
from typing import Optional
import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import AuthUser, College, CollegeAdmin, Role, StaffMember, StudentRecord
from schemas import ChangePasswordRequest, LoginRequest, LoginResponse, UserProfile

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


class TokenRefreshRequest(BaseModel):
    refresh_token: str


def create_token(user: AuthUser, role: Role, college_code: Optional[str] = None) -> tuple[str, str]:
    now = datetime.now(timezone.utc)
    access_payload = {
        "sub": str(user.id),
        "role": role.slug,
        "role_id": role.id,
        "college_code": college_code,
        "exp": now + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }
    refresh_payload = {
        "sub": str(user.id),
        "type": "refresh",
        "exp": now + timedelta(days=7),
    }
    access_token = jwt.encode(access_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return access_token, refresh_token


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if not payload.password:
        raise HTTPException(status_code=401, detail="Password is required")

    user: Optional[AuthUser] = None
    role: Optional[Role] = None
    college_code: Optional[str] = None

    if payload.email:
        user = db.query(AuthUser).filter(AuthUser.email == payload.email).first()
    elif payload.username:
        user = db.query(AuthUser).filter(AuthUser.username == payload.username).first()
    elif payload.register_number:
        student = db.query(StudentRecord).filter(StudentRecord.register_number == payload.register_number).first()
        if student:
            user = student.user
            college_code = student.college.code if student.college else None

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")

    role = db.query(Role).filter(Role.id == user.role_id).first()
    if not role:
        raise HTTPException(status_code=401, detail="Invalid role")

    is_valid = _verify_password(payload.password, user.password_hash)

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if role.slug == "college_admin":
        college_admin = db.query(CollegeAdmin).filter(CollegeAdmin.user_id == user.id).first()
        if not college_admin or not college_admin.is_active:
            raise HTTPException(status_code=403, detail="College admin account is not active")
        college_code = college_admin.college.code if college_admin.college else None
    elif role.slug == "staff":
        staff_record = db.query(StaffMember).filter(StaffMember.user_id == user.id).first()
        if not staff_record or not staff_record.is_active:
            raise HTTPException(status_code=403, detail="Staff account is not active")
        college_code = staff_record.college.code if staff_record.college else None
    elif role.slug == "student":
        student = db.query(StudentRecord).filter(StudentRecord.user_id == user.id).first()
        if not student or not student.is_active:
            raise HTTPException(status_code=403, detail="Student account is not active")
        college_code = student.college.code if student.college else None

    access_token, refresh_token = create_token(user, role, college_code)
    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        role=role.slug,
        role_name=role.name,
        college_code=college_code,
        full_name=user.full_name,
        must_change_password=user.must_change_password,
    )


@router.post("/refresh")
def refresh_token(payload: TokenRefreshRequest, db: Session = Depends(get_db)):
    try:
        decoded = jwt.decode(payload.refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid refresh token") from exc

    user = db.query(AuthUser).filter(AuthUser.id == int(decoded.get("sub"))).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    role = db.query(Role).filter(Role.id == user.role_id).first()
    if not role:
        raise HTTPException(status_code=401, detail="Invalid role")
    access_token, refresh_token = create_token(user, role)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.get("/me", response_model=UserProfile)
def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security), db: Session = Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user = db.query(AuthUser).filter(AuthUser.id == int(payload.get("sub"))).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found")
    role = db.query(Role).filter(Role.id == user.role_id).first()
    return UserProfile(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=role.slug if role else "unknown",
        college_code=payload.get("college_code"),
        created_at=user.created_at,
        must_change_password=user.must_change_password,
    )


def _validate_password_strength(password: str) -> bool:
    return bool(re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$", password))


def _verify_password(plain_password: str, stored_hash: str) -> bool:
    candidates = {plain_password}
    if plain_password in {"Welcome@123", "Welcom@123"}:
        candidates.update({"Welcome@123", "Welcom@123"})

    for candidate in candidates:
        try:
            if pwd_context.verify(candidate, stored_hash):
                return True
        except Exception:
            if candidate == stored_hash:
                return True
    return False


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        decoded = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user = db.query(AuthUser).filter(AuthUser.id == int(decoded.get("sub"))).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=404, detail="User not found")

    if not payload.current_password:
        raise HTTPException(status_code=400, detail="Current password is required")
    if not payload.new_password:
        raise HTTPException(status_code=400, detail="New password is required")
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirm password must match")
    if not _verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    if _verify_password(payload.new_password, user.password_hash):
        raise HTTPException(status_code=400, detail="New password must be different from the current password")
    if not _validate_password_strength(payload.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        )

    user.password_hash = pwd_context.hash(payload.new_password)
    user.must_change_password = False
    db.commit()

    return {"message": "Password changed successfully"}


@router.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(Role).filter(Role.is_active.is_(True)).all()
    return [{"code": role.slug, "title": role.name} for role in roles]
