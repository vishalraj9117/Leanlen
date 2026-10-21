/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScannedFile, ScanFinding } from '../types';

// Helper to create an SVG data URL for synthetic documents
function createSvgDataUrl(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const syntheticUtilityBillSvg = `
<svg width="800" height="1000" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="1000" fill="#ffffff" />
  <!-- Border and subtle grid -->
  <rect x="20" y="20" width="760" height="960" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8" />
  
  <!-- Header -->
  <rect x="40" y="40" width="720" height="100" fill="#f8fafc" rx="6" />
  <circle cx="85" cy="90" r="25" fill="#0f172a" />
  <text x="85" y="97" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">M</text>
  <text x="130" y="80" font-family="sans-serif" font-size="24" font-weight="bold" fill="#0f172a">METRO POWER &amp; LIGHT</text>
  <text x="130" y="105" font-family="sans-serif" font-size="13" fill="#64748b">Residential Electric &amp; Gas Utility Statement [SYNTHETIC DEMO]</text>
  <text x="730" y="75" font-family="monospace" font-size="13" fill="#0f172a" text-anchor="end">STATEMENT DATE: OCT 12, 2026</text>
  <text x="730" y="100" font-family="monospace" font-size="13" font-weight="bold" fill="#dc2626" text-anchor="end">DUE DATE: NOV 02, 2026</text>

  <!-- Notice Banner -->
  <rect x="40" y="155" width="720" height="34" fill="#f1f5f9" stroke="#cbd5e1" rx="4" />
  <text x="55" y="177" font-family="sans-serif" font-size="12" font-weight="bold" fill="#334155">[SYNTHETIC SAMPLE DOCUMENT] — FOR DEFENSIVE PRIVACY TESTING ONLY</text>

  <!-- Customer Account Box -->
  <rect x="40" y="210" width="720" height="180" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6" />
  <rect x="40" y="210" width="720" height="36" fill="#f1f5f9" rx="6" />
  <text x="60" y="234" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155">ACCOUNT SUMMARY &amp; BILL TO</text>

  <!-- PII Fields inside Account Box -->
  <text x="60" y="275" font-family="sans-serif" font-size="13" fill="#64748b">Account Holder:</text>
  <text x="200" y="275" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Alex J. Mercer</text>

  <text x="60" y="305" font-family="sans-serif" font-size="13" fill="#64748b">Account Number:</text>
  <text x="200" y="305" font-family="monospace" font-size="15" font-weight="bold" fill="#0f172a">#9041-8823-11</text>

  <text x="60" y="335" font-family="sans-serif" font-size="13" fill="#64748b">Service Address:</text>
  <text x="200" y="335" font-family="sans-serif" font-size="14" font-weight="600" fill="#0f172a">448 Elmwood Avenue, Apt 4B, Springfield, IL 62704</text>

  <text x="60" y="365" font-family="sans-serif" font-size="13" fill="#64748b">Phone on File:</text>
  <text x="200" y="365" font-family="monospace" font-size="14" font-weight="600" fill="#0f172a">(555) 019-2834</text>

  <!-- Charges Table -->
  <rect x="40" y="420" width="720" height="260" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" rx="6" />
  <rect x="40" y="420" width="720" height="34" fill="#f8fafc" />
  <text x="60" y="442" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">METER NUMBER</text>
  <text x="240" y="442" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">USAGE PERIOD</text>
  <text x="440" y="442" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">KWH USED</text>
  <text x="660" y="442" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569" text-anchor="end">SUBTOTAL</text>
  
  <line x1="40" y1="454" x2="760" y2="454" stroke="#e2e8f0" stroke-width="1" />
  
  <text x="60" y="485" font-family="monospace" font-size="13" fill="#0f172a">EM-5920-X8</text>
  <text x="240" y="485" font-family="sans-serif" font-size="13" fill="#0f172a">Sep 10 – Oct 09</text>
  <text x="440" y="485" font-family="monospace" font-size="13" fill="#0f172a">942 kWh</text>
  <text x="660" y="485" font-family="monospace" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="end">$132.80</text>

  <text x="60" y="525" font-family="monospace" font-size="13" fill="#0f172a">GAS-TH-110</text>
  <text x="240" y="525" font-family="sans-serif" font-size="13" fill="#0f172a">Sep 10 – Oct 09</text>
  <text x="440" y="525" font-family="monospace" font-size="13" fill="#0f172a">24 Therms</text>
  <text x="660" y="525" font-family="monospace" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="end">$32.14</text>

  <text x="60" y="565" font-family="sans-serif" font-size="13" fill="#64748b">State &amp; Local Clean Energy Surcharge</text>
  <text x="660" y="565" font-family="monospace" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="end">$19.28</text>

  <line x1="40" y1="590" x2="760" y2="590" stroke="#cbd5e1" stroke-width="1.5" />
  <rect x="40" y="591" width="720" height="88" fill="#f8fafc" rx="4" />
  <text x="60" y="640" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">TOTAL BALANCE DUE</text>
  <text x="660" y="645" font-family="monospace" font-size="24" font-weight="bold" fill="#0d9488" text-anchor="end">$184.22</text>

  <!-- Remittance Barcode section at bottom -->
  <rect x="40" y="710" width="720" height="240" fill="#ffffff" stroke="#cbd5e1" stroke-dasharray="6,4" rx="6" />
  <text x="60" y="740" font-family="sans-serif" font-size="12" fill="#64748b">DETACH HERE AND RETURN WITH PAYMENT IN ENVELOPE</text>
  <text x="60" y="780" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Alex J. Mercer</text>
  <text x="60" y="805" font-family="sans-serif" font-size="13" fill="#334155">448 Elmwood Avenue, Apt 4B</text>
  <text x="60" y="828" font-family="sans-serif" font-size="13" fill="#334155">Springfield, IL 62704</text>
  
  <!-- Optical Barcode -->
  <rect x="360" y="770" width="370" height="60" fill="#0f172a" rx="2" />
  <text x="545" y="860" font-family="monospace" font-size="13" fill="#334155" text-anchor="middle">*9041882311-62704-18422*</text>
</svg>
`;

export const syntheticBoardingPassSvg = `
<svg width="800" height="420" viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="420" fill="#f8fafc" />
  <rect x="20" y="20" width="760" height="380" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="16" />

  <!-- Left Header -->
  <rect x="20" y="20" width="540" height="70" fill="#0f172a" rx="16" />
  <rect x="20" y="70" width="540" height="20" fill="#0f172a" />
  <text x="50" y="62" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">AEROVOYAGE SKYWAYS</text>
  <text x="520" y="60" font-family="monospace" font-size="13" font-weight="bold" fill="#14b8a6" text-anchor="end">FIRST CLASS</text>

  <!-- Perforation divider -->
  <line x1="560" y1="20" x2="560" y2="400" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8,6" />
  <circle cx="560" cy="20" r="16" fill="#f8fafc" />
  <circle cx="560" cy="400" r="16" fill="#f8fafc" />

  <!-- Passenger details -->
  <text x="50" y="130" font-family="sans-serif" font-size="12" fill="#64748b">PASSENGER NAME</text>
  <text x="50" y="155" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">Priya Sharma</text>

  <text x="240" y="130" font-family="sans-serif" font-size="12" fill="#64748b">FREQUENT FLYER ID</text>
  <text x="240" y="155" font-family="monospace" font-size="16" font-weight="bold" fill="#0f172a">FF-88204910-GOLD</text>

  <text x="440" y="130" font-family="sans-serif" font-size="12" fill="#64748b">PNR / RECORD LOCATOR</text>
  <text x="440" y="155" font-family="monospace" font-size="18" font-weight="bold" fill="#dc2626">ZX99KL</text>

  <!-- Route info -->
  <rect x="40" y="185" width="480" height="80" fill="#f1f5f9" rx="8" />
  <text x="60" y="220" font-family="sans-serif" font-size="24" font-weight="bold" fill="#0f172a">SFO</text>
  <text x="60" y="245" font-family="sans-serif" font-size="11" fill="#64748b">SAN FRANCISCO</text>
  <text x="200" y="230" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0d9488">NON-STOP ────────→</text>
  <text x="380" y="220" font-family="sans-serif" font-size="24" font-weight="bold" fill="#0f172a">DEL</text>
  <text x="380" y="245" font-family="sans-serif" font-size="11" fill="#64748b">NEW DELHI</text>

  <!-- Flight details -->
  <text x="50" y="300" font-family="sans-serif" font-size="11" fill="#64748b">FLIGHT</text>
  <text x="50" y="325" font-family="monospace" font-size="15" font-weight="bold" fill="#0f172a">AV-402</text>

  <text x="150" y="300" font-family="sans-serif" font-size="11" fill="#64748b">GATE</text>
  <text x="150" y="325" font-family="monospace" font-size="16" font-weight="bold" fill="#0d9488">B12</text>

  <text x="240" y="300" font-family="sans-serif" font-size="11" fill="#64748b">BOARDING TIME</text>
  <text x="240" y="325" font-family="monospace" font-size="15" font-weight="bold" fill="#0f172a">09:15 AM</text>

  <text x="360" y="300" font-family="sans-serif" font-size="11" fill="#64748b">SEAT</text>
  <text x="360" y="325" font-family="monospace" font-size="18" font-weight="bold" fill="#0f172a">02A</text>

  <!-- Barcode on stub -->
  <rect x="580" y="40" width="180" height="50" fill="#0f172a" rx="4" />
  <text x="670" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">BOARDING PASS STUB</text>
  <text x="580" y="125" font-family="sans-serif" font-size="11" fill="#64748b">NAME</text>
  <text x="580" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">P. Sharma</text>
  <text x="580" y="180" font-family="sans-serif" font-size="11" fill="#64748b">SEAT</text>
  <text x="580" y="200" font-family="monospace" font-size="18" font-weight="bold" fill="#0f172a">02A</text>

  <!-- Stub Barcode -->
  <rect x="580" y="240" width="170" height="110" fill="#1e293b" rx="4" />
  <text x="665" y="375" font-family="monospace" font-size="11" fill="#64748b" text-anchor="middle">PNR: ZX99KL / FF: 88204910</text>
</svg>
`;

export const syntheticEmployeeBadgeSvg = `
<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#f8fafc" />
  <rect x="15" y="15" width="370" height="570" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="16" />

  <!-- Lanyard hole -->
  <rect x="160" y="28" width="80" height="12" rx="6" fill="#cbd5e1" />

  <!-- Badge Header -->
  <rect x="15" y="60" width="370" height="85" fill="#0f172a" />
  <text x="200" y="100" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">NOVAPAY TECHNOLOGIES</text>
  <text x="200" y="125" font-family="sans-serif" font-size="11" fill="#14b8a6" text-anchor="middle">ENTERPRISE SECURITY IDENTIFICATION</text>

  <!-- Photo Box -->
  <rect x="125" y="170" width="150" height="150" fill="#e2e8f0" stroke="#94a3b8" rx="8" />
  <circle cx="200" cy="225" r="35" fill="#94a3b8" />
  <path d="M 150 290 Q 200 250 250 290 Z" fill="#94a3b8" />
  <text x="200" y="310" font-family="sans-serif" font-size="9" fill="#475569" text-anchor="middle">[EMPLOYEE PHOTO]</text>

  <!-- Name & Title -->
  <text x="200" y="355" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">Marcus Vance</text>
  <text x="200" y="378" font-family="sans-serif" font-size="13" font-weight="600" fill="#0d9488" text-anchor="middle">Sr. Infrastructure Architect</text>

  <!-- Badge Details Grid -->
  <rect x="35" y="405" width="330" height="110" fill="#f8fafc" stroke="#e2e8f0" rx="8" />
  <text x="50" y="430" font-family="sans-serif" font-size="11" fill="#64748b">EMPLOYEE ID:</text>
  <text x="160" y="430" font-family="monospace" font-size="13" font-weight="bold" fill="#0f172a">EMP-77041-SEC</text>

  <text x="50" y="460" font-family="sans-serif" font-size="11" fill="#64748b">EMAIL ADDRESS:</text>
  <text x="160" y="460" font-family="monospace" font-size="12" font-weight="bold" fill="#0f172a">m.vance@novapay.net</text>

  <text x="50" y="490" font-family="sans-serif" font-size="11" fill="#64748b">CLEARANCE LEVEL:</text>
  <text x="160" y="490" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b45309">LEVEL 4 (DATA CENTER ACCESS)</text>

  <!-- Barcode / NFC chip zone -->
  <rect x="50" y="530" width="300" height="35" fill="#1e293b" rx="4" />
  <text x="200" y="552" font-family="monospace" font-size="10" fill="#94a3b8" text-anchor="middle">||| | ||||| |||| || |||||| | ||| || ||||</text>
</svg>
`;

export const preloadedSyntheticFiles: ScannedFile[] = [
  {
    id: 'sample-utility-bill',
    name: 'Synthetic_Utility_Bill_AlexMercer.svg',
    size: 28400,
    type: 'image/svg+xml',
    uploadedAt: '2026-10-21 10:15',
    isSynthetic: true,
    dataUrl: createSvgDataUrl(syntheticUtilityBillSvg),
    findings: [
      {
        id: 'f-bill-1',
        category: 'name',
        label: 'Account Holder Full Name',
        value: 'Alex J. Mercer',
        maskedValue: 'A*** J. M*****',
        confidence: 98,
        severity: 'high',
        bbox: { ymin: 255, xmin: 195, ymax: 285, xmax: 380 },
        reason: 'Associates real name with utility usage, residential location, and financial debt.',
        status: 'active'
      },
      {
        id: 'f-bill-2',
        category: 'id_number',
        label: 'Utility Account Identifier',
        value: '#9041-8823-11',
        maskedValue: '#9041-****-**',
        confidence: 96,
        severity: 'high',
        bbox: { ymin: 285, xmin: 195, ymax: 315, xmax: 360 },
        reason: 'Can be exploited in automated telephone IVR systems to reset utility accounts or spoof residency.',
        status: 'active'
      },
      {
        id: 'f-bill-3',
        category: 'address',
        label: 'Full Residential Physical Address',
        value: '448 Elmwood Avenue, Apt 4B, Springfield, IL 62704',
        maskedValue: '448 E****** Ave, Apt **, Springfield, IL *****',
        confidence: 99,
        severity: 'high',
        bbox: { ymin: 318, xmin: 195, ymax: 345, xmax: 680 },
        reason: 'Exposes exact physical residence, apartment number, and postal code.',
        status: 'active'
      },
      {
        id: 'f-bill-4',
        category: 'phone',
        label: 'Primary Phone Number',
        value: '(555) 019-2834',
        maskedValue: '(555) ***-2834',
        confidence: 95,
        severity: 'caution',
        bbox: { ymin: 348, xmin: 195, ymax: 375, xmax: 350 },
        reason: 'Direct mobile or landline number linked to primary residential records.',
        status: 'active'
      },
      {
        id: 'f-bill-5',
        category: 'financial',
        label: 'Remittance Barcode & Optical Code',
        value: '*9041882311-62704-18422*',
        maskedValue: '*************************',
        confidence: 92,
        severity: 'caution',
        bbox: { ymin: 760, xmin: 350, ymax: 870, xmax: 740 },
        reason: 'Machine-readable barcode encodes the account number, zip code, and exact balance.',
        status: 'active'
      }
    ]
  },
  {
    id: 'sample-boarding-pass',
    name: 'Synthetic_Boarding_Pass_PriyaSharma.svg',
    size: 21200,
    type: 'image/svg+xml',
    uploadedAt: '2026-10-21 11:30',
    isSynthetic: true,
    dataUrl: createSvgDataUrl(syntheticBoardingPassSvg),
    findings: [
      {
        id: 'f-pass-1',
        category: 'name',
        label: 'Passenger Legal Name',
        value: 'Priya Sharma',
        maskedValue: 'P**** S*****',
        confidence: 99,
        severity: 'caution',
        bbox: { ymin: 135, xmin: 45, ymax: 165, xmax: 200 },
        reason: 'Ties individual to specific flight dates, travel departure times, and destination.',
        status: 'active'
      },
      {
        id: 'f-pass-2',
        category: 'id_number',
        label: 'Frequent Flyer Account ID',
        value: 'FF-88204910-GOLD',
        maskedValue: 'FF-********-GOLD',
        confidence: 97,
        severity: 'caution',
        bbox: { ymin: 135, xmin: 235, ymax: 165, xmax: 420 },
        reason: 'Loyalty identifier that can be used on airline self-service kiosks.',
        status: 'active'
      },
      {
        id: 'f-pass-3',
        category: 'auth_credential',
        label: 'PNR Booking Reference Code',
        value: 'ZX99KL',
        maskedValue: 'Z****L',
        confidence: 98,
        severity: 'high',
        bbox: { ymin: 135, xmin: 435, ymax: 165, xmax: 530 },
        reason: 'Critical authentication code: combined with passenger last name, allows anyone to view, cancel, or rebook travel tickets on airline website.',
        status: 'active'
      },
      {
        id: 'f-pass-4',
        category: 'id_number',
        label: 'Boarding Stub 2D Barcode',
        value: 'PNR: ZX99KL / FF: 88204910',
        maskedValue: '*************************',
        confidence: 94,
        severity: 'high',
        bbox: { ymin: 235, xmin: 575, ymax: 385, xmax: 755 },
        reason: 'PDF417 / Aztec 2D barcode encodes passenger name, e-ticket number, passport hash, and itinerary.',
        status: 'active'
      }
    ]
  },
  {
    id: 'sample-work-badge',
    name: 'Synthetic_Employee_Badge_MarcusVance.svg',
    size: 19800,
    type: 'image/svg+xml',
    uploadedAt: '2026-10-21 14:05',
    isSynthetic: true,
    dataUrl: createSvgDataUrl(syntheticEmployeeBadgeSvg),
    findings: [
      {
        id: 'f-badge-1',
        category: 'name',
        label: 'Employee Full Name',
        value: 'Marcus Vance',
        maskedValue: 'M***** V****',
        confidence: 99,
        severity: 'caution',
        bbox: { ymin: 335, xmin: 80, ymax: 365, xmax: 320 },
        reason: 'Ties person directly to organization and architectural clearance role.',
        status: 'active'
      },
      {
        id: 'f-badge-2',
        category: 'id_number',
        label: 'Internal Security Badge ID',
        value: 'EMP-77041-SEC',
        maskedValue: 'EMP-*****-SEC',
        confidence: 96,
        severity: 'high',
        bbox: { ymin: 415, xmin: 155, ymax: 438, xmax: 330 },
        reason: 'Can be used by social engineers to impersonate authorized IT staff over helpdesk calls.',
        status: 'active'
      },
      {
        id: 'f-badge-3',
        category: 'email',
        label: 'Internal Corporate Email',
        value: 'm.vance@novapay.net',
        maskedValue: 'm.*****@novapay.net',
        confidence: 97,
        severity: 'caution',
        bbox: { ymin: 445, xmin: 155, ymax: 468, xmax: 350 },
        reason: 'Provides exact corporate email address pattern for spear-phishing and credential stuffing.',
        status: 'active'
      }
    ]
  }
];
