/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExposureNode, ExposureEdge } from '../types';

export const initialExposureNodes: ExposureNode[] = [
  // Data Category Nodes
  {
    id: 'data-name',
    label: 'Legal Full Name',
    category: 'data_type',
    severity: 'informational',
    description: 'First and last name as recorded on official records and IDs.',
    recommendation: 'Use nicknames or first name + last initial on public social platforms.',
    active: true,
  },
  {
    id: 'data-address',
    label: 'Home Physical Address',
    category: 'data_type',
    severity: 'high',
    description: 'Exact street address, apartment number, and zip code.',
    recommendation: 'Never post utility statements, mail envelopes, or packages online. Redact before sharing proof of residency.',
    active: true,
  },
  {
    id: 'data-phone',
    label: 'Primary Phone Number',
    category: 'data_type',
    severity: 'high',
    description: 'Mobile phone number used for two-factor authentication and personal contact.',
    recommendation: 'Use a VoIP alias or secondary SIM for marketplace transactions and public postings.',
    active: true,
  },
  {
    id: 'data-location',
    label: 'Real-Time Location & Habits',
    category: 'data_type',
    severity: 'caution',
    description: 'GPS coordinates, live check-ins, routine gym/running routes.',
    recommendation: 'Post vacation photos after returning home; strip EXIF tags before uploading.',
    active: true,
  },
  {
    id: 'data-work',
    label: 'Workplace & Job Title',
    category: 'data_type',
    severity: 'informational',
    description: 'Current employer, office building, department, internal title.',
    recommendation: 'Keep company details on professional networks (LinkedIn); avoid wearing company badges in public photos.',
    active: true,
  },

  // Service / Platform Nodes
  {
    id: 'service-social',
    label: 'Public Social Media',
    category: 'service',
    severity: 'caution',
    description: 'Instagram, X, Facebook, TikTok with public or semi-public visibility.',
    recommendation: 'Switch account to private or regularly review follower lists and public bio data.',
    active: true,
  },
  {
    id: 'service-marketplace',
    label: 'Peer-to-Peer Marketplaces',
    category: 'service',
    severity: 'caution',
    description: 'Online classifieds, Craigslist, Facebook Marketplace, OfferUp.',
    recommendation: 'Use in-app messaging instead of cell numbers; arrange meetups in designated public safe zones.',
    active: true,
  },
  {
    id: 'service-brokers',
    label: 'Commercial People-Search Brokers',
    category: 'service',
    severity: 'high',
    description: 'Public record aggregators, reverse-lookup directories, warranty registries.',
    recommendation: 'Submit free opt-out and unlisting requests to top 10 commercial brokers.',
    active: true,
  },
  {
    id: 'service-cloud',
    label: 'Cloud Storage & File Sharing',
    category: 'service',
    severity: 'caution',
    description: 'Google Drive, Dropbox, iCloud shared links.',
    recommendation: 'Review expired sharing links; set permissions to "Restricted" rather than "Anyone with the link".',
    active: true,
  },

  // Context Nodes
  {
    id: 'context-unredacted-doc',
    label: 'Unredacted Document Upload',
    category: 'context',
    severity: 'high',
    description: 'Posting or attaching raw bills, boarding passes, or lease agreements.',
    recommendation: 'Always run through LeakLens Redaction Studio to irreversibly black out account numbers.',
    active: true,
  },
  {
    id: 'context-live-checkin',
    label: 'Live Vacation or Commute Post',
    category: 'context',
    severity: 'caution',
    description: 'Announcing that home is currently unoccupied or sharing standard daily commute times.',
    recommendation: 'Delay posts by 24–48 hours until you have left the venue or returned home.',
    active: true,
  },

  // Threat / Risk Nodes
  {
    id: 'risk-doxxing',
    label: 'Targeted Doxxing & Harassment',
    category: 'risk',
    severity: 'high',
    description: 'Malicious actors compiling your real home address, relatives, and workplace to intimidate or harass.',
    recommendation: 'Remove address from people search directories and unlist personal phone numbers.',
    active: true,
  },
  {
    id: 'risk-sim-swap',
    label: 'SIM-Swapping & Account Takeover',
    category: 'risk',
    severity: 'high',
    description: 'Fraudsters social-engineering your phone carrier to transfer your phone number to their SIM.',
    recommendation: 'Add a carrier port-freeze PIN; migrate sensitive 2FA from SMS to an Authenticator app.',
    active: true,
  },
  {
    id: 'risk-spear-phishing',
    label: 'Convincing Spear-Phishing',
    category: 'risk',
    severity: 'high',
    description: 'Tailored phishing emails citing your actual employer, recent flights, or utility account details.',
    recommendation: 'Be skeptical of unexpected emails quoting authentic account identifiers; verify via official portals.',
    active: true,
  },
  {
    id: 'risk-burglary',
    label: 'Physical Home Burglary Risk',
    category: 'risk',
    severity: 'caution',
    description: 'Broadcasting vacation travel while your home address is discoverable online.',
    recommendation: 'Never post flight tickets or real-time vacation updates on public social media.',
    active: true,
  }
];

export const initialExposureEdges: ExposureEdge[] = [
  // Links from Data to Services/Contexts
  { id: 'e1', source: 'data-name', target: 'service-social', reason: 'Real name exposed on public account' },
  { id: 'e2', source: 'data-address', target: 'service-brokers', reason: 'Public real estate records aggregated by brokers' },
  { id: 'e3', source: 'data-phone', target: 'service-marketplace', reason: 'Shared with buyers in marketplace chat' },
  { id: 'e4', source: 'data-location', target: 'context-live-checkin', reason: 'Check-in exposes current physical absence from home' },
  { id: 'e5', source: 'data-work', target: 'service-social', reason: 'Company lanyard or bio mentions workplace' },

  // Links from Services/Contexts to Risks
  { id: 'e6', source: 'service-brokers', target: 'risk-doxxing', reason: 'Enables reverse-lookup from name or phone to home street address' },
  { id: 'e7', source: 'data-phone', target: 'risk-sim-swap', reason: 'Primary mobile number used as account recovery SMS channel' },
  { id: 'e8', source: 'context-unredacted-doc', target: 'risk-spear-phishing', reason: 'Reveals legitimate account numbers and billing provider' },
  { id: 'e9', source: 'context-live-checkin', target: 'risk-burglary', reason: 'Signals home is empty when address is known' },
  { id: 'e10', source: 'service-marketplace', target: 'risk-sim-swap', reason: 'Unverified buyers can look up carrier details' },
  { id: 'e11', source: 'service-cloud', target: 'risk-spear-phishing', reason: 'Open drive links reveal tax and travel documents' },
  { id: 'e12', source: 'data-name', target: 'risk-doxxing', reason: 'Core anchor for search engine cross-referencing' }
];
