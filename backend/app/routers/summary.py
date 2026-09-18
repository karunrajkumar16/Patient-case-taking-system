"""
Clinical Summary Router.
Generates structured doctor-ready clinical summaries, handles red-flag safety analysis,
and provides verification API alias.
"""

import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient, Encounter, ChiefComplaint, ClinicalTimeline, Document, ClinicalSummary
from app.schemas import SummaryGenerateRequest, SummaryVerifyRequest, ClinicalSummaryOut
from app.services.ollama_service import generate_clinical_summary
from app.pipelines.red_flag_engine import detect_red_flags
from app.services.audit_service import record_audit_log

router = APIRouter(prefix="/api/summary", tags=["Clinical Summary"])

@router.post("/generate", response_model=ClinicalSummaryOut)
async def generate_summary(payload: SummaryGenerateRequest, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    encounter = db.query(Encounter).filter(Encounter.id == payload.encounter_id).first()
    if not encounter:
        encounter = Encounter(patient_id=patient.id, status="IN_PROGRESS")
        db.add(encounter)
        db.commit()
        db.refresh(encounter)

    complaint_rec = db.query(ChiefComplaint).filter(ChiefComplaint.encounter_id == encounter.id).first()
    complaint_data = {
        "chief_complaint": complaint_rec.complaint if complaint_rec else "Abdominal pain",
        "duration": complaint_rec.duration if complaint_rec else "1 day",
        "location": complaint_rec.location if complaint_rec else "Upper abdomen",
        "severity": complaint_rec.severity if complaint_rec else "Moderate",
        "associated_symptoms": json.loads(complaint_rec.associated_symptoms_json) if (complaint_rec and complaint_rec.associated_symptoms_json) else ["Fever"]
    }

    timeline_recs = db.query(ClinicalTimeline).filter(ClinicalTimeline.patient_id == patient.id).all()
    timeline_items = [{"event_type": t.event_type, "title": t.title, "description": t.description, "event_date": t.event_date} for t in timeline_recs]

    doc_recs = db.query(Document).filter(Document.patient_id == patient.id).all()
    docs = [{"file_name": d.file_name, "doc_type": d.doc_type} for d in doc_recs]

    patient_info = {"name": patient.name, "age": patient.age, "gender": patient.gender, "abha_id": patient.abha_id}

    # Generate Clinical Summary
    summary_res = await generate_clinical_summary(patient_info, complaint_data, timeline_items, docs)

    # Detect Red Flags via independent safety rules engine
    full_text_to_scan = f"{complaint_data['chief_complaint']} {summary_res['formatted_text']}"
    red_flags = detect_red_flags(full_text_to_scan, complaint_data)

    existing_summary = db.query(ClinicalSummary).filter(ClinicalSummary.encounter_id == encounter.id).first()
    if existing_summary:
        existing_summary.structured_json = json.dumps(summary_res["structured_json"])
        existing_summary.formatted_text = summary_res["formatted_text"]
        existing_summary.red_flags_json = json.dumps(red_flags)
        summary_obj = existing_summary
    else:
        summary_obj = ClinicalSummary(
            encounter_id=encounter.id,
            patient_id=patient.id,
            structured_json=json.dumps(summary_res["structured_json"]),
            formatted_text=summary_res["formatted_text"],
            status="PENDING_DOCTOR_REVIEW",
            red_flags_json=json.dumps(red_flags)
        )
        db.add(summary_obj)
    
    encounter.status = "PENDING_DOCTOR_REVIEW"
    db.commit()
    db.refresh(summary_obj)

    record_audit_log(
        db,
        actor_role="SYSTEM_AI",
        action="SUMMARY_GENERATED",
        entity_type="ClinicalSummary",
        entity_id=str(summary_obj.id),
        details={"red_flags_count": len(red_flags)}
    )

    return ClinicalSummaryOut(
        id=summary_obj.id,
        encounter_id=summary_obj.encounter_id,
        patient_id=summary_obj.patient_id,
        structured_json=json.loads(summary_obj.structured_json),
        formatted_text=summary_obj.formatted_text,
        status=summary_obj.status,
        red_flags=red_flags,
        created_at=summary_obj.created_at,
        verified_at=summary_obj.verified_at,
        doctor_notes=summary_obj.doctor_notes
    )

@router.post("/verify", response_model=ClinicalSummaryOut)
def verify_summary_alias(payload: SummaryVerifyRequest, db: Session = Depends(get_db)):
    summary = db.query(ClinicalSummary).filter(ClinicalSummary.id == payload.summary_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Clinical summary not found")

    encounter = db.query(Encounter).filter(Encounter.id == summary.encounter_id).first()
    action = payload.action.upper()

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
        details={"status": summary.status}
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

@router.get("/encounter/{encounter_id}", response_model=ClinicalSummaryOut)
def get_summary_by_encounter(encounter_id: int, db: Session = Depends(get_db)):
    summary = db.query(ClinicalSummary).filter(ClinicalSummary.encounter_id == encounter_id).first()
    if not summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    
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
