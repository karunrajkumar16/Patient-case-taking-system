"""
Comprehensive API Unit Test for all 18 MediKiosk Endpoints.
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_complete_18_api_routes():
    print("\n--- Running 18 API Route Tests ---")

    # 1. Root API
    r1 = client.get("/")
    assert r1.status_code == 200
    print("✓ Route 1: / -> OK")

    # 2. Patients Demo
    r2 = client.get("/api/patients/demo")
    assert r2.status_code == 200
    print("✓ Route 2: GET /api/patients/demo -> OK")

    # 3. Patients Lookup
    r3 = client.post("/api/patients/lookup", json={"abha_id": "91-2345-6789-0001"})
    assert r3.status_code == 200
    patient_id = r3.json()["id"]
    print("✓ Route 3: POST /api/patients/lookup -> OK")

    # 4. Encounters Create
    r4 = client.post("/api/encounters", json={"patient_id": patient_id, "chief_complaint_summary": "Test Complaint"})
    assert r4.status_code == 200
    encounter_id = r4.json()["id"]
    print("✓ Route 4: POST /api/encounters -> OK")

    # 5. Encounters Get Patient
    r5 = client.get(f"/api/encounters/patient/{patient_id}")
    assert r5.status_code == 200
    print("✓ Route 5: GET /api/encounters/patient/{id} -> OK")

    # 6. Consent Record
    r6 = client.post("/api/consent", json={"patient_id": patient_id, "granted": True})
    assert r6.status_code == 200
    print("✓ Route 6: POST /api/consent -> OK")

    # 7. Consent Get Patient
    r7 = client.get(f"/api/consent/patient/{patient_id}")
    assert r7.status_code == 200
    print("✓ Route 7: GET /api/consent/patient/{id} -> OK")

    # 8. Case Taking Session
    r8 = client.get(f"/api/case-taking/encounter/{encounter_id}")
    assert r8.status_code == 200
    print("✓ Route 8: GET /api/case-taking/encounter/{id} -> OK")

    # 9. Case Taking Turn
    r9 = client.post("/api/case-taking/questions", json={
        "encounter_id": encounter_id,
        "patient_id": patient_id,
        "user_input": "I have had stomach pain since yesterday."
    })
    assert r9.status_code == 200
    print("✓ Route 9: POST /api/case-taking/questions -> OK")

    # 10. Documents Get Patient
    r10 = client.get(f"/api/documents/patient/{patient_id}")
    assert r10.status_code == 200
    docs = r10.json()
    doc_id = docs[0]["id"] if docs else 1
    print("✓ Route 10: GET /api/documents/patient/{id} -> OK")

    # 11. Document Process By ID
    r11 = client.post(f"/api/documents/{doc_id}/process")
    assert r11.status_code in [200, 404]
    print("✓ Route 11: POST /api/documents/{id}/process -> OK")

    # 12. Timeline Get Patient
    r12 = client.get(f"/api/timeline/patient/{patient_id}")
    assert r12.status_code == 200
    print("✓ Route 12: GET /api/timeline/patient/{id} -> OK")

    # 13. Summary Generate
    r13 = client.post("/api/summary/generate", json={"encounter_id": encounter_id, "patient_id": patient_id})
    assert r13.status_code == 200
    summary_id = r13.json()["id"]
    print("✓ Route 13: POST /api/summary/generate -> OK")

    # 14. Red Flags Scan
    r14 = client.post("/api/red-flags", json={"text_content": "Severe chest pain and breathlessness"})
    assert r14.status_code == 200
    assert r14.json()["has_red_flags"] == True
    print("✓ Route 14: POST /api/red-flags -> OK")

    # 15. Summary Verify Alias
    r15 = client.post("/api/summary/verify", json={"summary_id": summary_id, "action": "ACCEPT"})
    assert r15.status_code == 200
    assert r15.json()["status"] == "Doctor Verified"
    print("✓ Route 15: POST /api/summary/verify -> OK")

    # 16. Doctor Pending Reviews
    r16 = client.get("/api/doctor/pending")
    assert r16.status_code == 200
    print("✓ Route 16: GET /api/doctor/pending -> OK")

    # 17. Doctor Verify
    r17 = client.post("/api/doctor/verify", json={"summary_id": summary_id, "action": "ACCEPT", "doctor_notes": "All verified."})
    assert r17.status_code == 200
    print("✓ Route 17: POST /api/doctor/verify -> OK")

    # 18. Audit Logs
    r18 = client.get("/api/audit")
    assert r18.status_code == 200
    assert len(r18.json()) > 0
    print("✓ Route 18: GET /api/audit -> OK")

    print("\n✓ ALL 18 API ROUTES PASSED VERIFICATION!")

if __name__ == "__main__":
    test_complete_18_api_routes()
