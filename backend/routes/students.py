from fastapi import APIRouter

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/")
def get_students():
    return {
        "total": 35400,
        "students": [
            {
                "id": 1,
                "name": "John Doe",
                "email": "john.doe@genfinix.edu",
                "college": "Genfinix Institute",
                "enrolled_date": "Aug 15, 2023",
                "status": "Active"
            },
            {
                "id": 2,
                "name": "Sarah Connor",
                "email": "s.connor@xyztech.edu",
                "college": "XYZ Tech University",
                "enrolled_date": "Sep 02, 2023",
                "status": "Active"
            },
            {
                "id": 3,
                "name": "Marcus Wright",
                "email": "m.wright@xyztech.edu",
                "college": "XYZ Tech University",
                "enrolled_date": "Jan 10, 2023",
                "status": "Suspended"
            }
        ]
    }
