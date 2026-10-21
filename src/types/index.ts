/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi';

export type Theme = 'light' | 'dark';

export type AuditStatus = 'reviewed' | 'needs_attention' | 'not_applicable' | 'not_checked';

export type SeverityLevel = 'informational' | 'caution' | 'high';

export interface AuditItem {
  id: string;
  category: string;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDescription: string;
  whyItMatters: string;
  platformInstructions: {
    ios?: string;
    android?: string;
    web?: string;
    windowsMac?: string;
  };
  severity: SeverityLevel;
  status: AuditStatus;
  userNotes?: string;
}

export interface BoundingBox {
  ymin: number; // 0 to 1000 scale
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface ScanFinding {
  id: string;
  category: 'email' | 'phone' | 'address' | 'name' | 'id_number' | 'financial' | 'auth_credential' | 'location_metadata' | 'other';
  label: string;
  value: string;
  maskedValue: string;
  confidence: number; // 0 to 100
  severity: SeverityLevel;
  bbox?: BoundingBox;
  reason: string;
  status: 'active' | 'redacted' | 'dismissed' | 'confirmed';
  dismissReason?: string;
}

export interface ScannedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  isSynthetic: boolean;
  dataUrl: string; // for canvas rendering
  findings: ScanFinding[];
  redactedDataUrl?: string;
  redactedAt?: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  shareContext?: ShareContext;
}

export type ShareContext = 'public_social' | 'job_application' | 'marketplace' | 'school_submission' | 'customer_support';

export interface ActionTask {
  id: string;
  title: string;
  category: string;
  priority: 'fix_now' | 'review_soon' | 'optional';
  effort: '2 min' | '5 min' | '10 min' | '15 min' | '30 min';
  instruction: string;
  completed: boolean;
  dismissed: boolean;
  dismissReason?: string;
  sourceType: 'audit' | 'scan' | 'exposure' | 'custom';
  sourceId?: string;
}

export interface ExposureNode {
  id: string;
  label: string;
  category: 'data_type' | 'service' | 'context' | 'risk';
  severity?: SeverityLevel;
  description: string;
  recommendation: string;
  active: boolean;
}

export interface ExposureEdge {
  id: string;
  source: string;
  target: string;
  reason: string;
}

export interface CombinationScenario {
  id: string;
  title: string;
  description: string;
  dataPoints: string[];
  reidentificationRisk: number; // 0 to 100 percentage
  explanation: string;
  realWorldImpact: string;
  defensiveAction: string;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}
