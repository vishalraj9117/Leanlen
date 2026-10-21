/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  FileSearch,
  ShieldCheck,
  CheckSquare,
  Eraser,
  ArrowRight,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Shield,
  Activity,
  HardDrive,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { PrivacyHealthScoreWidget } from './PrivacyHealthScoreWidget';
import { checkServerStatus, ServerStatusResponse } from '../../services/api';

export const OverviewDashboard: React.FC = () => {
  const {
    language,
    setCurrentTab,
    auditedCount,
    needsAttentionCount,
    sensitiveFindingsCount,
    redactedCount,
    openTasksCount,
    auditItems,
    scannedFiles,
    actionTasks,
    setActiveFileId,
  } = useApp();
  const t = useTranslation(language);

  const [serverStatus, setServerStatus] = useState<ServerStatusResponse | null>(null);

  useEffect(() => {
    checkServerStatus().then(setServerStatus);
  }, []);

  const totalAuditItems = auditItems.length;
  const auditPercent = totalAuditItems > 0 ? Math.round((auditedCount / totalAuditItems) * 100) : 0;

  // Top pending tasks derived from actual action planner state
  const pendingTasks = actionTasks
    .filter((task) => !task.completed && !task.dismissed)
    .slice(0, 4);

  // Recent files (up to 4)
  const recentFiles = scannedFiles.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Console Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Privacy &amp; Security Workspace
            </h1>
            <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
              v1.4 Defensive
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Defensive privacy console: audit exposure, detect visible PII in documents, and sanitize files prior to distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setCurrentTab('scanner')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Scan Document for PII</span>
          </button>
        </div>
      </div>

      {/* Real System Telemetry Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-100/70 dark:bg-slate-900/80 rounded-md border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
        <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Engine:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {serverStatus?.hasGeminiKey ? 'Gemini 3.8 Flash Vision (Active)' : 'Local Privacy Engine'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Vault:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {serverStatus?.hasCloudinary
                ? `Cloudinary Signed (${serverStatus.cloudinaryCloudName || 'Configured'})`
                : 'Isolated In-Memory Session'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Boundary:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Zero Unauthorized Tracking
            </span>
          </div>
        </div>

        <div className="text-slate-400 hidden lg:block">
          Session: <span className="text-slate-700 dark:text-slate-300 font-semibold">Strict Defensive Policy</span>
        </div>
      </div>

      {/* FEATURE: Dynamic Privacy Health Score Summary Widget */}
      <PrivacyHealthScoreWidget />

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Audit Progress */}
        <div
          onClick={() => setCurrentTab('audit')}
          className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Audit Progress</span>
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {auditPercent}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {auditedCount} of {totalAuditItems} checks completed
          </div>
        </div>

        {/* Metric 2: Sensitive Findings */}
        <div
          onClick={() => setCurrentTab('scanner')}
          className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Detected Findings</span>
            <FileSearch className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {sensitiveFindingsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {scannedFiles.length} inspected documents
          </div>
        </div>

        {/* Metric 3: Redacted Copies */}
        <div
          onClick={() => setCurrentTab('redaction')}
          className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Sanitized Files</span>
            <Eraser className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {redactedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Irreversible pixel redactor applied
          </div>
        </div>

        {/* Metric 4: Open Action Tasks */}
        <div
          onClick={() => setCurrentTab('planner')}
          className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Pending Tasks</span>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {openTasksCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {actionTasks.filter((t) => t.completed).length} items marked resolved
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Files & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Recent Scanned Files Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recent Documents &amp; Cases
            </h2>
            <button
              onClick={() => setCurrentTab('scanner')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          {recentFiles.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No documents scanned yet. Upload an image or select a sample in the File Scanner.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentFiles.map((file) => {
                const findings = file.findings || [];
                const findingsCount = findings.filter(
                  (f) => f.status === 'active' || f.status === 'confirmed'
                ).length;
                const isRedacted = Boolean(file.redactedDataUrl);

                return (
                  <div
                    key={file.id}
                    className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {file.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB · {file.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isRedacted ? (
                        <span className="text-[11px] font-medium font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          Sanitized
                        </span>
                      ) : findingsCount > 0 ? (
                        <span className="text-[11px] font-medium font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          {findingsCount} {findingsCount === 1 ? 'finding' : 'findings'}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                          Clean
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setActiveFileId(file.id);
                          setCurrentTab('scanner');
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Recommended Next Actions */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Recommended Next Actions
            </h2>
            <button
              onClick={() => setCurrentTab('planner')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Action Planner
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
              All current action items have been marked resolved.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {task.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded shrink-0 border ${
                        task.priority === 'fix_now'
                          ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800'
                          : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {task.priority === 'fix_now' ? 'URGENT' : 'REVIEW'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {task.instruction}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {task.effort}
                    </span>
                    <button
                      onClick={() => setCurrentTab('planner')}
                      className="text-xs font-medium text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      Resolve task →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
