import sys
from pathlib import Path

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from models import AuthUser, Base, College, Role
from scripts.seed_rbac import _resolve_register_number


@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        role = Role(id=1, name="Student", slug="student")
        college = College(id=1, code="GENFINIX", name="Genfinix")
        session.add_all([role, college])
        session.commit()
        yield session
    finally:
        session.close()


def test_resolve_register_number_avoids_conflicts(db_session):
    existing_user = AuthUser(
        full_name="Existing",
        email="existing@example.com",
        username="existing",
        password_hash="unused",
        role_id=1,
        college_id=1,
        register_number="STU001",
    )
    db_session.add(existing_user)
    db_session.commit()

    resolved = _resolve_register_number(db_session, "STU001")

    assert resolved != "STU001"
    assert resolved.startswith("STU001")
