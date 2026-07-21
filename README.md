# GPAP - Genfinix Placement & Assessment Platform

GPAP is a full-stack placement and assessment platform for colleges, staff, and students. The current version includes a FastAPI backend, a browser-based frontend shell, JWT authentication, role-based dashboards, and a MySQL-oriented database configuration.

## What is included
- Frontend: responsive login page, role-aware dashboard layout, and role-specific navigation for student, staff/admin, and super-admin flows
- Backend: FastAPI application with authentication, colleges, dashboard, content, analytics, reports, and RBAC-related routes
- Database: SQLAlchemy models with MySQL-first configuration and SQLite fallback for local development when MySQL is unavailable
- Project structure: separate frontend, backend, and database folders for maintainability

## Current features
- Student, staff/admin, and super-admin access from a unified login experience
- JWT-based login and profile loading
- College listing and role-based dashboard routing
- Seeded demo users for local development
- MySQL configuration support via environment variables

## Local setup
1. Create and activate a Python environment.
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Copy the example environment file and update values if needed:
   - `copy .env.example .env`
4. Start the backend from the backend folder:
   - `cd backend`
   - `python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload`
5. Open the app in your browser:
   - `http://127.0.0.1:8000/`

## Demo credentials
The local seed flow creates demo accounts that can be used for testing.

- Student: `student@gmail.com` / `student123`
- Staff: `staff@gmail.com` / `staff123`
- College admin / staff admin: `management@gmail.com` / `management123`
- Super admin: `genfinix@gmail.com` / `genfinix123`

## Environment variables
The app reads MySQL values from the environment file. The default example uses:
- Host: `127.0.0.1`
- Port: `3306`
- Database: `gpap`
- User: `gpap`
- Password: `gpap123`

## Notes
- The backend currently attempts MySQL first and falls back to SQLite only when MySQL is unavailable.
- The frontend is served from the FastAPI app, so opening the root URL loads the SPA shell and routes through the backend APIs.

## Next steps
- Finish full MySQL schema initialization and migrations
- Expand role-specific pages and data modules
- Improve reporting, analytics, and test management workflows

