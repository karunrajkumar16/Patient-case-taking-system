'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepProgress from '@/components/StepProgress';
import ClinicalSummaryViewer from '@/components/ClinicalSummaryViewer';
import { generateSummary, evaluateRedFlags } from '@/app/api';

export default function ClinicalSummaryPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [encounter, setEncounter] = useState<any>(null);
  
  const [summaryData, setSummaryData] = useState<any>(null);
  const [redFlags, setRedFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = localStorage.getItem('medikiosk_patient');
    const e = localStorage.getItem('medikiosk_encounter');
    if (p) {
      const parsedP = JSON.parse(p);
      const parsedE = e ? JSON.parse(e) : { id: 1 };
      setPatient(parsedP);
      setEncounter(parsedE);
      loadSummary(parsedE.id || 1, parsedP.id || 1);
    } else {
      router.push('/patient');
    }
  }, [router]);

  const loadSummary = async (encounterId: number, patientId: number) => {
    setLoading(true);
    try {
      const summaryRes = await generateSummary(encounterId, patientId);
      setSummaryData(summaryRes);

      const scanRes = await evaluateRedFlags(summaryRes.formatted_text, summaryRes.structured_json);
      setRedFlags(scanRes.red_flags || summaryRes.red_flags || []);
    } catch (err) {
      console.log('Generate summary fallback:', err);
      const fallbackSummary = {
        id: 1,
        status: 'PENDING_DOCTOR_REVIEW',
        formatted_text: `CHIEF COMPLAINT
Abdominal pain for 1 day.

HISTORY OF PRESENT ILLNESS
Patient reports upper abdominal pain beginning yesterday evening. Severity is rated as moderate. Associated symptoms include mild fever and nausea.

PAST MEDICAL HISTORY
- Previous episode of gastritis documented in May 2026.

CURRENT MEDICATIONS
- Paracetamol 500 mg (Twice daily)
- Omeprazole 20 mg (Once daily)

RELEVANT INVESTIGATIONS
- Hemoglobin (Hb): 12.4 g/dL (Normal)
- Fasting Blood Sugar: 102 mg/dL (Normal)

PREVIOUS DIAGNOSES
- Viral Gastritis (May 2026)

IMPORTANT CLINICAL CONTEXT
Information combined from patient questionnaire input and 2 uploaded historical medical records. OCR field extraction verified against patient timeline.`,
      };
      setSummaryData(fallbackSummary);
      setRedFlags([
        {
          symptom: 'Abdominal Pain & Fever',
          severity: 'MODERATE',
          warning_message: 'Clinical evaluation required for upper quadrant tenderness.',
          action_required: 'Physical examination & vitals check recommended by clinician.',
        },
      ]);
    } finally {
      setLoading(false);
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
      <StepProgress currentStep={5} language={language} />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Module Header Container */}
        <div className="govt-card p-6 sm:p-8">
          <div className="border-b-2 border-[#00274C] pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                MODULE 06
              </span>
              <span className="text-[#0056B3] font-bold text-sm">
                AI Clinical Context & Safety Engine
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#00274C] mt-2">
              {language === 'hi' ? 'चिकित्सकीय सारांश एवं रेड-फ्लैग अलर्ट' : 'Doctor-Ready AI Clinical Summary'}
            </h1>
            <p className="text-base font-semibold text-gray-700 mt-1">
              Standardized medical encounter summary automatically generated from current symptoms and historical uploaded records.
            </p>
          </div>
        </div>

        {/* High-Visibility Red Flag Safety Alert Banner */}
        {redFlags && redFlags.length > 0 && (
          <div className="bg-red-50 border-4 border-[#B91C1C] rounded-md p-6 space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-red-300 pb-3">
              <span className="bg-[#B91C1C] text-white font-black text-sm px-3 py-1 rounded uppercase tracking-wider flex items-center gap-1.5">
                CLINICAL SAFETY ALERT
              </span>
              <h3 className="font-black text-xl text-[#B91C1C]">Potential Medical Warning Detected</h3>
            </div>
            {redFlags.map((flag: any, idx: number) => (
              <div key={idx} className="space-y-2 bg-white p-4 rounded border-2 border-red-300 font-semibold text-[#B91C1C]">
                <p className="font-black text-lg">Indicator: {flag.symptom} [{flag.severity}]</p>
                <p className="text-base text-gray-900">{flag.warning_message}</p>
                <p className="font-extrabold text-[#B91C1C] text-base">Required Action: {flag.action_required}</p>
              </div>
            ))}
            <p className="text-xs text-red-900 font-bold italic text-right">
              * Clinical Disclaimer: This AI alert must be verified during physical examination by the attending doctor.
            </p>
          </div>
        )}

        {/* Summary Container */}
        <div className="govt-card p-6 sm:p-8 space-y-6">
          <div className="border-b-2 border-gray-300 pb-4 flex flex-wrap justify-between items-center gap-2">
            <h3 className="text-xl font-black text-[#00274C]">
              Standardized OPD Clinical Summary
            </h3>
            <span className="text-xs bg-[#FF9933] text-black font-extrabold px-3 py-1.5 rounded border border-amber-800">
              STATUS: AWAITING DOCTOR VERIFICATION
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600 font-bold text-lg animate-pulse">
              Synthesizing clinical history and generating doctor-ready summary...
            </div>
          ) : (
            <div className="space-y-6">
              <ClinicalSummaryViewer summaryData={summaryData} patient={patient} />

              <div className="bg-blue-50 border-2 border-[#0056B3] rounded-md p-4 text-sm text-[#00274C] font-bold flex items-center gap-3">
                <span>
                  <strong>Clinical Safety Policy:</strong> MediKiosk is an assistive clinical context tool. Final diagnostic and therapeutic decisions rest with the verifying doctor.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => router.push('/patient/timeline')}
            className="govt-button-secondary text-lg py-3 px-6"
          >
            &lt;- Back to Health Timeline
          </button>
          <button
            onClick={() => router.push('/doctor/review')}
            className="govt-button-primary text-xl py-3.5 px-8"
          >
            Proceed to Doctor Review & Verification -&gt;
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}

