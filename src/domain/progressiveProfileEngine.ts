/**
 * Kithra Progressive Profile Completion Engine (Naukri-Style)
 *
 * Provides structured, fatigue-aware profile completion divided into
 * 10 discrete sections.
 *
 * CORE PSYCHOMETRIC & UX PRINCIPLE:
 * Decouples basic account readiness from deep questionnaire completion.
 * An adult member reaches 100% Account Profile Readiness through basic identity,
 * bio, photo, and intention preferences.
 * Deep psychological assessments provide optional precision and depth without
 * ever making the user feel penalized or incomplete if they choose to stop or take a break.
 */

import {
  ConstructLayerId,
  IntentionId,
  MemberProfile,
  ProfileReadinessBreakdown,
  ProfileSectionId,
  ProfileSectionStatus,
  AssessmentQuestion,
} from '../types/kithra';
import { EXPANDED_PILOT_QUESTION_BANK } from '../data/pilotQuestionBank';

export interface SectionMetadataSpec {
  sectionId: ProfileSectionId;
  title: string;
  shortLabel: string;
  category: 'core_account' | 'essential_preferences' | 'personality_traits' | 'deeper_reflection';
  description: string;
  privacyBadge: string;
  constructId?: ConstructLayerId;
  targetCount: number;
  averageSecondsPerQuestion: number;
}

export const PROFILE_SECTIONS_SPEC: readonly SectionMetadataSpec[] = [
  {
    sectionId: 'basic_profile',
    title: 'Basic Identity & Bio',
    shortLabel: 'Basic Profile',
    category: 'core_account',
    description: 'Name, location, brief bio introduction, and profile picture.',
    privacyBadge: 'Public to approved members',
    targetCount: 5,
    averageSecondsPerQuestion: 20,
  },
  {
    sectionId: 'relationship_intentions',
    title: 'Intentions & Non-Negotiables',
    shortLabel: 'Intentions',
    category: 'essential_preferences',
    description: 'Active relationship modes (Friendship, Dating, Matrimony) and essential boundaries.',
    privacyBadge: 'Private matching criteria',
    targetCount: 4,
    averageSecondsPerQuestion: 25,
  },
  {
    sectionId: 'communication_style',
    title: 'Conversational Pace & Presence',
    shortLabel: 'Communication',
    category: 'personality_traits',
    constructId: 'communication',
    description: 'Reply rhythms, voice notes vs text messages, and first meet-up expectations.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 6,
    averageSecondsPerQuestion: 25,
  },
  {
    sectionId: 'everyday_values',
    title: 'Everyday Values & Discretion',
    shortLabel: 'Values',
    category: 'personality_traits',
    constructId: 'personal_values',
    description: 'Truth vs tact, keeping promises, discretion with rumors, and personal accountability.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 7,
    averageSecondsPerQuestion: 30,
  },
  {
    sectionId: 'social_energy',
    title: 'Social Battery & Solitude Rhythms',
    shortLabel: 'Social Energy',
    category: 'personality_traits',
    constructId: 'social_energy',
    description: 'Weekend recovery, festival gatherings, leaving parties early, and home nesting.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 6,
    averageSecondsPerQuestion: 25,
  },
  {
    sectionId: 'emotional_repair',
    title: 'Conflict Recovery & Apology Style',
    shortLabel: 'Repair Style',
    category: 'personality_traits',
    constructId: 'conflict_repair',
    description: 'Cooling down periods, receiving apologies, and resolving disagreements with dignity.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 6,
    averageSecondsPerQuestion: 30,
  },
  {
    sectionId: 'independence_finances',
    title: 'Financial Independence & Discretionary Space',
    shortLabel: 'Finances',
    category: 'personality_traits',
    constructId: 'finances_independence',
    description: 'Independent spending, shared budgeting, and transparency in partnership.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 5,
    averageSecondsPerQuestion: 30,
  },
  {
    sectionId: 'lifestyle_health',
    title: 'Habits, Pace of Life & Substance Boundaries',
    shortLabel: 'Lifestyle',
    category: 'personality_traits',
    constructId: 'daily_lifestyle',
    description: 'Smoking/vaping tolerance, dietary comfort, morning vs night rhythms, and wellness.',
    privacyBadge: 'Private matching criteria',
    targetCount: 6,
    averageSecondsPerQuestion: 25,
  },
  {
    sectionId: 'relational_boundaries',
    title: 'Platonic Friendships & Personal Boundaries',
    shortLabel: 'Boundaries',
    category: 'personality_traits',
    constructId: 'relational_boundaries',
    description: 'Opposite-gender friendships, phone privacy boundaries, and emotional self-containment.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 5,
    averageSecondsPerQuestion: 30,
  },
  {
    sectionId: 'family_future',
    title: 'Family Dynamics, In-Laws & Future Horizons',
    shortLabel: 'Family & Future',
    category: 'deeper_reflection',
    constructId: 'family_domestic',
    description: 'Extended family traditions, elder caregiving, couple autonomy, and long-term vision.',
    privacyBadge: 'Private — engine matches only',
    targetCount: 6,
    averageSecondsPerQuestion: 35,
  },
];

/**
 * Computes individual status for each of the 10 Naukri-style progressive sections.
 */
export function computeProfileSectionsStatus(
  member: Partial<MemberProfile> | null,
  answeredQuestionIds: Iterable<string>,
  bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
): ProfileSectionStatus[] {
  const answeredSet = new Set(answeredQuestionIds);

  return PROFILE_SECTIONS_SPEC.map((spec) => {
    // 1. Basic Account Profile (Non-questionnaire core fields)
    if (spec.sectionId === 'basic_profile') {
      const hasName = Boolean(member?.name && member.name.trim().length > 0);
      const hasCity = Boolean(member?.city && member.city.trim().length > 0);
      const hasBio = Boolean(member?.bio && member.bio.trim().length > 10);
      const hasIntentions = Boolean(
        member?.intentions && member.intentions.length > 0
      );
      const hasPhoto = Boolean(
        member?.portraitVariant ||
        (member as { photos?: unknown[] })?.photos?.length ||
        (member as { avatarUrl?: string })?.avatarUrl
      );

      const answeredCount = [
        hasName,
        hasCity,
        hasBio,
        hasIntentions,
        hasPhoto,
      ].filter(Boolean).length;
      const targetCount = 5;
      const status =
        answeredCount === targetCount
          ? 'completed'
          : answeredCount > 0
            ? 'in_progress'
            : 'not_started';
      const remainingItems = targetCount - answeredCount;
      const estimatedMinutesRemaining = Math.ceil(
        (remainingItems * spec.averageSecondsPerQuestion) / 60
      );

      return {
        sectionId: spec.sectionId,
        title: spec.title,
        shortLabel: spec.shortLabel,
        category: spec.category,
        status,
        answeredCount,
        targetCount,
        estimatedMinutesRemaining,
        description: spec.description,
        privacyBadge: spec.privacyBadge,
        questionIds: [],
      };
    }

    // 2. Relationship Intentions & Stage A Non-Negotiables
    if (spec.sectionId === 'relationship_intentions') {
      const hasIntentions = Boolean(
        member?.intentions && member.intentions.length > 0
      );
      const q38Answered = answeredSet.has('q-38-relationship-structure-gate');
      const q50Answered = answeredSet.has('q-50-children-goal-gate');
      const q63Answered = answeredSet.has('q-63-partner-smoking-requirement');

      const answeredCount = [
        hasIntentions,
        q38Answered,
        q50Answered,
        q63Answered,
      ].filter(Boolean).length;
      const targetCount = 4;
      const status =
        answeredCount === targetCount
          ? 'completed'
          : answeredCount > 0
            ? 'in_progress'
            : 'not_started';
      const remainingItems = targetCount - answeredCount;
      const estimatedMinutesRemaining = Math.ceil(
        (remainingItems * spec.averageSecondsPerQuestion) / 60
      );

      return {
        sectionId: spec.sectionId,
        title: spec.title,
        shortLabel: spec.shortLabel,
        category: spec.category,
        status,
        answeredCount,
        targetCount,
        estimatedMinutesRemaining,
        description: spec.description,
        privacyBadge: spec.privacyBadge,
        questionIds: [
          'q-38-relationship-structure-gate',
          'q-50-children-goal-gate',
          'q-63-partner-smoking-requirement',
        ],
      };
    }

    // 3. Psychometric Questionnaire Sections (Sections 3 to 10)
    const sectionQuestions = bank.filter(
      (q) =>
        q.sectionId === spec.sectionId ||
        (spec.constructId && q.constructId === spec.constructId)
    );
    const questionIds = sectionQuestions.map((q) => q.id);
    const answeredCount = sectionQuestions.filter((q) =>
      answeredSet.has(q.id)
    ).length;
    const targetCount = Math.max(spec.targetCount, sectionQuestions.length);

    let status: ProfileSectionStatus['status'] = 'not_started';
    if (answeredCount >= spec.targetCount) {
      status = 'completed';
    } else if (answeredCount > 0) {
      status = 'in_progress';
    } else if (spec.category === 'deeper_reflection') {
      status = 'optional_available';
    }

    const remainingItems = Math.max(0, spec.targetCount - answeredCount);
    const estimatedMinutesRemaining = Math.ceil(
      (remainingItems * spec.averageSecondsPerQuestion) / 60
    );

    return {
      sectionId: spec.sectionId,
      title: spec.title,
      shortLabel: spec.shortLabel,
      category: spec.category,
      status,
      answeredCount,
      targetCount: spec.targetCount,
      estimatedMinutesRemaining,
      description: spec.description,
      privacyBadge: spec.privacyBadge,
      constructId: spec.constructId,
      questionIds,
    };
  });
}

/**
 * Computes multidimensional Profile Readiness Breakdown.
 * Explicitly separates basic account readiness from deep psychological answering.
 */
export function computeProfileReadinessBreakdown(
  member: Partial<MemberProfile> | null,
  answeredQuestionIds: Iterable<string>,
  bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
): ProfileReadinessBreakdown {
  const sections = computeProfileSectionsStatus(member, answeredQuestionIds, bank);

  // 1. Account Profile Readiness (0–100%)
  const basicSection = sections.find((s) => s.sectionId === 'basic_profile');
  const accountProfileReadiness = basicSection
    ? Math.round((basicSection.answeredCount / basicSection.targetCount) * 100)
    : 0;

  // 2. Relationship Preference Readiness (0–100%)
  const intentionsSection = sections.find(
    (s) => s.sectionId === 'relationship_intentions'
  );
  const relationshipPreferenceReadiness = intentionsSection
    ? Math.round(
      (intentionsSection.answeredCount / intentionsSection.targetCount) * 100
    )
    : 0;

  // 3. Psychological Assessment Coverage (Sections 3 to 9)
  const corePsychSections = sections.filter(
    (s) => s.category === 'personality_traits'
  );
  const totalCoreTarget = corePsychSections.reduce(
    (acc, s) => acc + s.targetCount,
    0
  );
  const totalCoreAnswered = corePsychSections.reduce(
    (acc, s) => acc + s.answeredCount,
    0
  );
  const psychologicalAssessmentCoverage =
    totalCoreTarget > 0
      ? Math.min(100, Math.round((totalCoreAnswered / totalCoreTarget) * 100))
      : 0;

  // 4. Optional Assessment Depth (Deep reflection & family future)
  const deepSections = sections.filter((s) => s.category === 'deeper_reflection');
  const totalDeepTarget = deepSections.reduce(
    (acc, s) => acc + s.targetCount,
    0
  );
  const totalDeepAnswered = deepSections.reduce(
    (acc, s) => acc + s.answeredCount,
    0
  );
  const optionalAssessmentDepth =
    totalDeepTarget > 0
      ? Math.min(100, Math.round((totalDeepAnswered / totalDeepTarget) * 100))
      : 0;

  // Discovery Eligibility Rule:
  // Discovery requires 80%+ Account Profile Readiness and 50%+ Relationship Preference Readiness.
  // Deep assessments are NOT required to begin discovery!
  const isReadyForDiscovery =
    accountProfileReadiness >= 80 && relationshipPreferenceReadiness >= 50;

  // Determine Next Recommended Section
  let nextRecommendedSection: ProfileSectionId = 'basic_profile';
  for (const s of sections) {
    if (s.status !== 'completed') {
      nextRecommendedSection = s.sectionId;
      break;
    }
  }

  // Summary headline
  let headlineSummary: string;
  if (!isReadyForDiscovery) {
    headlineSummary =
      'Complete your basic details and relationship goals to begin exploring companions.';
  } else if (psychologicalAssessmentCoverage < 30) {
    headlineSummary =
      'Your profile is active for discovery. Answer short modules whenever you like to unlock deeper compatibility insights.';
  } else if (psychologicalAssessmentCoverage < 80) {
    headlineSummary =
      'Great foundation. Your personality patterns and lenses are well-calibrated across core values.';
  } else {
    headlineSummary =
      'Comprehensive profile complete. Your multidimensional compatibility lenses have maximum accuracy.';
  }

  return {
    accountProfileReadiness,
    relationshipPreferenceReadiness,
    psychologicalAssessmentCoverage,
    optionalAssessmentDepth,
    isReadyForDiscovery,
    headlineSummary,
    nextRecommendedSection,
  };
}
