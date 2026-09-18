import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    abha_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    mobile = Column(String, nullable=True)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    consents = relationship("Consent", back_populates="patient")
    encounters = relationship("Encounter", back_populates="patient")
    documents = relationship("Document", back_populates="patient")
    medications = relationship("Medication", back_populates="patient")
    investigations = relationship("Investigation", back_populates="patient")
    timelines = relationship("ClinicalTimeline", back_populates="patient")
    summaries = relationship("ClinicalSummary", back_populates="patient")

class Consent(Base):
    __tablename__ = "consents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    granted = Column(Boolean, default=False)
    granted_at = Column(DateTime, default=datetime.datetime.utcnow)
    scope = Column(String, default="OPD_CONSULTATION")
    privacy_notice_accepted = Column(Boolean, default=True)

    patient = relationship("Patient", back_populates="consents")

class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    encounter_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="IN_PROGRESS") # IN_PROGRESS, PENDING_REVIEW, DOCTOR_VERIFIED
    chief_complaint_summary = Column(String, nullable=True)

    patient = relationship("Patient", back_populates="encounters")
    chief_complaints = relationship("ChiefComplaint", back_populates="encounter")
    clinical_summary = relationship("ClinicalSummary", back_populates="encounter", uselist=False)

class ChiefComplaint(Base):
    __tablename__ = "chief_complaints"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), nullable=False)
    complaint = Column(String, nullable=False)
    duration = Column(String, nullable=True)
    location = Column(String, nullable=True)
    severity = Column(String, nullable=True)
    associated_symptoms_json = Column(Text, nullable=True) # JSON string
    medications_json = Column(Text, nullable=True) # JSON string
    dialogue_json = Column(Text, nullable=True) # Raw Q&A transcript

    encounter = relationship("Encounter", back_populates="chief_complaints")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    file_name = Column(String, nullable=False)
    doc_type = Column(String, nullable=False) # Prescription, Lab Report, Discharge Summary
    file_size = Column(Integer, nullable=True)
    storage_path = Column(String, nullable=False)
    ocr_status = Column(String, default="PROCESSED") # PENDING, PROCESSING, PROCESSED, FAILED
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    ocr_extracted_json = Column(Text, nullable=True) # JSON string of extracted entities & confidence

    patient = relationship("Patient", back_populates="documents")

class Medication(Base):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    name = Column(String, nullable=False)
    dose = Column(String, nullable=False)
    frequency = Column(String, nullable=False)
    source_doc_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    patient = relationship("Patient", back_populates="medications")

class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    test_name = Column(String, nullable=False)
    value = Column(String, nullable=False)
    unit = Column(String, nullable=True)
    status_flag = Column(String, default="NORMAL") # NORMAL, HIGH, LOW, CRITICAL
    test_date = Column(String, nullable=False)
    confidence = Column(Float, default=0.95)
    source_doc_id = Column(Integer, ForeignKey("documents.id"), nullable=True)

    patient = relationship("Patient", back_populates="investigations")

class ClinicalTimeline(Base):
    __tablename__ = "clinical_timelines"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    event_date = Column(String, nullable=False) # e.g. "Aug 2026", "2026-08-15"
    event_type = Column(String, nullable=False) # Diagnosis, Blood Test, Prescription, Lab Investigation
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    structured_payload_json = Column(Text, nullable=True)
    source_doc_id = Column(Integer, ForeignKey("documents.id"), nullable=True)

    patient = relationship("Patient", back_populates="timelines")

class ClinicalSummary(Base):
    __tablename__ = "clinical_summaries"

    id = Column(Integer, primary_key=True, index=True)
    encounter_id = Column(Integer, ForeignKey("encounters.id"), nullable=False)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    structured_json = Column(Text, nullable=False)
    formatted_text = Column(Text, nullable=False)
    status = Column(String, default="PENDING_DOCTOR_REVIEW") # PENDING_DOCTOR_REVIEW, DOCTOR_VERIFIED, REJECTED
    red_flags_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)
    doctor_notes = Column(Text, nullable=True)

    encounter = relationship("Encounter", back_populates="clinical_summary")
    patient = relationship("Patient", back_populates="summaries")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    actor_role = Column(String, nullable=False) # PATIENT, SYSTEM_OCR, SYSTEM_AI, DOCTOR
    action = Column(String, nullable=False) # CONSENT_GIVEN, QUESTIONNAIRE_SUBMITTED, DOCUMENT_UPLOADED, SUMMARY_GENERATED, SUMMARY_ACCEPTED, SUMMARY_EDITED, SUMMARY_REJECTED
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    details_json = Column(Text, nullable=True)
