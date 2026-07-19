from fastapi import HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from config import settings
from database import SessionLocal
from models import AuthUser, Role

security = HTTPBearer(auto_error=False)


def get_db_session() -> Session:
    db = SessionLocal()
    try:
        return db
    except Exception:
        db.close()
        raise


async def require_role(allowed_roles: set[str]):
    def dependency(request: Request):
        credentials = request.headers.get("Authorization")
        if not credentials or not credentials.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing token")

        token = credentials.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except JWTError as exc:
            raise HTTPException(status_code=401, detail="Invalid token") from exc

        db = SessionLocal()
        try:
            user = db.query(AuthUser).filter(AuthUser.id == int(payload.get("sub"))).first()
            role = db.query(Role).filter(Role.id == user.role_id).first() if user else None
        finally:
            db.close()

        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User is not active")
        if not role or role.slug not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return payload

    return dependency
