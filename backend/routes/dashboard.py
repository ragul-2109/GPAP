from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import func
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models import AuthUser, Role, Test, StudentResult
from scripts.reset_database import reset_database

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])
security = HTTPBearer(auto_error=False)


@router.post("/reset", status_code=status.HTTP_200_OK)
def reset_dashboard_data(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Please login to reset the dashboard data")

    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    if payload.get("role") not in {"super_admin", "college_admin", "staff"}:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = reset_database(seed=True)
    return result


@router.get("/summary")
def get_summary(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        return {"message": "Please login to view the dashboard"}

    try:
        payload = jwt.decode(credentials.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(AuthUser).filter(AuthUser.id == int(payload.get("sub"))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    role = payload.get("role")
    college_id = user.college_id

    student_role = db.query(Role).filter(Role.slug == "student").first()
    student_filter = db.query(AuthUser).filter(AuthUser.role_id == (student_role.id if student_role else 0))
    if role != "super_admin":
        student_filter = student_filter.filter(AuthUser.college_id == college_id)
    students = student_filter.count()

    tests_query = db.query(Test)
    results_query = db.query(StudentResult).join(Test, StudentResult.test_id == Test.id)
    if role != "super_admin":
        tests_query = tests_query.filter(Test.college_id == college_id)
        results_query = results_query.filter(Test.college_id == college_id)

    tests = tests_query.count()
    placements = results_query.filter(StudentResult.pass_fail == "Pass").count()
    avg_score = db.query(func.avg(StudentResult.marks)).join(Test, StudentResult.test_id == Test.id)
    if role != "super_admin":
        avg_score = avg_score.filter(Test.college_id == college_id)
    avg_score = round(float(avg_score.scalar() or 0), 1)

    return {
        "role": role,
        "college_code": payload.get("college_code"),
        "stats": {
            "students": students,
            "tests": tests,
            "placements": placements,
            "avg_score": avg_score,
        },
        "overview": [
            {"title": "Available Tests", "value": tests},
            {"title": "Passed Attempts", "value": placements},
            {"title": "Average Score", "value": f"{avg_score}%"},
            {"title": "Registered Students", "value": students},
        ],
    }
