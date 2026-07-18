from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import College, User
from schemas import LoginRequest, LoginResponse, UserProfile
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)


def create_token(user: User, college_code: str) -> str:
    payload = {
        "sub": user.email,
        "role": user.role,
        "college_code": college_code,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid institute, email, or password"
        )

    try:
        is_valid_pwd = pwd_context.verify(payload.password, user.password)
    except Exception:
        # Fallback for plain-text passwords in the DB
        is_valid_pwd = (payload.password == user.password)

    if not is_valid_pwd:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid institute, email, or password"
        )
        
    # Optional: verify college code if the user is not super_admin and has a college assigned
    if user.role != "super_admin" and user.college:
        if user.college.code != payload.college_code:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid institute, email, or password"
            )

    token = create_token(user, payload.college_code)
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        role=user.role,
        college_code=payload.college_code,
        full_name=user.full_name,
    )


@router.get("/me", response_model=UserProfile)
def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security), db: Session = Depends(get_db)):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")

    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    email = payload.get("sub")
    college_code = payload.get("college_code")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserProfile(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        college_code=college_code,
        created_at=user.created_at,
    )


@router.get("/roles")
def get_roles():
    return [
        {"code": "super_admin", "title": "Super Admin"},
        {"code": "college_admin", "title": "College Admin"},
        {"code": "staff", "title": "Genfinix Staff"},
        {"code": "student", "title": "Student"},
    ]
