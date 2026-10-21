/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Theme,
  AuditItem,
  AuditStatus,
  ScannedFile,
  ScanFinding,
  ActionTask,
  ExposureNode,
  ExposureEdge,
  ToastMessage,
} from '../types';
import { initialAuditItems } from '../data/auditQuestions';
import { preloadedSyntheticFiles } from '../data/syntheticDemoData';
import { initialExposureNodes, initialExposureEdges } from '../data/exposureMapData';
import { initialActionTasks } from '../data/actionPlannerData';

export type TabKey =
  | 'overview'
  | 'audit'
  | 'scanner'
  | 'redaction'
  | 'exposure'
  | 'combination'
  | 'share'
  | 'planner'
  | 'guide'
  | 'reports'
  | 'settings';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentTab: TabKey;
  setCurrentTab: (tab: TabKey) => void;

  // Audit
  auditItems: AuditItem[];
  updateAuditStatus: (id: string, status: AuditStatus, notes?: string) => void;
  addAuditItemToPlanner: (item: AuditItem) => void;

  // Scanner & Redaction
  scannedFiles: ScannedFile[];
  activeFileId: string;
  setActiveFileId: (id: string) => void;
  activeFile: ScannedFile | undefined;
  addScannedFile: (file: ScannedFile) => void;
  deleteScannedFile: (id: string) => void;
  updateFindingStatus: (fileId: string, findingId: string, status: 'active' | 'confirmed' | 'dismissed' | 'redacted', reason?: string) => void;
  updateFindingLabel: (fileId: string, findingId: string, label: string, category: any) => void;
  saveRedactedFile: (fileId: string, redactedDataUrl: string) => void;

  // Action Planner
  actionTasks: ActionTask[];
  toggleTaskCompletion: (id: string) => void;
  dismissTask: (id: string, reason?: string) => void;
  addNewTask: (task: Omit<ActionTask, 'id' | 'completed' | 'dismissed'>) => void;

  // Exposure Map
  exposureNodes: ExposureNode[];
  exposureEdges: ExposureEdge[];
  toggleExposureNode: (id: string) => void;

  // Global Metrics
  privacyScore: number;
  auditedCount: number;
  needsAttentionCount: number;
  sensitiveFindingsCount: number;
  redactedCount: number;
  openTasksCount: number;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Reset
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANG: 'leaklens_lang',
  THEME: 'leaklens_theme',
  AUDIT: 'leaklens_audit_items',
  FILES: 'leaklens_scanned_files',
  TASKS: 'leaklens_tasks',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // 2. Theme
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 3. Navigation
  const [currentTab, setCurrentTab] = useState<TabKey>('overview');

  // 4. Audit Items
  const [auditItems, setAuditItems] = useState<AuditItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : initialAuditItems;
    } catch {
      return initialAuditItems;
    }
  });

  const updateAuditStatus = (id: string, status: AuditStatus, notes?: string) => {
    setAuditItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, status, userNotes: notes !== undefined ? notes : item.userNotes } : item
      );
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
      return updated;
    });

    // If marked "needs_attention", ensure an action task is present
    if (status === 'needs_attention') {
      const target = auditItems.find((a) => a.id === id);
      if (target) {
        setActionTasks((tasks) => {
          if (tasks.some((t) => t.sourceId === id)) return tasks;
          const newTask: ActionTask = {
            id: `task-audit-${id}-${Date.now()}`,
            title: `Remediate: ${target.defaultTitle}`,
            category: target.category,
            priority: target.severity === 'high' ? 'fix_now' : 'review_soon',
            effort: '5 min',
            instruction: target.platformInstructions.ios || target.platformInstructions.web || target.whyItMatters,
            completed: false,
            dismissed: false,
            sourceType: 'audit',
            sourceId: id,
          };
          const nextTasks = [newTask, ...tasks];
          localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(nextTasks));
          return nextTasks;
        });
      }
    }
  };

  const addAuditItemToPlanner = (item: AuditItem) => {
    setActionTasks((tasks) => {
      if (tasks.some((t) => t.sourceId === item.id)) {
        addToast('Task already exists in your Action Planner', 'info');
        return tasks;
      }
      const newTask: ActionTask = {
        id: `task-audit-${item.id}-${Date.now()}`,
        title: item.defaultTitle,
        category: item.category,
        priority: item.severity === 'high' ? 'fix_now' : 'review_soon',
        effort: '10 min',
        instruction: item.platformInstructions.web || item.whyItMatters,
        completed: false,
        dismissed: false,
        sourceType: 'audit',
        sourceId: item.id,
      };
      const nextTasks = [newTask, ...tasks];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(nextTasks));
      addToast('Added to Action Planner', 'success');
      return nextTasks;
    });
  };

  // 5. Scanned Files
  const [scannedFiles, setScannedFiles] = useState<ScannedFile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FILES);
      return saved ? JSON.parse(saved) : preloadedSyntheticFiles;
    } catch {
      return preloadedSyntheticFiles;
    }
  });

  const [activeFileId, setActiveFileId] = useState<string>(() => {
    return scannedFiles[0]?.id || 'sample-utility-bill';
  });

  const activeFile = scannedFiles.find((f) => f.id === activeFileId) || scannedFiles[0];

  const addScannedFile = (newFile: ScannedFile) => {
    setScannedFiles((prev) => {
      const updated = [newFile, ...prev];
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updated));
      return updated;
    });
    setActiveFileId(newFile.id);
  };

  const deleteScannedFile = (id: string) => {
    setScannedFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updated));
      return updated;
    });
    if (activeFileId === id) {
      const remaining = scannedFiles.filter((f) => f.id !== id);
      if (remaining.length > 0) {
        setActiveFileId(remaining[0].id);
      }
    }
    addToast('File purged from session', 'info');
  };

  const updateFindingStatus = (
    fileId: string,
    findingId: string,
    status: 'active' | 'confirmed' | 'dismissed' | 'redacted',
    reason?: string
  ) => {
    setScannedFiles((prev) => {
      const updated = prev.map((file) => {
        if (file.id !== fileId) return file;
        const findings = file.findings || [];
        const newFindings = findings.map((finding) =>
          finding.id === findingId ? { ...finding, status, dismissReason: reason } : finding
        );
        return { ...file, findings: newFindings };
      });
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updated));
      return updated;
    });
  };

  const updateFindingLabel = (fileId: string, findingId: string, label: string, category: any) => {
    setScannedFiles((prev) => {
      const updated = prev.map((file) => {
        if (file.id !== fileId) return file;
        const findings = file.findings || [];
        const newFindings = findings.map((finding) =>
          finding.id === findingId ? { ...finding, label, category } : finding
        );
        return { ...file, findings: newFindings };
      });
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updated));
      return updated;
    });
  };

  const saveRedactedFile = (fileId: string, redactedDataUrl: string) => {
    setScannedFiles((prev) => {
      const updated = prev.map((file) => {
        if (file.id !== fileId) return file;
        const findings = file.findings || [];
        return {
          ...file,
          redactedDataUrl,
          redactedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          findings: findings.map((f) => ({ ...f, status: 'redacted' as const })),
        };
      });
      localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(updated));
      return updated;
    });
  };

  // 6. Action Planner Tasks
  const [actionTasks, setActionTasks] = useState<ActionTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : initialActionTasks;
    } catch {
      return initialActionTasks;
    }
  });

  const toggleTaskCompletion = (id: string) => {
    setActionTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      return updated;
    });
  };

  const dismissTask = (id: string, reason?: string) => {
    setActionTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, dismissed: true, dismissReason: reason } : t));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      return updated;
    });
    addToast('Task dismissed', 'info');
  };

  const addNewTask = (task: Omit<ActionTask, 'id' | 'completed' | 'dismissed'>) => {
    const newTask: ActionTask = {
      ...task,
      id: `task-custom-${Date.now()}`,
      completed: false,
      dismissed: false,
    };
    setActionTasks((prev) => {
      const updated = [newTask, ...prev];
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
      return updated;
    });
    addToast('New action item added', 'success');
  };

  // 7. Exposure Map
  const [exposureNodes, setExposureNodes] = useState<ExposureNode[]>(initialExposureNodes);
  const [exposureEdges] = useState<ExposureEdge[]>(initialExposureEdges);

  const toggleExposureNode = (id: string) => {
    setExposureNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, active: !node.active } : node))
    );
  };

  // 8. Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 9. Metrics Calculation
  const auditedCount = auditItems.filter((i) => i.status !== 'not_checked').length;
  const needsAttentionCount = auditItems.filter((i) => i.status === 'needs_attention').length;

  const sensitiveFindingsCount = scannedFiles.reduce((acc, file) => {
    const findings = file.findings || [];
    const active = findings.filter((f) => f.status === 'active' || f.status === 'confirmed');
    return acc + active.length;
  }, 0);

  const redactedCount = scannedFiles.filter((f) => Boolean(f.redactedDataUrl)).length;
  const openTasksCount = actionTasks.filter((t) => !t.completed && !t.dismissed).length;

  // Privacy Score algorithm:
  // Base 100
  // Deduct 4 for every "needs_attention" audit item
  // Deduct 5 for each active unredacted finding
  // Add bonus +2 for completed tasks
  // Deduct 2 for open high priority tasks
  const computePrivacyScore = (): number => {
    let score = 88;
    score -= needsAttentionCount * 4;
    score -= Math.min(30, sensitiveFindingsCount * 4);
    score += actionTasks.filter((t) => t.completed).length * 2;
    score -= actionTasks.filter((t) => !t.completed && !t.dismissed && t.priority === 'fix_now').length * 2;
    return Math.max(10, Math.min(98, score));
  };

  const privacyScore = computePrivacyScore();

  // 10. Reset Demo Data
  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.AUDIT);
    localStorage.removeItem(STORAGE_KEYS.FILES);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    setAuditItems(initialAuditItems);
    setScannedFiles(preloadedSyntheticFiles);
    setActiveFileId('sample-utility-bill');
    setActionTasks(initialActionTasks);
    setExposureNodes(initialExposureNodes);
    addToast('Synthetic demo environment reset to pristine state', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        currentTab,
        setCurrentTab,
        auditItems,
        updateAuditStatus,
        addAuditItemToPlanner,
        scannedFiles,
        activeFileId,
        setActiveFileId,
        activeFile,
        addScannedFile,
        deleteScannedFile,
        updateFindingStatus,
        updateFindingLabel,
        saveRedactedFile,
        actionTasks,
        toggleTaskCompletion,
        dismissTask,
        addNewTask,
        exposureNodes,
        exposureEdges,
        toggleExposureNode,
        privacyScore,
        auditedCount,
        needsAttentionCount,
        sensitiveFindingsCount,
        redactedCount,
        openTasksCount,
        toasts,
        addToast,
        removeToast,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
