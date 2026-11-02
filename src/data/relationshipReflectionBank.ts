/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA VOLUNTARY RELATIONSHIP EXPERIENCE & READINESS REFLECTION BANK
 * 
 * Strictly Optional Reflection Module:
 * 1. Focuses on forward-looking personal growth, boundary lessons, and partnership readiness.
 * 2. Strict Invariant: NEVER infers prior relationship history, dating frequency, marriage,
 *    or intimate life from indirect scenario answers.
 * 3. Transparent: If factual marital status is needed for matrimony matchmaking, it is asked
 *    openly as a transparent factual preference, never moralized.
 * 4. Respects member autonomy: 100% voluntary with explicit skip options and Section 12 erasure.
 */

export interface RelationshipReflectionItem {
  id: string;
  reflectionNumber: number;
  theme: string;
  prompt: string;
  context: string;
  whyWeAsk: string;
  isVoluntary: true;
  options: {
    id: string;
    label: string;
    reflectionText: string;
    boundaryGuidance: string;
  }[];
  transparencyNote: string;
}

export const VOLUNTARY_RELATIONSHIP_REFLECTION_BANK: RelationshipReflectionItem[] = [
  {
    id: 'ref-1-boundary-lessons',
    reflectionNumber: 1,
    theme: 'Lessons in Relational Boundaries',
    prompt: 'Reflecting on your journey and past experiences, what is the most vital boundary lesson you have learned about yourself?',
    context: 'Forward-looking boundary self-knowledge and self-protection in interpersonal connections.',
    whyWeAsk: 'Helps potential companions understand what emotional safety and respectful boundaries look like for you today.',
    isVoluntary: true,
    transparencyNote: 'This is an optional reflective exploration. Kithra never attempts to reconstruct your private relationship history.',
    options: [
      {
        id: 'opt-ref1-speak-early',
        label: 'Speaking up early about discomfort rather than staying silent to keep artificial peace',
        reflectionText: 'Values proactive boundary articulation over silent accommodation.',
        boundaryGuidance: 'Seeks a companion who invites gentle candor and listens without defensiveness.',
      },
      {
        id: 'opt-ref1-preserve-solitude',
        label: 'Preserving my own identity, career ambitions, and friendships alongside love',
        reflectionText: 'Values healthy individuation and autonomy in partnership.',
        boundaryGuidance: 'Seeks a companion who honors independent friendships and personal space.',
      },
      {
        id: 'opt-ref1-emotional-pacing',
        label: 'Pacing emotional intimacy steadily until mutual trust and reliability are proven',
        reflectionText: 'Values measured, grounded pacing before deep vulnerability.',
        boundaryGuidance: 'Seeks a companion who respects deliberate, unhurried emotional development.',
      },
    ],
  },
  {
    id: 'ref-2-conflict-safety',
    reflectionNumber: 2,
    theme: 'Emotional Safety During Difficult Moments',
    prompt: 'When you feel vulnerable, overwhelmed, or upset, what behavior from a companion creates the deepest sense of safety?',
    context: 'Attachment security and emotional soothing in close relationships.',
    whyWeAsk: 'Ensures companions know how to offer comfort during moments of distress without escalating tension.',
    isVoluntary: true,
    transparencyNote: 'Voluntary self-reflection. Focuses on what soothes your nervous system today.',
    options: [
      {
        id: 'opt-ref2-silent-presence',
        label: 'A calm, unhurried physical presence—holding space without demanding immediate explanations',
        reflectionText: 'Finds safety in calm, undemanding presence and somatic grounding.',
        boundaryGuidance: 'Comfortable with companion being quietly nearby while emotions settle.',
      },
      {
        id: 'opt-ref2-verbal-reassurance',
        label: 'Explicit spoken reassurance that our bond is solid and we will work through this together',
        reflectionText: 'Finds safety in spoken relational certainty and verbal affirmation.',
        boundaryGuidance: 'Appreciates explicit reminder of mutual commitment during tension.',
      },
      {
        id: 'opt-ref2-space-to-think',
        label: 'Gentle space for an hour to gather my thoughts independently before talking it through',
        reflectionText: 'Finds safety in autonomous self-soothing before relational dialogue.',
        boundaryGuidance: 'Appreciates respectful pause without companion feeling abandoned.',
      },
    ],
  },
  {
    id: 'ref-3-partnership-readiness',
    reflectionNumber: 3,
    theme: 'Intentional Readiness for Connection',
    prompt: 'Entering your next meaningful chapter of connection, what mindset best reflects your current readiness?',
    context: 'Personal life stage readiness and intentionality.',
    whyWeAsk: 'Aligns individuals whose life chapters and readiness cadences are harmoniously synchronized.',
    isVoluntary: true,
    transparencyNote: 'Non-judgmental self-report. Being in an exploratory phase is just as valid as seeking immediate matrimony.',
    options: [
      {
        id: 'opt-ref3-intentional-commitment',
        label: 'Ready for deep, intentional life partnership—clarity about my values and ready to build a shared future',
        reflectionText: 'High intentionality for enduring, grounded partnership.',
        boundaryGuidance: 'Seeks companion with reciprocal clarity and readiness for long-term building.',
      },
      {
        id: 'opt-ref3-organic-unfolding',
        label: 'Open to a beautiful connection, letting trust and mutual compatibility unfold organically without rushing milestones',
        reflectionText: 'Open, grounded exploration with organic milestone pacing.',
        boundaryGuidance: 'Seeks companion who values mutual organic growth without external family pressure.',
      },
      {
        id: 'opt-ref3-curated-friendship-first',
        label: 'Focusing primarily on genuine intellectual and values-based friendship first before considering romance',
        reflectionText: 'Prioritizes solid companionship foundation before romantic escalation.',
        boundaryGuidance: 'Seeks companion comfortable with unhurried platonic exploration first.',
      },
    ],
  },
];

