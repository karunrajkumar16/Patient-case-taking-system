"""
Timeline Router.
Provides chronological patient health records timeline.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ClinicalTimeline
from app.schemas import TimelineItem
from typing import List

router = APIRouter(prefix="/api/timeline", tags=["Timeline"])

@router.get("/patient/{patient_id}", response_model=List[TimelineItem])
def get_patient_timeline(patient_id: int, db: Session = Depends(get_db)):
    items = db.query(ClinicalTimeline).filter(ClinicalTimeline.patient_id == patient_id).order_by(ClinicalTimeline.id.desc()).all()
    result = []
    for item in items:
        payload = json.loads(item.structured_payload_json) if item.structured_payload_json else None
        result.append(TimelineItem(
            id=item.id,
            event_date=item.event_date,
            event_type=item.event_type,
            title=item.title,
            description=item.description,
            source_doc_id=item.source_doc_id,
            structured_payload=payload
        ))
    return result
