/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Plus,
  CheckCircle2,
  X,
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { ActionTask } from '../../types';

export const ActionPlannerView: React.FC = () => {
  const {
    language,
    actionTasks,
    toggleTaskCompletion,
    dismissTask,
    addNewTask,
    addToast,
  } = useApp();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'fix_now' | 'review_soon' | 'optional'>('fix_now');
  const [filterState, setFilterState] = useState<'all' | 'active' | 'completed'>('active');

  // Add custom task modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Account Security');
  const [newPriority, setNewPriority] = useState<'fix_now' | 'review_soon' | 'optional'>('fix_now');
  const [newEffort, setNewEffort] = useState<'2 min' | '5 min' | '10 min' | '15 min' | '30 min'>('5 min');
  const [newInstruction, setNewInstruction] = useState('');

  // Dismiss reason prompt modal
  const [dismissTaskId, setDismissTaskId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState('');

  const completedCount = actionTasks.filter((t) => t.completed).length;
  const activeCount = actionTasks.filter((t) => !t.completed && !t.dismissed).length;
  const progressPercent = actionTasks.length > 0 ? Math.round((completedCount / actionTasks.length) * 100) : 0;

  const currentTabTasks = actionTasks.filter((task) => {
    if (task.dismissed) return false;
    if (task.priority !== activeTab) return false;
    if (filterState === 'active') return !task.completed;
    if (filterState === 'completed') return task.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Please provide a task title', 'error');
      return;
    }
    addNewTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      effort: newEffort,
      instruction: newInstruction.trim() || 'Review and apply privacy settings on this account.',
      sourceType: 'custom',
    });
    setIsModalOpen(false);
    setNewTitle('');
    setNewInstruction('');
  };

  const handleConfirmDismiss = () => {
    if (!dismissTaskId) return;
    dismissTask(dismissTaskId, dismissReason || 'User accepted risk');
    setDismissTaskId(null);
    setDismissReason('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Privacy Action Planner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prioritized defensive tasks derived from your privacy audit answers and scanned document findings.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Progress & Status Strip */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-slate-400">Completed:</span>{' '}
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {completedCount} / {actionTasks.length}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Pending:</span>{' '}
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {activeCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-60">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-900 dark:bg-teal-500 h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-slate-500 text-[11px] tabular-nums shrink-0">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Priority Tabs & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Priority Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">
          <button
            onClick={() => setActiveTab('fix_now')}
            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeTab === 'fix_now'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Fix Now ({actionTasks.filter((t) => t.priority === 'fix_now' && !t.dismissed && !t.completed).length})
          </button>

          <button
            onClick={() => setActiveTab('review_soon')}
            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeTab === 'review_soon'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Review Soon ({actionTasks.filter((t) => t.priority === 'review_soon' && !t.dismissed && !t.completed).length})
          </button>

          <button
            onClick={() => setActiveTab('optional')}
            className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition ${
              activeTab === 'optional'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Optional ({actionTasks.filter((t) => t.priority === 'optional' && !t.dismissed && !t.completed).length})
          </button>
        </div>

        {/* State filter: Pending / Done / All */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterState('active')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              filterState === 'active'
                ? 'bg-slate-200 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterState('completed')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              filterState === 'completed'
                ? 'bg-slate-200 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Done
          </button>
          <button
            onClick={() => setFilterState('all')}
            className={`px-2.5 py-1 rounded cursor-pointer transition ${
              filterState === 'all'
                ? 'bg-slate-200 dark:bg-slate-700 font-semibold text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Task List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {currentTabTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No tasks in this section.
          </div>
        ) : (
          currentTabTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 flex items-start justify-between gap-3 text-xs transition ${
                task.completed
                  ? 'bg-slate-50/50 dark:bg-slate-800/20 opacity-50'
                  : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                {/* Checkbox */}
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className={`w-4 h-4 rounded-xs mt-0.5 flex items-center justify-center border transition cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-teal-600 dark:border-teal-600'
                      : 'border-slate-300 dark:border-slate-600 hover:border-slate-400'
                  }`}
                  title={task.completed ? 'Mark incomplete' : 'Mark done'}
                >
                  {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">
                      {task.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      · {task.effort}
                    </span>
                  </div>

                  <div
                    className={`font-semibold ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </div>

                  <p className="text-slate-500 leading-snug">
                    {task.instruction}
                  </p>
                </div>
              </div>

              {/* Dismiss Action */}
              <button
                onClick={() => setDismissTaskId(task.id)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer shrink-0"
                title="Dismiss task"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-md w-full p-5 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Add Privacy Task
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Set up hardware passkey on primary email"
                  className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="fix_now">Fix Now</option>
                    <option value="review_soon">Review Soon</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Effort
                  </label>
                  <select
                    value={newEffort}
                    onChange={(e: any) => setNewEffort(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="2 min">2 min</option>
                    <option value="5 min">5 min</option>
                    <option value="10 min">10 min</option>
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Instruction
                </label>
                <textarea
                  rows={2}
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  placeholder="Specific configuration URL or steps to follow..."
                  className="w-full p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-teal-600 text-white font-semibold rounded cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dismiss Reason Modal */}
      {dismissTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-sm w-full p-5 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
              Dismiss Task
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Optionally state why this task is being dismissed:
            </p>
            <input
              type="text"
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="e.g. Handled by organization policy, or accepted risk"
              className="w-full text-xs p-2 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDismissTaskId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDismiss}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 rounded cursor-pointer"
              >
                Dismiss Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
