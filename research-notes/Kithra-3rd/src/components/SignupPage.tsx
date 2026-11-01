import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  Mail,
  ShieldCheck,
  User,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab, RelationshipMode } from '../types';
import { Wordmark } from './Wordmark';
import { useKithraMotion } from '../lib/motion';

interface SignupPageProps {
  onSuccess: (selectedModes?: RelationshipMode[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSuccess, setActiveTab }) => {
  const { dur, easeStandard, shouldReduce } = useKithraMotion();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Bengaluru');

  // Mandatory unchecked 18+ age verification & DPDP consent checkboxes (D-02, 10_LEGAL_COMPLIANCE)
  const [confirmedAdult18Plus, setConfirmedAdult18Plus] = useState(false);
  const [acceptedPrivacyNotice, setAcceptedPrivacyNotice] = useState(false);
  const [selectedModes, setSelectedModes] = useState<Record<RelationshipMode, boolean>>({
    friendship: true,
    dating: true,
    matrimony: false,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleMode = (mode: RelationshipMode) => {
    setSelectedModes((prev) => ({ ...prev, [mode]: !prev[mode] }));
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedAdult18Plus) {
      setErrorMsg('You must confirm that you are 18 years of age or older to join Kithra.');
      return;
    }
    if (!acceptedPrivacyNotice) {
      setErrorMsg('Please review and accept the DPDP 2023 Privacy Notice & Community Charter.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleCompleteOnboarding = () => {
    const enabledList = (Object.keys(selectedModes) as RelationshipMode[]).filter(
      (m) => selectedModes[m]
    );
    if (enabledList.length === 0) {
      setErrorMsg('Select at least one relationship mode to enable (you can change this anytime).');
      return;
    }
    onSuccess(enabledList);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
      {/* Header */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kithra</span>
        </button>
        <Wordmark />
      </div>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Cols: Onboarding Promises */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
              Step {step} of 2 · Consent-Led Onboarding
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-semibold">
              {step === 1
                ? 'Start with your age gate and account privacy.'
                : 'Choose which relationship modes to turn on.'}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every mode on Kithra has its own independent consent switch. Turning on Friendship
              never exposes your profile in Dating or Matrimony.
            </p>
            <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <span>Strictly 18+ adults only (unchecked by default)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <span>Mandatory EXIF GPS removal on every uploaded portrait</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <span>Pause or withdraw mode consent in one tap anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Step 1 (Credentials & 18+ Gate) or Step 2 (3-Mode Intent Matrix) */}
        <motion.div
          key={step}
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.ui, ease: easeStandard }}
          className="lg:col-span-7"
        >
          <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 shadow-sm space-y-6">
            {errorMsg && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger)]/30 text-[var(--state-danger)] text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1Next} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      First Name or Preferred Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g., Aarav"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      Primary City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="you@example.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Password (minimum 10 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      placeholder="Create a strong passphrase"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm"
                    />
                  </div>
                </div>

                {/* Mandatory Unchecked Consent Checkboxes (10_LEGAL_COMPLIANCE_RD) */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmedAdult18Plus}
                      onChange={(e) => setConfirmedAdult18Plus(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[var(--accent-primary)]"
                    />
                    <span className="text-xs text-[var(--text-primary)] leading-relaxed">
                      <strong>I confirm I am 18 years of age or older.</strong> I understand Kithra
                      is strictly for consenting adults.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedPrivacyNotice}
                      onChange={(e) => setAcceptedPrivacyNotice(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[var(--accent-primary)]"
                    />
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      I consent to Kithra processing my self-reported questionnaire responses to
                      compute deterministic agreement indices under the DPDP Act 2023 Privacy Notice
                      (withdrawable anytime).
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <span>Continue to Relationship Mode Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <h3 className="font-heading text-xl font-semibold">
                    Select your active relationship modes (MEM-001)
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Each mode creates a separate, isolated discovery profile. You can pause or change
                    these at any time from the top bar.
                  </p>
                </div>

                <div className="space-y-3">
                  {(
                    [
                      {
                        mode: 'friendship' as RelationshipMode,
                        symbol: '◌',
                        title: 'Friendship & Community Circles',
                        desc: 'Strictly platonic friends, book clubs, and hobby circles in your city.',
                      },
                      {
                        mode: 'dating' as RelationshipMode,
                        symbol: '♡',
                        title: 'Intentional Dating',
                        desc: 'Unhurried romantic introductions grounded in shared values and communication repair.',
                      },
                      {
                        mode: 'matrimony' as RelationshipMode,
                        symbol: '◇',
                        title: 'Adult-Led Matrimony',
                        desc: 'Life-partnership conversations with full personal privacy and optional read-only family summary links.',
                      },
                    ] as const
                  ).map((item) => {
                    const active = selectedModes[item.mode];
                    return (
                      <button
                        key={item.mode}
                        type="button"
                        onClick={() => toggleMode(item.mode)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                          active
                            ? 'bg-[var(--accent-primary-subtle)]/50 border-[var(--accent-primary)]'
                            : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="font-heading font-semibold text-base flex items-center gap-2">
                            <span>{item.symbol}</span>
                            <span>{item.title}</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
                        </div>
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            active
                              ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                              : 'border border-[var(--border-default)]'
                          }`}
                        >
                          {active && <Check className="w-4 h-4" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-[var(--border-default)] text-xs font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteOnboarding}
                    className="flex-1 py-3.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] font-semibold text-sm"
                  >
                    Complete Setup &amp; Start Questionnaire →
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-semibold text-[var(--accent-primary)] hover:underline"
              >
                Sign in →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
