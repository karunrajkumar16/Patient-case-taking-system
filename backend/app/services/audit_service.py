"""
Audit Logging Service.
Records security, access, clinical decision, and consent events in PostgreSQL AuditLog table.
"""

import json
from sqlalchemy.orm import Session
from app.models import AuditLog

def record_audit_log(db: Session, actor_role: str, action: str, entity_type: str, entity_id: str, details: dict = None):
    """
    Creates an immutable audit log record.
    """
    log_entry = AuditLog(
        actor_role=actor_role,
        action=action,
        entity_type=entity_type,
        entity_id=str(entity_id),
        details_json=json.dumps(details or {})
    )
    db.add(log_entry)
    db.commit()
    db.refresh(log_entry)
    return log_entry
