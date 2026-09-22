'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import KioskHeader from '../../components/KioskHeader';
import StepProgress from '../../components/StepProgress';
import { lookupAbha, createEncounter } from '../api';

export default function PatientIdentificationPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  const [abhaInput, setAbhaInput] = useState('');
  const [loading, setLoading] = useState(false);

  const initEncounter = async (patient: any) => {
    try {
      const enc = await createEncounter(patient.id || 1, 'Kiosk Consultation');
      localStorage.setItem('medikiosk_encounter', JSON.stringify(enc));
    } catch (err) {
      console.log('Encounter creation fallback:', err);
      localStorage.setItem(
        'medikiosk_encounter',
        JSON.stringify({ id: 1, patient_id: patient.id || 1, status: 'IN_PROGRESS' })
      );
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = abhaInput.trim() || '91-2345-6789-0001';
    setLoading(true);

    try {
      const patient = await lookupAbha(query);
      localStorage.setItem('medikiosk_patient', JSON.stringify(patient));
      await initEncounter(patient);
    } catch (err) {
      console.log('ABHA Lookup fallback:', err);
      const fallback = {
        id: 1,
        abha_id: query,
        name: 'Ravi Kumar',
        age: 42,
        gender: 'Male',
        mobile: '+91 98765 43210',
      };
      localStorage.setItem('medikiosk_patient', JSON.stringify(fallback));
      await initEncounter(fallback);
    } finally {
      setLoading(false);
      router.push('/patient/consent');
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
      {/* Official Government Kiosk Header */}
      <KioskHeader
        language={language}
        setLanguage={setLanguage}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
      />

      {/* Step Progress Tracker */}
      <StepProgress currentStep={1} language={language} />

      {/* Main Kiosk Content Area - Centered Card Layout */}
      <main className="flex-1 min-h-0 flex flex-col justify-center items-center p-4 max-w-4xl mx-auto w-full overflow-hidden space-y-6">
        {/* Main Heading */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] tracking-tight">
            {language === 'hi'
              ? 'कृपया अपनी ABHA ID दर्ज करें'
              : 'Please Enter Your ABHA ID'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-600">
            {language === 'hi'
              ? 'आयुष्मान भारत स्वास्थ्य खाता (ABHA) सत्यापन पोर्टल'
              : 'Ayushman Bharat Digital Mission (ABDM) Public Healthcare Kiosk'}
          </p>
        </div>

        {/* Centered Prominent ABHA Input Card */}
        <div className="bg-white border-2 border-[#0056B3]/30 rounded-2xl p-6 sm:p-10 shadow-lg space-y-6 max-w-xl mx-auto w-full">
          {/* ABHA Badge Graphic */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-[#0056B3] flex items-center justify-center shadow-xs">
              <svg
                className="w-8 h-8 text-[#0056B3]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

          <form onSubmit={handleLookup} className="space-y-5">
            <div className="space-y-2 text-center">
              <label className="block text-base sm:text-lg font-bold text-[#0F2942]">
                {language === 'hi'
                  ? 'ABHA संख्या या स्वास्थ्य पता:'
                  : 'ABHA Number or 14-Digit Health ID:'}
              </label>
              <input
                type="text"
                placeholder="e.g. 91-2345-6789-0001"
                value={abhaInput}
                onChange={(e) => setAbhaInput(e.target.value)}
                autoFocus
                className="w-full border-2 border-[#0056B3] rounded-xl px-4 py-3.5 text-lg sm:text-xl font-mono font-bold text-[#0F2942] focus:outline-none focus:ring-4 focus:ring-blue-100 bg-slate-50 text-center tracking-wider"
              />
              <p className="text-xs font-semibold text-gray-500 pt-0.5">
                Enter your ABHA ID to generate official card & digital consent form
              </p>
            </div>

            {/* Search & Auto-Navigate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0056B3] hover:bg-[#004080] text-white font-extrabold text-lg py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Searching ABHA Profile...</span>
              ) : (
                <>
                  <span>
                    {language === 'hi'
                      ? 'खोजें एवं आगे बढ़ें'
                      : 'Search ABHA & Proceed'}
                  </span>
                  <span className="text-xl">-&gt;</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Kiosk Footer */}
      <footer className="w-full bg-white border-t border-gray-200 py-1.5 px-4 text-center text-[11px] text-gray-500 font-semibold select-none shrink-0">
        MediKiosk Public Healthcare Kiosk System — Ayushman Bharat Digital Mission (ABDM) Compliant
      </footer>
    </div>
  );
}
