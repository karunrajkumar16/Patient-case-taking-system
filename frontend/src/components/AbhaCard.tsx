'use client';

import React from 'react';

export interface PatientProfile {
  id?: number;
  abha_id: string;
  name: string;
  name_hi?: string;
  age: number;
  gender: string;
  mobile?: string;
  dob?: string;
  photo_url?: string;
}

interface AbhaCardProps {
  patient: PatientProfile;
  onProceed?: () => void;
  showProceedButton?: boolean;
}

export default function AbhaCard({
  patient,
  onProceed,
  showProceedButton = true,
}: AbhaCardProps) {
  // Format ABHA number into 14-digit format: XX-XXXX-XXXX-XXXX
  const formatAbha = (id: string) => {
    const raw = id.replace(/-/g, '');
    if (raw.length === 14) {
      return `${raw.slice(0, 2)}-${raw.slice(2, 6)}-${raw.slice(6, 10)}-${raw.slice(10)}`;
    }
    return id;
  };

  const abhaFormatted = formatAbha(patient.abha_id);
  const abhaAddress = `${patient.name.toLowerCase().replace(/\s+/g, '')}@abdm`;
  const dobFormatted = patient.dob || `14/05/${2026 - patient.age}`;
  const mobileFormatted = patient.mobile || '+91 98765 43210';

  return (
    <div className="w-full max-w-xl mx-auto select-none font-sans">
      {/* Official ABHA PVC Identification Card */}
      <div className="bg-white rounded-xl border border-gray-300 shadow-md overflow-hidden relative">
        
        {/* Top Deep Blue Header Bar */}
        <div className="bg-[#1D3B8B] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between gap-1">
          
          {/* Left: National Health Authority Emblem & Logo Text */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 16 * Math.cos((i * Math.PI) / 6)}
                  y2={50 + 16 * Math.sin((i * Math.PI) / 6)}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              ))}
              <path d="M50 12 L53 25 L47 25 Z" fill="#FF9933" />
              <path d="M50 88 L53 75 L47 75 Z" fill="#138808" />
            </svg>
            <div className="leading-tight text-left hidden xs:block">
              <div className="text-[9px] font-bold tracking-tight text-slate-100 leading-none">
                national
              </div>
              <div className="text-[11px] font-extrabold tracking-tight text-white leading-none mt-0.5">
                health
              </div>
              <div className="text-[9px] font-bold tracking-tight text-slate-100 leading-none">
                authority
              </div>
            </div>
          </div>

          {/* Center: Official Title in English & Hindi */}
          <div className="text-center leading-tight">
            <div className="text-[11px] sm:text-xs font-semibold tracking-wide text-white">
              Ayushman Bharat Health Account (ABHA)
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold tracking-wide text-slate-100">
              आयुष्मान भारत स्वास्थ्य खाता (आभा)
            </div>
          </div>

          {/* Right: Circular NHA Emblem Badge */}
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white p-0.5 shadow shrink-0 flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#1D3B8B" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="14" stroke="#138808" strokeWidth="2" strokeDasharray="3 3" />
              <circle cx="20" cy="18" r="4" fill="#138808" />
              <path d="M20 22 C14 22 14 30 20 30 C26 30 26 22 20 22 Z" fill="#FF9933" />
            </svg>
          </div>
        </div>

        {/* Card Body matching exact image grid layout */}
        <div className="p-3 sm:p-4 bg-white relative">
          
          <div className="flex flex-col xs:flex-row items-center xs:items-start gap-3 sm:gap-4">
            
            {/* Left Column: Photo */}
            <div className="shrink-0">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-lg bg-slate-200 border border-gray-400 overflow-hidden shadow-xs flex items-end justify-center bg-gradient-to-b from-slate-100 to-slate-300">
                <svg className="w-16 h-18 sm:w-20 sm:h-22 text-[#1D3B8B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            </div>

            {/* Middle Column: Fields */}
            <div className="flex-1 text-center xs:text-left space-y-1.5 sm:space-y-2 w-full">
              
              {/* Name / नाम */}
              <div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                  Name / नाम
                </div>
                <div className="text-sm sm:text-lg font-bold text-gray-900 tracking-wide leading-none mt-0.5">
                  {patient.name}
                </div>
              </div>

              {/* ABHA Number / आभा संख्या */}
              <div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                  ABHA Number / आभा संख्या
                </div>
                <div className="text-sm sm:text-lg font-bold font-mono text-gray-900 tracking-wider leading-none mt-0.5">
                  {abhaFormatted}
                </div>
              </div>

              {/* ABHA Address / आभा पता */}
              <div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-gray-500">
                  ABHA Address / आभा पता
                </div>
                <div className="text-[11px] sm:text-xs font-semibold font-mono text-gray-900 leading-none mt-0.5">
                  {abhaAddress}
                </div>
              </div>

              {/* Bottom Metadata 3 Columns */}
              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-gray-200 text-[10px] sm:text-[11px]">
                <div>
                  <div className="font-semibold text-gray-500">Gender</div>
                  <div className="font-bold text-gray-900">{patient.gender}</div>
                </div>

                <div>
                  <div className="font-semibold text-gray-500">DOB</div>
                  <div className="font-bold text-gray-900">{dobFormatted}</div>
                </div>

                <div>
                  <div className="font-semibold text-gray-500">Mobile</div>
                  <div className="font-bold text-gray-900 truncate">{mobileFormatted}</div>
                </div>
              </div>

            </div>

            {/* Right Column: QR Code */}
            <div className="shrink-0 flex flex-col items-center justify-center p-1 bg-white rounded-lg border border-gray-300 shadow-2xs self-center xs:self-start">
              <svg className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100" fill="#1D3B8B">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="white" />
                <rect x="10" y="10" width="10" height="10" />

                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="white" />
                <rect x="80" y="10" width="10" height="10" />

                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="white" />
                <rect x="10" y="80" width="10" height="10" />

                <rect x="38" y="5" width="12" height="12" />
                <rect x="55" y="5" width="8" height="8" />
                <rect x="38" y="22" width="10" height="10" />
                <rect x="52" y="22" width="12" height="12" />

                <rect x="5" y="38" width="12" height="12" />
                <rect x="22" y="38" width="10" height="10" />
                <rect x="38" y="38" width="16" height="16" />
                <rect x="60" y="38" width="12" height="12" />
                <rect x="78" y="38" width="16" height="16" />

                <rect x="5" y="55" width="10" height="10" />
                <rect x="20" y="55" width="12" height="12" />

                <rect x="38" y="60" width="14" height="14" />
                <rect x="56" y="60" width="10" height="10" />

                <rect x="38" y="78" width="18" height="18" />
                <rect x="60" y="78" width="12" height="12" />
                <rect x="76" y="78" width="18" height="18" />
              </svg>
            </div>

          </div>

        </div>
      </div>

      {/* Action Button */}
      {showProceedButton && onProceed && (
        <div className="mt-3 sm:mt-4 flex justify-center">
          <button
            onClick={onProceed}
            className="bg-[#0056B3] hover:bg-[#004080] text-white font-extrabold text-base sm:text-lg px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>Proceed to Digital Consent</span>
            <span className="text-xl">-&gt;</span>
          </button>
        </div>
      )}
    </div>
  );
}
