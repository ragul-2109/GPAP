from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import College

router = APIRouter(prefix="/api/colleges", tags=["colleges"])


@router.get("/")
def get_colleges(db: Session = Depends(get_db)):
    try:
        colleges = db.query(College).order_by(College.name).all()
    except Exception as exc:
        print(f"Unable to load colleges: {exc}")
        return {"colleges": []}

    return {
        "colleges": [
            {
                "id": college.code,
                "code": college.code,
                "name": college.name,
                "location": college.domain or "",
                "status": "Active" if college.is_active else "Inactive",
            }
            for college in colleges
        ]
    }
