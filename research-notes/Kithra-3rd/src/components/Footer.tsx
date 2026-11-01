import React, { useState } from 'react';
import { ShieldCheck, Scale, FileText, Globe, AlertCircle, X } from 'lucide-react';
import { ActiveTab, BrandPalette } from '../types';
import { Wordmark } from './Wordmark';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  palette?: BrandPalette;
  onSelectPalette?: (palette: BrandPalette) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  palette = 'D2',
  onSelectPalette,
}) => {
  const [legalModalDoc, setLegalModalDoc] = useState<
    null | 'terms' | 'privacy' | 'community' | 'grievance'
  >(null);

  return (
    <footer className="bg-[var(--bg-subtle)] border-t border-[var(--border-subtle)] pt-20 pb-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
          {/* Brand & Honest Positioning */}
          <div className="lg:col-span-5 space-y-5">
            <Wordmark showTagline />
            <h3 className="font-heading font-semibold text-2xl text-[var(--text-primary)] leading-snug max-w-md">
              Find your people—through how you actually think, live, and care.
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              One thoughtful membership for <strong>Friendship</strong>, <strong>Dating</strong>, and{' '}
              <strong>Matrimony</strong>—kept strictly separate by consent, powered by deterministic
              agreement indices across 12 everyday themes, with zero generative AI or opaque
              predictions.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Zero AI Twins · Deterministic v1.2
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <Scale className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                Strict 3-Mode Isolation
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                <Globe className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                India DPDP 2023 &amp; GDPR Aligned
              </span>
            </div>

            {onSelectPalette && (
              <div className="pt-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Provisional Brand Direction Switcher (D-04):
                </div>
                <div className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  {(
                    [
                      { id: 'D2', label: 'D2 Ink & Clay (Default)' },
                      { id: 'D5', label: 'D5 Forest & Sand' },
                      { id: 'D1', label: 'D1 Sunlit Humanist' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectPalette(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${palette === item.id
                          ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Relationship Modes */}
          <div className="lg:col-span-2 lg:col-start-7 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Modes &amp; Lenses
            </h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  Friendship &amp; Circles
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  Intentional Dating
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  Consent-Led Matrimony
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  12 Question Themes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('report')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  My Patterns &amp; Coverage
                </button>
              </li>
            </ul>
          </div>

          {/* Trust, Pricing & Safety */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Trust &amp; Access
            </h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  Unified Pricing (₹0 / ₹149 / ₹249)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('security')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  Per-Mode Consent &amp; Export
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  4:5 Photo Visibility ACLs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  HTTP Status &amp; Lifecycle States
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="hover:text-[var(--accent-primary)] transition-colors text-left"
                >
                  Staff Operations Console (/staff)
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance (10A_DRAFT_TERMS_PRIVACY_COMMUNITY) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
              Legal &amp; India DPDP 2023
            </h4>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li>
                <button
                  onClick={() => setLegalModalDoc('terms')}
                  className="hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5" /> Terms of Service [DRAFT]
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalDoc('privacy')}
                  className="hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5" /> Privacy &amp; DPDP Notice [DRAFT]
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalDoc('community')}
                  className="hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5" /> Community Charter [DRAFT]
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalDoc('grievance')}
                  className="hover:text-[var(--accent-primary)] transition-colors inline-flex items-center gap-1.5 text-left"
                >
                  <AlertCircle className="w-3.5 h-3.5" /> Grievance Officer (IT Rules 2021)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between text-xs text-[var(--text-muted)] gap-4">
          <div>
            © {new Date().getFullYear()} kithra. Adults 18+ only. Compatibility indices reflect
            agreement across compared answers—never a prediction or clinical diagnosis.
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px]">
            <span>Model v1.2 (Deterministic)</span>
            <span>Safety Motion: 0ms</span>
            <span>Provisional Palette: {palette}</span>
          </div>
        </div>
      </div>

      {/* Draft Legal & Grievance Modal (PUB-008..012) */}
      {legalModalDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-[var(--state-warning-bg)] text-[var(--state-warning)] mb-1">
                  DRAFT — REQUIRES QUALIFIED INDIAN ADVOCATE SIGN-OFF (DEP-01)
                </span>
                <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                  {legalModalDoc === 'terms' && 'Kithra Terms of Service (Draft v2.0)'}
                  {legalModalDoc === 'privacy' && 'DPDP Act 2023 & GDPR Privacy Notice (Draft v2.0)'}
                  {legalModalDoc === 'community' && 'Three-Mode Community & Safety Charter'}
                  {legalModalDoc === 'grievance' && 'Statutory Grievance Officer Desk (India IT Rules 2021)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLegalModalDoc(null)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Close legal document"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-[var(--text-secondary)] space-y-3 max-h-[60vh] overflow-y-auto pr-1 leading-relaxed">
              {legalModalDoc === 'terms' && (
                <>
                  <p>
                    <strong>1. Eligibility (18+ Only):</strong> Kithra is strictly for consenting
                    adults aged 18 years or older. Any underage account is terminated immediately.
                  </p>
                  <p>
                    <strong>2. No Predictive Guarantee:</strong> Agreement indices (Echo,
                    Counterpoint, Mosaic Fit) summarize self-reported questionnaire responses and do
                    not constitute psychological, medical, legal, or marital guarantees.
                  </p>
                  <p>
                    <strong>3. Unified Membership &amp; Cancellation:</strong> Memberships (Free ₹0,
                    Plus ₹149/mo, Connect ₹249/mo) apply across all enabled modes and may be
                    cancelled in one step from Account &amp; Billing at any time.
                  </p>
                </>
              )}
              {legalModalDoc === 'privacy' && (
                <>
                  <p>
                    <strong>1. Data Minimization &amp; Purpose Limitation:</strong> Each relationship
                    mode (Friendship, Dating, Matrimony) requires explicit, independent opt-in
                    consent. You may withdraw mode consent or questionnaire pattern processing at
                    any time.
                  </p>
                  <p>
                    <strong>2. Staff Access Restrictions (D-10):</strong> Raw questionnaire answers
                    are classified Restricted-Psychometric and are denied to all staff roles,
                    including superadmins.
                  </p>
                  <p>
                    <strong>3. Photo Pipeline Privacy:</strong> All uploaded photos undergo mandatory
                    EXIF/GPS metadata scrubbing before storage and obey per-photo, per-mode ACLs.
                  </p>
                </>
              )}
              {legalModalDoc === 'community' && (
                <>
                  <p>
                    <strong>1. Respect Mode Boundaries:</strong> Friendship mode and Circles are
                    strictly platonic. Attempting to use Friendship mode to bypass Dating or
                    Matrimony consent is a violation of community rules.
                  </p>
                  <p>
                    <strong>2. Zero Harassment &amp; Instant Safety Controls:</strong> Block, Mute,
                    and Report actions execute in 0ms and immediately sever bidirectional discovery
                    and messaging.
                  </p>
                </>
              )}
              {legalModalDoc === 'grievance' && (
                <>
                  <p>
                    <strong>Grievance Officer (Placeholder — DEP-02):</strong> Designated Officer
                    Name &amp; Registered Indian Office Address pending incorporation sign-off.
                  </p>
                  <p>
                    <strong>Statutory SLA Targets:</strong> Acknowledgement within 24 hours; full
                    resolution within 15 days (72 hours for urgent safety/non-consensual imagery
                    takedowns).
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setLegalModalDoc(null)}
                className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-sm font-medium"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
