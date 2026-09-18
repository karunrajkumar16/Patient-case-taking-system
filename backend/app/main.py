"""
MediKiosk FastAPI Application Entrypoint.
Provides REST APIs for Patient Identification, Encounters, Consent, Case Taking,
OCR Document Processing, Chronological Timeline, AI Clinical Summary, Red-Flag Detection,
Doctor Verification, and Compliance Audit Logging.
"""

import os
from dotenv import load_dotenv

# Load environment variables from backend/.env if present
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.seed import seed_db

from app.routers import (
    patients, encounters, consent, case_taking, documents,
    timeline, summary, red_flags, doctor, dashboard, audit, bhashini_router
)

# Initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediKiosk API",
    description="Patient Case-Taking & Doctor-Ready Clinical Context Engine (Indian Public Healthcare Prototype)",
    version="1.0.0"
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(patients.router)
app.include_router(encounters.router)
app.include_router(consent.router)
app.include_router(case_taking.router)
app.include_router(documents.router)
app.include_router(timeline.router)
app.include_router(summary.router)
app.include_router(red_flags.router)
app.include_router(doctor.router)
app.include_router(dashboard.router)
app.include_router(audit.router)
app.include_router(bhashini_router.router)

@app.on_event("startup")
def startup_event():
    seed_db()

@app.get("/")
def root():
    return {
        "service": "MediKiosk Healthcare Kiosk API",
        "status": "RUNNING",
        "version": "1.0.0",
        "environment": "Prototype / Demo Environment",
        "routes_count": 18,
        "disclaimer": "This system does not replace clinical judgment. All summaries require doctor verification."
    }
