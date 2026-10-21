/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Globe,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { AuditStatus, AuditItem } from '../../types';

export const PrivacyAuditView: React.FC = () => {
  const {
    language,
    auditItems,
    updateAuditStatus,
    addAuditItemToPlanner,
    auditedCount,
    needsAttentionCount,
  } = useApp();
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(auditItems.map((i) => i.category)))];

  const filteredItems = auditItems.filter((item) => {
    const matchesSearch =
      item.defaultTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.defaultDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    const matchesStatus =
      selectedStatusFilter === 'All' ||
      (selectedStatusFilter === 'reviewed' && item.status === 'reviewed') ||
      (selectedStatusFilter === 'needs_attention' && item.status === 'needs_attention') ||
      (selectedStatusFilter === 'not_checked' && item.status === 'not_checked') ||
      (selectedStatusFilter === 'not_applicable' && item.status === 'not_applicable');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completionPercentage = Math.round((auditedCount / auditItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Personal Privacy Audit
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Practical, explainable inspection for app permissions, cloud sync, MFA, and account safety.
          </p>
        </div>

        {/* Audit Completion Progress */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 self-start sm:self-center">
          <span className="text-slate-500 font-medium">Audit completion:</span>
          <span className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
            {auditedCount} / {auditItems.length} ({completionPercentage}%)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search privacy checklist..."
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs py-1 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'All Categories' : c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="text-xs py-1 px-2.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="needs_attention">Needs Attention ({needsAttentionCount})</option>
          <option value="reviewed">Reviewed</option>
          <option value="not_checked">Not Checked</option>
          <option value="not_applicable">Not Applicable</option>
        </select>
      </div>

      {/* Clean Audit Checklist Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit items match your filter criteria.
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;

            return (
              <div key={item.id} className="transition">
                {/* Item Summary Row */}
                <div
                  onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                        {item.category}
                      </span>
                      {item.severity === 'high' && (
                        <span className="text-[10px] font-semibold text-red-700 dark:text-red-400">
                          · High Priority
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.defaultTitle}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.defaultDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        item.status === 'reviewed'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : item.status === 'needs_attention'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                          : item.status === 'not_applicable'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}
                    >
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Inspection & Platform Guidance */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
                    {/* Status Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-medium text-slate-500 mr-1">
                        Change Status:
                      </span>
                      <button
                        onClick={() => updateAuditStatus(item.id, 'reviewed')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                          item.status === 'reviewed'
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Reviewed
                      </button>

                      <button
                        onClick={() => updateAuditStatus(item.id, 'needs_attention')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                          item.status === 'needs_attention'
                            ? 'bg-amber-600 text-white font-semibold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Needs Attention
                      </button>

                      <button
                        onClick={() => updateAuditStatus(item.id, 'not_applicable')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                          item.status === 'not_applicable'
                            ? 'bg-slate-700 text-white font-semibold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        N/A
                      </button>

                      <button
                        onClick={() => updateAuditStatus(item.id, 'not_checked')}
                        className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                          item.status === 'not_checked'
                            ? 'bg-slate-500 text-white font-semibold'
                            : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Unchecked
                      </button>

                      <button
                        onClick={() => addAuditItemToPlanner(item)}
                        className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-teal-600" />
                        <span>Add to Action Planner</span>
                      </button>
                    </div>

                    {/* Threat analysis */}
                    <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <div className="font-semibold text-slate-900 dark:text-white mb-0.5">
                        Why this setting matters:
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                        {item.whyItMatters}
                      </p>
                    </div>

                    {/* Platform-specific instructions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.platformInstructions.ios && (
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-slate-400" /> iOS Configuration
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {item.platformInstructions.ios}
                          </p>
                        </div>
                      )}

                      {item.platformInstructions.android && (
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                          <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-slate-400" /> Android Configuration
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {item.platformInstructions.android}
                          </p>
                        </div>
                      )}

                      {item.platformInstructions.web && (
                        <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 md:col-span-2">
                          <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-slate-400" /> Web &amp; Desktop Accounts
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {item.platformInstructions.web}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
