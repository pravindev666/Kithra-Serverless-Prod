/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PRODUCTION READINESS REGISTER
 * 
 * Tracks feature-by-feature verification across frontend, backend, psychometrics,
 * security, and DPDP Act 2023 compliance.
 */

export type ProductionReadinessStatus = 'PASS' | 'FAIL' | 'BLOCKED';

export interface ProductionFeatureEvaluation {
  featureId: string;
  category: 'authentication' | 'psychology_engine' | 'security_privacy' | 'database_d1' | 'infrastructure';
  title: string;
  status: ProductionReadinessStatus;
  evidence: string;
  securityImpact: string;
  migrationActionRequired?: string;
}

export const PRODUCTION_READINESS_REGISTER: ProductionFeatureEvaluation[] = [
  {
    featureId: 'auth-firebase-jwt',
    category: 'authentication',
    title: 'Firebase JWT Token Bearer Verification & Role Decoding',
    status: 'PASS',
    evidence: 'Implemented in src/server/authMiddleware.ts with issuer, audience, and expiry verification.',
    securityImpact: 'Guarantees all member requests are cryptographically validated before touching state.',
  },
  {
    featureId: 'db-d1-schema',
    category: 'database_d1',
    title: 'Cloudflare D1 Relational Schema & Migration 0002',
    status: 'PASS',
    evidence: 'Schema defined in src/server/schema.sql and migrations/0002_phase4_production_auth_d1.sql with foreign keys, indexes, and CHECK constraints.',
    securityImpact: 'Ensures relational data integrity and enforces strict table isolation between personas and quiz answers.',
  },
  {
    featureId: 'psych-60-item-bank',
    category: 'psychology_engine',
    title: '60-Item Pilot Question Bank & Psychometric Audit',
    status: 'PASS',
    evidence: '60 items in src/data/pilotQuestionBank.ts audit with 100% semantic uniqueness, 3 languages, and verified research bases.',
    securityImpact: 'Eliminates unvalidated generative questions and anchors scoring in empirical behavioral literature.',
  },
  {
    featureId: 'psych-lifestyle-smoking-vaping',
    category: 'psychology_engine',
    title: 'Lifestyle Smoking & Vaping 3-Concept Separation',
    status: 'PASS',
    evidence: 'Q61 (habit), Q62 (comfort), and Q63 (partner requirement) defined; Step 6 in evaluateMutualEligibility enforces intention-specific filtering.',
    securityImpact: 'Prevents covert inference of smoking from personality traits; respects voluntary disclosure and privacy.',
  },
  {
    featureId: 'psych-adaptive-selection',
    category: 'psychology_engine',
    title: 'Adaptive Question Selection Engine (2026.11-adaptive-v1.0)',
    status: 'PASS',
    evidence: 'Implemented in src/domain/adaptiveQuestionEngine.ts; administers 5 starter items, prioritizes essential gates, and balances construct coverage.',
    securityImpact: 'Deterministic and reproducible; prevents user fatigue and protects Stage A boundaries early.',
  },
  {
    featureId: 'psych-stage-a-gate-isolation',
    category: 'psychology_engine',
    title: 'Stage A Mutual Eligibility & Intention Isolation',
    status: 'PASS',
    evidence: 'Rohan (open relationship) is eligible for Friendship with Kavya, but blocked for Dating. Q38 and Q50 auto-bind to private eligibility.',
    securityImpact: 'Prevents catastrophic romantic mismatch without stigmatizing non-monogamy or friendship exploration.',
  },
  {
    featureId: 'privacy-dpdp-data-erasure',
    category: 'security_privacy',
    title: 'DPDP Act 2023 Section 12 Erasure & Section 6(4) Consent Withdrawal',
    status: 'PASS',
    evidence: 'Implemented in memberStore.deleteMemberAssessmentData and DELETE /api/member/assessment/delete; purges raw answers, vectors, and caches. Strictly distinguishes Section 12 erasure rights from Section 27 penalties.',
    securityImpact: 'Architectural compliance with Indian Digital Personal Data Protection Act 2023 statutory principles.',
  },
  {
    featureId: 'privacy-raw-answer-guard',
    category: 'security_privacy',
    title: 'Strict Raw Answer Privacy Guard (Staff & Admin Denial)',
    status: 'PASS',
    evidence: 'authorizeAssessmentAccess strictly returns HTTP 403 SERVER_SIDE_ACCESS_DENIED when admins request raw responses of a member.',
    securityImpact: 'Eliminates insider threat and prevents staff voyeurism into member personal answers.',
  },
  {
    featureId: 'ui-dev-switcher-guard',
    category: 'security_privacy',
    title: 'Production Build Guard on Dev Perspective Switcher',
    status: 'PASS',
    evidence: 'Wrapped with Boolean(import.meta.env.DEV) in src/components/MemberViews.tsx; excluded from production bundles.',
    securityImpact: 'Prevents account impersonation or perspective hijacking in production environments.',
  },
  {
    featureId: 'infra-sms-otp-gateway',
    category: 'infrastructure',
    title: 'Production SMS OTP Carrier Gateway (MSG91 / Twilio)',
    status: 'BLOCKED',
    evidence: 'Pending commercial carrier contract and DLT registration under TRAI guidelines.',
    securityImpact: 'Required for real-world phone verification in Indian market launch.',
    migrationActionRequired: 'Register DLT entity on Vilpower/Jio DLT and provision MSG91 production API keys.',
  },
  {
    featureId: 'infra-turnstile-bot-defense',
    category: 'infrastructure',
    title: 'Cloudflare Turnstile Managed Challenge Integration',
    status: 'BLOCKED',
    evidence: 'Frontend supports captcha token handling; awaiting production Cloudflare account sitekey.',
    securityImpact: 'Prevents automated credential stuffing and rapid-click bot traffic.',
    migrationActionRequired: 'Set CLOUDFLARE_TURNSTILE_SITE_KEY and CLOUDFLARE_TURNSTILE_SECRET in Cloudflare Pages environment.',
  },
  {
    featureId: 'db-d1-remote-persistence',
    category: 'database_d1',
    title: 'Cloudflare D1 Remote Cloud Persistence Binding',
    status: 'BLOCKED',
    evidence: 'Local SQLite/memory schema 0002 & 0003 verified; awaiting remote Cloudflare API token and live wrangler d1 migrations apply.',
    securityImpact: 'Required for global distributed SQL persistence across Cloudflare edge regions.',
    migrationActionRequired: 'Run wrangler d1 create kithra-d1-staging and apply migrations in Cloudflare dashboard.',
  },
  {
    featureId: 'auth-firebase-remote-verify',
    category: 'authentication',
    title: 'Remote Firebase Live Auth & Key Endpoint Fetching',
    status: 'BLOCKED',
    evidence: 'Cryptographic RS256 Web Crypto verification verified locally with mock keys; awaiting live Firebase staging project credentials.',
    securityImpact: 'Ensures real mobile/web clients authenticate against Google identity endpoints.',
    migrationActionRequired: 'Configure Firebase Console authorized domain and link FIREBASE_PROJECT_ID.',
  },
];

export function getProductionReadinessSummary(): {
  total: number;
  passed: number;
  failed: number;
  blocked: number;
  readinessPercentage: number;
} {
  const total = PRODUCTION_READINESS_REGISTER.length;
  const passed = PRODUCTION_READINESS_REGISTER.filter((f) => f.status === 'PASS').length;
  const failed = PRODUCTION_READINESS_REGISTER.filter((f) => f.status === 'FAIL').length;
  const blocked = PRODUCTION_READINESS_REGISTER.filter((f) => f.status === 'BLOCKED').length;

  return {
    total,
    passed,
    failed,
    blocked,
    readinessPercentage: Math.round((passed / total) * 100),
  };
}

