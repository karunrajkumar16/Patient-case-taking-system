'use client';

import React from 'react';
import Link from 'next/link';

interface StepProgressProps {
  currentStep: number; // 1 to 6
  language?: string;
}

export default function StepProgress({ currentStep, language = 'en' }: StepProgressProps) {
  const steps = [
    { num: '01', title: language === 'hi' ? '01. पहचान' : '01. Patient ID', href: '/patient' },
    { num: '02', title: language === 'hi' ? '02. सहमति' : '02. Consent', href: '/patient/consent' },
    { num: '03', title: language === 'hi' ? '03. लक्षण' : '03. Case Taking', href: '/patient/case-taking' },
    { num: '04', title: language === 'hi' ? '04. रिपोर्ट' : '04. Records & OCR', href: '/patient/documents' },
    { num: '05', title: language === 'hi' ? '05. सारांश' : '05. Summary', href: '/patient/summary' },
    { num: '06', title: language === 'hi' ? '06. सत्यापन' : '06. Doctor Review', href: '/doctor/review' },
  ];

  return (
    <div className="w-full bg-[#E2E8F0] border-b border-[#CBD5E1] py-1 px-2 shrink-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-1.5 text-center no-scrollbar pb-0.5">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <Link
                key={step.num}
                href={step.href}
                className={`py-1 px-2 border rounded text-[11px] sm:text-xs font-extrabold transition-all flex items-center justify-center gap-1 shrink-0 ${
                  isActive
                    ? 'bg-[#00274C] text-white border-[#001D39] ring-2 ring-[#FF9933]'
                    : isCompleted
                    ? 'bg-[#138808] text-white border-[#0B5205]'
                    : 'bg-white text-[#00274C] border-[#CBD5E1] hover:bg-slate-100'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0 ${
                    isActive
                      ? 'bg-[#FF9933] text-black'
                      : isCompleted
                      ? 'bg-white text-[#138808]'
                      : 'bg-[#CBD5E1] text-[#00274C]'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </span>

                <span className="whitespace-nowrap sm:truncate">{step.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
