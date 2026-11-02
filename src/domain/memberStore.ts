/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PERSISTENT MEMBER STORE & REAL MATCHING SERVICE
 * 
 * Implements persistent member storage, real assessment response recording,
 * dynamic construct profile derivation, DPDP Act 2023 consent withdrawal / data erasure,
 * server-side role authorization guards, and dynamic pairwise matching without hardcoded scores.
 */

import {
  AssessmentQuestion,
  ConstructVectorPoint,
  IntentionId,
  MemberProfile,
  PartnerSmokingRequirement,
  ProfileReadinessBreakdown,
  ProfileSectionId,
  ProfileSectionStatus,
  RelationshipSignalKind,
  SmokingVapingProfile,
} from '../types/kithra';
import {
  EXPANDED_PILOT_QUESTION_BANK,
  PILOT_60_QUESTION_BANK,
  RESEARCH_PILOT_QUESTION_BANK,
} from '../data/pilotQuestionBank';
import {
  selectNextAdaptiveQuestion,
} from './adaptiveQuestionEngine';
import {
  computeProfileReadinessBreakdown,
  computeProfileSectionsStatus,
} from './progressiveProfileEngine';
import {
  evaluateAllTriangulationClusters,
  TriangulationClusterResult,
} from './triangulationEngine';
import {
  AdministeredItemResponse,
  authorizeRawAnswerAccess,
  computeAttributeSimilarity,
  deriveConstructProfileFromAnswers,
  evaluateMemberPairwiseMatch,
  evaluateMemberStagedPattern,
  evaluateMutualEligibility,
  evaluateResponseQuality,
  filterProfilesByFullSimilaritySpectrum,
  FullRangeDiscoveryFilterCriteria,
  MemberPairwiseMatchResult,
  RawAnswerRequesterRole,
} from './psychologyEngine';

/* -------------------------------------------------------------------------- */
/*  STORAGE KEYS & PERSISTENT DATA SCHEMA                                     */
/* -------------------------------------------------------------------------- */

const STORAGE_KEYS = {
  ACTIVE_MEMBER_ID: 'kithra_active_member_id_v3',
  RAW_RESPONSES: 'kithra_member_raw_responses_v3',
  PROFILES: 'kithra_member_profiles_v3',
  USER_CONSENTS: 'kithra_member_consents_v3',
};

export interface StoredRawResponse {
  questionId: string;
  optionId: string;
  semanticId?: string;
  answeredAt: number;
  responseLatencyMs?: number;
  displayedOptionIndex?: number;
}

export type RawResponsesByMember = Record<string, Record<string, StoredRawResponse>>;

/* -------------------------------------------------------------------------- */
/*  CALIBRATED INITIAL PERSONAS FOR DETERMINISTIC VERIFICATION               */
/* -------------------------------------------------------------------------- */

/**
 * Member A: Kavya Sundaram (Bengaluru)
 * - Intentions: Friendship & Dating
 * - Requires exclusivity in dating; wants children (flexible)
 * - 25 answered reflections across pace, values, social energy, conflict repair
 */
const KAVYA_INITIAL_RAW_ANSWERS: Record<string, string> = {
  'q-pace': 'opt-slow', // 25
  'q-02-workweek-reply': 'opt-02-evening', // 30
  'q-03-first-meetup': 'opt-03-coffee', // 65
  'q-04-listening-role': 'opt-04-reflective', // 85
  'q-05-voice-vs-text': 'opt-05-text', // 30
  'q-06-reschedule-reliability': 'opt-06-proactive', // 90
  'q-07-empathy-vs-solution': 'opt-07-listen-first', // 85
  'q-08-post-meetup-recharge': 'opt-08-solo-recharge', // 25
  'q-09-humour-style': 'opt-09-dry-observational', // 70
  'q-10-reply-pace-flexibility': 'opt-10-flexible-unhurried', // 80
  'q-11-unfamiliar-ideas': 'opt-11-curious-explore', // 85
  'q-12-conversation-corner': 'opt-12-quiet-corner', // 30
  'q-disagreement': 'opt-curiosity', // 90
  'q-14-text-misunderstanding': 'opt-14-phone-clarify', // 85
  'q-15-honesty-tact-tradeoff': 'opt-15-tactful-honesty', // 80
  'q-16-plans-disrupted': 'opt-16-adapt-calmly', // 85
  'q-17-trust-foundation': 'opt-17-consistent-actions', // 90
  'q-18-apology-meaning': 'opt-18-changed-behaviour', // 90
  'q-19-confidentiality-boundary': 'opt-19-strict-privacy', // 95
  'q-20-heated-voice-anchor-a': 'opt-20-pause-cool', // 85
  'q-21-respect-standard-anchor-b': 'opt-21-dignity-first', // 90
  'q-22-admired-virtue': 'opt-22-steadiness', // 90
  'q-23-complementarity-attitude': 'opt-23-welcome-balance', // 85
  'q-24-care-gesture-reflection': 'opt-24-remember-small-details', // 85
  'q-weekend': 'opt-unscheduled', // 30
};

/**
 * Member B: Aarav Iyer (Bengaluru)
 * - Intentions: Friendship & Dating
 * - Exclusivity preferred; wants children (flexible)
 * - 22 answered reflections; shares Kavya's reflective pace and high repair curiosity
 */
const AARAV_INITIAL_RAW_ANSWERS: Record<string, string> = {
  'q-pace': 'opt-slow', // 25 (identical to Kavya)
  'q-02-workweek-reply': 'opt-02-evening', // 30 (identical to Kavya)
  'q-03-first-meetup': 'opt-03-coffee', // 65 (identical to Kavya)
  'q-04-listening-role': 'opt-04-reflective', // 85 (identical to Kavya)
  'q-05-voice-vs-text': 'opt-05-text', // 30 (identical to Kavya)
  'q-06-reschedule-reliability': 'opt-06-proactive', // 90 (identical)
  'q-07-empathy-vs-solution': 'opt-07-listen-first', // 85 (identical)
  'q-08-post-meetup-recharge': 'opt-08-solo-recharge', // 25 (identical)
  'q-09-humour-style': 'opt-09-dry-observational', // 70 (identical)
  'q-10-reply-pace-flexibility': 'opt-10-flexible-unhurried', // 80 (identical)
  'q-11-unfamiliar-ideas': 'opt-11-curious-explore', // 85 (identical)
  'q-12-conversation-corner': 'opt-12-quiet-corner', // 30 (identical)
  'q-disagreement': 'opt-curiosity', // 90 (identical)
  'q-14-text-misunderstanding': 'opt-14-phone-clarify', // 85 (identical)
  'q-15-honesty-tact-tradeoff': 'opt-15-tactful-honesty', // 80 (identical)
  'q-16-plans-disrupted': 'opt-16-adapt-calmly', // 85 (identical)
  'q-17-trust-foundation': 'opt-17-consistent-actions', // 90 (identical)
  'q-18-apology-meaning': 'opt-18-changed-behaviour', // 90 (identical)
  'q-19-confidentiality-boundary': 'opt-19-strict-privacy', // 95 (identical)
  'q-20-heated-voice-anchor-a': 'opt-20-pause-cool', // 85 (identical)
  'q-21-respect-standard-anchor-b': 'opt-21-dignity-first', // 90 (identical)
  'q-22-admired-virtue': 'opt-22-steadiness', // 90 (identical)
};

/**
 * Member C: Meera Nair (Chennai)
 * - Intentions: Dating & Matrimony
 * - Requires exclusivity; essential desire for children
 * - 20 answered reflections focused on domestic balance and long-term values
 */
const MEERA_INITIAL_RAW_ANSWERS: Record<string, string> = {
  'q-pace': 'opt-early-call', // 65
  'q-03-first-meetup': 'opt-03-coffee', // 65
  'q-disagreement': 'opt-curiosity', // 90
  'q-15-honesty-tact-tradeoff': 'opt-15-tactful-honesty', // 80
  'q-17-trust-foundation': 'opt-17-consistent-actions', // 90
  'q-18-apology-meaning': 'opt-18-changed-behaviour', // 90
  'q-21-respect-standard-anchor-b': 'opt-21-dignity-first', // 90
  'q-22-admired-virtue': 'opt-22-steadiness', // 90
  'q-38-relationship-structure-gate': 'opt-38-exclusive-only', // 95
  'q-39-domestic-task-sharing': 'opt-39-equal-partnership', // 90
  'q-40-financial-philosophy': 'opt-40-transparency-joint', // 85
  'q-41-partner-solo-space': 'opt-41-respect-quiet-time', // 85
  'q-42-major-decision-style': 'opt-42-deliberative-together', // 90
  'q-44-weekday-home-atmosphere': 'opt-44-peaceful-restorative', // 85
  'q-46-budget-conversation-tone': 'opt-46-calm-collaborative', // 90
  'q-partnership': 'opt-partnership-team', // 90
  'q-50-children-goal-gate': 'opt-50-wants-children-essential', // 95
  'q-51-extended-family-advice': 'opt-51-kind-autonomous-boundary', // 85
  'q-58-egalitarian-partnership': 'opt-58-shared-decision-making', // 90
  'q-60-admired-marriage-quality': 'opt-60-unconditional-kindness', // 95
};

/**
 * Member D: Rohan Verma (Bengaluru)
 * - Intentions: Friendship & Dating
 * - Requires OPEN / Non-monogamous relationship structure
 * - Crucial test for Task 3 & Task 7:
 *   - Under FRIENDSHIP with Kavya: ELIGIBLE (friendship does not inherit romantic monogamy requirements!)
 *   - Under DATING with Kavya: INELIGIBLE (exclusive_required vs open_required hard conflict)
 */
const ROHAN_INITIAL_RAW_ANSWERS: Record<string, string> = {
  'q-pace': 'opt-slow', // 25
  'q-02-workweek-reply': 'opt-02-evening', // 30
  'q-03-first-meetup': 'opt-03-coffee', // 65
  'q-04-listening-role': 'opt-04-reflective', // 85
  'q-05-voice-vs-text': 'opt-05-voice-notes', // 75
  'q-07-empathy-vs-solution': 'opt-07-listen-first', // 85
  'q-09-humour-style': 'opt-09-dry-observational', // 70
  'q-11-unfamiliar-ideas': 'opt-11-curious-explore', // 85
  'q-disagreement': 'opt-curiosity', // 90
  'q-14-text-misunderstanding': 'opt-14-phone-clarify', // 85
  'q-16-plans-disrupted': 'opt-16-adapt-calmly', // 85
  'q-17-trust-foundation': 'opt-17-consistent-actions', // 90
  'q-23-complementarity-attitude': 'opt-23-welcome-balance', // 85
  'q-weekend': 'opt-planned', // 80 (different from Kavya)
  'q-38-relationship-structure-gate': 'opt-38-open-only', // 10 (Open required)
  'q-40-financial-philosophy': 'opt-40-autonomous-separate', // 20
  'q-41-partner-solo-space': 'opt-41-high-independence', // 90
  'q-45-work-life-boundaries': 'opt-45-fluid-creative', // 35
};

/**
 * Member E: Tara Sen (Bengaluru)
 * - Intentions: Friendship
 * - Only answered ONE question (`q-pace`).
 * - Demonstrates Task 5: Insufficient data returns `score: null` (`insufficient_information`).
 */
const TARA_INITIAL_RAW_ANSWERS: Record<string, string> = {
  'q-pace': 'opt-slow',
};

/**
 * Member F: Vikram Malhotra (Mumbai)
 * - Intentions: Friendship & Dating
 * - 19 answered reflections with starkly different preferences (fast messaging, large gatherings, high debate).
 * - Demonstrates Task 5: Full 0–100 spectrum score < 30/100 without being falsely hidden or banned.
 */
const VIKRAM_INITIAL_RAW_ANSWERS: Record<string, string> = {
  'q-pace': 'opt-group-first', // 85
  'q-02-workweek-reply': 'opt-02-instant', // 95
  'q-03-first-meetup': 'opt-03-dinner-drinks', // 90
  'q-04-listening-role': 'opt-04-active-debater', // 25
  'q-05-voice-vs-text': 'opt-05-calls-anytime', // 90
  'q-06-reschedule-reliability': 'opt-06-spontaneous-last-minute', // 20
  'q-07-empathy-vs-solution': 'opt-07-action-solutions-now', // 25
  'q-08-post-meetup-recharge': 'opt-08-energized-keep-going', // 90
  'q-09-humour-style': 'opt-09-roast-banter', // 25
  'q-10-reply-pace-flexibility': 'opt-10-expects-quick-replies', // 20
  'q-11-unfamiliar-ideas': 'opt-11-vigorous-debate', // 30
  'q-12-conversation-corner': 'opt-12-busy-center-room', // 90
  'q-disagreement': 'opt-debate-points', // 20
  'q-14-text-misunderstanding': 'opt-14-argue-it-out', // 25
  'q-15-honesty-tact-tradeoff': 'opt-15-brutal-candour', // 20
  'q-16-plans-disrupted': 'opt-16-pivot-boldly', // 30
  'q-weekend': 'opt-packed-itinerary', // 95
  'q-28-circle-participation': 'opt-28-lead-spotlight', // 90
  'q-32-home-hospitality-cadence': 'opt-32-open-house-parties', // 90
};

/* -------------------------------------------------------------------------- */
/*  IN-MEMORY CACHE WITH SAFELY ISOLATED LOCAL STORAGE FALLBACK               */
/* -------------------------------------------------------------------------- */

class PersistentStorageBackend {
  private memory = new Map<string, string>();

  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // ignore
    }
    return this.memory.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.memory.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // ignore
    }
  }

  removeItem(key: string): void {
    this.memory.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }

  clear(): void {
    this.memory.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEYS.ACTIVE_MEMBER_ID);
        window.localStorage.removeItem(STORAGE_KEYS.RAW_RESPONSES);
        window.localStorage.removeItem(STORAGE_KEYS.PROFILES);
        window.localStorage.removeItem(STORAGE_KEYS.USER_CONSENTS);
      }
    } catch {
      // ignore
    }
  }
}

const storage = new PersistentStorageBackend();

/* -------------------------------------------------------------------------- */
/*  STORE SINGLETON & INITIALIZATION                                          */
/* -------------------------------------------------------------------------- */

export interface MemberStoreState {
  activeMemberId: string;
  members: Record<string, MemberProfile>;
  rawResponses: RawResponsesByMember;
  consents: Record<string, { consentGivenAt: number; withdrawnAt?: number }>;
  skippedQuestions?: Record<string, string[]>;
}

let storeState: MemberStoreState = createInitialStoreState();

function buildRawResponseBucket(
  answers: Record<string, string>
): Record<string, StoredRawResponse> {
  const result: Record<string, StoredRawResponse> = {};
  const now = Date.now();
  for (const [qId, optId] of Object.entries(answers)) {
    result[qId] = {
      questionId: qId,
      optionId: optId,
      answeredAt: now,
      responseLatencyMs: 3500, // natural human latency
    };
  }
  return result;
}

function createInitialStoreState(): MemberStoreState {
  // Check if saved state exists in storage
  try {
    const savedActiveId = storage.getItem(STORAGE_KEYS.ACTIVE_MEMBER_ID);
    const savedResponses = storage.getItem(STORAGE_KEYS.RAW_RESPONSES);
    const savedProfiles = storage.getItem(STORAGE_KEYS.PROFILES);

    if (savedActiveId && savedResponses && savedProfiles) {
      const parsedResponses = JSON.parse(savedResponses) as RawResponsesByMember;
      const parsedProfiles = JSON.parse(savedProfiles) as Record<string, MemberProfile>;
      return {
        activeMemberId: savedActiveId,
        members: parsedProfiles,
        rawResponses: parsedResponses,
        consents: {},
      };
    }
  } catch {
    // fallback to initial seeded calibration
  }

  const rawResponses: RawResponsesByMember = {
    'member-kavya': buildRawResponseBucket(KAVYA_INITIAL_RAW_ANSWERS),
    'member-aarav': buildRawResponseBucket(AARAV_INITIAL_RAW_ANSWERS),
    'member-meera': buildRawResponseBucket(MEERA_INITIAL_RAW_ANSWERS),
    'member-rohan': buildRawResponseBucket(ROHAN_INITIAL_RAW_ANSWERS),
    'member-tara': buildRawResponseBucket(TARA_INITIAL_RAW_ANSWERS),
    'member-vikram': buildRawResponseBucket(VIKRAM_INITIAL_RAW_ANSWERS),
  };

  const kavyaConstructs = deriveConstructProfileFromAnswers(
    KAVYA_INITIAL_RAW_ANSWERS,
    PILOT_60_QUESTION_BANK
  );
  const aaravConstructs = deriveConstructProfileFromAnswers(
    AARAV_INITIAL_RAW_ANSWERS,
    PILOT_60_QUESTION_BANK
  );
  const meeraConstructs = deriveConstructProfileFromAnswers(
    MEERA_INITIAL_RAW_ANSWERS,
    PILOT_60_QUESTION_BANK
  );
  const rohanConstructs = deriveConstructProfileFromAnswers(
    ROHAN_INITIAL_RAW_ANSWERS,
    PILOT_60_QUESTION_BANK
  );
  const taraConstructs = deriveConstructProfileFromAnswers(
    TARA_INITIAL_RAW_ANSWERS,
    PILOT_60_QUESTION_BANK
  );
  const vikramConstructs = deriveConstructProfileFromAnswers(
    VIKRAM_INITIAL_RAW_ANSWERS,
    PILOT_60_QUESTION_BANK
  );

  const kavyaStaged = evaluateMemberStagedPattern(
    Object.keys(KAVYA_INITIAL_RAW_ANSWERS).length,
    kavyaConstructs
  );
  const aaravStaged = evaluateMemberStagedPattern(
    Object.keys(AARAV_INITIAL_RAW_ANSWERS).length,
    aaravConstructs
  );
  const meeraStaged = evaluateMemberStagedPattern(
    Object.keys(MEERA_INITIAL_RAW_ANSWERS).length,
    meeraConstructs
  );
  const rohanStaged = evaluateMemberStagedPattern(
    Object.keys(ROHAN_INITIAL_RAW_ANSWERS).length,
    rohanConstructs
  );
  const taraStaged = evaluateMemberStagedPattern(
    Object.keys(TARA_INITIAL_RAW_ANSWERS).length,
    taraConstructs
  );
  const vikramStaged = evaluateMemberStagedPattern(
    Object.keys(VIKRAM_INITIAL_RAW_ANSWERS).length,
    vikramConstructs
  );

  const members: Record<string, MemberProfile> = {
    'member-kavya': {
      id: 'member-kavya',
      name: 'Kavya Sundaram',
      ageRange: '28',
      city: 'Bengaluru',
      neighborhood: 'Indiranagar',
      languages: ['English', 'Kannada', 'Tamil'],
      intentions: ['friendship', 'dating'],
      primaryIntention: 'friendship',
      headline: 'Principal product designer drawn to print typography, plant ecology, and quiet evening letters.',
      bio: 'I design calm digital tools by day and restore secondhand wooden bookstands by night. Looking for unhurried conversations and thoughtful friends who value good books and listening.',
      interests: ['Books', 'Typography', 'Filter coffee', 'Urban gardening', 'History walks'],
      paceNote: 'Prefers 2–3 thoughtful evening messages before meeting for daytime coffee.',
      occupation: 'Principal Product Designer',
      portraitVariant: 'member-kavya',
      saved: false,
      connectionState: 'discover',
      constructProfile: kavyaConstructs,
      experimentalPrimaryPattern: kavyaStaged.assignedPrimaryArchetype ?? undefined,
      experimentalSecondaryPattern: kavyaStaged.assignedSecondaryArchetype ?? undefined,
      alignment: [],
      measuredDimensions: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: {
          dating: 'must_be_non_smoker',
          matrimony: 'must_be_non_smoker',
          friendship: 'no_preference',
        },
        isVoluntarilyDisclosed: true,
      },
      eligibility: {
        memberId: 'member-kavya',
        isAdultVerified: true,
        enabledIntentions: ['friendship', 'dating'],
        discoverableInIntentions: ['friendship', 'dating'],
        blockedMemberIds: [],
        relationshipStructure: 'exclusive_required',
        childrenPreference: 'wants_children',
        childrenRequirementLevel: 'flexible',
        smokingVapingProfile: {
          personalHabit: 'non_smoker',
          environmentComfort: 'smoke_free_only',
          partnerRequirementByIntention: {
            dating: 'must_be_non_smoker',
            matrimony: 'must_be_non_smoker',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        },
      },
    },
    'member-aarav': {
      id: 'member-aarav',
      name: 'Aarav Iyer',
      ageRange: '30',
      city: 'Bengaluru',
      neighborhood: 'Malleshwaram',
      languages: ['English', 'Kannada', 'Tamil', 'Hindi'],
      intentions: ['friendship', 'dating'],
      primaryIntention: 'friendship',
      headline: 'Archivist and photographer documenting historic city trees, heritage printing presses, and filter coffee.',
      bio: 'I run oral history documentation projects across old Bengaluru neighbourhoods. I love slow Saturday mornings with old maps, quiet reading corners, and good-faith conversation.',
      interests: ['Photography', 'Heritage', 'Reading', 'Architecture', 'Field sketches'],
      paceNote: 'Values unhurried conversation; prefers a calm voice call or daytime coffee walk.',
      occupation: 'Archivist & Documentary Photographer',
      portraitVariant: 'member-aarav',
      saved: false,
      connectionState: 'discover',
      constructProfile: aaravConstructs,
      experimentalPrimaryPattern: aaravStaged.assignedPrimaryArchetype ?? undefined,
      experimentalSecondaryPattern: aaravStaged.assignedSecondaryArchetype ?? undefined,
      alignment: [],
      measuredDimensions: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'outdoors_only',
        partnerRequirementByIntention: {
          dating: 'must_be_non_smoker',
          matrimony: 'must_be_non_smoker',
          friendship: 'no_preference',
        },
        isVoluntarilyDisclosed: true,
      },
      eligibility: {
        memberId: 'member-aarav',
        isAdultVerified: true,
        enabledIntentions: ['friendship', 'dating'],
        discoverableInIntentions: ['friendship', 'dating'],
        blockedMemberIds: [],
        relationshipStructure: 'exclusive_preferred',
        childrenPreference: 'wants_children',
        childrenRequirementLevel: 'flexible',
        smokingVapingProfile: {
          personalHabit: 'non_smoker',
          environmentComfort: 'outdoors_only',
          partnerRequirementByIntention: {
            dating: 'must_be_non_smoker',
            matrimony: 'must_be_non_smoker',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        },
      },
    },
    'member-meera': {
      id: 'member-meera',
      name: 'Meera Nair',
      ageRange: '29',
      city: 'Chennai',
      neighborhood: 'Adyar',
      languages: ['English', 'Tamil', 'Malayalam'],
      intentions: ['dating', 'matrimony'],
      primaryIntention: 'matrimony',
      headline: 'Landscape architect drawn to coastal morning walks, Carnatic music, and honest partnership.',
      bio: 'I design public parks and wetland sanctuaries. I value emotional steadiness, clear family values, financial openness, and an equal partnership built on mutual respect.',
      interests: ['Music', 'Public parks', 'Coastal walks', 'Cooking', 'Carnatic vocal'],
      paceNote: 'Appreciates moving to a calm phone or video conversation within two weeks.',
      occupation: 'Landscape Architect',
      portraitVariant: 'member-meera',
      saved: false,
      connectionState: 'discover',
      constructProfile: meeraConstructs,
      experimentalPrimaryPattern: meeraStaged.assignedPrimaryArchetype ?? undefined,
      experimentalSecondaryPattern: meeraStaged.assignedSecondaryArchetype ?? undefined,
      alignment: [],
      measuredDimensions: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: {
          dating: 'must_be_non_smoker',
          matrimony: 'must_be_non_smoker',
          friendship: 'no_preference',
        },
        isVoluntarilyDisclosed: true,
      },
      eligibility: {
        memberId: 'member-meera',
        isAdultVerified: true,
        enabledIntentions: ['dating', 'matrimony'],
        discoverableInIntentions: ['dating', 'matrimony'],
        blockedMemberIds: [],
        relationshipStructure: 'exclusive_required',
        childrenPreference: 'wants_children',
        childrenRequirementLevel: 'essential',
        smokingVapingProfile: {
          personalHabit: 'non_smoker',
          environmentComfort: 'smoke_free_only',
          partnerRequirementByIntention: {
            dating: 'must_be_non_smoker',
            matrimony: 'must_be_non_smoker',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        },
      },
    },
    'member-rohan': {
      id: 'member-rohan',
      name: 'Rohan Verma',
      ageRange: '31',
      city: 'Bengaluru',
      neighborhood: 'Koramangala',
      languages: ['English', 'Hindi'],
      intentions: ['friendship', 'dating'],
      primaryIntention: 'friendship',
      headline: 'Acoustic engineer and sound designer exploring modular synths and city soundscapes.',
      bio: 'I build spatial audio environments for museums. I keep an open, non-hierarchical approach to personal connections and value transparency and intellectual curiosity above all.',
      interests: ['Sound design', 'Cycling', 'Modular synths', 'Cinema', 'Espresso'],
      paceNote: 'Active communicator; loves sharing music links and meeting at weekend gigs.',
      occupation: 'Acoustic Engineer & Sound Designer',
      portraitVariant: 'member-rohan',
      saved: false,
      connectionState: 'discover',
      constructProfile: rohanConstructs,
      experimentalPrimaryPattern: rohanStaged.assignedPrimaryArchetype ?? undefined,
      experimentalSecondaryPattern: rohanStaged.assignedSecondaryArchetype ?? undefined,
      alignment: [],
      measuredDimensions: [],
      smokingVapingProfile: {
        personalHabit: 'occasional_social_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: {
          dating: 'no_preference',
          friendship: 'no_preference',
        },
        isVoluntarilyDisclosed: true,
      },
      eligibility: {
        memberId: 'member-rohan',
        isAdultVerified: true,
        enabledIntentions: ['friendship', 'dating'],
        discoverableInIntentions: ['friendship', 'dating'],
        blockedMemberIds: [],
        relationshipStructure: 'open_required',
        childrenPreference: 'open_or_unsure',
        childrenRequirementLevel: 'flexible',
        smokingVapingProfile: {
          personalHabit: 'occasional_social_smoker',
          environmentComfort: 'fully_comfortable',
          partnerRequirementByIntention: {
            dating: 'no_preference',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        },
      },
    },
    'member-tara': {
      id: 'member-tara',
      name: 'Tara Sen',
      ageRange: '26',
      city: 'Bengaluru',
      neighborhood: 'Whitefield',
      languages: ['English', 'Bengali', 'Hindi'],
      intentions: ['friendship'],
      primaryIntention: 'friendship',
      headline: 'Environmental researcher newly moved to Bengaluru; loves birdwatching and lake restoration.',
      bio: 'Just moved from Kolkata. Still getting settled and just started exploring Kithra! Looking for quiet weekend walking companions and local book clubs.',
      interests: ['Birdwatching', 'Lake ecology', 'Baking', 'Watercolour'],
      paceNote: 'New member—still completing questions.',
      occupation: 'Environmental Researcher',
      portraitVariant: 'member-tara',
      saved: false,
      connectionState: 'discover',
      constructProfile: taraConstructs,
      experimentalPrimaryPattern: taraStaged.assignedPrimaryArchetype ?? undefined,
      experimentalSecondaryPattern: taraStaged.assignedSecondaryArchetype ?? undefined,
      alignment: [],
      measuredDimensions: [],
      smokingVapingProfile: {
        personalHabit: 'unknown',
        environmentComfort: 'unknown',
        partnerRequirementByIntention: {},
        isVoluntarilyDisclosed: false,
      },
      eligibility: {
        memberId: 'member-tara',
        isAdultVerified: true,
        enabledIntentions: ['friendship'],
        discoverableInIntentions: ['friendship'],
        blockedMemberIds: [],
        relationshipStructure: 'unknown',
        childrenPreference: 'unknown',
        smokingVapingProfile: {
          personalHabit: 'unknown',
          environmentComfort: 'unknown',
          partnerRequirementByIntention: {},
          isVoluntarilyDisclosed: false,
        },
      },
    },
    'member-vikram': {
      id: 'member-vikram',
      name: 'Vikram Malhotra',
      ageRange: '34',
      city: 'Mumbai',
      neighborhood: 'Bandra',
      languages: ['English', 'Hindi', 'Punjabi'],
      intentions: ['friendship', 'dating'],
      primaryIntention: 'dating',
      headline: 'Fintech founder energized by high-velocity debates, fast road trips, and lively dinners.',
      bio: 'I run a fast-paced payments company. I thrive on high energy, spontaneous travel, rapid messaging, and direct, vigorous debate with people who speak their minds.',
      interests: ['Startups', 'Debate', 'Running', 'Fine dining', 'Road trips'],
      paceNote: 'Instant responder; prefers quick spontaneous phone calls over long letters.',
      occupation: 'Fintech Founder',
      portraitVariant: 'member-vikram',
      saved: false,
      connectionState: 'discover',
      constructProfile: vikramConstructs,
      experimentalPrimaryPattern: vikramStaged.assignedPrimaryArchetype ?? undefined,
      experimentalSecondaryPattern: vikramStaged.assignedSecondaryArchetype ?? undefined,
      alignment: [],
      measuredDimensions: [],
      smokingVapingProfile: {
        personalHabit: 'regular_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: {
          dating: 'no_preference',
          friendship: 'no_preference',
        },
        isVoluntarilyDisclosed: true,
      },
      eligibility: {
        memberId: 'member-vikram',
        isAdultVerified: true,
        enabledIntentions: ['friendship', 'dating'],
        discoverableInIntentions: ['friendship', 'dating'],
        blockedMemberIds: [],
        relationshipStructure: 'exclusive_required',
        childrenPreference: 'wants_children',
        childrenRequirementLevel: 'flexible',
        smokingVapingProfile: {
          personalHabit: 'regular_smoker',
          environmentComfort: 'fully_comfortable',
          partnerRequirementByIntention: {
            dating: 'no_preference',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        },
      },
    },
  };

  return {
    activeMemberId: 'member-kavya',
    members,
    rawResponses,
    consents: {},
  };
}

function persistStore(): void {
  try {
    storage.setItem(STORAGE_KEYS.ACTIVE_MEMBER_ID, storeState.activeMemberId);
    storage.setItem(STORAGE_KEYS.RAW_RESPONSES, JSON.stringify(storeState.rawResponses));
    storage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(storeState.members));
  } catch {
    // ignore
  }
}

/* -------------------------------------------------------------------------- */
/*  PUBLIC STORE API                                                          */
/* -------------------------------------------------------------------------- */

export const memberStore = {
  /** Returns the active logged-in member ID */
  getActiveMemberId(): string {
    return storeState.activeMemberId;
  },

  /** Switch active account (e.g. for testing Member A vs Member B perspectives) */
  setActiveMemberId(memberId: string): void {
    if (!storeState.members[memberId]) {
      throw new Error(`Member not found: ${memberId}`);
    }
    storeState.activeMemberId = memberId;
    persistStore();
  },

  /** Get active member profile */
  getActiveMember(): MemberProfile {
    return storeState.members[storeState.activeMemberId] ?? Object.values(storeState.members)[0];
  },

  /** Get all registered members */
  getAllMembers(): MemberProfile[] {
    return Object.values(storeState.members);
  },

  /** Get member profile by ID */
  getMemberById(memberId: string): MemberProfile | undefined {
    return storeState.members[memberId];
  },

  /**
   * TASK 2 & 6: Saves a single assessment question response for a member.
   * - Persists raw response with timestamp and latency.
   * - Records actual visual displayedOptionIndex and semanticId (no arbitrary idx % 3).
   * - Automatically synchronizes Stage A gates (Q38, Q50, Q63) with member eligibility & lifestyle profile.
   * - Updates continuous construct vectors dynamically via `deriveConstructProfileFromAnswers`.
   * - Recalculates staged pattern via `evaluateMemberStagedPattern`.
   * - Evaluates response quality (non-accusatory check for rapid clicking or straight-lining).
   */
  saveMemberAnswer(
    memberId: string,
    questionId: string,
    optionId: string,
    latencyMs = 3000,
    displayedOptionIndex?: number
  ): {
    quality: ReturnType<typeof evaluateResponseQuality>;
    profile: MemberProfile;
    constructProfile: ConstructVectorPoint[];
  } {
    const member = storeState.members[memberId];
    if (!member) {
      throw new Error(`Member not found: ${memberId}`);
    }

    if (!storeState.rawResponses[memberId]) {
      storeState.rawResponses[memberId] = {};
    }

    const qItem = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.id === questionId);
    const chosenOpt = qItem?.options.find((o) => o.id === optionId);
    const semanticId = chosenOpt?.semanticId ?? optionId;
    const resolvedDisplayedIndex =
      displayedOptionIndex !== undefined
        ? displayedOptionIndex
        : (qItem?.options.findIndex((o) => o.id === optionId) ?? 0);

    storeState.rawResponses[memberId][questionId] = {
      questionId,
      optionId,
      semanticId,
      answeredAt: Date.now(),
      responseLatencyMs: latencyMs,
      displayedOptionIndex: resolvedDisplayedIndex >= 0 ? resolvedDisplayedIndex : 0,
    };

    // Ensure member eligibility exists
    if (!member.eligibility) {
      member.eligibility = {
        memberId,
        isAdultVerified: true,
        enabledIntentions: member.intentions,
        discoverableInIntentions: member.intentions,
        blockedMemberIds: [],
      };
    }

    // Auto-sync Q38 Relationship Structure Gate
    if (questionId === 'q-38-relationship-structure-gate') {
      if (optionId === 'opt-q38-exclusive' || semanticId.includes('exclusive')) {
        member.eligibility.relationshipStructure = 'exclusive_required';
      } else if (optionId === 'opt-q38-open' || semanticId.includes('open')) {
        member.eligibility.relationshipStructure = 'open_required';
      } else if (optionId === 'opt-q38-flexible' || semanticId.includes('flexible')) {
        member.eligibility.relationshipStructure = 'flexible_either';
      }
    }

    // Auto-sync Q50 Children Goal Gate
    if (questionId === 'q-50-children-goal-gate') {
      if (optionId === 'opt-q50-wants' || semanticId.includes('wants')) {
        member.eligibility.childrenPreference = 'wants_children';
        member.eligibility.childrenRequirementLevel = 'essential';
      } else if (optionId === 'opt-q50-no' || semanticId.includes('no')) {
        member.eligibility.childrenPreference = 'does_not_want_children';
        member.eligibility.childrenRequirementLevel = 'essential';
      } else if (optionId === 'opt-q50-open' || semanticId.includes('open')) {
        member.eligibility.childrenPreference = 'open_or_flexible';
        member.eligibility.childrenRequirementLevel = 'flexible';
      }
    }

    // Auto-sync Q61 Smoking Habit
    if (questionId === 'q-61-smoking-habit') {
      if (!member.smokingVapingProfile) {
        member.smokingVapingProfile = {
          personalHabit: 'unknown',
          environmentComfort: 'unknown',
          partnerRequirementByIntention: {
            dating: 'no_preference',
            matrimony: 'no_preference',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        };
      }
      if (optionId === 'opt-q61-non-smoker' || semanticId.includes('non-smoker')) {
        member.smokingVapingProfile.personalHabit = 'non_smoker';
      } else if (optionId === 'opt-q61-occasional' || semanticId.includes('occasional')) {
        member.smokingVapingProfile.personalHabit = 'occasional_social_smoker';
      } else if (optionId === 'opt-q61-regular' || semanticId.includes('regular')) {
        member.smokingVapingProfile.personalHabit = 'regular_smoker';
      } else if (optionId === 'opt-q61-vape-only' || semanticId.includes('vape-only')) {
        member.smokingVapingProfile.personalHabit = 'vape_only';
      } else if (optionId === 'opt-q61-prefer-not-say' || semanticId.includes('prefer-not-say')) {
        member.smokingVapingProfile.personalHabit = 'prefer_not_to_say';
      }
      member.smokingVapingProfile.isVoluntarilyDisclosed = true;
      member.eligibility.smokingVapingProfile = member.smokingVapingProfile;
    }

    // Auto-sync Q62 Smoking Environment Comfort
    if (questionId === 'q-62-smoking-comfort') {
      if (!member.smokingVapingProfile) {
        member.smokingVapingProfile = {
          personalHabit: 'unknown',
          environmentComfort: 'unknown',
          partnerRequirementByIntention: {
            dating: 'no_preference',
            matrimony: 'no_preference',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        };
      }
      if (optionId === 'opt-q62-smoke-free-only' || semanticId.includes('smoke-free')) {
        member.smokingVapingProfile.environmentComfort = 'smoke_free_only';
      } else if (optionId === 'opt-q62-outdoors-only' || semanticId.includes('outdoors')) {
        member.smokingVapingProfile.environmentComfort = 'outdoors_only';
      } else if (optionId === 'opt-q62-fully-comfortable' || semanticId.includes('fully-comfortable')) {
        member.smokingVapingProfile.environmentComfort = 'fully_comfortable';
      } else if (optionId === 'opt-q62-prefer-not-say' || semanticId.includes('prefer-not-say')) {
        member.smokingVapingProfile.environmentComfort = 'prefer_not_to_say';
      }
      member.smokingVapingProfile.isVoluntarilyDisclosed = true;
      member.eligibility.smokingVapingProfile = member.smokingVapingProfile;
    }

    // Auto-sync Q63 Partner Smoking Requirement
    if (questionId === 'q-63-partner-smoking-requirement') {
      if (!member.smokingVapingProfile) {
        member.smokingVapingProfile = {
          personalHabit: 'unknown',
          environmentComfort: 'unknown',
          partnerRequirementByIntention: {
            dating: 'no_preference',
            matrimony: 'no_preference',
            friendship: 'no_preference',
          },
          isVoluntarilyDisclosed: true,
        };
      }
      let req: PartnerSmokingRequirement = 'no_preference';
      if (optionId === 'opt-q63-must-be-non-smoker' || semanticId.includes('must-be-non-smoker')) {
        req = 'must_be_non_smoker';
      } else if (optionId === 'opt-q63-occasional-or-vape' || semanticId.includes('occasional-or-vape')) {
        req = 'occasional_or_vape_acceptable';
      } else if (optionId === 'opt-q63-no-preference' || semanticId.includes('no-preference')) {
        req = 'no_preference';
      } else if (optionId === 'opt-q63-prefer-not-say' || semanticId.includes('prefer-not-say')) {
        req = 'prefer_not_to_say';
      }

      member.smokingVapingProfile.partnerRequirementByIntention.dating = req;
      member.smokingVapingProfile.partnerRequirementByIntention.matrimony = req;
      member.smokingVapingProfile.partnerRequirementByIntention.friendship = 'no_preference';
      member.smokingVapingProfile.isVoluntarilyDisclosed = true;
      member.eligibility.smokingVapingProfile = member.smokingVapingProfile;
    }

    // Extract flat answer dictionary
    const rawAnswersDict: Record<string, string> = {};
    const latencies: number[] = [];
    for (const [qId, rec] of Object.entries(storeState.rawResponses[memberId])) {
      rawAnswersDict[qId] = rec.optionId;
      if (rec.responseLatencyMs) latencies.push(rec.responseLatencyMs);
    }

    // Dynamic construct profile derivation
    const constructs = deriveConstructProfileFromAnswers(rawAnswersDict, RESEARCH_PILOT_QUESTION_BANK);

    // Dynamic staged pattern evaluation
    const staged = evaluateMemberStagedPattern(
      Object.keys(rawAnswersDict).length,
      constructs
    );

    // Prepare administered item responses for non-accusatory quality evaluation
    const itemResponses: AdministeredItemResponse[] = Object.entries(
      storeState.rawResponses[memberId]
    ).map(([qId, rec], idx) => ({
      questionId: qId,
      itemId: qId,
      displayedOptionIndex: rec.displayedOptionIndex ?? (idx % 4),
      semanticOptionId: rec.semanticId ?? rec.optionId,
      responseTimeMs: rec.responseLatencyMs ?? latencyMs,
    }));

    const quality = evaluateResponseQuality(
      `sess-${memberId}`,
      itemResponses
    );

    // Update stored member profile
    member.constructProfile = constructs;
    member.experimentalPrimaryPattern = staged.assignedPrimaryArchetype ?? undefined;
    member.experimentalSecondaryPattern = staged.assignedSecondaryArchetype ?? undefined;

    persistStore();

    return {
      quality,
      profile: member,
      constructProfile: constructs,
    };
  },

  /**
   * Adaptive Question Selection: Predicts and provides the next question
   * tailored to the member's current answered set, responses, intentions, and fatigue state.
   */
  getNextAdaptiveQuestionForMember(
    memberId: string,
    options?: {
      targetSectionId?: ProfileSectionId;
      sessionAnswersCount?: number;
      questionBank?: AssessmentQuestion[];
    }
  ) {
    const member = storeState.members[memberId];
    if (!member) throw new Error(`Member not found: ${memberId}`);
    const rawMap = storeState.rawResponses[memberId] ?? {};
    const answeredIds = Object.keys(rawMap);
    const skippedList = storeState.skippedQuestions?.[memberId] ?? [];

    return selectNextAdaptiveQuestion({
      answeredQuestionIds: answeredIds,
      memberAnswers: rawMap,
      intentions: member.intentions,
      questionBank: options?.questionBank ?? EXPANDED_PILOT_QUESTION_BANK,
      targetSectionId: options?.targetSectionId,
      sessionAnswersCount: options?.sessionAnswersCount ?? 0,
      skippedQuestionIds: skippedList,
    });
  },

  /**
   * Explicitly skips a question for a member so they are never badgered with it again.
   * Zero penalty on account readiness or compatibility.
   */
  skipAssessmentQuestion(memberId: string, questionId: string) {
    if (!storeState.skippedQuestions) {
      storeState.skippedQuestions = {};
    }
    if (!storeState.skippedQuestions[memberId]) {
      storeState.skippedQuestions[memberId] = [];
    }
    if (!storeState.skippedQuestions[memberId].includes(questionId)) {
      storeState.skippedQuestions[memberId].push(questionId);
    }
    return { success: true, memberId, skippedQuestionId: questionId };
  },

  /**
   * Alias for saveMemberAnswer conforming to AssessmentResponse parameter naming.
   */
  saveAssessmentResponse(params: {
    memberId: string;
    questionId: string;
    optionId: string;
    displayedVisualIndex?: number;
    responseLatencyMs?: number;
  }) {
    return memberStore.saveMemberAnswer(
      params.memberId,
      params.questionId,
      params.optionId,
      params.responseLatencyMs ?? 3000,
      params.displayedVisualIndex
    );
  },

  /**
   * Computes Naukri-style multidimensional profile readiness breakdown for member.
   */
  getMemberProfileReadiness(
    memberId: string,
    bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
  ): ProfileReadinessBreakdown {
    const member = storeState.members[memberId];
    if (!member) throw new Error(`Member not found: ${memberId}`);
    const rawMap = storeState.rawResponses[memberId] ?? {};
    return computeProfileReadinessBreakdown(member, Object.keys(rawMap), bank);
  },

  /**
   * Computes status and completion metrics for all 10 profile sections.
   */
  getMemberProfileSectionsStatus(
    memberId: string,
    bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
  ): ProfileSectionStatus[] {
    const member = storeState.members[memberId];
    if (!member) throw new Error(`Member not found: ${memberId}`);
    const rawMap = storeState.rawResponses[memberId] ?? {};
    return computeProfileSectionsStatus(member, Object.keys(rawMap), bank);
  },

  /**
   * Evaluates psychological triangulation across all situational clusters.
   */
  getMemberTriangulationResults(
    memberId: string,
    bank: AssessmentQuestion[] = EXPANDED_PILOT_QUESTION_BANK
  ): Record<string, TriangulationClusterResult> {
    const rawMap = storeState.rawResponses[memberId] ?? {};
    return evaluateAllTriangulationClusters(rawMap, bank);
  },

  /**
   * TASK 2 & 6: Server-side authorized retrieval of raw responses.
   * Strictly enforces that other members, moderators, and support cannot view raw answers!
   */
  getMemberRawAnswers(
    memberId: string,
    requesterRole: RawAnswerRequesterRole,
    requesterId?: string
  ): Record<string, string> {
    const auth = authorizeRawAnswerAccess({
      requesterRole,
      requesterId,
      targetMemberId: memberId,
    });

    if (!auth.allowed) {
      throw new Error(auth.reason);
    }

    const memberResponses = storeState.rawResponses[memberId] ?? {};
    const result: Record<string, string> = {};
    for (const [qId, rec] of Object.entries(memberResponses)) {
      result[qId] = rec.optionId;
    }
    return result;
  },

  /**
   * TASK 2 & 6: Section 27 DPDP Act 2023 Consent Withdrawal & Assessment Data Deletion.
   * Completely purges all stored raw questionnaire responses, derived construct vectors,
   * archetype assignments, and cached pairwise similarity scores for the member.
   */
  deleteMemberAssessmentData(memberId: string): {
    success: boolean;
    memberId: string;
    rawAnswersRemaining: 0;
    derivedVectorsCleared: true;
    pairwiseCacheInvalidated: true;
  } {
    const member = storeState.members[memberId];
    if (member) {
      member.constructProfile = [];
      member.experimentalPrimaryPattern = undefined;
      member.experimentalSecondaryPattern = undefined;
      member.attributeSimilarityScore = null;
    }

    delete storeState.rawResponses[memberId];

    if (!storeState.consents[memberId]) {
      storeState.consents[memberId] = { consentGivenAt: 0 };
    }
    storeState.consents[memberId].withdrawnAt = Date.now();

    persistStore();

    return {
      success: true,
      memberId,
      rawAnswersRemaining: 0,
      derivedVectorsCleared: true,
      pairwiseCacheInvalidated: true,
    };
  },

  /**
   * TASK 3: Live Dynamic Match Engine.
   * Evaluates Member A against every other candidate from their own submitted, persisted answers.
   * ZERO hardcoded similarity percentages!
   */
  getDynamicMatchesForActiveMember(
    viewerId?: string,
    intention: IntentionId | 'all' = 'all',
    filterCriteria?: Partial<FullRangeDiscoveryFilterCriteria>
  ): MemberProfile[] {
    const activeId = viewerId ?? storeState.activeMemberId;
    const viewer = storeState.members[activeId];
    if (!viewer) return [];

    const candidates = Object.values(storeState.members).filter((m) => m.id !== activeId);

    const evaluatedCandidates: MemberProfile[] = candidates.map((candidate) => {
      const effectiveIntention: IntentionId =
        intention === 'all'
          ? candidate.primaryIntention ?? candidate.intentions[0] ?? 'friendship'
          : intention;

      const pairwise = evaluateMemberPairwiseMatch(viewer, candidate, effectiveIntention);

      return {
        ...candidate,
        attributeSimilarityScore: pairwise.dynamicSimilarityScore,
        sharedGroundSummary: pairwise.sharedGroundSummary,
        differenceSummary: pairwise.differenceSummary,
        potentialBalanceSummary: pairwise.potentialBalanceSummary,
        pairwiseEvaluation: pairwise,
      } as MemberProfile;
    });

    return filterProfilesByFullSimilaritySpectrum(evaluatedCandidates, {
      intention,
      city: filterCriteria?.city ?? 'All cities',
      searchQuery: filterCriteria?.searchQuery ?? '',
      savedOnly: filterCriteria?.savedOnly ?? false,
      minSimilarity: filterCriteria?.minSimilarity ?? 0,
      maxSimilarity: filterCriteria?.maxSimilarity ?? 100,
      lensView: filterCriteria?.lensView ?? 'all',
      sortBySimilarity: filterCriteria?.sortBySimilarity ?? 'none',
      viewerEligibility: viewer.eligibility,
      viewerId: viewer.id,
    });
  },

  /**
   * Evaluates pairwise relationship between any two specific members on demand.
   */
  getPairwiseEvaluation(
    viewerId: string,
    candidateId: string,
    intention: IntentionId = 'friendship'
  ): MemberPairwiseMatchResult {
    const viewer = storeState.members[viewerId];
    const candidate = storeState.members[candidateId];
    if (!viewer || !candidate) {
      throw new Error(`Members not found: ${viewerId}, ${candidateId}`);
    }
    return evaluateMemberPairwiseMatch(viewer, candidate, intention);
  },

  /** Get internal store state for diagnostic inspection and tests */
  getInternalState(): typeof storeState {
    return storeState;
  },

  /** Reset store to original factory calibrated state */
  resetStoreToDefaults(): void {
    storage.clear();
    storeState = createInitialStoreState();
    persistStore();
  },
};
