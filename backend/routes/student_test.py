from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import random
from datetime import datetime

from database import get_db
from models import Test, TestQuestion, QuestionBank, StudentResult, StudentAnswer, CheatingLog
from schemas.tests import TestSubmission, CheatingLogCreate
from schemas import UserProfile
from routes.auth import get_current_user

router = APIRouter(prefix="/api/student/test", tags=["student_test"])

@router.post("/{test_id}/start")
def start_test(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can start a test")
        
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
        
    # Check if already started
    existing_result = db.query(StudentResult).filter(
        StudentResult.test_id == test_id,
        StudentResult.user_id == current_user.id
    ).first()
    
    if existing_result:
        if existing_result.status in ["Submitted", "Auto-Submitted"]:
            raise HTTPException(status_code=400, detail="Test already submitted")
        return {"message": "Test resumed", "result_id": existing_result.id}
        
    new_result = StudentResult(
        test_id=test_id,
        user_id=current_user.id,
        status="In Progress",
        started_at=datetime.utcnow()
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)
    
    return {"message": "Test started", "result_id": new_result.id}

@router.get("/{test_id}")
def get_test_questions(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can fetch test questions")
        
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
        
    result = db.query(StudentResult).filter(
        StudentResult.test_id == test_id,
        StudentResult.user_id == current_user.id
    ).first()
    
    if not result:
        raise HTTPException(status_code=400, detail="You must start the test first")
        
    if result.status in ["Submitted", "Auto-Submitted"]:
        raise HTTPException(status_code=400, detail="Test already completed")
        
    # Fetch questions mapped to this test
    test_questions = db.query(TestQuestion).filter(TestQuestion.test_id == test_id).all()
    q_ids = [tq.question_id for tq in test_questions]
    questions = db.query(QuestionBank).filter(QuestionBank.id.in_(q_ids)).all()
    
    response_questions = []
    
    # 7. Smart Question Randomization
    # We use a stable seed per student and test so reloading doesn't reshuffle everything.
    seed = current_user.id + test_id
    random.seed(seed)
    
    if test.random_questions:
        random.shuffle(questions)
        
    for q in questions:
        q_data = {
            "id": q.id,
            "prompt": q.prompt,
            "type": q.question_type,
            "marks": q.marks
        }
        
        # Options Randomization mapping
        opts = q.options
        keys = list(opts.keys())
        if test.random_options:
            random.shuffle(keys)
            
        ordered_options = []
        for k in keys:
            ordered_options.append({"key": k, "value": opts[k]})
            
        q_data["options"] = ordered_options
        response_questions.append(q_data)
        
    return {
        "test": {
            "title": test.title,
            "duration_minutes": test.duration_minutes,
            "total_questions": test.total_questions,
            "total_marks": test.total_marks,
            "allow_calculator": test.allow_calculator,
            "allow_review": test.allow_review,
            "fullscreen_required": test.fullscreen_required
        },
        "questions": response_questions
    }

@router.post("/{test_id}/submit")
def submit_test(
    test_id: int,
    submission: TestSubmission,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    test = db.query(Test).filter(Test.id == test_id).first()
    result = db.query(StudentResult).filter(
        StudentResult.test_id == test_id,
        StudentResult.user_id == current_user.id
    ).first()
    
    if not result or result.status in ["Submitted", "Auto-Submitted"]:
        raise HTTPException(status_code=400, detail="Test not active or already submitted")
        
    correct_count = 0
    wrong_count = 0
    skipped_count = 0
    total_marks_obtained = 0.0
    
    for ans in submission.answers:
        q = db.query(QuestionBank).filter(QuestionBank.id == ans.question_id).first()
        if not q:
            continue
            
        is_correct = False
        marks_awarded = 0.0
        
        if not ans.selected_option:
            skipped_count += 1
        elif ans.selected_option == q.correct_answer:
            correct_count += 1
            is_correct = True
            marks_awarded = q.marks
            total_marks_obtained += q.marks
        else:
            wrong_count += 1
            # Apply negative marking
            if test.negative_marking > 0:
                total_marks_obtained -= test.negative_marking
                
        # Save Student Answer
        sa = StudentAnswer(
            result_id=result.id,
            question_id=q.id,
            selected_answer=ans.selected_option,
            is_correct=is_correct,
            marks_awarded=marks_awarded,
            time_taken_seconds=ans.time_taken_seconds
        )
        db.add(sa)
        
    result.marks = total_marks_obtained
    result.percentage = (total_marks_obtained / test.total_marks) * 100 if test.total_marks > 0 else 0
    result.correct_count = correct_count
    result.wrong_count = wrong_count
    result.skipped_count = skipped_count
    result.negative_marks = wrong_count * test.negative_marking
    
    # Calculate Accuracy
    attempted = correct_count + wrong_count
    result.accuracy = (correct_count / attempted * 100) if attempted > 0 else 0
    
    result.time_taken = submission.time_taken_total
    result.pass_fail = "Pass" if result.marks >= test.passing_marks else "Fail"
    result.status = "Auto-Submitted" if submission.is_auto_submit else "Submitted"
    result.completed_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Test evaluated successfully", "marks": result.marks, "percentage": result.percentage}

# 12. AI Suspicious Activity Detection
@router.post("/{test_id}/log-cheating")
def log_cheating(
    test_id: int,
    log: CheatingLogCreate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Unauthorized")
        
    result = db.query(StudentResult).filter(
        StudentResult.test_id == test_id,
        StudentResult.user_id == current_user.id
    ).first()
    
    if not result:
        raise HTTPException(status_code=400, detail="Test not active")
        
    clog = CheatingLog(
        result_id=result.id,
        event_type=log.event_type,
        description=log.description,
        duration_seconds=log.duration_seconds,
        ip_address=log.ip_address,
        browser=log.browser,
        device=log.device
    )
    db.add(clog)
    
    # Calculate Risk Score Heuristics
    risk_points = 0
    if log.event_type == "tab_switch":
        risk_points = 8
    elif log.event_type == "copy":
        risk_points = 5
    elif log.event_type == "paste":
        risk_points = 4
    elif log.event_type == "fullscreen_exit":
        risk_points = 2
    elif log.event_type == "idle":
        risk_points = 3 # Base points, might increase based on duration
        if log.duration_seconds > 60:
            risk_points += 5
            
    result.cheating_score += risk_points
    
    if result.cheating_score < 20:
        result.ai_risk_level = "Safe"
    elif result.cheating_score < 40:
        result.ai_risk_level = "Medium"
    elif result.cheating_score < 60:
        result.ai_risk_level = "High"
    else:
        result.ai_risk_level = "Critical"
        
    db.commit()
    
    return {"message": "Log recorded", "current_risk": result.ai_risk_level}
