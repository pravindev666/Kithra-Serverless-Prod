/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA MEMBER-CONTROLLED PSYCHOLOGICAL SELF-UNDERSTANDING ENGINE
 * 
 * Implements:
 * 1. Detailed, cautious self-understanding reports based strictly on reviewed, answered constructs.
 * 2. Full transparency: Supporting construct, assessment coverage, confidence band, missing info, and limitations.
 * 3. Strict non-clinical invariants: Never presents scores as medical/psychiatric diagnoses or moral character judgments.
 * 4. Member agency: Members can review every underlying answer, correct responses, and delete data under DPDP Section 12.
 */

import { ConstructLayerId } from '../types/kithra';
import { EXPANDED_PILOT_QUESTION_BANK } from '../data/pilotQuestionBank';

export interface AnsweredItemReflection {
  questionId: string;
  questionNumber: number;
  prompt: string;
  selectedOptionId: string;
  selectedOptionLabel: string;
  reflectionText: string;
  welcomesComplementarity: boolean;
}

export interface ConstructInsightReport {
  constructId: ConstructLayerId;
  title: string;
  category:
    | 'communication'
    | 'conflict_and_repair'
    | 'emotional_coping'
    | 'autonomy_and_boundaries'
    | 'values_and_resources'
    | 'lifestyle_and_routines'
    | 'relational_expectations';
  statedPreferenceSummary: string;
  observedScore: number | null;
  confidenceBand: 'provisional' | 'developing' | 'established' | 'unanswered';
  coverage: {
    answeredItemsCount: number;
    totalAvailableItemsCount: number;
    coveragePercentage: number;
  };
  validationStatus: 'EXPERIMENTAL_SELF_REPORT_UNVALIDATED';
  missingInformationNote: string;
  interpretationLimitations: string;
  answeredReflections: AnsweredItemReflection[];
  /** Empirical measurement classification separating continuous traits from categorical trade-offs */
  measurementCategory?: 'continuous_trait' | 'categorical_preference' | 'value_tradeoff' | 'mixed';
  /** Scientific confidence criteria grounded in ITC psychometric guidelines */
  empiricalConfidenceCriteria?: {
    level: 'insufficient' | 'provisional_exploration' | 'developing_pattern' | 'multi_context_triangulated';
    scientificValidationStatus: 'PRE_EMPIRICAL_PILOT';
    requiredPilotSampleSize: number;
  };
}

export interface MemberSelfUnderstandingReport {
  memberId: string;
  generatedAt: number;
  engineVersion: string;
  overallCoverage: {
    totalAnswered: number;
    totalBankItems: number;
    coveragePercentage: number;
    readinessStatus: 'provisional' | 'developing' | 'established';
  };
  insights: ConstructInsightReport[];
  nonClinicalDisclaimer: string;
}

export const NON_CLINICAL_DISCLAIMER =
  'Kithra self-understanding summaries are experimental, non-clinical reflections derived strictly from your self-reported scenario responses. They are designed for personal reflection and companion compatibility discovery. They do not constitute psychological diagnoses, mental health evaluations, or objective measures of character virtue.';

const DOMAIN_METADATA: Partial<
  Record<
    ConstructLayerId,
    {
      title: string;
      category: ConstructInsightReport['category'];
      lowSummary: string;
      midSummary: string;
      highSummary: string;
      limitations: string;
    }
  >
> = {
  communication: {
    title: 'Conversational Pace & Communication Modality',
    category: 'communication',
    lowSummary: 'You report preferring low-pressure, asynchronous written exchanges and light-hearted, unhurried early conversations.',
    midSummary: 'You report a balanced communication cadence, transitioning comfortably between asynchronous messages and spoken conversations as rapport builds.',
    highSummary: 'You report valuing immediate conversational depth and real-time voice or spoken connection with warm emotional presence.',
    limitations: 'Measures self-reported communication channel and depth preferences in everyday scenarios; does not evaluate cognitive ability, verbal eloquence, or character.',
  },
  conflict_repair: {
    title: 'De-escalation Patience & Conflict Repair Rhythms',
    category: 'conflict_and_repair',
    lowSummary: 'You report an urgent preference for immediate cognitive closure, preferring to resolve disagreements without walking away.',
    midSummary: 'You report using in-situ tonal warmth, soft humor, and collaborative discussion to de-escalate tension before it hardens.',
    highSummary: 'You report prioritizing physiological calming, preferring a structured 20-minute breather to lower emotional flooding before resuming.',
    limitations: 'Self-reported retrospective conflict preferences; actual marital or high-stress conflict dynamics depend on relational safety and dyadic trust history.',
  },
  emotional_regulation: {
    title: 'Acute Stress Coping & Emotional Grounding',
    category: 'emotional_coping',
    lowSummary: 'You report an expressive coping orientation, naturally seeking empathetic validation and human presence as a vital first step.',
    midSummary: 'You report a collaborative regulation style, centering your emotions through dialogue and mutual reassurance with a trusted companion.',
    highSummary: 'You report a problem-focused coping style, instinctively anchoring on practical logistics, checklists, and systematic action under acute pressure.',
    limitations: 'All three coping styles represent valid, healthy nervous-system regulation strategies. Seeking emotional presence is an adaptive coping mechanism and must never be interpreted as an emotional defect.',
  },
  relational_boundaries: {
    title: 'Autonomy, Confidentiality & Relational Boundaries',
    category: 'autonomy_and_boundaries',
    lowSummary: 'You report valuing high interdependence and shared experiences, preferring close togetherness and shared friend circles.',
    midSummary: 'You report balancing couple unity with personal space, comfortably maintaining separate friendships alongside shared commitments.',
    highSummary: 'You report valuing strong personal differentiation, celebrating solo trips, independent creative pursuits, and strict confidentiality boundaries.',
    limitations: 'Reflects self-reported differentiation preferences; boundary expectations shift naturally across relationship duration, cohabitation, and child-rearing phases.',
  },
  personal_values: {
    title: 'Resource Allocation Philosophy & Moral Grounding',
    category: 'values_and_resources',
    lowSummary: 'You report prioritizing disciplined capital compounding, asset protection, and long-term autonomy as your primary stewardship strategy.',
    midSummary: 'You report a balanced resource approach, pairing prudent personal savings with targeted, thoughtful gifting for family and loved ones.',
    highSummary: 'You report a communal sharing philosophy, prioritizing support for extended family, domestic staff, and broader community causes.',
    limitations: 'Neither communal giving nor disciplined asset investing is morally superior. Both represent defensible life orientations shaped by generational safety and personal values.',
  },
  daily_lifestyle: {
    title: 'Daily Micro-Rituals & Circadian Pacing',
    category: 'lifestyle_and_routines',
    lowSummary: 'You report a flexible, functional daily lifestyle with low attachment to fixed rituals or beverage routines.',
    midSummary: 'You report enjoying regular daily touchpoints and social meals while maintaining flexibility when schedules require.',
    highSummary: 'You report cherishing mindful sensory rituals—such as an unhurried morning chai/coffee or dedicated creative solitude—as essential to daily equilibrium.',
    limitations: 'Captures voluntary sensory and pacing preferences; daily routines are heavily influenced by work schedules, commute lengths, and domestic responsibilities.',
  },
  romantic_expectations: {
    title: 'Partnership Teamwork in Adversity & Future Vision',
    category: 'relational_expectations',
    lowSummary: 'You report needing personal space to process acute grief or stress independently before regrouping as a couple.',
    midSummary: 'You report valuing functional role division during crises—one companion managing logistics while the other anchors emotional care.',
    highSummary: 'You report an "us against the world" collaborative command-center mindset—solving every detail side by side with radical transparency.',
    limitations: 'Hypothetical life-adversity orientation; actual dyadic resilience depends on shared financial resources, health conditions, and reciprocal commitment.',
  },
  social_energy: {
    title: 'Social Battery & Restorative Solitude Rhythms',
    category: 'lifestyle_and_routines',
    lowSummary: 'You report deep restorative solitude as essential, requiring quiet solo time to recharge after social or work demands.',
    midSummary: 'You report an ambivert social cadence, enjoying small-group gatherings and shared dinners while preserving quiet home evenings.',
    highSummary: 'You report drawing vital energy from vibrant social gatherings, community events, and dynamic group environments.',
    limitations: 'Social energy fluctuates with workplace burnout, life stage, and introvert/extrovert ambivalence; not a fixed trait.',
  },
  finances_independence: {
    title: 'Financial Independence & Risk Tolerance Horizon',
    category: 'values_and_resources',
    lowSummary: 'You report prioritizing guaranteed capital safety (gold, fixed deposits, emergency buffers) with zero appetite for market volatility.',
    midSummary: 'You report disciplined diversification, systematically investing in index mutual funds while enjoying regular meaningful experiences.',
    highSummary: 'You report comfort with high-conviction growth assets and entrepreneurial ventures, viewing calculated risk as essential to building wealth.',
    limitations: 'Financial risk tolerance is shaped by absolute income, generational wealth cushions, and dependent family members; not an indicator of financial competence.',
  },
  family_domestic: {
    title: 'Domestic Labor Collaboration & Shared Household Vision',
    category: 'lifestyle_and_routines',
    lowSummary: 'You report prioritizing time efficiency and streamlined domestic outsourcing (tiffin, meal prep, domestic help) over domestic culinary labor.',
    midSummary: 'You report a pragmatic, egalitarian division of household tasks, rotating responsibilities fairly based on work schedules.',
    highSummary: 'You report viewing shared domestic life and cooking together as an intimate, joyful weekend ritual of togetherness.',
    limitations: 'Domestic preferences reflect time budgets and culinary joy, not commitment to family well-being or partnership fidelity.',
  },
  intellectual_curiosity: {
    title: 'Aesthetic Engagement & Intellectual Dialogue Style',
    category: 'communication',
    lowSummary: 'You report preferring contemporary popular entertainment (movies, sports, dining) and relaxed, low-pressure conversations over formal debates.',
    midSummary: 'You report enjoying occasional cultural outings and thoughtful discussions when accompanied by a companion who shares the interest.',
    highSummary: 'You report actively seeking out classical arts, live theatre, literature, and passionate exploratory debates about ideas and worldviews.',
    limitations: 'Measures cultural aesthetic preference and debate style, not intellectual horsepower or formal educational attainment.',
  },
  long_term_goals: {
    title: 'Life Trajectory Pacing & Future Milestones',
    category: 'relational_expectations',
    lowSummary: 'You report prioritizing present-day experiential richness (travel, learning, dining) trusting future earning potential.',
    midSummary: 'You report a dual-horizon approach, balancing regular present experiences with disciplined long-term milestone planning.',
    highSummary: 'You report a structured future-first orientation, prioritizing early property ownership, financial autonomy, and career foundations.',
    limitations: 'Temporal orientation reflects current economic cushions and generational security, not long-term responsibility.',
  },
};

/**
 * Computes a detailed, cautious, evidence-to-insight Self-Understanding Report for a member.
 */
export function generateMemberSelfUnderstandingReport(
  memberId: string,
  rawAnswers: Record<string, string>,
  allQuestions = EXPANDED_PILOT_QUESTION_BANK
): MemberSelfUnderstandingReport {
  const answeredQuestionIds = new Set(Object.keys(rawAnswers));
  const totalAnswered = answeredQuestionIds.size;
  const totalBankItems = allQuestions.length;
  const coveragePercentage = totalBankItems > 0 ? Math.round((totalAnswered / totalBankItems) * 100) : 0;

  let readinessStatus: MemberSelfUnderstandingReport['overallCoverage']['readinessStatus'] = 'provisional';
  if (totalAnswered >= 15) {
    readinessStatus = 'established';
  } else if (totalAnswered >= 5) {
    readinessStatus = 'developing';
  }

  // Group questions by constructId
  const questionsByConstruct: Record<string, typeof allQuestions> = {};
  for (const q of allQuestions) {
    const cId = q.constructId ?? 'communication';
    if (!questionsByConstruct[cId]) {
      questionsByConstruct[cId] = [];
    }
    questionsByConstruct[cId].push(q);
  }

  const activeConstructIds = Object.keys(DOMAIN_METADATA) as ConstructLayerId[];
  const insights: ConstructInsightReport[] = [];

  for (const cId of activeConstructIds) {
    const meta = DOMAIN_METADATA[cId];
    if (!meta) continue;
    const constructQuestions = questionsByConstruct[cId] ?? [];
    const totalAvail = constructQuestions.length;

    const answeredConstructQuestions = constructQuestions.filter((q) =>
      answeredQuestionIds.has(q.id)
    );
    const answeredCount = answeredConstructQuestions.length;
    const constructCoveragePct = totalAvail > 0 ? Math.round((answeredCount / totalAvail) * 100) : 0;

    let confidenceBand: ConstructInsightReport['confidenceBand'] = 'unanswered';
    if (answeredCount >= 3) {
      confidenceBand = 'established';
    } else if (answeredCount >= 2) {
      confidenceBand = 'developing';
    } else if (answeredCount >= 1) {
      confidenceBand = 'provisional';
    }

    // Calculate average score across answered options
    // Only continuous traits are scored numerically. Categorical preferences, value trade-offs, and gates
    // are qualitative stances and are strictly separated to prevent unscientific averaging.
    let sumScore = 0;
    let scoredItemsCount = 0;
    const answeredReflections: AnsweredItemReflection[] = [];
    let hasCategoricalOrTradeoff = false;
    let hasContinuous = false;

    for (const q of answeredConstructQuestions) {
      const selectedOptId = rawAnswers[q.id];
      const opt = q.options.find((o) => o.id === selectedOptId);
      if (opt) {
        const isContinuous = !q.scoringType || q.scoringType === 'continuous_trait';
        if (isContinuous && typeof opt.normalizedValue === 'number') {
          sumScore += opt.normalizedValue;
          scoredItemsCount++;
          hasContinuous = true;
        } else {
          hasCategoricalOrTradeoff = true;
        }
        answeredReflections.push({
          questionId: q.id,
          questionNumber: q.questionNumber,
          prompt: q.prompt,
          selectedOptionId: opt.id,
          selectedOptionLabel: opt.label,
          reflectionText: opt.reflection,
          welcomesComplementarity: opt.welcomesComplementarity ?? true,
        });
      }
    }

    const observedScore = scoredItemsCount > 0 ? Math.round(sumScore / scoredItemsCount) : null;

    let measurementCategory: ConstructInsightReport['measurementCategory'] = 'continuous_trait';
    if (hasContinuous && hasCategoricalOrTradeoff) {
      measurementCategory = 'mixed';
    } else if (hasCategoricalOrTradeoff) {
      measurementCategory = 'categorical_preference';
    }

    let empiricalLevel: NonNullable<ConstructInsightReport['empiricalConfidenceCriteria']>['level'] = 'insufficient';
    if (answeredCount >= 3) {
      empiricalLevel = 'multi_context_triangulated';
    } else if (answeredCount >= 2) {
      empiricalLevel = 'developing_pattern';
    } else if (answeredCount >= 1) {
      empiricalLevel = 'provisional_exploration';
    }

    // Build empathetic summary based on score or qualitative reflection
    let statedPreferenceSummary = 'You have not yet explored scenarios in this domain. Answering questions in this section will reveal your natural preferences.';
    if (observedScore !== null) {
      if (observedScore >= 67) {
        statedPreferenceSummary = meta.highSummary;
      } else if (observedScore >= 34) {
        statedPreferenceSummary = meta.midSummary;
      } else {
        statedPreferenceSummary = meta.lowSummary;
      }
    } else if (answeredReflections.length > 0) {
      statedPreferenceSummary = answeredReflections.map((r) => r.reflectionText).join(' ');
    }

    // Missing information note
    const missingCount = totalAvail - answeredCount;
    let missingInformationNote = 'All available items in this domain have been explored.';
    if (missingCount > 0) {
      missingInformationNote = `${missingCount} out of ${totalAvail} scenario items in this domain remain unanswered. Exploring additional contexts will increase confidence in this reflection.`;
    }

    insights.push({
      constructId: cId,
      title: meta.title,
      category: meta.category,
      statedPreferenceSummary,
      observedScore,
      confidenceBand,
      measurementCategory,
      empiricalConfidenceCriteria: {
        level: empiricalLevel,
        scientificValidationStatus: 'PRE_EMPIRICAL_PILOT',
        requiredPilotSampleSize: 300,
      },
      coverage: {
        answeredItemsCount: answeredCount,
        totalAvailableItemsCount: totalAvail,
        coveragePercentage: constructCoveragePct,
      },
      validationStatus: 'EXPERIMENTAL_SELF_REPORT_UNVALIDATED',
      missingInformationNote,
      interpretationLimitations: meta.limitations,
      answeredReflections,
    });
  }

  return {
    memberId,
    generatedAt: Date.now(),
    engineVersion: '2026.11-psychological-insights-v1.0',
    overallCoverage: {
      totalAnswered,
      totalBankItems,
      coveragePercentage,
      readinessStatus,
    },
    insights,
    nonClinicalDisclaimer: NON_CLINICAL_DISCLAIMER,
  };
}
