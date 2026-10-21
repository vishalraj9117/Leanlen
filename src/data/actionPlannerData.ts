/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionTask } from '../types';

export const initialActionTasks: ActionTask[] = [
  {
    id: 'task-1',
    title: 'Migrate Primary 2FA from SMS to an Authenticator App',
    category: 'Authentication',
    priority: 'fix_now',
    effort: '5 min',
    instruction: 'Open your primary Google, Apple, or email security settings. Add an authenticator app (such as Google Authenticator, Aegis, or 1Password) and disable SMS verification to prevent SIM-swap attacks.',
    completed: false,
    dismissed: false,
    sourceType: 'audit',
    sourceId: 'audit-mfa-1'
  },
  {
    id: 'task-2',
    title: 'Revoke Inactive Mobile App Background Location Rights',
    category: 'Permissions',
    priority: 'fix_now',
    effort: '2 min',
    instruction: 'Go to mobile OS Settings > Privacy & Security > Location Services. Change all shopping, social, and food delivery apps from "Always" to "While Using" or "Never".',
    completed: false,
    dismissed: false,
    sourceType: 'audit',
    sourceId: 'audit-perm-1'
  },
  {
    id: 'task-3',
    title: 'Scrub Sensitive Account Identifier on Synthetic Utility Bill',
    category: 'Document Redaction',
    priority: 'fix_now',
    effort: '2 min',
    instruction: 'Open the Redaction Studio and permanently black out utility account #9041-8823-11 and home address before sharing as proof of residency.',
    completed: false,
    dismissed: false,
    sourceType: 'scan',
    sourceId: 'f-bill-2'
  },
  {
    id: 'task-4',
    title: 'Turn Off Search Engine Indexing for Social Profiles',
    category: 'Social Privacy',
    priority: 'review_soon',
    effort: '5 min',
    instruction: 'In Facebook and LinkedIn privacy settings, disable the toggle allowing external search engines (Google, Bing) to link to your profile.',
    completed: false,
    dismissed: false,
    sourceType: 'audit',
    sourceId: 'audit-social-1'
  },
  {
    id: 'task-5',
    title: 'Audit Google Drive & Dropbox "Anyone with link" Permissions',
    category: 'Cloud Storage',
    priority: 'review_soon',
    effort: '15 min',
    instruction: 'Search your Google Drive for "to:me" or review shared links. Change public access on sensitive financial, tax, or lease documents back to "Restricted".',
    completed: false,
    dismissed: false,
    sourceType: 'audit',
    sourceId: 'audit-files-1'
  },
  {
    id: 'task-6',
    title: 'Submit Opt-Out Requests to Top 3 People Search Brokers',
    category: 'Public Visibility',
    priority: 'review_soon',
    effort: '15 min',
    instruction: 'Visit the unlisting/opt-out pages of Whitepages, FastPeopleSearch, and Truecaller. Submit automated removal requests to decouple your phone number from your home street address.',
    completed: false,
    dismissed: false,
    sourceType: 'audit',
    sourceId: 'audit-broker-1'
  },
  {
    id: 'task-7',
    title: 'Enable Encrypted DNS (DNS over HTTPS) in Web Browser',
    category: 'Network Privacy',
    priority: 'optional',
    effort: '2 min',
    instruction: 'In Chrome/Brave/Firefox settings, enable Secure DNS using Cloudflare (1.1.1.1) or Quad9 to prevent ISP-level browsing query logging.',
    completed: true,
    dismissed: false,
    sourceType: 'audit',
    sourceId: 'audit-browser-1'
  },
  {
    id: 'task-8',
    title: 'Review Inactive Third-Party OAuth App Integrations',
    category: 'Account Safety',
    priority: 'optional',
    effort: '10 min',
    instruction: 'Visit myaccount.google.com/connections and appleid.apple.com to revoke permissions for third-party games, quiz apps, and obsolete services.',
    completed: false,
    dismissed: false,
    sourceType: 'audit'
  }
];
