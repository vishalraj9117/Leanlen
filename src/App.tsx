/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ToastContainer } from './components/common/ToastContainer';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { PrivacyAuditView } from './components/audit/PrivacyAuditView';
import { FileScannerView } from './components/scanner/FileScannerView';
import { RedactionStudioView } from './components/redaction/RedactionStudioView';
import { ExposureMapView } from './components/exposure/ExposureMapView';
import { CombinationCheckView } from './components/combination/CombinationCheckView';
import { ShareCheckView } from './components/share/ShareCheckView';
import { ActionPlannerView } from './components/planner/ActionPlannerView';
import { BrowserAccountGuideView } from './components/guide/BrowserAccountGuideView';
import { PrivacyReportView } from './components/report/PrivacyReportView';
import { DataRetentionView } from './components/settings/DataRetentionView';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const AppContent: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Persistent Left Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area (Offset for 240px Sidebar on Desktop) */}
      <div className="lg:pl-60 flex-1 flex flex-col min-w-0">
        {/* Minimal Top Header */}
        <TopHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Workspace Canvas Viewport */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ErrorBoundary>
            {currentTab === 'overview' && <OverviewDashboard />}
            {currentTab === 'audit' && <PrivacyAuditView />}
            {currentTab === 'scanner' && <FileScannerView />}
            {currentTab === 'redaction' && <RedactionStudioView />}
            {currentTab === 'exposure' && <ExposureMapView />}
            {currentTab === 'combination' && <CombinationCheckView />}
            {currentTab === 'share' && <ShareCheckView />}
            {currentTab === 'planner' && <ActionPlannerView />}
            {currentTab === 'reports' && <PrivacyReportView />}
            {currentTab === 'guide' && <BrowserAccountGuideView />}
            {currentTab === 'settings' && <DataRetentionView />}
          </ErrorBoundary>
        </main>

        {/* Quiet Minimal Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 px-6 text-[11px] text-slate-400 print:hidden transition-colors">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-300">LeakLens</span>
              <span> · Defensive Cybersecurity &amp; Personal Privacy Management Suite</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTab('guide')}
                className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Guides
              </button>
              <span>·</span>
              <button
                onClick={() => setCurrentTab('settings')}
                className="hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                Data Policy
              </button>
            </div>
          </div>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
