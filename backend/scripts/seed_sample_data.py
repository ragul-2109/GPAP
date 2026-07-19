import sys
from pathlib import Path
from datetime import datetime, timedelta

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database import SessionLocal, Base, get_engine
import models  # noqa: F401
from models import (
    College,
    Department,
    Course,
    User,
    StudentProfile,
    StaffProfile,
    QuestionBank,
    Test,
    TestQuestion,
    StudentResult,
    StudentAnswer,
    ActivityLog,
)


def seed_sample_data(engine=None):
    if engine is None:
        engine = get_engine()
    Base.metadata.create_all(bind=engine)
    SessionLocal.configure(bind=engine)
    db = SessionLocal()
    try:
        # Clear existing sample records if present to avoid duplicates
        existing_colleges = db.query(College).count()
        if existing_colleges == 0:
            pass

        college = db.query(College).filter(College.code == "EIT").first()
        if not college:
            college = College(code="EIT", name="Engineering Institute of Technology", domain="eit.edu", is_active=True)
            db.add(college)
            db.flush()

        department_cse = db.query(Department).filter(Department.college_id == college.id, Department.code == "CSE").first()
        if not department_cse:
            department_cse = Department(college_id=college.id, name="Computer Science", code="CSE", is_active=True)
            db.add(department_cse)
            db.flush()

        department_ece = db.query(Department).filter(Department.college_id == college.id, Department.code == "ECE").first()
        if not department_ece:
            department_ece = Department(college_id=college.id, name="Electronics", code="ECE", is_active=True)
            db.add(department_ece)
            db.flush()

        course_ds = db.query(Course).filter(Course.department_id == department_cse.id, Course.code == "DS101").first()
        if not course_ds:
            course_ds = Course(department_id=department_cse.id, name="Data Structures", code="DS101", is_active=True)
            db.add(course_ds)
            db.flush()

        course_dbms = db.query(Course).filter(Course.department_id == department_cse.id, Course.code == "DBMS101").first()
        if not course_dbms:
            course_dbms = Course(department_id=department_cse.id, name="DBMS", code="DBMS101", is_active=True)
            db.add(course_dbms)
            db.flush()

        def ensure_user(email, full_name, role, college_id=None, dept_id=None):
            user = db.query(User).filter(User.email == email).first()
            if not user:
                user = User(
                    college_id=college_id,
                    full_name=full_name,
                    email=email,
                    password="demo123",
                    role=role,
                    is_active=True,
                )
                db.add(user)
                db.flush()
            return user

        admin_user = ensure_user("admin@eit.edu", "Asha Kumar", "college_admin", college.id)
        staff_user = ensure_user("staff@eit.edu", "Ravi Menon", "staff", college.id, department_cse.id)
        student_user = ensure_user("student@eit.edu", "Nina Joseph", "student", college.id, department_cse.id)
        student_user2 = ensure_user("student2@eit.edu", "Arun Das", "student", college.id, department_ece.id)

        if not db.query(StudentProfile).filter(StudentProfile.user_id == student_user.id).first():
            db.add(StudentProfile(user_id=student_user.id, department_id=department_cse.id, course_id=course_ds.id, batch_year="2024", section="A", roll_number="CS-101"))
        if not db.query(StudentProfile).filter(StudentProfile.user_id == student_user2.id).first():
            db.add(StudentProfile(user_id=student_user2.id, department_id=department_ece.id, course_id=course_dbms.id, batch_year="2024", section="B", roll_number="EC-202"))
        if not db.query(StaffProfile).filter(StaffProfile.user_id == staff_user.id).first():
            db.add(StaffProfile(user_id=staff_user.id, department_id=department_cse.id, employee_id="EMP-1001"))

        db.flush()

        questions = [
            {
                "department": "Computer Science",
                "subject": "Data Structures",
                "topic": "Arrays",
                "difficulty": "Easy",
                "company": "TCS",
                "previous_year": "2023",
                "bloom_level": "Remember",
                "question_type": "Single Choice",
                "prompt": "Which data structure uses LIFO order?",
                "options": ["Queue", "Stack", "Linked List", "Tree"],
                "correct_answer": "Stack",
                "explanation": "A stack follows Last In First Out order.",
                "marks": 1.0,
            },
            {
                "department": "Computer Science",
                "subject": "DBMS",
                "topic": "Normalization",
                "difficulty": "Medium",
                "company": "Infosys",
                "previous_year": "2022",
                "bloom_level": "Understand",
                "question_type": "Single Choice",
                "prompt": "What is the primary key used for?",
                "options": ["To store duplicates", "To uniquely identify a row", "To sort table", "To create index"],
                "correct_answer": "To uniquely identify a row",
                "explanation": "A primary key uniquely identifies each record in a table.",
                "marks": 1.0,
            },
            {
                "department": "Electronics",
                "subject": "Digital Electronics",
                "topic": "Logic Gates",
                "difficulty": "Medium",
                "company": "Wipro",
                "previous_year": "2021",
                "bloom_level": "Apply",
                "question_type": "Single Choice",
                "prompt": "Which gate outputs 1 only when both inputs are 1?",
                "options": ["AND", "OR", "NOT", "XOR"],
                "correct_answer": "AND",
                "explanation": "The AND gate returns true only if all inputs are true.",
                "marks": 1.0,
            },
        ]

        for q in questions:
            exists = db.query(QuestionBank).filter(QuestionBank.prompt == q["prompt"]).first()
            if not exists:
                db.add(QuestionBank(college_id=college.id, created_by_id=staff_user.id, **q))

        db.flush()

        test = db.query(Test).filter(Test.title == "Sample Aptitude Test").first()
        if not test:
            test = Test(
                college_id=college.id,
                created_by_id=staff_user.id,
                title="Sample Aptitude Test",
                subject="Aptitude",
                topic="Reasoning",
                department_id=department_cse.id,
                year="2024",
                section="A",
                difficulty="Medium",
                total_questions=3,
                total_marks=3.0,
                duration_minutes=30,
                passing_marks=2.0,
                negative_marking=0.25,
                random_questions=False,
                random_options=False,
                allow_calculator=False,
                allow_review=True,
                fullscreen_required=True,
                start_time=datetime.now() - timedelta(days=1),
                end_time=datetime.now() + timedelta(days=2),
                status="Active",
            )
            db.add(test)
            db.flush()

        question_rows = db.query(QuestionBank).filter(QuestionBank.college_id == college.id).order_by(QuestionBank.id).limit(3).all()
        if question_rows:
            for idx, q in enumerate(question_rows, start=1):
                exists = db.query(TestQuestion).filter(TestQuestion.test_id == test.id, TestQuestion.question_id == q.id).first()
                if not exists:
                    db.add(TestQuestion(test_id=test.id, question_id=q.id, order_index=idx))

        db.flush()

        result = db.query(StudentResult).filter(StudentResult.user_id == student_user.id, StudentResult.test_id == test.id).first()
        if not result:
            result = StudentResult(
                user_id=student_user.id,
                test_id=test.id,
                status="Submitted",
                marks=2.5,
                percentage=83.3,
                correct_count=2,
                wrong_count=1,
                skipped_count=0,
                negative_marks=0.25,
                accuracy=66.7,
                time_taken=1800,
                grade="A",
                pass_fail="Pass",
                cheating_score=0,
                ai_risk_level="Safe",
                started_at=datetime.now() - timedelta(minutes=35),
                completed_at=datetime.now(),
            )
            db.add(result)
            db.flush()

            db.add(StudentAnswer(result_id=result.id, question_id=question_rows[0].id, selected_answer="Stack", is_correct=True, marks_awarded=1.0, time_taken_seconds=38))
            db.add(StudentAnswer(result_id=result.id, question_id=question_rows[1].id, selected_answer="To sort table", is_correct=False, marks_awarded=0.0, time_taken_seconds=45))
            db.add(StudentAnswer(result_id=result.id, question_id=question_rows[2].id, selected_answer="AND", is_correct=True, marks_awarded=1.0, time_taken_seconds=30))

        db.add(ActivityLog(user_id=admin_user.id, action="seed_sample_data", target_type="College", target_id=college.id))
        db.add(ActivityLog(user_id=staff_user.id, action="created_test", target_type="Test", target_id=test.id))

        db.commit()
        print("Sample data inserted successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding sample data: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_sample_data()
