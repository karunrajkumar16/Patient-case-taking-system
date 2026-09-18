"""
Deterministic safety layer independent of the LLM.
Checks current patient complaints and inputs against critical red-flag symptom rules.
"""

import re
from typing import List, Dict

CRITICAL_RULES = [
    {
        "pattern": r"\b(chest pain|tightness in chest|crushing chest|angina)\b",
        "symptom": "Severe Chest Pain",
        "severity": "CRITICAL",
        "warning": "Potential urgent cardiovascular symptom detected.",
        "action": "Please direct patient to Emergency / Triage immediately."
    },
    {
        "pattern": r"\b(shortness of breath|breathlessness|difficulty breathing|gasping|dyspnea)\b",
        "symptom": "Respiratory Distress",
        "severity": "HIGH",
        "warning": "Potential urgent acute respiratory symptom detected.",
        "action": "Immediate oxygen saturation check and medical attention required."
    },
    {
        "pattern": r"\b(fainted|unconscious|blackout|syncope|passed out|loss of consciousness)\b",
        "symptom": "Loss of Consciousness / Syncope",
        "severity": "CRITICAL",
        "warning": "Potential neurological or hemodynamic collapse.",
        "action": "Immediate clinical triage required."
    },
    {
        "pattern": r"\b(severe bleeding|coughing blood|blood in stool|hematemesis|hemoptysis|vomiting blood)\b",
        "symptom": "Acute Hemorrhage",
        "severity": "CRITICAL",
        "warning": "Active acute bleeding indicator detected.",
        "action": "Urgent medical stabilization required."
    },
    {
        "pattern": r"\b(sudden weakness|slurred speech|facial drooping|stroke|paralysis|sudden vision loss)\b",
        "symptom": "Acute Neurological Deficit",
        "severity": "CRITICAL",
        "warning": "Possible acute cerebrovascular event (Stroke indicator).",
        "action": "Emergency stroke protocol evaluation recommended."
    }
]

def detect_red_flags(text_content: str, structured_complaint: dict = None) -> List[Dict[str, str]]:
    """
    Evaluates text and structured complaint against deterministic safety rules.
    Returns list of detected red flag warnings.
    """
    detected_flags = []
    text_to_check = text_content or ""
    
    if structured_complaint:
        complaint = structured_complaint.get("chief_complaint", "")
        assoc = " ".join(structured_complaint.get("associated_symptoms", []))
        text_to_check += f" {complaint} {assoc}"

    text_lower = text_to_check.lower()

    for rule in CRITICAL_RULES:
        if re.search(rule["pattern"], text_lower, re.IGNORECASE):
            detected_flags.append({
                "symptom": rule["symptom"],
                "severity": rule["severity"],
                "warning_message": rule["warning"],
                "action_required": rule["action"],
                "disclaimer": "This system does not replace clinical judgment."
            })

    return detected_flags
