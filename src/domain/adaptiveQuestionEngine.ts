/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA ADAPTIVE QUESTION SELECTION ENGINE
 * 
 * Version: 2026.11-adaptive-v2.0 (Response-Aware, Triangulation-Linked & Fatigue-Aware)
 * 
 * Implements:
 * 1. Fixed Starter Battery (Items 1–5): Calm, non-threatening entry pacing.
 * 2. Stage A Essential Gate Prioritization: Automatically prioritizes non-negotiable
 *    commitment (Q38), children (Q50), and partner lifestyle requirements (Q63)
 *    when Dating or Matrimony intentions are selected.
 * 3. Response-Aware Follow-Up & Triangulation: Discovers when a member's answer
 *    calls for a contextual pair (e.g. confidentiality in friendship vs workplace)
 *    to measure situational nuance rather than making assumptions.
 * 4. Section-Focused Progression: Supports directed module completion (Naukri-style)
 *    while preserving cross-construct uncertainty reduction.
 * 5. Fatigue & Session Pacing Guardrails: Flags gentle break recommendations after
 *    10 consecutive questions in a single sitting without penalizing readiness.
 * 6. Explicit Skip Respect: Never badgers the user with questions they chose to skip.
 * 7. Full Determinism: Reproducible given the same history, answers, and intentions.
 */

import {
  AssessmentQuestion,
  ConstructLayerId,
  IntentionId,
  ProfileSectionId,
  QuestionFormatType,
} from '../types/kithra';
import {
  EXPANDED_PILOT_QUESTION_BANK,
  PILOT_60_QUESTION_BANK,
} from '../data/pilotQuestionBank';
import { TRIANGULATION_CLUSTERS } from './triangulationEngine';

export const ADAPTIVE_ENGINE_VERSION = '2026.11-adaptive-v2.0';

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
  | 'response_triangulation_pair'
  | 'construct_coverage_gap'
  | 'contextual_follow_up'
  | 'section_progression'
  | 'stage_advancement'
  | 'bank_exhausted';

export interface AdaptiveSelectionContext {
  answeredQuestionIds: Iterable<string>;
  memberAnswers?: Record<string, unknown>;
  intentions?: readonly IntentionId[] | IntentionId[];
  questionBank?: AssessmentQuestion[];
  targetSectionId?: ProfileSectionId;
  sessionAnswersCount?: number;
  skippedQuestionIds?: Iterable<string>;
}

export interface AdaptiveSelectionResult {
  nextQuestion: AssessmentQuestion | null;
  selectionReason: AdaptiveSelectionReason;
  rationale: string;
  engineVersion: string;
  totalAnswered: number;
  coverageByConstruct: Record<string, number>;
  unansweredCount: number;
  breakRecommended?: boolean;
  breakAdvisory?: string;
  activeClusterId?: string;
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
 * Normalized helper to extract string/record values safely.
 */
function getAnswerOptionId(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object' && raw !== null) {
    const rec = raw as Record<string, unknown>;
    if (typeof rec.optionId === 'string') return rec.optionId;
    if (typeof rec.semanticId === 'string') return rec.semanticId;
  }
  return null;
}

/**
 * Select the next adaptive question for a member given their current answered set,
 * actual responses, active intentions, and session state.
 */
export function selectNextAdaptiveQuestion(
  contextOrAnsweredIds: Iterable<string> | AdaptiveSelectionContext,
  maybeIntentions?: IntentionId[],
  maybeQuestionBank?: AssessmentQuestion[]
): AdaptiveSelectionResult {
  let answeredQuestionIds: Iterable<string>;
  let memberAnswers: Record<string, unknown> = {};
  let intentions: readonly IntentionId[] = ['friendship'];
  let questionBank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK;
  let targetSectionId: ProfileSectionId | undefined;
  let sessionAnswersCount = 0;
  let skippedSet = new Set<string>();

  if (
    contextOrAnsweredIds &&
    typeof contextOrAnsweredIds === 'object' &&
    'answeredQuestionIds' in contextOrAnsweredIds
  ) {
    const ctx = contextOrAnsweredIds as AdaptiveSelectionContext;
    answeredQuestionIds = ctx.answeredQuestionIds;
    memberAnswers = ctx.memberAnswers ?? {};
    intentions = ctx.intentions ?? ['friendship'];
    questionBank = ctx.questionBank ?? EXPANDED_PILOT_QUESTION_BANK;
    targetSectionId = ctx.targetSectionId;
    sessionAnswersCount = ctx.sessionAnswersCount ?? 0;
    if (ctx.skippedQuestionIds) {
      skippedSet = new Set(ctx.skippedQuestionIds);
    }
  } else {
    answeredQuestionIds = contextOrAnsweredIds as Iterable<string>;
    intentions = maybeIntentions ?? ['friendship'];
    questionBank = maybeQuestionBank ?? EXPANDED_PILOT_QUESTION_BANK;
  }

  const answeredSet = new Set(answeredQuestionIds);
  const totalAnswered = answeredSet.size;

  // Fatigue guardrail: recommend break after 10 questions in current active sitting
  const breakRecommended = sessionAnswersCount >= 10;
  const breakAdvisory = breakRecommended
    ? "You've answered 10 thoughtful questions in this session. Taking a break is completely okay and your answers are saved."
    : undefined;

  // 1. Check Starter Battery (Questions 1–5) in exact order
  for (const starterId of STARTER_BATTERY_QUESTION_IDS) {
    if (!answeredSet.has(starterId) && !skippedSet.has(starterId)) {
      const q = questionBank.find((item) => item.id === starterId);
      if (q) {
        return {
          nextQuestion: q,
          selectionReason: 'starter_battery',
          rationale: `Starter Battery item ${q.questionNumber} of 5 (${q.facetId ?? q.id}) administered for calm, consistent initial onboarding.`,
          engineVersion: ADAPTIVE_ENGINE_VERSION,
          totalAnswered,
          coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
          unansweredCount: questionBank.length - totalAnswered,
          breakRecommended,
          breakAdvisory,
        };
      }
    }
  }

  // 2. Filter Candidate Pool: Active intention match & not answered or skipped
  const intentionSet = new Set(intentions);
  const eligibleCandidates = questionBank.filter((q) => {
    if (answeredSet.has(q.id)) return false;
    if (skippedSet.has(q.id)) return false;
    return q.applicableIntentions.some((intent) => intentionSet.has(intent));
  });

  if (eligibleCandidates.length === 0) {
    return {
      nextQuestion: null,
      selectionReason: 'bank_exhausted',
      rationale: 'All applicable questions for your selected intentions have been answered or skipped.',
      engineVersion: ADAPTIVE_ENGINE_VERSION,
      totalAnswered,
      coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
      unansweredCount: 0,
      breakRecommended,
      breakAdvisory,
    };
  }

  // 3. Stage A Essential Gates for Romantic Intentions (Dating & Matrimony)
  const isRomantic = intentionSet.has('dating') || intentionSet.has('matrimony');
  if (isRomantic) {
    for (const gateId of ESSENTIAL_GATE_QUESTION_IDS) {
      if (!answeredSet.has(gateId) && !skippedSet.has(gateId)) {
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
            breakRecommended,
            breakAdvisory,
          };
        }
      }
    }
  }

  // 4. Response-Aware Follow-Up & Triangulation Pairing
  // If the member answered an item that has a pairedFollowUpId or belongs to a cluster
  // where a contextual counterpart is unanswered, trigger that pair next.
  for (const answeredId of answeredSet) {
    const rawAnswer = memberAnswers[answeredId];
    if (!rawAnswer) continue;

    const baseQuestion = questionBank.find((q) => q.id === answeredId);
    if (!baseQuestion) continue;

    // Check explicit pairedFollowUpIds
    if (baseQuestion.pairedFollowUpIds && baseQuestion.pairedFollowUpIds.length > 0) {
      for (const followUpId of baseQuestion.pairedFollowUpIds) {
        if (!answeredSet.has(followUpId) && !skippedSet.has(followUpId)) {
          const followUpQ = eligibleCandidates.find((q) => q.id === followUpId);
          if (followUpQ) {
            return {
              nextQuestion: followUpQ,
              selectionReason: 'response_triangulation_pair',
              rationale: `Contextual follow-up triggered by response to ${baseQuestion.id}: testing situational variation in ${followUpQ.facetId ?? followUpQ.id}.`,
              engineVersion: ADAPTIVE_ENGINE_VERSION,
              totalAnswered,
              coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
              unansweredCount: eligibleCandidates.length,
              breakRecommended,
              breakAdvisory,
              activeClusterId: followUpQ.triangulationClusterId,
            };
          }
        }
      }
    }

    // Check cluster counterparts if baseQuestion has a triangulationClusterId
    if (baseQuestion.triangulationClusterId) {
      const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === baseQuestion.triangulationClusterId);
      if (cluster) {
        // Count how many answered in this cluster
        const answeredInCluster = cluster.questionIds.filter((qId) => answeredSet.has(qId));
        if (answeredInCluster.length === 1) {
          // Exactly 1 answered in this cluster -> pick the second item to establish triangulation
          const secondId = cluster.questionIds.find((qId) => !answeredSet.has(qId) && !skippedSet.has(qId));
          if (secondId) {
            const counterpartQ = eligibleCandidates.find((q) => q.id === secondId);
            if (counterpartQ) {
              return {
                nextQuestion: counterpartQ,
                selectionReason: 'response_triangulation_pair',
                rationale: `Triangulation companion item for cluster '${cluster.name}': measuring situational consistency vs adaptive nuance.`,
                engineVersion: ADAPTIVE_ENGINE_VERSION,
                totalAnswered,
                coverageByConstruct: computeConstructCoverage(answeredSet, questionBank),
                unansweredCount: eligibleCandidates.length,
                breakRecommended,
                breakAdvisory,
                activeClusterId: cluster.id,
              };
            }
          }
        }
      }
    }
  }

  // 5. Target Section Focus (if member chose a specific section in Naukri-style dashboard)
  let candidatePool = eligibleCandidates;
  if (targetSectionId) {
    const sectionCandidates = eligibleCandidates.filter((q) => q.sectionId === targetSectionId);
    if (sectionCandidates.length > 0) {
      candidatePool = sectionCandidates;
    }
  }

  // 6. Construct Coverage & Uncertainty Optimization
  const coverage = computeConstructCoverage(answeredSet, questionBank);

  // Group candidate questions by constructId
  const candidatesByConstruct = new Map<ConstructLayerId, AssessmentQuestion[]>();
  for (const q of candidatePool) {
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

  if (!targetConstruct && candidatesByConstruct.size > 0) {
    targetConstruct = candidatesByConstruct.keys().next().value ?? null;
  }

  const constructCandidates = targetConstruct
    ? candidatesByConstruct.get(targetConstruct) ?? candidatePool
    : candidatePool;

  // 7. Deterministic Sort:
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
    selectionReason: targetSectionId ? 'section_progression' : 'construct_coverage_gap',
    rationale: targetSectionId
      ? `Selected item from section '${targetSectionId}' to complete chosen profile module.`
      : `Selected from construct '${nextQuestion.constructId}' (current coverage: ${minCoverage} answered) to balance multidimensional measurement accuracy.`,
    engineVersion: ADAPTIVE_ENGINE_VERSION,
    totalAnswered,
    coverageByConstruct: coverage,
    unansweredCount: eligibleCandidates.length,
    breakRecommended,
    breakAdvisory,
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
