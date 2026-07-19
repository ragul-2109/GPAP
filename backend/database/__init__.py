from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from config import settings


class Base(DeclarativeBase):
    pass


def _build_sqlite_url() -> str:
    db_path = Path(settings.SQLITE_DB_PATH)
    if not db_path.is_absolute():
        db_path = Path(__file__).resolve().parents[1] / db_path
    db_path.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{db_path}"


def build_database_url() -> str:
    if settings.USE_SQLITE:
        return _build_sqlite_url()

    return (
        f"mysql+pymysql://{settings.MYSQL_USER}:{settings.MYSQL_PASSWORD}"
        f"@{settings.MYSQL_HOST}:{settings.MYSQL_PORT}/{settings.MYSQL_DB}?charset=utf8mb4"
    )


def get_engine():
    if settings.USE_SQLITE:
        return create_engine(_build_sqlite_url(), pool_pre_ping=True)

    url = build_database_url()
    engine = create_engine(url, pool_pre_ping=True)

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return engine
    except Exception as exc:
        if settings.APP_ENV == "prod":
            raise
        print(f"MySQL unavailable ({exc}); falling back to SQLite")
        return create_engine(_build_sqlite_url(), pool_pre_ping=True)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=get_engine())


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
