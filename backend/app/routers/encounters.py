"""
Encounters Router.
Manages patient clinical encounters, session initialization, and status tracking.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Encounter, Patient
from app.services.redis_service import set_session_state, get_session_state
from app.services.audit_service import record_audit_log
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter(prefix="/api/encounters", tags=["Encounters"])

class EncounterCreate(BaseModel):
    patient_id: int
    chief_complaint_summary: Optional[str] = "Initial Kiosk Consultation"

class EncounterOut(BaseModel):
    id: int
    patient_id: int
    encounter_date: datetime
    status: str
    chief_complaint_summary: Optional[str] = None
    class Config:
        from_attributes = True

@router.post("", response_model=EncounterOut)
def create_or_get_active_encounter(payload: EncounterCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Check for active in-progress encounter
    encounter = db.query(Encounter).filter(
        Encounter.patient_id == patient.id,
        Encounter.status == "IN_PROGRESS"
    ).order_by(Encounter.id.desc()).first()

    if not encounter:
        encounter = Encounter(
            patient_id=patient.id,
            status="IN_PROGRESS",
            chief_complaint_summary=payload.chief_complaint_summary
        )
        db.add(encounter)
        db.commit()
        db.refresh(encounter)

        record_audit_log(
            db,
            actor_role="PATIENT",
            action="ENCOUNTER_CREATED",
            entity_type="Encounter",
            entity_id=str(encounter.id),
            details={"patient_id": patient.id}
        )

    # Store in Redis session state
    set_session_state(f"active_encounter:{patient.id}", {"encounter_id": encounter.id, "status": encounter.status})

    return encounter

@router.get("/patient/{patient_id}", response_model=List[EncounterOut])
def get_patient_encounters(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Encounter).filter(Encounter.patient_id == patient_id).order_by(Encounter.id.desc()).all()

@router.get("/{id}", response_model=EncounterOut)
def get_encounter_by_id(id: int, db: Session = Depends(get_db)):
    encounter = db.query(Encounter).filter(Encounter.id == id).first()
    if not encounter:
        raise HTTPException(status_code=404, detail="Encounter not found")
    return encounter
