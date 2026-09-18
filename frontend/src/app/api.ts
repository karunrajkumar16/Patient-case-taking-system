const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchDemoPatients() {
  const res = await fetch(`${API_BASE_URL}/api/patients/demo`);
  if (!res.ok) throw new Error('Failed to fetch demo patients');
  return res.json();
}

export async function lookupAbha(abha_id: string) {
  const res = await fetch(`${API_BASE_URL}/api/patients/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ abha_id }),
  });
  if (!res.ok) throw new Error('Failed to lookup ABHA ID');
  return res.json();
}

export async function createEncounter(patient_id: number, chief_complaint_summary?: string) {
  const res = await fetch(`${API_BASE_URL}/api/encounters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id, chief_complaint_summary }),
  });
  if (!res.ok) throw new Error('Failed to create encounter');
  return res.json();
}

export async function saveConsent(patient_id: number, granted: boolean) {
  const res = await fetch(`${API_BASE_URL}/api/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patient_id, granted }),
  });
  if (!res.ok) throw new Error('Failed to save consent');
  return res.json();
}

export async function sendCaseTakingTurn(encounter_id: number, patient_id: number, user_input: string, history: any[]) {
  const res = await fetch(`${API_BASE_URL}/api/case-taking/questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encounter_id, patient_id, user_input, conversation_history: history }),
  });
  if (!res.ok) throw new Error('Failed to process case taking turn');
  return res.json();
}

export async function uploadDocument(patient_id: number, doc_type: string, file: File) {
  const formData = new FormData();
  formData.append('patient_id', patient_id.toString());
  formData.append('doc_type', doc_type);
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload document');
  return res.json();
}

export async function processDocumentById(doc_id: number) {
  const res = await fetch(`${API_BASE_URL}/api/documents/${doc_id}/process`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to re-process document OCR');
  return res.json();
}

export async function fetchPatientDocuments(patient_id: number) {
  const res = await fetch(`${API_BASE_URL}/api/documents/patient/${patient_id}`);
  if (!res.ok) throw new Error('Failed to fetch patient documents');
  return res.json();
}

export async function fetchPatientTimeline(patient_id: number) {
  const res = await fetch(`${API_BASE_URL}/api/timeline/patient/${patient_id}`);
  if (!res.ok) throw new Error('Failed to fetch patient timeline');
  return res.json();
}

export async function generateSummary(encounter_id: number, patient_id: number) {
  const res = await fetch(`${API_BASE_URL}/api/summary/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encounter_id, patient_id }),
  });
  if (!res.ok) throw new Error('Failed to generate summary');
  return res.json();
}

export async function evaluateRedFlags(text_content: string, structured_complaint?: any) {
  const res = await fetch(`${API_BASE_URL}/api/red-flags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text_content, structured_complaint }),
  });
  if (!res.ok) throw new Error('Failed to evaluate red flags');
  return res.json();
}

export async function verifySummary(summary_id: number, action: string, doctor_notes?: string, edited_summary_text?: string) {
  const res = await fetch(`${API_BASE_URL}/api/doctor/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary_id, action, doctor_notes, edited_summary_text }),
  });
  if (!res.ok) throw new Error('Failed to verify summary');
  return res.json();
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/api/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE_URL}/api/audit`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function callBhashiniSTT(language: string = 'hi') {
  const res = await fetch(`${API_BASE_URL}/api/bhashini/stt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audio_base64: 'SIMULATED_VOICE_STREAM', language }),
  });
  if (!res.ok) throw new Error('Failed STT request');
  return res.json();
}
