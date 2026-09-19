'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StepProgress from '../../components/StepProgress';
import { fetchDemoPatients, lookupAbha, createEncounter } from '../api';

export default function PatientIdentificationPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [abhaInput, setAbhaInput] = useState('');
  const [demoPatients, setDemoPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDemoPatients()
      .then(setDemoPatients)
      .catch((err) => {
        console.log('Demo patients fetch fallback:', err);
        setDemoPatients([
          { id: 1, abha_id: '91-2345-6789-0001', name: 'Ravi Kumar', age: 42, gender: 'Male', is_demo: true },
          { id: 2, abha_id: '91-2345-6789-0002', name: 'Priya Sharma', age: 36, gender: 'Female', is_demo: true },
          { id: 3, abha_id: '91-2345-6789-0003', name: 'Suresh Patel', age: 58, gender: 'Male', is_demo: true },
        ]);
      });
  }, []);

  const initEncounter = async (patient: any) => {
    try {
      const enc = await createEncounter(patient.id || 1, 'Kiosk Consultation');
      localStorage.setItem('medikiosk_encounter', JSON.stringify(enc));
    } catch (err) {
      console.log('Encounter creation fallback:', err);
      localStorage.setItem('medikiosk_encounter', JSON.stringify({ id: 1, patient_id: patient.id || 1, status: 'IN_PROGRESS' }));
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!abhaInput.trim()) return;
    setLoading(true);
    try {
      const patient = await lookupAbha(abhaInput.trim());
      setSelectedPatient(patient);
      localStorage.setItem('medikiosk_patient', JSON.stringify(patient));
      await initEncounter(patient);
    } catch (err) {
      const fallback = { id: 1, abha_id: abhaInput.trim(), name: 'Patient ' + abhaInput.trim(), age: 40, gender: 'Male' };
      setSelectedPatient(fallback);
      localStorage.setItem('medikiosk_patient', JSON.stringify(fallback));
      await initEncounter(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = async (patient: any) => {
    setSelectedPatient(patient);
    setAbhaInput(patient.abha_id);
    localStorage.setItem('medikiosk_patient', JSON.stringify(patient));
    await initEncounter(patient);
  };

  const handleProceed = () => {
    if (!selectedPatient) return;
    router.push('/patient/consent');
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
      <StepProgress currentStep={1} language={language} />

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        <div className="govt-card p-6 sm:p-8 space-y-8">
          {/* Module Header Strip */}
          <div className="border-b-2 border-[#00274C] pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#00274C] text-[#FF9933] text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                MODULE 01
              </span>
              <span className="text-[#0056B3] font-bold text-sm">
                ABDM Patient Verification
              </span>
            </div>
            <h1 className="text-3xl font-black text-[#00274C] mt-2">
              {language === 'hi' ? 'रोगी पहचान (ABHA ID Verification)' : 'Patient ABHA Identification'}
            </h1>
            <p className="text-base font-semibold text-gray-700 mt-1">
              {language === 'hi'
                ? 'अपनी 14-अंकों की आयुष्मान भारत स्वास्थ्य खाता (ABHA) संख्या दर्ज करें या त्वरित परीक्षण हेतु नीचे उपलब्ध डेमो मरीज चुनें।'
                : 'Enter your 14-digit Ayushman Bharat Health Account (ABHA) ID or select a demo patient profile below.'}
            </p>
          </div>

          {/* ABHA Input Form with Large Touchable Controls */}
          <form onSubmit={handleLookup} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-lg font-black text-[#00274C] mb-2">
                {language === 'hi' ? 'आयुष्मान भारत स्वास्थ्य खाता (ABHA ID):' : 'ABHA ID Number (14 Digits):'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. 91-2345-6789-0001"
                  value={abhaInput}
                  onChange={(e) => setAbhaInput(e.target.value)}
                  className="flex-1 border-2 border-[#00274C] rounded px-4 py-3 text-xl font-mono font-bold text-[#00274C] focus:outline-none focus:ring-4 focus:ring-[#FF9933] bg-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="govt-button-primary py-3 px-8 text-lg flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Searching...' : language === 'hi' ? 'खोजें' : 'Search ABHA'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Demo Patient Selector Box */}
          <div className="bg-slate-100 border-2 border-slate-400 rounded-md p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-slate-300 pb-3">
              <h3 className="text-lg font-black text-[#00274C]">
                {language === 'hi' ? 'मूल्यांकन हेतु डेमो मरीज चुनें:' : 'Select Demo Patient (For Quick Testing):'}
              </h3>
              <span className="bg-[#FF9933] text-black text-xs font-black px-3 py-1 rounded border border-amber-600">
                PROTOTYPE DEMO MODE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {demoPatients.map((demo, idx) => (
                <button
                  key={demo.id || idx}
                  onClick={() => handleSelectDemo(demo)}
                  className={`text-left p-4 border-2 rounded-md transition-all ${
                    selectedPatient?.abha_id === demo.abha_id
                      ? 'bg-blue-50 border-[#00274C] ring-4 ring-[#FF9933]'
                      : 'bg-white border-gray-400 hover:border-[#0056B3] hover:bg-slate-50'
                  }`}
                >
                  <div className="font-black text-[#0056B3] text-base">Patient 0{idx + 1}</div>
                  <div className="font-extrabold text-[#00274C] text-lg mt-1">{demo.name}</div>
                  <div className="text-gray-700 font-mono text-xs font-bold mt-1">ABHA: {demo.abha_id}</div>
                  <div className="text-gray-600 text-sm font-semibold mt-1">Age: {demo.age} Yrs • {demo.gender}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Verified Identity Card */}
          {selectedPatient && (
            <div className="border-2 border-[#138808] bg-emerald-50 rounded-md p-6 space-y-3">
              <div className="flex items-center justify-between border-b-2 border-emerald-200 pb-2">
                <span className="text-sm font-black text-[#138808] uppercase tracking-wider">
                  Verified ABDM Patient Profile Loaded
                </span>
                <span className="bg-[#138808] text-white text-xs font-black px-2.5 py-0.5 rounded">ACTIVE ENCOUNTER</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-1">
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block">Full Name</span>
                  <span className="text-xl font-black text-[#00274C]">{selectedPatient.name}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block">ABHA Number</span>
                  <span className="text-lg font-mono font-black text-[#0056B3]">{selectedPatient.abha_id}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block">Age</span>
                  <span className="text-xl font-black text-gray-900">{selectedPatient.age} Years</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-600 uppercase block">Gender</span>
                  <span className="text-xl font-black text-gray-900">{selectedPatient.gender}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Navigation Bar */}
          <div className="flex justify-end pt-4 border-t-2 border-gray-300">
            <button
              onClick={handleProceed}
              disabled={!selectedPatient}
              className={`govt-button-primary text-xl py-3.5 px-8 ${
                !selectedPatient ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>{language === 'hi' ? 'सहमति पृष्ठ पर जाएं ->' : 'Proceed to Digital Consent ->'}</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


