'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KioskHeader from '../../../components/KioskHeader';
import StepProgress from '../../../components/StepProgress';
import { fetchPatientTimeline } from '../../api';

export default function TimelinePage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = localStorage.getItem('medikiosk_patient');
    if (p) {
      const parsed = JSON.parse(p);
      setPatient(parsed);
      loadTimeline(parsed.id || 1);
    } else {
      router.push('/patient');
    }
  }, [router]);

  const loadTimeline = (patientId: number) => {
    setLoading(true);
    fetchPatientTimeline(patientId)
      .then(setTimeline)
      .catch((err) => {
        console.log('Timeline fetch fallback:', err);
        setTimeline([
          {
            id: 1,
            event_date: 'Aug 2026',
            event_type: 'Blood Test',
            title: 'Laboratory Investigation (Blood Report)',
            description:
              'Hemoglobin: 12.4 g/dL (Normal) | Fasting Blood Sugar: 102 mg/dL | Platelets: 210,000 /uL',
            source_doc_id: 102,
          },
          {
            id: 2,
            event_date: 'Jul 2026',
            event_type: 'Prescription',
            title: 'OPD Prescription Record',
            description:
              'Paracetamol 500 mg BD x 5 days, Omeprazole 20 mg OD x 14 days, Antacid Syrup 10ml BD',
            source_doc_id: 101,
          },
          {
            id: 3,
            event_date: 'May 2026',
            event_type: 'Diagnosis',
            title: 'Primary Diagnosis: Viral Gastritis',
            description:
              'Presented with mild abdominal discomfort. Managed conservatively with oral hydration and antacids.',
            source_doc_id: null,
          },
        ]);
      })
      .finally(() => setLoading(false));
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
      <KioskHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />
      <StepProgress currentStep={5} language={language} />

      <main className="flex-1 min-h-0 flex flex-col p-3 max-w-6xl mx-auto w-full overflow-hidden">
        <div className="bg-white rounded-xl border border-gray-300 p-3 flex flex-col min-h-0 overflow-y-auto space-y-3 shadow-xs">
          {/* Module Header */}
          <div className="border-b border-gray-200 pb-1.5 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                MODULE 05
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#00274C]">
                {language === 'hi'
                  ? 'रोगी की स्वास्थ्य इतिहास समयरेखा'
                  : 'Patient Chronological Health History'}
              </h1>
            </div>
            {patient && (
              <span className="text-xs font-bold text-[#0056B3]">
                {patient.name} ({patient.abha_id})
              </span>
            )}
          </div>

          {/* Timeline Scrollable Container */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4">
            {loading ? (
              <div className="p-6 text-center text-gray-500 font-bold text-sm animate-pulse">
                Loading patient health timeline...
              </div>
            ) : (
              <div className="relative border-l-4 border-[#00274C] ml-4 pl-6 space-y-4 py-2">
                {timeline.map((item, idx) => {
                  const isPrescription = item.event_type.includes('Prescription');
                  const isBlood =
                    item.event_type.includes('Blood') ||
                    item.event_type.includes('Lab');

                  return (
                    <div key={item.id || idx} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#FF9933] border-2 border-[#00274C] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-[#00274C] rounded-full" />
                      </div>

                      <div className="p-3 border rounded-lg bg-slate-50 border-gray-300 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold bg-[#00274C] text-[#FF9933] px-2 py-0.5 rounded text-[10px]">
                            {item.event_date}
                          </span>
                          <span
                            className={`font-extrabold text-[10px] px-2 py-0.5 rounded uppercase border ${
                              isPrescription
                                ? 'bg-blue-100 text-[#0056B3] border-blue-300'
                                : isBlood
                                ? 'bg-emerald-100 text-[#138808] border-emerald-300'
                                : 'bg-purple-100 text-purple-900 border-purple-300'
                            }`}
                          >
                            {item.event_type}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-[#00274C]">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-800 font-medium leading-relaxed bg-white p-2 rounded border border-gray-200">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 shrink-0">
            <button
              onClick={() => router.push('/patient/documents')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-xs py-2 px-4 rounded-lg"
            >
              &lt;- Back to Documents
            </button>
            <button
              onClick={() => router.push('/patient/summary')}
              className="bg-[#0056B3] hover:bg-[#004080] text-white font-extrabold text-sm py-2 px-5 rounded-lg shadow-xs"
            >
              Generate AI Clinical Summary -&gt;
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-1.5 px-4 text-center text-[11px] text-gray-500 font-semibold select-none shrink-0">
        MediKiosk Public Healthcare Kiosk System — Ayushman Bharat Digital Mission (ABDM) Compliant
      </footer>
    </div>
  );
}
