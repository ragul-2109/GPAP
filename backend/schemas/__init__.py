from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: Optional[str] = None
    register_number: Optional[str] = None
    username: Optional[str] = None
    password: str
    role: Optional[str] = None
    college_code: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    role: str
    role_name: str
    college_code: Optional[str] = None
    full_name: str
    must_change_password: bool = False


class UserProfile(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    college_code: Optional[str] = None
    created_at: datetime
    must_change_password: bool = False
