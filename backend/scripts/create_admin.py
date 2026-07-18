import sys
import os
from pathlib import Path

# Add backend to path to allow imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_super_admin(email: str, password: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists.")
            return

        hashed_password = pwd_context.hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            role="super_admin",
            is_active=True
        )
        db.add(new_user)
        db.commit()
        print(f"Super admin {email} created successfully.")
    except Exception as e:
        print(f"Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Create Super Admin ===")
    email = input("Enter admin email (default: admin@gpap.com): ") or "admin@gpap.com"
    password = input("Enter admin password (default: admin123): ") or "admin123"
    create_super_admin(email, password)
