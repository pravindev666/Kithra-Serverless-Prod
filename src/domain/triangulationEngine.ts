/**
 * Kithra Psychological Triangulation Engine
 *
 * Implements multi-scenario, context-aware psychometric triangulation across
 * key relational constructs. Distinguishes:
 * 1. Consistent Stance (enduring personal preference across situations)
 * 2. Plausible Situational Variation (healthy behavioral adaptation to context)
 * 3. Clarification Needed (divergent signals on directly opposing anchors)
 * 4. Insufficient Information (fewer than 2 comparable scenarios answered)
 *
 * PSYCHOMETRIC INTEGRITY PRINCIPLE:
 * This is NEVER a lie detector or a moral ranking system. Humans naturally
 * exhibit contextual nuance (e.g. strict confidentiality with work colleagues
 * vs open emotional disclosure with trusted life companions). Discrepancies
 * are presented as opportunities for self-clarification, never accusations.
 */

import { AssessmentQuestion, TriangulationClassification } from '../types/kithra';
import { EXPANDED_PILOT_QUESTION_BANK } from '../data/pilotQuestionBank';

export interface TriangulationClusterDefinition {
  id: string;
  name: string;
  description: string;
  coreConstruct: string;
  questionIds: string[];
  situationalAxes: string[];
  scientificReference: string;
}

export interface TriangulationClusterResult {
  clusterId: string;
  clusterName: string;
  classification: TriangulationClassification;
  confidenceLevel: 'insufficient' | 'provisional' | 'moderate' | 'established';
  participatingQuestionIds: string[];
  answeredQuestionIds: string[];
  answeredCount: number;
  totalClusterQuestions: number;
  meanScore?: number;
  spread?: number;
  userFacingExplanation: string;
  psychometricInterpretation: string;
  scientificReference: string;
  suggestedFollowUpQuestionId?: string;
}

export const TRIANGULATION_CLUSTERS: TriangulationClusterDefinition[] = [
  {
    id: 'confidentiality_expectations',
    name: 'Confidentiality & Discretion Across Spheres',
    description: 'Evaluates expectations of privacy in friendship, romantic intimacy, workplace, and family disclosures.',
    coreConstruct: 'confidentiality_and_discretion',
    questionIds: ['q-64-confidentiality-friendship', 'q-65-confidentiality-workplace', 'q-66-confidentiality-family', 'q-14-discretion-rumor'],
    situationalAxes: ['interpersonal_friendship', 'workplace_boundary', 'family_privacy', 'social_gossip'],
    scientificReference: 'Petronio (2002) Communication Privacy Management Theory: Boundary turbulence and coordinate coordination.',
  },
  {
    id: 'honesty_and_accountability',
    name: 'Honesty, Tact & Accountable Vulnerability',
    description: 'Assesses balance between transparent truth-telling, interpersonal tact, and taking ownership of mistakes.',
    coreConstruct: 'honesty_and_accountability',
    questionIds: ['q-68-accountability-mistake', 'q-69-tactful-candor', 'q-70-public-private-congruence', 'q-15-honesty-tact-tradeoff'],
    situationalAxes: ['mistake_admission', 'tactful_candor', 'public_private_congruence', 'truth_tact_tradeoff'],
    scientificReference: 'Tyler (2006) Why People Obey the Law: Procedural justice and self-correcting accountability.',
  },
  {
    id: 'repair_after_conflict',
    name: 'Conflict Recovery & De-escalation Rhythm',
    description: 'Examines cooling down pacing, repair bid receptivity, and apology languages following emotional friction.',
    coreConstruct: 'repair_after_conflict',
    questionIds: ['q-72-cooldown-pause', 'q-73-repair-bids', 'q-98-apology-language', 'q-20-heated-voice-anchor-a'],
    situationalAxes: ['immediate_cooling_off', 'repair_bid_acceptance', 'emotional_flooding_recovery', 'apology_language'],
    scientificReference: 'Gottman & Silver (2015) The Seven Principles for Making Marriage Work: Repair attempts and emotional regulation.',
  },
  {
    id: 'social_energy_vs_solitude',
    name: 'Social Battery & Environmental Cadence',
    description: 'Explores social battery replenishment across cultural celebrations, Friday exhaustion, and weekend balance.',
    coreConstruct: 'social_energy_vs_solitude',
    questionIds: ['q-76-friday-energy-restore', 'q-77-hosting-vs-meeting', 'q-26-festival-celebration-context', 'q-27-weekend-energy-depletion'],
    situationalAxes: ['friday_exhaustion', 'hosting_vs_neutral_ground', 'cultural_festival_energy', 'workweek_fatigue'],
    scientificReference: 'DeYoung (2015) Cybernetic Big Five Theory: Enthusiasm vs Assertiveness facets of Extraversion.',
  },
  {
    id: 'empathy_vs_solutions',
    name: 'Support Style: Validation vs Problem-Solving',
    description: 'Measures default response when companion vents distress: active emotional holding versus pragmatic action steps.',
    coreConstruct: 'empathy_vs_solutions',
    questionIds: ['q-79-distress-response-empathy', 'q-97-vulnerability-pace', 'q-04-listening-role'],
    situationalAxes: ['distress_support', 'vulnerability_pace', 'conversational_listening_role'],
    scientificReference: 'Burleson (2003) Emotional Support Skills in Close Relationships: Person-centered comforting.',
  },
  {
    id: 'substance_environmental_comfort',
    name: 'Substance & Environmental Boundary Settings',
    description: 'Distinguishes personal consumption, social venue tolerance, and living space cleanliness standards.',
    coreConstruct: 'substance_environmental_comfort',
    questionIds: ['q-80-alcohol-lifestyle-habit', 'q-81-partner-alcohol-requirement', 'q-61-smoking-habit', 'q-62-smoking-tolerance'],
    situationalAxes: ['alcohol_personal_habit', 'partner_substance_tolerance', 'personal_use_habit', 'domestic_smoke_tolerance'],
    scientificReference: 'Bandura (1986) Social Foundations of Thought and Action: Situational cues in health behaviors.',
  },
  {
    id: 'opposite_sex_friendship_boundaries',
    name: 'Cross-Gender Friendship Boundaries & Transparency',
    description: 'Assesses security, transparency, and boundary comfort regarding platonic opposite-gender companions.',
    coreConstruct: 'opposite_sex_friendship_boundaries',
    questionIds: ['q-83-opposite-sex-friendships', 'q-84-social-media-privacy', 'q-37-platonic-cross-gender-clarity'],
    situationalAxes: ['personal_platonic_ties', 'social_media_transparency', 'transparency_expectations'],
    scientificReference: 'Guerrero & Bachman (2008) Relational Maintenance in Cross-Sex Friendships.',
  },
  {
    id: 'intellectual_curiosity_debate',
    name: 'Intellectual Discourse & Constructive Disagreement',
    description: 'Measures enjoyment of lively debate, philosophical inquiry, and emotional resilience during ideological differences.',
    coreConstruct: 'intellectual_curiosity_debate',
    questionIds: ['q-85-changing-minds', 'q-86-debate-tone', 'q-16-curiosity-intellectual-depth'],
    situationalAxes: ['changing_mind_in_debate', 'debate_emotional_tone', 'intellectual_depth_drive'],
    scientificReference: 'Kruglanski (2004) The Psychology of Closed Mindedness: Cognitive need for closure vs epistemic curiosity.',
  },
  {
    id: 'financial_transparency_planning',
    name: 'Financial Openness & Stewardship Consensus',
    description: 'Explores financial disclosure timing, shared vs separate accounts, and comfort with discretionary spending.',
    coreConstruct: 'financial_transparency_planning',
    questionIds: ['q-71-financial-transparency', 'q-90-spending-autonomy', 'q-105-emergency-fund-philosophy', 'q-49-budget-discretionary-gate'],
    situationalAxes: ['marriage_disclosure_timing', 'spending_autonomy', 'emergency_fund_stewardship', 'independent_discretionary_fund'],
    scientificReference: 'Dew (2008) Debt and Marriage: The Role of Financial Conflict in Marital Dissolution.',
  },
  {
    id: 'parental_involvement_boundaries',
    name: 'Extended Family Closeness & Couple Autonomy',
    description: 'Examines boundary management between couple autonomy and traditional elder guidance in major decisions.',
    coreConstruct: 'parental_involvement_boundaries',
    questionIds: ['q-88-elderly-caregiving', 'q-89-festive-family-sharing', 'q-91-extended-family-support', 'q-99-in-law-boundaries', 'q-51-extended-family-advice'],
    situationalAxes: ['elder_caregiving_duty', 'festive_time_sharing', 'extended_family_support', 'in_law_boundary_buffering', 'elder_respect'],
    scientificReference: 'Sonawat (2001) Understanding Families in India: Intergenerational solidarity and filial responsibility.',
  },
  {
    id: 'shared_decision_making',
    name: 'Domestic Egalitarianism & Joint Decision Architecture',
    description: 'Assesses career sacrifice consensus, domestic labor distribution, and collaborative compromise.',
    coreConstruct: 'shared_decision_making',
    questionIds: ['q-92-dual-career-relocation', 'q-124-teamwork-in-adversity', 'q-48-domestic-chore-fairness'],
    situationalAxes: ['dual_career_relocation', 'teamwork_in_crisis', 'domestic_labor_division'],
    scientificReference: 'Coltrane (2000) Research on Household Labor, Modeling, and Gender Equality.',
  },
  {
    id: 'reassurance_vs_space',
    name: 'Attachment Security: Reassurance vs Independence',
    description: 'Measures comfort with solitude vs need for emotional affirmation during relationship ambiguity or stress.',
    coreConstruct: 'reassurance_vs_space',
    questionIds: ['q-95-workday-touchpoints', 'q-96-shared-silence-comfort', 'q-23-reassurance-seeking-cadence'],
    situationalAxes: ['workday_touchpoints', 'shared_silence_comfort', 'frequent_affirmation_cadence'],
    scientificReference: 'Mikulincer & Shaver (2016) Attachment in Adulthood: Structure, Dynamics, and Change.',
  },
];

/**
 * Extracts normalized option value from answer record.
 * Supports string option IDs, semantic IDs, or structured answer records.
 */
function extractNormalizedValue(
  question: AssessmentQuestion,
  answerRaw: unknown
): number | null {
  if (answerRaw === null || answerRaw === undefined) return null;

  let optionId: string | undefined;
  if (typeof answerRaw === 'string') {
    optionId = answerRaw;
  } else if (typeof answerRaw === 'object' && answerRaw !== null) {
    const record = answerRaw as Record<string, unknown>;
    if (typeof record.normalizedValue === 'number') {
      return record.normalizedValue;
    }
    if (typeof record.optionId === 'string') {
      optionId = record.optionId;
    }
  }

  if (!optionId) return null;

  const matchedOpt = question.options.find(
    (opt) => opt.id === optionId || opt.semanticId === optionId
  );
  return matchedOpt ? (matchedOpt.normalizedValue ?? null) : null;
}

/**
 * Evaluates a single psychological triangulation cluster based on member's answers.
 */
export function evaluateTriangulationCluster(
  cluster: TriangulationClusterDefinition,
  memberAnswers: Record<string, unknown>,
  bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
): TriangulationClusterResult {
  const clusterQuestions = bank.filter((q) => cluster.questionIds.includes(q.id));
  const answeredItems: Array<{ question: AssessmentQuestion; value: number }> = [];

  for (const q of clusterQuestions) {
    const rawAnswer = memberAnswers[q.id];
    const val = extractNormalizedValue(q, rawAnswer);
    if (val !== null) {
      answeredItems.push({ question: q, value: val });
    }
  }

  const answeredCount = answeredItems.length;
  const answeredQuestionIds = answeredItems.map((i) => i.question.id);
  const totalClusterQuestions = cluster.questionIds.length;

  // Unanswered follow-up suggestion
  const unAnswered = clusterQuestions.find((q) => !answeredQuestionIds.includes(q.id));
  const suggestedFollowUpQuestionId = unAnswered ? unAnswered.id : undefined;

  // 1. Less than 2 items answered -> Insufficient Information
  if (answeredCount < 2) {
    return {
      clusterId: cluster.id,
      clusterName: cluster.name,
      classification: 'insufficient_information',
      confidenceLevel: answeredCount === 1 ? 'provisional' : 'insufficient',
      participatingQuestionIds: cluster.questionIds,
      answeredQuestionIds,
      answeredCount,
      totalClusterQuestions,
      userFacingExplanation: `You have answered ${answeredCount} of ${totalClusterQuestions} scenarios in this area. Answering an additional scenario helps verify your comfort across different contexts.`,
      psychometricInterpretation: `Fewer than two situational anchors are present for construct '${cluster.coreConstruct}'. Confidence remains provisional to avoid false generalization.`,
      scientificReference: cluster.scientificReference,
      suggestedFollowUpQuestionId,
    };
  }

  // Calculate statistics
  const values = answeredItems.map((i) => i.value);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const meanScore = Math.round(sum / values.length);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const spread = maxVal - minVal;

  let classification: TriangulationClassification;
  let userFacingExplanation: string;
  let psychometricInterpretation: string;
  const confidenceLevel = answeredCount >= 3 ? 'established' : 'moderate';

  if (spread <= 28) {
    // Consistent stance across multiple contexts
    classification = 'consistent_stance';
    userFacingExplanation = `Your responses reflect a clear, steady personal preference across different real-world situations (mean score: ${meanScore}/100, spread: ${spread} pts).`;
    psychometricInterpretation = `High contextual convergence across ${answeredCount} distinct scenario contexts. Demonstrates an enduring trait/value orientation with low situational variance.`;
  } else if (spread <= 58) {
    // Plausible situational variation (context-dependent nuance)
    classification = 'plausible_situational_variation';
    userFacingExplanation = `Your answers reflect healthy situational adaptability. For example, your expectations adapt thoughtfully depending on whether you are in a casual, family, or high-stakes environment (spread: ${spread} pts).`;
    psychometricInterpretation = `Meaningful but psychologically coherent situational variance (spread: ${spread} pts). The member differentiates between distinct environmental contexts (e.g., private vs public spheres) rather than answering with rigid dogmatism.`;
  } else {
    // Substantial divergence on paired anchors -> Clarification needed
    classification = 'clarification_needed';
    userFacingExplanation = `Your answers to these scenarios point in different directions across similar situations (spread: ${spread} pts). When you are ready, you may review your answers to ensure they accurately describe your preferred way of relating.`;
    psychometricInterpretation = `Divergent anchor responses detected (spread: ${spread} pts). Flagged for optional member review or follow-up adaptive probe; no moral judgment or deception implied.`;
  }

  return {
    clusterId: cluster.id,
    clusterName: cluster.name,
    classification,
    confidenceLevel,
    participatingQuestionIds: cluster.questionIds,
    answeredQuestionIds,
    answeredCount,
    totalClusterQuestions,
    meanScore,
    spread,
    userFacingExplanation,
    psychometricInterpretation,
    scientificReference: cluster.scientificReference,
    suggestedFollowUpQuestionId,
  };
}

/**
 * Runs psychological triangulation across all defined clusters.
 */
export function evaluateAllTriangulationClusters(
  memberAnswers: Record<string, unknown>,
  bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
): Record<string, TriangulationClusterResult> {
  const results: Record<string, TriangulationClusterResult> = {};
  for (const cluster of TRIANGULATION_CLUSTERS) {
    results[cluster.id] = evaluateTriangulationCluster(cluster, memberAnswers, bank);
  }
  return results;
}
