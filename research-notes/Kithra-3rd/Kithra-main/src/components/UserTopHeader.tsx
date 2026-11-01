import React from 'react';
import {
  Command,
  Globe,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  ActiveTab,
  AppMode,
  BrandPalette,
  ModeEnrollmentState,
  RelationshipMode,
  SupportedLocale,
} from '../types';
import { useKithraMotion } from '../lib/motion';
import { LOCALE_META } from '../lib/i18n';

interface UserTopHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setAppMode: (mode: AppMode) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenCommandPalette: () => void;
  activeRelationshipMode?: RelationshipMode;
  setActiveRelationshipMode?: (mode: RelationshipMode) => void;
  modeEnrollments?: Record<RelationshipMode, ModeEnrollmentState>;
  palette?: BrandPalette;
  setPalette?: (palette: BrandPalette) => void;
  locale?: SupportedLocale;
  setLocale?: (locale: SupportedLocale) => void;
}

export const UserTopHeader: React.FC<UserTopHeaderProps> = ({
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenCommandPalette,
  activeRelationshipMode = 'dating',
  setActiveRelationshipMode,
  modeEnrollments,
  palette = 'D2',
  setPalette,
  locale = 'EN',
  setLocale,
}) => {
  const { dur, easeStandard } = useKithraMotion();

  const modes: Array<{ id: RelationshipMode; symbol: string; label: string }> = [
    { id: 'friendship', symbol: '◌', label: 'Friendship' },
    { id: 'dating', symbol: '♡', label: 'Dating' },
    { id: 'matrimony', symbol: '◇', label: 'Matrimony' },
  ];

  const currentEnrollment = modeEnrollments?.[activeRelationshipMode];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[var(--bg-canvas)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
      {/* Left: Persistent 3-Mode Isolated Switcher (04_UIUX_RD §8.2) */}
      <div className="flex items-center gap-3">
        <div
          className="inline-flex items-center p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]"
          role="tablist"
          aria-label="Active Relationship Mode"
        >
          {modes.map((m) => {
            const isActive = activeRelationshipMode === m.id;
            const enrolled = modeEnrollments ? modeEnrollments[m.id]?.enabled : true;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveRelationshipMode && setActiveRelationshipMode(m.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'text-[var(--text-on-accent)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="member-top-mode-pill"
                    transition={{ duration: dur.ui, ease: easeStandard }}
                    className="absolute inset-0 rounded-xl bg-[var(--accent-primary)]"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{m.symbol}</span>
                  <span>{m.label}</span>
                  {!enrolled && (
                    <span className="text-[9px] font-mono opacity-75">(Off)</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Isolation & Consent Pill */}
        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
          title="Manage per-mode discoverability consent"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>
            {currentEnrollment?.enabled && currentEnrollment?.discoverableConsent
              ? currentEnrollment.paused
                ? `${activeRelationshipMode}: Paused`
                : `${activeRelationshipMode}: Isolated & Consented`
              : `${activeRelationshipMode}: Not Opted In`}
          </span>
        </button>
      </div>

      {/* Right: Palette, Locale, Command Palette, Theme, Profile */}
      <div className="flex items-center gap-2">
        {setPalette && (
          <div className="hidden lg:inline-flex items-center p-0.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <Palette className="w-3.5 h-3.5 text-[var(--text-muted)] ml-2 mr-1" />
            {(['D2', 'D5', 'D1'] as BrandPalette[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPalette(p)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold ${
                  palette === p
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {setLocale && (
          <div className="hidden sm:inline-flex items-center relative">
            <Globe className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 pointer-events-none" />
            <select
              aria-label="Workspace Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value as SupportedLocale)}
              className="pl-7 pr-2 py-1.5 rounded-xl text-xs font-mono bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            >
              {LOCALE_META.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.code}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          title="Open Command Palette (⌘K)"
        >
          <Command className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">⌘K</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          aria-label="Toggle light or dark mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-[var(--accent-secondary)]" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs font-medium hover:border-[var(--accent-primary)]"
        >
          <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-mono text-[11px] flex items-center justify-center font-bold">
            AM
          </span>
          <span className="hidden sm:inline">Aarav</span>
        </button>
      </div>
    </header>
  );
};
