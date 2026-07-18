from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db
from models import Test, StudentResult, User
from schemas.tests import TestCreate, TestResponse
from schemas import UserProfile
from routes.auth import get_current_user

router = APIRouter(prefix="/api/tests", tags=["tests"])

@router.post("/", response_model=TestResponse, status_code=status.HTTP_201_CREATED)
def create_test(
    test: TestCreate, 
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to create tests")
        
    db_test = Test(
        **test.model_dump(),
        college_id=current_user.college_id or 1,
        created_by_id=current_user.id
    )
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test

@router.get("/", response_model=List[TestResponse])
def get_tests(
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role == "student":
        # Students should only see assigned tests (simplified for now)
        return db.query(Test).filter(Test.college_id == current_user.college_id).all()
    
    return db.query(Test).filter(Test.college_id == current_user.college_id).all()

@router.get("/{test_id}", response_model=TestResponse)
def get_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@router.get("/{test_id}/live-monitoring")
def live_monitoring(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    results = db.query(StudentResult).filter(StudentResult.test_id == test_id).all()
    
    online = 0
    completed = 0
    in_progress = 0
    flagged = 0
    
    student_details = []
    
    for r in results:
        student = db.query(User).filter(User.id == r.user_id).first()
        status_str = r.status
        if status_str == "Submitted" or status_str == "Auto-Submitted":
            completed += 1
        elif status_str == "In Progress":
            online += 1
            in_progress += 1
        elif status_str == "Flagged":
            flagged += 1
            
        student_details.append({
            "student_id": r.user_id,
            "name": student.full_name if student else "Unknown",
            "status": status_str,
            "risk_level": r.ai_risk_level,
            "score": r.cheating_score
        })
            
    return {
        "total": len(results),
        "online": online,
        "completed": completed,
        "in_progress": in_progress,
        "flagged": flagged,
        "students": student_details
    }
