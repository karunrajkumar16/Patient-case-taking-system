"""
Red-Flag Engine Router.
Independent safety API running deterministic symptom safety rules.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.pipelines.red_flag_engine import detect_red_flags, CRITICAL_RULES

router = APIRouter(prefix="/api/red-flags", tags=["Red-Flag Safety"])

class RedFlagScanRequest(BaseModel):
    text_content: Optional[str] = ""
    structured_complaint: Optional[Dict[str, Any]] = None

@router.post("")
def scan_red_flags(payload: RedFlagScanRequest):
    detected = detect_red_flags(payload.text_content, payload.structured_complaint)
    return {
        "has_red_flags": len(detected) > 0,
        "count": len(detected),
        "red_flags": detected,
        "disclaimer": "This system does not replace clinical judgment."
    }

@router.get("/rules")
def get_red_flag_rules():
    return {
        "engine_type": "Deterministic Rule Engine (Independent of LLM)",
        "rules_count": len(CRITICAL_RULES),
        "rules": [
            {"symptom": r["symptom"], "severity": r["severity"], "warning": r["warning"]}
            for r in CRITICAL_RULES
        ]
    }
