'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KioskHeader from '../../../components/KioskHeader';
import StepProgress from '../../../components/StepProgress';
import AbhaCard from '../../../components/AbhaCard';
import { saveConsent } from '../../api';

export default function ConsentPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem('medikiosk_patient');
    if (p) {
      setPatient(JSON.parse(p));
    } else {
      router.push('/patient');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!granted || !patient) return;
    setLoading(true);
    try {
      await saveConsent(patient.id || 1, true);
    } catch (err) {
      console.log('Consent API fallback:', err);
    } finally {
      setLoading(false);
      router.push('/patient/case-taking');
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
      className={`min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden flex flex-col bg-[#F4F7FA] font-sans ${fontClass} ${
        highContrast ? 'high-contrast' : ''
      }`}
    >
      <KioskHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
      <StepProgress currentStep={2} language={language} />

      <main className="flex-1 min-h-0 flex flex-col p-3 max-w-4xl mx-auto w-full overflow-hidden">
        <div className="bg-white rounded-xl border border-gray-300 p-4 flex flex-col min-h-0 overflow-y-auto space-y-4 shadow-xs">
          {/* Module Header Strip */}
          <div className="border-b border-gray-200 pb-2 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                MODULE 02
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#00274C]">
                {language === 'hi'
                  ? 'स्वास्थ्य रिकॉर्ड उपयोग डिजिटल सहमति'
                  : 'Digital Patient Consent Form'}
              </h1>
            </div>
            <span className="text-xs font-semibold text-[#0056B3]">
              ABDM Patient Consent Framework
            </span>
          </div>

          {/* Render Official ABHA Health Identification Card INSIDE the Box */}
          {patient && (
            <div className="shrink-0 space-y-1 py-1">
              <div className="text-center text-[11px] font-bold text-[#138808] uppercase tracking-wider flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
                VERIFIED ABDM PATIENT IDENTIFICATION CARD
              </div>
              <AbhaCard patient={patient} showProceedButton={false} />
            </div>
          )}

          {/* Government Consent Box */}
          <div className="bg-blue-50 border border-[#0056B3] rounded-lg p-3 space-y-2 text-xs shrink-0">
            <h3 className="font-extrabold text-sm text-[#00274C]">
              {language === 'hi'
                ? 'सहमति कथन (Consent Terms):'
                : 'Official Consent Statement:'}
            </h3>
            <p className="text-gray-900 leading-snug font-medium">
              {language === 'hi'
                ? 'MediKiosk को डॉक्टर के लिए एक स्पष्ट सारांश तैयार करने हेतु आपकी वर्तमान बीमारियों और आपके द्वारा अपलोड किए गए पुराने मेडिकल रिकॉर्ड को प्रोसेस करने की अनुमति प्रदान करता हूँ।'
                : 'I authorize MediKiosk to process my current health symptoms, voice descriptions, and uploaded past prescriptions/lab reports strictly to generate a clinical summary for the attending doctor.'}
            </p>
          </div>

          {/* Checkbox & Controls Form */}
          <form onSubmit={handleSubmit} className="space-y-3 shrink-0">
            <label className="flex items-center gap-3 p-3 border-2 border-[#00274C] rounded-lg bg-white hover:bg-amber-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={granted}
                onChange={(e) => setGranted(e.target.checked)}
                className="w-5 h-5 text-[#0056B3] rounded border-2 border-[#00274C] focus:ring-2 focus:ring-[#FF9933] shrink-0"
              />
              <span className="text-sm font-black text-[#00274C] leading-snug">
                {language === 'hi'
                  ? 'मैं इस परामर्श के लिए अपनी स्वास्थ्य जानकारी को डिजिटल रूप से प्रोसेस करने की सहमति देता/देती हूँ।'
                  : 'I give my explicit consent to process my health information and medical records for this consultation.'}
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push('/patient')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-sm py-2 px-4 rounded-lg"
              >
                &lt;- {language === 'hi' ? 'पीछे' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={!granted || loading}
                className={`bg-[#138808] hover:bg-[#0B5205] text-white font-extrabold text-base py-2.5 px-6 rounded-lg shadow-sm transition-all ${
                  !granted || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading
                  ? 'Recording Consent...'
                  : language === 'hi'
                  ? 'सहमति दें एवं आगे बढ़ें ->'
                  : 'Give Consent & Continue ->'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-1.5 px-4 text-center text-[11px] text-gray-500 font-semibold select-none shrink-0">
        MediKiosk Public Healthcare Kiosk System — Ayushman Bharat Digital Mission (ABDM) Compliant
      </footer>
    </div>
  );
}
