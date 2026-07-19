from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from routes.auth import get_current_user
from schemas import UserProfile

router = APIRouter(prefix="/api/staff", tags=["staff"])
security = HTTPBearer(auto_error=False)


@router.get("/")
def get_staff():
    return {
        "staff": [
            {
                "id": "RS",
                "name": "Robert Smith",
                "role": "Senior Technical Trainer",
                "skills": ["Java", "DSA"],
                "assignment": "Genfinix Institute",
                "rating": 4.8,
                "status": "Active"
            },
            {
                "id": "EM",
                "name": "Emily Martinez",
                "role": "Aptitude Specialist",
                "skills": ["Quant", "Logical"],
                "assignment": "Multiple (2)",
                "rating": 4.9,
                "status": "Active",
                "color": "#10b981"
            },
            {
                "id": "AL",
                "name": "Aaron Lee",
                "role": "Account Manager",
                "skills": ["Sales", "Onboarding"],
                "assignment": "None (Leave)",
                "rating": "5 Colleges",
                "status": "On Leave",
                "color": "#f59e0b"
            }
        ]
    }


@router.post("/assignments", status_code=status.HTTP_200_OK)
def manage_staff_assignment(
    payload: dict,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Super Admin can manage Genfinix staff assignments",
        )

    return {"message": "Staff assignment updated", "payload": payload}
