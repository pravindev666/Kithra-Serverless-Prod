import React, { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Check,
  Compass,
  Flag,
  Info,
  Layers,
  MessageSquare,
  RefreshCw,
  Shield,
  Sliders,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  ActiveTab,
  CompatibilityReport,
  DiscoverViewState,
  MatchingLens,
  MatchUser,
  ModeEnrollmentState,
  RelationshipMode,
} from '../types';
import { MOCK_MATCHES } from '../data/mockMatches';
import {
  DETERMINISTIC_SCENARIOS,
  isCandidateEligibleForMode,
  MOSAIC_RULE_TABLE,
  simulateDeterministicScenario,
} from '../domain/matching';
import { useKithraMotion } from '../lib/motion';
import { useToast } from './ToastProvider';

interface MatchesViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  userReport: CompatibilityReport;
  onSelectMatchForChat: (matchId: string) => void;
  activeRelationshipMode?: RelationshipMode;
  setActiveRelationshipMode?: (mode: RelationshipMode) => void;
  modeEnrollments?: Record<RelationshipMode, ModeEnrollmentState>;
  blockedMemberIds?: string[];
  onBlockMemberInstant?: (memberId: string, name: string) => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  setActiveTab,
  onSelectMatchForChat,
  activeRelationshipMode = 'dating',
  setActiveRelationshipMode,
  modeEnrollments,
  blockedMemberIds = [],
  onBlockMemberInstant,
}) => {
  const { dur, easeStandard, shouldReduce } = useKithraMotion();
  const { addToast } = useToast();

  // Active Matching Lens (Echo / Counterpoint / Mosaic Fit)
  const [activeLens, setActiveLens] = useState<MatchingLens>('echo');
  // Minimum Agreement Score Filter
  const [minScoreFilter, setMinScoreFilter] = useState<number>(70);
  // UI State Switcher (MEM-014..017 & 04B Spec: normal, skeleton, empty_city, filtered_zero, low_coverage, error_503)
  const [discoverState, setDiscoverState] = useState<DiscoverViewState>('normal');
  // Side-by-Side Candidate Compare IDs
  const [compareIds, setCompareIds] = useState<string[]>([]);
  // Active Match Detail Modal
  const [selectedCandidate, setSelectedCandidate] = useState<MatchUser | null>(null);
  // Scenario Simulator inside Match Detail
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SCEN-WEEKEND-CHANGE');
  // Connection Request state
  const [sentRequestIds, setSentRequestIds] = useState<string[]>([]);

  const defaultEnrollments: Record<RelationshipMode, ModeEnrollmentState> = modeEnrollments ?? {
    friendship: {
      mode: 'friendship',
      enabled: true,
      discoverableConsent: true,
      paused: false,
      bio: '',
      intentSummary: '',
    },
    dating: {
      mode: 'dating',
      enabled: true,
      discoverableConsent: true,
      paused: false,
      bio: '',
      intentSummary: '',
    },
    matrimony: {
      mode: 'matrimony',
      enabled: true,
      discoverableConsent: true,
      paused: false,
      bio: '',
      intentSummary: '',
    },
  };

  // Strict Mode Isolation Filter using domain function isCandidateEligibleForMode()
  const eligibleMatches = MOCK_MATCHES.filter((candidate) => {
    const check = isCandidateEligibleForMode({
      activeMode: activeRelationshipMode,
      viewerEnrollments: defaultEnrollments,
      candidateModes: candidate.enabledModes,
      candidateDiscoverableInMode: candidate.modeConsent[activeRelationshipMode],
      isBlockedOrMuted: blockedMemberIds.includes(candidate.id),
    });
    if (!check.eligible) return false;
    const scoreForLens = candidate.lensScores[activeLens];
    return scoreForLens >= minScoreFilter;
  });

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const comparedCandidates = MOCK_MATCHES.filter((m) => compareIds.includes(m.id));

  return (
    <div className="space-y-6 pb-20">
      {/* Top Control Bar: Mode Indicator + 3 Lenses + Agreement Band Filter */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
              <Compass className="w-3.5 h-3.5" />
              <span>
                Mode-Isolated Discovery Pool · {activeRelationshipMode.toUpperCase()} ONLY
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              {activeRelationshipMode === 'friendship' && '◌ Friendship & Platonic Introductions'}
              {activeRelationshipMode === 'dating' && '♡ Intentional Dating Introductions'}
              {activeRelationshipMode === 'matrimony' && '◇ Adult-Led Matrimony Introductions'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Strict mode isolation enforced: only members who explicitly opted in to{' '}
              <strong>{activeRelationshipMode}</strong> appear here.
            </p>
          </div>

          {/* 3-Lens Segmented Control (Echo / Counterpoint / Mosaic Fit) */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] self-start">
            {(
              [
                { id: 'echo', label: 'Echo (Similar)' },
                { id: 'counterpoint', label: 'Counterpoint (Contrast)' },
                { id: 'mosaic', label: 'Mosaic Fit (Complement)' },
              ] as const
            ).map((lens) => {
              const active = activeLens === lens.id;
              return (
                <button
                  key={lens.id}
                  type="button"
                  onClick={() => setActiveLens(lens.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${active
                      ? 'text-[var(--text-on-accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="discover-lens-pill"
                      transition={{ duration: dur.ui, ease: easeStandard }}
                      className="absolute inset-0 rounded-xl bg-[var(--accent-primary)]"
                    />
                  )}
                  <span className="relative z-10">{lens.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & UI State Simulator Row */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
            <label htmlFor="min-band-slider" className="text-xs font-medium text-[var(--text-secondary)]">
              Minimum {activeLens.toUpperCase()} Index:{' '}
              <strong className="font-mono text-[var(--text-primary)]">{minScoreFilter}%</strong>
            </label>
            <input
              id="min-band-slider"
              type="range"
              min={50}
              max={92}
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(Number(e.target.value))}
              className="w-32 accent-[var(--accent-primary)]"
            />
          </div>

          {/* All 6 Required UI States Switcher (MEM-014 & 15_UAT_SCREEN_AND_INCIDENT_MATRIX) */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] mr-1">
              UI State:
            </span>
            {(
              [
                { id: 'normal', label: 'Normal Pool' },
                { id: 'skeleton', label: 'Skeleton' },
                { id: 'empty_city', label: 'Empty City Waitlist' },
                { id: 'filtered_zero', label: 'Filtered-to-Zero' },
                { id: 'low_coverage', label: 'Low Coverage (<50%)' },
                { id: 'error_503', label: '503 Retry' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setDiscoverState(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${discoverState === st.id
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Candidate Comparison Drawer (MEM-016) */}
      {comparedCandidates.length === 2 && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] border-2 border-[var(--accent-primary)] p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
            <div>
              <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
                MEM-016 · Side-by-Side Deterministic Comparison ({activeLens.toUpperCase()} Lens)
              </span>
              <h2 className="font-heading text-xl font-semibold">
                {comparedCandidates[0].name} vs. {comparedCandidates[1].name}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            >
              Clear Compare
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparedCandidates.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-heading font-semibold text-base">
                    {c.name}, {c.age} · {c.location}
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                    {c.agreementBand} ({c.lensScores[activeLens]}%)
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[var(--text-muted)]">
                  Coverage: {c.coverageCount}/{c.totalEligibleItems} items · Model {c.modelVersion}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  <strong>Shared Themes:</strong> {c.sharedThemes.join(' · ')}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  <strong>Watch-out:</strong> {c.frictionPoints.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Active UI State */}
      {discoverState === 'skeleton' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-6 space-y-4 animate-pulse"
            >
              <div className="aspect-[4/5] rounded-2xl bg-[var(--bg-subtle)]" />
              <div className="h-5 w-2/3 rounded bg-[var(--bg-subtle)]" />
              <div className="h-3 w-full rounded bg-[var(--bg-subtle)]" />
              <div className="h-10 w-full rounded-xl bg-[var(--bg-subtle)]" />
            </div>
          ))}
        </div>
      )}

      {discoverState === 'empty_city' && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-10 text-center max-w-xl mx-auto space-y-4">
          <Users className="w-10 h-10 text-[var(--accent-primary)] mx-auto" />
          <h2 className="font-heading text-2xl font-semibold">
            Your city pool is warming up (No fake bot profiles—ever)
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Kithra never populates discovery with synthetic profiles or unconsented cross-mode
            accounts. Widen your distance radius or get notified when new consented{' '}
            <strong>{activeRelationshipMode}</strong> members join nearby.
          </p>
          <button
            type="button"
            onClick={() => setDiscoverState('normal')}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
          >
            Return to Active Pool
          </button>
        </div>
      )}

      {discoverState === 'filtered_zero' && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-10 text-center max-w-xl mx-auto space-y-4">
          <Sliders className="w-10 h-10 text-[var(--accent-secondary)] mx-auto" />
          <h2 className="font-heading text-2xl font-semibold">
            Zero candidates match your strict filter combination
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Try lowering your minimum Agreement Index threshold or switching from Echo to Mosaic Fit
            to explore complementary pairs.
          </p>
          <button
            type="button"
            onClick={() => {
              setMinScoreFilter(70);
              setDiscoverState('normal');
            }}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
          >
            Reset Filters to 70%
          </button>
        </div>
      )}

      {discoverState === 'low_coverage' && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-10 text-center max-w-xl mx-auto space-y-4">
          <Info className="w-10 h-10 text-[var(--accent-primary)] mx-auto" />
          <h2 className="font-heading text-2xl font-semibold">
            Insufficient Coverage Gate (&lt;50% Shared Items)
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Under Kithra&apos;s Psychometric Honesty Policy (`D-01`), we withhold numeric agreement
            scores until both members have answered at least 50% of comparable items across core
            themes.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('assessment')}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
          >
            Answer 6 More Questions to Unlock →
          </button>
        </div>
      )}

      {discoverState === 'error_503' && (
        <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--state-warning)]/40 p-10 text-center max-w-xl mx-auto space-y-4">
          <AlertTriangle className="w-10 h-10 text-[var(--state-warning)] mx-auto" />
          <h2 className="font-heading text-2xl font-semibold">
            Temporary Service Maintenance (HTTP 503 · Retry-After: 15s)
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            The deterministic scoring worker is refreshing its read replica. Your mode isolation and
            consent settings remain intact.
          </p>
          <button
            type="button"
            onClick={() => setDiscoverState('normal')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Normal Mode-Scoped Candidate Grid */}
      {discoverState === 'normal' && (
        <>
          {eligibleMatches.length === 0 ? (
            <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-10 text-center space-y-4">
              <h2 className="font-heading text-xl font-semibold">
                {defaultEnrollments[activeRelationshipMode]?.enabled
                  ? 'No candidates above your current score filter in this mode.'
                  : `You have not enabled ${activeRelationshipMode.toUpperCase()} mode yet.`}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                {defaultEnrollments[activeRelationshipMode]?.enabled
                  ? 'Lower the minimum Agreement Index slider or switch lenses.'
                  : 'Because Kithra enforces strict mode isolation, you must opt in to this mode before viewing or appearing in its pool.'}
              </p>
              {setActiveRelationshipMode && (
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMinScoreFilter(65)}
                    className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
                  >
                    Reset Filter to 65%
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eligibleMatches.map((candidate, index) => {
                const lensScore = candidate.lensScores[activeLens];
                const photoAcl = candidate.photoVisibilityByMode[activeRelationshipMode];
                const isBlurred =
                  photoAcl === 'matches_only' && candidate.connectionState !== 'connected';
                const isCompared = compareIds.includes(candidate.id);
                const requestSent =
                  sentRequestIds.includes(candidate.id) ||
                  candidate.connectionState === 'outgoing_request';

                return (
                  <motion.div
                    key={candidate.id}
                    initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: dur.ui,
                      ease: easeStandard,
                      delay: shouldReduce ? 0 : Math.min(index, 7) * 0.03,
                    }}
                    whileHover={shouldReduce ? undefined : { y: -2 }}
                    className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      {/* 4:5 Portrait with Per-Mode Photo ACL Enforcement */}
                      <div className="aspect-[4/5] relative bg-[var(--bg-subtle)] overflow-hidden">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className={`w-full h-full object-cover transition-all ${isBlurred ? 'blur-md scale-105' : ''
                            }`}
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-black/70 text-white">
                            {activeRelationshipMode === 'friendship'
                              ? '◌ Friendship'
                              : activeRelationshipMode === 'dating'
                                ? '♡ Dating'
                                : '◇ Matrimony'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleCompare(candidate.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-mono ${isCompared
                                ? 'bg-[var(--accent-primary)] text-white'
                                : 'bg-black/65 text-white hover:bg-black/80'
                              }`}
                          >
                            {isCompared ? '✓ Comparing' : '+ Compare'}
                          </button>
                        </div>

                        {isBlurred && (
                          <div className="absolute inset-0 flex items-center justify-center p-4 text-center bg-black/35">
                            <span className="px-3 py-1.5 rounded-xl bg-black/75 text-white text-xs font-mono">
                              Photo ACL: Unblurs after mutual connection
                            </span>
                          </div>
                        )}

                        <span className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded bg-black/65 text-white text-[10px] font-mono">
                          Illustrative image · {candidate.distanceKm} km
                        </span>
                      </div>

                      {/* Candidate Body */}
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                              {candidate.name}, {candidate.age}
                            </h2>
                            <p className="text-xs text-[var(--text-muted)]">
                              {candidate.occupation} · {candidate.location}
                            </p>
                          </div>
                        </div>

                        {/* Mode-Specific Bio */}
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {candidate.modeBios[activeRelationshipMode] || candidate.bio}
                        </p>

                        {/* Mandatory Honest Agreement Anatomy: Band + Coverage + Model Version + Caveat */}
                        <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[var(--accent-primary)]">
                              {candidate.agreementBand} ({lensScore}%)
                            </span>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] tabular-nums">
                              {candidate.coverageCount}/{candidate.totalEligibleItems} items ·{' '}
                              {candidate.modelVersion}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[var(--border-subtle)] overflow-hidden">
                            <div
                              className="h-full bg-[var(--accent-primary)]"
                              style={{ width: `${candidate.coverageCount}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {activeLens.toUpperCase()} lens · Agreement across compared answers, not
                            a prediction.
                          </p>
                        </div>

                        {/* Shared Themes & Friction Points */}
                        <div className="space-y-1 text-xs">
                          <div className="text-[var(--text-secondary)]">
                            <strong className="text-[var(--text-primary)]">Aligned:</strong>{' '}
                            {candidate.sharedThemes.slice(0, 2).join(' · ')}
                          </div>
                          <div className="text-[var(--text-muted)]">
                            <strong>Talk through:</strong> {candidate.frictionPoints[0]}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="px-5 pb-5 pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition-colors"
                      >
                        Inspect Breakdown
                      </button>

                      {candidate.connectionState === 'connected' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectMatchForChat(candidate.id);
                            setActiveTab('messages');
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Open Chat</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={requestSent}
                          onClick={() => {
                            setSentRequestIds((prev) => [...prev, candidate.id]);
                            addToast(
                              `Introduction note sent to ${candidate.name} in ${activeRelationshipMode} mode.`,
                              'success'
                            );
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[var(--accent-primary)] disabled:opacity-60 text-[var(--text-on-accent)] text-xs font-semibold"
                        >
                          {requestSent ? '✓ Note Sent' : 'Send Intro Note'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Match Detail & Deterministic Scenario Simulator Modal (MEM-015) */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-xl space-y-6 my-8">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
                  MEM-015 · Full Compatibility Breakdown &amp; Scenario Simulator
                </span>
                <h2 className="font-heading text-2xl font-semibold">
                  {selectedCandidate.name}, {selectedCandidate.age} · {selectedCandidate.location}
                </h2>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  {selectedCandidate.agreementBand} ({selectedCandidate.lensScores[activeLens]}% under{' '}
                  {activeLens.toUpperCase()} lens) · Coverage {selectedCandidate.coverageCount}/
                  {selectedCandidate.totalEligibleItems} · Model {selectedCandidate.modelVersion}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
                aria-label="Close breakdown modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mosaic Complementarity Rules Section */}
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-xs font-mono uppercase text-[var(--accent-primary)]">
                Mosaic Fit Rule Evaluation (05_MATCHING_RD)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MOSAIC_RULE_TABLE.slice(0, 2).map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs space-y-1"
                  >
                    <div className="font-semibold text-[var(--text-primary)]">
                      {rule.label} ({rule.id})
                    </div>
                    <p className="text-[var(--text-secondary)]">{rule.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deterministic If-Then Scenario Simulator */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase text-[var(--accent-primary)] font-semibold">
                  Interactive Deterministic Scenario Simulator (Zero AI)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {DETERMINISTIC_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedScenarioId(sc.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono ${selectedScenarioId === sc.id
                          ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                        }`}
                    >
                      {sc.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const sim = simulateDeterministicScenario(
                  selectedScenarioId,
                  activeLens,
                  { TIME: 82, SOC: 79, COMM: 88, EMOT: 85, FIN: 82, ROLE: 81, FAM: 81, BOUN: 89 },
                  {
                    TIME: selectedCandidate.domains.lifestyle,
                    SOC: selectedCandidate.domains.lifestyle,
                    COMM: selectedCandidate.domains.communication,
                    EMOT: selectedCandidate.domains.intimacy,
                    FIN: selectedCandidate.domains.finances,
                    ROLE: selectedCandidate.domains.family,
                    FAM: selectedCandidate.domains.family,
                    BOUN: selectedCandidate.domains.boundaries,
                  },
                  selectedCandidate.name
                );
                return (
                  <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[var(--text-primary)]">{sim.title}</strong>
                      <span className="font-mono text-[var(--accent-primary)] font-bold">
                        {sim.agreementBand} ({sim.score}%)
                      </span>
                    </div>
                    <p className="text-[var(--text-muted)]">{sim.context}</p>
                    <p className="text-[var(--text-primary)]">
                      <strong>What works:</strong> {sim.whatWorks}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      <strong>Watch out for:</strong> {sim.watchOutFor}
                    </p>
                    <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-[11px] text-[var(--accent-primary)]">
                      Suggested Check-In Prompt: {sim.deterministicCheckInPrompt}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 0ms Instant Safety Controls inside Match Detail */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedCandidate;
                    setSelectedCandidate(null);
                    if (onBlockMemberInstant) {
                      onBlockMemberInstant(target.id, target.name);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--state-danger)]/40 text-[var(--state-danger)] hover:bg-[var(--state-danger-bg)] text-xs font-semibold transition-none"
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>Instant Block (0ms)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToast(
                      `Report #KT-2045 filed against ${selectedCandidate.name}. Profile hidden in 0ms.`,
                      'info'
                    );
                    if (onBlockMemberInstant) {
                      onBlockMemberInstant(selectedCandidate.id, selectedCandidate.name);
                    }
                    setSelectedCandidate(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--border-default)] text-xs font-medium text-[var(--text-secondary)] transition-none"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report &amp; Hide (0ms)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
