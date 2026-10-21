/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Eraser,
  Download,
  RotateCcw,
  RotateCw,
  Eye,
  Sliders,
  Check,
  AlertTriangle,
  Layers,
  FileCheck,
  Trash2,
  Lock,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import {
  applyIrreversibleRedaction,
  downloadDataUrl,
  RedactionRegion,
  RedactionStyle,
} from '../../utils/redactionCanvas';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const RedactionStudioView: React.FC = () => {
  const {
    language,
    activeFile,
    saveRedactedFile,
    scannedFiles,
    setActiveFileId,
    addToast,
  } = useApp();
  const t = useTranslation(language);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Redaction regions state and undo/redo stacks
  const [regions, setRegions] = useState<RedactionRegion[]>([]);
  const [history, setHistory] = useState<RedactionRegion[][]>([]);
  const [redoStack, setRedoStack] = useState<RedactionRegion[][]>([]);

  // Style: 'solid_black' | 'pixelate' | 'whiteout'
  const [selectedStyle, setSelectedStyle] = useState<RedactionStyle>('solid_black');

  // Manual box drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentDragRect, setCurrentDragRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Preview toggle: show before (raw original) vs preview (with applied redactions)
  const [showOriginal, setShowOriginal] = useState(false);

  // Export Confirmation Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [redactedExportUrl, setRedactedExportUrl] = useState<string | null>(null);

  // Initialize regions from active file's sensitive findings
  useEffect(() => {
    if (!activeFile) return;

    const findings = activeFile.findings || [];
    const initialRegions: RedactionRegion[] = findings
      .filter((f) => f.status !== 'dismissed' && f.bbox)
      .map((f) => ({
        id: `reg-${f.id}`,
        bbox: f.bbox!,
        label: f.label,
        style: selectedStyle,
      }));

    setRegions(initialRegions);
    setHistory([initialRegions]);
    setRedoStack([]);
  }, [activeFile?.id]);

  const pushState = (newRegions: RedactionRegion[]) => {
    setHistory((prev) => [...prev, regions]);
    setRedoStack([]);
    setRegions(newRegions);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, regions]);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setRegions(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => [...prev, regions]);
    setHistory((prev) => [...prev, regions]);
    setRegions(next);
  };

  // Render canvas with the document and current redactions
  useEffect(() => {
    if (!activeFile || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeFile.dataUrl;

    img.onload = () => {
      canvas.width = img.naturalWidth || img.width || 800;
      canvas.height = img.naturalHeight || img.height || 600;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (showOriginal) return;

      // Draw all current redactions
      for (const region of regions) {
        const x = (region.bbox.xmin / 1000) * canvas.width;
        const y = (region.bbox.ymin / 1000) * canvas.height;
        const w = ((region.bbox.xmax - region.bbox.xmin) / 1000) * canvas.width;
        const h = ((region.bbox.ymax - region.bbox.ymin) / 1000) * canvas.height;

        if (region.style === 'solid_black') {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);

          if (h >= 14 && w >= 40) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(region.label ? `[${region.label.toUpperCase()}]` : '[REDACTED]', x + w / 2, y + h / 2, w - 4);
          }
        } else if (region.style === 'pixelate') {
          const blockSize = Math.max(6, Math.floor(Math.min(w, h) / 4));
          const imgData = ctx.getImageData(x, y, Math.max(1, w), Math.max(1, h));
          const data = imgData.data;

          for (let by = 0; by < h; by += blockSize) {
            for (let bx = 0; bx < w; bx += blockSize) {
              const curW = Math.min(blockSize, w - bx);
              const curH = Math.min(blockSize, h - by);
              let r = 0, g = 0, b = 0, count = 0;
              for (let py = 0; py < curH; py++) {
                for (let px = 0; px < curW; px++) {
                  const idx = ((by + py) * Math.floor(w) + (bx + px)) * 4;
                  r += data[idx];
                  g += data[idx + 1];
                  b += data[idx + 2];
                  count++;
                }
              }
              r = Math.round(r / count);
              g = Math.round(g / count);
              b = Math.round(b / count);
              for (let py = 0; py < curH; py++) {
                for (let px = 0; px < curW; px++) {
                  const idx = ((by + py) * Math.floor(w) + (bx + px)) * 4;
                  data[idx] = r;
                  data[idx + 1] = g;
                  data[idx + 2] = b;
                }
              }
            }
          }
          ctx.putImageData(imgData, x, y);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);
        } else if (region.style === 'whiteout') {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, w, h);

          if (h >= 14 && w >= 40) {
            ctx.fillStyle = '#64748b';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('[REDACTED]', x + w / 2, y + h / 2, w - 4);
          }
        }
      }

      // If user is currently dragging to draw a manual rectangle
      if (currentDragRect) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeRect(currentDragRect.x, currentDragRect.y, currentDragRect.w, currentDragRect.h);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
        ctx.fillRect(currentDragRect.x, currentDragRect.y, currentDragRect.w, currentDragRect.h);
        ctx.setLineDash([]);
      }
    };
  }, [activeFile, regions, showOriginal, currentDragRect]);

  // Mouse handlers for manual drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setStartPoint({ x, y });
    setCurrentDragRect({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const x = Math.min(startPoint.x, currentX);
    const y = Math.min(startPoint.y, currentY);
    const w = Math.abs(currentX - startPoint.x);
    const h = Math.abs(currentY - startPoint.y);

    setCurrentDragRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !startPoint || !currentDragRect || !canvasRef.current) {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentDragRect(null);
      return;
    }

    const canvas = canvasRef.current;

    if (currentDragRect.w > 8 && currentDragRect.h > 8) {
      const ymin = Math.round((currentDragRect.y / canvas.height) * 1000);
      const xmin = Math.round((currentDragRect.x / canvas.width) * 1000);
      const ymax = Math.round(((currentDragRect.y + currentDragRect.h) / canvas.height) * 1000);
      const xmax = Math.round(((currentDragRect.x + currentDragRect.w) / canvas.width) * 1000);

      const newRegion: RedactionRegion = {
        id: `manual-${Date.now()}`,
        bbox: { ymin, xmin, ymax, xmax },
        label: 'Manual Selection',
        style: selectedStyle,
      };

      pushState([...regions, newRegion]);
      addToast('Redaction box added', 'info');
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentDragRect(null);
  };

  const removeRegion = (id: string) => {
    pushState(regions.filter((r) => r.id !== id));
  };

  const handlePrepareExport = async () => {
    if (!activeFile) return;
    try {
      const resultDataUrl = await applyIrreversibleRedaction(activeFile.dataUrl, regions);
      setRedactedExportUrl(resultDataUrl);
      setIsExportModalOpen(true);
    } catch {
      addToast('Error generating irreversible redaction export', 'error');
    }
  };

  const handleConfirmDownload = () => {
    if (!activeFile || !redactedExportUrl) return;
    saveRedactedFile(activeFile.id, redactedExportUrl);
    const filename = `REDACTED_${activeFile.name.replace(/\.[^/.]+$/, '')}.png`;
    downloadDataUrl(redactedExportUrl, filename);
    addToast(`Exported redacted copy: ${filename}`, 'success');
  };

  if (!activeFile) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
        No document active. Please select a file in the File Scanner first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Redaction Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Irreversibly overwrite sensitive pixel data and strip EXIF metadata before sharing.
          </p>
        </div>

        {/* Export CTA */}
        <button
          onClick={handlePrepareExport}
          disabled={regions.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-40 self-start sm:self-center"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Redacted Copy ({regions.length})</span>
        </button>
      </div>

      {/* Two Column Layout: Canvas Workspace (8 Cols) + Redaction Regions Sidebar (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas + Controls Toolbar */}
        <div className="lg:col-span-8 space-y-3">
          {/* Controls Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Style Segmented Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Style:</span>
              <button
                onClick={() => setSelectedStyle('solid_black')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                  selectedStyle === 'solid_black'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Blackout
              </button>
              <button
                onClick={() => setSelectedStyle('pixelate')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                  selectedStyle === 'pixelate'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Pixelate
              </button>
              <button
                onClick={() => setSelectedStyle('whiteout')}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition ${
                  selectedStyle === 'whiteout'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Light
              </button>
            </div>

            {/* Utility Actions: Undo, Redo, Compare */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                title="Undo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                title="Redo"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <div className="h-3.5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />

              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition flex items-center gap-1.5 ${
                  showOriginal
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOriginal ? 'Showing Original' : 'Preview Redaction'}</span>
              </button>
            </div>
          </div>

          {/* Canvas Workspace */}
          <div className="bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center justify-center relative min-h-[460px]">
            <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 px-2.5 py-1 rounded text-[11px] font-medium text-slate-500 border border-slate-200 dark:border-slate-700 pointer-events-none z-10">
              Drag on document to draw custom redaction box
            </div>

            <div
              ref={containerRef}
              className="relative max-w-full max-h-[580px] overflow-auto rounded bg-white border border-slate-300 dark:border-slate-700 cursor-crosshair select-none"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="block max-w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Redaction Regions List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Redaction Targets ({regions.length})
            </h2>
            <button
              onClick={() => pushState([])}
              className="text-xs text-slate-400 hover:text-red-600 cursor-pointer"
            >
              Clear all
            </button>
          </div>

          <div className="p-3 text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
            Selected regions will be physically replaced with blank pixels upon export.
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto max-h-[480px]">
            {regions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No redactions applied yet. Draw on the document or select detected items.
              </div>
            ) : (
              regions.map((region) => (
                <div
                  key={region.id}
                  className="p-3 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs"
                >
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {region.label || 'Redaction Box'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Coordinates: [{region.bbox.ymin}, {region.bbox.xmin}, {region.bbox.ymax}, {region.bbox.xmax}]
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {region.style.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => removeRegion(region.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isExportModalOpen}
        title="Confirm Irreversible Export"
        description="The exported image will permanently overwrite pixel raster data for all chosen regions. All EXIF camera data and GPS location tags will be stripped automatically."
        confirmLabel="Download Redacted Copy"
        cancelLabel="Review Again"
        onConfirm={handleConfirmDownload}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
};
