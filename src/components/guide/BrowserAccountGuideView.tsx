/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Globe,
  Compass,
  Search,
  Smartphone,
  Shield,
  ChevronRight,
  Laptop
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';

interface GuideSection {
  id: string;
  title: string;
  category: 'Browser' | 'Account' | 'Mobile';
  iconType: 'chrome' | 'safari' | 'google' | 'apple' | 'meta';
  summary: string;
  steps: string[];
  impact: string;
}

const guideSections: GuideSection[] = [
  {
    id: 'g-chrome',
    title: 'Google Chrome: DNS-over-HTTPS & Third-Party Cookies',
    category: 'Browser',
    iconType: 'chrome',
    summary: 'Prevent ISPs from snooping on domain requests and block cross-site tracking cookies.',
    steps: [
      'Open Chrome Settings (chrome://settings).',
      'Navigate to "Privacy and security" > "Third-party cookies".',
      'Select "Block third-party cookies" to stop ad networks from following you across websites.',
      'Go to "Security" > scroll to "Use secure DNS" > switch to "With Cloudflare (1.1.1.1)" or "Quad9".'
    ],
    impact: 'Stops local Wi-Fi and ISP routers from logging every web domain you resolve.'
  },
  {
    id: 'g-safari',
    title: 'Safari (iOS & macOS): Advanced Fingerprinting Protection',
    category: 'Browser',
    iconType: 'safari',
    summary: 'Disable cross-site canvas fingerprinting and hide your real IP address from trackers.',
    steps: [
      'On iPhone/iPad: Open Settings > Safari > Advanced > "Advanced Tracking and Fingerprinting Protection". Set to "All Browsing".',
      'Under Safari settings, ensure "Hide IP address" is set to "From Trackers".',
      'On Mac: Open Safari > Settings > Advanced > Check "Use advanced tracking and fingerprinting protection".'
    ],
    impact: 'Prevents tracker scripts from identifying your device via subtle hardware differences.'
  },
  {
    id: 'g-google-account',
    title: 'Google Account: Web & App Activity Auto-Delete',
    category: 'Account',
    iconType: 'google',
    summary: 'Limit continuous profiling of your YouTube, Maps, and search queries.',
    steps: [
      'Visit myaccount.google.com/data-and-privacy.',
      'Tap "Web & App Activity" > Select "Auto-delete" > Change from "Don\'t auto-delete" to "3 months".',
      'Review "Location History" (Timeline) and ensure it is saved locally to your device rather than stored on Google cloud servers.',
      'Under "Personalized ads", turn the master switch to "Off".'
    ],
    impact: 'Automatically purges stored search histories and voice queries after 90 days.'
  },
  {
    id: 'g-apple-id',
    title: 'Apple ID: iCloud Private Relay & Hide My Email',
    category: 'Account',
    iconType: 'apple',
    summary: 'Dual-hop encrypted relay that isolates DNS queries from web destinations.',
    steps: [
      'Open iPhone Settings > Tap your Name / Apple Account at the top.',
      'Tap "iCloud" > "Private Relay" > Toggle to "On".',
      'Tap "Hide My Email" when registering on new websites or forums to generate unique disposable forwarding addresses.',
      'Review "Sign in with Apple" apps and verify your real personal email is concealed.'
    ],
    impact: 'Encrypts Safari traffic so neither Apple nor your network provider can see both who you are and what site you visit.'
  },
  {
    id: 'g-meta',
    title: 'Meta (Instagram & Facebook): Off-Facebook Activity Purge',
    category: 'Account',
    iconType: 'meta',
    summary: 'Sever data sharing between external apps/stores and your social profiles.',
    steps: [
      'Open Accounts Center (accountscenter.facebook.com).',
      'Go to "Your information and permissions" > "Off-Meta technologies".',
      'Tap "Disconnect specific activity" or "Clear previous activity".',
      'Tap "Manage future activity" and select "Disconnect future activity".'
    ],
    impact: 'Stops online stores and travel sites from pinging Meta every time you purchase or browse an item.'
  }
];

export const BrowserAccountGuideView: React.FC = () => {
  const { language } = useApp();
  const t = useTranslation(language);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(guideSections[0].id);

  const filtered = guideSections.filter(
    (g) => activeCategory === 'All' || g.category === activeCategory
  );

  const renderIcon = (type: GuideSection['iconType']) => {
    switch (type) {
      case 'chrome':
        return <Globe className="w-4 h-4 text-slate-500" />;
      case 'safari':
        return <Compass className="w-4 h-4 text-slate-500" />;
      case 'google':
        return <Search className="w-4 h-4 text-slate-500" />;
      case 'apple':
        return <Laptop className="w-4 h-4 text-slate-500" />;
      case 'meta':
        return <Smartphone className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Browser &amp; Account Safety Guides
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Step-by-step instructions for hardening Chrome, Safari, Apple, Google, and Meta accounts.
        </p>
      </div>

      {/* Risk Explainer Rubric Box */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-500" />
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Deterministic Risk Classification Rubric
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          LeakLens employs rule-based, explainable classification for findings and audit checks:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 rounded border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-1">
            <div className="font-semibold text-red-900 dark:text-red-300">
              High Priority Risk
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Direct account credentials, utility account numbers, full residential street addresses, or government identification IDs that facilitate unauthorized account resets or doxxing.
            </p>
          </div>

          <div className="p-3 rounded border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
            <div className="font-semibold text-amber-900 dark:text-amber-300">
              Caution
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Personal phone numbers, primary email addresses, or employee identity numbers that can be exploited for targeted spear-phishing or social engineering.
            </p>
          </div>

          <div className="p-3 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-1">
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              Informational
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              General geographic indicators (City/State), device metadata, or browser security settings that enhance overall hygiene without unique single-source re-identification risk.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
        {['All', 'Browser', 'Account'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeCategory === cat
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {cat} Guides
          </button>
        ))}
      </div>

      {/* Guide Accordion Items */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filtered.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div key={item.id} className="transition">
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {renderIcon(item.iconType)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xs">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 line-clamp-1 text-[11px]">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="text-slate-400 shrink-0">
                  <ChevronRight
                    className={`w-4 h-4 transform transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Step-by-Step Instructions:
                    </div>
                    <ol className="space-y-1.5 list-decimal list-inside text-slate-600 dark:text-slate-300">
                      {item.steps.map((st, i) => (
                        <li key={i} className="leading-snug pl-1">
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                    <span className="font-semibold text-slate-900 dark:text-white">Defensive Impact: </span>
                    <span className="text-slate-500">{item.impact}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
