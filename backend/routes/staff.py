from fastapi import APIRouter

router = APIRouter(prefix="/api/staff", tags=["staff"])

@router.get("/")
def get_staff():
    return {
        "staff": [
            {
                "id": "RS",
                "name": "Robert Smith",
                "role": "Senior Technical Trainer",
                "skills": ["Java", "DSA"],
                "assignment": "Genfinix Institute",
                "rating": 4.8,
                "status": "Active"
            },
            {
                "id": "EM",
                "name": "Emily Martinez",
                "role": "Aptitude Specialist",
                "skills": ["Quant", "Logical"],
                "assignment": "Multiple (2)",
                "rating": 4.9,
                "status": "Active",
                "color": "#10b981"
            },
            {
                "id": "AL",
                "name": "Aaron Lee",
                "role": "Account Manager",
                "skills": ["Sales", "Onboarding"],
                "assignment": "None (Leave)",
                "rating": "5 Colleges",
                "status": "On Leave",
                "color": "#f59e0b"
            }
        ]
    }
