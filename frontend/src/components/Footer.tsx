'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#001D38] text-white border-t-4 border-[#FF9933]">
      {/* Tier 1: Primary Links & Contact Info */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        {/* Column 1: About ABDM */}
        <div>
          <h3 className="text-[#FF9933] font-bold text-base mb-3 uppercase tracking-wider border-b border-gray-700 pb-1">
            Ayushman Bharat Digital Mission
          </h3>
          <p className="text-gray-300 text-xs leading-relaxed mb-3">
            MediKiosk is an integrated digital healthcare kiosk interface developed in alignment with ABDM standards to support seamless patient case-taking and doctor clinical context synthesis.
          </p>
          <div className="text-xs text-gray-400">
            <p className="font-semibold text-white">Government of India</p>
            <p>Ministry of Health & Family Welfare</p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-[#FF9933] font-bold text-base mb-3 uppercase tracking-wider border-b border-gray-700 pb-1">
            Important Links
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li>
              <a href="https://abdm.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] hover:underline">
                National Health Authority (NHA)
              </a>
            </li>
            <li>
              <a href="https://abdm.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] hover:underline">
                ABHA Number Registration
              </a>
            </li>
            <li>
              <a href="https://abdm.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] hover:underline">
                Health Facility Registry (HFR)
              </a>
            </li>
            <li>
              <a href="https://abdm.gov.in/" target="_blank" rel="noreferrer" className="hover:text-[#FF9933] hover:underline">
                Healthcare Professionals Registry (HPR)
              </a>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#FF9933] hover:underline">
                MediKiosk Doctor Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Portal Policies */}
        <div>
          <h3 className="text-[#FF9933] font-bold text-base mb-3 uppercase tracking-wider border-b border-gray-700 pb-1">
            Portal Policies & Help
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><span className="hover:text-[#FF9933] cursor-pointer">Website Policies & Terms</span></li>
            <li><span className="hover:text-[#FF9933] cursor-pointer">Hyperlinking Policy</span></li>
            <li><span className="hover:text-[#FF9933] cursor-pointer">Privacy Policy & Patient Data Security</span></li>
            <li><span className="hover:text-[#FF9933] cursor-pointer">Copyright Policy</span></li>
            <li><span className="hover:text-[#FF9933] cursor-pointer">Disclaimer & Disclaimer of Warranty</span></li>
            <li><span className="hover:text-[#FF9933] cursor-pointer">Grievance Redressal Mechanism</span></li>
          </ul>
        </div>

        {/* Column 4: Contact & Toll-Free */}
        <div>
          <h3 className="text-[#FF9933] font-bold text-base mb-3 uppercase tracking-wider border-b border-gray-700 pb-1">
            Helpdesk & Contact
          </h3>
          <div className="space-y-2 text-xs text-gray-300">
            <p className="font-semibold text-white">National Health Authority</p>
            <p>9th Floor, Tower-I, Jeevan Bharati Building,</p>
            <p>Connaught Place, New Delhi - 110001</p>
            <div className="pt-2 border-t border-gray-800">
              <p className="text-yellow-400 font-bold text-sm">Toll-Free Helpline: 14477</p>
              <p className="text-gray-300">Email: helpdesk.abdm@nha.gov.in</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2: Host & Technical Credits */}
      <div className="bg-[#00172D] py-3 border-t border-b border-gray-800 text-center text-xs text-gray-400 px-4">
        <p>
          Designed, Developed and Hosted by <strong className="text-white">National Informatics Centre (NIC)</strong> / <strong className="text-white">National Health Authority (NHA)</strong>
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          Content Managed by Ministry of Health & Family Welfare, Government of India
        </p>
      </div>

      {/* Tier 3: Copyright & Timestamp */}
      <div className="bg-[#000F1E] py-3 text-center text-xs text-gray-400 px-4 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <p>
          Copyright &copy; 2026 Ayushman Bharat Digital Mission (ABDM). All Rights Reserved.
        </p>
        <p className="text-gray-500 text-[11px] mt-1 md:mt-0">
          Last Updated: 18/09/2026 | Portal Version 2.4.0 (UX4G Standard Compliance)
        </p>
      </div>
    </footer>
  );
}
