from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from models import QuestionBank

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("/overview")
def get_overview(role: str | None = Query(default="student")):
    role_map = {
        "super_admin": {
            "headline": "Platform Control Center",
            "cards": [
                {"title": "Colleges", "value": "18", "detail": "Active institutes"},
                {"title": "Revenue", "value": "$48k", "detail": "Monthly recurring"},
                {"title": "Tests", "value": "142", "detail": "Scheduled this month"},
            ],
            "tasks": ["Review college onboarding", "Approve premium access", "Publish weekly analytics"],
        },
        "college_admin": {
            "headline": "College Operations Hub",
            "cards": [
                {"title": "Students", "value": "184", "detail": "Registered learners"},
                {"title": "Batches", "value": "7", "detail": "Active groups"},
                {"title": "Placements", "value": "37", "detail": "Qualified candidates"},
            ],
            "tasks": ["Assign trainers", "Monitor weekly tests", "Approve placement drives"],
        },
        "staff": {
            "headline": "Training & Assessment Desk",
            "cards": [
                {"title": "Lessons", "value": "12", "detail": "Scheduled this week"},
                {"title": "MCQs", "value": "120", "detail": "Prepared questions"},
                {"title": "Coding", "value": "8", "detail": "Practice tasks ready"},
            ],
            "tasks": ["Create new coding challenge", "Schedule mock test", "Review weak students"],
        },
        "student": {
            "headline": "Personal Learning Portal",
            "cards": [
                {"title": "Practice", "value": "24", "detail": "MCQ attempts"},
                {"title": "Coding", "value": "6", "detail": "Workshops joined"},
                {"title": "Performance", "value": "78%", "detail": "Average score"},
            ],
            "tasks": ["Attempt today's mock test", "Practice coding challenge", "Review placement preparation"],
        },
    }

    return role_map.get(role, role_map["student"])


@router.get("/mcq")
def get_mcq_questions(db: Session = Depends(get_db)):
    questions = db.query(QuestionBank).filter(QuestionBank.is_active.is_(True)).limit(10).all()
    if questions:
        result = []
        for q in questions:
            options = []
            if isinstance(q.options, dict):
                options = [q.options.get(k, "") for k in ["A", "B", "C", "D"]]
            elif isinstance(q.options, list):
                options = q.options
            else:
                options = []

            result.append({
                "id": q.id,
                "prompt": q.prompt,
                "options": [opt for opt in options if opt is not None],
                "answer": q.correct_answer,
            })
        return {"questions": result}

    return {
        "questions": [
            {
                "id": 1,
                "prompt": "Which Python keyword is used to define a function?",
                "options": ["class", "def", "return", "import"],
                "answer": "def",
            },
            {
                "id": 2,
                "prompt": "What does SQL stand for?",
                "options": ["Structured Query Language", "Simple Query Logic", "Standard Query Library", "System Query Link"],
                "answer": "Structured Query Language",
            },
        ]
    }


@router.get("/coding")
def get_coding_tasks():
    return {
        "tasks": [
            {
                "title": "Reverse String",
                "difficulty": "Easy",
                "description": "Write a function that reverses a string and returns the result.",
            },
            {
                "title": "Find Maximum",
                "difficulty": "Medium",
                "description": "Create a function that returns the largest value from a list.",
            },
        ]
    }


@router.get("/proctoring")
def get_proctoring():
    return {
        "status": "Secure",
        "risk_score": 12,
        "flags": ["Tab switch detected 1 time", "Copy/paste blocked", "Clipboard monitoring active"],
    }


@router.get("/results")
def get_results(role: str | None = Query(default="student")):
    return {
        "role": role,
        "records": [
            {"student": "Asha", "test": "Aptitude Mock", "score": 82, "submitted": "2026-07-14 10:15"},
            {"student": "Ravi", "test": "Coding Sprint", "score": 76, "submitted": "2026-07-14 11:20"},
        ],
    }
