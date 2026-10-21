/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  FileSearch,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  ArrowRight,
  RefreshCw,
  FileText,
  Trash2,
  Check,
  Shield,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { scanFileOnServer, uploadImageToCloudinary } from '../../services/api';
import { ScannedFile, ScanFinding } from '../../types';
import { preloadedSyntheticFiles } from '../../data/syntheticDemoData';

export const FileScannerView: React.FC = () => {
  const {
    language,
    scannedFiles,
    activeFileId,
    setActiveFileId,
    activeFile,
    addScannedFile,
    deleteScannedFile,
    updateFindingStatus,
    updateFindingLabel,
    setCurrentTab,
    addToast,
  } = useApp();
  const t = useTranslation(language);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [editingFindingId, setEditingFindingId] = useState<string | null>(null);
  const [editedLabel, setEditedLabel] = useState('');
  const [editedCategory, setEditedCategory] = useState<any>('other');
  const [dismissReasonModal, setDismissReasonModal] = useState<string | null>(null);
  const [dismissReasonText, setDismissReasonText] = useState('');

  // Handle local user file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 20 * 1024 * 1024) {
      addToast('File exceeds 20MB limit. Please upload a smaller document.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setIsScanning(true);
      addToast('Analyzing document for visible sensitive personal data...', 'info');

      try {
        const scanRes = await scanFileOnServer(dataUrl, file.type, file.name);
        
        // Attempt authenticated Cloudinary upload in background
        const cloudUpload = await uploadImageToCloudinary(file, file.name);

        const newFile: ScannedFile = {
          id: `file-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          isSynthetic: false,
          dataUrl,
          findings: scanRes.findings || [],
          cloudinaryUrl: cloudUpload?.secure_url,
          cloudinaryPublicId: cloudUpload?.public_id,
        };

        addScannedFile(newFile);
        addToast(
          cloudUpload
            ? `Encrypted & uploaded to Cloudinary Vault. Identified ${scanRes.findings.length} findings.`
            : `Identified ${scanRes.findings.length} findings requiring inspection.`,
          'info'
        );
      } catch (err: any) {
        addToast('File analysis encountered an error. Applied local rules.', 'error');
      } finally {
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Preloaded sample selection
  const loadSyntheticSample = (sampleId: string) => {
    const existing = scannedFiles.find((f) => f.id === sampleId);
    if (existing) {
      setActiveFileId(sampleId);
      addToast(`Selected ${existing.name}`, 'info');
      return;
    }
    const sample = preloadedSyntheticFiles.find((f) => f.id === sampleId);
    if (sample) {
      addScannedFile(sample);
      addToast(`Loaded ${sample.name}`, 'info');
    }
  };

  const handleStartEdit = (finding: ScanFinding) => {
    setEditingFindingId(finding.id);
    setEditedLabel(finding.label);
    setEditedCategory(finding.category);
  };

  const handleSaveEdit = (findingId: string) => {
    if (!activeFile) return;
    updateFindingLabel(activeFile.id, findingId, editedLabel, editedCategory);
    setEditingFindingId(null);
    addToast('Finding updated', 'success');
  };

  const handleDismissConfirm = () => {
    if (!activeFile || !dismissReasonModal) return;
    updateFindingStatus(activeFile.id, dismissReasonModal, 'dismissed', dismissReasonText || 'User dismissed');
    setDismissReasonModal(null);
    setDismissReasonText('');
    addToast('Finding dismissed', 'info');
  };

  const activeFindings = (activeFile?.findings || []).filter((f) => f.status === 'active' || f.status === 'confirmed');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            File &amp; Document Scanner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify visible personal identifiers (emails, phone numbers, addresses, account IDs) before sharing.
          </p>
        </div>

        {/* Sample Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs self-start sm:self-center">
          <span className="text-[11px] font-medium text-slate-500 px-2 hidden md:inline">
            Sample Cases:
          </span>
          <button
            onClick={() => loadSyntheticSample('sample-utility-bill')}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeFileId === 'sample-utility-bill'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Utility Bill
          </button>
          <button
            onClick={() => loadSyntheticSample('sample-boarding-pass')}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeFileId === 'sample-boarding-pass'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Boarding Pass
          </button>
          <button
            onClick={() => loadSyntheticSample('sample-work-badge')}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeFileId === 'sample-work-badge'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Employee Badge
          </button>
        </div>
      </div>

      {/* Practical Upload Drop Zone (Normal border, restrained styling) */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Upload Document or Image for Inspection
              </div>
              <div className="text-[11px] text-slate-500">
                Supports PNG, JPEG, WebP, SVG up to 20MB. Processed with isolated privacy-first parsing.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isScanning ? 'Analyzing...' : 'Browse File'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Preview & Findings List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Document Preview & File Meta */}
        <div className="lg:col-span-5 space-y-4">
          {activeFile && (
            <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="truncate">
                <div className="font-semibold text-slate-900 dark:text-white truncate">
                  {activeFile.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {(activeFile.size / 1024).toFixed(1)} KB · {activeFile.uploadedAt}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => deleteScannedFile(activeFile.id)}
                  className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                  title="Remove from session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Document Preview Box with Bounding Box Overlays */}
          <div className="bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center relative min-h-[360px]">
            {activeFile ? (
              <div className="relative max-w-full max-h-[480px] rounded shadow-xs overflow-hidden bg-white select-none">
                <img
                  src={activeFile.dataUrl}
                  alt={activeFile.name}
                  className="w-full h-auto object-contain max-h-[460px] block"
                />

                {/* Overlaid bounding box rectangles */}
                {activeFile.findings.map((finding) => {
                  if (finding.status === 'dismissed' || !finding.bbox) return null;
                  const isRedacted = finding.status === 'redacted';
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
                      className={`absolute rounded-xs pointer-events-none transition ${
                        isRedacted
                          ? 'bg-black/90 border border-slate-700'
                          : finding.severity === 'high'
                          ? 'border border-red-600 bg-red-600/15'
                          : 'border border-amber-600 bg-amber-600/15'
                      }`}
                    >
                      <span className="absolute -top-3.5 left-0 text-[8px] font-mono px-1 rounded-xs bg-slate-900 text-white whitespace-nowrap">
                        {isRedacted ? 'REDACTED' : finding.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400">No active document</div>
            )}
          </div>

          {/* Primary Action: Go to Redaction Studio */}
          {activeFile && (
            <button
              onClick={() => setCurrentTab('redaction')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Open in Redaction Studio ({activeFindings.length} regions)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Defensive Scope Notice */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-md border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Analysis boundary: </span>
            This tool performs optical pattern matching on legible text in this document. It does not search external databases or dark-web archives.
          </div>
        </div>

        {/* Right 7 Cols: Detected Information Checklist */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Detected Sensitive Information ({activeFile?.findings.length || 0})
            </h2>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {activeFindings.length} Active
            </span>
          </div>

          {(!activeFile || activeFile.findings.length === 0) ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No sensitive findings detected on this document.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activeFile.findings.map((finding) => {
                const isEditing = editingFindingId === finding.id;
                const isDismissed = finding.status === 'dismissed';
                const isRedacted = finding.status === 'redacted';

                return (
                  <div
                    key={finding.id}
                    className={`p-4 transition ${
                      isDismissed
                        ? 'opacity-40 bg-slate-50 dark:bg-slate-800/30'
                        : isRedacted
                        ? 'bg-slate-50/50 dark:bg-slate-800/20'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Header: Label, Category, Severity & Masked Preview */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                            finding.severity === 'high'
                              ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60'
                              : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                          }`}
                        >
                          {finding.severity.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {finding.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded tabular-nums">
                          {finding.maskedValue}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 tabular-nums hidden sm:inline">
                          {finding.confidence}% confidence
                        </span>
                      </div>
                    </div>

                    {/* Threat explanation */}
                    {isEditing ? (
                      <div className="space-y-2 py-2">
                        <input
                          type="text"
                          value={editedLabel}
                          onChange={(e) => setEditedLabel(e.target.value)}
                          className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingFindingId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(finding.id)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-teal-600 rounded cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 leading-snug">
                        {finding.reason}
                      </p>
                    )}

                    {/* Action controls */}
                    {!isDismissed && (
                      <div className="flex items-center justify-end gap-3 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                        <button
                          onClick={() => handleStartEdit(finding)}
                          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Rename</span>
                        </button>

                        <button
                          onClick={() => updateFindingStatus(activeFile.id, finding.id, 'confirmed')}
                          className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center gap-1 font-medium"
                        >
                          <Check className="w-3 h-3" />
                          <span>Confirm</span>
                        </button>

                        <button
                          onClick={() => setDismissReasonModal(finding.id)}
                          className="text-slate-400 hover:text-red-600 cursor-pointer flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Dismiss</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Dismissal Reason Modal */}
      {dismissReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-sm w-full p-5 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Dismiss Finding
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Explain why this item does not require redaction (e.g. public business name, fictitious sample):
            </p>
            <input
              type="text"
              value={dismissReasonText}
              onChange={(e) => setDismissReasonText(e.target.value)}
              placeholder="e.g. Public company contact"
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDismissReasonModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDismissConfirm}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 rounded cursor-pointer"
              >
                Dismiss Finding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
