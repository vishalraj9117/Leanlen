/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CombinationScenario } from '../types';

export const syntheticCombinationScenarios: CombinationScenario[] = [
  {
    id: 'combo-1',
    title: 'The Zip Code + Birth Date + Gender Triad',
    description: 'Dr. Latanya Sweeney’s classic privacy research demonstrated that 87% of the United States population can be uniquely identified using only three quasi-identifiers.',
    dataPoints: ['5-Digit Postal ZIP Code', 'Exact Date of Birth (Year/Month/Day)', 'Gender'],
    reidentificationRisk: 87,
    explanation: 'While each piece of data feels broad in isolation (e.g., millions share a birth date), the intersection of all three creates a population bucket of usually just 1 person in a specific neighborhood.',
    realWorldImpact: 'Public health surveys, voter rolls, and contest entries that publish "anonymized" demographics can easily be linked back to your exact identity.',
    defensiveAction: 'Share birth year only, or birth decade where required. Never disclose exact date of birth on non-essential web forms or public social profiles.'
  },
  {
    id: 'combo-2',
    title: 'The Neighborhood Dog Park Photo + Workplace Bio',
    description: 'A social photo captioned "Morning walk at Sunnyvale Dog Run with Cooper!" combined with a public LinkedIn profile stating "Engineering Manager at Acme Tech".',
    dataPoints: ['Specific Neighborhood Park Name', 'Dog’s Unique Name', 'Company Name & Department'],
    reidentificationRisk: 92,
    explanation: 'Cross-referencing the municipal pet license registry (often public record) or neighborhood property deeds within 0.5 miles of the park quickly reveals the owner\'s exact home address.',
    realWorldImpact: 'Physical stalking, unsolicited visits, and answers to common banking security questions ("What was your first pet\'s name?").',
    defensiveAction: 'Do not use your pet’s real name for security questions. Avoid tagging precise local neighborhood parks on public profiles.'
  },
  {
    id: 'combo-3',
    title: 'The Airport Departure Selfie + Boarding Pass Barcode',
    description: 'Posting an airport lounge selfie holding a paper boarding pass or coffee cup with the corner of the ticket showing.',
    dataPoints: ['Flight Date & Departure Airport', 'PNR Locator Code (6 Letters)', 'Visible Barcode Strips'],
    reidentificationRisk: 96,
    explanation: 'Airline boarding pass barcodes contain passenger name record (PNR) details and frequent flyer IDs. Entering the PNR and last name on the airline website allows anyone to access passport numbers, email, phone, and future travel dates.',
    realWorldImpact: 'Travel cancellation, theft of airline loyalty points, identity fraud, and confirmation that the traveler\'s residence is currently empty.',
    defensiveAction: 'Never post boarding passes, baggage tags, or event wristbands. If posting travel memories, do so after returning home and with tickets completely hidden.'
  },
  {
    id: 'combo-4',
    title: 'The High School Mascot + Hometown + Graduation Year',
    description: 'Participating in viral social media nostalgia trends: "Only 90s kids will remember our school mascot: The Tigers!"',
    dataPoints: ['High School Name / Mascot', 'Hometown City & State', 'Graduation Year'],
    reidentificationRisk: 90,
    explanation: 'These three data points match the default recovery questions on banking, credit union, and legacy web portals. High school yearbooks are widely digitized and indexed.',
    realWorldImpact: 'Allows attackers to bypass password reset protections via "Forgot Password" self-service flows.',
    defensiveAction: 'Do not answer viral social media prompts asking for birth hospital, elementary school, childhood street, or first car.'
  }
];

export interface DataFragmentOption {
  id: string;
  name: string;
  category: string;
  weight: number; // contribution to reidentification
  entropyBits: number;
}

export const dataFragmentOptions: DataFragmentOption[] = [
  { id: 'f-first-name', name: 'First Name', category: 'Identity', weight: 15, entropyBits: 10 },
  { id: 'f-last-name', name: 'Last Name', category: 'Identity', weight: 35, entropyBits: 15 },
  { id: 'f-city', name: 'Current City of Residence', category: 'Location', weight: 20, entropyBits: 8 },
  { id: 'f-zip', name: '5-Digit Postal ZIP Code', category: 'Location', weight: 45, entropyBits: 14 },
  { id: 'f-birth-year', name: 'Birth Year', category: 'Demographics', weight: 12, entropyBits: 6 },
  { id: 'f-birth-day', name: 'Exact Day & Month of Birth', category: 'Demographics', weight: 38, entropyBits: 9 },
  { id: 'f-employer', name: 'Current Employer', category: 'Professional', weight: 40, entropyBits: 16 },
  { id: 'f-college', name: 'Undergraduate University', category: 'Education', weight: 25, entropyBits: 11 },
  { id: 'f-pet', name: 'Pet Name', category: 'Personal', weight: 18, entropyBits: 8 },
  { id: 'f-car-model', name: 'Car Model & Color', category: 'Personal', weight: 15, entropyBits: 7 },
  { id: 'f-phone-prefix', name: 'Phone Area Code (first 3 digits)', category: 'Communication', weight: 10, entropyBits: 6 },
  { id: 'f-email-domain', name: 'Custom Email Domain (@mysite.com)', category: 'Communication', weight: 55, entropyBits: 18 }
];

export function calculateCombinationRisk(selectedIds: string[]): {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Near-Certain';
  estimatedBucketSize: string;
  advice: string;
} {
  if (selectedIds.length === 0) {
    return {
      score: 0,
      level: 'Low',
      estimatedBucketSize: 'Entire population (> 100,000,000)',
      advice: 'Select at least one quasi-identifier above to begin testing combination exposure.'
    };
  }

  const selectedFragments = dataFragmentOptions.filter(f => selectedIds.includes(f.id));
  const totalEntropy = selectedFragments.reduce((sum, f) => sum + f.entropyBits, 0);

  // Sweeney / k-anonymity estimation model
  // 33 bits of entropy uniquely isolates 1 person among 8 billion humans (2^33 ~ 8.5B).
  const normalizedScore = Math.min(99, Math.round((totalEntropy / 32) * 100));

  let level: 'Low' | 'Moderate' | 'High' | 'Near-Certain';
  let estimatedBucketSize: string;
  let advice: string;

  if (normalizedScore < 35) {
    level = 'Low';
    estimatedBucketSize = '~ 10,000+ individuals share this combination';
    advice = 'These data points leave a reasonably large anonymity set. Low risk of direct re-identification in isolation.';
  } else if (normalizedScore < 65) {
    level = 'Moderate';
    estimatedBucketSize = '~ 100 to 500 individuals share this combination';
    advice = 'Narrowed anonymity set. A targeted researcher with minimal extra clues can isolate your profile.';
  } else if (normalizedScore < 85) {
    level = 'High';
    estimatedBucketSize = '~ 2 to 10 individuals share this combination';
    advice = 'High re-identification risk. Cross-referencing against public social directories will likely reveal your identity.';
  } else {
    level = 'Near-Certain';
    estimatedBucketSize = 'Unique individual (1 person)';
    advice = 'Near-certain unique identification. Anyone holding these data points can pinpoint your exact identity with >95% confidence.';
  }

  return {
    score: normalizedScore,
    level,
    estimatedBucketSize,
    advice
  };
}
