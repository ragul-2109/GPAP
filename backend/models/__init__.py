from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, JSON, Float, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from typing import List, Optional

class Base(DeclarativeBase):
    pass

class College(Base):
    __tablename__ = "colleges"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    domain: Mapped[str | None] = mapped_column(String(150), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    departments: Mapped[List["Department"]] = relationship(back_populates="college")
    users: Mapped[List["User"]] = relationship(back_populates="college")
    tests: Mapped[List["Test"]] = relationship(back_populates="college")

class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    college_id: Mapped[int] = mapped_column(ForeignKey("colleges.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    college: Mapped["College"] = relationship(back_populates="departments")
    courses: Mapped[List["Course"]] = relationship(back_populates="department")

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    department: Mapped["Department"] = relationship(back_populates="courses")

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    college_id: Mapped[int | None] = mapped_column(ForeignKey("colleges.id"), nullable=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False) # super_admin, college_admin, staff, student
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, nullable=False, default=func.now())

    college: Mapped[Optional["College"]] = relationship(back_populates="users")
    student_profile: Mapped[Optional["StudentProfile"]] = relationship(back_populates="user", uselist=False)
    staff_profile: Mapped[Optional["StaffProfile"]] = relationship(back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id"), nullable=True)
    batch_year: Mapped[str | None] = mapped_column(String(10), nullable=True)
    section: Mapped[str | None] = mapped_column(String(10), nullable=True)
    roll_number: Mapped[str | None] = mapped_column(String(50), nullable=True)

    user: Mapped["User"] = relationship(back_populates="student_profile")

class StaffProfile(Base):
    __tablename__ = "staff_profiles"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, unique=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    employee_id: Mapped[str | None] = mapped_column(String(50), nullable=True)

    user: Mapped["User"] = relationship(back_populates="staff_profile")

class QuestionBank(Base):
    __tablename__ = "question_bank"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    college_id: Mapped[int] = mapped_column(ForeignKey("colleges.id"), nullable=False)
    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    subject: Mapped[str | None] = mapped_column(String(100), nullable=True)
    topic: Mapped[str | None] = mapped_column(String(100), nullable=True)
    difficulty: Mapped[str] = mapped_column(String(50), default="Medium")
    company: Mapped[str | None] = mapped_column(String(100), nullable=True)
    previous_year: Mapped[str | None] = mapped_column(String(20), nullable=True)
    bloom_level: Mapped[str | None] = mapped_column(String(50), nullable=True)
    
    question_type: Mapped[str] = mapped_column(String(50), default="Single Choice")
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[dict] = mapped_column(JSON, nullable=False) # JSON array of options
    correct_answer: Mapped[str] = mapped_column(String(255), nullable=False)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    marks: Mapped[float] = mapped_column(Float, default=1.0)
    is_ai_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

class Test(Base):
    __tablename__ = "tests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    college_id: Mapped[int] = mapped_column(ForeignKey("colleges.id"), nullable=False)
    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(100), nullable=True)
    topic: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    # Target Audience
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"), nullable=True)
    year: Mapped[str | None] = mapped_column(String(10), nullable=True)
    section: Mapped[str | None] = mapped_column(String(10), nullable=True)
    
    # Configuration
    difficulty: Mapped[str | None] = mapped_column(String(50), nullable=True)
    total_questions: Mapped[int] = mapped_column(Integer, default=0)
    total_marks: Mapped[float] = mapped_column(Float, default=0.0)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    passing_marks: Mapped[float] = mapped_column(Float, default=0.0)
    negative_marking: Mapped[float] = mapped_column(Float, default=0.0) # Percentage or absolute
    
    # Settings
    random_questions: Mapped[bool] = mapped_column(Boolean, default=True)
    random_options: Mapped[bool] = mapped_column(Boolean, default=True)
    allow_calculator: Mapped[bool] = mapped_column(Boolean, default=False)
    allow_review: Mapped[bool] = mapped_column(Boolean, default=True)
    fullscreen_required: Mapped[bool] = mapped_column(Boolean, default=True)
    test_password: Mapped[str | None] = mapped_column(String(50), nullable=True)
    
    # Scheduling
    start_time: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    end_time: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Draft") # Draft, Scheduled, Active, Completed
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    
    college: Mapped["College"] = relationship(back_populates="tests")

class TestQuestion(Base):
    __tablename__ = "test_questions"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("question_bank.id"), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

class StudentResult(Base):
    __tablename__ = "student_results"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"), nullable=False)
    
    status: Mapped[str] = mapped_column(String(50), default="In Progress") # In Progress, Submitted, Auto-Submitted, Flagged
    
    marks: Mapped[float] = mapped_column(Float, default=0.0)
    percentage: Mapped[float] = mapped_column(Float, default=0.0)
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    wrong_count: Mapped[int] = mapped_column(Integer, default=0)
    skipped_count: Mapped[int] = mapped_column(Integer, default=0)
    negative_marks: Mapped[float] = mapped_column(Float, default=0.0)
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    time_taken: Mapped[int] = mapped_column(Integer, default=0) # in seconds
    grade: Mapped[str | None] = mapped_column(String(10), nullable=True)
    pass_fail: Mapped[str | None] = mapped_column(String(10), nullable=True)
    
    cheating_score: Mapped[int] = mapped_column(Integer, default=0)
    ai_risk_level: Mapped[str] = mapped_column(String(20), default="Safe") # Safe, Medium, High, Critical
    
    started_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    completed_at: Mapped[DateTime | None] = mapped_column(DateTime, nullable=True)

class StudentAnswer(Base):
    __tablename__ = "student_answers"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    result_id: Mapped[int] = mapped_column(ForeignKey("student_results.id"), nullable=False)
    question_id: Mapped[int] = mapped_column(ForeignKey("question_bank.id"), nullable=False)
    
    selected_answer: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    marks_awarded: Mapped[float] = mapped_column(Float, default=0.0)
    time_taken_seconds: Mapped[int] = mapped_column(Integer, default=0)

class CheatingLog(Base):
    __tablename__ = "cheating_logs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    result_id: Mapped[int] = mapped_column(ForeignKey("student_results.id"), nullable=False)
    
    event_type: Mapped[str] = mapped_column(String(100), nullable=False) 
    # e.g. tab_switch, blur, fullscreen_exit, copy, paste, right_click, idle
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0)
    
    ip_address: Mapped[str | None] = mapped_column(String(50), nullable=True)
    browser: Mapped[str | None] = mapped_column(String(100), nullable=True)
    device: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    timestamp: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

class TestLog(Base):
    __tablename__ = "test_logs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    result_id: Mapped[int] = mapped_column(ForeignKey("student_results.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. login, start, save_answer, review_mark, auto_submit
    timestamp: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    target_type: Mapped[str | None] = mapped_column(String(100), nullable=True) # e.g. Test, Question
    target_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    timestamp: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

class Report(Base):
    __tablename__ = "reports"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    college_id: Mapped[int] = mapped_column(ForeignKey("colleges.id"), nullable=False)
    generated_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. Results, Cheating, Analytics
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
