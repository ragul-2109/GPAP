import unittest
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from fastapi.testclient import TestClient
from jose import jwt

from config import settings
from database import SessionLocal
from main import app
from models import AuthUser, College, CollegeAdmin, Role


class StaffAssignmentRBACTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_college_admin_cannot_manage_staff_assignments(self):
        role = self.db.query(Role).filter(Role.slug == "college_admin").first()
        if not role:
            role = Role(name="College Admin", slug="college_admin", description="College Administrator")
            self.db.add(role)
            self.db.flush()

        college = self.db.query(College).filter(College.code == "TESTCOL").first()
        if not college:
            college = College(code="TESTCOL", name="Test College")
            self.db.add(college)
            self.db.flush()

        suffix = uuid4().hex[:8]
        email = f"college-admin-rbac-{suffix}@example.com"
        user = AuthUser(
            full_name="RBAC College Admin",
            email=email,
            username=f"college_admin_rbac_{suffix}",
            password_hash="unused",
            role_id=role.id,
            college_id=college.id,
            must_change_password=False,
        )
        self.db.add(user)
        self.db.flush()
        self.db.add(CollegeAdmin(user_id=user.id, college_id=college.id, is_active=True))
        self.db.commit()

        token = jwt.encode(
            {
                "sub": str(user.id),
                "role": "college_admin",
                "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
            },
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM,
        )

        response = self.client.post(
            "/api/staff/assignments",
            json={"action": "assign", "staff_id": 1},
            headers={"Authorization": f"Bearer {token}"},
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json()["detail"], "Only Super Admin can manage Genfinix staff assignments")


if __name__ == "__main__":
    unittest.main()
