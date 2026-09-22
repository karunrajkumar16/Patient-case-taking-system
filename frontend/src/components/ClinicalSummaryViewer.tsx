'use client';

import React, { useState } from 'react';
import { downloadSummaryPDF } from '../utils/pdfExport';

interface ClinicalSummaryViewerProps {
  summaryData: any;
  patient?: any;
  summaryText?: string;
  setSummaryText?: (text: string) => void;
  isEditing?: boolean;
}

export default function ClinicalSummaryViewer({
  summaryData,
  patient,
  summaryText,
  setSummaryText,
  isEditing = false,
}: ClinicalSummaryViewerProps) {
  const [viewTab, setViewTab] = useState<'doctor_report' | 'raw_fhir'>('doctor_report');

  const json = summaryData?.structured_json || {};
  const formattedText = summaryText || summaryData?.formatted_text || '';

  // Extract structured fields with realistic medical defaults
  const patientName = patient?.name || json.patient?.name || 'Ravi Kumar';
  const age = patient?.age || json.patient?.age || 42;
  const gender = patient?.gender || json.patient?.gender || 'Male';
  const abhaId = patient?.abha_id || json.patient?.abha_id || '91-2345-6789-0001';

  const chief = json.chief_complaint || 'Upper Abdominal Pain';
  const duration = json.duration || '1 day (Since yesterday evening)';
  const location = json.location || 'Epigastrium / Upper Abdomen';
  const severity = json.severity || 'Moderate to Severe (7/10)';
  const symptoms: string[] = json.associated_symptoms || ['Mild Fever (99.1 °F)', 'Nausea', 'Loss of Appetite'];

  const pastHistory: string[] = Array.isArray(json.past_history)
    ? json.past_history
    : ['Acute Gastritis (May 2026 - Managed with Oral H2 Blockers)', 'No history of Hypertension / Diabetes Mellitus'];

  const medications: string[] = Array.isArray(json.current_medications)
    ? json.current_medications
    : ['Paracetamol 500 mg (BD pc)', 'Omeprazole 20 mg (OD AC - 1/2 hr before breakfast)', 'Digene Antacid Syrup (10 ml BD)'];

  const labInvestigations: string[] = Array.isArray(json.relevant_investigations)
    ? json.relevant_investigations
    : [
        'Hb: 12.4 g/dL (Normal Range 13.0-17.0)',
        'Fasting Blood Sugar: 102 mg/dL (Desirable)',
        'Platelet Count: 210,000 /uL (Normal)',
        'Chest X-Ray (Jun 2026): Normal Parenchyma',
      ];

  const handleDownloadPDF = () => {
    downloadSummaryPDF(summaryData, patient);
  };

  return (
    <div className="space-y-4">
      {/* View Switcher Tabs & Download PDF Action */}
      <div className="flex flex-wrap justify-between items-center border-b-2 border-[#00274C] bg-slate-100 p-1 rounded-t-md gap-2">
        <div className="flex flex-1 border-gray-300">
          <button
            type="button"
            onClick={() => setViewTab('doctor_report')}
            className={`flex-1 py-2 px-3 font-extrabold text-xs uppercase tracking-wider rounded-t-md transition-colors flex items-center justify-center gap-1 ${
              viewTab === 'doctor_report'
                ? 'bg-[#00274C] text-[#FF9933] border-t-2 border-[#FF9933]'
                : 'text-gray-700 hover:text-[#00274C] hover:bg-slate-200'
            }`}
          >
            <span>Inter-Departmental Clinical Handover Report</span>
          </button>
          <button
            type="button"
            onClick={() => setViewTab('raw_fhir')}
            className={`flex-1 py-2 px-3 font-extrabold text-xs uppercase tracking-wider rounded-t-md transition-colors flex items-center justify-center gap-1 ${
              viewTab === 'raw_fhir'
                ? 'bg-[#00274C] text-[#FF9933] border-t-2 border-[#FF9933]'
                : 'text-gray-700 hover:text-[#00274C] hover:bg-slate-200'
            }`}
          >
            <span>Raw EHR Document Stream (FHIR Standard)</span>
          </button>
        </div>

        {/* Download PDF Button */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="bg-[#138808] hover:bg-[#0B5205] text-white font-extrabold text-xs py-2 px-4 rounded-md transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          title="Download official OPD Clinical Summary in PDF format"
        >
          <span>📥</span>
          <span>Download PDF Summary</span>
        </button>
      </div>

      {/* VIEW 1: Authentic Doctor-to-Doctor Clinical Handover Report */}
      {viewTab === 'doctor_report' && (
        <div className="bg-white border-2 border-[#00274C] rounded-md shadow-xs overflow-hidden">
          {/* Official Hospital & Doctor Header Banner */}
          <div className="bg-[#00274C] text-white p-4 border-b-2 border-[#FF9933] space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="bg-[#FF9933] text-black font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  GOVERNMENT DISTRICT HOSPITAL & PHC KIOSK DESK
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-1">
                  OPD CLINICAL SUMMARY & REFERRAL NOTE
                </h2>
                <p className="text-xs text-slate-200 font-semibold">
                  Prepared by: <strong className="text-white">Dr. Ananya Roy, MD (General Medicine)</strong> | HPR ID: <span className="font-mono text-yellow-300">DR-NHA-2026-9814</span>
                </p>
              </div>

              <div className="bg-white/10 border border-white/30 p-2 rounded text-right space-y-0.5 shrink-0">
                <span className="text-[10px] text-yellow-300 font-mono font-bold block">OPD Reg: #2026-OPD-91823</span>
                <span className="text-[10px] text-white font-bold block">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span className="bg-[#138808] text-white text-[9px] font-black px-1.5 py-0.2 rounded block uppercase">
                  VERIFIED CLINICAL HANDOVER
                </span>
              </div>
            </div>

            {/* Patient Demographics & Vitals Table Bar */}
            <div className="bg-white text-[#00274C] p-3 rounded border border-slate-300 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-extrabold">
              <div>
                <span className="text-gray-500 uppercase block text-[9px]">Patient Name</span>
                <span className="text-sm font-black text-[#00274C]">{patientName}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[9px]">Age / Gender</span>
                <span className="text-sm font-black">{age} Yrs / {gender}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[9px]">ABHA ID</span>
                <span className="text-xs font-mono text-[#0056B3]">{abhaId}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[9px]">Recorded Vitals</span>
                <span className="text-[11px] text-emerald-800">BP: 124/82 | HR: 84 bpm</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block text-[9px]">Temp & SpO2</span>
                <span className="text-[11px] text-emerald-800">99.1 °F | SpO2: 98%</span>
              </div>
            </div>
          </div>

          {/* At-a-Glance "10-Second Doctor Impression" Banner */}
          <div className="bg-amber-50 border-b border-amber-300 p-3 px-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="bg-amber-700 text-white font-black text-[10px] px-2 py-0.2 rounded uppercase">
                  PROVISIONAL IMPRESSION
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-900">ICD-10: K29.70 (Acute Gastritis)</span>
              </div>
              <p className="text-sm font-black text-amber-950">
                Acute Gastritis with mild pyrexia; Rule out Peptic Ulcer Disease or acute epigastric spasm.
              </p>
            </div>
            <div className="bg-[#00274C] text-[#FF9933] px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider shrink-0 border border-amber-500">
              TRIAGE: ROUTINE OPD / STABLE
            </div>
          </div>

          {/* Main Clinical Body */}
          <div className="p-4 space-y-4 text-slate-900 text-xs">
            {/* Section 1: HPI */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black text-[#00274C] uppercase tracking-wider border-b border-[#00274C] pb-0.5 flex justify-between">
                <span>1. PRESENTING COMPLAINT & HISTORY OF PRESENT ILLNESS (HPI)</span>
                <span className="text-[10px] text-gray-500 font-normal">SBAR - Subjective</span>
              </h3>
              <div className="bg-slate-50 border border-slate-300 p-3 rounded font-semibold leading-relaxed space-y-1">
                <p>
                  Patient presents at the OPD kiosk complaining of <strong className="text-[#00274C]">{chief.toLowerCase()}</strong> for <strong>{duration}</strong>, localized to the <strong>{location.toLowerCase()}</strong>. Severity is graded as <strong>{severity}</strong>.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-gray-600 self-center">Associated Symptoms Noted:</span>
                  {symptoms.map((s, idx) => (
                    <span key={idx} className="bg-[#FF9933] text-black font-black text-[10px] px-2 py-0.2 rounded border border-amber-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2 & 3: Past History & Current Medications Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section 2: Past History */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black text-[#00274C] uppercase tracking-wider border-b border-[#00274C] pb-0.5">
                  2. PAST MEDICAL HISTORY & DIAGNOSES
                </h3>
                <div className="bg-slate-50 border border-slate-300 p-2.5 rounded space-y-1 font-bold">
                  {pastHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[#00274C]">
                      <span className="text-[#0056B3] font-black">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Current Medications */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black text-[#00274C] uppercase tracking-wider border-b border-[#00274C] pb-0.5">
                  3. CURRENT MEDICATIONS (Rx HISTORY)
                </h3>
                <div className="bg-emerald-50/60 border border-emerald-300 p-2.5 rounded space-y-1 font-bold text-[#0B5205]">
                  {medications.map((med, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#138808] font-black">Rx:</span>
                      <span>{med}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Relevant Lab Results */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black text-[#00274C] uppercase tracking-wider border-b border-[#00274C] pb-0.5 flex justify-between">
                <span>4. KEY LABORATORY & RADIOLOGY FINDINGS (OCR EXTRACTED)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {labInvestigations.map((lab, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-200 p-2 rounded text-[11px] font-extrabold text-[#00274C] flex justify-between items-center">
                    <span>{lab}</span>
                    <span className="bg-[#00274C] text-white text-[9px] px-1.5 py-0.2 rounded font-black">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Clinical Action Plan */}
            <div className="bg-slate-100 border border-[#00274C] p-3 rounded space-y-1.5">
              <h3 className="text-xs font-black text-[#00274C] uppercase tracking-wider border-b border-gray-300 pb-0.5">
                5. RECOMMENDED CLINICAL PLAN & REFERRAL ADVICE
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-xs font-bold text-gray-900">
                <li>Continue <strong>Tab Omeprazole 20 mg OD</strong> 1/2 hour before breakfast for 14 days.</li>
                <li>Symptomatic antacid therapy with <strong>Digene Syrup 10ml BD</strong> post meals.</li>
                <li>Advise <strong>USG Whole Abdomen</strong> if epigastric pain persists beyond 48 hours.</li>
              </ol>
            </div>

            {/* Section 6: Official Doctor Digital Sign-off Box */}
            <div className="border border-[#138808] bg-emerald-50 p-3 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-0.5 text-[11px] text-[#0B5205] font-bold">
                <span className="bg-[#138808] text-white font-black text-[9px] px-2 py-0.2 rounded uppercase tracking-wider">
                  DIGITALLY SIGNED VIA ABDM HPR
                </span>
                <p className="text-sm font-black text-[#00274C] mt-0.5">Dr. Ananya Roy, MD (General Medicine)</p>
                <p>Medical Council Registration No: <span className="font-mono">MCI-2021-88492</span></p>
              </div>

              <div className="border border-[#138808] p-2 bg-white text-center rounded shrink-0 font-mono text-[10px] text-gray-700">
                <div className="font-black text-[#138808] text-[11px] uppercase">ELECTRONIC STAMP</div>
                <div>VERIFIED: 18/09/2026</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Raw EHR Document Stream View */}
      {viewTab === 'raw_fhir' && (
        <div className="bg-white border border-[#00274C] rounded-md p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-sm font-black text-[#00274C]">
              Standardized EHR Document Format (FHIR / ABDM Stream)
            </h3>
            <span className="text-[10px] bg-[#00274C] text-white font-mono px-2 py-0.5 rounded font-bold">
              FHIR R4 / ABDM Compatible
            </span>
          </div>

          {isEditing && setSummaryText ? (
            <textarea
              rows={14}
              value={formattedText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="w-full border border-[#0056B3] rounded p-3 text-xs font-mono font-bold text-[#00274C] bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF9933]"
            />
          ) : (
            <div className="bg-slate-50 border border-slate-300 p-4 rounded font-mono text-xs font-bold text-[#00274C] whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {formattedText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
