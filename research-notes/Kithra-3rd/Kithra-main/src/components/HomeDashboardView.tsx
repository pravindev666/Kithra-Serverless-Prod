import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  FileSpreadsheet,
  Layers,
  Lock,
  PauseCircle,
  PlayCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  ActiveTab,
  CompatibilityReport,
  ModeEnrollmentState,
  RelationshipMode,
} from '../types';

interface HomeDashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  reportData: CompatibilityReport;
  hasCompletedAssessment: boolean;
  activeRelationshipMode?: RelationshipMode;
  setActiveRelationshipMode?: (mode: RelationshipMode) => void;
  modeEnrollments?: Record<RelationshipMode, ModeEnrollmentState>;
  onToggleModeConsent?: (mode: RelationshipMode) => void;
  onToggleModePause?: (mode: RelationshipMode) => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  setActiveTab,
  reportData,
  activeRelationshipMode = 'dating',
  setActiveRelationshipMode,
  modeEnrollments,
  onToggleModeConsent,
  onToggleModePause,
}) => {
  const [familyShareLinkActive, setFamilyShareLinkActive] = useState(false);

  const currentModeMeta = {
    friendship: {
      symbol: '◌',
      title: 'Friendship & Community Circles',
      subtitle:
        'Strictly platonic introductions and small local hobby circles. Never visible to Dating or Matrimony pools unless separately enabled.',
    },
    dating: {
      symbol: '♡',
      title: 'Intentional Dating Workspace',
      subtitle:
        'Unhurried introductions grounded in Echo, Counterpoint, and Mosaic Fit agreement across 12 everyday themes.',
    },
    matrimony: {
      symbol: '◇',
      title: 'Adult-Led Matrimony Workspace',
      subtitle:
        'Partner-first life-partnership exploration with full personal chat privacy and an optional, revocable read-only summary card for family.',
    },
  }[activeRelationshipMode];

  const currentEnrollment = modeEnrollments?.[activeRelationshipMode] ?? {
    mode: activeRelationshipMode,
    enabled: true,
    discoverableConsent: true,
    paused: false,
    bio: '',
    intentSummary: '',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Mode-Isolated Status Banner */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
              <span>{currentModeMeta.symbol}</span>
              <span>Active Mode: {activeRelationshipMode.toUpperCase()}</span>
              <span>·</span>
              <span>Model {reportData.modelVersion}</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              {currentModeMeta.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {currentModeMeta.subtitle}
            </p>
          </div>

          {/* 0ms Instant Mode Consent & Pause Controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start">
            {onToggleModeConsent && (
              <button
                type="button"
                onClick={() => onToggleModeConsent(activeRelationshipMode)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-none ${
                  currentEnrollment.enabled && currentEnrollment.discoverableConsent
                    ? 'bg-[var(--state-success-bg)] text-[var(--state-success)] border-[var(--state-success)]/30'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]'
                }`}
              >
                {currentEnrollment.enabled && currentEnrollment.discoverableConsent
                  ? '✓ Mode Consent Active (Tap to Withdraw)'
                  : 'Enable Discoverability Consent'}
              </button>
            )}

            {currentEnrollment.enabled && onToggleModePause && (
              <button
                type="button"
                onClick={() => onToggleModePause(activeRelationshipMode)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border-default)] text-[var(--text-primary)] transition-none"
              >
                {currentEnrollment.paused ? (
                  <>
                    <PlayCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Resume Mode (0ms)</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 text-[var(--state-warning)]" />
                    <span>Pause Mode (0ms)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 3-Mode Matrix Summary Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['friendship', 'dating', 'matrimony'] as RelationshipMode[]).map((m) => {
            const st = modeEnrollments?.[m];
            const isSelected = activeRelationshipMode === m;
            return (
              <div
                key={m}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isSelected
                    ? 'bg-[var(--accent-primary-subtle)]/40 border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
                }`}
              >
                <div>
                  <div className="font-heading font-semibold text-sm capitalize flex items-center gap-1.5">
                    <span>{m === 'friendship' ? '◌' : m === 'dating' ? '♡' : '◇'}</span>
                    <span>{m} Pool</span>
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">
                    {st?.enabled && st?.discoverableConsent
                      ? st.paused
                        ? 'Paused (Hidden from new discovery)'
                        : 'Opted In · Isolated Pool'
                      : 'Disabled · Zero Visibility'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveRelationshipMode && setActiveRelationshipMode(m)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]"
                >
                  {isSelected ? 'Active' : 'Switch'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage & Honest Psychometrics Card + Mode-Specific Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
                Deterministic Coverage Status
              </span>
              <h2 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                {reportData.comparableItemsAnswered} of {reportData.totalItemsInBank} Core Items Answered
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
              Scoring {reportData.scoringVersion}
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full h-2.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
              <div
                className="h-full bg-[var(--accent-primary)]"
                style={{
                  width: `${Math.round(
                    (reportData.comparableItemsAnswered / reportData.totalItemsInBank) * 100
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-[var(--text-muted)] font-mono">
              <span>Minimum threshold: 50% per theme</span>
              <span>Current coverage: {reportData.comparableItemsAnswered}% (Unlocked)</span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Your responses power three inspectable lenses—<strong>Echo (Similar)</strong>,{' '}
            <strong>Counterpoint (Contrast)</strong>, and <strong>Mosaic Fit (Rule-based Complement)</strong>.
            Remember: scores reflect agreement across compared answers, never a prediction.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('matches')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              <Compass className="w-4 h-4" />
              <span>Open {activeRelationshipMode} Discovery</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('assessment')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-medium"
            >
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Answer More Theme Questions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-medium"
            >
              <FileSpreadsheet className="w-4 h-4 text-[var(--accent-primary)]" />
              <span>Inspect My Patterns</span>
            </button>
          </div>
        </div>

        {/* Mode-Specific Control Card (Matrimony Family Summary Link / Friendship Circles / Dating Simulator) */}
        <div className="lg:col-span-5 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col justify-between space-y-4">
          {activeRelationshipMode === 'matrimony' ? (
            <>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
                  Matrimony Autonomy Guardrail
                </span>
                <h3 className="font-heading text-xl font-semibold">
                  Optional Read-Only Family Summary Link
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  On Kithra, parents or relatives never receive login access to your chats or raw
                  questionnaire answers. You can generate a revocable, read-only bio &amp; values
                  card if you choose to share an introduction with family elders.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between">
                <div className="text-xs">
                  <div className="font-semibold">Family Summary Link</div>
                  <div className="font-mono text-[11px] text-[var(--text-muted)]">
                    {familyShareLinkActive
                      ? 'kithra.in/share/mat-aarav-89a (Active)'
                      : 'Revoked / Inactive (Private to you)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFamilyShareLinkActive(!familyShareLinkActive)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--accent-primary)] text-[var(--text-on-accent)]"
                >
                  {familyShareLinkActive ? 'Revoke (0ms)' : 'Enable Link'}
                </button>
              </div>
            </>
          ) : activeRelationshipMode === 'friendship' ? (
            <>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
                  Friendship &amp; Topic Circles
                </span>
                <h3 className="font-heading text-xl font-semibold">
                  Small-Group Community Circles (Max 35)
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Join neighbourhood reading circles, architecture walks, and maker tables with
                  explicit platonic charters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('journal')}
                className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Browse Friendship Circles →</span>
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
                  Deterministic Scenario Lab
                </span>
                <h3 className="font-heading text-xl font-semibold">
                  Test Real-Life Situations Before First Coffee
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Run our rule-based If-Then Scenario Simulator across weekend schedule shifts,
                  workday text repair, and shared travel budgets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('insights')}
                className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Open Scenario Simulator →</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
