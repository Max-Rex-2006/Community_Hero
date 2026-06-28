from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Issue(Base):
    __tablename__ = "issues"
    id            = Column(Integer, primary_key=True, index=True)
    title         = Column(String)
    description   = Column(String)
    category      = Column(String)        # pothole / water / electrical / waste
    severity      = Column(Integer)       # 1-5, set by Gemini
    status        = Column(String, default="reported")  # reported/verified/in_progress/resolved
    latitude      = Column(Float)
    longitude     = Column(Float)
    ward          = Column(String)
    image_url     = Column(String, nullable=True)
    ai_label      = Column(String, nullable=True)     # raw Gemini response
    upvotes       = Column(Integer, default=0)
    reporter_name = Column(String, default="Anonymous")
    created_at    = Column(DateTime, default=datetime.utcnow)
    resolved_at   = Column(DateTime, nullable=True)