from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class TestBase(BaseModel):
    title: str
    subject: Optional[str] = None
    topic: Optional[str] = None
    department_id: Optional[int] = None
    year: Optional[str] = None
    section: Optional[str] = None
    difficulty: Optional[str] = None
    
    total_questions: int = 0
    total_marks: float = 0.0
    duration_minutes: int = 30
    passing_marks: float = 0.0
    negative_marking: float = 0.0
    
    random_questions: bool = True
    random_options: bool = True
    allow_calculator: bool = False
    allow_review: bool = True
    fullscreen_required: bool = True
    test_password: Optional[str] = None
    
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: str = "Draft"

class TestCreate(TestBase):
    pass

class TestResponse(TestBase):
    id: int
    college_id: int
    created_by_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class StudentAnswerSubmit(BaseModel):
    question_id: int
    selected_option: Optional[str] = None # A, B, C, D or None if skipped
    time_taken_seconds: int = 0

class TestSubmission(BaseModel):
    answers: List[StudentAnswerSubmit]
    time_taken_total: int
    is_auto_submit: bool = False

class CheatingLogCreate(BaseModel):
    event_type: str
    description: Optional[str] = None
    duration_seconds: int = 0
    ip_address: Optional[str] = None
    browser: Optional[str] = None
    device: Optional[str] = None
