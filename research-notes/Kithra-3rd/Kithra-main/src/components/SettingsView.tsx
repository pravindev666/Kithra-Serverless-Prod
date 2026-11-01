import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  Globe,
  HelpCircle,
  Palette,
  RefreshCw,
  ServerCrash,
  ShieldAlert,
  WifiOff,
  Zap,
} from 'lucide-react';
import {
  ActiveTab,
  BrandPalette,
  HttpErrorCode,
  SupportedLocale,
} from '../types';
import { LOCALE_META } from '../lib/i18n';
import { useToast } from './ToastProvider';

interface SettingsViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode?: boolean;
  setIsDarkMode?: (val: boolean) => void;
  palette?: BrandPalette;
  setPalette?: (palette: BrandPalette) => void;
  locale?: SupportedLocale;
  setLocale?: (locale: SupportedLocale) => void;
  reducedMotion?: boolean;
  setReducedMotion?: (val: boolean) => void;
  lowDataMode?: boolean;
  setLowDataMode?: (val: boolean) => void;
}

const HTTP_STATUS_CATALOG: Record<
  HttpErrorCode,
  {
    codeLabel: string;
    title: string;
    explanation: string;
    recoveryCta: string;
    requestId: string;
  }
> = {
  '404': {
    codeLabel: 'HTTP 404 · Not Found',
    title: 'This page or Circle link could not be found.',
    explanation:
      'The link may have been mistyped or belongs to a mode pool you have not enabled.',
    recoveryCta: 'Return to Active Mode Home',
    requestId: 'req_01JBM881_404',
  },
  '403': {
    codeLabel: 'HTTP 403 · Mode Isolation / Permission Boundary',
    title: 'Access restricted by relationship mode isolation.',
    explanation:
      'Kithra blocks cross-mode profile and photo access unless both members have explicitly consented to the same relationship mode.',
    recoveryCta: 'Review Per-Mode Consent Settings',
    requestId: 'req_01JBM882_403',
  },
  '410': {
    codeLabel: 'HTTP 410 · Withdrawn or Expired Profile',
    title: 'This member has withdrawn or paused their profile in this mode.',
    explanation:
      'When a member pauses a mode or withdraws consent, their card is immediately retired with zero stale cache.',
    recoveryCta: 'Back to Discovery Pool',
    requestId: 'req_01JBM883_410',
  },
  '429': {
    codeLabel: 'HTTP 429 · Rate Limited (Retry-After: 30s)',
    title: 'Whoa—let us slow the pace for a moment.',
    explanation:
      'Rate limits protect members from automated scraping, bulk introduction spam, and credential stuffing.',
    recoveryCta: 'Wait 30s & Resume Calmly',
    requestId: 'req_01JBM884_429',
  },
  '500': {
    codeLabel: 'HTTP 500 · Unexpected Server Error',
    title: 'Something went wrong on our end—your data and consent are safe.',
    explanation:
      'No raw error stack is ever exposed to the browser. Share the correlation ID below if contacting Support.',
    recoveryCta: 'Retry Request Safely',
    requestId: 'req_01JBM885_500',
  },
  '503': {
    codeLabel: 'HTTP 503 · Planned Maintenance / Replica Sync',
    title: 'Kithra is performing a quick deterministic index refresh.',
    explanation:
      'Read-only safety actions (Block, Mute, Export) remain available during maintenance windows.',
    recoveryCta: 'Check Status & Retry',
    requestId: 'req_01JBM886_503',
  },
  offline: {
    codeLabel: 'NETWORK OFFLINE · Local Drafts Preserved',
    title: 'You appear to be offline (or on an unstable 2G/3G link).',
    explanation:
      'Your in-progress questionnaire answers are saved locally and will sync idempotently once connectivity returns.',
    recoveryCta: 'Enable Low-Data Mode & Retry',
    requestId: 'req_local_offline_01',
  },
  blocked: {
    codeLabel: 'ACCOUNT COOLDOWN / APPEALABLE RESTRICTION',
    title: 'Temporary posting cooldown active on Circles.',
    explanation:
      'Every moderation action on Kithra includes a clear reason code and a 14-day right to appeal to a different human reviewer.',
    recoveryCta: 'Submit Appeal to Trust & Safety Lead',
    requestId: 'case_KT_2043_appeal',
  },
};

export const SettingsView: React.FC<SettingsViewProps> = ({
  setActiveTab,
  isDarkMode = false,
  setIsDarkMode,
  palette = 'D2',
  setPalette,
  locale = 'EN',
  setLocale,
  reducedMotion = false,
  setReducedMotion,
  lowDataMode = false,
  setLowDataMode,
}) => {
  const { addToast } = useToast();
  const [selectedErrorCode, setSelectedErrorCode] = useState<HttpErrorCode>('403');
  const [grievanceSubject, setGrievanceSubject] = useState('');

  const activeErrorSpec = HTTP_STATUS_CATALOG[selectedErrorCode];

  return (
    <div className="space-y-8 pb-20">
      {/* Section 1: Brand Palette, Theme, Script & Accessibility Controls */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            MEM-040 · Visual Direction, Multi-Script &amp; Accessibility Preferences
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold">
            Appearance, Motion Budget &amp; Low-Data Controls
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Palette Switcher (D2 / D5 / D1) */}
          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-primary)]">
              <Palette className="w-4 h-4" />
              <span>Provisional Brand Direction (Decision D-04)</span>
            </div>
            <div className="space-y-2">
              {(
                [
                  { id: 'D2', name: 'D2 · Culture-Neutral Editorial ("Ink & Clay") — Default' },
                  { id: 'D5', name: 'D5 · Quiet Trust ("Forest & Sand")' },
                  { id: 'D1', name: 'D1 · Sunlit Humanist ("Ochre & Sage")' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette && setPalette(p.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border ${
                    palette === p.id
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] border-[var(--accent-primary)]'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)]'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility & Low-Data Toggles */}
          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-primary)]">
              <Zap className="w-4 h-4" />
              <span>Motion Budget &amp; 2G/3G Low-Data Mode</span>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs cursor-pointer">
              <span>
                <strong>Warm Charcoal Dark Mode</strong> (Adaptive D2/D5/D1 tokens)
              </span>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => setIsDarkMode && setIsDarkMode(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs cursor-pointer">
              <span>
                <strong>Reduced Motion Override</strong> (Collapses transitions to &le;120ms opacity)
              </span>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion && setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs cursor-pointer">
              <span>
                <strong>Low-Data Mode</strong> (Saves bandwidth on rural/commuter links)
              </span>
              <input
                type="checkbox"
                checked={lowDataMode}
                onChange={(e) => setLowDataMode && setLowDataMode(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent-primary)]"
              />
            </label>

            {setLocale && (
              <div className="pt-1">
                <label className="block text-xs text-[var(--text-secondary)] mb-1">
                  Language &amp; Indic Script Line-Height Profile:
                </label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs"
                >
                  {LOCALE_META.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label} — {l.nativeLabel} ({l.script})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Interactive HTTP Status & Lifecycle Pages Showcase (04B_AUTH_PHOTO_AND_ERRORS_RD) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
              04B_AUTH_PHOTO_AND_ERRORS_RD · HTTP Error &amp; Lifecycle Screen Showcase
            </span>
            <h2 className="font-heading text-2xl font-semibold">
              Inspect All 8 Required HTTP &amp; Account Lifecycle States
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(HTTP_STATUS_CATALOG) as HttpErrorCode[]).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setSelectedErrorCode(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold ${
                  selectedErrorCode === code
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                    : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--accent-primary)] font-bold">
              {activeErrorSpec.codeLabel}
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              Correlation ID: {activeErrorSpec.requestId}
            </span>
          </div>
          <h3 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
            {activeErrorSpec.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {activeErrorSpec.explanation}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              {activeErrorSpec.recoveryCta}
            </button>
          </div>
        </div>
      </div>

      {/* Section 3: Support & Statutory Grievance Officer Desk (MEM-041..042) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-4">
        <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
          MEM-041..042 · Member Support &amp; Statutory Grievance Desk (IT Rules 2021)
        </span>
        <h3 className="font-heading text-xl font-semibold">
          Submit a Support or Statutory Privacy/Safety Grievance Ticket
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Describe your issue or statutory request..."
            value={grievanceSubject}
            onChange={(e) => setGrievanceSubject(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={() => {
              setGrievanceSubject('');
              addToast('Ticket #GRV-2026-409 acknowledged (<24h SLA).', 'success');
            }}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold shrink-0"
          >
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};
