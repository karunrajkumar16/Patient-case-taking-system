from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class PatientBase(BaseModel):
    abha_id: str
    name: str
    age: int
    gender: str
    mobile: Optional[str] = None
    is_demo: bool = False

class PatientCreate(PatientBase):
    pass

class PatientOut(PatientBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ConsentCreate(BaseModel):
    patient_id: int
    granted: bool
    scope: Optional[str] = "OPD_CONSULTATION"

class ConsentOut(BaseModel):
    id: int
    patient_id: int
    granted: bool
    granted_at: datetime
    scope: str
    privacy_notice_accepted: bool
    class Config:
        from_attributes = True

class DialogueTurn(BaseModel):
    sender: str  # "PATIENT" or "SYSTEM"
    message: str

class CaseTakingRequest(BaseModel):
    encounter_id: int
    patient_id: int
    user_input: str
    conversation_history: List[DialogueTurn] = []

class AdaptiveQuestionResponse(BaseModel):
    question: str
    is_complete: bool
    extracted_data: Dict[str, Any]

class DocumentOut(BaseModel):
    id: int
    patient_id: int
    file_name: str
    doc_type: str
    file_size: Optional[int] = None
    storage_path: str
    ocr_status: str
    uploaded_at: datetime
    ocr_extracted: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

class ExtractedClinicalField(BaseModel):
    field_name: str
    value: str
    dose: Optional[str] = None
    frequency: Optional[str] = None
    confidence: float
    needs_verification: bool
    unit: Optional[str] = None

class TimelineItem(BaseModel):
    id: int
    event_date: str
    event_type: str
    title: str
    description: str
    source_doc_id: Optional[int] = None
    structured_payload: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

class SummaryGenerateRequest(BaseModel):
    encounter_id: int
    patient_id: int

class SummaryVerifyRequest(BaseModel):
    summary_id: int
    action: str # "ACCEPT", "EDIT", "REJECT"
    doctor_notes: Optional[str] = None
    edited_summary_text: Optional[str] = None
    doctor_id: Optional[str] = "DR_VERIFIED_01"

class ClinicalSummaryOut(BaseModel):
    id: int
    encounter_id: int
    patient_id: int
    structured_json: Dict[str, Any]
    formatted_text: str
    status: str
    red_flags: List[Dict[str, str]] = []
    created_at: datetime
    verified_at: Optional[datetime] = None
    doctor_notes: Optional[str] = None
    class Config:
        from_attributes = True

class RedFlagItem(BaseModel):
    symptom: str
    severity: str
    warning_message: str
    action_required: str

class AuditLogOut(BaseModel):
    id: int
    timestamp: datetime
    actor_role: str
    action: str
    entity_type: str
    entity_id: str
    details: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    today_cases_count: int
    documents_processed_count: int
    pending_doctor_reviews_count: int
    verified_summaries_count: int
