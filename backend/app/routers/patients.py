"""
Patients Router.
Manages ABHA identification and Demo Patient record loading.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient, Encounter
from app.schemas import PatientOut, PatientCreate
from typing import List

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.get("", response_model=List[PatientOut])
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@router.get("/demo", response_model=List[PatientOut])
def get_demo_patients(db: Session = Depends(get_db)):
    return db.query(Patient).filter(Patient.is_demo == True).all()

@router.get("/{patient_id}", response_model=PatientOut)
def get_patient_by_id(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/lookup", response_model=PatientOut)
def lookup_abha(payload: dict, db: Session = Depends(get_db)):
    abha_id = payload.get("abha_id", "").strip()
    if not abha_id:
        raise HTTPException(status_code=400, detail="ABHA ID is required")
    
    patient = db.query(Patient).filter(Patient.abha_id == abha_id).first()
    if not patient:
        # Create a new patient profile for demo lookup if not existing
        patient = Patient(
            abha_id=abha_id,
            name=f"Patient {abha_id[-4:] if len(abha_id)>=4 else abha_id}",
            age=38,
            gender="Male",
            is_demo=False
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)
    return patient
