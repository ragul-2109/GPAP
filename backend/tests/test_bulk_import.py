import io
import unittest
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi.testclient import TestClient
from jose import jwt

from config import settings
from database import SessionLocal
from main import app
from models import AuthUser


class BulkImportTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def _auth_headers(self):
        user = self.db.query(AuthUser).filter(AuthUser.email == "super@example.com").first()
        self.assertIsNotNone(user)
        token = jwt.encode(
            {"sub": str(user.id), "role": "super_admin", "exp": datetime.now(timezone.utc) + timedelta(minutes=30)},
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM,
        )
        return {"Authorization": f"Bearer {token}"}

    def test_bulk_import_staff_and_students(self):
        suffix = uuid4().hex[:8]
        staff_email = f"mina{suffix}@example.com"
        student_email = f"ravi{suffix}@example.com"
        student_register = f"REG{suffix[:6].upper()}"

        staff_csv = io.BytesIO(f"employee_id,full_name,email,phone_number,designation,department,specialization,qualification,years_of_experience,employment_type,joining_date,status\nGFX{suffix},Mina Rao,{staff_email},9876543210,Technical Mentor,Training,React & Node.js,M.Tech,6,Full Time,2026-01-10,Active\n".encode("utf-8"))
        staff_response = self.client.post(
            "/api/super-admin/bulk-import/staff",
            files={"file": ("staff.csv", staff_csv, "text/csv")},
            headers=self._auth_headers(),
        )
        self.assertEqual(staff_response.status_code, 200)
        body = staff_response.json()
        self.assertEqual(body["imported"], 1)

        student_csv = io.BytesIO(f"roll_number,full_name,email,college_name,department,batch_year,section\n{student_register},Ravi Kumar,{student_email},GENFINIX,CSE,2025,A\n".encode("utf-8"))
        student_response = self.client.post(
            "/api/super-admin/bulk-import/students",
            files={"file": ("students.csv", student_csv, "text/csv")},
            headers=self._auth_headers(),
        )
        self.assertEqual(student_response.status_code, 200)
        student_body = student_response.json()
        self.assertEqual(student_body["imported"], 1)

        imported_user = self.db.query(AuthUser).filter(AuthUser.email == student_email).first()
        self.assertIsNotNone(imported_user)
        self.assertTrue(imported_user.must_change_password)
        self.assertNotEqual(imported_user.password_hash, "Welcome@123")

    def test_student_import_accepts_default_csv_password_variant(self):
        suffix = uuid4().hex[:8]
        student_email = f"ravi2{suffix}@example.com"
        student_register = f"REG{suffix[:6].upper()}"
        student_csv = io.BytesIO(f"roll_number,full_name,email,password,college_name,department,batch_year,section\n{student_register},Ravi Kumar,{student_email},Welcom@123,GENFINIX,CSE,2025,A\n".encode("utf-8"))
        response = self.client.post(
            "/api/super-admin/bulk-import/students",
            files={"file": ("students.csv", student_csv, "text/csv")},
            headers=self._auth_headers(),
        )
        self.assertEqual(response.status_code, 200)

        login_response = self.client.post(
            "/api/auth/login",
            json={"email": student_email, "password": "Welcom@123"},
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertTrue(login_response.json()["must_change_password"])


if __name__ == "__main__":
    unittest.main()
