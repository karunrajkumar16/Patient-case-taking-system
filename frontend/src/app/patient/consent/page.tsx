'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StepProgress from '@/components/StepProgress';
import { saveConsent } from '@/app/api';

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
      <StepProgress currentStep={2} language={language} />

      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="govt-card p-6 sm:p-8 space-y-6">
          {/* Module Header Strip */}
          <div className="border-b-2 border-[#00274C] pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                MODULE 02
              </span>
              <span className="text-[#0056B3] font-bold text-sm">
                ABDM Patient Consent Framework
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#00274C] mt-2">
              {language === 'hi' ? 'स्वास्थ्य रिकॉर्ड उपयोग डिजिटल सहमति' : 'Digital Patient Consent Form'}
            </h1>
            <p className="text-base font-semibold text-gray-700 mt-1">
              {language === 'hi'
                ? 'डॉक्टर परामर्श सारांश तैयार करने के लिए कृपया अपनी सहमति की समीक्षा करें और पुष्टि करें।'
                : 'Please review and authorize processing of your medical information for this OPD encounter.'}
            </p>
          </div>

          {/* Active Patient Details Strip */}
          {patient && (
            <div className="bg-slate-100 border-2 border-slate-300 rounded-md p-4 flex flex-wrap justify-between items-center gap-4 text-sm font-bold text-[#00274C]">
              <div>
                <span className="text-gray-600">Verified Patient: </span>
                <span className="text-xl font-black ml-1">{patient.name}</span>
              </div>
              <div>
                <span className="text-gray-600">ABHA Number: </span>
                <span className="font-mono text-lg text-[#0056B3] font-extrabold ml-1">{patient.abha_id}</span>
              </div>
            </div>
          )}

          {/* Government Consent Box */}
          <div className="bg-blue-50 border-2 border-[#0056B3] rounded-md p-6 space-y-4">
            <h3 className="text-xl font-black text-[#00274C]">
              {language === 'hi' ? 'सहमति कथन (Consent Terms):' : 'Official Consent Statement:'}
            </h3>
            <p className="text-base text-gray-900 leading-relaxed font-semibold">
              {language === 'hi'
                ? 'MediKiosk को डॉक्टर के लिए एक स्पष्ट सारांश तैयार करने हेतु आपकी वर्तमान बीमारियों और आपके द्वारा अपलोड किए गए पुराने मेडिकल रिकॉर्ड को प्रोसेस करने की अनुमति प्रदान करता हूँ।'
                : 'I authorize MediKiosk to process my current health symptoms, voice descriptions, and uploaded past prescriptions/lab reports strictly to generate a clinical summary for the attending doctor.'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm font-bold text-[#00274C] bg-white p-4 rounded border-2 border-blue-200">
              <li>Information processed exclusively for this outpatient consultation (OPD).</li>
              <li>OCR text extraction highlights diagnoses, prescribed drugs, and vital signs.</li>
              <li>A registered medical clinician must review and sign off on all records.</li>
            </ul>
          </div>

          {/* Checkbox & Controls Form */}
          <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <label className="flex items-start gap-4 p-5 border-3 border-[#00274C] rounded-md bg-white hover:bg-amber-50/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={granted}
                onChange={(e) => setGranted(e.target.checked)}
                className="w-7 h-7 mt-0.5 text-[#0056B3] rounded border-2 border-[#00274C] focus:ring-4 focus:ring-[#FF9933]"
              />
              <span className="text-lg font-black text-[#00274C] leading-snug">
                {language === 'hi'
                  ? 'मैं इस परामर्श के लिए अपनी स्वास्थ्य जानकारी को डिजिटल रूप से प्रोसेस करने की सहमति देता/देती हूँ।'
                  : 'I give my explicit consent to process my health information and medical records for this consultation.'}
              </span>
            </label>

            {/* Privacy Strip */}
            <div className="bg-emerald-50 border-2 border-[#138808] rounded-md p-4 text-sm text-[#138808] font-bold">
              <span>
                <strong>ABDM Security Assurance:</strong> Your data is protected under National Health Authority guidelines and consent management frameworks.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
              <button
                type="button"
                onClick={() => router.push('/patient')}
                className="govt-button-secondary text-lg py-3 px-6"
              >
                &lt;- {language === 'hi' ? 'पीछे' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={!granted || loading}
                className={`govt-button-primary text-xl py-3.5 px-8 ${
                  !granted || loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Recording Consent...' : language === 'hi' ? 'सहमति दें एवं आगे बढ़ें ->' : 'Give Consent & Continue ->'}
              </button>

            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

