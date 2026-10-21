/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditItem } from '../types';

export const initialAuditItems: AuditItem[] = [
  {
    id: 'audit-perm-1',
    category: 'App Permissions',
    titleKey: 'perm_bg_location',
    defaultTitle: 'Background Location Access on Mobile Apps',
    descriptionKey: 'perm_bg_location_desc',
    defaultDescription: 'Audit which non-navigation apps have constant ("Always") access to your real-time physical GPS coordinates.',
    whyItMatters: 'Constant location tracking enables third-party ad networks to reconstruct your daily movement habits, workplace, home address, and medical visits.',
    platformInstructions: {
      ios: 'Go to Settings > Privacy & Security > Location Services. Review apps and switch non-essential apps from "Always" to "While Using" or "Never", and turn off "Precise Location".',
      android: 'Go to Settings > Location > App location permissions. Set non-essential apps to "Allow only while using the app" or "Don\'t allow".',
      web: 'In Chrome/Safari, check Settings > Privacy and Security > Site Settings > Location, and set default behavior to "Don\'t allow sites to see your location".'
    },
    severity: 'high',
    status: 'needs_attention',
  },
  {
    id: 'audit-perm-2',
    category: 'App Permissions',
    titleKey: 'perm_mic_cam',
    defaultTitle: 'Camera & Microphone Hardware Access',
    descriptionKey: 'perm_mic_cam_desc',
    defaultDescription: 'Check installed social, game, and utility apps that request permanent microphone or camera rights.',
    whyItMatters: 'Unrestricted camera/mic access can lead to unintended audio captures or video recordings in the background.',
    platformInstructions: {
      ios: 'Settings > Privacy & Security > Microphone and Camera. Toggle off any utility, game, or calculator app that has no legitimate audio/video requirement.',
      android: 'Settings > Privacy > Permission manager > Microphone / Camera. Revoke rights for inactive or non-media apps.'
    },
    severity: 'caution',
    status: 'reviewed',
  },
  {
    id: 'audit-social-1',
    category: 'Public Social Profiles',
    titleKey: 'social_search_index',
    defaultTitle: 'Search Engine Indexing of Social Profiles',
    descriptionKey: 'social_search_index_desc',
    defaultDescription: 'Ensure search engines (Google, Bing) do not directly index your full personal profiles or friend lists.',
    whyItMatters: 'Publicly indexed profiles allow recruiters, scammers, and scraping bots to automatically harvest your full name, bio, and associated accounts without logging in.',
    platformInstructions: {
      web: 'Facebook: Settings & Privacy > Settings > How people find and contact you > Turn off "Do you want search engines outside of Facebook to link to your profile?". LinkedIn: Settings > Visibility > Edit your public profile > Turn off Public visibility slider.'
    },
    severity: 'caution',
    status: 'needs_attention',
  },
  {
    id: 'audit-social-2',
    category: 'Public Social Profiles',
    titleKey: 'social_bio_leakage',
    defaultTitle: 'Bio Details & Contact Exposure',
    descriptionKey: 'social_bio_leakage_desc',
    defaultDescription: 'Review whether your bio publicly displays your personal phone number, primary personal email, or specific workplace.',
    whyItMatters: 'Publicly visible phone numbers and work emails on Instagram, X, or TikTok facilitate targeted SIM-swapping, spear-phishing, and harassment campaigns.',
    platformInstructions: {
      web: 'Check your public bios on Instagram, X, LinkedIn, and GitHub. Replace direct personal cell numbers with a burner or alias email.'
    },
    severity: 'high',
    status: 'not_checked',
  },
  {
    id: 'audit-loc-1',
    category: 'Location Sharing',
    titleKey: 'loc_live_sharing',
    defaultTitle: 'Permanent Live Location Sharing in Maps',
    descriptionKey: 'loc_live_sharing_desc',
    defaultDescription: 'Review active contacts with whom you share permanent real-time location in Google Maps, Apple Find My, or WhatsApp.',
    whyItMatters: 'Users frequently forget that an ex-partner, acquaintance, or former roommate was granted indefinite access to their live location.',
    platformInstructions: {
      ios: 'Open Find My app > People tab. Review each listed contact. Tap any obsolete contact and tap "Stop Sharing My Location".',
      android: 'Open Google Maps > Tap your profile icon > "Location sharing". Review the list of users who can see your real-time location.'
    },
    severity: 'high',
    status: 'needs_attention',
  },
  {
    id: 'audit-loc-2',
    category: 'Location Sharing',
    titleKey: 'loc_photo_exif',
    defaultTitle: 'Embedded GPS Coordinates in Shared Photos',
    descriptionKey: 'loc_photo_exif_desc',
    defaultDescription: 'Prevent smartphone cameras from embedding latitude and longitude tags into photo metadata before sharing original files.',
    whyItMatters: 'Original photos emailed, shared via AirDrop, or uploaded to forums can contain your home\'s exact GPS coordinates within EXIF headers.',
    platformInstructions: {
      ios: 'Settings > Privacy & Security > Location Services > Camera > Select "Never". Or in the Photos app when sharing, tap "Options" at top and turn off "All Photos Data / Location".',
      android: 'Open Camera app > Settings gear > Turn off "Save location" / "Location tags".'
    },
    severity: 'caution',
    status: 'reviewed',
  },
  {
    id: 'audit-mfa-1',
    category: 'Multi-Factor Authentication',
    titleKey: 'mfa_authenticator_app',
    defaultTitle: 'Time-Based Authenticator App vs Insecure SMS',
    descriptionKey: 'mfa_authenticator_app_desc',
    defaultDescription: 'Upgrade from SMS text message 2FA codes to an Authenticator app (e.g. Aegis, 2FAS, Google Authenticator) or hardware Passkeys.',
    whyItMatters: 'SMS text messages can be intercepted through telecom SIM-swapping, social engineering, or carrier port-out fraud.',
    platformInstructions: {
      web: 'Log into primary accounts (Google, Apple ID, Microsoft, banking, email). Under Security > 2-Step Verification, select "Authenticator app" or "Security Key / Passkey" as the primary method.'
    },
    severity: 'high',
    status: 'reviewed',
  },
  {
    id: 'audit-mfa-2',
    category: 'Multi-Factor Authentication',
    titleKey: 'mfa_backup_codes',
    defaultTitle: 'Offline Backup Recovery Codes Safekeeping',
    descriptionKey: 'mfa_backup_codes_desc',
    defaultDescription: 'Confirm one-time emergency recovery codes are generated and stored offline in a secure password vault, not in unencrypted cloud notes.',
    whyItMatters: 'If you lose your device, lack of backup codes can permanently lock you out of your digital life or force vulnerable account recovery flows.',
    platformInstructions: {
      web: 'In your Google, Apple ID, and GitHub security settings, download the 10 emergency single-use codes and store them inside an encrypted password manager (1Password, Bitwarden) or printed in a physical safe.'
    },
    severity: 'caution',
    status: 'not_checked',
  },
  {
    id: 'audit-rec-1',
    category: 'Account Recovery',
    titleKey: 'rec_security_questions',
    defaultTitle: 'Predictable Security Questions Removal',
    descriptionKey: 'rec_security_questions_desc',
    defaultDescription: 'Eliminate or falsify answers to "mother\'s maiden name", "first pet", or "high school mascot" on legacy accounts.',
    whyItMatters: 'Answers to standard security questions are easily discoverable on social media, public voter registries, or high school yearbooks.',
    platformInstructions: {
      web: 'If a bank or older portal mandates security questions, treat the answer like a random password: generate a unique 20-character passphrase and save it in your password manager.'
    },
    severity: 'high',
    status: 'needs_attention',
  },
  {
    id: 'audit-old-1',
    category: 'Forgotten / Zombie Accounts',
    titleKey: 'old_dormant_accounts',
    defaultTitle: 'Audit & Close Inactive Online Services',
    descriptionKey: 'old_dormant_accounts_desc',
    defaultDescription: 'Identify old accounts created years ago on abandoned shopping, forum, or gaming sites that still hold your email and password.',
    whyItMatters: 'Forgotten databases are prime targets for credential stuffing and credential stuffing lists sold in data dumps.',
    platformInstructions: {
      web: 'Search your email inbox for keywords: "Welcome to", "Verify your account", "Confirm registration". Visit dormant accounts and submit an official account deletion request (GDPR/CCPA "Delete My Data").'
    },
    severity: 'caution',
    status: 'not_checked',
  },
  {
    id: 'audit-browser-1',
    category: 'Browser & Tracking Privacy',
    titleKey: 'browser_tracking_dns',
    defaultTitle: 'Encrypted DNS over HTTPS & Anti-Tracking',
    descriptionKey: 'browser_tracking_dns_desc',
    defaultDescription: 'Enable DNS over HTTPS (DoH) to prevent your internet service provider (ISP) from logging every domain you visit.',
    whyItMatters: 'Unencrypted standard DNS sends every web address query in plain text across your local network and ISP routing nodes.',
    platformInstructions: {
      web: 'Chrome: Settings > Privacy and Security > Security > "Use secure DNS" > Select Cloudflare (1.1.1.1) or NextDNS. Firefox: Settings > Privacy & Security > DNS over HTTPS > Increased Protection.',
      ios: 'Settings > Wi-Fi > Tap current network > Configure DNS > Choose custom privacy resolver or install an encrypted DNS profile.'
    },
    severity: 'informational',
    status: 'reviewed',
  },
  {
    id: 'audit-files-1',
    category: 'File & Cloud Sharing Permissions',
    titleKey: 'files_public_link_sharing',
    defaultTitle: 'Revoke "Anyone with the Link Can Edit/View" Cloud Links',
    descriptionKey: 'files_public_link_sharing_desc',
    defaultDescription: 'Inspect Google Drive, OneDrive, and Dropbox folders for old links left open to the entire public internet.',
    whyItMatters: 'Links set to "Anyone with the link" can get leaked via shared chat histories, web referrers, or link crawlers, exposing personal tax returns or IDs.',
    platformInstructions: {
      web: 'Google Drive: Type "to:me" or search files, right click > Share > General access > Change from "Anyone with the link" back to "Restricted". OneDrive: Manage access > Delete sharing links.'
    },
    severity: 'high',
    status: 'needs_attention',
  },
  {
    id: 'audit-device-1',
    category: 'Device OS & Firmware Updates',
    titleKey: 'device_rapid_security_patches',
    defaultTitle: 'Automatic Security Patches & Zero-Day Updates',
    descriptionKey: 'device_rapid_security_patches_desc',
    defaultDescription: 'Ensure OS security responses (iOS Rapid Security Responses, Android monthly security patches) install automatically.',
    whyItMatters: 'Vulnerabilities in web rendering engines (WebKit, Chromium) are routinely patched against zero-click spyware vectors.',
    platformInstructions: {
      ios: 'Settings > General > Software Update > Automatic Updates > Turn on "Security Responses & System Files".',
      android: 'Settings > Security & privacy > Updates > Google Play system update > Check for updates.'
    },
    severity: 'caution',
    status: 'reviewed',
  },
  {
    id: 'audit-broker-1',
    category: 'Personal Information Visibility',
    titleKey: 'broker_public_registry',
    defaultTitle: 'Opt-Out from Commercial People-Search Directories',
    descriptionKey: 'broker_public_registry_desc',
    defaultDescription: 'Remove your phone number, home address, and relative names from public aggregator sites like Whitepages, FastPeopleSearch, and Truecaller.',
    whyItMatters: 'Data brokers aggregate court records, real estate deeds, and warranty registrations, making home addresses searchable by anyone with your phone number.',
    platformInstructions: {
      web: 'Visit the opt-out pages of major aggregators (e.g., Truecaller unlisting, Whitepages opt-out, FastPeopleSearch removal). Submit removal requests. Opt-outs are free under state and national privacy statutes.'
    },
    severity: 'high',
    status: 'not_checked',
  }
];
