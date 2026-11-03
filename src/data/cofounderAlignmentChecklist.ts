/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA FOUNDER ALIGNMENT CHECKLIST & 30-DAY TRIAL PROJECT FRAMEWORK
 * Version: 2026.11
 * 
 * A private, voluntary worksheet that two prospective founders can complete
 * through mutual consent before making legal or financial commitments.
 */

export interface AlignmentQuestion {
  id: string;
  category: 'roles_and_decisions' | 'equity_and_finances' | 'commitment_and_runway' | 'conflict_and_exit';
  prompt: string;
  whyItMatters: string;
  sampleClarifyingOptions: string[];
}

export const COFOUNDER_ALIGNMENT_CHECKLIST: readonly AlignmentQuestion[] = [
  {
    id: 'roles_and_responsibilities',
    category: 'roles_and_decisions',
    prompt: 'Who will build what? What specific functional areas will each person own independently?',
    whyItMatters: 'Clear domains of ownership eliminate duplicated effort and turf battles early on.',
    sampleClarifyingOptions: [
      'Founder A owns Product, Tech & Engineering; Founder B owns Sales, Marketing & Operations',
      'Both build product jointly during MVP; specialize post-revenue',
      'Equal co-CEOs with distinct functional leads'
    ]
  },
  {
    id: 'tie_breaking_decisions',
    category: 'roles_and_decisions',
    prompt: 'When we fundamentally disagree on a strategic path, who makes the final call?',
    whyItMatters: 'A defined tie-breaking mechanism prevents startup deadlock during critical pivots.',
    sampleClarifyingOptions: [
      'Domain owner makes final call for their domain (Product vs Commercial)',
      'Designated CEO holds final casting vote',
      'Neutral external advisor / mentor acts as tie-breaker'
    ]
  },
  {
    id: 'time_commitment',
    category: 'commitment_and_runway',
    prompt: 'What is our expected weekly time commitment right now, and when do we go 100% full-time?',
    whyItMatters: 'Mismatched hours create resentment if one person feels they are carrying the entire load.',
    sampleClarifyingOptions: [
      'Both full-time immediately from Day 1',
      'Part-time nights/weekends for 60 days to build MVP, then full-time together',
      'One founder full-time immediately, other transitions upon $50k funding or $5k MRR'
    ]
  },
  {
    id: 'personal_runway',
    category: 'commitment_and_runway',
    prompt: 'How many months can each of us survive without drawing a salary from the company?',
    whyItMatters: 'Financial panic forces premature fundraising or emergency departures.',
    sampleClarifyingOptions: [
      '6+ months personal runway without salary',
      '12+ months personal runway',
      'Requires nominal stipend after 3 months'
    ]
  },
  {
    id: 'funding_and_dilution',
    category: 'equity_and_finances',
    prompt: 'Are we building an independent, profitable bootstrapped business or pursuing venture capital?',
    whyItMatters: 'Bootstrapping vs VC represents two entirely different business philosophies and stress profiles.',
    sampleClarifyingOptions: [
      'Bootstrapped, profitable from Day 1, customer-funded growth',
      'Aggressive VC track: Angel -> Seed -> Series A',
      'Bootstrap to MVP, raise opportunistic seed only if needed for acceleration'
    ]
  },
  {
    id: 'equity_and_vesting',
    category: 'equity_and_finances',
    prompt: 'How do we view equity division, and do we agree to standard 4-year vesting with a 1-year cliff?',
    whyItMatters: 'Unvested equity is hazardous; vesting protects both founders if one departs early.',
    sampleClarifyingOptions: [
      '50/50 equal split with standard 4-year vesting and 1-year cliff',
      'Contribution/IP-weighted split with 4-year vesting',
      'Milestone-based equity release framework'
    ]
  },
  {
    id: 'pivot_triggers',
    category: 'conflict_and_exit',
    prompt: 'What happens if our initial product idea fails after 3 months of customer discovery?',
    whyItMatters: 'Startups must pivot; knowing whether you are married to the idea or the partnership is crucial.',
    sampleClarifyingOptions: [
      'Committed to the partnership; will pivot together to adjacent problem spaces',
      'Committed specifically to this vertical/domain only',
      'Time-boxed 90-day experiment; disband amicably if no traction'
    ]
  },
  {
    id: 'disagreement_cooling_protocol',
    category: 'conflict_and_exit',
    prompt: 'When emotions run high during heated disagreements, what is our agreed reset ritual?',
    whyItMatters: 'High pressure strains personal relationships; pre-agreed pauses protect mutual respect.',
    sampleClarifyingOptions: [
      'Mandatory 12-hour cooling period before any permanent partnership decisions',
      'Write down perspectives in a shared document rather than debating emotionally',
      'Schedule a structured walk / coffee to reset before resuming discussions'
    ]
  },
  {
    id: 'amicable_exit',
    category: 'conflict_and_exit',
    prompt: 'If either of us decides this collaboration is not working, what does a clean, honorable exit look like?',
    whyItMatters: 'Knowing how to part as friends eliminates anxiety and protects professional integrity.',
    sampleClarifyingOptions: [
      'Departing founder surrenders unvested equity; retaining founder continues company',
      'Mutual dissolution: all IP made public or archived, zero lingering debt',
      'Right of first refusal with predefined buy-out formula'
    ]
  }
] as const;

/**
 * 30-Day Voluntary Trial Collaboration Protocol
 */
export const TRIAL_PROJECT_FRAMEWORK = {
  durationDays: 30,
  objective: 'Build a tiny, functional prototype or conduct 20 customer discovery interviews together with zero legal entity or cap-table commitment.',
  milestones: [
    { week: 1, title: 'Problem Discovery & Customer Scope', target: 'Interview 5 target customers and draft a 1-page PRD.' },
    { week: 2, title: 'Architecture & Wireframes', target: 'Technical founder wireframes/builds core flow; business founder drafts pitch & distribution channel.' },
    { week: 3, title: 'Interactive Prototype Sprint', target: 'Clickable MVP demo or working API endpoint demonstrated to 3 real prospects.' },
    { week: 4, title: 'Mutual Retrospective & Go / No-Go Decision', target: 'Honest review of working chemistry, pace, and whether to proceed with formal legal partnership.' }
  ]
};

