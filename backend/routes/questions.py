from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import csv
import json
from io import StringIO

from database import get_db
from models import QuestionBank
from schemas.questions import QuestionCreate, QuestionResponse, QuestionBulkUpload
from schemas import UserProfile
from routes.auth import get_current_user

router = APIRouter(prefix="/api/questions", tags=["questions"])

@router.post("/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    question: QuestionCreate, 
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to create questions")
        
    db_question = QuestionBank(
        **question.model_dump(),
        college_id=current_user.college_id or 1,
        created_by_id=current_user.id
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/", response_model=List[QuestionResponse])
def get_questions(
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role == "super_admin":
        return db.query(QuestionBank).all()
    return db.query(QuestionBank).filter(QuestionBank.college_id == current_user.college_id).all()

@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    question = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    question: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_q = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    for key, value in question.model_dump().items():
        setattr(db_q, key, value)
        
    db.commit()
    db.refresh(db_q)
    return db_q

@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db_q = db.query(QuestionBank).filter(QuestionBank.id == question_id).first()
    if not db_q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    db.delete(db_q)
    db.commit()
    return {"message": "Question deleted successfully"}

@router.post("/bulk-upload", status_code=status.HTTP_201_CREATED)
def bulk_upload_questions(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(get_current_user)
):
    if current_user.role not in ["staff", "college_admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to upload questions")
        
    content = file.file.read().decode("utf-8")
    questions_data = []
    
    if file.filename.endswith(".csv"):
        csv_reader = csv.DictReader(StringIO(content))
        questions_data = list(csv_reader)
    elif file.filename.endswith(".json"):
        questions_data = json.loads(content)
    else:
        raise HTTPException(status_code=400, detail="Only CSV and JSON files are supported")
    
    questions_added = 0
    for row in questions_data:
        try:
            options = {
                "A": row.get("Option A", row.get("option_a", "")),
                "B": row.get("Option B", row.get("option_b", "")),
                "C": row.get("Option C", row.get("option_c", "")),
                "D": row.get("Option D", row.get("option_d", ""))
            }
            db_question = QuestionBank(
                prompt=row.get("Question", row.get("prompt", "")),
                options=options,
                correct_answer=row.get("Correct Answer", row.get("correct_answer", "")),
                explanation=row.get("Explanation", row.get("explanation", "")),
                marks=float(row.get("Marks", row.get("marks", 1.0))),
                difficulty=row.get("Difficulty", row.get("difficulty", "Medium")),
                topic=row.get("Topic", row.get("topic", "")),
                college_id=current_user.college_id or 1,
                created_by_id=current_user.id
            )
            db.add(db_question)
            questions_added += 1
        except Exception as e:
            continue
            
    db.commit()
    return {"message": f"Successfully uploaded {questions_added} questions"}
