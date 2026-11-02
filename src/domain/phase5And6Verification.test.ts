/**
 * KITHRA PHASE 5 & 6 MASTER VERIFICATION TEST SUITE
 *
 * Verifies:
 * 1. 125-Item Expanded Candidate Question Bank & 240-Item Architecture Spec
 * 2. Naukri-Style Progressive Profile Completion & Decoupled Readiness Breakdown
 * 3. Fatigue-Aware Session Pacing, Save & Resume, and Explicit Skip Respect
 * 4. Response-Aware Adaptive Question Engine with Triangulation Pairing
 * 5. Psychological Triangulation across Contextual Clusters (Consistent vs Nuance vs Clarification)
 * 6. UI Gameable Hint Removal & Admin Question Governance with 403 Raw Answer Invariant
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPANDED_PILOT_QUESTION_BANK,
  PROPOSED_240_ITEM_RESEARCH_SPEC,
  auditPilotQuestionBank,
} from '../data/pilotQuestionBank';
import {
  computeProfileReadinessBreakdown,
  computeProfileSectionsStatus,
  PROFILE_SECTIONS_SPEC,
} from './progressiveProfileEngine';
import {
  selectNextAdaptiveQuestion,
  STARTER_BATTERY_QUESTION_IDS,
  ESSENTIAL_GATE_QUESTION_IDS,
} from './adaptiveQuestionEngine';
import {
  evaluateTriangulationCluster,
  evaluateAllTriangulationClusters,
  TRIANGULATION_CLUSTERS,
} from './triangulationEngine';
import { memberStore } from './memberStore';
import { MemberProfile } from '../types/kithra';

// ============================================================================
// TEST GROUP 1: QUESTION BANK ARCHITECTURE & 125 CANDIDATE ITEMS
// ============================================================================

test('Test 1.1 — 125-Item Expanded Candidate Bank Audit', () => {
  assert.equal(
    EXPANDED_PILOT_QUESTION_BANK.length,
    125,
    'Expected 60 baseline + 3 lifestyle + 62 expanded candidate items = 125 items'
  );

  // Run psychometric audit
  const audit = auditPilotQuestionBank(EXPANDED_PILOT_QUESTION_BANK);
  assert.equal(audit.allHaveUniqueSemanticIds, true, 'All semantic IDs across 125 items must be strictly unique');
  assert.equal(audit.allHaveThreeLanguages, true, 'All 125 items must provide English, Tamil, and Hindi prompts');
  assert.equal(audit.allHaveScoringTypes, true, 'All 125 items must define empirical scoringType');
  assert.equal(audit.allHaveResearchBasis, true, 'All 125 items must cite peer-reviewed psychological literature');
  assert.equal(audit.allHaveMeasurementLimitations, true, 'All 125 items must document psychometric limitations');

  // Verify all 12 psychological domains have active items
  const domains = new Set(EXPANDED_PILOT_QUESTION_BANK.map((q) => q.constructId).filter(Boolean));
  assert.ok(domains.size >= 12, `Expected at least 12 construct domains, found: ${domains.size}`);

  // Verify completion burden and cultural notes are present on expanded candidate items
  const q64 = EXPANDED_PILOT_QUESTION_BANK.find((q) => q.id === 'q-64-confidentiality-friendship');
  assert.ok(q64);
  assert.equal(q64.sectionId, 'relational_boundaries');
  assert.equal(q64.triangulationClusterId, 'confidentiality_expectations');
  assert.ok(typeof q64.completionBurdenMs === 'number' && q64.completionBurdenMs > 0);
  assert.ok(q64.culturalSuitabilityNotes && q64.culturalSuitabilityNotes.length > 10);
});

test('Test 1.2 — 240-Item Research Architecture Specification', () => {
  assert.equal(
    PROPOSED_240_ITEM_RESEARCH_SPEC.length,
    12,
    'Must define exactly 12 psychological domains'
  );

  // Sum of target items across all 12 domains must equal 240
  const sumItems = PROPOSED_240_ITEM_RESEARCH_SPEC.reduce(
    (acc, d) => acc + d.target240Count,
    0
  );
  assert.equal(sumItems, 240, 'Domain target item counts must sum to 240');

  // Verify each domain has theoretical basis and clusters
  for (const d of PROPOSED_240_ITEM_RESEARCH_SPEC) {
    assert.equal(d.target240Count, 20);
    assert.ok(d.coreTheoreticalBasis.length > 10);
    assert.ok(d.triangulationClusters.length >= 2);
  }
});

// ============================================================================
// TEST GROUP 2: NAUKRI-STYLE PROGRESSIVE PROFILE COMPLETION
// ============================================================================

test('Test 2.1 — 100% Account Readiness Reachable Without 240 Questions', () => {
  // A member with basic profile filled but 0 assessment answers
  const basicMember: Partial<MemberProfile> = {
    id: 'member-test-newbie',
    name: 'Ananya Sharma',
    city: 'Chennai',
    bio: 'Architect passionate about sustainable urban spaces and morning cycling along the coast.',
    intentions: ['friendship', 'dating'],
    portraitVariant: 'member-ananya',
  };

  const readiness = computeProfileReadinessBreakdown(basicMember, []);

  // Account Profile Readiness MUST be 100% because name, city, bio, intentions, and portrait are present!
  assert.equal(
    readiness.accountProfileReadiness,
    100,
    'Account Profile Readiness must reach 100% from core account fields alone'
  );

  // Psychological depth is 0% - user is NOT forced to answer questions to have a complete basic account!
  assert.equal(readiness.psychologicalAssessmentCoverage, 0);
  assert.equal(readiness.optionalAssessmentDepth, 0);

  // Next recommendation correctly points to relationship intentions / gates
  assert.equal(readiness.nextRecommendedSection, 'relationship_intentions');
});

test('Test 2.2 — Section-by-Section Progress & Time Estimates (10 Sections)', () => {
  assert.equal(PROFILE_SECTIONS_SPEC.length, 10, 'Must have exactly 10 structured profile sections');

  const member: Partial<MemberProfile> = {
    id: 'member-kavya',
    name: 'Kavya Sundaram',
    city: 'Bengaluru',
    bio: 'Principal product designer drawn to print typography and quiet evening walks.',
    intentions: ['friendship', 'dating'],
    portraitVariant: 'member-kavya',
  };

  // Give 5 communication answers and Stage A gates
  const answeredIds = [
    ...STARTER_BATTERY_QUESTION_IDS,
    ...ESSENTIAL_GATE_QUESTION_IDS,
  ];

  const sections = computeProfileSectionsStatus(member, answeredIds, EXPANDED_PILOT_QUESTION_BANK);
  assert.equal(sections.length, 10);

  const basicSec = sections.find((s) => s.sectionId === 'basic_profile');
  assert.equal(basicSec?.status, 'completed');
  assert.equal(basicSec?.answeredCount, 5);

  const commSec = sections.find((s) => s.sectionId === 'communication_style');
  assert.ok(commSec);
  assert.ok(commSec.answeredCount > 0);
  assert.ok(typeof commSec.estimatedMinutesRemaining === 'number');
  assert.ok(commSec.privacyBadge.includes('Private'));
});

test('Test 2.3 — Relationship Gate Readiness Decoupled From Trait Inventory', () => {
  const member: Partial<MemberProfile> = {
    id: 'member-test-gates',
    name: 'Vikram Menon',
    city: 'Kochi',
    bio: 'Software engineer building open-source developer tooling.',
    intentions: ['dating', 'matrimony'],
    portraitVariant: 'member-vikram',
  };

  // Only answer Stage A essential gates
  const gateAnswers = [
    'q-38-relationship-structure-gate',
    'q-50-children-goal-gate',
    'q-63-partner-smoking-requirement',
  ];

  const readiness = computeProfileReadinessBreakdown(member, gateAnswers);

  // Relationship Preference Readiness reaches 100% (intentions + 3 Stage A gates)
  assert.equal(readiness.relationshipPreferenceReadiness, 100);

  // Both basic profile & gates are complete -> Ready for Discovery is TRUE!
  assert.equal(
    readiness.isReadyForDiscovery,
    true,
    'Member should be discoverable once basic account + essential gates are established'
  );
});

// ============================================================================
// TEST GROUP 3: FATIGUE-AWARE SESSIONS & SKIP CONTROLS
// ============================================================================

test('Test 3.1 — Fatigue Guardrail: Break Recommended After 10 Questions', () => {
  // Test session with 10 questions answered in a single active sitting
  const result = selectNextAdaptiveQuestion({
    answeredQuestionIds: STARTER_BATTERY_QUESTION_IDS,
    sessionAnswersCount: 10,
    intentions: ['friendship'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.equal(result.breakRecommended, true, 'Engine must flag break recommendation after 10 questions in a session');
  assert.ok(result.breakAdvisory?.includes('10 thoughtful questions'));
  assert.ok(result.breakAdvisory?.includes('Taking a break is completely okay'));
});

test('Test 3.2 — Explicit Skip Respect: Zero Badgering & Zero Penalty', () => {
  const skippedQuestionId = 'q-38-relationship-structure-gate';

  // Ask engine to select next question with skipped set
  const result = selectNextAdaptiveQuestion({
    answeredQuestionIds: STARTER_BATTERY_QUESTION_IDS,
    skippedQuestionIds: [skippedQuestionId],
    intentions: ['dating'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  // Next question must NOT be the skipped question
  assert.notEqual(result.nextQuestion?.id, skippedQuestionId);

  // Member store skip recording
  const skipResult = memberStore.skipAssessmentQuestion('member-kavya', 'q-78-philosophical-debate-comfort');
  assert.equal(skipResult.success, true);
  assert.equal(skipResult.skippedQuestionId, 'q-78-philosophical-debate-comfort');
});

test('Test 3.3 — Instant Save & Cross-Device Persistence in Store', () => {
  const testMemberId = 'member-kavya';
  const testQId = 'q-64-confidentiality-friendship';
  const testOptId = 'opt-q64-strict';

  const saveRes = memberStore.saveAssessmentResponse({
    memberId: testMemberId,
    questionId: testQId,
    optionId: testOptId,
    displayedVisualIndex: 0,
    responseLatencyMs: 4200,
  });

  assert.equal(saveRes.profile.id, testMemberId);

  // Retrieve via authorized raw answers getter
  const answers = memberStore.getMemberRawAnswers(testMemberId, 'member_self', testMemberId);
  assert.equal(answers[testQId], testOptId, 'Saved response must persist and be retrievable by self');
});

// ============================================================================
// TEST GROUP 4: RESPONSE-AWARE ADAPTIVE BRANCHING
// ============================================================================

test('Test 4.1 — Response-Aware Adaptive Branching via Paired Follow-Up', () => {
  // Member answers Q64 (confidentiality in friendship) with strict privacy
  const answeredIds = [...STARTER_BATTERY_QUESTION_IDS, 'q-64-confidentiality-friendship'];
  const memberAnswers = {
    'q-64-confidentiality-friendship': {
      optionId: 'opt-q64-strict',
      semanticId: 'sem-conf-friend-strict',
      normalizedValue: 95,
    },
  };

  const nextResult = selectNextAdaptiveQuestion({
    answeredQuestionIds: answeredIds,
    memberAnswers,
    intentions: ['friendship'],
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  });

  assert.ok(nextResult.nextQuestion);
  // Engine should prioritize the paired follow-up in the same cluster: q-65 (workplace confidentiality)
  assert.equal(nextResult.selectionReason, 'response_triangulation_pair');
  assert.equal(nextResult.nextQuestion.id, 'q-65-confidentiality-workplace');
  assert.equal(nextResult.activeClusterId, 'confidentiality_expectations');
});

test('Test 4.2 — Adaptive Question Engine Reproducibility & Determinism', () => {
  const context = {
    answeredQuestionIds: ['q-pace', 'q-02-workweek-reply'],
    intentions: ['friendship', 'dating'] as const,
    questionBank: EXPANDED_PILOT_QUESTION_BANK,
  };

  const run1 = selectNextAdaptiveQuestion(context);
  const run2 = selectNextAdaptiveQuestion(context);

  assert.equal(run1.nextQuestion?.id, run2.nextQuestion?.id);
  assert.equal(run1.selectionReason, run2.selectionReason);
  assert.equal(run1.engineVersion, run2.engineVersion);
});

// ============================================================================
// TEST GROUP 5: PSYCHOLOGICAL TRIANGULATION ENGINE
// ============================================================================

test('Test 5.1 — Triangulation: Consistent Stance Across Contexts (Spread <= 28)', () => {
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'confidentiality_expectations')!;
  assert.ok(cluster);

  // Member reports high confidentiality in friendship (95) and high in workplace (85)
  const answers = {
    'q-64-confidentiality-friendship': { optionId: 'opt-q64-strict', normalizedValue: 95 },
    'q-65-confidentiality-workplace': { optionId: 'opt-q65-compartmentalized', normalizedValue: 85 },
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  assert.equal(result.classification, 'consistent_stance');
  assert.ok(result.spread !== undefined && result.spread <= 28);
  assert.ok(result.userFacingExplanation.includes('steady personal preference'));
});

test('Test 5.2 — Triangulation: Situational Nuance (Spread 29–58)', () => {
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'social_energy_vs_solitude')!;
  assert.ok(cluster);

  // Member needs quiet after Friday work (35) but enjoys hosting in safe personal space (75)
  // Spread = 40 pts -> Plausible situational variation
  const answers = {
    'q-76-friday-energy-restore': { optionId: 'opt-q76-solo', normalizedValue: 35 },
    'q-77-hosting-vs-meeting': { optionId: 'opt-q77-hosting', normalizedValue: 75 },
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  assert.equal(result.classification, 'plausible_situational_variation');
  assert.ok(result.spread !== undefined && result.spread > 28 && result.spread <= 58);
  assert.ok(result.userFacingExplanation.includes('situational adaptability'));
});

test('Test 5.3 — Triangulation: Clarification Needed Without Lie Detector Language', () => {
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'honesty_and_accountability')!;
  assert.ok(cluster);

  // Directly conflicting anchor choices without contextual rationale (Spread = 65 pts)
  const answers = {
    'q-68-accountability-mistake': { optionId: 'opt-q68-transparent', normalizedValue: 90 },
    'q-69-tactful-candor': { optionId: 'opt-q69-shield', normalizedValue: 25 },
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  assert.equal(result.classification, 'clarification_needed');
  assert.ok(result.spread !== undefined && result.spread > 58);
  // Must NOT accuse user of lying or deception
  assert.ok(!result.userFacingExplanation.includes('lie') && !result.userFacingExplanation.includes('fake'));
  assert.ok(result.userFacingExplanation.includes('different directions'));
});

test('Test 5.4 — Triangulation: Insufficient Information Guardrail (< 2 Answers)', () => {
  const cluster = TRIANGULATION_CLUSTERS.find((c) => c.id === 'repair_after_conflict')!;
  assert.ok(cluster);

  // Only 1 answer in cluster
  const answers = {
    'q-72-cooldown-pause': { optionId: 'opt-q72-pause', normalizedValue: 80 },
  };

  const result = evaluateTriangulationCluster(cluster, answers, EXPANDED_PILOT_QUESTION_BANK);

  assert.equal(result.classification, 'insufficient_information');
  assert.equal(result.confidenceLevel, 'provisional');
  assert.equal(result.answeredCount, 1);
  assert.ok(result.suggestedFollowUpQuestionId);
});

// ============================================================================
// TEST GROUP 6: ADMIN GOVERNANCE & PRIVACY INVARIANTS
// ============================================================================

test('Test 6.1 — Admin Approval Toggle & Zero Raw-Answer Invariant (HTTP 403)', () => {
  // Verify staff role denial
  const staffAuth = memberStore.getMemberRawAnswers;
  assert.throws(
    () => {
      staffAuth('member-kavya', 'admin_support');
    },
    /SERVER_SIDE_ACCESS_DENIED|Access denied/i,
    'Operational staff must be denied access to raw member answers with HTTP 403 reason'
  );

  // Verify full inventory has publication governance
  for (const q of EXPANDED_PILOT_QUESTION_BANK) {
    assert.ok(
      q.isApprovedForMembers !== undefined,
      `Item ${q.id} must define isApprovedForMembers governance flag`
    );
  }
});
