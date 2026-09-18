# MediKiosk — Indian Healthcare Digital Kiosk & Clinical Context System

> **SIH Prototype Statement:**
> *"The data exists. The context doesn't."*
> MediKiosk combines current patient complaints, uploaded historical records, OCR extractions, and chronological timelines into a concise, doctor-ready clinical summary.

---

## 🏛️ Government Portal Aesthetic & Design Philosophy

MediKiosk is styled strictly like an official **Indian Government Digital Service Portal** (ABDM / DigiLocker / eSanjeevani / public healthcare kiosk).

- **White canvas** background (`#FFFFFF`)
- **Dark Navy** top strip & headers (`#0F2942`)
- **Govt Blue** primary actions (`#0056B3`)
- **Teal / Green** secondary accents (`#0D9488`)
- **High Contrast Typography** with accessibility size controls (`A- / A+`)
- **Multilingual Support** (English & हिन्दी toggle)
- **Zero Gimmicks:** No gradients, no dark mode, no glassmorphism, no AI sparkle icons.

---

## 🏗️ System Architecture

```
Next.js Frontend (Kiosk UI)
       ↓
FastAPI Backend (Python)
       ↓
 PostgreSQL • Redis • Ollama • PaddleOCR • MinIO • Bhashini
```

---

## 🚀 Quick Execution Guide

### Option 1: Standalone Execution (Local Dev / Offline Demo)

#### 1. Backend (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*The database automatically initializes SQLite fallback (`medikiosk.db`) and seeds synthetic demo patient records.*

#### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

---

### Option 2: Docker Compose (Full Stack Environment)
```bash
docker-compose up --build
```
Services spun up:
- `frontend`: http://localhost:3000
- `backend`: http://localhost:8000
- `postgres`: port 5432
- `redis`: port 6379
- `ollama`: port 11434
- `minio`: port 9000 (Console: http://localhost:9001)

---

## 🧪 SIH Judge Demo Flow (Step-by-Step)

1. **Dashboard (`/dashboard`)**: View kiosk statistics (Today's Cases, Processed Documents, Pending Reviews). Click **"Start Patient Consultation Kiosk"**.
2. **Module 1 - ABHA Identification (`/patient`)**: Click **"Demo Patient 01 (Ravi Kumar)"** or enter ABHA ID `91-2345-6789-0001`.
3. **Module 2 - Consent (`/patient/consent`)**: Read plain language permission statement, check consent box, click **"Give Consent & Continue"**.
4. **Module 3 - Case Taking (`/patient/case-taking`)**: Type complaints or click **"Press for Voice Input (Bhashini)"**. See live structured JSON extraction panel update.
5. **Module 4 - Records Upload & OCR (`/patient/documents`)**: View extracted prescriptions and lab reports with confidence scores (e.g. 94%, 96%) and *"Needs verification"* tags for faint text.
6. **Module 5 - Patient Health Timeline (`/patient/timeline`)**: View chronological health history from May 2026 to Aug 2026.
7. **Module 6 - AI Clinical Summary (`/patient/summary`)**: Inspect standardized clinical summary and **Red-Flag Safety Alert Banner**.
8. **Module 7 - Doctor Review (`/doctor/review`)**: Doctor reviews summary, edits text, clicks **"ACCEPT & SIGN OFF"** to update status to **"Doctor Verified"** and generate an immutable audit log entry.
9. **Audit Logs (`/dashboard`)**: Open System Audit Logs modal to verify complete traceability.

---

## 🛡️ Clinical Safety Disclaimer

> **MediKiosk is NOT a diagnostic system.**
> All AI-generated information must be reviewed and verified by the treating clinician.
