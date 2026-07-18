import sys
import os
from pathlib import Path
from sqlalchemy import text

# Add backend to path to allow imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database import SessionLocal
from models import User


def seed_database():
    db = SessionLocal()
    
    # 1. First, seed raw SQL data (like colleges, roles, etc)
    seed_file = Path(__file__).resolve().parents[1] / "database" / "seed_data.sql"
    if seed_file.exists():
        try:
            with open(seed_file, 'r') as f:
                sql_commands = f.read().split(';')
            for cmd in sql_commands:
                if cmd.strip():
                    db.execute(text(cmd))
            db.commit()
            print("SQL file seeded successfully.")
        except Exception as e:
            print(f"Error seeding SQL file: {e}")
            db.rollback()

    # 2. Seed default users securely
    users_to_create = [
        {"email": "student@gmail.com", "password": "student123", "role": "student"},
        {"email": "staff@gmail.com", "password": "staff123", "role": "staff"},
        {"email": "management@gmail.com", "password": "management123", "role": "college_admin"},
        {"email": "genfinix@gmail.com", "password": "genfinix123", "role": "super_admin"}
    ]

    try:
        for u in users_to_create:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                hashed_password = u["password"]
                new_user = User(
                    email=u["email"],
                    password=hashed_password,
                    role=u["role"],
                    full_name=u["email"].split("@")[0],
                    is_active=True
                )
                db.add(new_user)
                print(f"Created user: {u['email']} ({u['role']})")
            else:
                print(f"User {u['email']} already exists. Updating password and role...")
                existing.password = u["password"]
                existing.role = u["role"]
                
        db.commit()
        print("Default users seeded successfully.")
    except Exception as e:
        print(f"Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Database Seeder ===")
    seed_database()
