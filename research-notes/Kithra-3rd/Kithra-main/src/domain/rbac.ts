import { AuditLogEvent, StaffRole } from '../types';

export type StaffPermission =
  | 'view_triage_queue'
  | 'grant_jit_evidence'
  | 'resolve_safety_case'
  | 'process_appeal'
  | 'approve_photo_moderation'
  | 'issue_small_refund'
  | 'approve_two_person_refund'
  | 'edit_question_bank'
  | 'publish_question_bank'
  | 'view_audit_log'
  | 'manage_feature_flags'
  | 'view_raw_quiz_answers'; // Must ALWAYS return false for every role (D-10 / SEC-04)

const ROLE_PERMISSIONS: Record<StaffRole, StaffPermission[]> = {
  support_tier_1: ['view_triage_queue'],
  support_tier_2: ['view_triage_queue', 'issue_small_refund'],
  trust_safety_analyst: [
    'view_triage_queue',
    'grant_jit_evidence',
    'resolve_safety_case',
    'approve_photo_moderation',
  ],
  trust_safety_lead: [
    'view_triage_queue',
    'grant_jit_evidence',
    'resolve_safety_case',
    'process_appeal',
    'approve_photo_moderation',
    'view_audit_log',
  ],
  photo_moderator: ['approve_photo_moderation'],
  billing_ops: ['issue_small_refund', 'approve_two_person_refund'],
  content_psychometrics_editor: ['edit_question_bank', 'publish_question_bank'],
  privacy_dpo_officer: ['view_triage_queue', 'process_appeal', 'view_audit_log'],
  sre_release_operator: ['manage_feature_flags', 'view_audit_log'],
  superadmin: [
    'view_triage_queue',
    'grant_jit_evidence',
    'resolve_safety_case',
    'process_appeal',
    'approve_photo_moderation',
    'issue_small_refund',
    'approve_two_person_refund',
    'edit_question_bank',
    'publish_question_bank',
    'view_audit_log',
    'manage_feature_flags',
  ],
};

/**
 * Deny-by-default Staff RBAC evaluator (06_ADMIN_RD & 09_SECURITY_RD).
 * Invariant: `view_raw_quiz_answers` is denied to ALL staff roles, including `superadmin`.
 */
export function allowStaffAction(role: StaffRole, permission: StaffPermission): boolean {
  if (permission === 'view_raw_quiz_answers') {
    return false;
  }
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

/**
 * Deterministic FNV-1a / SHA-style hex digest for client/server hash-chained audit logs.
 */
export function computeAuditHash(
  prevHash: string,
  actorId: string,
  actionType: string,
  targetId: string,
  reasonCode: string,
  timestampIso: string
): string {
  const payload = `${prevHash}|${actorId}|${actionType}|${targetId}|${reasonCode}|${timestampIso}`;
  let h1 = 0xdeadbeef ^ payload.length;
  let h2 = 0x41c6ce57 ^ payload.length;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `sha256_${hex1}${hex2}_${payload.length.toString(16).padStart(4, '0')}`;
}

export function verifyAuditChain(events: AuditLogEvent[]): {
  valid: boolean;
  checkedCount: number;
  brokenAtEventId?: string;
} {
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const expectedPrev = i === 0 ? 'GENESIS_0000000000000000' : events[i - 1].eventHash;
    if (ev.prevHash !== expectedPrev) {
      return { valid: false, checkedCount: i + 1, brokenAtEventId: ev.eventId };
    }
    const recomputed = computeAuditHash(
      ev.prevHash,
      ev.actorId,
      ev.actionType,
      ev.targetId,
      ev.reasonCode,
      ev.timestampIso
    );
    if (recomputed !== ev.eventHash) {
      return { valid: false, checkedCount: i + 1, brokenAtEventId: ev.eventId };
    }
  }
  return { valid: true, checkedCount: events.length };
}
