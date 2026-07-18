# GPAP - Genfinix Placement & Assessment Platform

This workspace now contains a starter full-stack MVP for a multi-college placement and assessment platform.

## What is included
- Frontend: responsive white/blue luxury UI with login and role-based dashboard experience
- Backend: FastAPI application with auth, dashboard, and content APIs
- Database: MySQL schema starter for colleges, users, and assessments
- Structure: separate frontend, backend, and database folders

## Run locally
1. Open a terminal in the backend folder.
2. Install dependencies with Python 3.10:
   - `py -3.10 -m pip install -r requirements.txt`
3. Start the backend:
   - `py -3.10 -m uvicorn app.main:app --host 127.0.0.1 --port 8000`
4. Open the frontend in the browser at:
   - `http://127.0.0.1:8000/`

## Demo login
- Institute: `GENFINIX`
- Email: `student@genfinix.com`
- Password: `admin123`

## Next planned enhancements
- Real MySQL integration with SQLAlchemy models
- JWT-protected role-based pages
- MCQ timer and answer submission flow
- Coding compiler integration
- AI proctoring and anti-cheating scoring
- Placement module and reporting dashboards

