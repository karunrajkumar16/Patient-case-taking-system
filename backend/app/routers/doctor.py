"""
Doctor Review & Verification Router.
Allows treating clinicians to review, edit, accept, or reject AI clinical summaries.
Maintains clinical safety and updates audit log.
"""

import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ClinicalSummary, Encounter
from app.schemas import SummaryVerifyRequest, ClinicalSummaryOut
from app.services.audit_service import record_audit_log
from typing import List

router = APIRouter(prefix="/api/doctor", tags=["Doctor Review"])

@router.get("/pending", response_model=List[ClinicalSummaryOut])
def get_pending_reviews(db: Session = Depends(get_db)):
    summaries = db.query(ClinicalSummary).order_by(ClinicalSummary.id.desc()).all()
    result = []
    for summary in summaries:
        red_flags = json.loads(summary.red_flags_json) if summary.red_flags_json else []
        result.append(ClinicalSummaryOut(
            id=summary.id,
            encounter_id=summary.encounter_id,
            patient_id=summary.patient_id,
            structured_json=json.loads(summary.structured_json),
            formatted_text=summary.formatted_text,
            status=summary.status,
            red_flags=red_flags,
            created_at=summary.created_at,
            verified_at=summary.verified_at,
            doctor_notes=summary.doctor_notes
        ))
    return result

@router.post("/verify", response_model=ClinicalSummaryOut)
def verify_summary(payload: SummaryVerifyRequest, db: Session = Depends(get_db)):
    summary = db.query(ClinicalSummary).filter(ClinicalSummary.id == payload.summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Clinical summary not found")

    encounter = db.query(Encounter).filter(Encounter.id == summary.encounter_id).first()

    action = payload.action.upper()
    if action not in ["ACCEPT", "EDIT", "REJECT"]:
        raise HTTPException(status_code=400, detail="Invalid verification action")

    if action in ["ACCEPT", "EDIT"]:
        summary.status = "Doctor Verified"
        if encounter:
            encounter.status = "Doctor Verified"
        if payload.edited_summary_text:
            summary.formatted_text = payload.edited_summary_text
    elif action == "REJECT":
        summary.status = "Rejected — Requires Review"
        if encounter:
            encounter.status = "Rejected — Requires Review"

    summary.verified_at = datetime.utcnow()
    summary.doctor_notes = payload.doctor_notes or f"Doctor action: {action}"
    
    db.commit()
    db.refresh(summary)

    record_audit_log(
        db,
        actor_role="DOCTOR",
        action=f"SUMMARY_{action}",
        entity_type="ClinicalSummary",
        entity_id=str(summary.id),
        details={
            "action": action,
            "status": summary.status,
            "doctor_id": payload.doctor_id or "DR_VERIFIED_01",
            "doctor_notes": summary.doctor_notes
        }
    )

    red_flags = json.loads(summary.red_flags_json) if summary.red_flags_json else []
    return ClinicalSummaryOut(
        id=summary.id,
        encounter_id=summary.encounter_id,
        patient_id=summary.patient_id,
        structured_json=json.loads(summary.structured_json),
        formatted_text=summary.formatted_text,
        status=summary.status,
        red_flags=red_flags,
        created_at=summary.created_at,
        verified_at=summary.verified_at,
        doctor_notes=summary.doctor_notes
    )
