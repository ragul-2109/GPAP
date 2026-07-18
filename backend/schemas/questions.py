from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class QuestionBase(BaseModel):
    department: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    difficulty: str = "Medium"
    company: Optional[str] = None
    previous_year: Optional[str] = None
    bloom_level: Optional[str] = None
    
    question_type: str = "Single Choice"
    prompt: str
    options: Dict[str, Any]
    correct_answer: str
    explanation: Optional[str] = None
    marks: float = 1.0

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    college_id: int
    created_by_id: int
    is_ai_generated: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class QuestionBulkUpload(BaseModel):
    questions: List[QuestionCreate]
