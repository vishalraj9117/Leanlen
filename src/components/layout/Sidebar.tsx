/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  FileSearch,
  Eraser,
  Network,
  Puzzle,
  Share2,
  CheckSquare,
  FileText,
  BookOpen,
  Settings,
  Shield,
  RotateCcw,
  X,
  User
} from 'lucide-react';
import { useApp, TabKey } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    language,
    currentTab,
    setCurrentTab,
    needsAttentionCount,
    sensitiveFindingsCount,
    openTasksCount,
    resetAllDemoData,
  } = useApp();
  const t = useTranslation(language);

  const navItems: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { key: 'overview', label: t.navOverview, icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      key: 'audit',
      label: t.navAudit,
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: needsAttentionCount > 0 ? needsAttentionCount : undefined,
      badgeColor: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800',
    },
    {
      key: 'scanner',
      label: t.navScanner,
      icon: <FileSearch className="w-4 h-4" />,
      badge: sensitiveFindingsCount > 0 ? sensitiveFindingsCount : undefined,
      badgeColor: 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
    },
    { key: 'redaction', label: t.navRedaction, icon: <Eraser className="w-4 h-4" /> },
    { key: 'exposure', label: t.navExposureMap, icon: <Network className="w-4 h-4" /> },
    { key: 'combination', label: t.navCombination, icon: <Puzzle className="w-4 h-4" /> },
    { key: 'share', label: t.navShareCheck, icon: <Share2 className="w-4 h-4" /> },
    {
      key: 'planner',
      label: t.navPlanner,
      icon: <CheckSquare className="w-4 h-4" />,
      badge: openTasksCount > 0 ? openTasksCount : undefined,
      badgeColor: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800',
    },
    { key: 'reports', label: t.navReports, icon: <FileText className="w-4 h-4" /> },
    { key: 'guide', label: t.navGuide, icon: <BookOpen className="w-4 h-4" /> },
    { key: 'settings', label: t.navSettings, icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavClick = (key: TabKey) => {
    setCurrentTab(key);
    onClose();
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-7 h-7 rounded-md bg-slate-900 dark:bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                LeakLens
              </span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-0.5">
                Privacy Suite
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Workspace
          </div>

          {navItems.map((item) => {
            const isActive = currentTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition cursor-pointer select-none ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={
                      isActive
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Session & Status Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  Security Operator
                </div>
                <div className="text-[10px] text-slate-400 truncate leading-tight">
                  Local Session
                </div>
              </div>
            </div>

            <button
              onClick={resetAllDemoData}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Reset synthetic demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
