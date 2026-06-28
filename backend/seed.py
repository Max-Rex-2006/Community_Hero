import random
from database import SessionLocal, engine
from models import Base, Issue
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)

WARDS = ["Saheed Nagar", "Kharavela Nagar", "Bapuji Nagar",
         "Shastri Nagar", "IRC Village", "Nayapalli", "Patia"]
CATEGORIES = ["pothole", "water", "electrical", "waste"]
STATUSES = ["reported","reported","reported","verified","in_progress","resolved"]

# Bhubaneswar center approx coords
BASE_LAT, BASE_LNG = 20.2961, 85.8245

db = SessionLocal()
for i in range(60):
    issue = Issue(
        title=f"{random.choice(CATEGORIES).title()} issue #{i+1}",
        description="Community reported issue requiring attention.",
        category=random.choice(CATEGORIES),
        severity=random.randint(1, 5),
        status=random.choice(STATUSES),
        latitude=BASE_LAT + random.uniform(-0.08, 0.08),
        longitude=BASE_LNG + random.uniform(-0.08, 0.08),
        ward=random.choice(WARDS),
        upvotes=random.randint(0, 8),
        created_at=datetime.utcnow() - timedelta(days=random.randint(0,90))
    )
    db.add(issue)
db.commit(); db.close()
print("Seeded 60 issues.")