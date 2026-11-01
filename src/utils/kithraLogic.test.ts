import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPhotoCropAdjustment,
  computeAssessmentProgress,
  filterProfiles,
  filterStaffCases,
  getPageTitleForRoute,
  getVisiblePhotosForIntention,
  groupAlignmentByKind,
  parsePathnameToRoute,
  reorderPhotos,
  togglePhotoIntentionVisibility,
  validateAuthForm,
} from './kithraLogic';
import {
  AssessmentQuestion,
  ConstructVectorPoint,
  MemberEligibilityRequirements,
  MemberPhoto,
  MemberProfile,
  QualitativeAlignment,
  StaffCase,
} from '../types/kithra';
import {
  ASSESSMENT_QUESTIONS,
  INITIAL_MEMBER_PROFILES,
  SIGNAL_VOCABULARY_METADATA,
} from '../data/mockFixtures';
import {
  applyConsentWithdrawalOrDeletion,
  authorizeRawAnswerAccess,
  computeAttributeSimilarity,
  evaluateContextualTriangulation,
  evaluateMemberStagedPattern,
  evaluateMutualEligibility,
  evaluateResponseQuality,
  evaluateWeBalanceEachOther,
  filterProfilesByFullSimilaritySpectrum,
  getMemberFacingLensLabel,
  LENS_DISPLAY_MAP,
  PSYCHOLOGY_ENGINE_VERSION,
  scoreShuffledResponseOption,
  shuffleQuestionOptionsDeterministically,
} from '../domain/psychologyEngine';

const sampleAlignments: QualitativeAlignment[] = [
  {
    id: 'a-echo',
    kind: 'echo',
    theme: 'Shared evening conversational pace',
    summary: 'Both of you prefer thoughtful evening letters over rapid-fire daytime chat.',
    sharedSignals: ['Evening replies', 'Long-form notes'],
    conversationPrompt: 'Ask about their favourite neighbourhood walk.',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
  },
  {
    id: 'a-counter',
    kind: 'counterpoint',
    theme: 'Different weekend social size',
    summary: 'One enjoys hosting 8-person potlucks while the other prefers 1:1 walks.',
    sharedSignals: ['Potluck tables vs quiet walks'],
    conversationPrompt: 'Compare how you each recharge after a busy workweek.',
    applicableIntentions: ['dating', 'matrimony'],
  },
  {
    id: 'a-mosaic',
    kind: 'mosaic',
    theme: 'Planner & improviser complementarity',
    summary: 'One brings structure to travel plans while the other spots serendipitous stops.',
    sharedSignals: ['Structured itinerary + local detours'],
    conversationPrompt: 'Share a memorable trip where plans changed for the better.',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
  },
];

const sampleProfiles: MemberProfile[] = [
  {
    id: 'm1',
    name: 'Aarav Iyer',
    ageRange: '29',
    city: 'Bengaluru',
    languages: ['English', 'Tamil'],
    intentions: ['friendship', 'dating'],
    primaryIntention: 'friendship',
    headline: 'Architect and weekend long-distance walker',
    bio: 'Enjoys slow Sunday walks and reading history.',
    interests: ['Architecture', 'Books', 'Filter coffee'],
    paceNote: 'Prefers thoughtful messages over rapid-fire chat.',
    occupation: 'Conservation Architect',
    portraitVariant: 'member-aarav',
    alignment: sampleAlignments,
    measuredDimensions: [],
    connectionState: 'discover',
    saved: true,
  },
  {
    id: 'm2',
    name: 'Meera Nair',
    ageRange: '31',
    city: 'Chennai',
    languages: ['English', 'Malayalam', 'Tamil'],
    intentions: ['matrimony'],
    primaryIntention: 'matrimony',
    headline: 'Classical listener and medical researcher',
    bio: 'Looking for a grounded partnership built on mutual respect.',
    interests: ['Carnatic music', 'Coastal walks', 'Cooking'],
    paceNote: 'Likes moving from messages to a calm phone call within two weeks.',
    occupation: 'Clinical Researcher',
    portraitVariant: 'member-meera',
    alignment: [],
    measuredDimensions: [],
    connectionState: 'discover',
    saved: false,
  },
];

test('filterProfiles filters by intention, city, saved status, and search query', () => {
  const friendshipOnly = filterProfiles(sampleProfiles, {
    intention: 'friendship',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
  });
  assert.equal(friendshipOnly.length, 1);
  assert.equal(friendshipOnly[0].id, 'm1');

  const chennaiOnly = filterProfiles(sampleProfiles, {
    intention: 'all',
    city: 'Chennai',
    searchQuery: '',
    savedOnly: false,
  });
  assert.equal(chennaiOnly.length, 1);
  assert.equal(chennaiOnly[0].id, 'm2');

  const queryMatch = filterProfiles(sampleProfiles, {
    intention: 'all',
    city: 'All cities',
    searchQuery: 'carnatic',
    savedOnly: false,
  });
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].name, 'Meera Nair');
});

test('validateAuthForm enforces email, password, and join fields', () => {
  const emptyResult = validateAuthForm({ mode: 'signin', email: '', password: '' });
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.password);

  const validSignIn = validateAuthForm({
    mode: 'signin',
    email: 'member@kithra.example',
    password: 'thoughtful-password',
  });
  assert.equal(validSignIn.valid, true);

  const incompleteJoin = validateAuthForm({
    mode: 'join',
    email: 'new@kithra.example',
    password: 'thoughtful-password',
    fullName: '',
    city: '',
  });
  assert.equal(incompleteJoin.valid, false);
  assert.ok(incompleteJoin.errors.fullName);
  assert.ok(incompleteJoin.errors.city);
});

test('togglePhotoIntentionVisibility, reorderPhotos, and applyPhotoCropAdjustment update state cleanly', () => {
  const photos: MemberPhoto[] = [
    {
      id: 'p1',
      title: 'Primary courtyard portrait',
      caption: 'Morning light in Indiranagar',
      altText: 'Aarav standing on a sunlit veranda',
      isPrimary: true,
      aspectRatio: '4:5',
      variant: 'photo-primary',
      crop: { zoom: 1, panX: 0, panY: 0, rotation: 0 },
      visibleIn: { friendship: true, dating: false, matrimony: true },
      moderationStatus: 'Approved',
    },
    {
      id: 'p2',
      title: 'Bookshop table',
      caption: 'Sunday reading session',
      altText: 'Two filter coffee cups on a bookshop table',
      isPrimary: false,
      aspectRatio: '1:1',
      variant: 'photo-secondary',
      crop: { zoom: 1, panX: 0, panY: 0, rotation: 0 },
      visibleIn: { friendship: true, dating: true, matrimony: false },
      moderationStatus: 'Approved',
    },
  ];

  const toggled = togglePhotoIntentionVisibility(photos, 'p1', 'dating');
  assert.equal(toggled[0].visibleIn.dating, true);
  assert.equal(getVisiblePhotosForIntention(toggled, 'dating').length, 2);

  const reordered = reorderPhotos(toggled, 'p2', 'up');
  assert.equal(reordered[0].id, 'p2');
  assert.equal(reordered[0].isPrimary, true);
  assert.equal(reordered[1].isPrimary, false);

  const cropped = applyPhotoCropAdjustment(photos[0].crop, {
    zoom: 2.8,
    panX: -12,
    panY: 60,
    rotation: 90,
  });
  assert.equal(cropped.zoom, 2.2);
  assert.equal(cropped.panX, -12);
  assert.equal(cropped.panY, 40);
  assert.equal(cropped.rotation, 90);
});

test('parsePathnameToRoute, getPageTitleForRoute, and groupAlignmentByKind work across routes and intentions', () => {
  const matchRoute = parsePathnameToRoute('/member/match/member-meera');
  assert.equal(matchRoute.section, 'member');
  assert.equal(matchRoute.memberTab, 'match');
  assert.equal(matchRoute.matchMemberId, 'member-meera');
  assert.match(
    getPageTitleForRoute(matchRoute),
    /Similar to Me, Different from Me & We Balance Each Other/
  );

  const adminLoginRoute = parsePathnameToRoute('/admin/login');
  assert.equal(adminLoginRoute.section, 'admin-login');

  const adminQuestionsRoute = parsePathnameToRoute('/admin/questions');
  assert.equal(adminQuestionsRoute.section, 'admin');
  assert.equal(adminQuestionsRoute.adminTab, 'questions');

  const unknownRoute = parsePathnameToRoute('/non-existent-url-path');
  assert.equal(unknownRoute.section, 'states');
  assert.equal(unknownRoute.stateCode, '404');

  const groupedFriendship = groupAlignmentByKind(sampleAlignments, 'friendship');
  assert.equal(groupedFriendship.echo.length, 1);
  assert.equal(groupedFriendship.counterpoint.length, 0);
  assert.equal(groupedFriendship.mosaic.length, 1);

  const groupedDating = groupAlignmentByKind(sampleAlignments, 'dating');
  assert.equal(groupedDating.counterpoint.length, 1);
});

test('filterStaffCases and computeAssessmentProgress return accurate results', () => {
  const cases: StaffCase[] = [
    {
      id: 'K-101',
      category: 'Impersonation concern',
      priority: 'High',
      status: 'Awaiting review',
      reportedContext: 'Profile photo mismatch report',
      submittedAt: '2 hours ago',
      assignedTo: 'Trust Queue',
      summary: 'Member flagged possible duplicate profile.',
      notes: [],
    },
    {
      id: 'K-102',
      category: 'Photo report',
      priority: 'Normal',
      status: 'In queue',
      reportedContext: 'Group photo crop check',
      submittedAt: '5 hours ago',
      assignedTo: 'Photo Review',
      summary: 'Primary photo contains multiple people.',
      notes: [],
    },
  ];

  const highOnly = filterStaffCases(cases, { priority: 'High', status: 'All', query: '' });
  assert.equal(highOnly.length, 1);
  assert.equal(highOnly[0].id, 'K-101');

  const questions: AssessmentQuestion[] = [
    {
      id: 'q1',
      themeId: 'theme-1',
      questionNumber: 1,
      module: 'Conversational Pace & Presence',
      intentionScope: 'All intentions',
      applicableIntentions: ['friendship', 'dating', 'matrimony'],
      prompt: 'How do you prefer a new connection to unfold?',
      context: 'Helps align conversation pace.',
      whyWeAsk: 'Prevents misreading workweek silence.',
      options: [
        {
          id: 'o1',
          label: 'Slow and steady',
          reflection: 'Unhurried pace',
          signalEffect: 'Similar to Me on conversational cadence',
        },
      ],
    },
    {
      id: 'q2',
      themeId: 'theme-2',
      questionNumber: 21,
      module: 'Everyday Values & Repair',
      intentionScope: 'All intentions',
      applicableIntentions: ['friendship', 'dating', 'matrimony'],
      prompt: 'What makes a disagreement constructive?',
      context: 'Helps surface conflict styles.',
      whyWeAsk: 'Clarifies repair habits.',
      options: [
        {
          id: 'o2',
          label: 'Listening first',
          reflection: 'Calm dialogue',
          signalEffect: 'Similar to Me on repair style',
        },
      ],
    },
  ];

  const progress = computeAssessmentProgress(questions, { q1: 'o1' });
  assert.equal(progress.answeredCount, 1);
  assert.equal(progress.totalCount, 2);
  assert.equal(progress.percent, 50);
});

// ============================================================================
// SECTION 26 REQUIRED PSYCHOLOGICAL ENGINE TESTS (Test A through Test N)
// ============================================================================

const sampleConstructVectorA: ConstructVectorPoint[] = [
  {
    constructId: 'C1_openness',
    constructName: 'Curiosity & Openness',
    layer: 'personality',
    score: 85,
    confidence: 0.85,
    answeredItemCount: 8,
    importance: 'important',
  },
  {
    constructId: 'C2_planfulness',
    constructName: 'Structure & Planfulness',
    layer: 'personality',
    score: 80,
    confidence: 0.8,
    answeredItemCount: 7,
    importance: 'flexible',
  },
  {
    constructId: 'C4_warmth',
    constructName: 'Interpersonal Warmth & Repair',
    layer: 'values',
    score: 90,
    confidence: 0.9,
    answeredItemCount: 8,
    importance: 'essential',
  },
];

test('Test A — 5-Answer Non-Overclaim: Answering 5 questions returns a provisional reflection note, NOT a confident archetype', () => {
  const stage1Result = evaluateMemberStagedPattern(5, sampleConstructVectorA);
  assert.equal(stage1Result.stage, 1);
  assert.equal(stage1Result.confidenceBand, 'provisional_early_note');
  assert.equal(stage1Result.assignedPrimaryArchetype, null);
  assert.equal(stage1Result.assignedSecondaryArchetype, null);
  assert.match(stage1Result.provisionalNotice, /5 questions cannot assign a fixed personality type/i);

  const stage2Result = evaluateMemberStagedPattern(18, sampleConstructVectorA);
  assert.equal(stage2Result.stage, 2);
  assert.equal(stage2Result.confidenceBand, 'developing_pattern');
  assert.ok(stage2Result.assignedPrimaryArchetype !== null);
});

test('Test B — Option Order Randomization: Shuffling option order changes display position while preserving semantic score', () => {
  const originalOptions = ASSESSMENT_QUESTIONS[0].options;
  const shuffledA = shuffleQuestionOptionsDeterministically(originalOptions, 'seed-alpha-1');
  const shuffledB = shuffleQuestionOptionsDeterministically(originalOptions, 'seed-beta-99');

  const targetSemanticId = 'sem-pace-reflective-letters';
  const indexInA = shuffledA.findIndex((o) => o.semanticId === targetSemanticId);
  const indexInB = shuffledB.findIndex((o) => o.semanticId === targetSemanticId);

  const scoredA = scoreShuffledResponseOption(shuffledA, indexInA);
  const scoredB = scoreShuffledResponseOption(shuffledB, indexInB);

  assert.equal(scoredA.semanticOptionId, targetSemanticId);
  assert.equal(scoredB.semanticOptionId, targetSemanticId);
  assert.equal(scoredA.normalizedValue, 25);
  assert.equal(scoredB.normalizedValue, 25);
});

test('Test C — Contextual Variation Is Not Flagged as Lying: Festivals with friends + solitude when exhausted produces plausible_situational_variation', () => {
  const result = evaluateContextualTriangulation({
    constructId: 'C3_social_energy',
    generalTraitScore: 78, // enjoys festive gatherings with friends
    contextualScenarioScore: 22, // needs quiet solitude when exhausted after work
    scenarioHasFatigueOrRoleContext: true,
    directAnchorConflictDetected: false,
    answeredCountForConstruct: 5,
  });

  assert.equal(result.outcome, 'plausible_situational_variation');
  assert.equal(result.isFlaggedAsDishonest, false);
  assert.match(result.explanation, /normal contextual nuance/i);
});

test('Test D — Genuine Contradiction Handling: Directly conflicting anchor items trigger clarification_needed, NOT an accusation or suspension', () => {
  const triangulation = evaluateContextualTriangulation({
    constructId: 'C2_planfulness',
    generalTraitScore: 95,
    contextualScenarioScore: 5,
    scenarioHasFatigueOrRoleContext: false,
    directAnchorConflictDetected: true,
    answeredCountForConstruct: 6,
  });
  assert.equal(triangulation.outcome, 'contradiction_requiring_clarification');
  assert.equal(triangulation.isFlaggedAsDishonest, false);

  const quality = evaluateResponseQuality('sess-d', [
    { itemId: 'q1', displayedOptionIndex: 0, semanticOptionId: 's1', responseTimeMs: 3200, constructId: 'C2', normalizedValue: 95 },
    { itemId: 'q2', displayedOptionIndex: 2, semanticOptionId: 's2', responseTimeMs: 3400, constructId: 'C2', normalizedValue: 5 },
    { itemId: 'q3', displayedOptionIndex: 1, semanticOptionId: 's3', responseTimeMs: 2900, constructId: 'C1', normalizedValue: 70 },
    { itemId: 'q4', displayedOptionIndex: 0, semanticOptionId: 's4', responseTimeMs: 3100, constructId: 'C3', normalizedValue: 60 },
    { itemId: 'q5', displayedOptionIndex: 2, semanticOptionId: 's5', responseTimeMs: 3500, constructId: 'C4', normalizedValue: 80 },
  ], 2);

  assert.equal(quality.qualityState, 'clarification_needed');
  assert.equal(quality.isAccusedOfDishonesty, false);
  assert.equal(quality.isBlockedOrSuspended, false);
});

test('Test E — Careless / Ultra-Fast Pattern: Ultra-fast uniform clicking lowers confidence and emits minimal admin event without raw answers', () => {
  const carelessEvents = Array.from({ length: 8 }, (_, idx) => ({
    itemId: `q-${idx + 1}`,
    displayedOptionIndex: 0, // uniform top-option clicking
    semanticOptionId: `sem-${idx + 1}`,
    responseTimeMs: 450, // ultra-fast < 900ms
    constructId: 'C1_openness',
    normalizedValue: idx % 2 === 0 ? 95 : 10,
  }));

  const quality = evaluateResponseQuality('sess-careless-1', carelessEvents, 2);
  assert.equal(quality.qualityState, 'low_confidence_validity');
  assert.equal(quality.isAccusedOfDishonesty, false);
  assert.equal(quality.isBlockedOrSuspended, false);
  assert.ok(quality.adminEvent !== null);
  assert.equal(quality.adminEvent?.eventType, 'assessment_quality_review_recommended');
  assert.equal(quality.adminEvent?.rawAnswersIncluded, false);
});

test('Test F — Thoughtful Fast Reader Protection: Fast completion with internally coherent semantic choices is NOT penalized', () => {
  const fastCoherentEvents = [
    { itemId: 'q1', displayedOptionIndex: 2, semanticOptionId: 's1', responseTimeMs: 820, constructId: 'C1', normalizedValue: 85 },
    { itemId: 'q2', displayedOptionIndex: 0, semanticOptionId: 's2', responseTimeMs: 790, constructId: 'C1', normalizedValue: 88 },
    { itemId: 'q3', displayedOptionIndex: 1, semanticOptionId: 's3', responseTimeMs: 850, constructId: 'C2', normalizedValue: 75 },
    { itemId: 'q4', displayedOptionIndex: 2, semanticOptionId: 's4', responseTimeMs: 880, constructId: 'C3', normalizedValue: 72 },
    { itemId: 'q5', displayedOptionIndex: 0, semanticOptionId: 's5', responseTimeMs: 810, constructId: 'C4', normalizedValue: 90 },
  ];

  const quality = evaluateResponseQuality('sess-fast-reader', fastCoherentEvents, 0);
  assert.equal(quality.qualityState, 'valid_high_confidence');
  assert.equal(quality.isAccusedOfDishonesty, false);
  assert.equal(quality.isBlockedOrSuspended, false);
  assert.equal(quality.adminEvent, null);
});

test('Test G — Mutual Eligibility Gate: Incompatible non-negotiables prevent romantic/matrimony pairing regardless of similarity', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-1',
    isAdultVerified: true,
    enabledIntentions: ['dating', 'matrimony'],
    discoverableInIntentions: ['dating', 'matrimony'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    childrenPreference: 'wants_children',
    childrenRequirementLevel: 'essential',
  };

  const incompatibleCandidate: MemberEligibilityRequirements = {
    memberId: 'cand-1',
    isAdultVerified: true,
    enabledIntentions: ['dating', 'matrimony'],
    discoverableInIntentions: ['dating', 'matrimony'],
    blockedMemberIds: [],
    relationshipStructure: 'open_required',
    childrenPreference: 'does_not_want_children',
    childrenRequirementLevel: 'essential',
  };

  const result = evaluateMutualEligibility(viewer, incompatibleCandidate, 'dating');
  assert.equal(result.eligible, false);
  assert.ok(result.reasons.includes('incompatible_relationship_structure'));
  assert.ok(result.reasons.includes('incompatible_children_goal'));
});

test('Test H — Unknown Field Handling: Unanswered optional preferences (unknown) do NOT falsely fail eligibility', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-1',
    isAdultVerified: true,
    enabledIntentions: ['matrimony'],
    discoverableInIntentions: ['matrimony'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    childrenPreference: 'wants_children',
    childrenRequirementLevel: 'essential',
  };

  const candidateWithUnknowns: MemberEligibilityRequirements = {
    memberId: 'cand-unknown',
    isAdultVerified: true,
    enabledIntentions: ['matrimony'],
    discoverableInIntentions: ['matrimony'],
    blockedMemberIds: [],
    relationshipStructure: 'unknown',
    childrenPreference: 'unknown',
    childrenRequirementLevel: 'flexible',
  };

  const result = evaluateMutualEligibility(viewer, candidateWithUnknowns, 'matrimony');
  assert.equal(result.eligible, true);
  assert.equal(result.hasUnknownNonNegotiables, true);
});

test('Test I — Intention Isolation: Friendship matching does NOT use romantic/matrimony-only criteria', () => {
  const viewer: MemberEligibilityRequirements = {
    memberId: 'viewer-1',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'],
    discoverableInIntentions: ['friendship', 'dating'],
    blockedMemberIds: [],
    relationshipStructure: 'exclusive_required',
    childrenPreference: 'wants_children',
    childrenRequirementLevel: 'essential',
  };

  const candidate: MemberEligibilityRequirements = {
    memberId: 'cand-2',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'],
    discoverableInIntentions: ['friendship', 'dating'],
    blockedMemberIds: [],
    relationshipStructure: 'open_required',
    childrenPreference: 'does_not_want_children',
    childrenRequirementLevel: 'essential',
  };

  const friendshipEligibility = evaluateMutualEligibility(viewer, candidate, 'friendship');
  const datingEligibility = evaluateMutualEligibility(viewer, candidate, 'dating');

  assert.equal(friendshipEligibility.eligible, true);
  assert.equal(datingEligibility.eligible, false);
});

test('Test J — Similar to Me / Different from Me / We Balance Each Other: High similarity, meaningful difference, and complementary balance are generated distinctly', () => {
  const viewerConstructs: ConstructVectorPoint[] = [
    { constructId: 'C1', constructName: 'Openness', layer: 'personality', score: 85, confidence: 0.9, answeredItemCount: 6, importance: 'important' },
    { constructId: 'C2', constructName: 'Planfulness', layer: 'personality', score: 82, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' },
    { constructId: 'C3', constructName: 'Social Cadence', layer: 'personality', score: 30, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' },
  ];

  const candidateConstructs: ConstructVectorPoint[] = [
    { constructId: 'C1', constructName: 'Openness', layer: 'personality', score: 88, confidence: 0.9, answeredItemCount: 6, importance: 'important' }, // Similar to Me (diff 3)
    { constructId: 'C2', constructName: 'Planfulness', layer: 'personality', score: 52, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' }, // Moderate complementary diff (diff 30)
    { constructId: 'C3', constructName: 'Social Cadence', layer: 'personality', score: 85, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' }, // Different from Me (diff 55)
  ];

  const sim = computeAttributeSimilarity(viewerConstructs, candidateConstructs);
  assert.equal(sim.status, 'computed');
  assert.ok(sim.sharedGroundConstructs.includes('Openness'));
  assert.ok(sim.differenceConstructs.includes('Social Cadence'));

  const balance = evaluateWeBalanceEachOther(viewerConstructs, candidateConstructs, {
    mutualAcceptanceOfDifference: true,
    boundaryViolationFlag: false,
  });
  assert.equal(balance.qualifiesForWeBalanceEachOther, true);
  assert.ok(balance.complementaryThemes.includes('Planfulness'));
});

test('Test K — Boundary Protection in Complementarity: Harmful or coercive mismatches are never framed as We Balance Each Other', () => {
  const viewerConstructs: ConstructVectorPoint[] = [
    { constructId: 'C2', constructName: 'Planfulness', layer: 'personality', score: 80, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' },
  ];
  const candidateConstructs: ConstructVectorPoint[] = [
    { constructId: 'C2', constructName: 'Planfulness', layer: 'personality', score: 45, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' },
  ];

  const rejectedDueToBoundary = evaluateWeBalanceEachOther(viewerConstructs, candidateConstructs, {
    mutualAcceptanceOfDifference: true,
    boundaryViolationFlag: true,
  });
  assert.equal(rejectedDueToBoundary.qualifiesForWeBalanceEachOther, false);
  assert.equal(rejectedDueToBoundary.complementaryScore, 0);

  const rejectedDueToNoAcceptance = evaluateWeBalanceEachOther(viewerConstructs, candidateConstructs, {
    mutualAcceptanceOfDifference: false,
    boundaryViolationFlag: false,
  });
  assert.equal(rejectedDueToNoAcceptance.qualifiesForWeBalanceEachOther, false);
});

test('Test L — Admin Privacy: Standard admin/support views cannot access raw member questionnaire answers', () => {
  const supportCheck = authorizeRawAnswerAccess('admin_support');
  const trustCheck = authorizeRawAnswerAccess('trust_safety');
  const selfCheck = authorizeRawAnswerAccess('member_self');

  assert.equal(supportCheck.allowed, false);
  assert.equal(trustCheck.allowed, false);
  assert.equal(selfCheck.allowed, true);
});

test('Test M — Consent Withdrawal / Deletion: Withdrawing assessment consent removes raw responses and invalidates derived scores cleanly', () => {
  const purged = applyConsentWithdrawalOrDeletion({
    memberId: 'member-aarav',
    rawAnswers: { 'q-pace': 'opt-slow', 'q-disagreement': 'opt-curiosity' },
    derivedConstructs: sampleConstructVectorA,
  });

  assert.equal(purged.rawAnswersRemaining, 0);
  assert.equal(purged.derivedVectorsCleared, true);
  assert.equal(purged.ArchetypeCleared, true);
  assert.equal(purged.pairwiseCacheInvalidated, true);
});

test('Test N — Versioning: Scoring and rule evaluations record explicit deterministic engine version', () => {
  const sim = computeAttributeSimilarity(sampleConstructVectorA, sampleConstructVectorA);
  const stage = evaluateMemberStagedPattern(20, sampleConstructVectorA);
  assert.equal(sim.engineVersion, PSYCHOLOGY_ENGINE_VERSION);
  assert.equal(stage.engineVersion, PSYCHOLOGY_ENGINE_VERSION);
  assert.match(PSYCHOLOGY_ENGINE_VERSION, /deterministic/);
});

// ============================================================================
// CHANGE 3 TARGETED TESTS (Test 1 through Test 9)
// ============================================================================

test('Test 1 — Lens Name Replacement: User-facing labels are Similar to Me, Different from Me, and We Balance Each Other', () => {
  assert.equal(getMemberFacingLensLabel('echo'), 'Similar to Me');
  assert.equal(getMemberFacingLensLabel('counterpoint'), 'Different from Me');
  assert.equal(getMemberFacingLensLabel('mosaic'), 'We Balance Each Other');

  assert.equal(SIGNAL_VOCABULARY_METADATA.echo.label, 'Similar to Me');
  assert.equal(SIGNAL_VOCABULARY_METADATA.counterpoint.label, 'Different from Me');
  assert.equal(SIGNAL_VOCABULARY_METADATA.mosaic.label, 'We Balance Each Other');

  assert.equal(
    LENS_DISPLAY_MAP.echo.subtitle,
    'Discover people who share your traits, interests and values.'
  );
  assert.equal(
    LENS_DISPLAY_MAP.counterpoint.subtitle,
    'Meet people who see or experience the world differently.'
  );
  assert.equal(
    LENS_DISPLAY_MAP.mosaic.subtitle,
    'Find people whose strengths and preferences may complement yours.'
  );
});

test('Test 2 — Full-Range Discovery (0–100): Eligible members with attribute similarity scores 95, 75, 50, 25, and 5 are all discoverable when filter is 0–100', () => {
  const allRangeResults = filterProfilesByFullSimilaritySpectrum(INITIAL_MEMBER_PROFILES, {
    intention: 'all',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 100,
  });

  const returnedScores = allRangeResults.map((p) => p.attributeSimilarityScore);
  assert.ok(returnedScores.includes(95));
  assert.ok(returnedScores.includes(75));
  assert.ok(returnedScores.includes(50));
  assert.ok(returnedScores.includes(25));
  assert.ok(returnedScores.includes(5));
  assert.equal(allRangeResults.length, INITIAL_MEMBER_PROFILES.length);
});

test('Test 3 — Custom Low-Similarity Filter: Setting the filter to 0–20 returns eligible members in that range and excludes higher-similarity members', () => {
  const lowRangeResults = filterProfiles(INITIAL_MEMBER_PROFILES, {
    intention: 'all',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 20,
    similarityPreset: 'custom',
  });

  assert.ok(lowRangeResults.length >= 1);
  assert.ok(lowRangeResults.every((p) => (p.attributeSimilarityScore ?? -1) >= 0 && (p.attributeSimilarityScore ?? 101) <= 20));
  assert.ok(lowRangeResults.some((p) => p.attributeSimilarityScore === 5));
  assert.ok(!lowRangeResults.some((p) => p.attributeSimilarityScore === 95));
});

test('Test 4 — Custom Mid-Similarity Filter: Setting the filter to 40–60 returns eligible members in that range (e.g., score 50)', () => {
  const midRangeResults = filterProfiles(INITIAL_MEMBER_PROFILES, {
    intention: 'all',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 40,
    maxSimilarity: 60,
    similarityPreset: 'custom',
  });

  assert.equal(midRangeResults.length, 1);
  assert.equal(midRangeResults[0].attributeSimilarityScore, 50);
  assert.equal(midRangeResults[0].id, 'member-rohan');
});

test('Test 5 — Custom High-Similarity Filter: Setting the filter to 90–100 returns eligible members in that range (e.g., score 95)', () => {
  const highRangeResults = filterProfiles(INITIAL_MEMBER_PROFILES, {
    intention: 'all',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 90,
    maxSimilarity: 100,
    similarityPreset: 'custom',
  });

  assert.equal(highRangeResults.length, 1);
  assert.equal(highRangeResults[0].attributeSimilarityScore, 95);
  assert.equal(highRangeResults[0].id, 'member-aarav');
});

test('Test 6 — Eligibility Still Enforced: A member with 95/100 attribute similarity who fails mutual eligibility is NOT returned', () => {
  const viewerBlockingAarav: MemberEligibilityRequirements = {
    memberId: 'viewer-self',
    isAdultVerified: true,
    enabledIntentions: ['friendship', 'dating'],
    discoverableInIntentions: ['friendship', 'dating'],
    blockedMemberIds: ['member-aarav'], // Aarav has 95/100 similarity but is blocked
    relationshipStructure: 'exclusive_preferred',
    childrenPreference: 'open_or_unsure',
    childrenRequirementLevel: 'flexible',
  };

  const results = filterProfiles(INITIAL_MEMBER_PROFILES, {
    intention: 'friendship',
    city: 'All cities',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 100,
    viewerEligibility: viewerBlockingAarav,
  });

  assert.ok(!results.some((p) => p.id === 'member-aarav'));
});

test('Test 7 — Missing Data Handling: A member with insufficient comparable answers is marked insufficient_information, not 0/100', () => {
  const singleConstructOnly: ConstructVectorPoint[] = [
    {
      constructId: 'C1_openness',
      constructName: 'Openness',
      layer: 'personality',
      score: 80,
      confidence: 0.8,
      answeredItemCount: 3,
      importance: 'flexible',
    },
  ];

  const result = computeAttributeSimilarity(singleConstructOnly, sampleConstructVectorA);
  assert.equal(result.status, 'insufficient_information');
  assert.equal(result.score, null);
  assert.notEqual(result.score, 0);
});

test('Test 8 — We Balance Each Other Independence: A pair with moderate similarity (e.g., 55/100) and strong complementary traits appears in We Balance Each Other without inflating attribute similarity', () => {
  const viewerConstructs: ConstructVectorPoint[] = [
    { constructId: 'C1', constructName: 'Openness', layer: 'personality', score: 80, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' },
    { constructId: 'C2', constructName: 'Planfulness', layer: 'personality', score: 85, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' },
  ];
  const candidateConstructs: ConstructVectorPoint[] = [
    { constructId: 'C1', constructName: 'Openness', layer: 'personality', score: 35, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' }, // diff 45
    { constructId: 'C2', constructName: 'Planfulness', layer: 'personality', score: 40, confidence: 0.85, answeredItemCount: 6, importance: 'flexible' }, // diff 45
  ];

  const simBefore = computeAttributeSimilarity(viewerConstructs, candidateConstructs);
  const balance = evaluateWeBalanceEachOther(viewerConstructs, candidateConstructs, {
    mutualAcceptanceOfDifference: true,
    boundaryViolationFlag: false,
  });
  const simAfter = computeAttributeSimilarity(viewerConstructs, candidateConstructs);

  assert.equal(simBefore.score, 55);
  assert.equal(balance.qualifiesForWeBalanceEachOther, true);
  assert.ok(balance.complementaryScore >= 60);
  assert.equal(simAfter.score, 55); // Unchanged / never inflated by complementarity
});

test('Test 9 — Deterministic Output: Running the same comparison twice with the same inputs produces identical similarity scores and lens explanations', () => {
  const run1 = computeAttributeSimilarity(
    INITIAL_MEMBER_PROFILES[0].constructProfile ?? [],
    INITIAL_MEMBER_PROFILES[1].constructProfile ?? []
  );
  const run2 = computeAttributeSimilarity(
    INITIAL_MEMBER_PROFILES[0].constructProfile ?? [],
    INITIAL_MEMBER_PROFILES[1].constructProfile ?? []
  );

  assert.deepEqual(run1, run2);

  const balance1 = evaluateWeBalanceEachOther(
    INITIAL_MEMBER_PROFILES[0].constructProfile ?? [],
    INITIAL_MEMBER_PROFILES[1].constructProfile ?? []
  );
  const balance2 = evaluateWeBalanceEachOther(
    INITIAL_MEMBER_PROFILES[0].constructProfile ?? [],
    INITIAL_MEMBER_PROFILES[1].constructProfile ?? []
  );

  assert.deepEqual(balance1, balance2);
});
