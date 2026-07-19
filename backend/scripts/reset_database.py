import sys
from pathlib import Path
from typing import Optional

from sqlalchemy import inspect, text
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from config import settings
from database import get_engine
from models import Base
from scripts.seed_rbac import seed_rbac
from scripts.seed_sample_data import seed_sample_data


def reset_database(engine=None, seed: bool = True) -> dict:
    if engine is None:
        engine = get_engine()

    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    table_names = [name for name in inspector.get_table_names() if name not in {"sqlite_sequence"}]

    with engine.begin() as connection:
        connection.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        for table_name in reversed(table_names):
            connection.execute(text(f"TRUNCATE TABLE {table_name}"))
            connection.execute(text(f"ALTER TABLE {table_name} AUTO_INCREMENT = 1"))
        connection.execute(text("SET FOREIGN_KEY_CHECKS = 1"))

    if seed:
        session_factory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = session_factory()
        try:
            seed_rbac(db)
            db.commit()
        finally:
            db.close()

        seed_sample_data(engine=engine)

    return {
        "message": "Database reset completed successfully",
        "tables": table_names,
        "seeded": seed,
    }


if __name__ == "__main__":
    print(reset_database())
