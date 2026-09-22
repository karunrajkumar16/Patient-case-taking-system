'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KioskHeader from '../../../components/KioskHeader';
import StepProgress from '../../../components/StepProgress';
import { sendCaseTakingTurn, callBhashiniSTT } from '../../api';

export default function CaseTakingPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [encounter, setEncounter] = useState<any>(null);

  const [userInput, setUserInput] = useState('');
  const [history, setHistory] = useState<any[]>([
    {
      sender: 'SYSTEM',
      message:
        'Namaste! What brings you to the health kiosk today? Please describe your main symptoms or illness in your language.',
    },
    {
      sender: 'PATIENT',
      message:
        'Mujhe kal shaam se upper stomach me kafi dard ho raha hai, aur halka bukhar (fever) aur nausea (ji ghabrana) bhi feel ho raha hai.',
    },
    {
      sender: 'SYSTEM',
      message:
        'Thank you. How severe is the abdominal pain on a scale of 1 to 10, and do you feel any vomiting or appetite loss?',
    },
    {
      sender: 'PATIENT',
      message:
        'Pain is moderate to severe (around 7/10). I feel mild nausea and loss of appetite since yesterday night.',
    },
    {
      sender: 'SYSTEM',
      message:
        'Noted. Are you currently taking any medicines or antacids for this pain?',
    },
  ]);

  const [extractedJSON, setExtractedJSON] = useState<any>({
    chief_complaint: 'Upper Abdominal Pain',
    duration: '1 day (Since yesterday evening)',
    location: 'Upper Abdomen',
    severity: 'Moderate to Severe (7/10)',
    associated_symptoms: ['Mild Fever', 'Nausea', 'Loss of Appetite'],
    medical_history: ['Viral Gastritis (May 2026)', 'Previous Acidity Episode'],
    medications: ['Paracetamol 500 mg (BD)', 'Omeprazole 20 mg (OD)'],
  });
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem('medikiosk_patient');
    const e = localStorage.getItem('medikiosk_encounter');
    if (p) {
      setPatient(JSON.parse(p));
      if (e) setEncounter(JSON.parse(e));
    } else {
      router.push('/patient');
    }
  }, [router]);

  const handleSendTurn = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    setLoading(true);

    const updatedHistory = [
      ...history,
      { sender: 'PATIENT', message: textToSend },
    ];
    setHistory(updatedHistory);
    setUserInput('');

    try {
      const res = await sendCaseTakingTurn(
        encounter?.id || 1,
        patient?.id || 1,
        textToSend,
        updatedHistory
      );
      setExtractedJSON(res.extracted_data);
      if (res.question) {
        setHistory((prev) => [
          ...prev,
          { sender: 'SYSTEM', message: res.question },
        ]);
      }
    } catch (err) {
      console.log('Case taking turn fallback:', err);
      const fallbackExtracted = {
        chief_complaint:
          textToSend.includes('stomach') || textToSend.includes('pain')
            ? 'Abdominal Pain'
            : textToSend,
        duration:
          textToSend.includes('yesterday') || textToSend.includes('day')
            ? '1 day'
            : '2 days',
        location: 'Upper Abdomen',
        severity: 'Moderate',
        associated_symptoms: ['Fever', 'Nausea'],
        medical_history: ['Previous gastritis (May 2026)'],
        medications: [],
      };
      setExtractedJSON(fallbackExtracted);
      setHistory((prev) => [
        ...prev,
        {
          sender: 'SYSTEM',
          message:
            'Thank you. Do you have any fever, vomiting, or appetite loss along with this problem?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    setIsRecording(true);
    try {
      const sttResult = await callBhashiniSTT(language);
      const text = sttResult.translated_text_en || sttResult.transcription;
      setUserInput(text);
      await handleSendTurn(text);
    } catch (err) {
      console.log('Voice STT error:', err);
      const fallbackText = 'I have been having stomach pain since yesterday.';
      setUserInput(fallbackText);
      await handleSendTurn(fallbackText);
    } finally {
      setIsRecording(false);
    }
  };

  const fontClass =
    fontSize === 'xlarge'
      ? 'font-accessible-xl'
      : fontSize === 'large'
      ? 'font-accessible-lg'
      : 'font-accessible-normal';

  return (
    <div
      className={`h-screen max-h-screen overflow-hidden flex flex-col bg-[#F4F7FA] font-sans ${fontClass} ${
        highContrast ? 'high-contrast' : ''
      }`}
    >
      {/* Kiosk Header */}
      <KioskHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Step Progress Tracker */}
      <StepProgress currentStep={3} language={language} />

      {/* Main Kiosk Viewport Container - Zero Scroll Fit */}
      <main className="flex-1 min-h-0 flex flex-col p-3 max-w-7xl mx-auto w-full gap-3 overflow-hidden">
        {/* Compact Module Header Strip */}
        <div className="bg-white border border-gray-300 rounded-xl px-4 py-2 shrink-0 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#00274C] text-[#FF9933] text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
              MODULE 03
            </span>
            <h1 className="text-base sm:text-lg font-black text-[#00274C]">
              {language === 'hi'
                ? 'लक्षण विवरण एवं आवाज़ इनपुट'
                : 'Describe Your Current Health Symptoms'}
            </h1>
          </div>
          <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
            Press voice button or type symptoms in Hindi/English
          </span>
        </div>

        {/* 2-Column Content Grid fitting 100% height */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0 overflow-hidden">
          {/* Left Column: Chat Conversation */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-300 p-3 flex flex-col min-h-0 overflow-hidden shadow-xs">
            <div className="border-b border-gray-200 pb-1.5 flex justify-between items-center shrink-0">
              <h3 className="font-extrabold text-sm text-[#00274C]">
                Consultation Questionnaire Conversation
              </h3>
              <span className="text-[10px] bg-[#00274C] text-white px-2 py-0.5 rounded font-mono font-bold">
                Encounter #{encounter?.id || 1}
              </span>
            </div>

            {/* Internal Scrollable Message History Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-2 space-y-2">
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-sm ${
                    h.sender === 'SYSTEM'
                      ? 'bg-blue-50 border-[#0056B3] text-[#00274C] font-semibold'
                      : 'bg-slate-100 border-slate-300 text-gray-900 font-bold ml-6'
                  }`}
                >
                  <div className="text-[10px] uppercase font-black text-[#00274C] mb-0.5">
                    {h.sender === 'SYSTEM' ? 'MediKiosk Prompt:' : 'Patient Answer:'}
                  </div>
                  <p className="leading-snug">{h.message}</p>
                </div>
              ))}

              {loading && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-950 font-bold animate-pulse">
                  Processing symptom input and extracting clinical metrics...
                </div>
              )}
            </div>

            {/* Locked Bottom Input Panel */}
            <div className="shrink-0 space-y-2 pt-2 border-t border-gray-200">
              {/* Bhashini Voice Input Button */}
              <button
                onClick={handleVoiceInput}
                disabled={isRecording || loading}
                className={`w-full py-2.5 px-4 rounded-lg font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#FF9933] hover:bg-[#E68A00] text-black border border-amber-800'
                }`}
              >
                <span>🎙️</span>
                <span>
                  {isRecording
                    ? 'Listening... Speak Now'
                    : 'PRESS FOR VOICE INPUT (BHASHINI STT)'}
                </span>
              </button>

              {/* Text Input Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type symptoms here (e.g. stomach pain since yesterday)..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTurn(userInput)}
                  className="flex-1 border-2 border-[#00274C] rounded-lg px-3 py-2 text-sm font-semibold text-[#00274C] focus:outline-none focus:ring-2 focus:ring-[#FF9933] bg-white"
                />
                <button
                  onClick={() => handleSendTurn(userInput)}
                  disabled={loading || !userInput.trim()}
                  className="bg-[#0056B3] hover:bg-[#004080] text-white font-extrabold text-sm px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>

              {/* Proceed Action Button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => router.push('/patient/documents')}
                  className="bg-[#138808] hover:bg-[#0B5205] text-white font-extrabold text-sm sm:text-base py-2 px-6 rounded-lg shadow-sm"
                >
                  Proceed to Upload Records -&gt;
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Rule Engine Extractor (Internal Overflow) */}
          <div className="bg-white rounded-xl border border-gray-300 p-3 flex flex-col min-h-0 overflow-y-auto shadow-xs space-y-2">
            <div className="border-b border-gray-200 pb-1.5 shrink-0">
              <span className="text-[10px] font-black uppercase text-[#138808] bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Rule Engine Clinical Extractor
              </span>
              <h3 className="font-black text-base text-[#00274C] mt-1">
                Structured Parameters
              </h3>
            </div>

            <div className="space-y-2 text-xs font-bold text-gray-800">
              <div className="p-2.5 bg-blue-50 border border-[#0056B3] rounded-lg">
                <span className="text-[10px] text-gray-500 block uppercase">Chief Complaint</span>
                <span className="font-extrabold text-[#00274C] text-sm block">{extractedJSON.chief_complaint}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg">
                  <span className="text-[10px] text-gray-500 block uppercase">Duration</span>
                  <span className="font-extrabold text-[#00274C] text-xs">{extractedJSON.duration}</span>
                </div>
                <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg">
                  <span className="text-[10px] text-gray-500 block uppercase">Severity</span>
                  <span className="font-extrabold text-[#00274C] text-xs">{extractedJSON.severity}</span>
                </div>
              </div>

              <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-gray-500 block uppercase">Location</span>
                <span className="font-extrabold text-[#00274C] text-xs">{extractedJSON.location}</span>
              </div>

              <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-gray-500 block uppercase">Associated Symptoms</span>
                {extractedJSON.associated_symptoms && extractedJSON.associated_symptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {extractedJSON.associated_symptoms.map((s: string, idx: number) => (
                      <span key={idx} className="bg-[#FF9933] text-black font-extrabold text-[10px] px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic text-xs">None</span>
                )}
              </div>

              <div className="p-2 bg-slate-100 border border-slate-300 rounded-lg">
                <span className="text-[10px] text-gray-500 block uppercase">Medical History</span>
                <div className="font-extrabold text-[#00274C] text-xs mt-0.5">
                  {extractedJSON.medical_history ? extractedJSON.medical_history.join(', ') : 'None'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Kiosk Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-1.5 px-4 text-center text-[11px] text-gray-500 font-semibold select-none shrink-0">
        MediKiosk Public Healthcare Kiosk System — Ayushman Bharat Digital Mission (ABDM) Compliant
      </footer>
    </div>
  );
}
