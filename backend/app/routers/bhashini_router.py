"""
Bhashini Speech API Router.
Handles multilingual speech-to-text and text-to-speech requests.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.bhashini_service import speech_to_text, text_to_speech
from typing import Optional

router = APIRouter(prefix="/api/bhashini", tags=["Bhashini Voice"])

class STTRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "hi"

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "hi"

@router.post("/stt")
async def process_stt(payload: STTRequest):
    return await speech_to_text(payload.audio_base64, payload.language)

@router.post("/tts")
async def process_tts(payload: TTSRequest):
    return await text_to_speech(payload.text, payload.language)
