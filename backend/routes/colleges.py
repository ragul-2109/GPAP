from fastapi import APIRouter

router = APIRouter(prefix="/api/colleges", tags=["colleges"])

@router.get("/")
def get_colleges():
    return {
        "colleges": [
            {
                "id": "GENFINIX",
                "name": "Genfinix Institute",
                "location": "New York, NY",
                "students": 1250,
                "plan": "Enterprise",
                "status": "Active"
            },
            {
                "id": "XYZTECH",
                "name": "XYZ Tech University",
                "location": "San Francisco, CA",
                "students": 4500,
                "plan": "Pro",
                "status": "Active"
            },
            {
                "id": "GEC_TX",
                "name": "Global Engineering College",
                "location": "Austin, TX",
                "students": 850,
                "plan": "Basic",
                "status": "Inactive"
            }
        ]
    }
