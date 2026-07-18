import sys
import os
from datetime import datetime
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database import SessionLocal
from models import College, User

db = SessionLocal()

def seed_data():
    # Check if college exists
    college = db.query(College).filter_by(code="EXCEL").first()
    if not college:
        college = College(
            code="EXCEL",
            name="Excel Engineering College",
            domain="excel.edu"
        )
        db.add(college)
        db.commit()
        db.refresh(college)
        print("Created college: EXCEL")
    else:
        print("College EXCEL already exists.")

    users_to_add = [
        {
            "full_name": "Excel Student",
            "email": "student@gmail.com",
            "password": "student123",
            "role": "student",
            "college_id": college.id
        },
        {
            "full_name": "Excel Staff",
            "email": "staff@gmail.com",
            "password": "staff123",
            "role": "staff",
            "college_id": college.id
        },
        {
            "full_name": "Excel Management",
            "email": "management@gmail.com",
            "password": "management123",
            "role": "college_admin",
            "college_id": college.id
        },
        {
            "full_name": "Genfinix Admin",
            "email": "genfinix@gmail.com",
            "password": "genfinix123",
            "role": "super_admin",
            "college_id": None
        }
    ]

    for u_data in users_to_add:
        existing = db.query(User).filter_by(email=u_data["email"]).first()
        if not existing:
            user = User(
                full_name=u_data["full_name"],
                email=u_data["email"],
                password=u_data["password"],
                role=u_data["role"],
                college_id=u_data["college_id"],
                created_at=datetime.utcnow()
            )
            db.add(user)
            print(f"Created user: {u_data['email']} with role {u_data['role']}")
        else:
            existing.password = u_data["password"]
            existing.role = u_data["role"]
            existing.college_id = u_data["college_id"]
            print(f"Updated existing user: {u_data['email']} with role {u_data['role']}")

    db.commit()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_data()
