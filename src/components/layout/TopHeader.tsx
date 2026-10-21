/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, Globe, Sun, Moon, ShieldAlert, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';

interface TopHeaderProps {
  onOpenSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenSidebar }) => {
  const { language, setLanguage, theme, setTheme, currentTab } = useApp();
  const t = useTranslation(language);

  // Map currentTab to human-readable breadcrumb label
  const breadcrumbLabels: Record<string, string> = {
    overview: t.navOverview,
    audit: t.navAudit,
    scanner: t.navScanner,
    redaction: t.navRedaction,
    exposure: t.navExposureMap,
    combination: t.navCombination,
    share: t.navShareCheck,
    planner: t.navPlanner,
    reports: t.navReports,
    guide: t.navGuide,
    settings: t.navSettings,
  };

  const currentLabel = breadcrumbLabels[currentTab] || t.navOverview;

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium hidden sm:inline">
            LeakLens
          </span>
          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-900 dark:text-white font-semibold">
            {currentLabel}
          </span>
        </div>
      </div>

      {/* Right: Environment Info, Language & Theme Controls */}
      <div className="flex items-center gap-3">
        {/* Environment Indicator Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-400">Mode:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Isolated Client Session
          </span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          aria-label="Switch interface language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <span>{language === 'en' ? 'EN' : 'हिन्दी'}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          aria-label={t.toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>
      </div>
    </header>
  );
};
