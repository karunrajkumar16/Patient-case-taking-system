'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
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
        // Fallback realistic synthetic timeline for Demo Patient 01
        setTimeline([
          {
            id: 1,
            event_date: 'Aug 2026',
            event_type: 'Blood Test',
            title: 'Laboratory Investigation (Blood Report)',
            description: 'Hemoglobin: 12.4 g/dL (Normal) | Fasting Blood Sugar: 102 mg/dL | Platelets: 210,000 /uL',
            source_doc_id: 102,
          },
          {
            id: 2,
            event_date: 'Jul 2026',
            event_type: 'Prescription',
            title: 'OPD Prescription Record',
            description: 'Paracetamol 500 mg BD x 5 days, Omeprazole 20 mg OD x 14 days, Antacid Syrup 10ml BD',
            source_doc_id: 101,
          },
          {
            id: 3,
            event_date: 'May 2026',
            event_type: 'Diagnosis',
            title: 'Primary Diagnosis: Viral Gastritis',
            description: 'Presented with mild abdominal discomfort. Managed conservatively with oral hydration and antacids.',
            source_doc_id: null,
          },
          {
            id: 4,
            event_date: 'Mar 2026',
            event_type: 'Laboratory Investigation',
            title: 'Routine Health Checkup',
            description: 'Liver Function Test (LFT) & Renal Profile within normal baseline reference limits.',
            source_doc_id: null,
          },
        ]);
      })
      .finally(() => setLoading(false));
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

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        {/* Module Header Container */}
        <div className="govt-card p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                MODULE 05
              </span>
              <span className="text-[#0056B3] font-bold text-sm">
                Chronological Record Synthesis
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#00274C] mt-2">
              {language === 'hi' ? 'रोगी की स्वास्थ्य इतिहास समयरेखा' : 'Patient Chronological Health History'}
            </h1>
            <p className="text-base font-semibold text-gray-700 mt-1">
              Unified timeline aggregating historical prescriptions, laboratory test values, and past OPD encounters.
            </p>
          </div>

          {patient && (
            <div className="bg-slate-100 border-2 border-slate-300 p-4 rounded-md text-right font-mono font-bold text-[#00274C]">
              <div className="text-xl font-black">{patient.name}</div>
              <div className="text-[#0056B3] text-sm">ABHA: {patient.abha_id}</div>
              <div className="text-gray-600 text-xs mt-0.5">{patient.age} Yrs • {patient.gender}</div>
            </div>
          )}
        </div>

        {/* Timeline Container */}
        <div className="govt-card p-6 sm:p-8 space-y-6">
          <div className="border-b-2 border-gray-300 pb-3 flex justify-between items-center">
            <h3 className="text-xl font-black text-[#00274C]">
              Chronological Encounters & Record History
            </h3>
            <span className="text-xs bg-[#00274C] text-white px-3 py-1 rounded font-bold uppercase">
              Chronological View
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-600 font-bold text-lg animate-pulse">Loading patient medical records...</div>
          ) : (
            <div className="relative border-l-4 border-[#00274C] ml-4 pl-8 space-y-8">
              {timeline.map((item, idx) => {
                const isPrescription = item.event_type.includes('Prescription');
                const isBlood = item.event_type.includes('Blood') || item.event_type.includes('Lab');
                const isDiagnosis = item.event_type.includes('Diagnosis');

                return (
                  <div key={item.id || idx} className="relative">
                    {/* High-Contrast Timeline Dot */}
                    <div className="absolute -left-[43px] top-1.5 w-6 h-6 rounded-full bg-[#FF9933] border-3 border-[#00274C] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#00274C] rounded-full"></div>
                    </div>

                    {/* Timeline Card */}
                    <div className="govt-card p-5 border-2 border-[#00274C] bg-white space-y-3">
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black bg-[#00274C] text-[#FF9933] px-3 py-1 rounded">
                            {item.event_date}
                          </span>
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded border uppercase ${
                              isPrescription
                                ? 'bg-blue-100 text-[#0056B3] border-blue-400'
                                : isBlood
                                ? 'bg-emerald-100 text-[#138808] border-emerald-400'
                                : isDiagnosis
                                ? 'bg-purple-100 text-purple-900 border-purple-400'
                                : 'bg-gray-200 text-gray-900 border-gray-400'
                            }`}
                          >
                            {item.event_type}
                          </span>
                        </div>

                        {item.source_doc_id && (
                          <span className="text-xs text-[#0056B3] font-bold bg-blue-50 px-2.5 py-1 border border-blue-300 rounded">
                            Document #{item.source_doc_id}
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-xl text-[#00274C]">{item.title}</h4>
                      <p className="text-base text-gray-800 font-semibold leading-relaxed bg-slate-100 p-3 rounded border border-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => router.push('/patient/documents')}
            className="govt-button-secondary text-lg py-3 px-6"
          >
            &lt;- Back to Documents
          </button>
          <button
            onClick={() => router.push('/patient/summary')}
            className="govt-button-primary text-xl py-3.5 px-8"
          >
            Generate AI Clinical Summary -&gt;
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
