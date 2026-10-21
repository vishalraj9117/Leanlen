/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sliders,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';

export const PrivacyHealthScoreWidget: React.FC = () => {
  const {
    language,
    auditItems,
    auditedCount,
    needsAttentionCount,
    setCurrentTab,
  } = useApp();
  const t = useTranslation(language);

  const totalAuditItems = auditItems.length;
  const reviewedCount = auditItems.filter(
    (i) => i.status === 'reviewed' || i.status === 'not_applicable'
  ).length;
  const notCheckedCount = auditItems.filter((i) => i.status === 'not_checked').length;
  const completionPercentage = totalAuditItems > 0
    ? Math.round((auditedCount / totalAuditItems) * 100)
    : 0;

  // Dynamic Privacy Health Score Algorithm:
  // 1. Completion factor (up to 30 pts)
  // 2. Verified secure factor (up to 70 pts)
  // 3. Penalty for active deficiencies (-4 pts per item)
  const completionFactor = totalAuditItems > 0 ? (auditedCount / totalAuditItems) * 30 : 0;
  const verifiedFactor = totalAuditItems > 0 ? (reviewedCount / totalAuditItems) * 70 : 0;
  const deficiencyPenalty = needsAttentionCount * 4;

  const rawScore = Math.round(completionFactor + verifiedFactor - deficiencyPenalty);
  const healthScore = Math.max(5, Math.min(100, rawScore));

  // Determine posture status level and theme
  let statusBadge = {
    title: 'Optimal Posture',
    tag: 'HARDENED',
    color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    barColor: '#059669',
    icon: ShieldCheck,
    summary: 'Strong digital privacy posture. Audited permissions, MFA safeguards, and private data boundaries are verified.',
    actionLabel: 'View Audit Records',
  };

  if (healthScore < 45) {
    statusBadge = {
      title: 'Critical Blindspots',
      tag: 'ELEVATED RISK',
      color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      barColor: '#E11D48',
      icon: ShieldAlert,
      summary: 'Audit checklist is incomplete. Key attack surfaces including app permissions and location trails remain uninspected.',
      actionLabel: 'Start Privacy Audit',
    };
  } else if (healthScore < 70) {
    statusBadge = {
      title: 'Action Required',
      tag: 'VULNERABILITIES DETECTED',
      color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      barColor: '#D97706',
      icon: AlertTriangle,
      summary: 'Checklist in progress. Identified privacy vulnerabilities or open permissions require remediation.',
      actionLabel: 'Remediate Flagged Items',
    };
  } else if (healthScore < 90) {
    statusBadge = {
      title: 'Moderate Baseline',
      tag: 'GOOD PROGRESS',
      color: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
      barColor: '#0D9488',
      icon: Shield,
      summary: 'Most privacy checks completed. Address remaining unreviewed dimensions to eliminate quasi-identifier leakage.',
      actionLabel: 'Complete Audit Checklist',
    };
  }

  const StatusIcon = statusBadge.icon;

  // SVG Gauge calculations (radius 42, strokeWidth 7)
  const radius = 42;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
      {/* Widget Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0">
            <StatusIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Privacy Health Score &amp; Posture
              </h2>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${statusBadge.color}`}
              >
                {statusBadge.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous defensive evaluation based on your personal audit completion and verified controls.
            </p>
          </div>
        </div>

        {/* Audit Completion Metric Tag */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 self-start sm:self-center bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400">Audit Completion:</span>
          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
            {completionPercentage}%
          </span>
          <span className="text-slate-400">({auditedCount}/{totalAuditItems})</span>
        </div>
      </div>

      {/* Main Content: Radial Gauge + Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
        {/* Left: Dynamic Circular Meter Gauge (4 cols) */}
        <div className="md:col-span-4 flex items-center gap-5 justify-center md:justify-start">
          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background track circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={statusBadge.barColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>

            {/* Center Dynamic Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white leading-none tabular-nums">
                {healthScore}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-0.5">
                of 100
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {statusBadge.title}
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              {completionPercentage === 100
                ? 'Full coverage achieved'
                : `${totalAuditItems - auditedCount} checks unassessed`}
            </div>
            <div className="pt-1">
              <button
                onClick={() => setCurrentTab('audit')}
                className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{statusBadge.actionLabel}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle: 3 Status Pillars Breakdown (5 cols) */}
        <div className="md:col-span-5 grid grid-cols-3 gap-2">
          {/* Pillar 1: Verified Safe Controls */}
          <div
            onClick={() => setCurrentTab('audit')}
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Verified</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {reviewedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Secure controls
            </div>
          </div>

          {/* Pillar 2: Deficiencies Flagged */}
          <div
            onClick={() => setCurrentTab('audit')}
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Attention</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {needsAttentionCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Action required
            </div>
          </div>

          {/* Pillar 3: Unassessed Blindspots */}
          <div
            onClick={() => setCurrentTab('audit')}
            className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span>Pending</span>
            </div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {notCheckedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Unreviewed items
            </div>
          </div>
        </div>

        {/* Right: Contextual Recommendation & Quick Actions (3 cols) */}
        <div className="md:col-span-3 flex flex-col justify-between h-full space-y-3 bg-slate-50/70 dark:bg-slate-800/30 p-3 rounded-md border border-slate-200/60 dark:border-slate-800">
          <div>
            <div className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Defensive Summary
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {statusBadge.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
            <button
              onClick={() => setCurrentTab('audit')}
              className="flex-1 text-center py-1.5 px-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              Update Audit
            </button>
            <button
              onClick={() => setCurrentTab('reports')}
              className="py-1.5 px-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded text-xs font-medium transition cursor-pointer"
              title="Export Posture Report"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Segmented Posture Progress Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-mono">
          <span>Security Checklist Distribution</span>
          <span className="tabular-nums">
            {reviewedCount} safe · {needsAttentionCount} alert · {notCheckedCount} unassessed
          </span>
        </div>

        {/* 3-Color Segmented Bar */}
        <div className="w-full h-2 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          {reviewedCount > 0 && (
            <div
              style={{ width: `${(reviewedCount / totalAuditItems) * 100}%` }}
              className="h-full bg-emerald-500"
              title={`Reviewed & Secure: ${reviewedCount} items`}
            />
          )}
          {needsAttentionCount > 0 && (
            <div
              style={{ width: `${(needsAttentionCount / totalAuditItems) * 100}%` }}
              className="h-full bg-amber-500"
              title={`Needs Attention: ${needsAttentionCount} items`}
            />
          )}
          {notCheckedCount > 0 && (
            <div
              style={{ width: `${(notCheckedCount / totalAuditItems) * 100}%` }}
              className="h-full bg-slate-300 dark:bg-slate-700"
              title={`Unchecked: ${notCheckedCount} items`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
