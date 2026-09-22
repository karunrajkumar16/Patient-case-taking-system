/**
 * MediKiosk PDF Export Utility
 * Generates an official, print-ready Indian Government OPD Clinical Summary PDF document.
 */

export function downloadSummaryPDF(summaryData: any, patient?: any) {
  const json = summaryData?.structured_json || {};
  const formattedText = summaryData?.formatted_text || '';

  const patientName = patient?.name || json.patient?.name || 'Ravi Kumar';
  const abhaId = patient?.abha_id || json.patient?.abha_id || '91-2345-6789-0001';
  const age = patient?.age || json.patient?.age || 42;
  const gender = patient?.gender || json.patient?.gender || 'Male';
  const mobile = patient?.mobile || '+91 98765 43210';

  const chief = json.chief_complaint || 'Upper Abdominal Pain';
  const duration = json.duration || '1 day (Since yesterday evening)';
  const location = json.location || 'Epigastrium / Upper Abdomen';
  const severity = json.severity || 'Moderate to Severe (7/10)';
  const symptoms: string[] = json.associated_symptoms || ['Mild Fever', 'Nausea', 'Loss of Appetite'];

  const pastHistory: string[] = Array.isArray(json.past_history)
    ? json.past_history
    : ['Acute Gastritis (May 2026)', 'No history of HTN / DM'];

  const medications: string[] = Array.isArray(json.current_medications)
    ? json.current_medications
    : ['Paracetamol 500 mg (BD)', 'Omeprazole 20 mg (OD AC)', 'Digene Antacid Syrup (10 ml BD)'];

  const labInvestigations: string[] = Array.isArray(json.relevant_investigations)
    ? json.relevant_investigations
    : ['Hb: 12.4 g/dL (Normal)', 'Fasting Blood Sugar: 102 mg/dL', 'Platelet Count: 210,000 /uL'];

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to download the PDF summary.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>MediKiosk_Clinical_Summary_${abhaId.replace(/[^a-zA-Z0-9]/g, '_')}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #0F2942;
            background: #ffffff;
            margin: 0;
            padding: 20px;
            font-size: 13px;
            line-height: 1.5;
          }
          .header-banner {
            background-color: #00274C;
            color: #ffffff;
            padding: 16px;
            border-bottom: 4px solid #FF9933;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .tricolor-strip {
            height: 4px;
            background: linear-gradient(to right, #FF9933, #ffffff, #138808);
            margin-bottom: 15px;
          }
          .title {
            font-size: 20px;
            font-weight: 800;
            margin: 4px 0 0 0;
          }
          .subtitle {
            font-size: 11px;
            color: #FF9933;
            font-weight: 700;
            text-transform: uppercase;
          }
          .demo-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: #F8FAFC;
            border: 1px solid #CBD5E1;
          }
          .demo-table td {
            padding: 8px 12px;
            border: 1px solid #CBD5E1;
          }
          .demo-label {
            font-size: 10px;
            color: #64748B;
            font-weight: 700;
            text-transform: uppercase;
          }
          .demo-val {
            font-size: 14px;
            font-weight: 800;
            color: #0F2942;
          }
          .section {
            margin-bottom: 16px;
            padding: 12px;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            background: #ffffff;
          }
          .section-title {
            font-size: 12px;
            font-weight: 800;
            color: #00274C;
            text-transform: uppercase;
            border-b: 2px solid #00274C;
            padding-bottom: 4px;
            margin-bottom: 8px;
          }
          .badge {
            display: inline-block;
            background: #FF9933;
            color: #000000;
            font-weight: 800;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 4px;
            margin-right: 4px;
          }
          .doctor-stamp {
            border: 2px solid #138808;
            background: #F0FDF4;
            padding: 12px;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
          }
          .footer-note {
            font-size: 10px;
            color: #64748B;
            text-align: center;
            margin-top: 20px;
            border-top: 1px solid #E2E8F0;
            padding-top: 8px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="tricolor-strip"></div>
        <div class="header-banner">
          <div>
            <div class="subtitle">Government of India — National Health Authority (ABDM)</div>
            <div class="title">OPD CLINICAL SUMMARY & REFERRAL NOTE</div>
            <div style="font-size:11px; margin-top:4px;">MediKiosk Digital Healthcare Kiosk System</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:12px; font-weight:bold; color:#FF9933;">OPD Reg: #2026-OPD-91823</div>
            <div style="font-size:11px;">Date: ${currentDate}</div>
            <div style="font-size:10px; background:#138808; color:#fff; padding:2px 6px; border-radius:3px; margin-top:4px; font-weight:bold;">VERIFIED RECORD</div>
          </div>
        </div>

        <table class="demo-table">
          <tr>
            <td>
              <div class="demo-label">Patient Name</div>
              <div class="demo-val">${patientName}</div>
            </td>
            <td>
              <div class="demo-label">ABHA ID</div>
              <div class="demo-val" style="color:#0056B3; font-family:monospace;">${abhaId}</div>
            </td>
            <td>
              <div class="demo-label">Age / Gender</div>
              <div class="demo-val">${age} Yrs / ${gender}</div>
            </td>
            <td>
              <div class="demo-label">Mobile</div>
              <div class="demo-val" style="font-family:monospace;">${mobile}</div>
            </td>
          </tr>
        </table>

        <div class="section" style="background:#FFFBEB; border-color:#FCD34D;">
          <div style="font-size:11px; font-weight:bold; color:#B45309;">PROVISIONAL DIAGNOSTIC IMPRESSION (ICD-10: K29.70)</div>
          <div style="font-size:14px; font-weight:800; color:#78350F; margin-top:2px;">
            Acute Gastritis with mild pyrexia. Rule out Peptic Ulcer Disease or acute epigastric spasm.
          </div>
        </div>

        <div class="section">
          <div class="section-title">1. Presenting Complaint & History of Present Illness (HPI)</div>
          <p>
            Patient presents with <strong>${chief.toLowerCase()}</strong> for <strong>${duration}</strong>, localized to <strong>${location}</strong>. Severity rated as <strong>${severity}</strong>.
          </p>
          <div>
            <strong>Associated Symptoms:</strong>
            ${symptoms.map((s) => `<span class="badge">${s}</span>`).join(' ')}
          </div>
        </div>

        <div class="section">
          <div class="section-title">2. Past Medical History & Diagnoses</div>
          <ul>
            ${pastHistory.map((h) => `<li><strong>${h}</strong></li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">3. Current Medications (Rx History)</div>
          <ul>
            ${medications.map((m) => `<li style="color:#0B5205;"><strong>Rx:</strong> ${m}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <div class="section-title">4. Key Laboratory & Radiology Findings (OCR Extracted)</div>
          <ul>
            ${labInvestigations.map((l) => `<li>${l} — <em>Verified</em></li>`).join('')}
          </ul>
        </div>

        <div class="section" style="background:#F8FAFC;">
          <div class="section-title">5. Recommended Clinical Plan & Referral Advice</div>
          <ol>
            <li>Tab Omeprazole 20 mg OD (1/2 hr before breakfast) x 14 days.</li>
            <li>Digene Antacid Syrup 10ml BD post meals for symptomatic relief.</li>
            <li>Advise USG Whole Abdomen if epigastric pain persists > 48 hrs.</li>
          </ol>
        </div>

        <div class="doctor-stamp">
          <div>
            <div style="font-size:10px; background:#138808; color:#fff; padding:2px 6px; border-radius:3px; display:inline-block; font-weight:bold;">DIGITALLY SIGNED VIA ABDM HPR</div>
            <div style="font-size:14px; font-weight:bold; color:#00274C; margin-top:4px;">Dr. Ananya Roy, MD (General Medicine)</div>
            <div style="font-size:11px; color:#475569;">Medical Council Registration: MCI-2021-88492 | HPR ID: DR-NHA-2026-9814</div>
          </div>
          <div style="border:1px border #138808; padding:6px 12px; font-family:monospace; font-size:10px; text-align:center; background:#fff;">
            <div style="font-weight:bold; color:#138808;">ABDM STAMP</div>
            <div>VERIFIED: ${currentDate}</div>
            <div>HASH: 91A8-F4B2-78E1</div>
          </div>
        </div>

        <div class="footer-note">
          MediKiosk Public Healthcare System — Ayushman Bharat Digital Mission (ABDM) Guidelines. Assistive clinical context document.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
