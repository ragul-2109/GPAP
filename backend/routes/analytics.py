from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Test, StudentResult, CheatingLog, User, College
from schemas import UserProfile
from routes.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/college")
def college_analytics(
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    college_id = current_user.college_id or 1
    
    total_tests = db.query(func.count(Test.id)).filter(Test.college_id == college_id).scalar() or 0
    total_students = db.query(func.count(User.id)).filter(User.college_id == college_id, User.role == "student").scalar() or 0
    
    # Results stats
    results_query = db.query(StudentResult).join(Test).filter(Test.college_id == college_id)
    total_appeared = results_query.count()
    total_passed = results_query.filter(StudentResult.pass_fail == "Pass").count()
    
    avg_marks = db.query(func.avg(StudentResult.marks)).join(Test).filter(Test.college_id == college_id).scalar() or 0
    
    # Cheating stats
    high_risk_students = results_query.filter(StudentResult.ai_risk_level.in_(["High", "Critical"])).count()
    
    return {
        "overview": {
            "total_tests": total_tests,
            "total_students": total_students,
            "total_appeared": total_appeared,
            "pass_percentage": (total_passed / total_appeared * 100) if total_appeared > 0 else 0,
            "avg_marks": round(avg_marks, 2),
            "high_risk_students": high_risk_students
        },
        "charts": {
            "pass_fail": {"pass": total_passed, "fail": total_appeared - total_passed}
        }
    }

@router.get("/super")
def super_analytics(
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    total_colleges = db.query(func.count(College.id)).scalar() or 0
    total_students = db.query(func.count(User.id)).filter(User.role == "student").scalar() or 0
    total_tests = db.query(func.count(Test.id)).scalar() or 0
    
    # Example logic for active subscriptions (Mocked)
    active_subs = 145000 
    
    # System uptime mock
    uptime = 99.9
    
    return {
        "overview": {
            "total_colleges": total_colleges,
            "total_students": total_students,
            "total_tests": total_tests,
            "mrr": active_subs,
            "uptime": uptime
        },
        "alerts": [
            {"type": "warning", "title": "High API Usage", "desc": "XYZ Tech University exceeding threshold.", "time": "10m ago"},
            {"type": "success", "title": "New Onboarding", "desc": "ABC Engineering College setup complete.", "time": "2h ago"},
            {"type": "primary", "title": "Payment Received", "desc": "Global Tech Inst. renewed annual license.", "time": "1d ago"}
        ]
    }

