'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  highContrast?: boolean;
  setHighContrast?: (val: boolean) => void;
}

export default function Header({ 
  language, 
  setLanguage, 
  fontSize, 
  setFontSize,
  highContrast = false,
  setHighContrast
}: HeaderProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="w-full bg-white border-b-2 border-[#00274C] select-none">
      {/* Indian National Tricolor Accent Bar */}
      <div className="govt-header-strip" />

      {/* 1. Top Official Government Accessibility & Ministry Strip (NIC Standard) */}
      <div className="bg-[#00274C] text-white px-4 py-1.5 text-xs flex flex-wrap justify-between items-center border-b border-[#003366]">
        <div className="flex items-center space-x-3">
          <span className="font-bold uppercase tracking-wider bg-[#FF9933] text-black px-2 py-0.5 rounded-xs text-[10px]">
            भारत सरकार | GOVT OF INDIA
          </span>
          <span className="text-gray-200 hidden md:inline font-medium text-xs">
            स्वास्थ्य एवं परिवार कल्याण मंत्रालय | Ministry of Health & Family Welfare
          </span>
        </div>

        {/* Accessibility & Language Toolbar */}
        <div className="flex items-center space-x-3 text-xs font-semibold">
          <a href="#main-content" className="hover:underline text-gray-300 hidden sm:inline">
            Skip to main content
          </a>
          <span className="text-gray-500 hidden sm:inline">|</span>
          <span className="text-gray-300 hidden sm:inline">Screen Reader Access</span>
          <span className="text-gray-500 hidden sm:inline">|</span>

          {/* Font Size Selector */}
          <div className="flex items-center space-x-1 bg-[#003366] px-2 py-0.5 rounded border border-[#004080]">
            <span className="text-gray-300 mr-1 text-[10px]">Text Size:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.2 rounded text-xs ${fontSize === 'normal' ? 'bg-[#FF9933] text-black font-extrabold' : 'text-gray-300 hover:text-white'}`}
              title="Standard Font Size (18px)"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.2 rounded text-xs ${fontSize === 'large' ? 'bg-[#FF9933] text-black font-extrabold' : 'text-gray-300 hover:text-white'}`}
              title="Large Font Size (20px)"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-1.5 py-0.2 rounded text-xs ${fontSize === 'xlarge' ? 'bg-[#FF9933] text-black font-extrabold' : 'text-gray-300 hover:text-white'}`}
              title="Extra Large Font Size for Senior Citizens (22px)"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          {setHighContrast && (
            <button
              onClick={() => setHighContrast(!highContrast)}
              className="bg-[#003366] hover:bg-[#004494] text-yellow-300 px-2 py-0.5 rounded border border-[#004080]"
              title="Toggle High Contrast Mode"
            >
              {highContrast ? 'Standard' : 'High Contrast'}
            </button>
          )}

          {/* Language Selector */}
          <div className="flex border border-[#004080] rounded overflow-hidden">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs ${language === 'en' ? 'bg-[#FF9933] text-black font-extrabold' : 'bg-[#003366] text-white hover:bg-[#004080]'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 text-xs ${language === 'hi' ? 'bg-[#FF9933] text-black font-extrabold' : 'bg-[#003366] text-white hover:bg-[#004080]'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Government Agency Header Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center bg-white">
        <div className="flex items-center space-x-4">
          {/* Official Ashoka Emblem Graphic / NHA Emblem Motif */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#00274C] text-[#FF9933] font-black text-xs flex flex-col items-center justify-center rounded border-2 border-[#0056B3] leading-none text-center">
              <span className="text-white font-extrabold text-[10px]">NHA</span>
              <span className="text-[#FF9933] font-black text-[9px] uppercase tracking-widest mt-0.5">GOVT</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="text-2xl sm:text-3xl font-black text-[#00274C] tracking-tight hover:text-[#0056B3]">
                  MediKiosk
                </Link>
                <span className="bg-[#0056B3] text-white text-[11px] px-2.5 py-0.5 font-bold rounded uppercase border border-[#003366]">
                  {language === 'hi' ? 'आयुष्मान भारत संगत' : 'ABDM Portal'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#00274C] mt-0.5">
                {language === 'hi' 
                  ? 'राष्ट्रीय स्वास्थ्य प्राधिकरण — आयुष्मान भारत डिजिटल मिशन' 
                  : 'National Health Authority — Ayushman Bharat Digital Mission (ABDM)'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Government Badges */}
        <div className="flex items-center space-x-3 mt-2 sm:mt-0 text-xs font-bold text-[#00274C]">
          <div className="border border-gray-300 px-3 py-1.5 rounded bg-slate-50 text-center">
            <div className="text-[10px] text-gray-500 uppercase">Framework</div>
            <div className="text-[#0056B3] font-black">DigiLocker / ABHA</div>
          </div>
          <div className="border border-gray-300 px-3 py-1.5 rounded bg-slate-50 text-center hidden md:block">
            <div className="text-[10px] text-gray-500 uppercase">Initiative</div>
            <div className="text-[#138808] font-black">Digital India</div>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Main Government Navigation Bar */}
      <nav className="w-full bg-[#00274C] text-white border-y-2 border-[#001D39] px-4 py-0 select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs sm:text-sm font-extrabold uppercase">
          <div className="flex flex-wrap items-center">
            <Link 
              href="/dashboard" 
              className="px-4 py-2.5 bg-[#0056B3] text-white hover:bg-[#003366] border-r border-[#003366] flex items-center gap-1 font-black"
            >
              {language === 'hi' ? 'मुख्य पृष्ठ' : 'HOME'}
            </Link>
            <Link 
              href="/patient" 
              className="px-4 py-2.5 hover:bg-[#003366] border-r border-[#003366] text-slate-100"
            >
              {language === 'hi' ? 'रोगी परामर्श कियोस्क' : 'PATIENT KIOSK'}
            </Link>
            <Link 
              href="/doctor/review" 
              className="px-4 py-2.5 hover:bg-[#003366] border-r border-[#003366] text-slate-100"
            >
              {language === 'hi' ? 'चिकित्सक समीक्षा' : 'DOCTOR PORTAL'}
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2.5 hover:bg-[#003366] border-r border-[#003366] text-slate-100 hidden sm:inline"
            >
              {language === 'hi' ? 'सेवा सांख्यिकी' : 'SERVICE STATS'}
            </Link>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="px-4 py-2.5 bg-[#FF9933] text-black font-black hover:bg-[#E68A00]"
            >
              {language === 'hi' ? 'कियोस्क निर्देश' : 'HELP & GUIDANCE'}
            </button>
          </div>
        </div>
      </nav>

      {/* 4. Scrolling News Ticker Marquee Strip */}
      <div className="bg-[#FFFBEB] border-b-2 border-amber-300 px-4 py-1.5 text-xs text-amber-950 font-bold overflow-hidden flex items-center">
        <span className="bg-[#B45309] text-white px-2 py-0.5 rounded-xs font-black text-[10px] uppercase tracking-wider shrink-0 mr-3">
          ANNOUNCEMENT / सूचना
        </span>
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee font-mono text-amber-900 font-bold text-xs sm:text-sm">
            Ayushman Bharat Digital Mission (ABDM) Public Healthcare Kiosk -- Instant ABHA ID Verification -- Multilingual Voice Input via Bhashini -- Automated Medical Records OCR -- Mandatory Doctor Review & Verification.
          </div>
        </div>
      </div>

      {/* Official Guidance Banner Modal */}
      {showHelp && (
        <div className="bg-amber-50 border-b-4 border-amber-500 px-6 py-4 text-base text-amber-950">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <div className="space-y-1">
              <p className="font-extrabold text-lg text-amber-900">
                {language === 'hi' ? 'आयुष्मान भारत स्वास्थ्य कियोस्क उपयोग निर्देश:' : 'Ayushman Bharat Health Kiosk Official Guidance:'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm font-medium text-amber-900 pt-1">
                <li><strong>Step 1:</strong> Enter 14-digit ABHA ID or select a demo profile.</li>
                <li><strong>Step 2:</strong> Review and sign digital consent for health record processing.</li>
                <li><strong>Step 3:</strong> Describe symptoms using Bhashini Voice Input or text.</li>
                <li><strong>Step 4:</strong> Upload medical prescriptions or lab reports for automated OCR processing.</li>
                <li><strong>Step 5:</strong> Present generated summary to treating doctor for final sign-off.</li>
              </ul>
            </div>
            <button 
              onClick={() => setShowHelp(false)}
              className="bg-amber-900 text-white font-bold px-3 py-1 rounded text-xs hover:bg-amber-950"
            >
              [X] Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}


