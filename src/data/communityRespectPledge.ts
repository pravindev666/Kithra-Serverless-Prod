/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA COMMUNITY RESPECT PLEDGE & DIGNITY COVENANT
 * Version: 2026.11
 * 
 * Plain-language community agreement governing all spaces:
 * Friendship, Dating, Matrimony, and Cofounders.
 * 
 * Strictly prohibits casual hookup solicitations, harassment, and uninvited sexual content.
 * Grounded in conduct and explicit consent—never moral shaming or personality diagnosis.
 */

export interface RespectPledgeItem {
  id: string;
  number: number;
  title: string;
  commitment: string;
  rationale: string;
}

export const COMMUNITY_RESPECT_PLEDGE_VERSION = '2026.11';

export const COMMUNITY_RESPECT_PLEDGE_ITEMS: readonly RespectPledgeItem[] = [
  {
    id: 'truthful_intentions',
    number: 1,
    title: 'Truthfulness in Intentions',
    commitment: 'I will be honest about why I am on Kithra and what I am seeking. I will not misrepresent my relationship status or pretend to seek marriage, long-term love, or friendship for casual solicitation.',
    rationale: 'Transparency allows everyone to invest their emotional energy with confidence and safety.'
  },
  {
    id: 'consent_and_boundaries',
    number: 2,
    title: 'Consent and Boundaries',
    commitment: 'I will respect the physical, emotional, and digital boundaries set by others. "No" or unresponsiveness is a complete answer that requires no defense.',
    rationale: 'Mutual safety and comfort always take priority over personal curiosity or urgency.'
  },
  {
    id: 'anti_harassment',
    number: 3,
    title: 'Zero Harassment & Coercion',
    commitment: 'I will not pressure, badger, demean, or guilt anyone into communicating, sharing contact details, or meeting before they are ready.',
    rationale: 'Genuine connection can only unfold at a mutually welcomed pace.'
  },
  {
    id: 'dignified_rejection',
    number: 4,
    title: 'Graceful Acceptance of Rejection',
    commitment: 'If someone chooses not to connect or decides to end a conversation, I will accept their decision politely without anger, insults, or retaliation.',
    rationale: 'Compatibility is rare and mutual; a graceful ending protects both people\'s dignity.'
  },
  {
    id: 'no_unsolicited_sexual_content',
    number: 5,
    title: 'Zero Unsolicited Sexual Content',
    commitment: 'I will never send sexually explicit messages, images, requests, or innuendos. Kithra is a dignity-first platform, not a casual-hookup application.',
    rationale: 'Unsolicited explicit content is an immediate violation of trust and will result in permanent account removal.'
  },
  {
    id: 'privacy_and_confidentiality',
    number: 6,
    title: 'Privacy and Confidentiality',
    commitment: 'I will never screenshot, share, or publish another member\'s profile, photos, conversations, or psychological reflection answers outside of Kithra.',
    rationale: 'Trust requires an ironclad guarantee of personal privacy.'
  },
  {
    id: 'authentic_identity',
    number: 7,
    title: 'Authenticity & Financial Integrity',
    commitment: 'I will represent myself truthfully and never use fake photos, impersonate others, or ask for money, loans, gifts, or financial favors.',
    rationale: 'Kithra has zero tolerance for scams, romance fraud, or commercial exploitation.'
  },
  {
    id: 'space_integrity',
    number: 8,
    title: 'Integrity of Each Space',
    commitment: 'I will respect the distinct purpose of each space: Friendship is platonic; Dating is intentional; Matrimony is for marriage; Cofounders is professional. I will not blur or exploit these boundaries.',
    rationale: 'Clear context boundaries ensure everyone is treated according to their expressed expectations.'
  }
] as const;

/**
 * Reflective prompts for Slow Connection Mode:
 * Gentle, unhurried questions to help two people discover values and shared perspectives.
 */
export const SLOW_CONNECTION_REFLECTIVE_PROMPTS = [
  'What is a quiet ritual or habit that brings you peace during a demanding workweek?',
  'What is a value or principle you learned early in life that still guides your decisions today?',
  'When you look back on your closest relationships, what quality made you feel most understood?',
  'How do you usually prefer to recharge after an emotionally demanding or social weekend?',
  'What is a creative, intellectual, or community project you would love to build over the next two years?'
];

