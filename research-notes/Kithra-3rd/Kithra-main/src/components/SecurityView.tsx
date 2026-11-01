import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  KeyRound,
  Lock,
  Shield,
  Trash2,
} from 'lucide-react';
import {
  ActiveTab,
  CompatibilityReport,
  ModeEnrollmentState,
  RelationshipMode,
} from '../types';
import { useToast } from './ToastProvider';

interface SecurityViewProps {
  setActiveTab?: (tab: ActiveTab) => void;
  modeEnrollments?: Record<RelationshipMode, ModeEnrollmentState>;
  onToggleModeConsent?: (mode: RelationshipMode) => void;
  reportData?: CompatibilityReport;
  blockedMemberIds?: string[];
  onUnblockMember?: (memberId: string) => void;
}

export const SecurityView: React.FC<SecurityViewProps> = ({
  modeEnrollments,
  onToggleModeConsent,
  reportData,
  blockedMemberIds = [],
  onUnblockMember,
}) => {
  const { addToast } = useToast();
  const [deletionConfirmText, setDeletionConfirmText] = useState('');
  const [deletionScheduled, setDeletionScheduled] = useState(false);

  const handleDownloadJsonExport = () => {
    const exportPayload = {
      exportVersion: '2026.11-dpdp-gdpr',
      exportedAtIso: new Date().toISOString(),
      member: {
        id: 'usr_aarav_mehta_01',
        name: 'Aarav Mehta',
        city: 'Bengaluru',
        ageVerified18Plus: true,
      },
      modeEnrollments,
      psychometricSummary: {
        modelVersion: reportData?.modelVersion ?? 'v1.2',
        scoringVersion: reportData?.scoringVersion ?? '2026.11-deterministic',
        comparableItemsAnswered: reportData?.comparableItemsAnswered ?? 68,
        caveat: 'Agreement across compared answers, not a prediction.',
      },
      blockedMemberIds,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kithra-dpdp-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Downloaded machine-readable JSON data export (DPDP §11 / GDPR Art. 20).', 'success');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Section 1: Per-Mode Consent Ledger (MEM-032 & 10_LEGAL_COMPLIANCE_RD) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-5">
        <div>
          <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            MEM-032 · Granular Purpose-Bound Consent Ledger (India DPDP Act 2023)
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold">
            Per-Mode Discoverability &amp; Psychometric Consent
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Toggle discoverability consent independently for each relationship mode. Changes take
            effect in 0ms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['friendship', 'dating', 'matrimony'] as RelationshipMode[]).map((m) => {
            const st = modeEnrollments?.[m] ?? {
              mode: m,
              enabled: m !== 'matrimony',
              discoverableConsent: m !== 'matrimony',
              paused: false,
              bio: '',
              intentSummary: '',
            };
            return (
              <div
                key={m}
                className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1">
                  <div className="font-heading text-lg font-semibold capitalize">
                    {m} Pool Consent
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {st.enabled && st.discoverableConsent
                      ? `Consented · Only other consented ${m} members can discover you.`
                      : `Withdrawn · Your profile is completely invisible in ${m}.`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleModeConsent && onToggleModeConsent(m)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-none ${
                    st.enabled && st.discoverableConsent
                      ? 'bg-[var(--state-danger-bg)] text-[var(--state-danger)]'
                      : 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                  }`}
                >
                  {st.enabled && st.discoverableConsent
                    ? `Withdraw ${m} Consent (0ms)`
                    : `Grant ${m} Consent`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Active Sessions & Blocked Accounts (MEM-035..036) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4">
          <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            MEM-036 · Active Device Sessions &amp; Appeals Status
          </span>
          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="font-semibold">Current Browser Session · Bengaluru, IN</div>
                <div className="font-mono text-[11px] text-[var(--text-muted)]">
                  HttpOnly SameSite=Lax · CSRF Double-Submit Active
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[var(--state-success-bg)] text-[var(--state-success)] font-mono">
                Active
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between">
              <div>
                <div className="font-semibold">Moderation &amp; Appeals Record (MEM-036)</div>
                <div className="font-mono text-[11px] text-[var(--text-muted)]">
                  0 active restrictions · Good standing across all 3 modes
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[var(--state-success)]" />
            </div>
          </div>
        </div>

        {/* Section 3: Machine-Readable Data Export & Account Deletion (MEM-037..038) */}
        <div className="lg:col-span-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4">
          <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            MEM-037..038 · Data Portability &amp; Right to Erasure
          </span>
          <h3 className="font-heading text-xl font-semibold">
            Download JSON Archive or Schedule Account Erasure
          </h3>
          <button
            type="button"
            onClick={handleDownloadJsonExport}
            className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Full JSON Data Export (POST /me/export)</span>
          </button>

          <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2.5">
            <label className="block text-xs text-[var(--text-secondary)]">
              Type <code>DELETE</code> to schedule permanent account erasure (immediate discovery
              revocation; 14-day grace window; statutory billing/safety audit logs retained per law):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type DELETE"
                value={deletionConfirmText}
                onChange={(e) => setDeletionConfirmText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-mono"
              />
              <button
                type="button"
                disabled={deletionConfirmText !== 'DELETE'}
                onClick={() => {
                  setDeletionScheduled(true);
                  addToast('Account erasure scheduled. Discovery revoked immediately (0ms).', 'info');
                }}
                className="px-4 py-2 rounded-xl bg-[var(--state-danger)] disabled:opacity-40 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletionScheduled ? 'Erasure Scheduled' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
