/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Puzzle,
  Info,
  CheckCircle2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import {
  syntheticCombinationScenarios,
  dataFragmentOptions,
  calculateCombinationRisk,
} from '../../data/combinationRules';

export const CombinationCheckView: React.FC = () => {
  const { language } = useApp();
  const t = useTranslation(language);

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    syntheticCombinationScenarios[0]?.id || ''
  );

  // Custom calculator selected fragments
  const [selectedFragments, setSelectedFragments] = useState<string[]>([
    'f-zip',
    'f-birth-day',
    'f-employer',
  ]);

  const activeScenario =
    syntheticCombinationScenarios.find((s) => s.id === selectedScenarioId) ||
    syntheticCombinationScenarios[0];

  const toggleFragment = (id: string) => {
    setSelectedFragments((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const riskResult = calculateCombinationRisk(selectedFragments);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Unique Privacy Combination Check
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Demonstrating how individually innocuous data fragments combine to narrow down anonymity sets.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 self-start sm:self-center">
          Grounded in k-anonymity principles · Synthetic models only
        </div>
      </div>

      {/* Part 1: Interactive Combination Risk Calculator */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Quasi-Identifier Entropy Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select data attributes you routinely share on public platforms to calculate composite re-identification risk.
          </p>
        </div>

        {/* Fragment Checkboxes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
          {dataFragmentOptions.map((frag) => {
            const isChecked = selectedFragments.includes(frag.id);
            return (
              <button
                key={frag.id}
                onClick={() => toggleFragment(frag.id)}
                className={`p-2.5 rounded border text-left transition cursor-pointer flex items-start gap-2 select-none ${
                  isChecked
                    ? 'border-slate-900 bg-slate-900 text-white font-medium'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-xs mt-0.5 flex items-center justify-center border transition shrink-0 ${
                    isChecked
                      ? 'bg-teal-500 border-teal-500 text-slate-900'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                <div className="truncate">
                  <div className="font-semibold truncate">{frag.name}</div>
                  <div className={`text-[10px] ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>
                    ~{frag.entropyBits} bits entropy
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Calculation Result Row */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Classification:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  riskResult.level === 'Near-Certain'
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                    : riskResult.level === 'High'
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                }`}
              >
                {riskResult.level} Risk
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">
              Estimated Anonymity Set: {riskResult.estimatedBucketSize}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {riskResult.advice}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded border border-slate-200 dark:border-slate-700 self-start md:self-center shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                {riskResult.score}%
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                Re-identification
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Curated Synthetic Scenarios */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Empirical Re-identification Scenarios
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Documented research examples showing how public records and innocuous posts correlate.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
          {syntheticCombinationScenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenarioId;
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                  isSelected
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {scenario.title}
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Breakdown */}
        <div className="p-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                {activeScenario.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {activeScenario.description}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400 shrink-0">
              {activeScenario.reidentificationRisk}% Re-identification Risk
            </span>
          </div>

          {/* Combined Data Points */}
          <div>
            <div className="text-[10px] uppercase font-mono font-bold text-slate-400 mb-1">
              Quasi-Identifier Triad:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeScenario.dataPoints.map((pt, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium rounded border border-slate-200 dark:border-slate-700"
                >
                  {pt}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5">
                Correlation Mechanism:
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {activeScenario.explanation}
              </p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-900 dark:text-white text-[11px] mb-0.5">
                Real-World Threat Vector:
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {activeScenario.realWorldImpact}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-white">Recommended action: </span>
            {activeScenario.defensiveAction}
          </div>
        </div>
      </div>
    </div>
  );
};
