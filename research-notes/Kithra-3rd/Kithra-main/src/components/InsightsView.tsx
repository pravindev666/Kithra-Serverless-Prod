import React, { useState } from 'react';
import { Layers, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { ActiveTab, CompatibilityReport, MatchingLens } from '../types';
import { MOCK_MATCHES } from '../data/mockMatches';
import {
  DETERMINISTIC_SCENARIOS,
  MOSAIC_RULE_TABLE,
  simulateDeterministicScenario,
} from '../domain/matching';

interface InsightsViewProps {
  report: CompatibilityReport;
  setActiveTab: (tab: ActiveTab) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ report }) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('m1');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SCEN-WEEKEND-CHANGE');
  const [activeLens, setActiveLens] = useState<MatchingLens>('mosaic');

  const candidate =
    MOCK_MATCHES.find((m) => m.id === selectedCandidateId) || MOCK_MATCHES[0];

  const simResult = simulateDeterministicScenario(
    selectedScenarioId,
    activeLens,
    {
      TIME: report.domains.lifestyle.score,
      SOC: report.domains.lifestyle.score,
      COMM: report.domains.communication.score,
      EMOT: report.domains.intimacy.score,
      FIN: report.domains.finances.score,
      ROLE: report.domains.family.score,
      FAM: report.domains.family.score,
      BOUN: report.domains.boundaries.score,
    },
    {
      TIME: candidate.domains.lifestyle,
      SOC: candidate.domains.lifestyle,
      COMM: candidate.domains.communication,
      EMOT: candidate.domains.intimacy,
      FIN: candidate.domains.finances,
      ROLE: candidate.domains.family,
      FAM: candidate.domains.family,
      BOUN: candidate.domains.boundaries,
    },
    candidate.name
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-primary)]">
          <Layers className="w-3.5 h-3.5" />
          <span>05_MATCHING_RD · Deterministic Scenario Simulator &amp; Mosaic Rule Table</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold">
          Explore Everyday Scenarios with Zero Generative AI
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
          Select any candidate and everyday situation below to inspect how your declared theme scores
          interact under <strong>Echo</strong>, <strong>Counterpoint</strong>, and{' '}
          <strong>Mosaic Fit</strong> rules (`₹0` inference cost; 100% deterministic).
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
              1. Compare With Candidate
            </label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-medium"
            >
              {MOCK_MATCHES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.location})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
              2. Everyday Scenario
            </label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-medium"
            >
              {DETERMINISTIC_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[var(--text-muted)] mb-1.5">
              3. Active Matching Lens
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['echo', 'counterpoint', 'mosaic'] as MatchingLens[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setActiveLens(l)}
                  className={`py-2 rounded-xl text-xs font-mono uppercase font-semibold ${
                    activeLens === l
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                      : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Output Card */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="text-xs font-mono text-[var(--accent-primary)]">
              Scenario Output · {simResult.scenarioId} · Model {report.modelVersion}
            </span>
            <h2 className="font-heading text-2xl font-semibold">{simResult.title}</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">{simResult.context}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-heading font-semibold text-[var(--accent-primary)]">
              {simResult.agreementBand} ({simResult.score}%)
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)]">
              Agreement across compared answers, not a prediction
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
            <div className="text-xs font-mono uppercase text-[var(--accent-primary)]">
              Where Your Habits Align
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
              {simResult.whatWorks}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
            <div className="text-xs font-mono uppercase text-[var(--accent-secondary-text)]">
              Potential Friction to Name Early
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {simResult.watchOutFor}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--accent-primary-subtle)]/50 border border-[var(--accent-primary)]/40 space-y-1">
          <div className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            Suggested Check-In Prompt for You &amp; {candidate.name}
          </div>
          <p className="font-heading text-base text-[var(--text-primary)]">
            {simResult.deterministicCheckInPrompt}
          </p>
        </div>
      </div>

      {/* Explicit Mosaic Fit Rule Table Inspector */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-4">
        <h3 className="font-heading text-xl font-semibold">
          Inspectable Mosaic Fit Rule Table (`MOSAIC_RULE_TABLE`)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOSAIC_RULE_TABLE.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm text-[var(--text-primary)]">{rule.label}</strong>
                <span className="font-mono text-[var(--accent-primary)]">{rule.id}</span>
              </div>
              <div className="font-mono text-[11px] text-[var(--text-muted)]">
                Theme: {rule.themeCode} · Items: {rule.itemA} &times; {rule.itemB}
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">{rule.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
