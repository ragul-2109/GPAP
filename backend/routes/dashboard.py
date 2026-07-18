from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt

from config import settings

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
security = HTTPBearer(auto_error=False)


@router.get("/summary")
def get_summary(credentials: HTTPAuthorizationCredentials | None = Depends(security)):
    if not credentials:
        return {"message": "Please login to view the dashboard"}

    payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    role = payload.get("role")

    return {
        "role": role,
        "college_code": payload.get("college_code"),
        "stats": {
            "students": 184,
            "tests": 21,
            "placements": 37,
            "avg_score": 78,
        },
        "overview": [
            {"title": "Today's Classes", "value": 6},
            {"title": "Pending Assessments", "value": 4},
            {"title": "Placement Drive", "value": 2},
            {"title": "At Risk Students", "value": 9},
        ],
    }
