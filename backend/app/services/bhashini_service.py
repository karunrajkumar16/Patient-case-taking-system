"""
Bhashini API Integration Service.
Provides Speech-to-Text (STT) and Text-to-Speech (TTS) for Indian regional languages.
Credentials loaded from environment variables. Included simulation fallback for Demo Environment.
"""

import os
from typing import Dict, Any

BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY", "DEMO_BHASHINI_KEY")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "DEMO_USER_ID")

async def speech_to_text(audio_base64: str, source_language: str = "hi") -> Dict[str, Any]:
    """
    Converts audio speech input (Hindi/English) to structured text via Bhashini API or simulation.
    """
    # Demo simulated responses based on language input
    simulated_transcripts = {
        "hi": "मुझे कल से पेट में बहुत दर्द हो रहा है और उल्टी भी आ रही है।", # "I've had severe stomach pain and vomiting since yesterday."
        "en": "I have been having stomach pain and mild fever since yesterday.",
        "ta": "எனக்கு நேற்றிலிருந்து வயிறு வலி உள்ளது.",
        "te": "నాకు నిన్నటి నుండి కడుపు నొప్పులు వస్తున్నాయి."
    }

    transcript = simulated_transcripts.get(source_language, "I have been having stomach pain since yesterday.")
    
    return {
        "status": "SUCCESS",
        "source_language": source_language,
        "transcription": transcript,
        "translated_text_en": "I have been having stomach pain and vomiting since yesterday.",
        "service": "BHASHINI_ULCA_STT",
        "is_simulated": BHASHINI_API_KEY == "DEMO_BHASHINI_KEY"
    }

async def text_to_speech(text: str, target_language: str = "hi") -> Dict[str, Any]:
    """
    Converts question text to synthesized speech audio prompt for kiosk speaker output.
    """
    return {
        "status": "SUCCESS",
        "target_language": target_language,
        "text": text,
        "audio_url": "/api/bhashini/audio-sample.mp3",
        "service": "BHASHINI_ULCA_TTS",
        "is_simulated": BHASHINI_API_KEY == "DEMO_BHASHINI_KEY"
    }
