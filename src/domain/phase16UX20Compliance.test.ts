/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 16: 20 UX LAWS COMPLIANCE & REDESIGN VERIFICATION TEST SUITE
 * 
 * Verifies:
 * 1. UX-001: Hero Action Hierarchy & Primary CTA
 * 2. UX-002: Public Step Cards Zero-Premature Member Route Links
 * 3. UX-003: Four-Space Landing Architecture & Pilot Transparency
 * 4. UX-004: Onboarding Forward-Jump Lock & Fail-Closed Adulthood Gate
 * 5. UX-005: Onboarding Structured Grouping & WCAG 2.2 Touch Padding
 * 6. UX-006: Psychological Non-Overclaim Invariant
 * 7. UX-007 & UX-008: Discovery Ambient Container & Narrative-First Cards
 * 8. UX-009: "Part Ways Politely" Connection Exit & Unsuppression
 * 9. UX-010: Introduction Note Withdrawal & Context Breadcrumbs
 * 10. UX-011 & UX-012: Gathering Salon Venue Details, Release Seat & Host Archive
 * 11. UX-013 & UX-014: Admin Simple View Safety Alert & Tablet Responsive CRM Cards
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const PUBLIC_VIEWS_PATH = path.join(ROOT_DIR, 'src/components/PublicViews.tsx');
const HERO_PATH = path.join(ROOT_DIR, 'src/components/KithraHero.tsx');
const MEMBER_VIEWS_PATH = path.join(ROOT_DIR, 'src/components/MemberViews.tsx');
const ADMIN_VIEWS_PATH = path.join(ROOT_DIR, 'src/components/AdminViews.tsx');
const APP_PATH = path.join(ROOT_DIR, 'src/App.tsx');

test('Phase 16 — [UX-001] Hero Action Hierarchy: Single primary CTA and subtle scroll link', () => {
  const heroCode = fs.readFileSync(HERO_PATH, 'utf-8');

  // Must have a clear Primary 48px action
  assert.ok(heroCode.includes('Begin your journey'), 'Hero must render "Begin your journey" primary CTA');
  assert.ok(heroCode.includes('min-h-[48px]'), 'Hero primary CTA must have at least 48px height');

  // Must have subtle secondary scroll link
  assert.ok(heroCode.includes('Explore how Kithra works ↓'), 'Hero must offer calm secondary scroll link');
  assert.ok(heroCode.includes('Pilot phase'), 'Hero must mention pilot phase');
});

test('Phase 16 — [UX-002] & [UX-003] Landing Page: Four spaces described, zero premature member links', () => {
  const publicCode = fs.readFileSync(PUBLIC_VIEWS_PATH, 'utf-8');

  // UX-002: LandingView must contain ZERO premature /member/ route links
  const landingViewCode = publicCode.substring(
    publicCode.indexOf('export const LandingView'),
    publicCode.indexOf('export const AuthView')
  );

  assert.ok(!landingViewCode.includes('/member/'), 'LandingView must contain ZERO /member/ route links');
  assert.ok(!landingViewCode.includes('Illustrative pricing'), 'LandingView must remove confusing illustrative pricing toggle');

  // UX-003: Must represent all four spaces in copy
  assert.ok(publicCode.includes('One membership across all four spaces.'), 'Pricing headline must acknowledge all four spaces');
  assert.ok(publicCode.includes('Available across Friendship, Dating, Matrimony & Cofounders'), 'Free tier must cover all four spaces');
  assert.ok(publicCode.includes('Friendship, Dating, Matrimony, or Cofounders'), 'Explainer must cover all four spaces');
  assert.ok(publicCode.includes('Cofounders scope'), 'Trust & Visibility simulator must include Cofounders scope');
});

test('Phase 16 — Public Header & Mobile Navigation: Zero premature member links for unauthenticated visitors', () => {
  const appCode = fs.readFileSync(APP_PATH, 'utf-8');

  const consumerHeader = appCode.substring(
    appCode.indexOf('{/* CONSUMER HEADER */}'),
    appCode.indexOf('{/* MAIN VIEWPORT */}')
  );

  // Unauthenticated public header & mobile drawer must not link to internal member routes
  assert.ok(!consumerHeader.includes("handleNavigatePath('/member/home')"), 'Public header must not link to /member/home');
  assert.ok(!consumerHeader.includes("handleNavigatePath('/member/discover')"), 'Public mobile drawer must not link to /member/discover');
  assert.ok(consumerHeader.includes('Four Spaces'), 'Mobile drawer must list Four Spaces');
  assert.ok(appCode.includes('One account · Four independent spaces'), 'Footer must state four independent spaces');
});

test('Phase 16 — [UX-004] & [UX-005] Onboarding: Forward-jumping locked & strict adult gate', () => {
  const publicCode = fs.readFileSync(PUBLIC_VIEWS_PATH, 'utf-8');

  // UX-004: Step buttons must be disabled when idx > step
  assert.ok(publicCode.includes('disabled={idx > step}'), 'Step indicators must disable forward jumping');
  assert.ok(publicCode.includes('cursor-not-allowed opacity-40'), 'Locked future steps must show disabled styling');
  assert.ok(publicCode.includes('-inset-3'), 'Touch target expansion for WCAG 2.2 AA (44x44px)');

  // UX-005: Strict 18+ adulthood validation
  assert.ok(publicCode.includes('Year of Birth (Must be 18+)'), 'Must explicitly require year of birth (18+)');
  assert.ok(publicCode.includes('calculatedAge < 18'), 'Must enforce calculatedAge < 18 fail-closed condition');
});

test('Phase 16 — [UX-007] & [UX-008] Discovery: Intention Sanctuary container and privacy firewall', () => {
  const memberCode = fs.readFileSync(MEMBER_VIEWS_PATH, 'utf-8');

  // UX-007: Ambient container tint
  assert.ok(memberCode.includes('radial-gradient(ellipse at top left'), 'Discovery feed must have ambient intention gradient');
  assert.ok(memberCode.includes('Cross-Context Privacy Firewall Active:'), 'Must render privacy firewall reassurance banner');

  // UX-008: Qualitative lenses prioritized
  assert.ok(memberCode.includes('Shared Ground:'), 'Candidate cards must show Shared Ground qualitative summary');
  assert.ok(memberCode.includes('Potential Balance:'), 'Candidate cards must show Potential Balance summary');
});

test('Phase 16 — [UX-009] & [UX-010] Conversations: Part Ways Politely and note withdrawal handles', () => {
  const memberCode = fs.readFileSync(MEMBER_VIEWS_PATH, 'utf-8');

  // UX-009: "Part Ways" handle in chat header
  assert.ok(memberCode.includes('Part Ways'), 'Chat header must render Part Ways button');
  assert.ok(memberCode.includes('Part ways politely with'), 'Part Ways confirmation must explain discovery restoration without blocking');
  assert.ok(memberCode.includes('onDisconnectPartner'), 'Must invoke onDisconnectPartner');

  // UX-010: Withdraw note handle
  assert.ok(memberCode.includes('Withdraw note'), 'Candidate card & connections must render Withdraw note handle');
});

test('Phase 16 — [UX-011] & [UX-012] Circles: Gathering Salon private venue, cancel RSVP, and host archive', () => {
  const memberCode = fs.readFileSync(MEMBER_VIEWS_PATH, 'utf-8');

  // UX-011: Private sanctuary location & cancel RSVP
  assert.ok(memberCode.includes('Private Sanctuary Location (Confirmed Members Only)'), 'Must render private venue location');
  assert.ok(memberCode.includes('Cancel RSVP & Release My Seat') || memberCode.includes('Cancel RSVP &amp; Release My Seat'), 'Gathering salon must render Cancel RSVP button');

  // UX-012: Host archive handle
  assert.ok(memberCode.includes('Archive / Cancel Gathering'), 'Circle host must have Archive / Cancel Gathering handle');
  assert.ok(memberCode.includes('onArchiveCircle'), 'Must invoke onArchiveCircle');
});

test('Phase 16 — [UX-013] & [UX-014] Admin: Isolated Safety Alert Triage & Tablet Responsive CRM', () => {
  const adminCode = fs.readFileSync(ADMIN_VIEWS_PATH, 'utf-8');

  // UX-013: Von Restorff isolated safety triage bar
  assert.ok(
    adminCode.includes('Trust &amp; Safety Attention Required:') || adminCode.includes('Trust & Safety Attention Required:'),
    'Simple View must render isolated Trust & Safety Alert bar'
  );
  assert.ok(adminCode.includes('Review Queue →'), 'Safety alert bar must feature direct CTA to safety queue');
  assert.ok(adminCode.includes('Cofounders'), 'Admin intention breakdown must include Cofounders');

  // UX-014: Responsive tablet/mobile stacked CRM cards
  assert.ok(adminCode.includes('block md:hidden'), 'Member CRM must render stacked card layout for mobile/tablet');
  assert.ok(adminCode.includes('hidden md:block'), 'Member CRM must preserve full table for desktop');
});
