"""
Demo Seed Data Generator for MediKiosk.
Populates realistic synthetic Indian patient records for judging & testing without live external dependencies.
"""

import json
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import (
    Patient, Consent, Encounter, ChiefComplaint, Document,
    Medication, Investigation, ClinicalTimeline, ClinicalSummary, AuditLog
)

def seed_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Patient).filter(Patient.is_demo == True).count() > 0:
            print("Database already seeded with demo patients.")
            return

        print("Seeding synthetic patient records...")

        # ----------------------------------------------------
        # DEMO PATIENT 01: Ravi Kumar (Abdominal Pain)
        # ----------------------------------------------------
        p1 = Patient(
            abha_id="91-2345-6789-0001",
            name="Ravi Kumar",
            age=42,
            gender="Male",
            mobile="+91 98765 43210",
            is_demo=True
        )
        db.add(p1)
        db.commit()
        db.refresh(p1)

        c1 = Consent(patient_id=p1.id, granted=True, scope="OPD_CONSULTATION")
        db.add(c1)

        d1 = Document(
            patient_id=p1.id,
            file_name="Prescription_Jul2026.pdf",
            doc_type="Prescription",
            file_size=245000,
            storage_path="/uploaded_files/p1_prescription.pdf",
            ocr_status="PROCESSED",
            ocr_extracted_json=json.dumps({
                "document_type": "Prescription",
                "diagnoses": [{"field_name": "Diagnosis", "value": "Acute Gastritis", "confidence": 0.94}],
                "medications": [
                    {"name": "Paracetamol", "dose": "500 mg", "frequency": "Twice daily (BD)", "confidence": 0.96, "needs_verification": False},
                    {"name": "Omeprazole", "dose": "20 mg", "frequency": "Once daily (OD)", "confidence": 0.95, "needs_verification": False}
                ]
            })
        )
        d2 = Document(
            patient_id=p1.id,
            file_name="Blood_Report_Aug2026.pdf",
            doc_type="Lab Report",
            file_size=180000,
            storage_path="/uploaded_files/p1_blood.pdf",
            ocr_status="PROCESSED",
            ocr_extracted_json=json.dumps({
                "document_type": "Laboratory Report",
                "fields": [
                    {"field_name": "Hemoglobin (Hb)", "value": "12.4", "unit": "g/dL", "confidence": 0.96, "needs_verification": False, "status_flag": "NORMAL"},
                    {"field_name": "Fasting Blood Sugar", "value": "102", "unit": "mg/dL", "confidence": 0.94, "needs_verification": False, "status_flag": "NORMAL"},
                    {"field_name": "Platelet Count", "value": "210,000", "unit": "/uL", "confidence": 0.74, "needs_verification": True, "status_flag": "NORMAL"}
                ]
            })
        )
        d3_p1 = Document(
            patient_id=p1.id,
            file_name="Chest_XRay_Radiology_Summary_Jun2026.pdf",
            doc_type="Radiology",
            file_size=210000,
            storage_path="/uploaded_files/p1_xray.pdf",
            ocr_status="PROCESSED",
            ocr_extracted_json=json.dumps({
                "document_type": "Radiology Report",
                "fields": [
                    {"field_name": "Radiology Finding", "value": "Normal Lung Fields", "unit": "No active infiltrate", "confidence": 0.92, "needs_verification": False}
                ]
            })
        )
        db.add_all([d1, d2, d3_p1])
        db.commit()

        # Meds & Investigations
        m1 = Medication(patient_id=p1.id, name="Paracetamol", dose="500 mg", frequency="Twice daily", source_doc_id=d1.id)
        m2 = Medication(patient_id=p1.id, name="Omeprazole", dose="20 mg", frequency="Once daily", source_doc_id=d1.id)
        inv1 = Investigation(patient_id=p1.id, test_name="Hemoglobin (Hb)", value="12.4", unit="g/dL", status_flag="NORMAL", test_date="Aug 2026", confidence=0.96, source_doc_id=d2.id)
        inv2 = Investigation(patient_id=p1.id, test_name="Fasting Blood Sugar", value="102", unit="mg/dL", status_flag="NORMAL", test_date="Aug 2026", confidence=0.94, source_doc_id=d2.id)
        db.add_all([m1, m2, inv1, inv2])

        # Timeline
        t1 = ClinicalTimeline(patient_id=p1.id, event_date="Aug 2026", event_type="Blood Test", title="Laboratory Investigation", description="Hb: 12.4 g/dL | Fasting Glucose: 102 mg/dL", source_doc_id=d2.id)
        t2 = ClinicalTimeline(patient_id=p1.id, event_date="Jul 2026", event_type="Prescription", title="OPD Prescription", description="Paracetamol 500 mg BD, Omeprazole 20 mg OD", source_doc_id=d1.id)
        t3 = ClinicalTimeline(patient_id=p1.id, event_date="May 2026", event_type="Diagnosis", title="Viral Gastritis", description="Treated conservatively with oral fluids and antacids.", source_doc_id=None)
        db.add_all([t1, t2, t3])

        # Encounter & Complaint
        e1 = Encounter(patient_id=p1.id, status="IN_PROGRESS", chief_complaint_summary="Upper Abdominal Pain")
        db.add(e1)
        db.commit()

        cc1 = ChiefComplaint(
            encounter_id=e1.id,
            complaint="Abdominal pain",
            duration="1 day",
            location="Upper abdomen",
            severity="Moderate",
            associated_symptoms_json=json.dumps(["Fever", "Nausea"]),
            medications_json=json.dumps(["Omeprazole 20mg"])
        )
        db.add(cc1)

        # ----------------------------------------------------
        # DEMO PATIENT 02: Priya Sharma (Persistent Cough & Fever)
        # ----------------------------------------------------
        p2 = Patient(
            abha_id="91-2345-6789-0002",
            name="Priya Sharma",
            age=36,
            gender="Female",
            mobile="+91 98123 45678",
            is_demo=True
        )
        db.add(p2)
        db.commit()

        db.add(Consent(patient_id=p2.id, granted=True))
        
        d3 = Document(
            patient_id=p2.id,
            file_name="Chest_XRay_Report.pdf",
            doc_type="Lab Report",
            file_size=310000,
            storage_path="/uploaded_files/p2_xray.pdf",
            ocr_status="PROCESSED",
            ocr_extracted_json=json.dumps({
                "document_type": "Radiology Report",
                "diagnoses": [{"field_name": "Impression", "value": "Mild Bronchial Infiltration", "confidence": 0.91}]
            })
        )
        db.add(d3)
        db.commit()

        db.add(ClinicalTimeline(patient_id=p2.id, event_date="Jun 2026", event_type="Diagnosis", title="Acute Bronchitis", description="Prescribed Azithromycin 500mg OD x 5 days", source_doc_id=d3.id))

        e2 = Encounter(patient_id=p2.id, status="IN_PROGRESS", chief_complaint_summary="Persistent Cough & Fever")
        db.add(e2)
        db.commit()
        db.add(ChiefComplaint(encounter_id=e2.id, complaint="Persistent cough with low grade fever", duration="4 days", location="Chest", severity="Moderate", associated_symptoms_json=json.dumps(["Cough", "Fever"])))

        # ----------------------------------------------------
        # DEMO PATIENT 03: Suresh Patel (Hypertension Follow-up)
        # ----------------------------------------------------
        p3 = Patient(
            abha_id="91-2345-6789-0003",
            name="Suresh Patel",
            age=58,
            gender="Male",
            mobile="+91 97111 22233",
            is_demo=True
        )
        db.add(p3)
        db.commit()
        db.add(Consent(patient_id=p3.id, granted=True))
        
        db.add(ClinicalTimeline(patient_id=p3.id, event_date="Aug 2026", event_type="Blood Test", title="HbA1c & Lipid Profile", description="HbA1c: 7.2% | Total Cholesterol: 195 mg/dL"))
        db.add(ClinicalTimeline(patient_id=p3.id, event_date="Apr 2026", event_type="Prescription", title="Hypertension & Diabetes Meds", description="Metformin 500mg BD, Amlodipine 5mg OD"))

        e3 = Encounter(patient_id=p3.id, status="IN_PROGRESS", chief_complaint_summary="Routine Diabetes & BP Checkup")
        db.add(e3)

        db.commit()
        print("Demo synthetic patient database successfully seeded!")

    except Exception as err:
        print(f"Error seeding DB: {err}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
