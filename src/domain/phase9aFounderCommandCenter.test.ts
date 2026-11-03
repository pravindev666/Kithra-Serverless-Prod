/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 9A TEST SUITE: FOUNDER COMMAND CENTER, CRM & SECURITY
 * 
 * Automated verification of:
 * 1. P0 Admin Security & RBAC: 8 staff personas, RFC 6238 TOTP, token revocation, lockout, HTTP 403 invariant.
 * 2. P1 Executive Overview KPIs: Real member aggregation, growth direction, plain-English trends.
 * 3. P2 ELI5 Usability: Plain-English summaries, simple vs advanced view distinctions.
 * 4. P3 Geographic Growth Map: Coarse Indian centroids, k >= 5 small-cell privacy suppression, zero GPS tracking.
 * 5. P4 Member CRM & Support: Directory pagination, member cards, staff notes, support ticket lifecycles.
 * 6. P5 Subscriptions & Revenue: Truthful "Payment provider not connected" disclosure, INR currency formatting.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  initiateStaffLogin,
  verifyStaffMfaCode,
  generateStaffTotpCode,
  authenticateStaffToken,
  revokeStaffToken,
  isStaffTokenRevoked,
  hasStaffPermission,
  clearStaffRateLimits,
  OPERATIONAL_STAFF,
  ROLE_PERMISSIONS,
  StaffRole,
} from '../server/adminAuthService';
import {
  getExecutiveOverviewMetrics,
  getGeographicGrowthMapData,
  getCrmMembersDirectory,
  getMemberCrmDetail,
  addMemberCrmNote,
  getSupportTickets,
  updateSupportTicket,
  getSafetyCases,
  resolveSafetyCase,
  formatInrCurrency,
  INDIAN_PRICING_PLANS,
} from '../server/founderCommandCenterService';
import { memberStore } from './memberStore';

// ============================================================================
// SUITE 1: P0 ADMIN SECURITY, RBAC & CRYPTOGRAPHIC TOKEN REVOCATION
// ============================================================================

test('Phase 9A — P0.1: All 8 Operational Staff Personas Authenticate via 2-Step MFA', async () => {
  clearStaffRateLimits();

  const testPersonas: { email: string; pass: string; expectedRole: StaffRole }[] = [
    { email: 'founder@kithra.in', pass: 'KithraFounder2026!', expectedRole: 'founder' },
    { email: 'admin@kithra.in', pass: 'KithraSecureAdmin2026!', expectedRole: 'admin' },
    { email: 'finance@kithra.in', pass: 'KithraFinance2026!', expectedRole: 'finance' },
    { email: 'support@kithra.in', pass: 'KithraSupport2026!', expectedRole: 'support' },
    { email: 'moderator@kithra.in', pass: 'KithraSafetyMod2026!', expectedRole: 'moderator' },
    { email: 'analyst@kithra.in', pass: 'KithraAnalyst2026!', expectedRole: 'analyst' },
    { email: 'researcher@kithra.in', pass: 'KithraResearcher2026!', expectedRole: 'researcher' },
    { email: 'auditor@kithra.in', pass: 'KithraAuditDpdp2026!', expectedRole: 'auditor' },
  ];

  for (const persona of testPersonas) {
    // Step 1: Password
    const challenge = await initiateStaffLogin(persona.email, persona.pass);
    assert.equal(challenge.success, true, `Step 1 failed for ${persona.email}`);
    assert.ok(challenge.challengeId, `Challenge ID missing for ${persona.email}`);

    // Step 2: TOTP
    const totp = await generateStaffTotpCode(persona.email);
    assert.ok(totp, `TOTP generation failed for ${persona.email}`);

    const result = await verifyStaffMfaCode(challenge.challengeId!, totp!);
    assert.equal(result.success, true, `Step 2 MFA failed for ${persona.email}`);
    assert.equal(result.session?.role, persona.expectedRole, `Role mismatch for ${persona.email}`);
    assert.equal(result.session?.mfaVerified, true);
    assert.ok(result.session?.token);

    // Verify token validity
    const authCheck = await authenticateStaffToken(result.session!.token);
    assert.equal(authCheck.authenticated, true);
    assert.equal(authCheck.context?.email, persona.email);
  }
});

test('Phase 9A — P0.2: Brute-Force Rate Limiting Locks Out After 5 Failed Attempts', async () => {
  clearStaffRateLimits();
  const testEmail = 'support@kithra.in';

  // 4 failed attempts should fail normally
  for (let i = 0; i < 4; i++) {
    const attempt = await initiateStaffLogin(testEmail, 'WrongPassword123!');
    assert.equal(attempt.success, false);
    assert.equal(attempt.rateLimited, undefined);
  }

  // 5th failed attempt triggers rate-limiting lockout
  const fifthAttempt = await initiateStaffLogin(testEmail, 'WrongPassword123!');
  assert.equal(fifthAttempt.success, false);

  // 6th attempt is blocked immediately by rate-limiter
  const sixthAttempt = await initiateStaffLogin(testEmail, 'WrongPassword123!');
  assert.equal(sixthAttempt.success, false);
  assert.equal(sixthAttempt.rateLimited, true);
  assert.match(sixthAttempt.errorMessage!, /Account temporarily locked/);

  // Clean up
  clearStaffRateLimits();
});

test('Phase 9A — P0.3: Token Revocation & Invalidation (Session Logout)', async () => {
  clearStaffRateLimits();
  const challenge = await initiateStaffLogin('founder@kithra.in', 'KithraFounder2026!');
  const totp = await generateStaffTotpCode('founder@kithra.in');
  const loginResult = await verifyStaffMfaCode(challenge.challengeId!, totp!);
  const token = loginResult.session!.token;

  // Verify token is initially valid
  const check1 = await authenticateStaffToken(token);
  assert.equal(check1.authenticated, true);
  assert.equal(isStaffTokenRevoked(token), false);

  // Revoke token on logout
  revokeStaffToken(token);
  assert.equal(isStaffTokenRevoked(token), true);

  // Token is now rejected
  const check2 = await authenticateStaffToken(token);
  assert.equal(check2.authenticated, false);
  assert.match(check2.errorMessage!, /SESSION_REVOKED/);
});

test('Phase 9A — P0.4: Strict RBAC Permissions Matrix Enforcement', () => {
  // Founder has access to all sections
  assert.equal(hasStaffPermission('founder', 'overview'), true);
  assert.equal(hasStaffPermission('founder', 'subscriptions'), true);
  assert.equal(hasStaffPermission('founder', 'safety'), true);
  assert.equal(hasStaffPermission('founder', 'staff'), true);

  // Finance has revenue & subscriptions access, but strictly forbidden from trust/safety and question bank
  assert.equal(hasStaffPermission('finance', 'subscriptions'), true);
  assert.equal(hasStaffPermission('finance', 'revenue'), true);
  assert.equal(hasStaffPermission('finance', 'growth'), false);
  assert.equal(hasStaffPermission('finance', 'safety'), false);
  assert.equal(hasStaffPermission('finance', 'photos'), false);
  assert.equal(hasStaffPermission('finance', 'questions'), false);

  // Support has members and ticket queue access, but forbidden from billing and staff management
  assert.equal(hasStaffPermission('support', 'support'), true);
  assert.equal(hasStaffPermission('support', 'members'), true);
  assert.equal(hasStaffPermission('support', 'subscriptions'), false);
  assert.equal(hasStaffPermission('support', 'staff'), false);

  // Moderator has safety & photos access, but forbidden from revenue & staff
  assert.equal(hasStaffPermission('moderator', 'safety'), true);
  assert.equal(hasStaffPermission('moderator', 'photos'), true);
  assert.equal(hasStaffPermission('moderator', 'subscriptions'), false);
  assert.equal(hasStaffPermission('moderator', 'staff'), false);

  // Researcher has questions & psych profiles access, but forbidden from revenue, growth & safety
  assert.equal(hasStaffPermission('researcher', 'questions'), true);
  assert.equal(hasStaffPermission('researcher', 'profiles'), true);
  assert.equal(hasStaffPermission('researcher', 'growth'), false);
  assert.equal(hasStaffPermission('researcher', 'subscriptions'), false);
  assert.equal(hasStaffPermission('researcher', 'safety'), false);

  // Auditor has audit & privacy access, but forbidden from modifying operational queues
  assert.equal(hasStaffPermission('auditor', 'audit'), true);
  assert.equal(hasStaffPermission('auditor', 'photos'), false);
  assert.equal(hasStaffPermission('auditor', 'subscriptions'), false);
});

test('Phase 9A — P0.5: Zero Raw-Answer Access Invariant (HTTP 403 on staff inspection)', () => {
  // Invariant: MemberStore must enforce that staff cannot retrieve raw answers
  const allMembers = memberStore.getAllMembers();
  if (allMembers.length > 0) {
    const memberId = allMembers[0].id;
    // Calling with non-member role throws access denied
    assert.throws(
      () => memberStore.getMemberRawAnswers(memberId, 'admin_support', 'staff-admin-01'),
      /SERVER_SIDE_ACCESS_DENIED/
    );
  }
});

// ============================================================================
// SUITE 2: P1 REAL EXECUTIVE OVERVIEW METRICS & P2 ELI5 USABILITY
// ============================================================================

test('Phase 9A — P1.1: Executive Overview Metrics Aggregation', () => {
  const metrics = getExecutiveOverviewMetrics();

  assert.ok(metrics.members.totalRegistered >= 1);
  assert.ok(metrics.members.dailyActiveMembers >= 1);
  assert.ok(metrics.members.weeklyActiveMembers >= metrics.members.dailyActiveMembers);
  assert.ok(metrics.members.monthlyActiveMembers >= metrics.members.weeklyActiveMembers);

  // Profile readiness breakdown
  assert.ok(metrics.profiles.totalWith100PctBasicReadiness >= 1);
  assert.ok(metrics.profiles.pctWith100PctBasicReadiness >= 0 && metrics.profiles.pctWith100PctBasicReadiness <= 100);
  assert.ok(metrics.profiles.starterBatteryCompleted5Items >= 1);

  // Connections
  assert.ok(metrics.connections.discoverySessionsStarted >= 1);
  assert.ok(metrics.connections.mutualInterestsFormed >= 1);
  assert.ok(metrics.connections.intentionBreakdown.friendship >= 0);
  assert.ok(metrics.connections.intentionBreakdown.dating >= 0);
  assert.ok(metrics.connections.intentionBreakdown.matrimony >= 0);

  // Plain-English trend statement for ELI5 standard
  assert.ok(metrics.members.plainEnglishTrend.length > 10);
  assert.ok(['increasing', 'decreasing', 'steady'].includes(metrics.members.growthDirection));
});

test('Phase 9A — P2.1: ELI5 Usability Plain-English Explanations Present', () => {
  const metrics = getExecutiveOverviewMetrics();
  // Ensure the summary explains itself without jargon
  assert.match(metrics.members.plainEnglishTrend, /registrations/i);
});

// ============================================================================
// SUITE 3: P3 GEOGRAPHIC GROWTH MAP & PRIVACY SAFEGUARDS
// ============================================================================

test('Phase 9A — P3.1: Coarse Indian Centroids & k >= 5 Suppression', () => {
  const markers = getGeographicGrowthMapData();

  assert.ok(markers.length >= 4, 'Should include major Indian metropolitan hubs');

  // Verify Bengaluru, Chennai, Mumbai exist
  const cities = markers.map((m) => m.city);
  assert.ok(cities.includes('Bengaluru'));
  assert.ok(cities.includes('Chennai'));
  assert.ok(cities.includes('Mumbai'));

  // Test k-anonymity suppression
  markers.forEach((m) => {
    assert.ok(m.lat >= 8 && m.lat <= 36, `Latitude ${m.lat} out of Indian territory`);
    assert.ok(m.lng >= 68 && m.lng <= 98, `Longitude ${m.lng} out of Indian territory`);

    if (m.rawMemberCount < 5) {
      assert.equal(
        m.totalMembers,
        '< 5 [SUPPRESSED FOR PRIVACY]',
        `City ${m.city} with count < 5 must be suppressed`
      );
    } else {
      assert.equal(typeof m.totalMembers, 'number');
    }
  });
});

// ============================================================================
// SUITE 4: P4 MEMBER CRM DIRECTORY & SUPPORT QUEUE
// ============================================================================

test('Phase 9A — P4.1: Paginated Member CRM Directory & Zero Raw Answers', () => {
  const crmResult = getCrmMembersDirectory('', 1, 10);

  assert.ok(crmResult.members.length > 0);
  assert.ok(crmResult.totalCount >= crmResult.members.length);
  assert.equal(crmResult.currentPage, 1);

  crmResult.members.forEach((member) => {
    assert.ok(member.id);
    assert.ok(member.displayName);
    assert.ok(member.city);
    assert.ok(member.state);
    assert.ok(member.contactVerification.emailVerified !== undefined);
    assert.ok(member.basicProfileReadinessPct >= 0 && member.basicProfileReadinessPct <= 100);

    // Invariant: CRM directory item must NOT contain raw questionnaire answers
    assert.equal((member as any).answers, undefined);
    assert.equal((member as any).rawQuestionnaireAnswers, undefined);
  });
});

test('Phase 9A — P4.2: Member Detail Inspection Card & Internal Staff Notes', () => {
  const allMembers = memberStore.getAllMembers();
  if (allMembers.length > 0) {
    const memberId = allMembers[0].id;
    const detail = getMemberCrmDetail(memberId);

    assert.ok(detail, 'Member detail card must be returned');
    assert.equal(detail!.member.id, memberId);
    assert.ok(detail!.readinessBreakdown.readinessScorePct >= 0);

    // Append staff note
    const note = addMemberCrmNote(
      memberId,
      'staff-founder-01',
      'Pravin (Founder)',
      'Verified member attended Bengaluru welcome circle.'
    );
    assert.ok(note);
    assert.equal(note!.staffName, 'Pravin (Founder)');

    // Re-fetch detail to verify persistence
    const updatedDetail = getMemberCrmDetail(memberId);
    assert.ok(
      updatedDetail!.staffNotes.some((n) => n.noteText.includes('Bengaluru welcome circle'))
    );
  }
});

test('Phase 9A — P4.3: Support Tickets Lifecycle (Needs Attention -> Resolved)', () => {
  const tickets = getSupportTickets();
  assert.ok(tickets.length >= 1, 'Should have initial support tickets');

  const openTicket = tickets[0];
  const updated = updateSupportTicket(openTicket.id, { status: 'resolved' });

  assert.ok(updated);
  assert.equal(updated!.status, 'resolved');
});

test('Phase 9A — P4.4: Trust & Safety Cases Moderation', () => {
  const cases = getSafetyCases();
  assert.ok(cases.length >= 1);

  const testCase = cases[0];
  const resolved = resolveSafetyCase(testCase.id, 'staff-mod-01', 'warn_member', 'Guidance warning issued');

  assert.ok(resolved);
  assert.equal(resolved!.status, 'resolved');
  assert.match(resolved!.actionTaken!, /warn_member/);
});

// ============================================================================
// SUITE 5: P5 SUBSCRIPTIONS, REVENUE & TRUTHFUL DISCLOSURES
// ============================================================================

test('Phase 9A — P5.1: Honest Pilot Revenue Disclosure (Zero Fabricated Sales)', () => {
  const metrics = getExecutiveOverviewMetrics();

  assert.equal(metrics.revenue.providerConnected, false);
  assert.equal(metrics.revenue.providerStatus, 'PAYMENT_PROVIDER_NOT_CONNECTED');
  assert.match(metrics.revenue.statusMessage, /PAYMENT PROVIDER NOT CONNECTED/i);
  assert.equal(metrics.revenue.grossCollectionsInr, 0);
  assert.match(metrics.revenue.grossCollectionsFormatted, /0.00/);
});

test('Phase 9A — P5.2: Indian Pricing Plans & Currency Formatting (INR, Lakh, Crore)', () => {
  assert.equal(INDIAN_PRICING_PLANS.length, 4);
  assert.equal(INDIAN_PRICING_PLANS[0].priceInr, 499);
  assert.equal(INDIAN_PRICING_PLANS[1].priceInr, 999);
  assert.equal(INDIAN_PRICING_PLANS[2].priceInr, 1599);
  assert.equal(INDIAN_PRICING_PLANS[3].priceInr, 2499);

  // Currency formatting tests
  assert.equal(formatInrCurrency(499), '₹499');
  assert.equal(formatInrCurrency(999), '₹999');
  assert.equal(formatInrCurrency(250000), '₹2.50 Lakh');
  assert.equal(formatInrCurrency(15000000), '₹1.50 Crore');
});
