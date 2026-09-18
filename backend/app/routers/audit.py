"""
Audit Logs Router.
Returns immutable log records for compliance & traceability.
"""

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog
from app.schemas import AuditLogOut
from typing import List

router = APIRouter(prefix="/api/audit", tags=["Audit Log"])

@router.get("", response_model=List[AuditLogOut])
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(100).all()
    result = []
    for log in logs:
        details = json.loads(log.details_json) if log.details_json else None
        result.append(AuditLogOut(
            id=log.id,
            timestamp=log.timestamp,
            actor_role=log.actor_role,
            action=log.action,
            entity_type=log.entity_type,
            entity_id=log.entity_id,
            details=details
        ))
    return result
