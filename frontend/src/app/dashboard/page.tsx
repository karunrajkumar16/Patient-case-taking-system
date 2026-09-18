'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { fetchDashboardStats, fetchAuditLogs } from '@/app/api';

export default function DashboardPage() {
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [stats, setStats] = useState({
    today_cases_count: 12,
    documents_processed_count: 28,
    pending_doctor_reviews_count: 4,
    verified_summaries_count: 8,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => console.log('Using default dashboard stats:', err));
  }, []);

  const loadAuditLogs = () => {
    fetchAuditLogs()
      .then(setAuditLogs)
      .catch((err) => console.log('Audit load fallback:', err));
    setShowAuditModal(true);
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

      {/* Official ABDM Kiosk Hero Section Banner */}
      <div className="bg-[#00274C] text-white py-10 px-4 border-b-8 border-[#FF9933]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#138808] text-white text-xs font-black px-3 py-1 rounded uppercase tracking-widest border border-white">
                {language === 'hi' ? 'आधिकारिक स्वास्थ्य सेवा पोर्टल' : 'Official Health Kiosk Portal'}
              </span>
              <span className="bg-[#FF9933] text-black text-xs font-extrabold px-2.5 py-1 rounded">
                ABDM / Ayushman Bharat
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'hi' 
                ? 'आयुष्मान भारत सार्वजनिक स्वास्थ्य कियोस्क' 
                : 'Ayushman Bharat Public Health Kiosk'}
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
              {language === 'hi'
                ? 'रोगी के लक्षणों, पुराने पर्चे और लैब रिपोर्ट को मिलाकर डॉक्टर के लिए स्पष्ट और सटीक स्वास्थ्य सारांश तैयार करें।'
                : 'Combining patient symptoms, historical uploaded records, OCR extractions, and timelines into doctor-verified clinical context.'}
            </p>
          </div>

          {/* Prominent Kiosk Start Button */}
          <Link
            href="/patient"
            className="govt-button-success text-xl py-4 px-8 border-2 border-white flex items-center gap-3 shadow-none hover:scale-[1.01] transition-transform"
          >
            <span>▶</span>
            <span>{language === 'hi' ? 'रोगी परामर्श प्रारंभ करें' : 'Start Patient Consultation'}</span>
          </Link>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Section Header */}
        <div className="border-b-2 border-[#00274C] pb-3 flex justify-between items-end">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#00274C]">
              {language === 'hi' ? 'आज की सेवा सांख्यिकी' : "Today's Kiosk Statistics"}
            </h2>
            <p className="text-sm font-semibold text-gray-600 mt-0.5">
              {language === 'hi' ? 'सार्वजनिक स्वास्थ्य केंद्र दैनिक रिकॉर्ड' : 'Public Health Center Daily Operational Overview'}
            </p>
          </div>
          <span className="text-xs bg-[#00274C] text-white px-3 py-1 rounded font-bold uppercase hidden sm:inline">
            Live Status
          </span>
        </div>

        {/* Traditional High-Contrast Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="govt-card p-6 border-t-8 border-t-[#0056B3]">
            <p className="text-sm font-extrabold text-gray-600 uppercase tracking-wider">
              {language === 'hi' ? 'कुल पंजीकृत मामले' : "Today's Cases Registered"}
            </p>
            <p className="text-4xl font-black text-[#00274C] mt-3">{stats.today_cases_count}</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">Patient encounters active</p>
          </div>

          {/* Card 2 */}
          <div className="govt-card p-6 border-t-8 border-t-[#138808]">
            <p className="text-sm font-extrabold text-gray-600 uppercase tracking-wider">
              {language === 'hi' ? 'प्रोसेस्ड दस्तावेज (OCR)' : 'Documents Processed'}
            </p>
            <p className="text-4xl font-black text-[#138808] mt-3">{stats.documents_processed_count}</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">OCR text & diagnosis scored</p>
          </div>

          {/* Card 3 */}
          <div className="govt-card p-6 border-t-8 border-t-[#B45309]">
            <p className="text-sm font-extrabold text-gray-600 uppercase tracking-wider">
              {language === 'hi' ? 'लंबित डॉक्टर समीक्षा' : 'Pending Doctor Reviews'}
            </p>
            <p className="text-4xl font-black text-[#B45309] mt-3">{stats.pending_doctor_reviews_count}</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">Awaiting clinician sign-off</p>
          </div>

          {/* Card 4 */}
          <div className="govt-card p-6 border-t-8 border-t-[#00274C]">
            <p className="text-sm font-extrabold text-gray-600 uppercase tracking-wider">
              {language === 'hi' ? 'सत्यापित स्वास्थ्य रिकॉर्ड' : 'Doctor Verified Records'}
            </p>
            <p className="text-4xl font-black text-[#00274C] mt-3">{stats.verified_summaries_count}</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">Finalized clinical summaries</p>
          </div>
        </div>

        {/* Modules Navigation & Official Audit Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Kiosk Action Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-extrabold text-[#00274C] border-b-2 border-gray-300 pb-2">
              {language === 'hi' ? 'केन्द्र कार्यप्रवाह (Workflow Modules)' : 'Kiosk Workflow Modules'}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/patient"
                className="govt-card p-5 border-2 border-[#0056B3] hover:border-[#00274C] bg-blue-50/50 hover:bg-blue-100/50 transition-colors flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#0056B3] text-white font-black text-xs px-2.5 py-0.5 rounded">MODULE 01–05</span>
                    <h4 className="text-lg font-black text-[#00274C] group-hover:text-[#0056B3]">
                      {language === 'hi' ? '1. रोगी परामर्श एवं डेटा प्रविष्टि' : '1. Full Patient Consultation Kiosk'}
                    </h4>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    ABHA ID Lookup -- Consent -- Bhashini Voice Input -- Medical OCR -- Health Timeline -- AI Summary.
                  </p>
                </div>
                <span className="text-2xl font-black text-[#0056B3] group-hover:translate-x-1 transition-transform">-&gt;</span>
              </Link>

              <Link
                href="/doctor/review"
                className="govt-card p-5 border-2 border-[#138808] hover:border-[#0B5205] bg-emerald-50/50 hover:bg-emerald-100/50 transition-colors flex justify-between items-center group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#138808] text-white font-black text-xs px-2.5 py-0.5 rounded">MODULE 06–07</span>
                    <h4 className="text-lg font-black text-[#0B5205] group-hover:text-[#138808]">
                      {language === 'hi' ? '2. चिकित्सक समीक्षा एवं सत्यापन पोर्टल' : '2. Doctor Clinical Review Suite'}
                    </h4>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Doctor verification, Red-Flag warning checks, summary text editing, and digital signature sign-off.
                  </p>
                </div>
                <span className="text-2xl font-black text-[#138808] group-hover:translate-x-1 transition-transform">-&gt;</span>
              </Link>
            </div>
          </div>

          {/* Official Audit & Security Notice Box */}
          <div className="govt-card p-6 bg-slate-100 border-2 border-[#00274C] flex flex-col justify-between">
            <div>
              <div className="mb-3">
                <h3 className="text-xl font-black text-[#00274C]">
                  {language === 'hi' ? 'सुरक्षा एवं लेखा परीक्षा' : 'Security & Audit Registry'}
                </h3>
              </div>
              <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-4">
                All patient encounters require explicit digital consent under ABDM guidelines. Doctor edits and verified sign-offs generate an immutable audit log.
              </p>
            </div>

            <button
              onClick={loadAuditLogs}
              className="govt-button-primary w-full text-base py-3 flex items-center justify-center gap-2 mt-4"
            >
              <span>{language === 'hi' ? 'प्रणाली लेखा लॉग देखें' : 'View Official Audit Logs'}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Traditional Government Audit Log Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-[#00274C] rounded-md max-w-5xl w-full max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#00274C] text-white px-6 py-4 flex justify-between items-center border-b-4 border-[#FF9933]">
              <div>
                <h3 className="font-black text-xl">
                  {language === 'hi' ? 'आधिकारिक प्रणाली ऑडिट रजिस्ट्रार' : 'Official System Audit & Traceability Registry'}
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">National Health Authority - ABDM Data Compliance</p>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="bg-[#FF9933] text-black font-black px-4 py-1.5 rounded text-sm hover:bg-[#E68A00]"
              >
                [X] Close
              </button>
            </div>


            {/* Modal Table Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm border-collapse border-2 border-[#00274C] text-left">
                <thead>
                  <tr className="bg-[#00274C] text-white font-black">
                    <th className="p-3 border-2 border-gray-400">ID</th>
                    <th className="p-3 border-2 border-gray-400">Actor Role</th>
                    <th className="p-3 border-2 border-gray-400">Action Performed</th>
                    <th className="p-3 border-2 border-gray-400">Target Entity</th>
                    <th className="p-3 border-2 border-gray-400">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-gray-900">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log, idx) => (
                      <tr key={log.id || idx} className="border-b-2 border-gray-300 hover:bg-slate-100">
                        <td className="p-3 border font-mono font-bold text-[#00274C]">#{log.id}</td>
                        <td className="p-3 border text-[#0056B3] font-extrabold">{log.actor_role}</td>
                        <td className="p-3 border font-mono text-[#138808]">{log.action}</td>
                        <td className="p-3 border">{log.entity_type} ({log.entity_id})</td>
                        <td className="p-3 border text-gray-600 font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-600 font-bold">
                        No audit events recorded yet. Complete a patient encounter to view logs.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Official 3-Tier NIC Government Portal Footer */}
      <Footer />
    </div>
  );
}

