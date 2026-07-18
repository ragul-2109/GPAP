from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func
import csv
import os
from datetime import datetime
from pathlib import Path

from database import get_db
from models import Test, StudentResult, User, College
from schemas import UserProfile
from routes.auth import get_current_user

router = APIRouter(prefix="/api/reports", tags=["reports"])

STATIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "exports"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

def generate_csv_report(export_type: str, college_id: int, db: Session, filename: str):
    filepath = STATIC_DIR / filename
    
    with open(filepath, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        
        if export_type == "college_analytics":
            writer.writerow(["Test ID", "Test Title", "Student ID", "Student Name", "Marks", "Pass/Fail", "Risk Level"])
            
            results = db.query(StudentResult, Test, User).join(Test).join(User, StudentResult.student_id == User.id).filter(Test.college_id == college_id).all()
            for res, test, user in results:
                writer.writerow([test.id, test.title, user.id, user.full_name, res.marks, res.pass_fail, res.ai_risk_level])
                
        elif export_type == "platform_analytics":
            writer.writerow(["College ID", "College Name", "Total Students", "Total Tests"])
            
            colleges = db.query(College).all()
            for c in colleges:
                student_count = db.query(User).filter(User.college_id == c.id, User.role == "student").count()
                test_count = db.query(Test).filter(Test.college_id == c.id).count()
                writer.writerow([c.id, c.name, student_count, test_count])
                
@router.post("/export")
def generate_export(
    export_type: str,
    background_tasks: BackgroundTasks,
    target_id: int = None,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    college_id = current_user.college_id or 1
    timestamp = datetime.now().strftime("%Y%md_%H%M%S")
    filename = f"{export_type}_{timestamp}.csv"
    
    background_tasks.add_task(generate_csv_report, export_type, college_id, db, filename)
    
    return {
        "message": "Report generation started in background",
        "export_type": export_type,
        "download_url": f"/static/exports/{filename}"
    }
