import {
  computeCounterpointIndex,
  computeEchoAgreement,
  computeMosaicFit,
  isCandidateEligibleForMode,
} from './matching';
import { allowStaffAction, computeAuditHash, verifyAuditChain } from './rbac';
import { AuditLogEvent, ModeEnrollmentState, RelationshipMode } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

// 1. Echo symmetry test
const sampleA = {
  COMM_001: 5,
  COMM_002: 4,
  TIME_001: 5,
  TIME_002: 4,
  SOC_001: 4,
  SOC_002: 4,
  FIN_001: 5,
  FIN_002: 4,
  BOUN_001: 5,
};
const sampleB = {
  COMM_001: 5,
  COMM_002: 5,
  TIME_001: 4,
  TIME_002: 4,
  SOC_001: 3,
  SOC_002: 4,
  FIN_001: 5,
  FIN_002: 5,
  BOUN_001: 5,
};

const echoAB = computeEchoAgreement(sampleA, sampleB, 10);
const echoBA = computeEchoAgreement(sampleB, sampleA, 10);
assert(echoAB.score !== null && echoAB.score === echoBA.score, 'Echo Agreement must be symmetric');
assert(echoAB.score! <= 96, 'Echo score must never claim 100% soulmate certainty');

// 2. Coverage gate (<50% coverage returns null score)
const sparseB = { COMM_001: 5, COMM_002: 5 };
const lowCoverage = computeEchoAgreement(sampleA, sparseB, 10);
assert(lowCoverage.score === null, 'Coverage below 50% must return null score');
assert(lowCoverage.band === 'Insufficient coverage', 'Low coverage band must be Insufficient coverage');

// 3. Counterpoint & Mosaic Fit lenses
const cpScore = computeCounterpointIndex(sampleA, sampleB, ['BOUN_001', 'COMM_001'], 10);
const mosaicScore = computeMosaicFit(sampleA, sampleB, 10);
assert(cpScore.score !== null && cpScore.score > 50, 'Counterpoint score should compute cleanly');
assert(
  mosaicScore.score !== null && (mosaicScore.mosaicRules?.length ?? 0) === 4,
  'Mosaic Fit must evaluate all 4 explicit complementarity rules'
);

// 4. Mode isolation tests
const enrollments: Record<RelationshipMode, ModeEnrollmentState> = {
  friendship: {
    mode: 'friendship',
    enabled: true,
    discoverableConsent: true,
    paused: false,
    bio: 'Book clubs',
    intentSummary: 'Weekend coffee',
  },
  dating: {
    mode: 'dating',
    enabled: true,
    discoverableConsent: true,
    paused: false,
    bio: 'Intentional dating',
    intentSummary: 'Long-term partner',
  },
  matrimony: {
    mode: 'matrimony',
    enabled: false,
    discoverableConsent: false,
    paused: false,
    bio: '',
    intentSummary: '',
  },
};

const allowDating = isCandidateEligibleForMode({
  activeMode: 'dating',
  viewerEnrollments: enrollments,
  candidateModes: ['dating'],
  candidateDiscoverableInMode: true,
  isBlockedOrMuted: false,
});
assert(allowDating.eligible === true, 'Candidate in active consented mode must be eligible');

const denyCrossMode = isCandidateEligibleForMode({
  activeMode: 'dating',
  viewerEnrollments: enrollments,
  candidateModes: ['friendship'],
  candidateDiscoverableInMode: true,
  isBlockedOrMuted: false,
});
assert(denyCrossMode.eligible === false, 'Friendship-only candidate must NEVER leak into Dating');

const denyUnenrolledMatrimony = isCandidateEligibleForMode({
  activeMode: 'matrimony',
  viewerEnrollments: enrollments,
  candidateModes: ['matrimony'],
  candidateDiscoverableInMode: true,
  isBlockedOrMuted: false,
});
assert(
  denyUnenrolledMatrimony.eligible === false,
  'Unenrolled Matrimony mode must deny candidate discovery'
);

// 5. Staff RBAC raw quiz answer denial & hash chain integrity
assert(
  allowStaffAction('superadmin', 'view_raw_quiz_answers') === false,
  'Superadmin must be denied raw_quiz_answers access'
);
assert(
  allowStaffAction('trust_safety_analyst', 'grant_jit_evidence') === true,
  'T&S Analyst must be allowed JIT evidence grant'
);

const genesisPrev = 'GENESIS_0000000000000000';
const h1 = computeAuditHash(
  genesisPrev,
  'staff_ananya_ts',
  'JIT_EVIDENCE_GRANT',
  'KT-2041',
  'HARASSMENT_TRIAGE',
  '2026-11-01T14:20:00Z'
);
const h2 = computeAuditHash(
  h1,
  'staff_vikram_lead',
  'CASE_ACTION_SUSPEND',
  'KT-2041',
  'CONFIRMED_HARASSMENT',
  '2026-11-01T14:24:00Z'
);
const sampleAuditChain: AuditLogEvent[] = [
  {
    eventId: 'AUD-9001',
    timestampIso: '2026-11-01T14:20:00Z',
    actorId: 'staff_ananya_ts',
    actorRole: 'trust_safety_analyst',
    actionType: 'JIT_EVIDENCE_GRANT',
    targetId: 'KT-2041',
    reasonCode: 'HARASSMENT_TRIAGE',
    prevHash: genesisPrev,
    eventHash: h1,
  },
  {
    eventId: 'AUD-9002',
    timestampIso: '2026-11-01T14:24:00Z',
    actorId: 'staff_vikram_lead',
    actorRole: 'trust_safety_lead',
    actionType: 'CASE_ACTION_SUSPEND',
    targetId: 'KT-2041',
    reasonCode: 'CONFIRMED_HARASSMENT',
    prevHash: h1,
    eventHash: h2,
  },
];
const chainCheck = verifyAuditChain(sampleAuditChain);
assert(chainCheck.valid === true && chainCheck.checkedCount === 2, 'Audit hash chain must verify');

console.log(
  'ALL KITHRA DETERMINISTIC DOMAIN, MODE ISOLATION, RBAC & HASH-CHAIN TESTS PASSED (100%)'
);
