import google.generativeai as genai
from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Issue
import os, json
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

router = APIRouter(prefix="/ai", tags=["ai"])

# ── 1. Image classification ──────────────────────────────
CLASSIFY_PROMPT = """
Analyse this image of a civic infrastructure issue in India.
Return ONLY valid JSON with these exact keys:
{
  "category": one of ["pothole","water","electrical","waste","other"],
  "severity": integer 1-5 (5 = most severe),
  "description": one sentence describing the issue,
  "department": the govt department responsible,
  "affected_area": rough area estimate in sq meters
}
No preamble, no markdown, only the JSON object.
"""

@router.post("/classify")
async def classify_image(image: UploadFile = File(...)):
    contents = await image.read()
    pil_image = Image.open(io.BytesIO(contents))
    response = model.generate_content([CLASSIFY_PROMPT, pil_image])
    raw = response.text.strip()
    try:
        return json.loads(raw)
    except Exception:
        return {"category": "other", "severity": 3,
                "description": raw[:100], "department": "Municipal Corp"}


# ── 2. Complaint letter generator ───────────────────────
@router.get("/complaint/{issue_id}")
async def generate_complaint(issue_id: int, db: Session = Depends(get_db)):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    prompt = f"""
Write a formal civic complaint letter to the {issue.ward} ward office.
Issue: {issue.title}
Category: {issue.category}
Severity: {issue.severity}/5
Description: {issue.description}
Location: lat {issue.latitude}, lng {issue.longitude}
Report ID: CH-{issue.id:04d}
Date: {issue.created_at.strftime('%d %B %Y')}

Write a professional 3-paragraph letter in English.
Include the report ID and request a response within 7 days.
"""
    response = model.generate_content(prompt)
    return {"letter": response.text, "issue_id": issue_id}


# ── 3. Predictive hotspot endpoint ───────────────────────
@router.get("/hotspots")
async def predict_hotspots(db: Session = Depends(get_db)):
    issues = db.query(Issue).all()

    grid = {}
    for i in issues:
        cell = (round(i.latitude, 2), round(i.longitude, 2))
        grid[cell] = grid.get(cell, 0) + 1

    hotspots = [
        {
            "lat": lat,
            "lng": lng,
            "count": count,
            "risk": "high" if count >= 4 else "medium"
        }
        for (lat, lng), count in grid.items() if count >= 2
    ]
    return sorted(hotspots, key=lambda x: -x["count"])[:10]