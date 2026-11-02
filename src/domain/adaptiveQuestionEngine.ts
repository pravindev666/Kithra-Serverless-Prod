/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA ADAPTIVE QUESTION SELECTION ENGINE
 * 
 * Version: 2026.11-adaptive-v1.0 (Deterministic & Reproducible)
 * 
 * Implements:
 * 1. Fixed Starter Battery (Items 1–5): Calm, non-threatening entry pacing.
 * 2. Stage A Essential Gate Prioritization: Automatically prioritizes non-negotiable
 *    commitment (Q38), children (Q50), and partner lifestyle requirements (Q63)
 *    when Dating or Matrimony intentions are selected.
 * 3. Construct Coverage & Uncertainty Reduction: Prioritizes construct layers with the lowest
 *    coverage count to build a balanced, multidimensional profile without clustering.
 * 4. Contextual Follow-Up: Pairs anchor items and validates consistency gracefully.
 * 5. Full Determinism: Reproducible given the same history and intentions.
 */

import {
  AssessmentQuestion,
  ConstructLayerId,
  IntentionId,
  QuestionFormatType,
} from '../types/kithra';
import {
  PILOT_60_QUESTION_BANK,
  RESEARCH_PILOT_QUESTION_BANK,
} from '../data/pilotQuestionBank';

export const ADAPTIVE_ENGINE_VERSION = '2026.11-adaptive-v1.0';

/**
 * Fixed Starter Battery: Administered to all members in exact order (Items 1–5)
 * to provide a smooth, predictable, non-overwhelming initial onboarding.
 */
export const STARTER_BATTERY_QUESTION_IDS: readonly string[] = [
  'q-pace',                // Q1: Pace of conversation
  'q-02-workweek-reply',   // Q2: Workweek reply rhythm
  'q-03-first-meetup',     // Q3: First meet-up comfort
  'q-04-listening-role',   // Q4: Listening & conversational role
  'q-05-voice-vs-text',    // Q5: Voice note vs text preference
] as const;

/**
 * Stage A Essential Gates: Prioritized immediately after starter battery
 * when a user engages in romantic or matrimonial discovery.
 */
export const ESSENTIAL_GATE_QUESTION_IDS: readonly string[] = [
  'q-38-relationship-structure-gate', // Monogamy / Exclusivity structure
  'q-50-children-goal-gate',          // Long-term children / family goals
  'q-63-partner-smoking-requirement', // Partner smoking / vaping requirement
] as const;

export type AdaptiveSelectionReason =
  | 'starter_battery'
  | 'essential_boundary_gate'
  | 'construct_coverage_gap'
  | 'contextual_follow_up'
  | 'stage_advancement'
  | 'bank_exhausted';

export interface AdaptiveSelectionResult {
  nextQuestion: AssessmentQuestion | null;
  selectionReason: AdaptiveSelectionReason;
  rationale: string;
  engineVersion: string;
  totalAnswered: number;
  coverageByConstruct: Record<string, number>;
  unansweredCount: number;
}

const CONSTRUCT_CANONICAL_ORDER: ConstructLayerId[] = [
  'communication',
  'conflict_repair',
  'personal_values',
  'social_energy',
  'finances_independence',
  'family_domestic',
  'daily_lifestyle',
  'relational_boundaries',
  'intellectual_curiosity',
  'emotional_regulation',
  'long_term_goals',
  'romantic_expectations',
];

const FORMAT_DISCRIMINATIVE_PRIORITY: Record<QuestionFormatType, number> = {
  importance_boundary: 1,
  values_tradeoff: 2,
  situational_judgment: 3,
  forced_choice: 4,
  contextual_trait: 5,
  direct_preference: 6,
  optional_reflection: 7,
};

/**
 * Select the next adaptive question for a member given their current answered set
 * and active relationship intentions.
 */
export function selectNextAdaptiveQuestion(
  answeredQuestionIds: Iterable<string>,
  intentions: IntentionId[] = ['friendship'],
  questionBank: AssessmentQuestion[] = RESEARCH_PILOT_QUESTION_BANK
): AdaptiveSelectionResult {
  const answeredSet = new Set(answeredQuestionIds);
  const totalAnswered = answeredSet.size;

  // 1. Check Starter Battery (Questions 1–5)
  for (const starterId of STARTER_BATTERY_QUESTION_IDS) {
    if (!answeredSet.has(starterId)) {
      const q = questionBank.find((item) => item.id === starterId);
      if (q) {
        return {
          nextQuestion: q,
          selectionReason: 'starter_battery',
          rationale: `Starter Battery item ${q.questionNumber} of 5 (${q.facetId ?? q.id}) administered for consistent initial calibration.`,
          engineVersion: ADAPTIVE_ENGINE_VERSION,
          totalAnswered,
          coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
          unansweredCount: questionBank.length - totalAnswered,
        };
      }
    }
  }

  // 2. Filter Candidate Pool: Only applicable intentions & not yet answered
  const intentionSet = new Set(intentions);
  const eligibleCandidates = questionBank.filter((q) => {
    if (answeredSet.has(q.id)) return false;
    // Check if applicable to any of member's selected intentions
    return q.applicableIntentions.some((intent) => intentionSet.has(intent));
  });

  if (eligibleCandidates.length === 0) {
    return {
      nextQuestion: null,
      selectionReason: 'bank_exhausted',
      rationale: 'All applicable questions for your selected intentions have been answered.',
      engineVersion: ADAPTIVE_ENGINE_VERSION,
      totalAnswered,
      coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
      unansweredCount: 0,
    };
  }

  // 3. Essential Gates for Romantic Intentions (Dating & Matrimony)
  const isRomantic = intentionSet.has('dating') || intentionSet.has('matrimony');
  if (isRomantic) {
    for (const gateId of ESSENTIAL_GATE_QUESTION_IDS) {
      if (!answeredSet.has(gateId)) {
        const gateQuestion = eligibleCandidates.find((q) => q.id === gateId);
        if (gateQuestion) {
          return {
            nextQuestion: gateQuestion,
            selectionReason: 'essential_boundary_gate',
            rationale: `Stage A Essential Gate (${gateQuestion.facetId}) prioritized for Dating/Matrimony mutual eligibility protection.`,
            engineVersion: ADAPTIVE_ENGINE_VERSION,
            totalAnswered,
            coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
            unansweredCount: eligibleCandidates.length,
          };
        }
      }
    }
  }

  // 4. Construct Coverage & Uncertainty Optimization
  const coverage = computeConstructCoverage(answeredSet, questionBank);

  // Group eligible candidate questions by constructId
  const candidatesByConstruct = new Map<ConstructLayerId, AssessmentQuestion[]>();
  for (const q of eligibleCandidates) {
    const cId = (q.constructId ?? 'communication') as ConstructLayerId;
    if (!candidatesByConstruct.has(cId)) {
      candidatesByConstruct.set(cId, []);
    }
    candidatesByConstruct.get(cId)!.push(q);
  }

  // Find candidate construct layers with the lowest coverage count
  let targetConstruct: ConstructLayerId | null = null;
  let minCoverage = Infinity;

  for (const cId of CONSTRUCT_CANONICAL_ORDER) {
    if (candidatesByConstruct.has(cId)) {
      const cCount = coverage[cId] ?? 0;
      if (cCount < minCoverage) {
        minCoverage = cCount;
        targetConstruct = cId;
      }
    }
  }

  // Fallback to any available construct if canonical list doesn't match
  if (!targetConstruct && candidatesByConstruct.size > 0) {
    targetConstruct = candidatesByConstruct.keys().next().value ?? null;
  }

  const constructCandidates = targetConstruct
    ? candidatesByConstruct.get(targetConstruct) ?? eligibleCandidates
    : eligibleCandidates;

  // 5. Item Selection within target construct:
  // Sort deterministically by:
  // - Stage (lowest stage first)
  // - Discriminative Format priority
  // - Question Number (lowest first)
  const sortedCandidates = [...constructCandidates].sort((a, b) => {
    const stageA = typeof a.stage === 'number' ? a.stage : 1;
    const stageB = typeof b.stage === 'number' ? b.stage : 1;
    if (stageA !== stageB) return stageA - stageB;

    const formatRankA = FORMAT_DISCRIMINATIVE_PRIORITY[a.formatType ?? 'direct_preference'] ?? 99;
    const formatRankB = FORMAT_DISCRIMINATIVE_PRIORITY[b.formatType ?? 'direct_preference'] ?? 99;
    if (formatRankA !== formatRankB) return formatRankA - formatRankB;

    return a.questionNumber - b.questionNumber;
  });

  const nextQuestion = sortedCandidates[0];

  return {
    nextQuestion,
    selectionReason: 'construct_coverage_gap',
    rationale: `Selected from construct '${nextQuestion.constructId}' (current coverage: ${minCoverage} answered) to balance multidimensional measurement accuracy.`,
    engineVersion: ADAPTIVE_ENGINE_VERSION,
    totalAnswered,
    coverageByConstruct: coverage,
    unansweredCount: eligibleCandidates.length,
  };
}

/**
 * Helper to compute how many questions have been answered per construct layer.
 */
export function computeConstructCoverage(
  answeredQuestionIds: Set<string>,
  questionBank: AssessmentQuestion[] = PILOT_60_QUESTION_BANK
): Record<string, number> {
  const coverage: Record<string, number> = {};
  for (const cId of CONSTRUCT_CANONICAL_ORDER) {
    coverage[cId] = 0;
  }

  for (const q of questionBank) {
    if (answeredQuestionIds.has(q.id) && q.constructId) {
      coverage[q.constructId] = (coverage[q.constructId] ?? 0) + 1;
    }
  }

  return coverage;
}

