"""
Consent Router.
Stores patient consent in PostgreSQL / SQLite.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Consent
from app.schemas import ConsentCreate, ConsentOut
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/api/consent", tags=["Consent"])

@router.post("", response_model=ConsentOut)
def record_consent(payload: ConsentCreate, db: Session = Depends(get_db)):
    consent = db.query(Consent).filter(Consent.patient_id == payload.patient_id).first()
    if consent:
        consent.granted = payload.granted
    else:
        consent = Consent(
            patient_id=payload.patient_id,
            granted=payload.granted,
            scope=payload.scope or "OPD_CONSULTATION"
        )
        db.add(consent)
    
    db.commit()
    db.refresh(consent)

    record_audit_log(
        db,
        actor_role="PATIENT",
        action="CONSENT_GIVEN" if payload.granted else "CONSENT_WITHDRAWN",
        entity_type="Consent",
        entity_id=str(consent.id),
        details={"patient_id": payload.patient_id, "scope": consent.scope}
    )

    return consent

@router.get("/patient/{patient_id}", response_model=ConsentOut)
def get_patient_consent(patient_id: int, db: Session = Depends(get_db)):
    consent = db.query(Consent).filter(Consent.patient_id == patient_id).first()
    if not consent:
        # Default placeholder consent record if not granted yet
        return ConsentOut(
            id=0,
            patient_id=patient_id,
            granted=False,
            granted_at=None,
            scope="OPD_CONSULTATION",
            privacy_notice_accepted=False
        )
    return consent
