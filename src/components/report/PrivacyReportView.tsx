/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  Calendar,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eraser
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';

export const PrivacyReportView: React.FC = () => {
  const {
    language,
    privacyScore,
    auditItems,
    scannedFiles,
    actionTasks,
    auditedCount,
    needsAttentionCount,
    redactedCount,
    setActiveFileId,
    setCurrentTab,
  } = useApp();
  const t = useTranslation(language);

  const [historySearch, setHistorySearch] = useState('');
  const [includeAudit, setIncludeAudit] = useState(true);
  const [includeFindings, setIncludeFindings] = useState(true);
  const [includePlan, setIncludePlan] = useState(true);
  const [includeRedaction, setIncludeRedaction] = useState(true);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const filteredFiles = scannedFiles.filter(
    (f) =>
      f.name.toLowerCase().includes(historySearch.toLowerCase()) ||
      (f.findings || []).some((finding) => finding.label.toLowerCase().includes(historySearch.toLowerCase()))
  );

  const activeFindings = scannedFiles.flatMap((f) =>
    (f.findings || []).map((finding) => ({ ...finding, fileName: f.name }))
  );

  return (
    <div className="space-y-6">
      {/* View Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports &amp; Document History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit history, case logs, and executive printable privacy compliance summaries.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-center"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Case & Document History Searchable Table (Hidden on Print) */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden print:hidden space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Document Case History ({scannedFiles.length})
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Filter cases by filename..."
              className="w-full pl-8 pr-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] font-semibold border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-3.5 py-2">Document Name</th>
                <th className="px-3.5 py-2">Uploaded</th>
                <th className="px-3.5 py-2">Size</th>
                <th className="px-3.5 py-2">Findings</th>
                <th className="px-3.5 py-2">Sanitization Status</th>
                <th className="px-3.5 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3.5 py-6 text-center text-slate-400">
                    No matching documents found in history.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => {
                  const activeCount = file.findings.filter(
                    (f) => f.status === 'active' || f.status === 'confirmed'
                  ).length;
                  const isRedacted = Boolean(file.redactedDataUrl);

                  return (
                    <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {file.name}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500 font-mono text-[11px] tabular-nums">
                        {file.uploadedAt}
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-500 font-mono text-[11px] tabular-nums">
                        {(file.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-3.5 py-2.5 font-mono text-[11px] tabular-nums">
                        {activeCount > 0 ? (
                          <span className="text-amber-700 dark:text-amber-400 font-semibold">
                            {activeCount} sensitive
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5">
                        {isRedacted ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            Irreversibly Redacted
                          </span>
                        ) : (
                          <span className="text-slate-400">Raw Unredacted</span>
                        )}
                      </td>
                      <td className="px-3.5 py-2.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setActiveFileId(file.id);
                            setCurrentTab('scanner');
                          }}
                          className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => {
                            setActiveFileId(file.id);
                            setCurrentTab('redaction');
                          }}
                          className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
                        >
                          Redact
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section Filter Toggles (Hidden on Print) */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          Report Sections to Include:
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeAudit}
              onChange={(e) => setIncludeAudit(e.target.checked)}
              className="rounded text-slate-900 dark:text-teal-600"
            />
            <span>Audit Checklist</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeFindings}
              onChange={(e) => setIncludeFindings(e.target.checked)}
              className="rounded text-slate-900 dark:text-teal-600"
            />
            <span>Scanned Findings (Masked)</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includePlan}
              onChange={(e) => setIncludePlan(e.target.checked)}
              className="rounded text-slate-900 dark:text-teal-600"
            />
            <span>Action Plan</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeRedaction}
              onChange={(e) => setIncludeRedaction(e.target.checked)}
              className="rounded text-slate-900 dark:text-teal-600"
            />
            <span>Redaction Activity</span>
          </label>
        </div>
      </div>

      {/* Executive Printable Document */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 space-y-6 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800 print:border-slate-300 text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white print:text-black">
              LeakLens Privacy &amp; Defense Audit Summary
            </h2>
            <p className="text-slate-500 mt-0.5">
              Defensive cybersecurity inspection, document findings, and action roadmap.
            </p>
          </div>
          <div className="font-mono text-slate-500 tabular-nums">
            Generated: {currentDate}
          </div>
        </div>

        {/* Executive Scorecard Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700 print:border-slate-300">
          <div>
            <div className="text-slate-500">Audit Completion</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white print:text-black mt-0.5 tabular-nums">
              {auditedCount} / {auditItems.length}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Needs Attention</div>
            <div className="text-base font-bold font-mono text-amber-700 dark:text-amber-400 print:text-black mt-0.5 tabular-nums">
              {needsAttentionCount}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Files Sanitized</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white print:text-black mt-0.5 tabular-nums">
              {redactedCount}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Resolved Tasks</div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white print:text-black mt-0.5 tabular-nums">
              {actionTasks.filter((t) => t.completed).length} / {actionTasks.length}
            </div>
          </div>
        </div>

        {/* Section 1: Audit Checklist */}
        {includeAudit && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
              1. Personal Privacy Audit Checklist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {auditItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded border border-slate-100 dark:border-slate-800 print:border-slate-300 flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <div className="text-[10px] uppercase font-mono text-slate-400">
                      {item.category}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {item.defaultTitle}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-semibold text-slate-500 shrink-0">
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Scanned Findings */}
        {includeFindings && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
              2. Confirmed Sensitive Findings in Files (Masked)
            </h3>
            <div className="space-y-1.5 text-xs">
              {activeFindings.map((f) => (
                <div
                  key={f.id}
                  className="p-2.5 rounded border border-slate-100 dark:border-slate-800 print:border-slate-300 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">{f.label}</span>
                    <span className="text-[10px] text-slate-400 ml-2">in {f.fileName}</span>
                  </div>
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300 tabular-nums">
                    {f.maskedValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Redaction Activity */}
        {includeRedaction && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
              3. Irreversible Redaction Log
            </h3>
            <div className="space-y-1.5 text-xs">
              {scannedFiles.filter((f) => f.redactedDataUrl).map((f) => (
                <div
                  key={f.id}
                  className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {f.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Pixel-level raster blackout applied · EXIF metadata stripped · Sanitized {f.redactedAt}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-semibold text-emerald-700 dark:text-emerald-400">
                    Sanitized
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Action Plan */}
        {includePlan && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white print:text-black uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1">
              4. Prioritized Action Plan
            </h3>
            <div className="space-y-1.5 text-xs">
              {actionTasks.filter((t) => !t.dismissed).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 rounded border border-slate-100 dark:border-slate-800 print:border-slate-300 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">{task.title}</span>
                    <span className="text-[10px] text-slate-400 ml-2">({task.priority.replace('_', ' ')})</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-semibold text-slate-500">
                    {task.completed ? 'Resolved' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 leading-relaxed">
          Defensive privacy notice: LeakLens provides client-side verification and redaction to prevent accidental disclosure before sending files to third parties. It is not an external breach detector or legal forensic certification.
        </div>
      </div>
    </div>
  );
};
