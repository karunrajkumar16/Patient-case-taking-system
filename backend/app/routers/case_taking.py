"""
Case Taking Router.
Handles patient conversational questionnaire interface, adaptive follow-ups, and structured field extraction.
"""

import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Encounter, ChiefComplaint
from app.schemas import CaseTakingRequest, AdaptiveQuestionResponse
from app.services.ollama_service import generate_case_taking_followup
from app.services.redis_service import set_session_state, get_session_state
from app.services.audit_service import record_audit_log
from typing import Dict, Any

router = APIRouter(prefix="/api/case-taking", tags=["Case Taking"])

@router.get("/encounter/{encounter_id}")
def get_case_taking_session(encounter_id: int, db: Session = Depends(get_db)):
    complaint = db.query(ChiefComplaint).filter(ChiefComplaint.encounter_id == encounter_id).first()
    if not complaint:
        return {
            "encounter_id": encounter_id,
            "dialogue": [],
            "extracted_data": {
                "chief_complaint": "Not recorded yet",
                "duration": "Not specified",
                "location": "Not specified",
                "severity": "Not specified",
                "associated_symptoms": [],
                "medical_history": [],
                "medications": []
            }
        }
    
    dialogue = json.loads(complaint.dialogue_json) if complaint.dialogue_json else []
    extracted = {
        "chief_complaint": complaint.complaint,
        "duration": complaint.duration,
        "location": complaint.location,
        "severity": complaint.severity,
        "associated_symptoms": json.loads(complaint.associated_symptoms_json) if complaint.associated_symptoms_json else [],
        "medical_history": ["Previous gastritis (May 2026)"],
        "medications": json.loads(complaint.medications_json) if complaint.medications_json else []
    }
    return {"encounter_id": encounter_id, "dialogue": dialogue, "extracted_data": extracted}

@router.post("/questions", response_model=AdaptiveQuestionResponse)
async def process_questionnaire_step(payload: CaseTakingRequest, db: Session = Depends(get_db)):
    history_dicts = [{"sender": t.sender, "message": t.message} for t in payload.conversation_history]
    
    res = await generate_case_taking_followup(payload.user_input, history_dicts)
    extracted = res["extracted_data"]
    if "medical_history" not in extracted:
        extracted["medical_history"] = ["Previous gastritis (May 2026)"]

    # Save to Redis session state
    set_session_state(f"case_taking:{payload.encounter_id}", extracted)

    # Retrieve or create Encounter
    encounter = db.query(Encounter).filter(Encounter.id == payload.encounter_id).first()
    if not encounter:
        encounter = Encounter(
            patient_id=payload.patient_id,
            status="IN_PROGRESS",
            chief_complaint_summary=extracted.get("chief_complaint")
        )
        db.add(encounter)
        db.commit()
        db.refresh(encounter)

    # Save or update ChiefComplaint record
    complaint = db.query(ChiefComplaint).filter(ChiefComplaint.encounter_id == encounter.id).first()
    if not complaint:
        complaint = ChiefComplaint(
            encounter_id=encounter.id,
            complaint=extracted.get("chief_complaint", "Unspecified"),
            duration=extracted.get("duration"),
            location=extracted.get("location"),
            severity=extracted.get("severity"),
            associated_symptoms_json=json.dumps(extracted.get("associated_symptoms", [])),
            medications_json=json.dumps(extracted.get("medications", [])),
            dialogue_json=json.dumps(history_dicts + [{"sender": "PATIENT", "message": payload.user_input}])
        )
        db.add(complaint)
    else:
        complaint.complaint = extracted.get("chief_complaint", complaint.complaint)
        complaint.duration = extracted.get("duration", complaint.duration)
        complaint.location = extracted.get("location", complaint.location)
        complaint.severity = extracted.get("severity", complaint.severity)
        complaint.associated_symptoms_json = json.dumps(extracted.get("associated_symptoms", []))
        complaint.medications_json = json.dumps(extracted.get("medications", []))
        complaint.dialogue_json = json.dumps(history_dicts + [{"sender": "PATIENT", "message": payload.user_input}])
    
    db.commit()

    record_audit_log(
        db,
        actor_role="PATIENT",
        action="QUESTIONNAIRE_SUBMITTED",
        entity_type="ChiefComplaint",
        entity_id=str(complaint.id),
        details=extracted
    )

    return AdaptiveQuestionResponse(
        question=res["question"],
        is_complete=res["is_complete"],
        extracted_data=extracted
    )

@router.post("")
async def case_taking_base_alias(payload: CaseTakingRequest, db: Session = Depends(get_db)):
    return await process_questionnaire_step(payload, db)
