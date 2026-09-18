"""
Documents & OCR Processing Router.
Handles uploading PDFs/images, running PaddleOCR/clinical extraction, returning confidence scores,
and re-processing documents by ID.
"""

import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Document, Investigation, Medication, ClinicalTimeline
from app.schemas import DocumentOut
from app.pipelines.ocr_pipeline import process_document_ocr
from app.services.storage_service import upload_patient_document
from app.services.redis_service import set_processing_status, get_processing_status
from app.services.audit_service import record_audit_log
from typing import List

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("/patient/{patient_id}", response_model=List[DocumentOut])
def get_patient_documents(patient_id: int, db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.patient_id == patient_id).all()
    result = []
    for d in docs:
        ocr_extracted = json.loads(d.ocr_extracted_json) if d.ocr_extracted_json else None
        result.append(DocumentOut(
            id=d.id,
            patient_id=d.patient_id,
            file_name=d.file_name,
            doc_type=d.doc_type,
            file_size=d.file_size,
            storage_path=d.storage_path,
            ocr_status=d.ocr_status,
            uploaded_at=d.uploaded_at,
            ocr_extracted=ocr_extracted
        ))
    return result

@router.post("/upload")
async def upload_document(
    patient_id: int = Form(...),
    doc_type: str = Form("Prescription"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_bytes = await file.read()
    storage_info = upload_patient_document(file_bytes, file.filename, patient_id)

    # Process OCR Extraction
    ocr_result = process_document_ocr(file.filename, doc_type, file_bytes)

    doc = Document(
        patient_id=patient_id,
        file_name=file.filename,
        doc_type=doc_type,
        file_size=storage_info["file_size"],
        storage_path=storage_info["storage_path"],
        ocr_status="PROCESSED",
        ocr_extracted_json=json.dumps(ocr_result)
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    set_processing_status(f"doc:{doc.id}", "COMPLETED", ocr_result)

    # Create associated clinical items from extracted fields
    for field in ocr_result.get("fields", []):
        inv = Investigation(
            patient_id=patient_id,
            test_name=field["field_name"],
            value=field["value"],
            unit=field.get("unit"),
            status_flag=field.get("status_flag", "NORMAL"),
            test_date="Aug 2026",
            confidence=field["confidence"],
            source_doc_id=doc.id
        )
        db.add(inv)

    for med in ocr_result.get("medications", []):
        m = Medication(
            patient_id=patient_id,
            name=med["name"],
            dose=med.get("dose", "N/A"),
            frequency=med.get("frequency", "N/A"),
            source_doc_id=doc.id
        )
        db.add(m)

    # Create timeline entry
    timeline = ClinicalTimeline(
        patient_id=patient_id,
        event_date="Aug 2026",
        event_type=doc_type,
        title=f"Uploaded {doc_type}: {file.filename}",
        description=f"Extracted {len(ocr_result.get('medications', []))} meds, {len(ocr_result.get('fields', []))} lab values.",
        source_doc_id=doc.id,
        structured_payload_json=json.dumps(ocr_result)
    )
    db.add(timeline)

    db.commit()

    record_audit_log(
        db,
        actor_role="PATIENT",
        action="DOCUMENT_UPLOADED",
        entity_type="Document",
        entity_id=str(doc.id),
        details={"file_name": file.filename, "ocr_status": "PROCESSED"}
    )

    return {
        "id": doc.id,
        "file_name": doc.file_name,
        "doc_type": doc.doc_type,
        "ocr_status": doc.ocr_status,
        "ocr_extracted": ocr_result
    }

@router.post("/{doc_id}/process")
def process_document_by_id(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    ocr_result = process_document_ocr(doc.file_name, doc.doc_type)
    doc.ocr_status = "PROCESSED"
    doc.ocr_extracted_json = json.dumps(ocr_result)
    db.commit()

    set_processing_status(f"doc:{doc.id}", "COMPLETED", ocr_result)

    record_audit_log(
        db,
        actor_role="SYSTEM_OCR",
        action="DOCUMENT_PROCESSED",
        entity_type="Document",
        entity_id=str(doc.id),
        details={"file_name": doc.file_name}
    )

    return {
        "id": doc.id,
        "file_name": doc.file_name,
        "doc_type": doc.doc_type,
        "ocr_status": doc.ocr_status,
        "ocr_extracted": ocr_result
    }
