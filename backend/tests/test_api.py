"""
Backend API Unit Tests for MediKiosk.
"""

from fastapi.testclient import TestClient
from app.main import app
from app.pipelines.red_flag_engine import detect_red_flags
from app.pipelines.ocr_pipeline import process_document_ocr

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "RUNNING"

def test_demo_patients():
    response = client.get("/api/patients/demo")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["abha_id"] == "91-2345-6789-0001"

def test_red_flag_engine():
    flags = detect_red_flags("Patient reports severe chest pain and breathlessness")
    assert len(flags) >= 2
    assert flags[0]["severity"] == "CRITICAL"

def test_ocr_pipeline():
    res = process_document_ocr("Prescription_Aug2026.pdf", "Prescription")
    assert "medications" in res
    assert len(res["medications"]) >= 1
    assert res["medications"][0]["confidence"] > 0.5
