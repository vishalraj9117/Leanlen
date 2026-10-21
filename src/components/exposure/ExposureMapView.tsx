/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, ShieldAlert, ArrowRight, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { ExposureNode } from '../../types';

export const ExposureMapView: React.FC = () => {
  const { language, exposureNodes, exposureEdges } = useApp();
  const t = useTranslation(language);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    exposureNodes[1]?.id || exposureNodes[0]?.id || ''
  );

  const selectedNode = exposureNodes.find((n) => n.id === selectedNodeId) || exposureNodes[0];

  const connectedEdges = exposureEdges.filter(
    (e) => e.source === selectedNodeId || e.target === selectedNodeId
  );

  const dataNodes = exposureNodes.filter((n) => n.category === 'data_type');
  const serviceNodes = exposureNodes.filter((n) => n.category === 'service');
  const contextNodes = exposureNodes.filter((n) => n.category === 'context');
  const riskNodes = exposureNodes.filter((n) => n.category === 'risk');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Exposure Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive correlation graph illustrating how individual data points combine across platforms into security risks.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-teal-600" />
            <span className="text-slate-600 dark:text-slate-300">Data</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-indigo-600" />
            <span className="text-slate-600 dark:text-slate-300">Platform</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-slate-600" />
            <span className="text-slate-600 dark:text-slate-300">Context</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-red-600" />
            <span className="text-slate-600 dark:text-slate-300">Threat</span>
          </div>
        </div>
      </div>

      {/* Main Diagram & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: 4 Column Vector Matrix */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Correlation Flow Diagram
            </span>
            <span className="text-slate-400 text-[11px]">Click any node to inspect relationship details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Column 1: Data Points */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 pb-1 border-b border-teal-200 dark:border-teal-800">
                1. Personal Data
              </div>
              <div className="space-y-1.5">
                {dataNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isConnected = connectedEdges.some((e) => e.source === node.id || e.target === node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-2.5 rounded border text-xs cursor-pointer transition select-none ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                          : isConnected
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-slate-900 dark:text-white font-medium'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {node.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Platforms / Services */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 pb-1 border-b border-indigo-200 dark:border-indigo-800">
                2. Platform
              </div>
              <div className="space-y-1.5">
                {serviceNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isConnected = connectedEdges.some((e) => e.source === node.id || e.target === node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-2.5 rounded border text-xs cursor-pointer transition select-none ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                          : isConnected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 text-slate-900 dark:text-white font-medium'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {node.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 3: Context */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-800">
                3. Sharing Context
              </div>
              <div className="space-y-1.5">
                {contextNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isConnected = connectedEdges.some((e) => e.source === node.id || e.target === node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-2.5 rounded border text-xs cursor-pointer transition select-none ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                          : isConnected
                          ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {node.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 4: Threat */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 pb-1 border-b border-red-200 dark:border-red-800">
                4. Potential Threat
              </div>
              <div className="space-y-1.5">
                {riskNodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isConnected = connectedEdges.some((e) => e.source === node.id || e.target === node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-2.5 rounded border text-xs cursor-pointer transition select-none ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white font-semibold'
                          : isConnected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/60 text-slate-900 dark:text-white font-medium'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {node.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Selected Node Details & Action */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
              {selectedNode.category.replace('_', ' ')}
            </span>
            {selectedNode.severity && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  selectedNode.severity === 'high'
                    ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60'
                    : 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
                }`}
              >
                {selectedNode.severity.toUpperCase()} RISK
              </span>
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedNode.label}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {selectedNode.description}
            </p>
          </div>

          {/* Connected Edges List */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Connected Risk Paths ({connectedEdges.length}):
            </div>
            <div className="space-y-1.5">
              {connectedEdges.map((edge) => {
                const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                const otherNode = exposureNodes.find((n) => n.id === otherNodeId);
                const isOutgoing = edge.source === selectedNode.id;

                return (
                  <div
                    key={edge.id}
                    onClick={() => setSelectedNodeId(otherNodeId)}
                    className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-slate-400 transition cursor-pointer text-xs space-y-0.5"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{isOutgoing ? '→' : '←'}</span>
                      <span>{otherNode?.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {edge.reason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Defensive Action */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Recommended Countermeasure:</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {selectedNode.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
