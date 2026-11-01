import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Database,
  Eye,
  FileCode,
  Flag,
  GitBranch,
  KeyRound,
  Lock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Terminal,
  Users,
} from 'lucide-react';
import {
  ActiveTab,
  AppMode,
  AuditLogEvent,
  ModerationCase,
  StaffRole,
} from '../types';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_MODERATION_CASES,
} from '../data/mockMatches';
import { CANONICAL_THEMES } from '../data/questions';
import {
  allowStaffAction,
  computeAuditHash,
  StaffPermission,
  verifyAuditChain,
} from '../domain/rbac';
import { useToast } from './ToastProvider';

interface AdminViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  setAppMode: (mode: AppMode) => void;
}

type StaffModuleId =
  | 'triage_queue'
  | 'photo_moderation'
  | 'appeals'
  | 'billing_refunds'
  | 'question_cms'
  | 'audit_hash_chain'
  | 'rbac_matrix'
  | 'sre_flags';

const STAFF_ROLES: Array<{ id: StaffRole; label: string }> = [
  { id: 'trust_safety_analyst', label: 'Trust & Safety Analyst' },
  { id: 'trust_safety_lead', label: 'Trust & Safety Lead' },
  { id: 'photo_moderator', label: 'Photo Moderator' },
  { id: 'billing_ops', label: 'Billing & Refund Ops' },
  { id: 'content_psychometrics_editor', label: 'Psychometrics CMS Editor' },
  { id: 'privacy_dpo_officer', label: 'Privacy / DPO Officer' },
  { id: 'sre_release_operator', label: 'SRE / Release Operator' },
  { id: 'support_tier_1', label: 'Support Tier 1' },
  { id: 'support_tier_2', label: 'Support Tier 2' },
  { id: 'superadmin', label: 'Superadmin (Still Denied Raw Quiz)' },
];

export const AdminView: React.FC<AdminViewProps> = ({
  setActiveTab,
  setAppMode,
}) => {
  const { addToast } = useToast();

  // Staff MFA Gate (ADM-000)
  const [mfaVerified, setMfaVerified] = useState(true);
  const [activeRole, setActiveRole] = useState<StaffRole>('trust_safety_lead');
  const [activeModule, setActiveModule] = useState<StaffModuleId>('triage_queue');

  const [cases, setCases] = useState<ModerationCase[]>(INITIAL_MODERATION_CASES);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('KT-2041');
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>(INITIAL_AUDIT_LOGS);

  // JIT Evidence Modal State (ADM-005)
  const [jitModalOpen, setJitModalOpen] = useState(false);
  const [jitReasonCode, setJitReasonCode] = useState('SEV1_HARASSMENT_EVIDENCE_REVIEW');
  const [jitTicketRef, setJitTicketRef] = useState('KT-2041');

  // Action Determination Reason Code
  const [resolutionReason, setResolutionReason] = useState('CONFIRMED_OFF_PLATFORM_PRESSURE');
  // 2-Person Refund Second Signature
  const [refundSecondApproved, setRefundSecondApproved] = useState(false);
  // Feature Flags / Kill Switches
  const [featureFlags, setFeatureFlags] = useState({
    enableCounterpointLens: true,
    enableMosaicFitLens: true,
    enableCirclesCreation: true,
    maintenanceReadOnlyMode: false,
  });

  const selectedCase =
    cases.find((c) => c.caseId === selectedCaseId) || cases[0];
  const chainVerification = verifyAuditChain(auditLogs);

  const appendAuditEvent = (
    actionType: string,
    targetId: string,
    reasonCode: string
  ) => {
    const prevHash =
      auditLogs.length > 0
        ? auditLogs[auditLogs.length - 1].eventHash
        : 'GENESIS_0000000000000000';
    const timestampIso = new Date().toISOString();
    const actorId = `staff_${activeRole}`;
    const eventHash = computeAuditHash(
      prevHash,
      actorId,
      actionType,
      targetId,
      reasonCode,
      timestampIso
    );
    const nextEvent: AuditLogEvent = {
      eventId: `AUD-${9001 + auditLogs.length}`,
      timestampIso,
      actorId,
      actorRole: activeRole,
      actionType,
      targetId,
      reasonCode,
      prevHash,
      eventHash,
    };
    setAuditLogs((prev) => [...prev, nextEvent]);
  };

  const handleGrantJitEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allowStaffAction(activeRole, 'grant_jit_evidence')) {
      addToast(`RBAC DENY: Role "${activeRole}" cannot request JIT evidence.`, 'error');
      return;
    }
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === selectedCase.caseId
          ? {
              ...c,
              jitUnlocked: true,
              jitExpiresAt: '14m 59s remaining (Case-Scoped Only)',
              evidenceRedactedPreview:
                'UNREDACTED CASE WINDOW (Msgs #4-#5): "Give me your WhatsApp right now, why are you wasting time on app chat?" [Raw Quiz Answers remain CRYPTOGRAPHICALLY DENIED per D-10]',
            }
          : c
      )
    );
    appendAuditEvent('JIT_EVIDENCE_GRANT_15M', selectedCase.caseId, jitReasonCode);
    setJitModalOpen(false);
    addToast(`JIT Evidence unlocked for ${selectedCase.caseId} (15m TTL). Audit hash chained.`, 'success');
  };

  const handleResolveCase = (determination: 'WARN' | 'COOLDOWN_72H' | 'SUSPEND_ACCOUNT') => {
    if (!allowStaffAction(activeRole, 'resolve_safety_case')) {
      addToast(`RBAC DENY: Role "${activeRole}" cannot resolve safety cases.`, 'error');
      return;
    }
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === selectedCase.caseId ? { ...c, status: 'resolved' } : c
      )
    );
    appendAuditEvent(
      `CASE_RESOLVE_${determination}`,
      selectedCase.caseId,
      resolutionReason
    );
    addToast(
      `Case ${selectedCase.caseId} resolved with ${determination}. Hash-chained audit event recorded.`,
      'success'
    );
  };

  if (!mfaVerified) {
    return (
      <div className="min-h-screen bg-[#111418] text-[#F3F4F6] flex items-center justify-center p-4 font-mono">
        <div className="max-w-md w-full rounded-2xl bg-[#181C22] border border-[#2A313C] p-6 space-y-4">
          <div className="text-xs text-amber-400 uppercase">
            ADM-000 · Isolated /staff Surface · WebAuthn Hardware MFA Gate
          </div>
          <h1 className="text-xl font-bold">Staff Re-Authentication Required</h1>
          <p className="text-xs text-gray-400">
            Every staff session requires hardware security key verification and is recorded in the
            hash-chained audit log.
          </p>
          <button
            type="button"
            onClick={() => setMfaVerified(true)}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold"
          >
            Verify Hardware Key (YubiKey / Passkey) →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111418] text-[#E5E7EB] flex flex-col font-body">
      {/* Top Dense Operational Bar (Palantir-Inspired Staff Surface · Decision D-17) */}
      <header className="h-14 bg-[#161A20] border-b border-[#262C36] px-4 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAppMode('user');
              setActiveTab('home');
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#202630] hover:bg-[#2A323F] text-gray-200 font-mono text-[11px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit /staff</span>
          </button>
          <span className="font-mono font-bold text-teal-400 tracking-wide">
            KITHRA // STAFF OPS CONSOLE (D-10 · D-17)
          </span>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Audit Chain: {chainVerification.valid ? `VALID (${chainVerification.checkedCount} events)` : 'BROKEN'}
          </span>
        </div>

        {/* Role Switcher + Raw Quiz Denial Proof */}
        <div className="flex items-center gap-2.5">
          <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/70 border border-rose-800/50 text-rose-300 font-mono text-[10px]">
            <Lock className="w-3 h-3" />
            raw_quiz_answers: {allowStaffAction(activeRole, 'view_raw_quiz_answers') ? 'ALLOWED' : 'DENIED (ALL ROLES)'}
          </span>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-gray-400">Active Role:</span>
            <select
              aria-label="Select Staff RBAC Role"
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value as StaffRole)}
              className="px-2.5 py-1 rounded-lg bg-[#202630] border border-[#323B49] text-gray-100 font-mono text-[11px]"
            >
              {STAFF_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setMfaVerified(false)}
            className="px-2.5 py-1 rounded-lg bg-[#202630] border border-[#323B49] text-gray-300 font-mono text-[11px]"
          >
            Lock MFA
          </button>
        </div>
      </header>

      {/* 3-Pane Operational Layout: [Pane L: Modules] | [Pane C: Queue/Table] | [Pane R: Case & Entity Graph] */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-3.5rem)]">
        {/* PANE L: Operational Modules Rail (2 Cols) */}
        <aside className="lg:col-span-2 bg-[#14181E] border-r border-[#262C36] p-3 space-y-1">
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-gray-400">
            Staff Modules (ADM-001..023)
          </div>
          {(
            [
              { id: 'triage_queue', label: 'Safety Triage Queue', badge: 'SEV-1' },
              { id: 'photo_moderation', label: '4:5 Photo Quarantine', badge: '1' },
              { id: 'appeals', label: 'Appeals Desk', badge: '1' },
              { id: 'billing_refunds', label: '2-Person Refunds', badge: '₹1,194' },
              { id: 'question_cms', label: '12-Theme Bank CMS', badge: '2,400' },
              { id: 'audit_hash_chain', label: 'Hash-Chained Audit Log', badge: String(auditLogs.length) },
              { id: 'rbac_matrix', label: '10-Role RBAC Matrix' },
              { id: 'sre_flags', label: 'Kill-Switches & Flags' },
            ] as Array<{ id: StaffModuleId; label: string; badge?: string }>
          ).map((mod) => {
            const active = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                  active
                    ? 'bg-teal-600/20 text-teal-300 border border-teal-500/40 font-semibold'
                    : 'text-gray-400 hover:bg-[#1C222B] hover:text-gray-200'
                }`}
              >
                <span className="truncate">{mod.label}</span>
                {mod.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#202630] text-gray-300">
                    {mod.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* PANE C: Queue / Matrix / Log List (5 Cols) */}
        <section className="lg:col-span-5 bg-[#12161C] border-r border-[#262C36] p-4 space-y-4 overflow-y-auto">
          {(activeModule === 'triage_queue' ||
            activeModule === 'photo_moderation' ||
            activeModule === 'appeals' ||
            activeModule === 'billing_refunds') && (
            <>
              <div className="flex items-center justify-between border-b border-[#262C36] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-teal-400">
                    Pane C · Operational Queue · SLA Sorted
                  </span>
                  <h2 className="text-base font-semibold text-white">
                    Active Moderation &amp; Operations Cases ({cases.length})
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  Role: {activeRole}
                </span>
              </div>

              <div className="space-y-2.5">
                {cases.map((c) => {
                  const isSelected = c.caseId === selectedCase.caseId;
                  return (
                    <button
                      key={c.caseId}
                      type="button"
                      onClick={() => {
                        setSelectedCaseId(c.caseId);
                        setJitTicketRef(c.caseId);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors space-y-2 ${
                        isSelected
                          ? 'bg-[#1B222C] border-teal-500/60'
                          : 'bg-[#161B22] border-[#262C36] hover:border-[#36404F]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-xs">
                        <span className="font-bold text-white flex items-center gap-2">
                          <span>{c.caseId}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              c.severity === 'SEV-1'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                                : 'bg-amber-950 text-amber-300 border border-amber-700/50'
                            }`}
                          >
                            {c.severity}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#222934] text-gray-300 uppercase">
                            {c.mode}
                          </span>
                        </span>
                        <span className="text-[11px] text-gray-400">
                          SLA: {c.slaDueInMinutes}m · {c.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs font-mono text-teal-300">{c.reasonCode}</div>
                      <p className="text-xs text-gray-300 leading-relaxed">{c.summary}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {activeModule === 'question_cms' && (
            <div className="space-y-3">
              <div className="border-b border-[#262C36] pb-3">
                <span className="text-[10px] font-mono uppercase text-teal-400">
                  ADM-014..016 · 12-Theme Question Bank Registry (2,400 Slots)
                </span>
                <h2 className="text-base font-semibold text-white">
                  Canonical Psychometric Themes &amp; Model Version v1.2
                </h2>
              </div>
              {CANONICAL_THEMES.map((th) => (
                <div
                  key={th.code}
                  className="p-3 rounded-xl bg-[#161B22] border border-[#262C36] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-mono font-bold text-teal-300">
                      {th.code} · {th.name}
                    </div>
                    <div className="text-gray-400">{th.description}</div>
                  </div>
                  <span className="font-mono text-[11px] text-amber-300 shrink-0 ml-2">
                    {th.placeholderBankSize} draft IDs
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeModule === 'audit_hash_chain' && (
            <div className="space-y-3">
              <div className="border-b border-[#262C36] pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-teal-400">
                    ADM-018 · Append-Only SHA-256 Hash-Chained Audit Log
                  </span>
                  <h2 className="text-base font-semibold text-white">
                    Cryptographic Chain Verification: {chainVerification.valid ? 'PASSED' : 'FAILED'}
                  </h2>
                </div>
              </div>
              {auditLogs.map((ev) => (
                <div
                  key={ev.eventId}
                  className="p-3 rounded-xl bg-[#161B22] border border-[#262C36] font-mono text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between text-teal-300">
                    <span>
                      {ev.eventId} · {ev.actionType}
                    </span>
                    <span className="text-gray-400">{ev.targetId}</span>
                  </div>
                  <div className="text-gray-300">
                    Actor: {ev.actorId} ({ev.actorRole}) · Reason: {ev.reasonCode}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    prev_hash: {ev.prevHash}
                  </div>
                  <div className="text-[10px] text-emerald-400 truncate">
                    event_hash: {ev.eventHash}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeModule === 'rbac_matrix' && (
            <div className="space-y-3">
              <div className="border-b border-[#262C36] pb-3">
                <span className="text-[10px] font-mono uppercase text-teal-400">
                  06_ADMIN_RD &amp; 09_SECURITY_RD · 10-Role Deny-By-Default RBAC Matrix
                </span>
                <h2 className="text-base font-semibold text-white">
                  Permission Evaluation for Active Role: {activeRole}
                </h2>
              </div>
              {(
                [
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
                  'view_raw_quiz_answers',
                ] as StaffPermission[]
              ).map((perm) => {
                const allowed = allowStaffAction(activeRole, perm);
                return (
                  <div
                    key={perm}
                    className="p-2.5 rounded-lg bg-[#161B22] border border-[#262C36] flex items-center justify-between font-mono text-xs"
                  >
                    <span>{perm}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        allowed
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-rose-950 text-rose-300'
                      }`}
                    >
                      {allowed ? 'ALLOW' : 'DENY'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {activeModule === 'sre_flags' && (
            <div className="space-y-3">
              <div className="border-b border-[#262C36] pb-3">
                <span className="text-[10px] font-mono uppercase text-teal-400">
                  ADM-017 &amp; 11_OPS_RD · Feature Flags &amp; Kill-Switches
                </span>
                <h2 className="text-base font-semibold text-white">
                  Runtime Controls (Audited)
                </h2>
              </div>
              {(Object.keys(featureFlags) as Array<keyof typeof featureFlags>).map((flagKey) => (
                <div
                  key={flagKey}
                  className="p-3 rounded-xl bg-[#161B22] border border-[#262C36] flex items-center justify-between text-xs font-mono"
                >
                  <span>{flagKey}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!allowStaffAction(activeRole, 'manage_feature_flags')) {
                        addToast(`RBAC DENY: Role "${activeRole}" cannot toggle SRE flags.`, 'error');
                        return;
                      }
                      setFeatureFlags((prev) => ({ ...prev, [flagKey]: !prev[flagKey] }));
                      appendAuditEvent('TOGGLE_FEATURE_FLAG', flagKey, 'SRE_RUNTIME_CHANGE');
                      addToast(`Updated flag ${flagKey} and recorded audit hash.`, 'info');
                    }}
                    className={`px-3 py-1 rounded font-bold ${
                      featureFlags[flagKey]
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {featureFlags[flagKey] ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PANE R: Case Inspector, Palantir Entity Graph & JIT Evidence Unlock (5 Cols) */}
        <section className="lg:col-span-5 bg-[#14181E] p-5 space-y-5 overflow-y-auto">
          <div className="flex items-start justify-between border-b border-[#262C36] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-teal-400">
                Pane R · Case Detail &amp; Entity Graph Inspector
              </span>
              <h2 className="text-xl font-bold text-white font-mono">
                {selectedCase.caseId} · {selectedCase.reasonCode}
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Reported Member: {selectedCase.reportedMemberId} · Mode: {selectedCase.mode.toUpperCase()}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#202630] font-mono text-xs text-teal-300">
              {selectedCase.status.toUpperCase()}
            </span>
          </div>

          {/* Palantir-Style Case Entity Lineage Graph (Case -> Report -> Evidence -> Actor -> Action) */}
          <div className="p-4 rounded-xl bg-[#111418] border border-[#262C36] space-y-3">
            <div className="text-[11px] font-mono uppercase text-gray-400 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-teal-400" />
              <span>Entity Lineage Graph (PALANTIR_TRANSFER_MATRIX · Case-Scoped Only)</span>
            </div>
            <div className="space-y-2">
              {selectedCase.entityGraph.map((node, i) => (
                <div
                  key={node.id}
                  className="p-2.5 rounded-lg bg-[#181D24] border border-[#2A323F] flex items-center justify-between font-mono text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-teal-950 text-teal-300 text-[10px]">
                      {node.type}
                    </span>
                    <span className="text-gray-100">{node.label}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{node.meta}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Redacted Evidence Snapshot + Just-In-Time (JIT) Grant Gate */}
          <div className="p-4 rounded-xl bg-[#111418] border border-[#262C36] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-amber-400">
                Case-Scoped Evidence Snapshot (D-10 Privacy Rule)
              </span>
              {selectedCase.jitUnlocked ? (
                <span className="text-[10px] font-mono text-emerald-400">
                  JIT UNLOCKED · {selectedCase.jitExpiresAt}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setJitModalOpen(true)}
                  className="px-2.5 py-1 rounded bg-amber-600/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] hover:bg-amber-600/30"
                >
                  Request 15m JIT Evidence Unlock
                </button>
              )}
            </div>
            <div className="p-3 rounded-lg bg-[#181D24] border border-[#2A323F] font-mono text-xs text-gray-200 leading-relaxed">
              {selectedCase.evidenceRedactedPreview}
            </div>
          </div>

          {/* Case Action & Two-Person Refund Approval Controls */}
          {selectedCase.queue === 'billing_refunds' ? (
            <div className="p-4 rounded-xl bg-[#111418] border border-[#262C36] space-y-3">
              <div className="text-xs font-mono text-teal-300">
                ADM-013 · Two-Person High-Value Refund Gate (&gt; ₹999 INR)
              </div>
              <p className="text-xs text-gray-400">
                Refunds above ₹999 require two distinct authorized staff signatures (`billing_ops` or
                `superadmin`).
              </p>
              <button
                type="button"
                disabled={refundSecondApproved}
                onClick={() => {
                  if (!allowStaffAction(activeRole, 'approve_two_person_refund')) {
                    addToast(`RBAC DENY: Role "${activeRole}" cannot co-sign high-value refunds.`, 'error');
                    return;
                  }
                  setRefundSecondApproved(true);
                  appendAuditEvent('TWO_PERSON_REFUND_COSIGN', selectedCase.caseId, 'DUPLICATE_UPI_VERIFIED');
                  addToast('2nd signature recorded. ₹1,194 refund dispatched & hash-chained.', 'success');
                }}
                className="w-full py-2.5 rounded-lg bg-teal-600 disabled:opacity-50 text-white font-mono text-xs font-bold"
              >
                {refundSecondApproved
                  ? '✓ 2/2 Signatures Complete · Refund Dispatched'
                  : 'Co-Sign & Execute ₹1,194 Refund (2nd Approver)'}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#111418] border border-[#262C36] space-y-3">
              <div className="text-xs font-mono text-teal-300">
                Mandatory Structured Reason Code &amp; Enforcement Action
              </div>
              <input
                type="text"
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#181D24] border border-[#2A323F] font-mono text-xs text-white"
              />
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleResolveCase('WARN')}
                  className="py-2 rounded-lg bg-[#202630] hover:bg-[#2A323F] font-mono text-xs text-gray-200"
                >
                  Issue Warning
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveCase('COOLDOWN_72H')}
                  className="py-2 rounded-lg bg-amber-900/50 border border-amber-600/40 font-mono text-xs text-amber-200"
                >
                  72h Cooldown
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveCase('SUSPEND_ACCOUNT')}
                  className="py-2 rounded-lg bg-rose-900/60 border border-rose-600/40 font-mono text-xs text-rose-200"
                >
                  Suspend Account
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Just-In-Time (JIT) Redacted Evidence Grant Modal (ADM-005) */}
      {jitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <form
            onSubmit={handleGrantJitEvidence}
            className="bg-[#181C22] border border-[#2E3644] rounded-2xl max-w-md w-full p-6 space-y-4 font-mono text-xs text-gray-200"
          >
            <div className="text-amber-400 uppercase font-bold">
              ADM-005 · Just-In-Time (JIT) Case-Scoped Evidence Access
            </div>
            <p className="text-gray-400 leading-relaxed">
              Unlocks only the reported 5-message evidence window for <strong>{jitTicketRef}</strong>{' '}
              for 15 minutes. Raw psychometric quiz answers remain inaccessible under all
              circumstances.
            </p>
            <div>
              <label className="block text-gray-400 mb-1">Case Ticket ID</label>
              <input
                type="text"
                value={jitTicketRef}
                onChange={(e) => setJitTicketRef(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-[#111418] border border-[#2E3644]"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Mandatory Justification Code</label>
              <input
                type="text"
                value={jitReasonCode}
                onChange={(e) => setJitReasonCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded bg-[#111418] border border-[#2E3644]"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJitModalOpen(false)}
                className="flex-1 py-2.5 rounded bg-[#222832] text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded bg-amber-600 text-white font-bold"
              >
                Log Hash &amp; Unlock (15m)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
