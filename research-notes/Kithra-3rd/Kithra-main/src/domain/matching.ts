import {
  AgreementScoreOutput,
  CanonicalThemeCode,
  MatchingLens,
  ModeEnrollmentState,
  MosaicRuleMatch,
  RelationshipMode,
  ScenarioSimulationResult,
} from '../types';

export const MODEL_VERSION = 'v1.2';
export const SCORING_VERSION = '2026.11-deterministic';
export const MIN_COVERAGE_RATIO = 0.5;
export const MIN_COMPARED_ITEMS = 6;
export const SCALE_SPAN = 4; // 5-point response scale: 1..5, span = 4

export interface MosaicRuleSpec {
  id: string;
  label: string;
  themeCode: CanonicalThemeCode;
  itemA: string;
  itemB: string;
  preferredTargetForA: Record<number, number[]>;
  explanation: string;
}

/**
 * Explicit, versioned rule table for Mosaic Fit (Rule-based Complementarity).
 * Governing Spec: 05_MATCHING_RD_Deterministic_Psychometrics.md &matching.reference.ts
 */
export const MOSAIC_RULE_TABLE: MosaicRuleSpec[] = [
  {
    id: 'RULE-PLAN-SPONT',
    label: 'Planner + Spontaneous Explorer',
    themeCode: 'TIME',
    itemA: 'TIME_001',
    itemB: 'TIME_002',
    preferredTargetForA: {
      5: [4, 5],
      4: [3, 4, 5],
      3: [3, 4],
      2: [2, 3],
      1: [1, 2],
    },
    explanation:
      'One person brings calm logistical structure while the other brings gentle spontaneity, so shared weekends neither stall nor feel over-scheduled.',
  },
  {
    id: 'RULE-TALK-REFLECT',
    label: 'Direct Expressive + Reflective Listener',
    themeCode: 'COMM',
    itemA: 'COMM_001',
    itemB: 'COMM_002',
    preferredTargetForA: {
      5: [4, 5],
      4: [4, 5],
      3: [3, 4],
      2: [2, 3],
      1: [1, 2],
    },
    explanation:
      'Expressive clarity pairs with unhurried active listening when both explicitly value patient turn-taking.',
  },
  {
    id: 'RULE-HOST-ANCHOR',
    label: 'Social Initiator + Grounded Host',
    themeCode: 'SOC',
    itemA: 'SOC_001',
    itemB: 'SOC_002',
    preferredTargetForA: {
      5: [3, 4, 5],
      4: [3, 4, 5],
      3: [3, 4],
      2: [2, 3],
      1: [1, 2],
    },
    explanation:
      'Community energy balances with a restorative home base when recharge boundaries are mutually respected.',
  },
  {
    id: 'RULE-DETAIL-HORIZON',
    label: 'Day-to-Day Steward + Long-Horizon Planner',
    themeCode: 'FIN',
    itemA: 'FIN_001',
    itemB: 'FIN_002',
    preferredTargetForA: {
      5: [4, 5],
      4: [4, 5],
      3: [3, 4],
      2: [2, 3],
      1: [1, 2],
    },
    explanation:
      'Practical monthly stewardship complements multi-year horizon planning when financial transparency is shared.',
  },
];

export function scoreToBand(score: number | null): AgreementScoreOutput['band'] {
  if (score === null) return 'Insufficient coverage';
  if (score >= 82) return 'Strong agreement';
  if (score >= 68) return 'Notable agreement';
  if (score >= 52) return 'Moderate agreement';
  return 'Mixed rhythm';
}

/**
 * Echo (Similar) Agreement Index:
 * Mean normalized proximity across shared answered items.
 * Never returns 100% or claims soulmate certainty.
 */
export function computeEchoAgreement(
  answersA: Record<string, number>,
  answersB: Record<string, number>,
  totalEligibleItems = 12
): AgreementScoreOutput {
  const sharedKeys = Object.keys(answersA).filter((k) => answersB[k] !== undefined);
  const comparedCount = sharedKeys.length;
  const coverageRatio = totalEligibleItems > 0 ? comparedCount / totalEligibleItems : 0;

  if (comparedCount < MIN_COMPARED_ITEMS || coverageRatio < MIN_COVERAGE_RATIO) {
    return {
      lens: 'echo',
      band: 'Insufficient coverage',
      score: null,
      coverageCount: comparedCount,
      totalEligibleCount: totalEligibleItems,
      coverageRatio: Number(coverageRatio.toFixed(2)),
      modelVersion: MODEL_VERSION,
      scoringVersion: SCORING_VERSION,
      caveat: 'Minimum 50% shared item coverage required before computing an agreement index.',
      topSharedThemes: [],
      topFrictionPoints: [],
    };
  }

  let proximitySum = 0;
  for (const key of sharedKeys) {
    const diff = Math.abs(answersA[key] - answersB[key]);
    const sim = 1 - diff / SCALE_SPAN;
    proximitySum += Math.max(0, Math.min(1, sim));
  }

  // Cap at 96 so we never display a misleading 100% certainty
  const rawScore = Math.round((proximitySum / comparedCount) * 100);
  const score = Math.min(96, Math.max(18, rawScore));

  return {
    lens: 'echo',
    band: scoreToBand(score),
    score,
    coverageCount: comparedCount,
    totalEligibleCount: totalEligibleItems,
    coverageRatio: Number(coverageRatio.toFixed(2)),
    modelVersion: MODEL_VERSION,
    scoringVersion: SCORING_VERSION,
    caveat: 'Agreement across compared answers, not a prediction.',
    topSharedThemes: ['Communication & Repair', 'Trust & Reliability', 'Values & Ethics'],
    topFrictionPoints: ['Social Energy & Pace'],
  };
}

/**
 * Counterpoint (Contrasting) Index:
 * Rewards healthy difference on open exploration themes ONLY when core safety/boundary guardrails align.
 */
export function computeCounterpointIndex(
  answersA: Record<string, number>,
  answersB: Record<string, number>,
  coreGuardrailKeys: string[] = ['BOUN_001', 'COMM_001'],
  totalEligibleItems = 12
): AgreementScoreOutput {
  const sharedKeys = Object.keys(answersA).filter((k) => answersB[k] !== undefined);
  const comparedCount = sharedKeys.length;
  const coverageRatio = totalEligibleItems > 0 ? comparedCount / totalEligibleItems : 0;

  if (comparedCount < MIN_COMPARED_ITEMS || coverageRatio < MIN_COVERAGE_RATIO) {
    return {
      lens: 'counterpoint',
      band: 'Insufficient coverage',
      score: null,
      coverageCount: comparedCount,
      totalEligibleCount: totalEligibleItems,
      coverageRatio: Number(coverageRatio.toFixed(2)),
      modelVersion: MODEL_VERSION,
      scoringVersion: SCORING_VERSION,
      caveat: 'Minimum 50% shared item coverage required before computing a counterpoint index.',
      topSharedThemes: [],
      topFrictionPoints: [],
    };
  }

  // Check guardrail alignment first: if core boundary items diverge by > 1 step, penalize heavily
  let guardrailPenalty = 0;
  for (const gKey of coreGuardrailKeys) {
    if (answersA[gKey] !== undefined && answersB[gKey] !== undefined) {
      if (Math.abs(answersA[gKey] - answersB[gKey]) > 1) {
        guardrailPenalty += 18;
      }
    }
  }

  // Healthy moderate contrast (distance of 1 or 2 steps on 1..5 scale) scores highest
  let contrastSum = 0;
  for (const key of sharedKeys) {
    const diff = Math.abs(answersA[key] - answersB[key]);
    const scoreForItem = diff === 1 || diff === 2 ? 0.92 : diff === 0 ? 0.68 : 0.35;
    contrastSum += scoreForItem;
  }

  const rawScore = Math.round((contrastSum / comparedCount) * 100) - guardrailPenalty;
  const score = Math.min(95, Math.max(20, rawScore));

  return {
    lens: 'counterpoint',
    band: scoreToBand(score),
    score,
    coverageCount: comparedCount,
    totalEligibleCount: totalEligibleItems,
    coverageRatio: Number(coverageRatio.toFixed(2)),
    modelVersion: MODEL_VERSION,
    scoringVersion: SCORING_VERSION,
    caveat: 'Healthy contrast across flexible themes with aligned core boundaries; not a prediction.',
    topSharedThemes: ['Boundaries & Respect', 'Trust & Reliability'],
    topFrictionPoints: ['Leisure & Intellectual Curiosity', 'Social Energy & Recharge'],
  };
}

/**
 * Mosaic Fit (Complementary):
 * Evaluates the explicit rule table MOSAIC_RULE_TABLE bidirectionally + baseline Echo agreement.
 */
export function computeMosaicFit(
  answersA: Record<string, number>,
  answersB: Record<string, number>,
  totalEligibleItems = 12
): AgreementScoreOutput {
  const echoBase = computeEchoAgreement(answersA, answersB, totalEligibleItems);
  if (echoBase.score === null) {
    return {
      ...echoBase,
      lens: 'mosaic',
      caveat: 'Minimum 50% shared item coverage required before computing Mosaic Fit.',
    };
  }

  const matchedRules: MosaicRuleMatch[] = [];
  let ruleScoreTotal = 0;

  for (const rule of MOSAIC_RULE_TABLE) {
    const valA = answersA[rule.itemA] ?? 4;
    const valB = answersB[rule.itemB] ?? 4;
    const reverseValB = answersB[rule.itemA] ?? 4;
    const reverseValA = answersA[rule.itemB] ?? 4;

    const forwardHit = (rule.preferredTargetForA[valA] || []).includes(valB);
    const reverseHit = (rule.preferredTargetForA[reverseValB] || []).includes(reverseValA);
    const matched = forwardHit || reverseHit;
    const ruleScore = matched ? 88 : 62;
    ruleScoreTotal += ruleScore;

    matchedRules.push({
      ruleId: rule.id,
      label: rule.label,
      themeCode: rule.themeCode,
      matched,
      score: ruleScore,
      explanation: rule.explanation,
    });
  }

  const avgRuleScore = ruleScoreTotal / MOSAIC_RULE_TABLE.length;
  const combined = Math.round(echoBase.score * 0.55 + avgRuleScore * 0.45);
  const score = Math.min(96, Math.max(22, combined));

  return {
    lens: 'mosaic',
    band: scoreToBand(score),
    score,
    coverageCount: echoBase.coverageCount,
    totalEligibleCount: totalEligibleItems,
    coverageRatio: echoBase.coverageRatio,
    modelVersion: MODEL_VERSION,
    scoringVersion: SCORING_VERSION,
    caveat: 'Rule-based complementarity across explicit trait pairs; not a prediction.',
    topSharedThemes: ['Time & Planning Complementarity', 'Communication Turn-Taking'],
    topFrictionPoints: ['Pace calibration during high-stress weeks'],
    mosaicRules: matchedRules,
  };
}

/**
 * Strict Mode Isolation Eligibility Gate (D-02, SEC-05):
 * Never leaks a candidate from Mode X into Mode Y unless BOTH members have explicitly enabled
 * and consented to discoverability in that exact mode, and neither has blocked/muted the other.
 */
export function isCandidateEligibleForMode(params: {
  activeMode: RelationshipMode;
  viewerEnrollments: Record<RelationshipMode, ModeEnrollmentState>;
  candidateModes: RelationshipMode[];
  candidateDiscoverableInMode: boolean;
  isBlockedOrMuted: boolean;
}): { eligible: boolean; reason: string } {
  const {
    activeMode,
    viewerEnrollments,
    candidateModes,
    candidateDiscoverableInMode,
    isBlockedOrMuted,
  } = params;

  if (isBlockedOrMuted) {
    return { eligible: false, reason: 'DENY_BLOCKED_OR_MUTED' };
  }

  const viewerModeState = viewerEnrollments[activeMode];
  if (!viewerModeState || !viewerModeState.enabled || !viewerModeState.discoverableConsent) {
    return { eligible: false, reason: 'DENY_VIEWER_MODE_NOT_CONSENTED' };
  }

  if (viewerModeState.paused) {
    return { eligible: false, reason: 'DENY_VIEWER_MODE_PAUSED' };
  }

  if (!candidateModes.includes(activeMode) || !candidateDiscoverableInMode) {
    return { eligible: false, reason: 'DENY_CANDIDATE_MODE_ISOLATION' };
  }

  return { eligible: true, reason: 'ALLOW_MODE_ISOLATED_MATCH' };
}

/**
 * Deterministic If-Then Scenario Simulator (D-01, §05_MATCHING_RD):
 * Lets members test concrete everyday relationship situations using declared trait dimensions
 * without any generative AI, LLM, or digital twin.
 */
export const DETERMINISTIC_SCENARIOS: Array<{
  id: string;
  title: string;
  context: string;
  primaryTheme: CanonicalThemeCode;
  secondaryTheme: CanonicalThemeCode;
}> = [
  {
    id: 'SCEN-WEEKEND-CHANGE',
    title: 'Last-Minute Weekend Plan Shift',
    context: 'A quiet Saturday plan changes 3 hours before dinner because friends invite you both out.',
    primaryTheme: 'TIME',
    secondaryTheme: 'SOC',
  },
  {
    id: 'SCEN-CONFLICT-REPAIR',
    title: 'Repairing a Misread Text After Work',
    context: 'A short reply during a busy workday feels abrupt. How do you both approach the evening check-in?',
    primaryTheme: 'COMM',
    secondaryTheme: 'EMOT',
  },
  {
    id: 'SCEN-SHARED-BUDGET',
    title: 'Planning a Shared Travel or Household Expense',
    context: 'Choosing between a spontaneous upgrade and sticking strictly to a 6-month savings target.',
    primaryTheme: 'FIN',
    secondaryTheme: 'ROLE',
  },
  {
    id: 'SCEN-FAMILY-BOUNDARY',
    title: 'Navigating Extended Family & Holiday Expectations',
    context: 'Balancing family visits with personal downtime during a festive week.',
    primaryTheme: 'FAM',
    secondaryTheme: 'BOUN',
  },
];

export function simulateDeterministicScenario(
  scenarioId: string,
  lens: MatchingLens,
  viewerScoreByTheme: Record<string, number>,
  candidateScoreByTheme: Record<string, number>,
  candidateName: string
): ScenarioSimulationResult {
  const scenario =
    DETERMINISTIC_SCENARIOS.find((s) => s.id === scenarioId) || DETERMINISTIC_SCENARIOS[0];

  const vPrimary = viewerScoreByTheme[scenario.primaryTheme] ?? 78;
  const cPrimary = candidateScoreByTheme[scenario.primaryTheme] ?? 80;
  const vSecondary = viewerScoreByTheme[scenario.secondaryTheme] ?? 75;
  const cSecondary = candidateScoreByTheme[scenario.secondaryTheme] ?? 76;

  const avgDelta = (Math.abs(vPrimary - cPrimary) + Math.abs(vSecondary - cSecondary)) / 2;

  let baseScore = Math.round(92 - avgDelta * 0.75);
  if (lens === 'mosaic' && avgDelta >= 8 && avgDelta <= 22) {
    baseScore = Math.min(94, baseScore + 7);
  } else if (lens === 'counterpoint' && avgDelta >= 10 && avgDelta <= 25) {
    baseScore = Math.min(92, baseScore + 5);
  }

  const score = Math.max(48, Math.min(95, baseScore));
  const agreementBand = scoreToBand(score);

  const whatWorks =
    avgDelta <= 12
      ? `You and ${candidateName} share a very close rhythm on ${scenario.primaryTheme} (${vPrimary}% vs ${cPrimary}%), so expectations require minimal translation.`
      : `Under the ${lens.toUpperCase()} lens, your ${vPrimary}% and ${candidateName}'s ${cPrimary}% on ${scenario.primaryTheme} create a complementary balance when roles are named upfront.`;

  const watchOutFor =
    avgDelta <= 12
      ? 'Shared habits can occasionally create blind spots if neither person pauses to voice unstated assumptions.'
      : `A ${Math.round(avgDelta)}-point difference across ${scenario.primaryTheme} & ${scenario.secondaryTheme} means last-minute assumptions can feel jarring without a 2-minute check-in.`;

  const deterministicCheckInPrompt =
    scenario.id === 'SCEN-WEEKEND-CHANGE'
      ? '"Before we say yes to a new plan, let us check our energy on a 1–5 scale and agree on an exit time."'
      : scenario.id === 'SCEN-CONFLICT-REPAIR'
      ? '"Do you want 30 minutes to decompress first, or should we talk it through right now?"'
      : scenario.id === 'SCEN-SHARED-BUDGET'
      ? '"What is our comfortable ceiling for this trip so neither of us feels stretched next month?"'
      : '"Which family gathering is non-negotiable for us this week, and which evening stays protected for just us?"';

  return {
    scenarioId: scenario.id,
    title: scenario.title,
    context: scenario.context,
    lens,
    agreementBand,
    score,
    whatWorks,
    watchOutFor,
    deterministicCheckInPrompt,
  };
}
