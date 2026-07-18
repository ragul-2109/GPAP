from datetime import datetime
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    college_code: str
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    college_code: str
    full_name: str


class UserProfile(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    college_code: str
    created_at: datetime
