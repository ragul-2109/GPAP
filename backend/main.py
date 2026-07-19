import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from routes import auth, content, dashboard, colleges, staff, students, tests, questions, student_test, analytics, reports, super_admin
from config import settings
from database import Base, SessionLocal
from models import *  # noqa: F401,F403
from scripts.seed_rbac import seed_rbac
from scripts.seed_sample_data import seed_sample_data

app = FastAPI(title="GPAP Backend", version="0.1.0")

BASE_DIR = Path(__file__).resolve().parents[1]
FRONTEND_DIR = BASE_DIR / "frontend"

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(content.router)
app.include_router(colleges.router)
app.include_router(staff.router)
app.include_router(students.router)
app.include_router(tests.router)
app.include_router(questions.router)
app.include_router(student_test.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(super_admin.router)

@app.on_event("startup")
def ensure_initial_data():
    try:
        engine = SessionLocal.kw["bind"]
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_rbac(db)
        finally:
            db.close()
        if settings.APP_ENV != "prod":
            seed_sample_data()
    except Exception as exc:
        print(f"Initial data seeding skipped: {exc}")

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/health")
def api_health_check():
    return {"status": "ok", "service": "gpap"}


@app.get("/", include_in_schema=False)
def index():
    return FileResponse(FRONTEND_DIR / "index.html")


app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR), html=False), name="static")


import uvicorn
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
