from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from models import Issue

router = APIRouter(prefix="/issues", tags=["issues"])

@router.get("/")
def list_issues(db: Session = Depends(get_db)):
    return db.query(Issue).order_by(Issue.created_at.desc()).all()

@router.get("/{issue_id}")
def get_issue(issue_id: int, db: Session = Depends(get_db)):
    return db.query(Issue).filter(Issue.id == issue_id).first()

@router.post("/")
async def create_issue(
    title: str = Form(...),
    description: str = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    ward: str = Form(...),
    reporter_name: str = Form("Anonymous"),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if image:
        contents = await image.read()
        path = f"uploads/{image.filename}"
        with open(path, "wb") as f:
            f.write(contents)
        image_url = f"/static/{image.filename}"

    issue = Issue(
        title=title, description=description,
        latitude=latitude, longitude=longitude,
        ward=ward, reporter_name=reporter_name,
        image_url=image_url
    )
    db.add(issue); db.commit(); db.refresh(issue)
    return issue

@router.patch("/{issue_id}/upvote")
def upvote(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    issue.upvotes += 1
    if issue.upvotes >= 3 and issue.status == "reported":
        issue.status = "verified"
    db.commit(); return issue

@router.patch("/{issue_id}/status")
def update_status(issue_id: int, status: str, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()
    issue.status = status
    db.commit(); return issue

@router.get("/stats/summary")
def get_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    total = db.query(func.count(Issue.id)).scalar()
    resolved = db.query(func.count(Issue.id)).filter(Issue.status=="resolved").scalar()
    by_category = db.query(Issue.category, func.count(Issue.id))\
                    .group_by(Issue.category).all()
    by_ward = db.query(Issue.ward, func.count(Issue.id))\
                .group_by(Issue.ward)\
                .order_by(func.count(Issue.id).desc()).all()
    return {
        "total": total,
        "resolved": resolved,
        "open": total - resolved,
        "resolution_rate": round((resolved/total)*100) if total else 0,
        "by_category": [{"name":c,"count":n} for c,n in by_category],
        "by_ward": [{"ward":w,"count":n} for w,n in by_ward]
    }