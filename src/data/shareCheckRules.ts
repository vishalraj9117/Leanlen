/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShareContext } from '../types';

export interface ShareContextRule {
  id: ShareContext;
  name: string;
  badge: string;
  description: string;
  sensitiveMustRedact: string[];
  safeToInclude: string[];
  checks: {
    id: string;
    text: string;
    severity: 'high' | 'caution' | 'informational';
  }[];
  verdictAdvice: string;
}

export const shareContextRules: Record<ShareContext, ShareContextRule> = {
  public_social: {
    id: 'public_social',
    name: 'Public Social Media Post',
    badge: 'Open Web Visibility',
    description: 'Instagram, X, Facebook, TikTok, Reddit, or YouTube community post where anyone online can view the content.',
    sensitiveMustRedact: [
      'Home Street Address & Apartment Number',
      'Personal Phone Number',
      'Personal Email Address',
      'Flight Boarding Passes & Barcodes',
      'Car License Plate Numbers',
      'Work / School Badges & Lanyards',
      'Computer Screen reflections showing Slack / Internal systems'
    ],
    safeToInclude: [
      'General scenery (without street number markers)',
      'Public event badges (after removing attendee barcode/ID)',
      'First name or public social handle'
    ],
    checks: [
      { id: 'c1', text: 'No delivery boxes, utility bills, or mail envelopes visible in the background.', severity: 'high' },
      { id: 'c2', text: 'No reflections in mirrors or eyeglasses showing private passwords or screens.', severity: 'high' },
      { id: 'c3', text: 'Photo EXIF GPS location tags will be stripped before uploading.', severity: 'caution' },
      { id: 'c4', text: 'Does not announce that your home will be unoccupied for upcoming dates.', severity: 'caution' }
    ],
    verdictAdvice: 'Assume any data in a public social post will be scraped, archived on the Wayback Machine, and indexed by commercial search engines.'
  },
  job_application: {
    id: 'job_application',
    name: 'Job Application / Resume',
    badge: 'Recruiter & ATS Review',
    description: 'Submitting a resume, CV, or work portfolio to corporate recruiters, headhunters, or job portals.',
    sensitiveMustRedact: [
      'Full Home Street Address (City/State is sufficient)',
      'Date of Birth, Age, or Gender',
      'National ID / Social Security / Aadhaar numbers',
      'Marital Status or Family details',
      'References’ personal phone numbers without permission'
    ],
    safeToInclude: [
      'City, State/Country, and Postal Code',
      'Professional Email & LinkedIn URL',
      'Mobile Phone Number (VoIP or primary job-search number)',
      'Educational degrees, work history, and portfolio links'
    ],
    checks: [
      { id: 'c5', text: 'Exact street address replaced with "City, State" (e.g., "Chicago, IL").', severity: 'caution' },
      { id: 'c6', text: 'No government ID numbers or driver license details attached.', severity: 'high' },
      { id: 'c7', text: 'Document properties (Author name, internal revision history) scrubbed in PDF.', severity: 'informational' }
    ],
    verdictAdvice: 'Resumes are often forwarded through unencrypted emails and uploaded to third-party Applicant Tracking Systems (ATS) that may retain your data for years.'
  },
  marketplace: {
    id: 'marketplace',
    name: 'Online Marketplace Listing',
    badge: 'P2P Buyer & Seller Transaction',
    description: 'Selling items on Craigslist, Facebook Marketplace, eBay, OfferUp, or OLX.',
    sensitiveMustRedact: [
      'Exact Home Address (Never list home address on public listing)',
      'Personal Mobile Number (Use marketplace chat)',
      'Visible Car License Plates in vehicle photos',
      'Serial Numbers on electronics (prevent fraudulent warranty claims)',
      'Reflections of other family members or interior layout'
    ],
    safeToInclude: [
      'Product specifications, condition notes, and clear photos',
      'General meeting neighborhood or designated police station safe zone',
      'Accepted in-app payment methods'
    ],
    checks: [
      { id: 'c8', text: 'Photo background does not reveal your street name, house number, or building lobby.', severity: 'high' },
      { id: 'c9', text: 'No personal phone number written in the listing description.', severity: 'high' },
      { id: 'c10', text: 'Electronic item serial numbers (IMEI, MAC address) obscured to prevent remote lock fraud.', severity: 'caution' }
    ],
    verdictAdvice: 'Never invite unknown buyers to your doorstep for high-value items; always insist on communication through the platform’s secured messaging channel.'
  },
  school_submission: {
    id: 'school_submission',
    name: 'School / University Submission',
    badge: 'Academic Portal / Canvas / Turnitin',
    description: 'Uploading homework, capstone projects, dissertations, or peer-reviewed assignments.',
    sensitiveMustRedact: [
      'Student National Identification Numbers / SSN',
      'Personal Home Address',
      'Personal Cell Phone Number',
      'Unsanitized API keys or database connection strings in code files'
    ],
    safeToInclude: [
      'Student Name and University Student ID (if required)',
      'Institutional (.edu/.ac) email address',
      'Course number, term, and professor name'
    ],
    checks: [
      { id: 'c11', text: 'No personal bank details or tuition receipt screenshots in submission.', severity: 'high' },
      { id: 'c12', text: 'Source code submissions checked for committed .env files or API secrets.', severity: 'high' },
      { id: 'c13', text: 'Student ID number matches university guidelines (prefer campus email over national ID).', severity: 'caution' }
    ],
    verdictAdvice: 'School papers frequently get archived permanently into automated anti-plagiarism databases accessible across multiple universities.'
  },
  customer_support: {
    id: 'customer_support',
    name: 'Customer Support Ticket',
    badge: 'Helpdesk & Ticket Attachment',
    description: 'Sending screenshots or error logs to tech support, telecom providers, or online banking.',
    sensitiveMustRedact: [
      'Full Credit / Debit Card Numbers (Keep only last 4 digits)',
      'CVV / Security Code and Expiration Date',
      'Authentication Passwords, Tokens, or One-Time Passwords (OTPs)',
      'Full Social Security / National ID Number'
    ],
    safeToInclude: [
      'Order ID or Ticket Reference Number',
      'Error message stack trace or UI code',
      'Last 4 digits of payment card (if explicitly requested for verification)'
    ],
    checks: [
      { id: 'c14', text: 'Credit card number cropped or redacted so only last 4 digits are visible.', severity: 'high' },
      { id: 'c15', text: 'Zero passwords, PINs, or 2FA codes visible in screenshots or logs.', severity: 'high' },
      { id: 'c16', text: 'URL bar in browser screenshot checked for sensitive session tokens or query params.', severity: 'caution' }
    ],
    verdictAdvice: 'Customer support tickets are viewable by dozens of contracted tier-1 agents and often stored in plain-text CRM databases.'
  }
};
