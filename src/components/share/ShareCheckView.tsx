/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ArrowRight,
  Shield,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { shareContextRules, ShareContextRule } from '../../data/shareCheckRules';
import { ShareContext } from '../../types';

export const ShareCheckView: React.FC = () => {
  const {
    language,
    activeFile,
    setCurrentTab,
  } = useApp();
  const t = useTranslation(language);

  const [selectedDestination, setSelectedDestination] = useState<ShareContext>('public_social');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const rule = shareContextRules[selectedDestination];

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeFindings = (activeFile?.findings || []).filter((f) => f.status === 'active' || f.status === 'confirmed');

  let verdict: 'PASS' | 'CAUTION' | 'FAIL' = 'PASS';
  const detectedViolations: string[] = [];

  if (activeFindings.length > 0) {
    if (selectedDestination === 'public_social') {
      const hasAddress = activeFindings.some((f) => f.category === 'address');
      const hasPhone = activeFindings.some((f) => f.category === 'phone');
      const hasAuth = activeFindings.some((f) => f.category === 'auth_credential');
      if (hasAddress) detectedViolations.push('Full Residential Address visible in document');
      if (hasPhone) detectedViolations.push('Direct Mobile Phone Number visible in document');
      if (hasAuth) detectedViolations.push('Travel/Account Auth credentials (PNR/Barcode) visible');
      if (detectedViolations.length > 0) verdict = 'FAIL';
      else verdict = 'CAUTION';
    } else if (selectedDestination === 'marketplace') {
      const hasAddress = activeFindings.some((f) => f.category === 'address');
      const hasAccount = activeFindings.some((f) => f.category === 'id_number' || f.category === 'financial');
      if (hasAddress) detectedViolations.push('Home street address should not be published on public classifieds');
      if (hasAccount) detectedViolations.push('Private account number should not be visible in item photos');
      if (detectedViolations.length > 0) verdict = 'FAIL';
      else verdict = 'CAUTION';
    } else if (selectedDestination === 'job_application') {
      const hasNationalId = activeFindings.some((f) => f.category === 'id_number');
      if (hasNationalId) detectedViolations.push('National / Government ID number attached to resume');
      if (detectedViolations.length > 0) verdict = 'CAUTION';
    } else if (selectedDestination === 'customer_support') {
      const hasCreds = activeFindings.some((f) => f.category === 'auth_credential' || f.category === 'financial');
      if (hasCreds) detectedViolations.push('Full financial account numbers or security credentials in screenshot');
      if (detectedViolations.length > 0) verdict = 'FAIL';
      else verdict = 'CAUTION';
    }
  }

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Share Check
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-flight destination inspection evaluating your document against specific sharing policies.
          </p>
        </div>

        {/* Destination Selector Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs self-start sm:self-center">
          {(Object.keys(shareContextRules) as ShareContext[]).map((destKey) => {
            const destRule = shareContextRules[destKey];
            const isSelected = selectedDestination === destKey;
            return (
              <button
                key={destKey}
                onClick={() => setSelectedDestination(destKey)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {destRule.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Layout: Document Preview (Left) vs Destination Findings & Rules (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Document Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-900 dark:text-white truncate">
              {activeFile?.name || 'No document selected'}
            </span>
            <span className="text-[11px] text-slate-400 shrink-0">
              {activeFindings.length} findings
            </span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center relative min-h-[380px]">
            {activeFile ? (
              <div className="relative max-w-full max-h-[460px] rounded shadow-xs overflow-hidden bg-white select-none">
                <img
                  src={activeFile.dataUrl}
                  alt={activeFile.name}
                  className="w-full h-auto object-contain max-h-[440px] block"
                />

                {/* Overlaid bounding box rectangles */}
                {activeFile.findings.map((finding) => {
                  if (finding.status === 'dismissed' || !finding.bbox) return null;
                  const top = (finding.bbox.ymin / 1000) * 100;
                  const left = (finding.bbox.xmin / 1000) * 100;
                  const height = ((finding.bbox.ymax - finding.bbox.ymin) / 1000) * 100;
                  const width = ((finding.bbox.xmax - finding.bbox.xmin) / 1000) * 100;

                  return (
                    <div
                      key={finding.id}
                      style={{
                        top: `${top}%`,
                        left: `${left}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                      }}
                      className="absolute border border-red-600 bg-red-600/15 pointer-events-none rounded-xs"
                    >
                      <span className="absolute -top-3.5 left-0 text-[8px] font-mono px-1 rounded-xs bg-slate-900 text-white whitespace-nowrap">
                        {finding.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400">No document loaded</div>
            )}
          </div>

          {activeFindings.length > 0 && (
            <button
              onClick={() => setCurrentTab('redaction')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Sanitize in Redaction Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Column (7 Cols): Findings Assessment & Destination Checklist */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-5">
          {/* Destination Header & Verdict */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-[10px] font-mono font-semibold uppercase text-slate-400">
                Target Policy
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {rule.name}
              </h2>
            </div>

            <div className="shrink-0">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded ${
                  verdict === 'FAIL'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                    : verdict === 'CAUTION'
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
              >
                {verdict === 'FAIL'
                  ? 'Policy Violations Detected'
                  : verdict === 'CAUTION'
                  ? 'Review Recommended'
                  : 'Cleared for Sharing'}
              </span>
            </div>
          </div>

          {/* Detected Violations List if any */}
          {detectedViolations.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-red-700 dark:text-red-400">
                Policy Mismatches on Active Document:
              </div>
              <div className="space-y-1">
                {detectedViolations.map((v, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-200 flex items-center gap-2"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-1">
                Must Redact for this Channel:
              </div>
              <ul className="space-y-0.5 text-[11px] text-slate-500 list-disc list-inside">
                {rule.sensitiveMustRedact.map((item, idx) => (
                  <li key={idx} className="leading-snug">{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-1">
                Safe to Disclose:
              </div>
              <ul className="space-y-0.5 text-[11px] text-slate-500 list-disc list-inside">
                {rule.safeToInclude.map((item, idx) => (
                  <li key={idx} className="leading-snug">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Destination Specific Pre-flight Checklist */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Pre-flight Checklist:
            </div>
            <div className="space-y-1.5 text-xs">
              {rule.checks.map((chk) => {
                const isChecked = Boolean(checkedItems[chk.id]);
                return (
                  <div
                    key={chk.id}
                    onClick={() => toggleCheck(chk.id)}
                    className={`p-2.5 rounded border cursor-pointer transition flex items-start gap-2.5 select-none ${
                      isChecked
                        ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-xs mt-0.5 flex items-center justify-center border transition shrink-0 ${
                        isChecked
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-teal-600 dark:border-teal-600'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 leading-snug">
                      {chk.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
            {rule.verdictAdvice}
          </p>
        </div>
      </div>
    </div>
  );
};
