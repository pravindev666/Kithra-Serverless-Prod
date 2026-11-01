import React, { useState } from 'react';
import {
  AlertTriangle,
  Compass,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, CompatibilityReport, DomainType } from '../types';
import { RadarChart } from './RadarChart';

interface CompatibilityReportViewProps {
  report: CompatibilityReport;
  setActiveTab: (tab: ActiveTab) => void;
  onRetake: () => void;
}

export const CompatibilityReportView: React.FC<CompatibilityReportViewProps> = ({
  report,
  setActiveTab,
  onRetake,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'patterns' | 'not_measured'>('patterns');
  const [withdrawn, setWithdrawn] = useState(false);

  const domainEntries = Object.entries(report.domains) as Array<
    [DomainType, CompatibilityReport['domains'][DomainType]]
  >;

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                My Patterns · Coverage {report.comparableItemsAnswered}/{report.totalItemsInBank} · Model{' '}
                {report.modelVersion}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              Your Declared Relationship Patterns
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
              {report.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start">
            <button
              type="button"
              onClick={() => setActiveSubTab('patterns')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeSubTab === 'patterns'
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              Declared Dimensions (8)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('not_measured')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                activeSubTab === 'not_measured'
                  ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
              }`}
            >
              What We Do NOT Measure (MEM-027)
            </button>
            <button
              type="button"
              onClick={() => setWithdrawn(!withdrawn)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-[var(--border-default)] text-[var(--state-danger)] hover:bg-[var(--state-danger-bg)] transition-none"
            >
              {withdrawn ? 'Restore Pattern Processing' : 'Withdraw Pattern Consent (0ms)'}
            </button>
          </div>
        </div>

        {withdrawn && (
          <div
            role="status"
            className="p-4 rounded-2xl bg-[var(--state-warning-bg)] border border-[var(--state-warning)]/30 text-xs text-[var(--state-warning)] flex items-center justify-between"
          >
            <span>
              <strong>Psychometric processing withdrawn (DPDP §6):</strong> Your raw responses are
              excluded from agreement index computation until you re-enable consent.
            </span>
          </div>
        )}

        {activeSubTab === 'not_measured' ? (
          <div className="space-y-4 pt-2">
            <h2 className="font-heading text-xl font-semibold">
              What Kithra deliberately refuses to claim or measure (Decision D-01)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[var(--text-secondary)]">
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-semibold text-sm text-[var(--text-primary)]">
                  1. No Clinical or Psychiatric Diagnosis
                </div>
                <p>
                  Kithra is not a medical device or clinical diagnostic instrument. Questionnaire
                  patterns describe everyday relationship preferences (like weekend planning or
                  conflict repair timing), never mental health conditions.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-semibold text-sm text-[var(--text-primary)]">
                  2. No AI Digital Twins or Soulmate Probabilities
                </div>
                <p>
                  We do not simulate conversations using LLMs or claim a percentage probability of
                  marital success. Every score is a transparent mathematical summary of shared
                  answers.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-semibold text-sm text-[var(--text-primary)]">
                  3. No Unverified Biometric or Behavioral Scraping
                </div>
                <p>
                  Only declared dimensions that you explicitly answer are plotted on your
                  Relationship Map—no keystroke timing, social graph scraping, or hidden telemetry.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="font-semibold text-sm text-[var(--text-primary)]">
                  4. Staff Cannot Read Raw Answers (D-10)
                </div>
                <p>
                  Even Kithra superadmins are programmatically blocked (`allowStaffAction = false`)
                  from viewing your raw item-level questionnaire answers.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 flex flex-col items-center">
              <RadarChart domains={report.domains} />
              <div className="text-[11px] font-mono text-[var(--text-muted)] text-center mt-2">
                Declared Dimensions Only · Model {report.modelVersion} ({report.scoringVersion})
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domainEntries.map(([key, dom]) => (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-sm capitalize text-[var(--text-primary)]">
                      {key}
                    </span>
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      {dom.band || 'Strong agreement'} ({dom.score}%)
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {dom.summary}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {dom.traits.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Update Questionnaire Answers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matches')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
          >
            <Compass className="w-4 h-4" />
            <span>Compare Patterns in Discovery Pool →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
