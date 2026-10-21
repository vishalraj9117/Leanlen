/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LeakLens ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-900/60 shadow-xs text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {this.props.fallbackTitle || 'Component Error Recovered'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              A view encountered an unexpected issue. Your session data remains preserved in local storage.
            </p>
          </div>

          {this.state.error?.message && (
            <div className="text-[11px] font-mono text-rose-700 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/40 p-2.5 rounded border border-rose-200/60 dark:border-rose-800/60 text-left overflow-x-auto">
              {this.state.error.message}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-md transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
