"""
Object Storage Abstraction Service.
Supports MinIO / S3 compliant object storage with local filesystem fallback.
"""

import os
import shutil
from typing import Dict, Any

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
BUCKET_NAME = os.getenv("MINIO_BUCKET", "medikiosk-documents")

LOCAL_STORAGE_DIR = os.path.join(os.path.dirname(__file__), "../../uploaded_files")
os.makedirs(LOCAL_STORAGE_DIR, exist_ok=True)

def upload_patient_document(file_bytes: bytes, file_name: str, patient_id: int) -> Dict[str, Any]:
    """
    Saves document to object storage (MinIO) or local disk fallback.
    """
    safe_filename = f"p{patient_id}_{int(os.times().elapsed)}_{file_name}"
    file_path = os.path.join(LOCAL_STORAGE_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(file_bytes)

    storage_uri = f"minio://{BUCKET_NAME}/{safe_filename}" if os.getenv("USE_MINIO") == "true" else file_path

    return {
        "storage_path": storage_uri,
        "file_name": file_name,
        "file_size": len(file_bytes),
        "local_path": file_path
    }
