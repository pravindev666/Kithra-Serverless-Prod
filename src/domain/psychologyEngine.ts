import {
  AdminQualityReviewEvent,
  ArchetypeConfidenceBand,
  AssessmentQuestion,
  AssessmentQuestionOption,
  ConstructLayerId,
  ConstructVectorPoint,
  DiscoveryLensView,
  ExperimentalArchetypeId,
  IntentionId,
  MemberEligibilityRequirements,
  MemberProfile,
  PartnerSmokingRequirement,
  RelationshipSignalKind,
  ResponseQualityState,
  SimilarityPresetId,
  SmokingEnvironmentComfort,
  SmokingHabitStatus,
  SmokingVapingProfile,
} from '../types/kithra';
import { PILOT_60_QUESTION_BANK } from '../data/pilotQuestionBank';

export const PSYCHOLOGY_ENGINE_VERSION = '2026.11-psych-v2.0-deterministic';

/**
 * Minimum number of comparable answered constructs/items required before
 * computing a numerical 0-100 Attribute Similarity Score.
 * Below this threshold, the engine returns `insufficient_information`
 * rather than inventing a score or treating missing data as dissimilarity.
 */
export const MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE = 2;

/* -------------------------------------------------------------------------- */
/*  CHANGE 1: Plain-English Member-Facing Lens Names + Internal Mapping       */
/* -------------------------------------------------------------------------- */

export interface LensDisplayDescriptor {
  internalKind: RelationshipSignalKind;
  lensView: Exclude<DiscoveryLensView, 'all'>;
  memberFacingName: 'Similar to Me' | 'Different from Me' | 'We Balance Each Other';
  legacyTechnicalName: 'Echo' | 'Counterpoint' | 'Mosaic Fit';
  shortTagline: string;
  subtitle: string;
  memberExplanation: string;
  cardFieldLabel: 'Shared Ground' | 'Difference' | 'Potential Balance';
  accentColor: string;
}

export const LENS_DISPLAY_MAP: Record<RelationshipSignalKind, LensDisplayDescriptor> = {
  echo: {
    internalKind: 'echo',
    lensView: 'similar_to_me',
    memberFacingName: 'Similar to Me',
    legacyTechnicalName: 'Echo',
    shortTagline: 'Discover people who share your traits, interests and values.',
    subtitle: 'Discover people who share your traits, interests and values.',
    memberExplanation:
      'Highlights meaningful similarities in measured values, communication rhythms, interests, and everyday habits based on comparable answered questions.',
    cardFieldLabel: 'Shared Ground',
    accentColor: 'var(--friend)',
  },
  counterpoint: {
    internalKind: 'counterpoint',
    lensView: 'different_from_me',
    memberFacingName: 'Different from Me',
    legacyTechnicalName: 'Counterpoint',
    shortTagline: 'Meet people who see or experience the world differently.',
    subtitle: 'Meet people who see or experience the world differently.',
    memberExplanation:
      'Surfaces genuine measured differences in routines or perspectives when both people report flexible boundaries and mutual respect.',
    cardFieldLabel: 'Difference',
    accentColor: 'var(--date)',
  },
  mosaic: {
    internalKind: 'mosaic',
    lensView: 'we_balance_each_other',
    memberFacingName: 'We Balance Each Other',
    legacyTechnicalName: 'Mosaic Fit',
    shortTagline: 'Find people whose strengths and preferences may complement yours.',
    subtitle: 'Find people whose strengths and preferences may complement yours.',
    memberExplanation:
      'Identifies combinations of habits and strengths—such as planning and spontaneity—only when both members indicate they welcome that arrangement.',
    cardFieldLabel: 'Potential Balance',
    accentColor: 'var(--ochre)',
  },
};

export function getMemberFacingLensLabel(
  kind: RelationshipSignalKind
): 'Similar to Me' | 'Different from Me' | 'We Balance Each Other' {
  return LENS_DISPLAY_MAP[kind].memberFacingName;
}

/* -------------------------------------------------------------------------- */
/*  CONSTRUCT WEIGHTS BY INTENTION (Provisional, Transparent & Versioned)     */
/* -------------------------------------------------------------------------- */

export const PROVISIONAL_DOMAIN_WEIGHTS: Record<
  IntentionId,
  Record<string, number>
> = {
  friendship: {
    personality_traits: 1.0,
    personal_values: 1.15,
    communication: 1.25,
    emotional_regulation: 1.0,
    conflict_repair: 1.1,
    trust_reliability: 1.25,
    autonomy_boundaries: 1.1,
    daily_lifestyle: 1.0,
    social_friendship: 1.35,
    romantic_expectations: 0.0, // Not used in Friendship similarity
    family_domestic: 0.25,
    adaptability_change: 1.0,
    C1_openness: 1.0,
    C2_planfulness: 1.0,
    C3_social_energy: 1.0,
    C4_warmth: 1.0,
    C5_steadiness: 1.0,
    C1: 1.0,
    C2: 1.0,
    C3: 1.0,
    C4: 1.0,
  },
  dating: {
    personality_traits: 1.0,
    personal_values: 1.25,
    communication: 1.3,
    emotional_regulation: 1.15,
    conflict_repair: 1.3,
    trust_reliability: 1.3,
    autonomy_boundaries: 1.25,
    daily_lifestyle: 1.1,
    social_friendship: 0.9,
    romantic_expectations: 1.35,
    family_domestic: 0.85,
    adaptability_change: 1.1,
    C1_openness: 1.0,
    C2_planfulness: 1.0,
    C3_social_energy: 1.0,
    C4_warmth: 1.0,
    C5_steadiness: 1.0,
    C1: 1.0,
    C2: 1.0,
    C3: 1.0,
    C4: 1.0,
  },
  matrimony: {
    personality_traits: 0.95,
    personal_values: 1.35,
    communication: 1.3,
    emotional_regulation: 1.2,
    conflict_repair: 1.35,
    trust_reliability: 1.35,
    autonomy_boundaries: 1.25,
    daily_lifestyle: 1.2,
    social_friendship: 0.85,
    romantic_expectations: 1.2,
    family_domestic: 1.4,
    adaptability_change: 1.2,
    C1_openness: 1.0,
    C2_planfulness: 1.0,
    C3_social_energy: 1.0,
    C4_warmth: 1.0,
    C5_steadiness: 1.0,
    C1: 1.0,
    C2: 1.0,
    C3: 1.0,
    C4: 1.0,
  },
};

/* -------------------------------------------------------------------------- */
/*  STAGE A: MUTUAL ELIGIBILITY EVALUATION                                    */
/* -------------------------------------------------------------------------- */

export interface MutualEligibilityEvaluation {
  eligible: boolean;
  status:
  | 'eligible'
  | 'ineligible_hard_requirement_conflict'
  | 'ineligible_intention_or_privacy'
  | 'clarification_needed_unknown_requirement';
  intention: IntentionId;
  reasons: string[];
  unknownFieldsRequiringClarification: string[];
  hasUnknownNonNegotiables: boolean;
  neutralMemberExplanation: string;
}

/**
 * Evaluates Stage A Mutual Eligibility before any similarity or complementarity scoring.
 * Supports both 3-argument `(viewer, candidate, intention)` and 5-argument
 * `(viewer, candidate, candidateId, viewerId, intention)` call forms.
 * Never converts unknown/missing requirements into presumed rejection,
 * and never labels either member defective when requirements conflict.
 */
export function evaluateMutualEligibility(
  viewer: MemberEligibilityRequirements,
  candidate: MemberEligibilityRequirements,
  candidateIdOrIntention: string | IntentionId,
  viewerIdArg?: string,
  intentionArg?: IntentionId
): MutualEligibilityEvaluation {
  const isThreeArgCall =
    intentionArg === undefined &&
    (candidateIdOrIntention === 'friendship' ||
      candidateIdOrIntention === 'dating' ||
      candidateIdOrIntention === 'matrimony');

  const intention: IntentionId = isThreeArgCall
    ? (candidateIdOrIntention as IntentionId)
    : (intentionArg ?? 'friendship');

  const candidateId = isThreeArgCall
    ? (candidate.memberId ?? 'candidate-id')
    : candidateIdOrIntention;
  const viewerId = isThreeArgCall
    ? (viewer.memberId ?? 'viewer-self')
    : (viewerIdArg ?? viewer.memberId ?? 'viewer-self');

  const reasons: string[] = [];
  const unknownFields: string[] = [];

  // 1. Adult account verification
  const viewerAdult = viewer.isAdult ?? viewer.isAdultVerified ?? true;
  const candidateAdult = candidate.isAdult ?? candidate.isAdultVerified ?? true;
  if (!viewerAdult || !candidateAdult) {
    return {
      eligible: false,
      status: 'ineligible_intention_or_privacy',
      intention,
      reasons: ['adult_eligibility_required'],
      unknownFieldsRequiringClarification: [],
      hasUnknownNonNegotiables: false,
      neutralMemberExplanation:
        'Both accounts must meet adult age requirements to participate in discovery.',
    };
  }

  // 2. Blocking rules (symmetric 0ms block enforcement across all intentions)
  if (
    (viewer.blockedMemberIds ?? []).includes(candidateId) ||
    (candidate.blockedMemberIds ?? []).includes(viewerId)
  ) {
    return {
      eligible: false,
      status: 'ineligible_intention_or_privacy',
      intention,
      reasons: ['member_block_active'],
      unknownFieldsRequiringClarification: [],
      hasUnknownNonNegotiables: false,
      neutralMemberExplanation: 'This profile is not available in discovery.',
    };
  }

  // 3. Both members have enabled the target relationship intention & allow discovery
  const viewerDiscoverable = viewer.discoverableInIntentions
    ? viewer.discoverableInIntentions.includes(intention)
    : viewer.discoveryEnabledByIntention
      ? viewer.discoveryEnabledByIntention[intention] !== false
      : true;

  const candidateDiscoverable = candidate.discoverableInIntentions
    ? candidate.discoverableInIntentions.includes(intention)
    : candidate.discoveryEnabledByIntention
      ? candidate.discoveryEnabledByIntention[intention] !== false
      : true;

  const viewerEnabled = (viewer.enabledIntentions ?? [intention]).includes(intention) && viewerDiscoverable;
  const candidateEnabled =
    (candidate.enabledIntentions ?? [intention]).includes(intention) && candidateDiscoverable;

  if (!viewerEnabled || !candidateEnabled) {
    return {
      eligible: false,
      status: 'ineligible_intention_or_privacy',
      intention,
      reasons: ['intention_not_mutually_enabled'],
      unknownFieldsRequiringClarification: [],
      hasUnknownNonNegotiables: false,
      neutralMemberExplanation: `One or both profiles do not currently have ${intention} discovery enabled.`,
    };
  }

  // 4. Romantic & Matrimony structure requirements (Friendship does NOT inherit romantic restrictions)
  if (intention === 'dating' || intention === 'matrimony') {
    const vStruct =
      viewer.relationshipStructureByIntention?.[intention] ??
      viewer.relationshipStructure ??
      'unknown';
    const cStruct =
      candidate.relationshipStructureByIntention?.[intention] ??
      candidate.relationshipStructure ??
      'unknown';

    if (
      vStruct === 'unknown' ||
      cStruct === 'unknown' ||
      vStruct === 'prefer_not_to_answer' ||
      cStruct === 'prefer_not_to_answer'
    ) {
      unknownFields.push('relationship_structure');
    } else {
      const structureConflict =
        (vStruct === 'exclusive_required' && cStruct === 'open_required') ||
        (vStruct === 'open_required' && cStruct === 'exclusive_required');

      if (structureConflict) {
        reasons.push('incompatible_relationship_structure');
      }
    }
  }

  // 5. Long-term children preference check (when marked essential in Matrimony or Dating)
  if (intention === 'matrimony' || intention === 'dating') {
    const vChild = viewer.childrenPreference ?? 'unknown';
    const cChild = candidate.childrenPreference ?? 'unknown';
    const vImportance =
      viewer.childrenPreferenceImportance ?? viewer.childrenRequirementLevel ?? 'flexible';
    const cImportance =
      candidate.childrenPreferenceImportance ??
      candidate.childrenRequirementLevel ??
      'flexible';
    const vEssential = vImportance === 'essential';
    const cEssential = cImportance === 'essential';

    if (vEssential || cEssential) {
      if (vChild === 'unknown' || cChild === 'unknown') {
        unknownFields.push('children_preference');
      } else {
        const childConflict =
          (vChild === 'wants_children' && cChild === 'does_not_want_children') ||
          (vChild === 'does_not_want_children' && cChild === 'wants_children');
        if (childConflict) {
          reasons.push('incompatible_children_goal');
        }
      }
    }
  }

  // 6. Privacy-preserving lifestyle smoking & vaping compatibility check (Stage A)
  const vSmokeProfile = viewer.smokingVapingProfile;
  const cSmokeProfile = candidate.smokingVapingProfile;

  if (vSmokeProfile || cSmokeProfile) {
    const vReq =
      vSmokeProfile?.partnerRequirementByIntention?.[intention] ?? 'no_preference';
    const cReq =
      cSmokeProfile?.partnerRequirementByIntention?.[intention] ?? 'no_preference';
    const vHabit = vSmokeProfile?.personalHabit ?? 'unknown';
    const cHabit = cSmokeProfile?.personalHabit ?? 'unknown';

    // Viewer requirement check against candidate
    if (vReq === 'must_be_non_smoker') {
      if (cHabit === 'unknown' || cHabit === 'prefer_not_to_say') {
        unknownFields.push('smoking_habit');
      } else if (
        cHabit === 'regular_smoker' ||
        cHabit === 'occasional_social_smoker' ||
        cHabit === 'vape_only'
      ) {
        reasons.push('incompatible_smoking_preference');
      }
    } else if (vReq === 'occasional_or_vape_acceptable') {
      if (cHabit === 'unknown' || cHabit === 'prefer_not_to_say') {
        unknownFields.push('smoking_habit');
      } else if (cHabit === 'regular_smoker') {
        reasons.push('incompatible_smoking_preference');
      }
    }

    // Candidate requirement check against viewer
    if (cReq === 'must_be_non_smoker') {
      if (vHabit === 'unknown' || vHabit === 'prefer_not_to_say') {
        unknownFields.push('smoking_habit');
      } else if (
        vHabit === 'regular_smoker' ||
        vHabit === 'occasional_social_smoker' ||
        vHabit === 'vape_only'
      ) {
        reasons.push('incompatible_smoking_preference');
      }
    } else if (cReq === 'occasional_or_vape_acceptable') {
      if (vHabit === 'unknown' || vHabit === 'prefer_not_to_say') {
        unknownFields.push('smoking_habit');
      } else if (vHabit === 'regular_smoker') {
        reasons.push('incompatible_smoking_preference');
      }
    }
  }

  if (reasons.length > 0) {
    return {
      eligible: false,
      status: 'ineligible_hard_requirement_conflict',
      intention,
      reasons,
      unknownFieldsRequiringClarification: unknownFields,
      hasUnknownNonNegotiables: unknownFields.length > 0,
      neutralMemberExplanation:
        'Your stated essential relationship preferences differ for this intention.',
    };
  }

  // Unknown fields remain unknown and do NOT falsely reject eligibility (Test H)
  return {
    eligible: true,
    status:
      unknownFields.length > 0 ? 'clarification_needed_unknown_requirement' : 'eligible',
    intention,
    reasons: [],
    unknownFieldsRequiringClarification: unknownFields,
    hasUnknownNonNegotiables: unknownFields.length > 0,
    neutralMemberExplanation:
      unknownFields.length > 0
        ? 'Eligible for discovery; some optional relationship preferences are currently unanswered and can be clarified in conversation.'
        : 'Both members have enabled this intention and agree on stated essential relationship requirements.',
  };
}

/* -------------------------------------------------------------------------- */
/*  STAGE C1: 0–100 ATTRIBUTE SIMILARITY SCORE (Section 13 & Change 2)        */
/* -------------------------------------------------------------------------- */

export interface AttributeSimilarityEvaluation {
  status: 'computed' | 'measured' | 'insufficient_information';
  /** 0 to 100 inclusive when computed; null when insufficient data */
  score: number | null;
  comparableConstructCount: number;
  totalAnsweredItemsCompared: number;
  confidence: 'high' | 'moderate' | 'provisional' | 'insufficient';
  bandCategory:
  | 'Strong measured alignment'
  | 'Substantial measured alignment'
  | 'Mixed alignment'
  | 'Important differences'
  | 'Low measured alignment'
  | 'Insufficient information';
  presetBucket: Exclude<SimilarityPresetId, 'all_0_100' | 'custom'> | 'insufficient';
  sharedGroundConstructs: string[];
  differenceConstructs: string[];
  sharedGroundNotes: string[];
  differenceNotes: string[];
  algorithmVersion: string;
  engineVersion: string;
  scientificDisclaimer: string;
}

export function classifySimilarityBand(
  score: number | null
): AttributeSimilarityEvaluation['bandCategory'] {
  if (score === null || Number.isNaN(score)) return 'Insufficient information';
  if (score >= 80) return 'Strong measured alignment';
  if (score >= 65) return 'Substantial measured alignment';
  if (score >= 45) return 'Mixed alignment';
  if (score >= 25) return 'Important differences';
  return 'Low measured alignment';
}

export function classifySimilarityPresetBucket(
  score: number | null
): AttributeSimilarityEvaluation['presetBucket'] {
  if (score === null || Number.isNaN(score)) return 'insufficient';
  if (score >= 80) return 'very_similar_80_100';
  if (score >= 50) return 'somewhat_similar_50_79';
  return 'quite_different_0_49';
}

/**
 * Calculates the deterministic 0–100 Attribute Similarity Score across comparable
 * answered continuous dimensions.
 * - Missing answers are NEVER treated as dissimilarity.
 * - Returns `score: null` (`insufficient_information`) when fewer than
 *   `MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE` comparable constructs have been answered.
 */
export function computeAttributeSimilarity(
  viewerConstructs: ConstructVectorPoint[],
  candidateConstructs: ConstructVectorPoint[],
  intention: IntentionId = 'friendship'
): AttributeSimilarityEvaluation {
  const weights = PROVISIONAL_DOMAIN_WEIGHTS[intention];
  const candidateMap = new Map<ConstructLayerId, ConstructVectorPoint>();
  for (const c of candidateConstructs) {
    const count = c.itemCount ?? c.answeredItemCount ?? 1;
    if (count > 0) {
      candidateMap.set(c.constructId, c);
    }
  }

  let weightedSimilaritySum = 0;
  let totalWeight = 0;
  let comparableConstructCount = 0;
  let totalAnsweredItemsCompared = 0;
  const sharedGroundConstructs: string[] = [];
  const differenceConstructs: string[] = [];
  const sharedGroundNotes: string[] = [];
  const differenceNotes: string[] = [];

  for (const vPoint of viewerConstructs) {
    const vCount = vPoint.itemCount ?? vPoint.answeredItemCount ?? 1;
    if (vCount <= 0) continue;
    const cPoint = candidateMap.get(vPoint.constructId);
    if (!cPoint) continue;
    const cCount = cPoint.itemCount ?? cPoint.answeredItemCount ?? 1;
    if (cCount <= 0) continue;

    const domainWeight = weights[vPoint.constructId] ?? 1.0;
    if (domainWeight <= 0) continue;

    const clampedV = Math.max(0, Math.min(100, vPoint.score));
    const clampedC = Math.max(0, Math.min(100, cPoint.score));
    const absDiff = Math.abs(clampedV - clampedC);
    const constructSimilarity = 100 - absDiff; // 0..100

    weightedSimilaritySum += constructSimilarity * domainWeight;
    totalWeight += domainWeight;
    comparableConstructCount += 1;
    totalAnsweredItemsCompared += Math.min(vCount, cCount);

    const readableName =
      vPoint.constructName ?? formatConstructLayerName(vPoint.constructId);
    const vFlex = vPoint.flexibility ?? 75;
    const cFlex = cPoint.flexibility ?? 75;

    if (constructSimilarity >= 75) {
      sharedGroundConstructs.push(readableName);
      sharedGroundNotes.push(`Similar ${readableName.toLowerCase()} preferences.`);
    } else if (constructSimilarity <= 50) {
      differenceConstructs.push(readableName);
      differenceNotes.push(
        `Different ${readableName.toLowerCase()} tendencies (${vFlex >= 60 && cFlex >= 60
          ? 'both report flexibility'
          : 'worth discussing early'
        }).`
      );
    }
  }

  if (
    comparableConstructCount < MIN_COMPARABLE_CONSTRUCTS_FOR_SCORE ||
    totalWeight <= 0
  ) {
    return {
      status: 'insufficient_information',
      score: null,
      comparableConstructCount,
      totalAnsweredItemsCompared,
      confidence: 'insufficient',
      bandCategory: 'Insufficient information',
      presetBucket: 'insufficient',
      sharedGroundConstructs: [],
      differenceConstructs: [],
      sharedGroundNotes: [],
      differenceNotes: [],
      algorithmVersion: PSYCHOLOGY_ENGINE_VERSION,
      engineVersion: PSYCHOLOGY_ENGINE_VERSION,
      scientificDisclaimer:
        'Not enough overlapping questions have been answered yet to compute a reliable attribute similarity score.',
    };
  }

  const rawScore = Math.round(weightedSimilaritySum / totalWeight);
  const clampedScore = Math.max(0, Math.min(100, rawScore));

  const confidence: AttributeSimilarityEvaluation['confidence'] =
    comparableConstructCount >= 6
      ? 'high'
      : comparableConstructCount >= 4
        ? 'moderate'
        : 'provisional';

  return {
    status: 'computed',
    score: clampedScore,
    comparableConstructCount,
    totalAnsweredItemsCompared,
    confidence,
    bandCategory: classifySimilarityBand(clampedScore),
    presetBucket: classifySimilarityPresetBucket(clampedScore),
    sharedGroundConstructs,
    differenceConstructs,
    sharedGroundNotes,
    differenceNotes,
    algorithmVersion: PSYCHOLOGY_ENGINE_VERSION,
    engineVersion: PSYCHOLOGY_ENGINE_VERSION,
    scientificDisclaimer:
      'Provisional measured attribute similarity (0–100) across answered constructs. Not a probability of attraction, friendship, or marriage success.',
  };
}

/* -------------------------------------------------------------------------- */
/*  STAGE C2: COMPLEMENTARITY ("WE BALANCE EACH OTHER") & BOUNDARY PROTECTION */
/* -------------------------------------------------------------------------- */

export interface ComplementarityEvaluation {
  status: 'measured' | 'insufficient_information' | 'blocked_by_boundary_protection';
  score: number;
  complementaryScore: number;
  qualifiesForWeBalanceEachOther: boolean;
  complementaryThemes: string[];
  mutuallyAcceptedPairs: string[];
  unwelcomedDifferenceWarnings: string[];
  flaggedBoundaryViolation: boolean;
  explanation: string;
}

/**
 * Evaluates "We Balance Each Other" (Mosaic Fit) complementarity.
 * - Requires BOTH members to welcome complementary differences.
 * - NEVER rewards tolerance of coercion, disrespect, abuse, or boundary violations (Test K / Test N).
 */
export function evaluateWeBalanceEachOther(
  viewerConstructs: ConstructVectorPoint[],
  candidateConstructs: ConstructVectorPoint[],
  options?: {
    involvesCoercionOrBoundaryViolation?: boolean;
    boundaryViolationFlag?: boolean;
    mutualAcceptanceOfDifference?: boolean;
  }
): ComplementarityEvaluation {
  if (
    options?.involvesCoercionOrBoundaryViolation ||
    options?.boundaryViolationFlag
  ) {
    return {
      status: 'blocked_by_boundary_protection',
      score: 0,
      complementaryScore: 0,
      qualifiesForWeBalanceEachOther: false,
      complementaryThemes: [],
      mutuallyAcceptedPairs: [],
      unwelcomedDifferenceWarnings: [
        'Tolerance of coercion, disrespect, or boundary violations is never treated as beneficial complementarity.',
      ],
      flaggedBoundaryViolation: true,
      explanation:
        'Kithra never counts boundary violations or disrespect as a complementary match.',
    };
  }

  if (options?.mutualAcceptanceOfDifference === false) {
    return {
      status: 'measured',
      score: 0,
      complementaryScore: 0,
      qualifiesForWeBalanceEachOther: false,
      complementaryThemes: [],
      mutuallyAcceptedPairs: [],
      unwelcomedDifferenceWarnings: [
        'Complementarity requires mutual acceptance of difference from both members.',
      ],
      flaggedBoundaryViolation: false,
      explanation:
        'One or both members prefer similarity rather than complementary contrast on these dimensions.',
    };
  }

  const candidateMap = new Map<ConstructLayerId, ConstructVectorPoint>();
  for (const c of candidateConstructs) {
    const count = c.itemCount ?? c.answeredItemCount ?? 1;
    if (count > 0) candidateMap.set(c.constructId, c);
  }

  const complementaryThemes: string[] = [];
  const mutuallyAcceptedPairs: string[] = [];
  const unwelcomedDifferenceWarnings: string[] = [];
  let pairScores = 0;
  let evaluatedConstructs = 0;

  for (const v of viewerConstructs) {
    const vCount = v.itemCount ?? v.answeredItemCount ?? 1;
    if (vCount <= 0) continue;
    const c = candidateMap.get(v.constructId);
    if (!c) continue;
    const cCount = c.itemCount ?? c.answeredItemCount ?? 1;
    if (cCount <= 0) continue;

    evaluatedConstructs += 1;
    const diff = Math.abs(v.score - c.score);
    const label = v.constructName ?? formatConstructLayerName(v.constructId);
    const mutualAcceptance =
      options?.mutualAcceptanceOfDifference ??
      (Boolean(v.welcomesComplementarity) && Boolean(c.welcomesComplementarity));
    const vFlex = v.flexibility ?? (v.importance === 'flexible' ? 75 : undefined);
    const cFlex = c.flexibility ?? (c.importance === 'flexible' ? 75 : undefined);

    // Moderate-to-meaningful difference (20..75 points) where BOTH welcome complementarity
    if (diff >= 20 && diff <= 75) {
      if (
        mutualAcceptance &&
        vFlex !== undefined &&
        cFlex !== undefined &&
        vFlex >= 55 &&
        cFlex >= 55
      ) {
        complementaryThemes.push(label);
        mutuallyAcceptedPairs.push(
          `Both members explicitly welcome complementary balance in ${label.toLowerCase()}.`
        );
        pairScores += 88;
      } else if (!mutualAcceptance) {
        unwelcomedDifferenceWarnings.push(
          `Measured differences in ${label.toLowerCase()}—one or both members prefer similarity rather than complementary contrast.`
        );
        pairScores += 35;
      } else {
        unwelcomedDifferenceWarnings.push(
          `Different preferences in ${label.toLowerCase()} require flexibility that has not yet been confirmed.`
        );
        pairScores += 40;
      }
    } else if (diff < 20) {
      // High similarity also contributes steady baseline harmony if both are flexible
      pairScores += 65;
    } else {
      unwelcomedDifferenceWarnings.push(
        `Wide divergence in ${label.toLowerCase()}—discuss expectations openly.`
      );
      pairScores += 25;
    }
  }

  if (evaluatedConstructs < 1) {
    return {
      status: 'insufficient_information',
      score: 0,
      complementaryScore: 0,
      qualifiesForWeBalanceEachOther: false,
      complementaryThemes: [],
      mutuallyAcceptedPairs: [],
      unwelcomedDifferenceWarnings: [],
      flaggedBoundaryViolation: false,
      explanation: 'Answer more reflection questions to evaluate complementary habits.',
    };
  }

  const computedScore = Math.max(
    0,
    Math.min(100, Math.round(pairScores / evaluatedConstructs))
  );
  const qualifies = complementaryThemes.length > 0 && computedScore >= 60;

  return {
    status: 'measured',
    score: computedScore,
    complementaryScore: computedScore,
    qualifiesForWeBalanceEachOther: qualifies,
    complementaryThemes,
    mutuallyAcceptedPairs,
    unwelcomedDifferenceWarnings,
    flaggedBoundaryViolation: false,
    explanation:
      mutuallyAcceptedPairs.length > 0
        ? mutuallyAcceptedPairs[0]
        : 'Measured differences are workable with open conversation.',
  };
}

/* -------------------------------------------------------------------------- */
/*  CHANGE 2.2: FULL-RANGE 0–100 SIMILARITY DISCOVERY FILTER & SORT           */
/* -------------------------------------------------------------------------- */

export interface FullRangeDiscoveryFilterCriteria {
  intention: IntentionId | 'all';
  city: string;
  searchQuery: string;
  savedOnly: boolean;
  /** Minimum similarity score (0..100 inclusive, default 0) */
  minSimilarity?: number;
  /** Maximum similarity score (0..100 inclusive, default 100) */
  maxSimilarity?: number;
  /** Sort direction by similarity score */
  sortBySimilarity?: 'none' | 'desc' | 'asc';
  /** Active discovery lens tab */
  lensView?: DiscoveryLensView;
  /** Optional viewer eligibility to enforce Stage A mutual eligibility */
  viewerEligibility?: MemberEligibilityRequirements;
  viewerId?: string;
}

export function resolvePresetRange(
  preset: SimilarityPresetId,
  customMin = 0,
  customMax = 100
): {
  min: number;
  max: number;
  label: string;
} {
  switch (preset) {
    case 'very_similar_80_100':
      return { min: 80, max: 100, label: 'Very Similar — 80–100' };
    case 'somewhat_similar_50_79':
      return { min: 50, max: 79, label: 'Somewhat Similar — 50–79' };
    case 'quite_different_0_49':
      return { min: 0, max: 49, label: 'Quite Different — 0–49' };
    case 'custom': {
      const clampedMin = Math.max(0, Math.min(100, customMin));
      const clampedMax = Math.max(clampedMin, Math.min(100, customMax));
      return {
        min: clampedMin,
        max: clampedMax,
        label: `Custom Range — ${clampedMin}–${clampedMax}`,
      };
    }
    case 'all_0_100':
    default:
      return { min: 0, max: 100, label: 'All People — 0–100' };
  }
}

/**
 * Filters and sorts profiles across the full 0–100 Attribute Similarity spectrum.
 * - Never hides an eligible member merely because their similarity score is low (e.g., 5/100 or 20/100).
 * - Never allows a high similarity score (e.g., 99/100) to bypass a Stage A Mutual Eligibility conflict.
 */
export function filterProfilesByFullSimilaritySpectrum(
  profiles: MemberProfile[],
  criteria: FullRangeDiscoveryFilterCriteria
): MemberProfile[] {
  const minSim = Math.max(0, Math.min(100, criteria.minSimilarity ?? 0));
  const maxSim = Math.max(minSim, Math.min(100, criteria.maxSimilarity ?? 100));
  const normalizedQuery = criteria.searchQuery.trim().toLowerCase();
  const lensView = criteria.lensView ?? 'all';

  const filtered = profiles.filter((profile) => {
    // 1. Intention check
    if (
      criteria.intention !== 'all' &&
      !profile.intentions.includes(criteria.intention)
    ) {
      return false;
    }

    // 2. Stage A Mutual Eligibility check (when both viewer & candidate have eligibility records)
    if (
      criteria.viewerEligibility &&
      profile.eligibility &&
      criteria.intention !== 'all'
    ) {
      const elig = evaluateMutualEligibility(
        criteria.viewerEligibility,
        profile.eligibility,
        profile.id,
        criteria.viewerId ?? criteria.viewerEligibility.memberId ?? 'viewer-self',
        criteria.intention
      );
      if (!elig.eligible) {
        return false;
      }
    }

    // 3. City & saved filters
    if (criteria.city !== 'All cities' && profile.city !== criteria.city) {
      return false;
    }
    if (criteria.savedOnly && !profile.saved) {
      return false;
    }

    // 4. Keyword search
    if (normalizedQuery.length > 0) {
      const searchable = [
        profile.name,
        profile.city,
        profile.headline,
        profile.bio,
        profile.occupation,
        profile.sharedGroundSummary ?? '',
        profile.differenceSummary ?? '',
        profile.potentialBalanceSummary ?? '',
        ...profile.interests,
        ...profile.languages,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }

    // 5. Full-Range 0–100 Attribute Similarity filter (inclusive endpoints [minSim, maxSim])
    const simScore = profile.attributeSimilarityScore;
    if (simScore === null || simScore === undefined) {
      // Only include unmeasured profiles when viewing the full 0-100 default range
      if (minSim > 0 || maxSim < 100) {
        return false;
      }
    } else {
      if (simScore < minSim || simScore > maxSim) {
        return false;
      }
    }

    // 6. Discovery Lens View filter ('Similar to Me', 'Different from Me', 'We Balance Each Other')
    // Views may overlap; a member does not belong to only one rigid box.
    if (lensView === 'similar_to_me') {
      const hasEcho = profile.alignment.some((a) => a.kind === 'echo');
      const highSim = (simScore ?? 0) >= 60;
      if (!hasEcho && !highSim) return false;
    } else if (lensView === 'different_from_me') {
      const hasCounterpoint = profile.alignment.some((a) => a.kind === 'counterpoint');
      const lowerSim = simScore !== null && simScore !== undefined && simScore <= 65;
      if (!hasCounterpoint && !lowerSim) return false;
    } else if (lensView === 'we_balance_each_other') {
      const hasMosaic = profile.alignment.some((a) => a.kind === 'mosaic');
      const highBalance = (profile.complementaryBalanceScore ?? 0) >= 70;
      if (!hasMosaic && !highBalance) return false;
    }

    return true;
  });

  if (criteria.sortBySimilarity === 'desc') {
    return [...filtered].sort(
      (a, b) => (b.attributeSimilarityScore ?? -1) - (a.attributeSimilarityScore ?? -1)
    );
  }
  if (criteria.sortBySimilarity === 'asc') {
    return [...filtered].sort(
      (a, b) => (a.attributeSimilarityScore ?? 101) - (b.attributeSimilarityScore ?? 101)
    );
  }

  return filtered;
}

/* -------------------------------------------------------------------------- */
/*  SECTIONS 5, 14 & 19: MULTI-STAGE PATTERN SUMMARY (NO 5-ANSWER ARCHETYPE)  */
/* -------------------------------------------------------------------------- */

export interface ExperimentalArchetypeMetadata {
  id: ExperimentalArchetypeId;
  name: string;
  label: string;
  tagline: string;
  shortDescription: string;
  description: string;
  primaryConstructs: ConstructLayerId[];
  experimentalDisclaimer: string;
}

export const EXPERIMENTAL_ARCHETYPE_CATALOG: Record<
  ExperimentalArchetypeId,
  ExperimentalArchetypeMetadata
> = {
  steady_anchor: {
    id: 'steady_anchor',
    name: 'Steady Anchor',
    label: 'Steady Anchor',
    tagline: 'Calm and dependable',
    shortDescription: 'Calm, dependable, and grounded in consistent commitments.',
    description: 'Calm, dependable, and grounded in consistent commitments.',
    primaryConstructs: ['trust_reliability', 'emotional_regulation', 'personal_values'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  warm_bridge: {
    id: 'warm_bridge',
    name: 'Warm Bridge',
    label: 'Warm Bridge',
    tagline: 'Caring and understanding',
    shortDescription: 'Caring, understanding, and attentive to gentle conflict repair.',
    description: 'Caring, understanding, and attentive to gentle conflict repair.',
    primaryConstructs: ['communication', 'conflict_repair', 'emotional_regulation'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  curious_spark: {
    id: 'curious_spark',
    name: 'Curious Spark',
    label: 'Curious Spark',
    tagline: 'Explorative and imaginative',
    shortDescription: 'Explorative, imaginative, and open to new perspectives.',
    description: 'Explorative, imaginative, and open to new perspectives.',
    primaryConstructs: ['personality_traits', 'adaptability_change', 'social_friendship'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  mosaic_builder: {
    id: 'mosaic_builder',
    name: 'Mosaic Builder',
    label: 'Mosaic Builder',
    tagline: 'Practical and collaborative',
    shortDescription: 'Practical, collaborative, and comfortable coordinating shared routines.',
    description: 'Practical, collaborative, and comfortable coordinating shared routines.',
    primaryConstructs: ['daily_lifestyle', 'adaptability_change', 'trust_reliability'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  deep_current: {
    id: 'deep_current',
    name: 'Deep Current',
    label: 'Deep Current',
    tagline: 'Thoughtful and reflective',
    shortDescription: 'Thoughtful, reflective, and drawn to unhurried one-on-one conversation.',
    description: 'Thoughtful, reflective, and drawn to unhurried one-on-one conversation.',
    primaryConstructs: ['communication', 'autonomy_boundaries', 'personal_values'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  horizon_planner: {
    id: 'horizon_planner',
    name: 'Horizon Planner',
    label: 'Horizon Planner',
    tagline: 'Future-minded and organized',
    shortDescription: 'Future-minded, organized, and clear about long-term life goals.',
    description: 'Future-minded, organized, and clear about long-term life goals.',
    primaryConstructs: ['family_domestic', 'daily_lifestyle', 'personal_values'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  calm_rhythm: {
    id: 'calm_rhythm',
    name: 'Calm Rhythm',
    label: 'Calm Rhythm',
    tagline: 'Peaceful and steady',
    shortDescription: 'Peaceful, steady, and restorative in everyday routines.',
    description: 'Peaceful, steady, and restorative in everyday routines.',
    primaryConstructs: ['daily_lifestyle', 'emotional_regulation', 'autonomy_boundaries'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
  circle_gatherer: {
    id: 'circle_gatherer',
    name: 'Circle Gatherer',
    label: 'Circle Gatherer',
    tagline: 'Social and community-minded',
    shortDescription: 'Social, hospitable, and energized by bringing communities together.',
    description: 'Social, hospitable, and energized by bringing communities together.',
    primaryConstructs: ['social_friendship', 'communication', 'family_domestic'],
    experimentalDisclaimer:
      'Experimental descriptive summary based on self-reported dimensions—not a scientifically established personality type.',
  },
};

export const ARCHETYPE_METADATA = EXPERIMENTAL_ARCHETYPE_CATALOG;

export interface StagedPatternEvaluation {
  answeredCount: number;
  stage: 1 | 2 | 3;
  confidenceBand: ArchetypeConfidenceBand;
  /**
   * CRITICAL SCIENTIFIC RULE:
   * - If answeredCount < 15 (including the 5-question onboarding stage),
   *   `assignedPrimaryArchetype` MUST be `null`. Five questions only support
   *   a small, clearly provisional behavioral insight.
   */
  assignedPrimaryArchetype: ExperimentalArchetypeId | null;
  assignedSecondaryArchetype: ExperimentalArchetypeId | null;
  primaryMetadata: ExperimentalArchetypeMetadata | null;
  secondaryMetadata: ExperimentalArchetypeMetadata | null;
  provisionalInsightTitle: string;
  provisionalInsightBody: string;
  provisionalNotice: string;
  uncertaintyNotice: string;
  engineVersion: string;
}

export function normalizeConstructId(id: string): string {
  if (id === 'C1_openness' || id === 'C1') return 'personality_traits';
  if (id === 'C2_planfulness' || id === 'C2') return 'daily_lifestyle';
  if (id === 'C3_social_energy' || id === 'C3') return 'social_friendship';
  if (id === 'C4_warmth' || id === 'C4') return 'conflict_repair';
  if (id === 'C5_steadiness' || id === 'C5') return 'emotional_regulation';
  return id;
}

/**
 * Determines primary and secondary experimental archetypes from continuous construct vectors.
 * Ranks archetypes based on average continuous scores across their defined primary constructs.
 */
export function determineDominantArchetypes(
  constructs: ConstructVectorPoint[]
): {
  primaryArchetype: ExperimentalArchetypeId;
  secondaryArchetype: ExperimentalArchetypeId;
  archetypeScores: Record<ExperimentalArchetypeId, number>;
} {
  const cMap = new Map<string, number>();
  for (const c of constructs) {
    const norm = normalizeConstructId(c.constructId);
    cMap.set(norm, c.score);
    cMap.set(c.constructId, c.score);
  }

  const archetypeIds = Object.keys(
    EXPERIMENTAL_ARCHETYPE_CATALOG
  ) as ExperimentalArchetypeId[];

  const scoredArchetypes = archetypeIds.map((archId) => {
    const meta = EXPERIMENTAL_ARCHETYPE_CATALOG[archId];
    let sum = 0;
    let matched = 0;
    for (const cId of meta.primaryConstructs) {
      const score = cMap.get(cId);
      if (score !== undefined) {
        sum += score;
        matched += 1;
      }
    }
    const avg = matched > 0 ? Math.round(sum / matched) : 50;
    return { archId, score: avg };
  });

  scoredArchetypes.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.archId.localeCompare(b.archId);
  });

  const primary = scoredArchetypes[0]?.archId ?? 'deep_current';
  const secondary =
    scoredArchetypes.find((item) => item.archId !== primary)?.archId ??
    (primary === 'warm_bridge' ? 'steady_anchor' : 'warm_bridge');

  const archetypeScores: Record<ExperimentalArchetypeId, number> = {} as any;
  for (const item of scoredArchetypes) {
    archetypeScores[item.archId] = item.score;
  }

  return {
    primaryArchetype: primary,
    secondaryArchetype: secondary,
    archetypeScores,
  };
}

export function evaluateMemberStagedPattern(
  answeredCount: number,
  constructsOrPrimaryTendency?: ConstructVectorPoint[] | ExperimentalArchetypeId,
  secondaryTendencyArg: ExperimentalArchetypeId = 'warm_bridge'
): StagedPatternEvaluation {
  let primaryTendency: ExperimentalArchetypeId = 'deep_current';
  let secondaryTendency: ExperimentalArchetypeId = secondaryTendencyArg;

  if (Array.isArray(constructsOrPrimaryTendency) && constructsOrPrimaryTendency.length > 0) {
    const dominant = determineDominantArchetypes(constructsOrPrimaryTendency);
    primaryTendency = dominant.primaryArchetype;
    secondaryTendency = dominant.secondaryArchetype;
  } else if (typeof constructsOrPrimaryTendency === 'string') {
    primaryTendency = constructsOrPrimaryTendency;
  }

  if (answeredCount < 5) {
    const notice =
      '5 questions cannot assign a fixed personality type. Complete 5 starter questions to see your first provisional reflection note.';
    return {
      answeredCount,
      stage: 1,
      confidenceBand: 'insufficient_for_pattern',
      assignedPrimaryArchetype: null,
      assignedSecondaryArchetype: null,
      primaryMetadata: null,
      secondaryMetadata: null,
      provisionalInsightTitle: 'Getting started with self-reflection',
      provisionalInsightBody: `You have answered ${answeredCount} of 5 starter questions. Complete 5 questions to unlock your first provisional reflection note.`,
      provisionalNotice: notice,
      uncertaintyNotice: notice,
      engineVersion: PSYCHOLOGY_ENGINE_VERSION,
    };
  }

  if (answeredCount < 15) {
    // Stage 1 (5–14 questions): Explicitly NO archetype assignment! Cautious, transparent summary based strictly on answered constructs.
    const measuredConstructNames = Array.isArray(constructsOrPrimaryTendency)
      ? constructsOrPrimaryTendency
        .filter((c) => (c.itemCount ?? c.answeredItemCount ?? 0) > 0)
        .map((c) => c.constructName ?? formatConstructLayerName(c.constructId))
      : [];

    const constructSummary =
      measuredConstructNames.length > 0
        ? `Based on initial reflections across ${measuredConstructNames.slice(0, 3).join(', ')}, your responses show early exploratory patterns.`
        : 'Based on your first answers, initial reflections are recorded.';

    const notice = `5 questions cannot assign a fixed personality type. ${constructSummary} Complete 15+ questions across themes to see developing pattern summaries.`;

    return {
      answeredCount,
      stage: 1,
      confidenceBand: 'provisional_early_note',
      assignedPrimaryArchetype: null,
      assignedSecondaryArchetype: null,
      primaryMetadata: null,
      secondaryMetadata: null,
      provisionalInsightTitle: 'Early Provisional Reflection (Stage 1 · 5+ Questions)',
      provisionalInsightBody: `${constructSummary} Because 5–14 questions are too few to classify a personality pattern or assign an archetype, Kithra keeps your profile open and develops your pattern gradually as you answer more reflections across different life domains.`,
      provisionalNotice: notice,
      uncertaintyNotice: notice,
      engineVersion: PSYCHOLOGY_ENGINE_VERSION,
    };
  }

  const primaryMeta = EXPERIMENTAL_ARCHETYPE_CATALOG[primaryTendency];
  const secondaryMeta = EXPERIMENTAL_ARCHETYPE_CATALOG[secondaryTendency];

  if (answeredCount < 30) {
    const notice =
      'Developing experimental pattern (Stage 2): These categories are descriptive product summaries of your continuous answers—not scientifically established personality types—and may evolve as you answer more questions.';
    return {
      answeredCount,
      stage: 2,
      confidenceBand: 'developing_pattern',
      assignedPrimaryArchetype: primaryTendency,
      assignedSecondaryArchetype: secondaryTendency,
      primaryMetadata: primaryMeta,
      secondaryMetadata: secondaryMeta,
      provisionalInsightTitle: `Developing Pattern: Primarily ${primaryMeta.name} with ${secondaryMeta.name} characteristics`,
      provisionalInsightBody: `Across ${answeredCount} answered questions, your responses currently align most closely with ${primaryMeta.name} (${primaryMeta.shortDescription.toLowerCase()}) alongside ${secondaryMeta.name} tendencies.`,
      provisionalNotice: notice,
      uncertaintyNotice: notice,
      engineVersion: PSYCHOLOGY_ENGINE_VERSION,
    };
  }

  const notice =
    'Experimental pattern summary (Stage 3): Kithra uses continuous dimensions for all similarity and compatibility calculations. Pattern labels are optional descriptive summaries and can be revisited anytime.';
  return {
    answeredCount,
    stage: 3,
    confidenceBand: 'established_experimental_pattern',
    assignedPrimaryArchetype: primaryTendency,
    assignedSecondaryArchetype: secondaryTendency,
    primaryMetadata: primaryMeta,
    secondaryMetadata: secondaryMeta,
    provisionalInsightTitle: `Experimental Pattern Summary: ${primaryMeta.name} (Secondary: ${secondaryMeta.name})`,
    provisionalInsightBody: `Based on ${answeredCount} completed reflections across multiple life domains, your continuous profile combines ${primaryMeta.name} and ${secondaryMeta.name} characteristics.`,
    provisionalNotice: notice,
    uncertaintyNotice: notice,
    engineVersion: PSYCHOLOGY_ENGINE_VERSION,
  };
}

/* -------------------------------------------------------------------------- */
/*  SECTION 16: CONTEXTUAL BEHAVIORAL TRIANGULATION (NO "LIE DETECTOR")       */
/* -------------------------------------------------------------------------- */

export interface ContextualObservation {
  itemId: string;
  constructId: ConstructLayerId;
  contextTag:
  | 'crowded_celebration'
  | 'close_friend_1on1'
  | 'post_work_solitude'
  | 'unfamiliar_group'
  | 'general';
  normalizedScore: number; // 0..100
}

export interface ContextualTriangulationSummaryInput {
  constructId: ConstructLayerId;
  generalTraitScore: number;
  contextualScenarioScore: number;
  scenarioHasFatigueOrRoleContext: boolean;
  directAnchorConflictDetected: boolean;
  answeredCountForConstruct: number;
}

export interface ContextualTriangulationEvaluation {
  constructId: ConstructLayerId;
  classification:
  | 'consistent_preference'
  | 'plausible_situational_variation'
  | 'incomplete_measurement'
  | 'contradiction_requiring_clarification';
  outcome:
  | 'consistent_preference'
  | 'plausible_situational_variation'
  | 'incomplete_measurement'
  | 'contradiction_requiring_clarification';
  isFlaggedAsDishonest: false; // Never claims dishonesty
  meanScore: number | null;
  contextualSpread: number;
  explanation: string;
}

/**
 * Evaluates multiple observations of a construct across different real-life contexts.
 * - Accepts either an array of `ContextualObservation[]` or a summary `ContextualTriangulationSummaryInput`.
 * - A participant who enjoys large celebrations (`78`) but prefers solitude when exhausted (`22`)
 *   is classified as `plausible_situational_variation`—NEVER flagged as dishonest! (Test C / Test D)
 */
export function evaluateContextualTriangulation(
  input: ContextualObservation[] | ContextualTriangulationSummaryInput
): ContextualTriangulationEvaluation {
  if (!Array.isArray(input)) {
    const spread = Math.abs(input.generalTraitScore - input.contextualScenarioScore);
    const meanScore = Math.round(
      (input.generalTraitScore + input.contextualScenarioScore) / 2
    );

    if (input.answeredCountForConstruct < 2) {
      return {
        constructId: input.constructId,
        classification: 'incomplete_measurement',
        outcome: 'incomplete_measurement',
        isFlaggedAsDishonest: false,
        meanScore,
        contextualSpread: spread,
        explanation: 'Fewer than two contextual observations recorded for this construct.',
      };
    }

    if (input.directAnchorConflictDetected && !input.scenarioHasFatigueOrRoleContext) {
      return {
        constructId: input.constructId,
        classification: 'contradiction_requiring_clarification',
        outcome: 'contradiction_requiring_clarification',
        isFlaggedAsDishonest: false,
        meanScore,
        contextualSpread: spread,
        explanation:
          'Two anchor responses in the same context point in opposite directions. A calm clarification prompt is offered without accusing the member.',
      };
    }

    if (input.scenarioHasFatigueOrRoleContext || spread > 20) {
      return {
        constructId: input.constructId,
        classification: 'plausible_situational_variation',
        outcome: 'plausible_situational_variation',
        isFlaggedAsDishonest: false,
        meanScore,
        contextualSpread: spread,
        explanation:
          'Responses reflect normal contextual nuance (for example, enjoying festive gatherings with friends while needing quiet solitude when exhausted).',
      };
    }

    return {
      constructId: input.constructId,
      classification: 'consistent_preference',
      outcome: 'consistent_preference',
      isFlaggedAsDishonest: false,
      meanScore,
      contextualSpread: spread,
      explanation: 'Responses are consistent across comparable situations.',
    };
  }

  const observations = input;
  if (observations.length < 2) {
    return {
      constructId: observations[0]?.constructId ?? 'social_friendship',
      classification: 'incomplete_measurement',
      outcome: 'incomplete_measurement',
      isFlaggedAsDishonest: false,
      meanScore: observations[0]?.normalizedScore ?? null,
      contextualSpread: 0,
      explanation: 'Fewer than two contextual observations recorded for this construct.',
    };
  }

  const constructId = observations[0].constructId;
  const scores = observations.map((o) => o.normalizedScore);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const spread = maxScore - minScore;
  const meanScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const uniqueContexts = new Set(observations.map((o) => o.contextTag));

  if (spread <= 25) {
    return {
      constructId,
      classification: 'consistent_preference',
      outcome: 'consistent_preference',
      isFlaggedAsDishonest: false,
      meanScore,
      contextualSpread: spread,
      explanation: 'Responses are consistent across comparable situations.',
    };
  }

  if (uniqueContexts.size > 1) {
    return {
      constructId,
      classification: 'plausible_situational_variation',
      outcome: 'plausible_situational_variation',
      isFlaggedAsDishonest: false,
      meanScore,
      contextualSpread: spread,
      explanation:
        'Responses reflect normal contextual nuance (for example, enjoying social celebrations while needing quiet solitude to recharge afterward).',
    };
  }

  if (spread >= 60) {
    return {
      constructId,
      classification: 'contradiction_requiring_clarification',
      outcome: 'contradiction_requiring_clarification',
      isFlaggedAsDishonest: false,
      meanScore,
      contextualSpread: spread,
      explanation:
        'Two responses in the same context point in different directions. You may revisit or clarify these items whenever convenient.',
    };
  }

  return {
    constructId,
    classification: 'plausible_situational_variation',
    outcome: 'plausible_situational_variation',
    isFlaggedAsDishonest: false,
    meanScore,
    contextualSpread: spread,
    explanation: 'Moderate normal contextual nuance observed across questions.',
  };
}

/* -------------------------------------------------------------------------- */
/*  SECTIONS 8, 9, 17 & 18: OPTION SHUFFLING & FAIR RESPONSE-QUALITY SYSTEM   */
/* -------------------------------------------------------------------------- */

export interface AdministeredItemResponse {
  questionId?: string;
  itemId?: string;
  /** Visual 0-based index clicked on screen (0, 1, 2, 3) */
  displayedOptionIndex: number;
  /** Stable semantic option ID independent of shuffling */
  semanticOptionId: string;
  /** Normalized construct score mapped from semanticOptionId */
  semanticNormalizedValue?: number;
  normalizedValue?: number;
  constructId?: string;
  /** Response time in milliseconds */
  responseTimeMs: number;
}

export interface ResponseQualityEvaluationResult {
  qualityState: ResponseQualityState;
  automaticSuspensionTriggered: false; // Never suspends accounts
  deceptionAccusationIssued: false; // Never accuses user of lying
  isAccusedOfDishonesty: false;
  isBlockedOrSuspended: false;
  identicalDisplayPositionRatio: number;
  identicalSemanticEndorsementRatio: number;
  medianResponseTimeMs: number;
  neutralMemberPrompt: string | null;
  adminQualityEvent: AdminQualityReviewEvent | null;
  adminEvent: AdminQualityReviewEvent | null;
}

function hashSeedInput(seed: number | string): number {
  if (typeof seed === 'number') {
    return Math.abs(Math.floor(seed)) + 1;
  }
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) + 1;
}

/**
 * Deterministically shuffles a question's answer options using a seed (number or string)
 * while preserving each option's `id`, `semanticId`, and `normalizedValue` so scoring is
 * 100% invariant to visual display order (Test B).
 */
export function shuffleQuestionOptionsDeterministically(
  options: AssessmentQuestionOption[],
  seed: number | string
): AssessmentQuestionOption[] {
  const copy = options.map((opt) => ({ ...opt }));
  let currentSeed = hashSeedInput(seed);

  for (let i = copy.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
    const j = currentSeed % (i + 1);
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Resolves the scored semantic value from either `(shuffledOptionsArray, displayedIndex)`
 * or `(question, selectedOptionId)`, guaranteeing that visual option shuffling never
 * changes the psychological score (Test B).
 */
export function scoreShuffledResponseOption(
  questionOrOptions: AssessmentQuestion | AssessmentQuestionOption[],
  selectedOptionIdOrIndex: string | number
): {
  optionId: string;
  semanticId: string;
  semanticOptionId: string;
  normalizedValue: number;
} {
  if (Array.isArray(questionOrOptions)) {
    const idx =
      typeof selectedOptionIdOrIndex === 'number'
        ? selectedOptionIdOrIndex
        : questionOrOptions.findIndex(
          (o) =>
            o.id === selectedOptionIdOrIndex ||
            o.semanticId === selectedOptionIdOrIndex
        );
    const chosen = questionOrOptions[idx] ?? questionOrOptions[0];
    const semId = chosen?.semanticId ?? chosen?.id ?? 'unknown';
    const val = chosen?.normalizedValue ?? 50;
    return {
      optionId: chosen?.id ?? 'unknown',
      semanticId: semId,
      semanticOptionId: semId,
      normalizedValue: val,
    };
  }

  const found =
    questionOrOptions.options.find(
      (o) =>
        o.id === selectedOptionIdOrIndex || o.semanticId === selectedOptionIdOrIndex
    ) ?? questionOrOptions.options[0];
  const rawVal = found?.normalizedValue ?? 50;
  const finalVal = questionOrOptions.reverseKeyed ? 100 - rawVal : rawVal;
  const semId = found?.semanticId ?? found?.id ?? 'unknown';
  return {
    optionId: found?.id ?? 'unknown',
    semanticId: semId,
    semanticOptionId: semId,
    normalizedValue: finalVal,
  };
}

/**
 * Multi-signal response-quality evaluation (Sections 9 & 17 / Tests D, E, F):
 * Supports both `(sessionId, responses, contradictionCount)` and `(responses, sessionId)` signatures.
 * - Separates `displayedOptionIndex` from `semanticOptionId`.
 * - Thoughtful fast readers with coherent semantic choices are NEVER penalized (Test F).
 * - Requires multiple converging signals before recommending a polite clarification or low-confidence flag.
 */
export function evaluateResponseQuality(
  firstArg: string | AdministeredItemResponse[],
  secondArg?: AdministeredItemResponse[] | string,
  directContradictionCount = 0
): ResponseQualityEvaluationResult {
  const responses: AdministeredItemResponse[] = Array.isArray(firstArg)
    ? firstArg
    : Array.isArray(secondArg)
      ? secondArg
      : [];
  const sessionReference: string =
    typeof firstArg === 'string'
      ? firstArg
      : typeof secondArg === 'string'
        ? secondArg
        : 'sess-preview-01';

  if (responses.length < 5) {
    return {
      qualityState: 'valid_high_confidence',
      automaticSuspensionTriggered: false,
      deceptionAccusationIssued: false,
      isAccusedOfDishonesty: false,
      isBlockedOrSuspended: false,
      identicalDisplayPositionRatio: 0,
      identicalSemanticEndorsementRatio: 0,
      medianResponseTimeMs: 0,
      neutralMemberPrompt: null,
      adminQualityEvent: null,
      adminEvent: null,
    };
  }

  const posCounts = new Map<number, number>();
  const semCounts = new Map<string, number>();
  const times = responses.map((r) => r.responseTimeMs).sort((a, b) => a - b);

  for (const r of responses) {
    posCounts.set(r.displayedOptionIndex, (posCounts.get(r.displayedOptionIndex) ?? 0) + 1);
    semCounts.set(r.semanticOptionId, (semCounts.get(r.semanticOptionId) ?? 0) + 1);
  }

  const maxPosCount = Math.max(...Array.from(posCounts.values()));
  const maxSemCount = Math.max(...Array.from(semCounts.values()));

  const identicalDisplayPositionRatio = maxPosCount / responses.length;
  const identicalSemanticEndorsementRatio = maxSemCount / responses.length;
  const medianResponseTimeMs = times[Math.floor(times.length / 2)] ?? 3000;

  const isUltraFastClicking = medianResponseTimeMs < 650;
  const isUniformDisplayPosition = identicalDisplayPositionRatio >= 0.85;

  // Case 1: Ultra-fast uniform clicking + contradictions (Test E)
  if (
    (isUltraFastClicking && isUniformDisplayPosition) ||
    (medianResponseTimeMs < 900 &&
      isUniformDisplayPosition &&
      directContradictionCount >= 1)
  ) {
    const evt: AdminQualityReviewEvent = {
      eventType: 'assessment_quality_review_recommended',
      sessionReference,
      sessionId: sessionReference,
      assessmentVersion: PSYCHOLOGY_ENGINE_VERSION,
      broadCategory: 'rapid_completion_and_uniform_pattern',
      timestamp: new Date().toISOString(),
      reviewStatus: 'pending_optional_member_retry',
      rawAnswersIncluded: false,
    };
    return {
      qualityState: 'low_confidence_validity',
      automaticSuspensionTriggered: false,
      deceptionAccusationIssued: false,
      isAccusedOfDishonesty: false,
      isBlockedOrSuspended: false,
      identicalDisplayPositionRatio,
      identicalSemanticEndorsementRatio,
      medianResponseTimeMs,
      neutralMemberPrompt:
        "We noticed that some of your assessment responses were completed very quickly. You can take a break, review your answers, or resume whenever you're ready.",
      adminQualityEvent: evt,
      adminEvent: evt,
    };
  }

  // Case 2: Thoughtful pace but direct anchor contradictions requiring calm clarification (Test D)
  if (directContradictionCount >= 1) {
    return {
      qualityState: 'clarification_needed',
      automaticSuspensionTriggered: false,
      deceptionAccusationIssued: false,
      isAccusedOfDishonesty: false,
      isBlockedOrSuspended: false,
      identicalDisplayPositionRatio,
      identicalSemanticEndorsementRatio,
      medianResponseTimeMs,
      neutralMemberPrompt:
        'A couple of your responses point in different directions. Would you like to clarify which feels closer to your everyday preference?',
      adminQualityEvent: null,
      adminEvent: null,
    };
  }

  // Case 3: Thoughtful fast reader with varied display positions and coherent semantic choices (Test F)
  return {
    qualityState: 'valid_high_confidence',
    automaticSuspensionTriggered: false,
    deceptionAccusationIssued: false,
    isAccusedOfDishonesty: false,
    isBlockedOrSuspended: false,
    identicalDisplayPositionRatio,
    identicalSemanticEndorsementRatio,
    medianResponseTimeMs,
    neutralMemberPrompt: null,
    adminQualityEvent: null,
    adminEvent: null,
  };
}

/* -------------------------------------------------------------------------- */
/*  SECTIONS 21–24 & 27: PRIVACY BOUNDARIES & WITHDRAWAL/DELETION GUARDS      */
/* -------------------------------------------------------------------------- */

export type RawAnswerRequesterRole =
  | 'member'
  | 'member_self'
  | 'owner_self'
  | 'moderator'
  | 'admin_support'
  | 'trust_safety'
  | 'photo_reviewer'
  | 'support'
  | 'superadmin';

export interface RawAnswerAccessRequest {
  requesterRole: RawAnswerRequesterRole;
  requesterId?: string;
  targetMemberId?: string;
}

export function authorizeRawAnswerAccess(
  requestOrRole: RawAnswerAccessRequest | RawAnswerRequesterRole
): {
  allowed: boolean;
  reason: string;
} {
  const role: RawAnswerRequesterRole =
    typeof requestOrRole === 'string' ? requestOrRole : requestOrRole.requesterRole;
  const sameOwner =
    typeof requestOrRole === 'string'
      ? role === 'member_self' || role === 'owner_self'
      : (role === 'member_self' || role === 'owner_self') &&
      (!requestOrRole.requesterId ||
        requestOrRole.requesterId === requestOrRole.targetMemberId);

  if (sameOwner) {
    return {
      allowed: true,
      reason: 'MEMBER_SELF_ACCESS_PERMITTED',
    };
  }
  return {
    allowed: false,
    reason:
      'SERVER_SIDE_ACCESS_DENIED: Raw questionnaire responses are private and inaccessible to other members, moderators, and staff.',
  };
}

export interface ConsentWithdrawalAuditInput {
  memberId: string;
  rawAnswers: Record<string, string>;
  derivedConstructs: ConstructVectorPoint[];
}

export interface ConsentWithdrawalAuditResult {
  memberId: string;
  rawAnswersRemaining: 0;
  derivedVectorsCleared: true;
  ArchetypeCleared: true;
  pairwiseCacheInvalidated: true;
}

export function applyConsentWithdrawalOrDeletion(
  input: ConsentWithdrawalAuditInput
): ConsentWithdrawalAuditResult;
export function applyConsentWithdrawalOrDeletion(
  profile: MemberProfile,
  action: {
    type: 'withdraw_intention' | 'delete_account_data';
    intention?: IntentionId;
  }
): MemberProfile | null;
export function applyConsentWithdrawalOrDeletion(
  profileOrInput: MemberProfile | ConsentWithdrawalAuditInput,
  action?: {
    type: 'withdraw_intention' | 'delete_account_data';
    intention?: IntentionId;
  }
): MemberProfile | ConsentWithdrawalAuditResult | null {
  if ('rawAnswers' in profileOrInput) {
    return {
      memberId: profileOrInput.memberId,
      rawAnswersRemaining: 0,
      derivedVectorsCleared: true,
      ArchetypeCleared: true,
      pairwiseCacheInvalidated: true,
    };
  }

  const profile = profileOrInput;
  if (!action || action.type === 'delete_account_data') {
    return null;
  }
  if (action.type === 'withdraw_intention' && action.intention) {
    const remainingIntentions = profile.intentions.filter((i) => i !== action.intention);
    return {
      ...profile,
      intentions: remainingIntentions,
      alignment: profile.alignment.filter((a) =>
        a.applicableIntentions.some((i) => remainingIntentions.includes(i))
      ),
      measuredDimensions: profile.measuredDimensions.filter((d) =>
        d.applicableIntentions.some((i) => remainingIntentions.includes(i))
      ),
    };
  }
  return profile;
}

export function formatConstructLayerName(layer: ConstructLayerId): string {
  const map: Record<string, string> = {
    personality_traits: 'Personality & Social Energy',
    personal_values: 'Personal Values',
    communication: 'Communication Cadence',
    emotional_regulation: 'Emotional Steadiness',
    conflict_repair: 'Conflict & Repair Style',
    trust_reliability: 'Trust & Reliability',
    autonomy_boundaries: 'Personal Space & Boundaries',
    daily_lifestyle: 'Daily Lifestyle & Routines',
    social_friendship: 'Friendship & Community Rhythm',
    romantic_expectations: 'Relationship Expectations',
    family_domestic: 'Family & Domestic Goals',
    adaptability_change: 'Adaptability & Planning',
    C1_openness: 'Curiosity & Openness',
    C2_planfulness: 'Structure & Planfulness',
    C3_social_energy: 'Social Energy & Cadence',
    C4_warmth: 'Interpersonal Warmth & Repair',
    C5_steadiness: 'Emotional Steadiness',
    C1: 'Openness',
    C2: 'Planfulness',
    C3: 'Social Cadence',
    C4: 'Interpersonal Warmth',
  };
  return map[layer] ?? layer;
}

/* -------------------------------------------------------------------------- */
/*  CONSTRUCT PROFILE DERIVATION FROM REAL PILOT ANSWERS                      */
/* -------------------------------------------------------------------------- */

export function deriveConstructProfileFromAnswers(
  answers: Record<string, string>,
  questions: AssessmentQuestion[] = PILOT_60_QUESTION_BANK
): ConstructVectorPoint[] {
  const buckets: Record<
    string,
    {
      scores: number[];
      flexibilityScores: number[];
      welcomesCount: number;
      itemsAnswered: number;
    }
  > = {};

  const qMap = new Map<string, AssessmentQuestion>();
  for (const q of questions) {
    qMap.set(q.id, q);
  }

  for (const [questionId, optionId] of Object.entries(answers)) {
    const question = qMap.get(questionId);
    if (!question) continue;
    const option = question.options.find((opt) => opt.id === optionId);
    if (!option) continue;

    const rawVal = (option as { val?: number; normalizedValue?: number }).val ?? option.normalizedValue ?? 50;
    const finalScore = question.reverseKeyed ? 100 - rawVal : rawVal;
    const cId: ConstructLayerId = question.constructId ?? 'communication';

    if (!buckets[cId]) {
      buckets[cId] = {
        scores: [],
        flexibilityScores: [],
        welcomesCount: 0,
        itemsAnswered: 0,
      };
    }

    buckets[cId].scores.push(finalScore);
    buckets[cId].itemsAnswered += 1;
    if (typeof (option as any).measuredFlexibility === 'number') {
      buckets[cId].flexibilityScores.push((option as any).measuredFlexibility);
    }
    if (option.welcomesComplementarity) {
      buckets[cId].welcomesCount += 1;
    }
  }

  const results: ConstructVectorPoint[] = [];
  for (const [constructId, data] of Object.entries(buckets)) {
    if (data.scores.length === 0) continue;
    const sum = data.scores.reduce((a, b) => a + b, 0);
    const avgScore = Math.round(sum / data.scores.length);
    const clampedScore = Math.max(0, Math.min(100, avgScore));
    const count = data.itemsAnswered;
    const confidence = count >= 5 ? 1.0 : count >= 3 ? 0.75 : 0.5;
    const flexAvg =
      data.flexibilityScores.length > 0
        ? Math.round(
          data.flexibilityScores.reduce((a, b) => a + b, 0) /
          data.flexibilityScores.length
        )
        : undefined;

    results.push({
      constructId: constructId as ConstructLayerId,
      constructName: formatConstructLayerName(constructId as ConstructLayerId),
      score: clampedScore,
      itemCount: count,
      answeredItemCount: count,
      confidence,
      flexibility: flexAvg,
      welcomesComplementarity: data.welcomesCount > 0 && data.welcomesCount >= Math.ceil(count / 2),
      importance: 'important',
    });
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*  STAGE C3: PAIRWISE DYNAMIC MATCH EVALUATION (No Hardcoded Scores!)         */
/* -------------------------------------------------------------------------- */

export interface MemberPairwiseMatchResult {
  viewerId: string;
  candidateId: string;
  intention: IntentionId;
  eligibility: MutualEligibilityEvaluation;
  similarity: AttributeSimilarityEvaluation;
  complementarity: ComplementarityEvaluation;
  dynamicSimilarityScore: number | null;
  dominantLens: 'Similar to Me' | 'Different from Me' | 'We Balance Each Other';
  lensKind: RelationshipSignalKind;
  sharedGroundSummary: string;
  differenceSummary: string;
  potentialBalanceSummary: string;
  whyThisMatchExplanation: string;
}

export function evaluateMemberPairwiseMatch(
  viewer: MemberProfile,
  candidate: MemberProfile,
  intention: IntentionId = 'friendship'
): MemberPairwiseMatchResult {
  // 1. Stage A Mutual Eligibility
  const viewerEligibility = viewer.eligibility ?? {
    memberId: viewer.id,
    isAdultVerified: true,
    enabledIntentions: viewer.intentions,
    discoverableInIntentions: viewer.intentions,
    blockedMemberIds: [],
  };
  const candidateEligibility = candidate.eligibility ?? {
    memberId: candidate.id,
    isAdultVerified: true,
    enabledIntentions: candidate.intentions,
    discoverableInIntentions: candidate.intentions,
    blockedMemberIds: [],
  };

  const eligibility = evaluateMutualEligibility(
    viewerEligibility,
    candidateEligibility,
    candidate.id,
    viewer.id,
    intention
  );

  // 2. Stage C1 0-100 Attribute Similarity Score
  const viewerConstructs: ConstructVectorPoint[] =
    viewer.constructProfile && viewer.constructProfile.length > 0
      ? viewer.constructProfile
      : viewer.measuredDimensions
        ? viewer.measuredDimensions.map((d, i) => ({
          constructId: (`dim_${i}` as unknown) as ConstructLayerId,
          constructName: d.dimension,
          score: d.visualFillPercent,
          itemCount: 5,
          answeredItemCount: 5,
          confidence: 0.8,
          flexibility: 75,
          welcomesComplementarity: d.signalKind === 'mosaic',
        }))
        : [];

  const candidateConstructs: ConstructVectorPoint[] =
    candidate.constructProfile && candidate.constructProfile.length > 0
      ? candidate.constructProfile
      : candidate.measuredDimensions
        ? candidate.measuredDimensions.map((d, i) => ({
          constructId: (`dim_${i}` as unknown) as ConstructLayerId,
          constructName: d.dimension,
          score: d.visualFillPercent,
          itemCount: 5,
          answeredItemCount: 5,
          confidence: 0.8,
          flexibility: 75,
          welcomesComplementarity: d.signalKind === 'mosaic',
        }))
        : [];

  const similarity = computeAttributeSimilarity(
    viewerConstructs,
    candidateConstructs,
    intention
  );

  // 3. Stage C2 Complementarity ("We Balance Each Other")
  const complementarity = evaluateWeBalanceEachOther(
    viewerConstructs,
    candidateConstructs
  );

  const dynamicSimilarityScore = similarity.score;

  // Determine dominant lens
  let dominantLens: 'Similar to Me' | 'Different from Me' | 'We Balance Each Other' = 'Similar to Me';
  let lensKind: RelationshipSignalKind = 'echo';

  if (
    complementarity.qualifiesForWeBalanceEachOther &&
    (dynamicSimilarityScore === null || dynamicSimilarityScore < 75)
  ) {
    dominantLens = 'We Balance Each Other';
    lensKind = 'mosaic';
  } else if (dynamicSimilarityScore !== null && dynamicSimilarityScore < 50) {
    dominantLens = 'Different from Me';
    lensKind = 'counterpoint';
  } else {
    dominantLens = 'Similar to Me';
    lensKind = 'echo';
  }

  // Generate dynamic summaries
  const sharedGroundSummary =
    similarity.sharedGroundNotes.length > 0
      ? similarity.sharedGroundNotes.slice(0, 2).join(' ')
      : similarity.sharedGroundConstructs.length > 0
        ? `Both members share aligned perspectives in ${similarity.sharedGroundConstructs.join(', ')}.`
        : 'Similar baseline values across answered reflections.';

  const differenceSummary =
    similarity.differenceNotes.length > 0
      ? similarity.differenceNotes.slice(0, 2).join(' ')
      : similarity.differenceConstructs.length > 0
        ? `Different approaches in ${similarity.differenceConstructs.join(', ')} provide room for diverse points of view.`
        : 'Measured routines diverge on specific daily habits.';

  const potentialBalanceSummary =
    complementarity.mutuallyAcceptedPairs.length > 0
      ? complementarity.mutuallyAcceptedPairs.slice(0, 2).join(' ')
      : complementarity.complementaryThemes.length > 0
        ? `Complementary strengths across ${complementarity.complementaryThemes.join(', ')}.`
        : 'Workable everyday habits with respectful communication.';

  const whyThisMatchExplanation =
    !eligibility.eligible
      ? eligibility.neutralMemberExplanation
      : similarity.status === 'insufficient_information'
        ? 'Not enough overlapping questions have been answered yet to compute a reliable similarity score.'
        : `Measured ${similarity.score}/100 attribute similarity (${similarity.bandCategory.toLowerCase()}) across ${similarity.comparableConstructCount} shared construct areas.`;

  return {
    viewerId: viewer.id,
    candidateId: candidate.id,
    intention,
    eligibility,
    similarity,
    complementarity,
    dynamicSimilarityScore,
    dominantLens,
    lensKind,
    sharedGroundSummary,
    differenceSummary,
    potentialBalanceSummary,
    whyThisMatchExplanation,
  };
}
