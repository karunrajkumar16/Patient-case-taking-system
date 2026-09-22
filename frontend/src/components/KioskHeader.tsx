'use client';

import React from 'react';
import Link from 'next/link';

interface KioskHeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  highContrast?: boolean;
  setHighContrast?: (val: boolean) => void;
}

export default function KioskHeader({
  language,
  setLanguage,
  fontSize,
  setFontSize,
  highContrast = false,
  setHighContrast,
}: KioskHeaderProps) {
  return (
    <header className="w-full bg-white select-none shadow-sm shrink-0">
      {/* Top Thin Tricolor Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      {/* Main Government Kiosk Branding Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex justify-between items-center gap-2">
        {/* Left: Government of India Emblem & Ministry */}
        <div className="flex items-center space-x-2 shrink-0">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#0F2942] shrink-0" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#0F2942" strokeWidth="3" />
            <circle cx="50" cy="50" r="16" fill="none" stroke="#0056B3" strokeWidth="2.5" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 16 * Math.cos((i * Math.PI) / 6)}
                y2={50 + 16 * Math.sin((i * Math.PI) / 6)}
                stroke="#0056B3"
                strokeWidth="1.5"
              />
            ))}
            <path d="M50 12 L53 25 L47 25 Z" fill="#FF9933" />
            <path d="M50 88 L53 75 L47 75 Z" fill="#138808" />
          </svg>

          <div className="text-left leading-tight hidden xs:block">
            <div className="text-[10px] sm:text-xs font-bold text-[#0F2942] uppercase tracking-wide">
              {language === 'hi' ? 'अध्यक्षभावन भारत' : 'Government of India'}
            </div>
            <div className="text-[9px] sm:text-[10px] font-semibold text-gray-600 truncate hidden md:block">
              {language === 'hi'
                ? 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय'
                : 'Ministry of Health & Family Welfare'}
            </div>
          </div>
        </div>

        {/* Center: MediKiosk Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block h-6 w-[1.5px] bg-gray-300" />
          <div className="text-center">
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F2942] tracking-tight leading-none">
              MediKiosk
            </h1>
            <div className="h-1 w-full bg-[#0D9488] rounded-full mt-0.5" />
          </div>
          <div className="hidden sm:block h-6 w-[1.5px] bg-gray-300" />
        </div>

        {/* Right: ABDM Logo & Language Toggle */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#0056B3] bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-0.5 shadow-xs">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#138808" strokeWidth="2.5" />
                <path d="M20 8 V32 M8 20 H32" stroke="#0056B3" strokeWidth="4" strokeLinecap="round" />
                <circle cx="20" cy="20" r="5" fill="#FF9933" />
              </svg>
            </div>
            <div className="text-left leading-none hidden sm:block">
              <div className="text-xs font-black text-[#0056B3]">ABDM</div>
              <div className="text-[9px] font-bold text-gray-500 uppercase">Govt of India</div>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex border border-gray-300 rounded overflow-hidden text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] ${
                language === 'en' ? 'bg-[#0056B3] text-white font-bold' : 'bg-gray-100 text-gray-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-1.5 py-0.5 text-[10px] sm:text-[11px] ${
                language === 'hi' ? 'bg-[#0056B3] text-white font-bold' : 'bg-gray-100 text-gray-700'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <Link
            href="/dashboard"
            className="text-[10px] text-gray-500 hover:text-red-700 font-semibold underline hidden lg:inline ml-1"
          >
            Exit
          </Link>
        </div>
      </div>

      <div className="h-0.5 w-full bg-[#0D9488]" />
    </header>
  );
}
