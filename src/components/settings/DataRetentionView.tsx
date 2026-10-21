/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Database,
  Trash2,
  Download,
  ShieldCheck,
  RefreshCw,
  Globe,
  Sun,
  Moon,
  Cloud,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { checkServerStatus, requestAssetDeletion, ServerStatusResponse } from '../../services/api';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const DataRetentionView: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    scannedFiles,
    auditItems,
    actionTasks,
    deleteScannedFile,
    resetAllDemoData,
    addToast,
  } = useApp();
  const t = useTranslation(language);

  const [serverStatus, setServerStatus] = useState<ServerStatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await checkServerStatus();
      setServerStatus(res);
    } catch {
      // Handled in api service
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handlePurgeAll = async () => {
    await requestAssetDeletion('all');
    resetAllDemoData();
    setIsPurgeModalOpen(false);
    addToast('All local session and cached data purged.', 'success');
  };

  const handleExportJson = () => {
    const backup = {
      exportTimestamp: new Date().toISOString(),
      appName: 'LeakLens',
      auditChecklist: auditItems,
      actionPlanTasks: actionTasks,
      scannedFilesMetadata: scannedFiles.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        type: f.type,
        uploadedAt: f.uploadedAt,
        findingsCount: (f.findings || []).length,
        isRedacted: Boolean(f.redactedDataUrl),
      })),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LeakLens_Data_Export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Exported session data to JSON', 'success');
  };

  const totalBytes = scannedFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Settings &amp; Data Controls
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage interface preferences, backend boundary configurations, and local storage retention.
        </p>
      </div>

      {/* Section 1: Interface Preferences */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          1. Interface Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Language Preference */}
          <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Language (भाषा)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                  language === 'en'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                  language === 'hi'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          {/* Theme Preference */}
          <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              {theme === 'light' ? <Sun className="w-3.5 h-3.5 text-slate-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
              <span>Visual Appearance</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                  theme === 'light'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                Light Theme
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                Dark Theme
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Backend Boundary & Cloud Configuration */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Infrastructure &amp; Integration Boundaries
          </h2>
          <button
            onClick={loadStatus}
            disabled={isLoadingStatus}
            className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
            <span>Check Connectivity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <div className="text-slate-500 font-medium">Cloudinary Storage</div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {serverStatus?.hasCloudinary
                ? `Configured (${serverStatus.cloudinaryCloudName})`
                : 'Isolated Local Session'}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {serverStatus?.hasCloudinary
                ? 'Signed authenticated uploads active via backend API.'
                : 'No Cloudinary credentials provided. Operating in isolated local mode without cloud uploads.'}
            </p>
          </div>

          <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <div className="text-slate-500 font-medium">PII Vision Engine</div>
            <div className="font-semibold text-slate-900 dark:text-white">
              {serverStatus?.hasGeminiKey ? 'Gemini 3.8 Flash' : 'Offline Privacy Engine'}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {serverStatus?.hasGeminiKey
                ? 'Server-side structured OCR with zero browser API key exposure.'
                : 'Local regex & heuristic scanner running in memory.'}
            </p>
          </div>

          <div className="p-3.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <div className="text-slate-500 font-medium">Server Retention</div>
            <div className="font-semibold text-slate-900 dark:text-white">
              Zero Server Persistence
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              User files are processed in ephemeral memory and discarded immediately after inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Data Footprint & Asset Management */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Local Storage Footprint ({scannedFiles.length} items · {(totalBytes / 1024).toFixed(1)} KB)
          </h2>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded">
          {scannedFiles.map((file) => (
            <div
              key={file.id}
              className="p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="truncate">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {file.name}
                </span>
                <span className="text-[11px] text-slate-400 ml-2 font-mono tabular-nums">
                  {(file.size / 1024).toFixed(1)} KB · {file.uploadedAt}
                </span>
              </div>

              <button
                onClick={() => deleteScannedFile(file.id)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer shrink-0"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJson}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-medium border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Session Data (JSON)</span>
          </button>

          <button
            onClick={() => setIsPurgeModalOpen(true)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Data &amp; Reset</span>
          </button>
        </div>
      </div>

      {/* Section 4: Privacy Pledge */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
        <div className="font-semibold text-slate-900 dark:text-white">
          Our Defensive Privacy Pledge
        </div>
        <p className="text-[11px] text-slate-500">
          LeakLens never searches external breach dumps for personal passwords, never bypasses authentication, and never stores unredacted personal files on public cloud servers without your explicit authenticated permission.
        </p>
      </div>

      {/* Purge Modal */}
      <ConfirmationModal
        isOpen={isPurgeModalOpen}
        title="Purge All Session Data?"
        description="This will clear all uploaded documents, scanned findings, customized action items, and restore the default synthetic test environment."
        confirmLabel="Purge Everything"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handlePurgeAll}
        onClose={() => setIsPurgeModalOpen(false)}
      />
    </div>
  );
};
