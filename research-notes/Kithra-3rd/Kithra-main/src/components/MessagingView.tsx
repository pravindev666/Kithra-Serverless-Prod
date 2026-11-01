import React, { useState } from 'react';
import {
  Ban,
  BellOff,
  Check,
  Flag,
  Lock,
  MessageSquare,
  Send,
  ShieldAlert,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { ActiveTab, RelationshipMode } from '../types';
import { MOCK_MATCHES } from '../data/mockMatches';
import { useToast } from './ToastProvider';

interface MessagingViewProps {
  selectedMatchId: string | null;
  setActiveTab: (tab: ActiveTab) => void;
  activeRelationshipMode?: RelationshipMode;
  blockedMemberIds?: string[];
  onBlockMemberInstant?: (memberId: string, name: string) => void;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  selectedMatchId,
  activeRelationshipMode = 'dating',
  blockedMemberIds = [],
  onBlockMemberInstant,
}) => {
  const { addToast } = useToast();

  // Tabs: Connected | Incoming Requests | Outgoing | Blocked (MEM-019)
  const [subTab, setSubTab] = useState<'connected' | 'incoming' | 'outgoing' | 'blocked'>('connected');
  const [activeThreadId, setActiveThreadId] = useState<string>(selectedMatchId || 'm1');
  const [acceptedIds, setAcceptedIds] = useState<string[]>(['m1', 'm5']);
  const [mutedIds, setMutedIds] = useState<string[]>([]);
  const [lockScreenPrivacy, setLockScreenPrivacy] = useState<boolean>(true);
  const [draftText, setDraftText] = useState('');

  // 4-Step Report Modal State (MEM-033: Reason -> Evidence Msg Selection -> Block/Mute Toggle -> Confirmation #KT-2045)
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportStep, setReportStep] = useState<1 | 2 | 3 | 4>(1);
  const [reportReason, setReportReason] = useState('UNSOLICITED_OFF_PLATFORM_PRESSURE');
  const [selectedEvidenceMsgIds, setSelectedEvidenceMsgIds] = useState<string[]>(['msg-2']);
  const [alsoBlockOnReport, setAlsoBlockOnReport] = useState(true);

  const [threadsByMember, setThreadsByMember] = useState<
    Record<string, Array<{ id: string; sender: 'me' | 'them'; text: string; time: string }>>
  >({
    m1: [
      {
        id: 'msg-1',
        sender: 'them',
        text: 'Hi! Noticed we both scored 90% on Communication & Repair—especially pausing 20 minutes during a tense moment.',
        time: '10:15 AM',
      },
      {
        id: 'msg-2',
        sender: 'me',
        text: 'Yes! Same-evening calm repair saves so much second-guessing. How is your week in Indiranagar going?',
        time: '10:18 AM',
      },
      {
        id: 'msg-3',
        sender: 'them',
        text: 'Pretty grounded—working on a pedestrian streetscape plan. Would love to grab filter coffee Saturday morning if you are free.',
        time: '10:22 AM',
      },
    ],
    m5: [
      {
        id: 'msg-4',
        sender: 'them',
        text: 'Welcome to the Sunday bookbinding & essay circle thread! We meet at 10:30 AM.',
        time: 'Yesterday',
      },
    ],
  });

  const visibleMatches = MOCK_MATCHES.filter(
    (m) => !blockedMemberIds.includes(m.id)
  );
  const connectedMatches = visibleMatches.filter(
    (m) => acceptedIds.includes(m.id) || m.connectionState === 'connected'
  );
  const incomingMatches = visibleMatches.filter(
    (m) => m.connectionState === 'incoming_request' && !acceptedIds.includes(m.id)
  );
  const outgoingMatches = visibleMatches.filter(
    (m) => m.connectionState === 'outgoing_request'
  );
  const blockedMatches = MOCK_MATCHES.filter((m) => blockedMemberIds.includes(m.id));

  const activeContact =
    connectedMatches.find((m) => m.id === activeThreadId) || connectedMatches[0] || MOCK_MATCHES[0];
  const activeMessages = threadsByMember[activeContact.id] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'me' as const,
      text: draftText.trim(),
      time: 'Just now',
    };
    setThreadsByMember((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));
    setDraftText('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Status & Lock-Screen Notification Privacy Bar (MEM-019..021) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { id: 'connected', label: `Mutual Connections (${connectedMatches.length})` },
              { id: 'incoming', label: `Incoming Requests (${incomingMatches.length})` },
              { id: 'outgoing', label: `Sent Notes (${outgoingMatches.length})` },
              { id: 'blocked', label: `Blocked / Muted (${blockedMatches.length + mutedIds.length})` },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                subTab === t.id
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
          <input
            type="checkbox"
            checked={lockScreenPrivacy}
            onChange={(e) => setLockScreenPrivacy(e.target.checked)}
            className="accent-[var(--accent-primary)]"
          />
          <Lock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Hide sender name &amp; preview on lock-screen notifications</span>
        </label>
      </div>

      {/* Incoming Requests View (MEM-018) */}
      {subTab === 'incoming' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incomingMatches.length === 0 ? (
            <div className="col-span-2 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-8 text-center text-sm text-[var(--text-secondary)]">
              No pending incoming requests right now.
            </div>
          ) : (
            incomingMatches.map((req) => (
              <div
                key={req.id}
                className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-semibold">
                      {req.name}, {req.age} · {req.location}
                    </h3>
                    <span className="text-xs font-mono text-[var(--accent-primary)]">
                      {req.agreementBand} ({req.compatibilityScore}%) · {req.coverageCount}/100 items
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-subtle)]">
                    Mode: {activeRelationshipMode}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                  &ldquo;{req.requestMessage}&rdquo;
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAcceptedIds((prev) => [...prev, req.id]);
                      setThreadsByMember((prev) => ({
                        ...prev,
                        [req.id]: [
                          {
                            id: `msg-init-${req.id}`,
                            sender: 'them',
                            text: req.requestMessage || 'Glad to connect!',
                            time: 'Just now',
                          },
                        ],
                      }));
                      setActiveThreadId(req.id);
                      setSubTab('connected');
                      addToast(`Accepted mutual connection with ${req.name}. 1:1 thread unlocked.`, 'success');
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
                  >
                    Accept &amp; Open 1:1 Chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (onBlockMemberInstant) onBlockMemberInstant(req.id, req.name);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border-default)] text-xs text-[var(--state-danger)] transition-none"
                  >
                    Decline / Block (0ms)
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Outgoing Requests View */}
      {subTab === 'outgoing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outgoingMatches.map((out) => (
            <div
              key={out.id}
              className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-2"
            >
              <div className="font-heading text-lg font-semibold">
                {out.name}, {out.age} · {out.location}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Awaiting mutual consent acceptance before 1:1 messaging opens.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Blocked & Muted List (MEM-035) */}
      {subTab === 'blocked' && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4">
          <h3 className="font-heading text-xl font-semibold">
            Blocked &amp; Muted Accounts (Bidirectional Across All 3 Modes)
          </h3>
          {blockedMatches.length === 0 && mutedIds.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">
              No blocked or muted members in this session. Test the 0ms Instant Block button in any
              chat or discovery card.
            </p>
          ) : (
            <div className="space-y-2">
              {blockedMatches.map((bm) => (
                <div
                  key={bm.id}
                  className="p-3.5 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-between text-xs"
                >
                  <span>
                    <strong>{bm.name}</strong> · Blocked across Friendship, Dating &amp; Matrimony
                  </span>
                  <span className="font-mono text-[var(--state-danger)]">Severed (0ms)</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connected 1:1 Thread Workspace (MEM-020..021) */}
      {subTab === 'connected' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 4 Cols: Connected Roster */}
          <div className="lg:col-span-4 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-4 space-y-2">
            <div className="px-2 py-1 text-[11px] font-mono uppercase text-[var(--text-muted)]">
              Mutual Consent Threads ({activeRelationshipMode})
            </div>
            {connectedMatches.map((m) => {
              const isSelected = m.id === activeContact.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveThreadId(m.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[var(--accent-primary-subtle)]/50 border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-heading font-semibold text-sm">{m.name}</div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        {m.agreementBand} ({m.compatibilityScore}%)
                      </div>
                    </div>
                  </div>
                  {mutedIds.includes(m.id) && (
                    <span className="text-[10px] font-mono text-[var(--state-warning)]">Muted</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right 8 Cols: Active 1:1 Thread + Persistent 0ms Safety Bar */}
          <div className="lg:col-span-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] flex flex-col overflow-hidden">
            {/* Persistent 0ms Thread Safety Header */}
            <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-heading text-lg font-semibold flex items-center gap-2">
                  <span>{activeContact.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                    Mutual Consent Verified
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Shared Themes: {activeContact.sharedThemes.join(' · ')}
                </div>
              </div>

              {/* 0ms Instant Safety Controls (Mute, Block, Report) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMutedIds((prev) =>
                      prev.includes(activeContact.id)
                        ? prev.filter((id) => id !== activeContact.id)
                        : [...prev, activeContact.id]
                    );
                    addToast(`Thread mute toggled in 0ms for ${activeContact.name}.`, 'info');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs font-medium transition-none"
                >
                  <BellOff className="w-3.5 h-3.5" />
                  <span>{mutedIds.includes(activeContact.id) ? 'Unmute' : 'Mute (0ms)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (onBlockMemberInstant) {
                      onBlockMemberInstant(activeContact.id, activeContact.name);
                    }
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--state-danger)]/40 text-[var(--state-danger)] text-xs font-semibold transition-none"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Block (0ms)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setReportStep(1);
                    setReportModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--state-warning)]/40 text-[var(--state-warning)] text-xs font-semibold transition-none"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>
            </div>

            {/*Deterministic Conversation Starter Banner */}
            <div className="px-5 py-2.5 bg-[var(--accent-primary-subtle)]/40 border-b border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
              <span>
                <strong>Conversation prompt (COMM_001):</strong> Ask how each of you prefers to pause
                and check in during a busy workweek.
              </span>
            </div>

            {/* Messages Area */}
            <div className="p-5 space-y-3 min-h-[280px] max-h-[380px] overflow-y-auto">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === 'me' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                        : 'bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] mt-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center gap-2.5"
            >
              <input
                type="text"
                placeholder={`Write a thoughtful reply to ${activeContact.name}...`}
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4-Step Report Modal (MEM-033: Reason -> Evidence Selection -> Block/Mute -> Case ID #KT-2045) */}
      {reportModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--state-warning)]">
                  MEM-033 · Step {reportStep} of 4 · Instant Safety Report (0ms)
                </span>
                <h3 className="font-heading text-xl font-semibold">
                  Report {activeContact.name} to Trust &amp; Safety
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reportStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  1. Select the primary reason code for this report:
                </p>
                {[
                  {
                    code: 'UNSOLICITED_OFF_PLATFORM_PRESSURE',
                    label: 'Repeated pressure to move off-platform or share phone number',
                  },
                  {
                    code: 'MODE_BOUNDARY_VIOLATION',
                    label: 'Violating platonic / mode-specific boundaries',
                  },
                  {
                    code: 'HARASSMENT_OR_DISRESPECT',
                    label: 'Harassment, abusive language, or coercion',
                  },
                  {
                    code: 'COMMERCIAL_OR_SCAM_SOLICITATION',
                    label: 'Financial solicitation or suspected impersonation',
                  },
                ].map((r) => (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => setReportReason(r.code)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs ${
                      reportReason === r.code
                        ? 'bg-[var(--accent-primary-subtle)] border-[var(--accent-primary)] font-semibold'
                        : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setReportStep(2)}
                  className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
                >
                  Next: Select Message Evidence Window →
                </button>
              </div>
            )}

            {reportStep === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-[var(--text-secondary)]">
                  2. Select specific messages to include in the case-scoped evidence snapshot (staff
                  never receive your full chat history or raw quiz answers):
                </p>
                {activeMessages.map((m) => {
                  const checked = selectedEvidenceMsgIds.includes(m.id);
                  return (
                    <label
                      key={m.id}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedEvidenceMsgIds((prev) =>
                            checked ? prev.filter((x) => x !== m.id) : [...prev, m.id]
                          )
                        }
                        className="mt-0.5 accent-[var(--accent-primary)]"
                      />
                      <span>
                        <strong>{m.sender === 'me' ? 'You' : activeContact.name}:</strong> {m.text}
                      </span>
                    </label>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setReportStep(3)}
                  className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
                >
                  Next: Choose Protective Action →
                </button>
              </div>
            )}

            {reportStep === 3 && (
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alsoBlockOnReport}
                    onChange={(e) => setAlsoBlockOnReport(e.target.checked)}
                    className="mt-0.5 accent-[var(--accent-primary)]"
                  />
                  <span>
                    <strong>Immediately block {activeContact.name} across all 3 modes (0ms)</strong>{' '}
                    so they cannot view your profile or message you while Trust &amp; Safety reviews
                    this case.
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (alsoBlockOnReport && onBlockMemberInstant) {
                      onBlockMemberInstant(activeContact.id, activeContact.name);
                    }
                    setReportStep(4);
                  }}
                  className="w-full py-3 rounded-xl bg-[var(--state-danger)] text-white text-xs font-semibold transition-none"
                >
                  Submit Report &amp; Protect Account (0ms)
                </button>
              </div>
            )}

            {reportStep === 4 && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-[var(--state-success-bg)] text-[var(--state-success)] space-y-1">
                  <div className="font-mono font-bold">Case Reference: #KT-2045 (SEV-1 Queue)</div>
                  <p>
                    Your report and {selectedEvidenceMsgIds.length} selected message(s) have been
                    sealed for Trust &amp; Safety review. Statutory acknowledgement SLA: &lt;24 hours.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
