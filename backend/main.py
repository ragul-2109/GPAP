from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from routes import auth, content, dashboard, colleges, staff, students, tests, questions, student_test, analytics, reports

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
