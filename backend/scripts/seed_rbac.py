import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import SessionLocal
from models import AuthUser, College, CollegeAdmin, Permission, Role, RolePermission, StaffMember, StudentRecord

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    try:
        return pwd_context.hash(password)
    except Exception:
        return password


def _resolve_register_number(db: Session, preferred: str | None) -> str | None:
    if not preferred:
        return None
    candidate = preferred
    existing_auth = db.query(AuthUser).filter(AuthUser.register_number == candidate).first()
    existing_student = db.query(StudentRecord).filter(StudentRecord.register_number == candidate).first()
    if not existing_auth and not existing_student:
        return candidate
    suffix = 1
    while True:
        candidate = f"{preferred}-{suffix}"
        existing_auth = db.query(AuthUser).filter(AuthUser.register_number == candidate).first()
        existing_student = db.query(StudentRecord).filter(StudentRecord.register_number == candidate).first()
        if not existing_auth and not existing_student:
            return candidate
        suffix += 1


def seed_rbac(db: Session) -> None:
    roles = [
        ("super_admin", "Super Admin", "Platform-wide management"),
        ("college_admin", "College Admin", "Manage a single college"),
        ("staff", "Staff", "Teaching and assessment operations"),
        ("student", "Student", "Take tests and view results"),
    ]
    role_map = {}
    for slug, name, desc in roles:
        role = db.query(Role).filter(Role.slug == slug).first()
        if not role:
            role = Role(slug=slug, name=name, description=desc)
            db.add(role)
            db.flush()
        role_map[slug] = role

    permissions = [
        ("view_dashboard", "View dashboard"),
        ("manage_colleges", "Manage colleges"),
        ("manage_staff", "Manage staff"),
        ("manage_students", "Manage students"),
        ("manage_tests", "Manage tests"),
        ("view_reports", "View reports"),
        ("view_analytics", "View analytics"),
    ]
    permission_map = {}
    for code, desc in permissions:
        permission = db.query(Permission).filter(Permission.code == code).first()
        if not permission:
            permission = Permission(code=code, description=desc)
            db.add(permission)
            db.flush()
        permission_map[code] = permission

    for role in role_map.values():
        for permission in permission_map.values():
            existing = db.query(RolePermission).filter(RolePermission.role_id == role.id, RolePermission.permission_id == permission.id).first()
            if not existing:
                db.add(RolePermission(role_id=role.id, permission_id=permission.id))

    college = db.query(College).filter(College.code == "GENFINIX").first()
    if not college:
        college = College(code="GENFINIX", name="Genfinix College")
        db.add(college)
        db.flush()

    users = [
        {"email": "student@example.com", "username": "student1", "password": "student123", "full_name": "Student Demo", "role_slug": "student", "register_number": "STU001"},
        {"email": "staff@example.com", "username": "staff1", "password": "staff123", "full_name": "Staff Demo", "role_slug": "staff"},
        {"email": "admin@example.com", "username": "admin1", "password": "admin123", "full_name": "College Admin Demo", "role_slug": "college_admin"},
        {"email": "super@example.com", "username": "super1", "password": "super123", "full_name": "Super Admin Demo", "role_slug": "super_admin"},
        {"email": "student@gmail.com", "username": "student_local", "password": "student123", "full_name": "Student Local", "role_slug": "student", "register_number": "STU_LOCAL_001"},
        {"email": "staff@gmail.com", "username": "staff_local", "password": "staff123", "full_name": "Staff Local", "role_slug": "staff"},
        {"email": "management@gmail.com", "username": "management_local", "password": "management123", "full_name": "Management Local", "role_slug": "college_admin"},
        {"email": "genfinix@gmail.com", "username": "genfinix_local", "password": "genfinix123", "full_name": "Genfinix Local", "role_slug": "super_admin"},
    ]

    for item in users:
        user = db.query(AuthUser).filter(AuthUser.email == item["email"]).first() or db.query(AuthUser).filter(AuthUser.username == item.get("username")).first()
        if not user:
            user = AuthUser(
                full_name=item["full_name"],
                email=item["email"],
                username=item["username"],
                password_hash=hash_password(item["password"]),
                role_id=role_map[item["role_slug"]].id,
                college_id=college.id,
                register_number=item.get("register_number"),
            )
            db.add(user)
            db.flush()

        user.full_name = item["full_name"]
        user.email = item["email"]
        user.username = item["username"]
        user.password_hash = hash_password(item["password"])
        user.role_id = role_map[item["role_slug"]].id
        user.college_id = college.id
        user.register_number = _resolve_register_number(db, item.get("register_number") if item["role_slug"] == "student" else None)
        user.is_active = True

        if item["role_slug"] == "college_admin":
            college_admin = db.query(CollegeAdmin).filter(CollegeAdmin.user_id == user.id).first()
            if not college_admin:
                db.add(CollegeAdmin(user_id=user.id, college_id=college.id, is_primary=True))
            else:
                college_admin.college_id = college.id
                college_admin.is_active = True
        elif item["role_slug"] == "staff":
            staff_member = db.query(StaffMember).filter(StaffMember.user_id == user.id).first()
            if not staff_member:
                db.add(StaffMember(user_id=user.id, college_id=college.id, employee_id="EMP001"))
            else:
                staff_member.college_id = college.id
                staff_member.is_active = True
        elif item["role_slug"] == "student":
            register_number = _resolve_register_number(db, item.get("register_number"))
            student_record = db.query(StudentRecord).filter(StudentRecord.user_id == user.id).first()
            if not student_record:
                db.add(StudentRecord(user_id=user.id, college_id=college.id, register_number=register_number))
            else:
                student_record.college_id = college.id
                student_record.register_number = register_number or student_record.register_number
                student_record.is_active = True
            user.register_number = register_number

    db.commit()


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_rbac(db)
    finally:
        db.close()
