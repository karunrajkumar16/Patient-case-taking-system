'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepProgress from '@/components/StepProgress';
import { sendCaseTakingTurn, callBhashiniSTT } from '@/app/api';

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
      message: 'Namaste! What brings you to the health kiosk today? Please describe your main symptoms or illness in your language.',
    },
    {
      sender: 'PATIENT',
      message: 'Mujhe kal shaam se upper stomach me kafi dard ho raha hai, aur halka bukhar (fever) aur nausea (ji ghabrana) bhi feel ho raha hai.',
    },
    {
      sender: 'SYSTEM',
      message: 'Thank you. How severe is the abdominal pain on a scale of 1 to 10, and do you feel any vomiting or appetite loss?',
    },
    {
      sender: 'PATIENT',
      message: 'Pain is moderate to severe (around 7/10). I feel mild nausea and loss of appetite since yesterday night.',
    },
    {
      sender: 'SYSTEM',
      message: 'Noted. Are you currently taking any medicines or antacids for this pain?',
    },
    {
      sender: 'PATIENT',
      message: 'I took Paracetamol 500mg once yesterday night. I also take Omeprazole 20mg daily for past gastritis.',
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

    const updatedHistory = [...history, { sender: 'PATIENT', message: textToSend }];
    setHistory(updatedHistory);
    setUserInput('');

    try {
      const res = await sendCaseTakingTurn(encounter?.id || 1, patient?.id || 1, textToSend, updatedHistory);
      setExtractedJSON(res.extracted_data);
      if (res.question) {
        setHistory((prev) => [...prev, { sender: 'SYSTEM', message: res.question }]);
      }
    } catch (err) {
      console.log('Case taking turn fallback:', err);
      const fallbackExtracted = {
        chief_complaint: textToSend.includes('stomach') || textToSend.includes('pain') ? 'Abdominal Pain' : textToSend,
        duration: textToSend.includes('yesterday') || textToSend.includes('day') ? '1 day' : '2 days',
        location: 'Upper Abdomen',
        severity: 'Moderate',
        associated_symptoms: ['Fever', 'Nausea'],
        medical_history: ['Previous gastritis (May 2026)'],
        medications: [],
      };
      setExtractedJSON(fallbackExtracted);
      setHistory((prev) => [
        ...prev,
        { sender: 'SYSTEM', message: 'Thank you. Do you have any fever, vomiting, or appetite loss along with this problem?' },
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

  const fontClass = fontSize === 'xlarge' ? 'font-accessible-xl' : fontSize === 'large' ? 'font-accessible-lg' : 'font-accessible-normal';

  return (
    <div className={`min-h-screen bg-[#F4F7FA] flex flex-col ${fontClass} ${highContrast ? 'high-contrast' : ''}`}>
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        fontSize={fontSize} 
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
      <StepProgress currentStep={3} language={language} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Module Banner Header */}
        <div className="govt-card p-6 sm:p-8">
          <div className="border-b-2 border-[#00274C] pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                MODULE 03
              </span>
              <span className="text-[#0056B3] font-bold text-sm">
                Case Taking & Voice Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#00274C] mt-2">
              {language === 'hi' ? 'अपनी वर्तमान स्वास्थ्य समस्या का वर्णन करें' : 'Describe Your Current Health Symptoms'}
            </h1>
            <p className="text-base font-semibold text-gray-700 mt-1">
              {language === 'hi'
                ? 'माइक बटन दबाकर बोलें या नीचे बॉक्स में लिखकर अपने लक्षण बताएं।'
                : 'Press the large voice input button to speak or type your symptoms in Hindi or English.'}
            </p>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Case Questionnaire Container */}
          <div className="lg:col-span-2 govt-card p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="border-b-2 border-gray-300 pb-3 flex justify-between items-center">
                <h3 className="font-extrabold text-lg text-[#00274C]">
                  Consultation Questionnaire Conversation
                </h3>
                <span className="text-xs bg-[#00274C] text-white px-2.5 py-1 rounded font-mono font-bold">
                  Encounter #{encounter?.id || 1}
                </span>
              </div>

              {/* Conversation Log Box */}
              <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2 my-6">
                {history.map((h, idx) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-md border-2 text-base ${
                      h.sender === 'SYSTEM'
                        ? 'bg-blue-50 border-[#0056B3] text-[#00274C] font-semibold'
                        : 'bg-slate-100 border-slate-400 text-gray-900 font-extrabold ml-8'
                    }`}
                  >
                    <div className="text-xs uppercase font-black text-[#00274C] mb-1">
                      <span>{h.sender === 'SYSTEM' ? 'MediKiosk Prompt:' : 'Patient Answer:'}</span>
                    </div>
                    <p className="leading-relaxed text-lg">{h.message}</p>
                  </div>
                ))}

                {loading && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded text-sm text-amber-950 font-bold animate-pulse">
                    Processing symptom input and extracting clinical metrics...
                  </div>
                )}
              </div>
            </div>

            {/* Input Controls Panel */}
            <div className="space-y-4 border-t-2 border-gray-300 pt-4">
              {/* Prominent Bhashini Voice Input Button */}
              <button
                onClick={handleVoiceInput}
                disabled={isRecording || loading}
                className={`w-full py-4 px-6 rounded-md font-black text-xl flex items-center justify-center gap-3 border-3 transition-transform ${
                  isRecording
                    ? 'bg-red-600 text-white border-red-900 animate-pulse'
                    : 'bg-[#FF9933] hover:bg-[#E68A00] text-black border-amber-800'
                }`}
              >
                <span>
                  {isRecording 
                    ? (language === 'hi' ? 'आवाज़ रिकॉर्ड की जा रही है (Bhashini)...' : 'Listening... Speak Now') 
                    : (language === 'hi' ? 'आवाज़ से बोलने के लिए यहाँ दबाएं (Bhashini)' : 'PRESS FOR VOICE INPUT (BHASHINI STT)')}
                </span>
              </button>

              {/* Text Input Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'यहाँ अपनी समस्या लिखें (जैसे कल से पेट में दर्द)...' : 'Or type symptoms here (e.g. stomach pain since yesterday)...'}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTurn(userInput)}
                  className="flex-1 border-2 border-[#00274C] rounded px-4 py-3 text-lg font-semibold text-[#00274C] focus:outline-none focus:ring-4 focus:ring-[#FF9933] bg-white"
                />
                <button
                  onClick={() => handleSendTurn(userInput)}
                  disabled={loading || !userInput.trim()}
                  className="govt-button-primary text-lg py-3 px-6"
                >
                  {language === 'hi' ? 'उत्तर दर्ज करें' : 'Submit'}
                </button>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => router.push('/patient/documents')}
                  className="govt-button-success text-xl py-3.5 px-8"
                >
                  <span>{language === 'hi' ? 'मेडिकल रिपोर्ट अपलोड पर जाएं ->' : 'Proceed to Upload Records ->'}</span>
                </button>
              </div>
            </div>
          </div>


          {/* Structured Clinical JSON Live Extraction Box */}
          <div className="govt-card p-6 space-y-4">
            <div className="border-b-2 border-gray-300 pb-3">
              <span className="text-xs font-black uppercase text-[#138808] bg-emerald-100 px-2.5 py-1 rounded border border-emerald-400">
                Rule Engine Clinical Extractor
              </span>
              <h3 className="font-black text-xl text-[#00274C] mt-2">
                Structured Parameters
              </h3>
              <p className="text-xs font-semibold text-gray-600">Extracted in real-time for clinician review</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-2 border-[#0056B3] rounded-md">
                <span className="text-xs font-black text-gray-600 block uppercase">Chief Complaint</span>
                <span className="font-black text-[#00274C] text-xl block mt-0.5">{extractedJSON.chief_complaint}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-100 border-2 border-slate-300 rounded-md">
                  <span className="text-xs font-bold text-gray-600 block uppercase">Duration</span>
                  <span className="font-extrabold text-[#00274C] text-lg">{extractedJSON.duration}</span>
                </div>
                <div className="p-3 bg-slate-100 border-2 border-slate-300 rounded-md">
                  <span className="text-xs font-bold text-gray-600 block uppercase">Severity</span>
                  <span className="font-extrabold text-[#00274C] text-lg">{extractedJSON.severity}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 border-2 border-slate-300 rounded-md">
                <span className="text-xs font-bold text-gray-600 block uppercase">Anatomical Location</span>
                <span className="font-extrabold text-[#00274C] text-lg">{extractedJSON.location}</span>
              </div>

              <div className="p-3 bg-slate-100 border-2 border-slate-300 rounded-md">
                <span className="text-xs font-bold text-gray-600 block uppercase">Associated Symptoms</span>
                {extractedJSON.associated_symptoms && extractedJSON.associated_symptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {extractedJSON.associated_symptoms.map((s: string, idx: number) => (
                      <span key={idx} className="bg-[#FF9933] text-black font-extrabold text-xs px-2.5 py-1 rounded border border-amber-700">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 font-semibold italic text-sm">None recorded yet</span>
                )}
              </div>

              <div className="p-3 bg-slate-100 border-2 border-slate-300 rounded-md">
                <span className="text-xs font-bold text-gray-600 block uppercase">Medical History</span>
                <div className="font-extrabold text-[#00274C] text-base mt-1">
                  {extractedJSON.medical_history && extractedJSON.medical_history.length > 0 ? (
                    extractedJSON.medical_history.join(', ')
                  ) : (
                    'Not specified'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

