import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  MailCheck,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  ExtendedIntentionId,
  IntentionId,
  MemberTab,
  RelationshipSignalKind,
  ShellSection,
  SystemErrorCode,
} from '../types/kithra';
import { memberStore } from '../domain/memberStore';
import {
  INTENTION_METADATA,
  SIGNAL_VOCABULARY_METADATA,
} from '../data/mockFixtures';
import { EditorialImage } from './EditorialImage';
import { KithraHero } from './KithraHero';
import { validateAuthForm } from '../utils/kithraLogic';
import {
  registerMemberWithFirebase,
  loginMemberWithFirebase,
  loginWithGoogle,
  resetPasswordWithFirebase,
} from '../services/firebaseClient';
import {
  INDIAN_PRICING_PLANS,
  formatInrCurrency,
} from '../server/founderCommandCenterService';

interface PublicNavigateProps {
  onNavigatePath: (
    path: string,
    options?: {
      intentionFilter?: ExtendedIntentionId | 'all';
    }
  ) => void;
  activeIntentions: ExtendedIntentionId[];
  onToggleActiveIntention: (intention: ExtendedIntentionId) => void;
  pacePreference: string;
  onChangePacePreference: (pace: string) => void;
  manualReduceMotion?: boolean;
  activeMemberId?: string;
}

const VOCABULARY_ITEMS: {
  kind: RelationshipSignalKind;
  number: string;
  title: string;
  subtitle: string;
  detail: string;
  exampleCardNote: string;
}[] = [
    {
      kind: 'echo',
      number: '01',
      title: 'Similar to Me',
      subtitle: 'Discover people who share your traits, interests and values.',
      detail:
        'When two members share similar instincts on conversational pace, weekend restoration, or conflict repair, Kithra highlights Similar to Me. It is a starting point for ease—never a guarantee of chemistry.',
      exampleCardNote:
        'Sample Similar to Me: "Both of you prefer 2–3 thoughtful evening messages a week and calm, private repair when perspectives differ."',
    },
    {
      kind: 'counterpoint',
      number: '02',
      title: 'Different from Me',
      subtitle: 'Meet people who see or experience the world differently.',
      detail:
        'Every real friendship or partnership involves differences. Instead of penalizing a match silently, Kithra names Different from Me—such as an early riser meeting a late-night reader, or a planned weekend walker meeting a spontaneous host—so you can explore different perspectives openly.',
      exampleCardNote:
        'Sample Different from Me: "Aarav plans Sunday morning walks early in the week, whereas you prefer keeping one weekend day unscheduled."',
    },
    {
      kind: 'mosaic',
      number: '03',
      title: 'We Balance Each Other',
      subtitle: 'Find people whose strengths and preferences may complement yours.',
      detail:
        'Sometimes two different answers complement one another—for example, someone who loves cooking elaborate coastal recipes paired with someone who loves hosting conversation and music around the table.',
      exampleCardNote:
        'Sample We Balance Each Other: "Your archival research background and his architectural fieldwork offer complementary ways of exploring a city."',
    },
  ];

export const LandingView: React.FC<PublicNavigateProps> = ({
  onNavigatePath,
  manualReduceMotion = false,
}) => {
  const [selectedSignal, setSelectedSignal] = useState<RelationshipSignalKind>('echo');
  const [pricingDisplayMode, setPricingDisplayMode] = useState<'illustrative' | 'coming-soon'>('illustrative');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: manualReduceMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div>
      {/* 1. HERO — The Kithra Weave */}
      <KithraHero
        manualReduceMotion={manualReduceMotion}
        onPrimaryAction={() => onNavigatePath('/join')}
        onSecondaryScrollToHowItWorks={() => scrollToSection('how-it-works')}
      />

      {/* 2. THREE INDEPENDENT INTENTIONS */}
      <section className="py-12 md:py-16 border-b border-[var(--line)]" id="intentions">
        <div className="max-w-[720px] mb-8">
          <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
            A place for meaningful beginnings
          </p>
          <h2
            className="font-serif-editorial text-[var(--heading)] font-semibold mt-2 mb-3"
            style={{ fontSize: 'clamp(2.25rem, 4vw, 3.25rem)', lineHeight: 1.06, textWrap: 'balance' }}
          >
            Different intentions. One thoughtful account.
          </h2>
          <p className="text-base text-[var(--muted)] leading-relaxed">
            Not every meaningful human connection is romantic. Kithra separates Friendship, Dating, Matrimony, and Cofounders so your photos, professional details, and questionnaire reflections only appear in the intention you choose to enter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(['friendship', 'dating', 'matrimony', 'cofounders'] as ExtendedIntentionId[]).map((intentKey) => {
            const info = INTENTION_METADATA[intentKey];
            return (
              <article
                key={intentKey}
                className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 flex flex-col justify-between min-h-[240px]"
              >
                <div>
                  <div
                    className="w-7 h-[5px] rounded-[3px] mb-7"
                    style={{ backgroundColor: info.colorVar }}
                    aria-hidden="true"
                  />
                  <h3 className="font-serif-editorial text-[32px] leading-[1.1] font-semibold text-[var(--heading)]">
                    {info.label}
                  </h3>
                  <p className="text-[15px] text-[var(--muted)] leading-[1.65] mt-3">
                    {info.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onNavigatePath('/member/discover', {
                        intentionFilter: intentKey,
                      })
                    }
                    className="text-sm font-bold text-[var(--heading)] hover:underline inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap min-h-[40px]"
                  >
                    <span>Explore {info.label.toLowerCase()}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <span className="text-xs text-[var(--muted)]">Independent scope</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-12 md:py-16 border-b border-[var(--line)]" id="how-it-works">
        <div className="max-w-[720px] mb-8">
          <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
            How Kithra works
          </p>
          <h2
            className="font-serif-editorial text-[var(--heading)] font-semibold mt-2 mb-3"
            style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.1rem)', lineHeight: 1.06, textWrap: 'balance' }}
          >
            Built for unhurried human judgement.
          </h2>
          <p className="text-base text-[var(--muted)]">
            Four clear steps designed around clarity, mutual consent, and quiet respect.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01. Choose your intention',
              body: 'Enable Friendship, Dating, Matrimony, or Cofounders independently. You decide which intention to browse at any time.',
              actionLabel: 'Set up your intentions →',
              onClick: () => onNavigatePath('/join'),
            },
            {
              step: '02. Answer at your pace',
              body: 'Respond to thoughtful questions about daily life, communication, and values—save and return whenever you like.',
              actionLabel: 'Preview reflection questions →',
              onClick: () => onNavigatePath('/join'),
            },
            {
              step: '03. Control photo visibility',
              body: 'Frame your portrait with our 4:5 guide and choose whether each photo is visible in Friendship, Dating, Matrimony, or Cofounders separately.',
              actionLabel: 'Learn about 4:5 portraits →',
              onClick: () => onNavigatePath('/join'),
            },
            {
              step: '04. Explore three honest lenses',
              body: 'Review Similar to Me, Different from Me, and We Balance Each Other across the full 0–100 similarity spectrum before saying hello.',
              actionLabel: 'Explore compatibility lenses ↓',
              onClick: () => scrollToSection('compatibility'),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif-editorial text-[26px] leading-[1.15] font-semibold text-[var(--heading)]">
                  {item.step}
                </h3>
                <p className="text-[15px] text-[var(--muted)] leading-[1.65] mt-3">
                  {item.body}
                </p>
              </div>
              <button
                type="button"
                onClick={item.onClick}
                className="mt-5 text-sm font-bold text-[var(--heading)] hover:underline text-left cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                {item.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. COMPATIBILITY EXPLAINED: SIMILAR TO ME, DIFFERENT FROM ME & WE BALANCE EACH OTHER */}
      <section className="py-12 md:py-16 border-b border-[var(--line)]" id="compatibility">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
              Three discovery &amp; compatibility lenses
            </p>
            <h2
              className="font-serif-editorial text-[var(--heading)] font-semibold mt-2 mb-3"
              style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.1rem)', lineHeight: 1.06, textWrap: 'balance' }}
            >
              Similar to Me, Different from Me, and We Balance Each Other.
            </h2>
            <p className="text-base text-[var(--muted)] leading-relaxed mb-5">
              Questionnaire answers cannot predict a soulmate or guarantee a marriage. Instead, Kithra organizes your reflection signals into three everyday lenses and lets you explore the entire 0–100 Attribute Similarity spectrum.
            </p>

            {/* Restrained SVG Line-Linking Diagram */}
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-4 mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-2">
                Active lens: {SIGNAL_VOCABULARY_METADATA[selectedSignal].label}
              </p>
              <svg
                viewBox="0 0 360 88"
                className="w-full h-[78px]"
                role="img"
                aria-label={`Visual diagram for ${SIGNAL_VOCABULARY_METADATA[selectedSignal].label}`}
              >
                {selectedSignal === 'echo' && (
                  <>
                    <path
                      d="M 20 26 C 110 26, 150 42, 340 42"
                      stroke="var(--friend)"
                      strokeWidth="2.2"
                      fill="none"
                    />
                    <path
                      d="M 20 62 C 110 62, 150 46, 340 46"
                      stroke="var(--ochre)"
                      strokeWidth="2.2"
                      fill="none"
                    />
                  </>
                )}
                {selectedSignal === 'counterpoint' && (
                  <>
                    <path
                      d="M 20 44 C 130 44, 190 22, 340 18"
                      stroke="var(--date)"
                      strokeWidth="2.2"
                      fill="none"
                    />
                    <path
                      d="M 20 44 C 130 44, 190 66, 340 70"
                      stroke="var(--heading)"
                      strokeWidth="2"
                      strokeDasharray="5 4"
                      fill="none"
                    />
                  </>
                )}
                {selectedSignal === 'mosaic' && (
                  <>
                    <path
                      d="M 20 24 C 110 70, 220 18, 340 58"
                      stroke="var(--ochre)"
                      strokeWidth="2.2"
                      fill="none"
                    />
                    <path
                      d="M 20 64 C 110 18, 220 70, 340 30"
                      stroke="var(--friend)"
                      strokeWidth="2.2"
                      fill="none"
                    />
                  </>
                )}
              </svg>
              <p className="text-sm text-[var(--muted)] mt-1">
                {SIGNAL_VOCABULARY_METADATA[selectedSignal].description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigatePath('/member/match/member-aarav')}
              className="inline-flex items-center gap-2 rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-3 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              <span>Inspect full alignment details sheet</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3.5">
            {VOCABULARY_ITEMS.map((item) => {
              const isOpen = selectedSignal === item.kind;
              return (
                <div
                  key={item.kind}
                  className={`bg-[var(--surface)] border rounded-[14px] overflow-hidden transition-colors ${isOpen ? 'border-[var(--heading)]' : 'border-[var(--line)]'
                    }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setSelectedSignal(item.kind)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-[var(--surface2)]/40 transition-colors"
                  >
                    <div>
                      <h3 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)] leading-tight">
                        {item.number}. {item.title}
                      </h3>
                      <p className="text-sm text-[var(--muted)] mt-1">{item.subtitle}</p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--muted)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 pt-2 border-t border-[var(--line)]"
                      >
                        <p className="text-[15px] text-[var(--text)] leading-relaxed mt-2">
                          {item.detail}
                        </p>
                        <p className="text-sm text-[var(--muted)] bg-[var(--surface2)] rounded-[9px] p-3.5 mt-3">
                          {item.exampleCardNote}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TRUST & VISIBILITY */}
      <section className="py-12 md:py-16 border-b border-[var(--line)]" id="trust">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
              Trust &amp; visibility boundaries
            </p>
            <h2
              className="font-serif-editorial text-[var(--heading)] font-semibold mt-2 mb-3"
              style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.1rem)', lineHeight: 1.06, textWrap: 'balance' }}
            >
              You decide what is visible in each intention.
            </h2>
            <p className="text-base text-[var(--muted)] leading-relaxed mb-6">
              Exploring Friendship in a new city never opens your profile to Dating or Matrimony searches. Every photo and intention-specific prompt carries independent visibility switches.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-[var(--ochre-text)] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-bold text-[var(--heading)] font-sans-ui">
                    No automatic photo crossover
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    Share a solo 4:5 portrait in Matrimony and Friendship while keeping Dating switched off—or keep a secondary gallery photo strictly in Friendship.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <SlidersHorizontal className="w-5 h-5 text-[var(--ochre-text)] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-bold text-[var(--heading)] font-sans-ui">
                    Calm pace, no urgency tricks
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    No countdown timers, popularity leaderboards, or unsolicited notifications nudging you to swipe.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--ochre-text)] mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <h3 className="text-base font-bold text-[var(--heading)] font-sans-ui">
                    Safety protections always free
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">
                    Per-intention visibility controls, blocking, reporting, and human moderation review are included for every member regardless of tier.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-[var(--heading)]">
                    Per-intention boundary preview
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    Simulated example · One account, three independent scopes
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigatePath('/member/photos')}
                  className="text-sm font-bold text-[var(--heading)] hover:underline cursor-pointer whitespace-nowrap"
                >
                  Open Photo Manager →
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="p-4 rounded-[11px] bg-[var(--surface2)] flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[var(--heading)] block">Friendship scope</span>
                    <span className="text-[var(--muted)]">Shows neighbourhood walks, books, and joined Circles</span>
                  </div>
                  <span className="font-semibold text-[var(--heading)] whitespace-nowrap">✓ Visible</span>
                </div>
                <div className="p-4 rounded-[11px] border border-[var(--line)] flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[var(--heading)] block">Dating scope</span>
                    <span className="text-[var(--muted)]">Hidden while you are only exploring Friendship &amp; Matrimony</span>
                  </div>
                  <span className="text-[var(--muted)] whitespace-nowrap">Switched off</span>
                </div>
                <div className="p-4 rounded-[11px] bg-[var(--surface2)] flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-[var(--heading)] block">Matrimony scope</span>
                    <span className="text-[var(--muted)]">Shows long-term partnership prompts &amp; primary 4:5 portrait</span>
                  </div>
                  <span className="font-semibold text-[var(--heading)] whitespace-nowrap">✓ Visible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. UNIFIED MEMBERSHIP + FINAL CTA */}
      <section className="py-12 md:py-16" id="membership">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-[660px]">
            <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
              Unified membership · Pilot research phase
            </p>
            <h2
              className="font-serif-editorial text-[var(--heading)] font-semibold mt-2 mb-2"
              style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.1rem)', lineHeight: 1.06, textWrap: 'balance' }}
            >
              One membership across all four spaces.
            </h2>
            <p className="text-base text-[var(--muted)]">
              We never charge separately for Friendship, Dating, Matrimony, or Cofounders, and safety protections are never paywalled. All pilot memberships are completely complimentary—Indian payment gateway integrations (Razorpay &amp; Cashfree) are architected for commercial launch.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[var(--surface2)] border border-[var(--line)] rounded-[9px] self-start">
            <button
              type="button"
              onClick={() => setPricingDisplayMode('illustrative')}
              className={`px-3.5 py-2 text-xs rounded-[7px] transition-colors cursor-pointer whitespace-nowrap ${pricingDisplayMode === 'illustrative'
                ? 'bg-[var(--surface)] text-[var(--heading)] font-bold'
                : 'text-[var(--muted)]'
                }`}
            >
              Illustrative pricing
            </button>
            <button
              type="button"
              onClick={() => setPricingDisplayMode('coming-soon')}
              className={`px-3.5 py-2 text-xs rounded-[7px] transition-colors cursor-pointer whitespace-nowrap ${pricingDisplayMode === 'coming-soon'
                ? 'bg-[var(--surface)] text-[var(--heading)] font-bold'
                : 'text-[var(--muted)]'
                }`}
            >
              Coming soon view
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {[
            {
              name: 'Free Member',
              audience: 'Effort-to-Discovery (Earn matches by answering)',
              priceText: '₹0 · Always Free',
              cadence: 'Available across Friendship, Dating, Matrimony & Cofounders',
              badge: 'EFFORT-BASED',
              features: [
                'Complete 60-question psychometric bank 100% free',
                'Earn 3–10 daily curated matches by answering reflections',
                'Similar to Me discovery lens and basic reflection note',
                'Per-intention photo visibility and DPDP erasure always free',
              ],
            },
            {
              name: '1-Month Explorer',
              audience: 'No-rush companion discovery for 30 days',
              priceText: pricingDisplayMode === 'illustrative' ? '₹499 / month' : 'Coming soon',
              cadence: 'Single upfront pass · No auto-renewals',
              features: [
                'Full 12-domain dimensional radar & harmony breakdown',
                'All 3 discovery lenses (Similar, Different, Balance)',
                'Unlimited profile discovery (no daily match cap)',
                '150-char personalized introductory notes',
              ],
            },
            {
              name: '3-Month Pacing',
              audience: 'The natural relationship incubation window',
              priceText: pricingDisplayMode === 'illustrative' ? '₹999 (₹333 / mo)' : 'Coming soon',
              cadence: 'Billed once quarterly · Save 33%',
              badge: 'MOST POPULAR',
              features: [
                'Everything in Explorer with unhurried 90-day pacing',
                'Full conflict repair, social battery & circadian sync',
                'Unlimited Community Circle RSVPs and city filters',
                'Optimal window to build real human understanding',
              ],
            },
            {
              name: '1-Year All-Access Journey',
              audience: '365 days across Friendship, Dating & Matrimony (Unhurried)',
              priceText: pricingDisplayMode === 'illustrative' ? '₹2,499 (₹208 / mo)' : 'Coming soon',
              cadence: 'Annual pass (Save 58%) · Or 6 Mo for ₹1,599',
              badge: '365-DAY PASS · BEST VALUE',
              features: [
                'Complete access across all 3 intentions: Friendship, Dating & Matrimony',
                'All 4 Pre-Marriage Alignment Kits & In-law boundary guides included',
                'Strict Intention Isolation: Zero awkward marriage overlap in Friendship',
                'Verified Serious-Intent Badge (displayed only within Matrimony scope)',
              ],
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-[var(--surface)] border rounded-[15px] p-6 flex flex-col justify-between ${tier.badge === 'MOST POPULAR'
                ? 'border-[var(--ochre-text)] shadow-md ring-1 ring-[var(--ochre-text)]'
                : 'border-[var(--line)]'
                }`}
            >
              {tier.badge && (
                <span className="absolute -top-2.5 right-4 bg-[var(--ochre-text)] text-[#09121C] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                  {tier.badge}
                </span>
              )}
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)]">
                    {tier.name}
                  </h3>
                </div>
                <p className="text-xs text-[var(--muted)] mt-1 min-h-[32px]">{tier.audience}</p>
                <p className="text-lg font-bold text-[var(--primary)] mt-3 tabular-nums">
                  {tier.priceText}
                </p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">{tier.cadence}</p>

                <ul className="mt-4 space-y-2 text-xs text-[var(--text)]">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[var(--ochre-text)] mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigatePath('/pricing')}
                className="mt-6 w-full rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] py-3 text-sm font-bold transition-colors cursor-pointer min-h-[44px]"
              >
                Compare membership plans
              </button>
            </div>
          ))}
        </div>

        {/* 7. FREQUENTLY ASKED QUESTIONS */}
        <div className="mb-12 pt-10 border-t border-[var(--line)]" id="faq">
          <div className="max-w-[680px] mb-6">
            <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
              Common questions
            </p>
            <h2
              className="font-serif-editorial text-[var(--heading)] font-semibold mt-2"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.08 }}
            >
              Clear answers before you begin.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'Can people in Dating or Matrimony see my Friendship profile?',
                a: 'No. Each intention has its own visibility switch and photo permissions. If you only enable Friendship, your profile and photos never appear in Dating or Matrimony searches.',
              },
              {
                q: 'Does Kithra use AI to score or rank people?',
                a: 'Never. Kithra uses your direct questionnaire answers to highlight shared habits (Similar to Me), honest differences (Different from Me), and complementary strengths (We Balance Each Other). There are no AI twins or artificial soulmate scores.',
              },
              {
                q: 'Do I have to answer all 100 questions before meeting people?',
                a: 'Not at all. You can start with a handful of questions during onboarding and continue answering across the five themes whenever you have a quiet moment.',
              },
              {
                q: 'Do I need separate subscriptions for Friendship, Dating, and Matrimony?',
                a: 'No. One unified membership covers your entire account across whichever intentions you choose to enable, and core safety and privacy controls are always free.',
              },
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between gap-3 text-left cursor-pointer"
                  >
                    <span className="text-base font-bold text-[var(--heading)]">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--muted)] shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <p className="text-sm text-[var(--muted)] leading-relaxed mt-3 pt-3 border-t border-[var(--line)]">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-[580px]">
            <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
              Begin at your own pace
            </p>
            <h2 className="font-serif-editorial text-[34px] md:text-[42px] leading-[1.05] font-semibold text-[var(--heading)] mt-2">
              Choose the intention that fits your life today.
            </h2>
            <p className="text-base text-[var(--muted)] mt-2">
              Start with Friendship, Dating, or Matrimony—or preview the member experience directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigatePath('/join')}
              className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] border border-[var(--primary)] px-5 py-3.5 text-sm font-bold hover:brightness-105 transition-all cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              Get started
            </button>
            <button
              type="button"
              onClick={() => onNavigatePath('/member/home')}
              className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-3.5 text-sm font-bold transition-colors cursor-pointer whitespace-nowrap min-h-[44px]"
            >
              Explore member home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

interface AuthViewProps extends PublicNavigateProps {
  initialMode: 'signin' | 'join' | 'recover' | 'verify-email' | 'locked';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode, onNavigatePath }) => {
  const [mode, setMode] = useState<'signin' | 'join' | 'recover' | 'verify-email' | 'locked'>(
    initialMode
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(true);
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Live Firebase authentication active (project: kithra-d3ae1). Sign in or create an account with email and password.'
  );

  React.useEffect(() => {
    setMode(initialMode);
    setErrors({});
  }, [initialMode]);

  const switchAuthRoute = (nextMode: 'signin' | 'join' | 'recover' | 'verify-email' | 'locked') => {
    setMode(nextMode);
    setErrors({});
    const pathMap: Record<typeof nextMode, string> = {
      signin: '/signin',
      join: '/join',
      recover: '/forgot-password',
      'verify-email': '/verify-email',
      locked: '/locked',
    };
    onNavigatePath(pathMap[nextMode]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'verify-email') {
      if (verificationCode.trim().length < 6) {
        setErrors({ code: 'Please enter the 6-digit verification code.' });
        return;
      }
      setErrors({});
      setStatusMessage(
        'Email verified. You may proceed to your Onboarding profile.'
      );
      setTimeout(() => onNavigatePath('/onboarding'), 600);
      return;
    }

    if (mode === 'locked') {
      return;
    }

    const validation = validateAuthForm({
      mode,
      email,
      password,
      fullName,
      city,
    });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      if (mode === 'recover') {
        setStatusMessage(`Sending password reset email to ${email}...`);
        await resetPasswordWithFirebase(email);
        setStatusMessage(
          `Password reset instructions dispatched to ${email}. Please check your inbox and spam folder.`
        );
      } else if (mode === 'join') {
        setStatusMessage(`Creating your account in Firebase project kithra-d3ae1...`);
        const { user } = await registerMemberWithFirebase(email, password);
        setStatusMessage(
          `Account successfully created for ${user.email ?? email}! Redirecting to Intention Onboarding...`
        );
        setTimeout(() => {
          onNavigatePath('/onboarding');
        }, 800);
      } else {
        // P0.1 Security Fix: Test accounts are strictly restricted to local dev builds
        const allowDevTestAccounts =
          import.meta.env.DEV &&
          (import.meta.env.VITE_ENABLE_LOCAL_TEST_ACCOUNTS === 'true' || import.meta.env.MODE === 'development');

        if (allowDevTestAccounts) {
          const normalizedEmail = email.trim().toLowerCase();
          if (normalizedEmail === 'founder@kithra.in' && password === 'KithraFounder2026!') {
            setStatusMessage('Authenticated as Founder & CEO (Dev Test)! Redirecting to Command Center...');
            setTimeout(() => onNavigatePath('/admin/overview'), 500);
            return;
          }
          if (normalizedEmail === 'admin@kithra.in' && password === 'KithraSecureAdmin2026!') {
            setStatusMessage('Authenticated as Operations Admin (Dev Test)! Redirecting to Command Center...');
            setTimeout(() => onNavigatePath('/admin/overview'), 500);
            return;
          }
          if (normalizedEmail === 'free.tester@kithra.in' && password === 'KithraFree2026!') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
              window.sessionStorage.setItem('kithra_active_member_id', 'member-kavya');
              window.localStorage.setItem('kithra_tier_member-kavya', 'free');
            }
            setStatusMessage('Authenticated as Free Member (Dev Test)! Entering Kithra...');
            setTimeout(() => onNavigatePath('/member/discover'), 500);
            return;
          }
          if (normalizedEmail === 'paid.plus@kithra.in' && password === 'KithraPlus2026!') {
            if (typeof window !== 'undefined' && window.sessionStorage) {
              window.sessionStorage.setItem('kithra_active_member_id', 'member-aarav');
              window.localStorage.setItem('kithra_tier_member-aarav', 'plus_quarterly');
            }
            setStatusMessage('Authenticated as Paid Plus Member (Dev Test)! Entering Kithra...');
            setTimeout(() => onNavigatePath('/member/discover'), 500);
            return;
          }
          if ((normalizedEmail === 'annual.member@kithra.in' || normalizedEmail === 'matrimony.vip@kithra.in') &&
            (password === 'KithraAnnual2026!' || password === 'KithraVip2026!')) {
            if (typeof window !== 'undefined' && window.sessionStorage) {
              window.sessionStorage.setItem('kithra_active_member_id', 'member-meera');
              window.localStorage.setItem('kithra_tier_member-meera', 'matrimony_annual');
            }
            setStatusMessage('Authenticated as 1-Year Pass Member (Dev Test)! Entering Kithra...');
            setTimeout(() => onNavigatePath('/member/discover'), 500);
            return;
          }
        }

        setStatusMessage(`Authenticating with Firebase...`);
        const { user } = await loginMemberWithFirebase(email, password);
        const uid = user.uid || (user.email ? user.email.replace(/[^a-zA-Z0-9_-]/g, '_') : 'member-user');
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem('kithra_active_member_id', uid);
          window.sessionStorage.setItem('kithra_firebase_uid', user.uid);
        }

        // P0.2 Invariant: Check if onboarding & age verification are completed
        const existingProfile = memberStore.getMemberById(uid);
        const isAdultOk = existingProfile?.eligibility?.isAdultVerified === true;
        const hasConsent = existingProfile?.eligibility?.discoveryConsentGiven === true;

        if (!existingProfile || !isAdultOk || !hasConsent) {
          setStatusMessage(
            `Authenticated as ${user.email ?? email}! Please complete your 18+ age declaration and spaces setup.`
          );
          setTimeout(() => onNavigatePath('/onboarding'), 600);
        } else {
          setStatusMessage(
            `Authenticated as ${user.email ?? email}! Entering member workspace...`
          );
          setTimeout(() => onNavigatePath('/member/home'), 600);
        }
      }
    } catch (err: any) {
      let msg = err?.message || 'Authentication failed. Please check credentials.';
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/user-not-found' ||
        err?.code === 'auth/wrong-password'
      ) {
        msg = 'Invalid email or password. Please verify your credentials or create a new account.';
      } else if (err?.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please sign in instead.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 8 characters.';
      } else if (err?.code === 'auth/operation-not-allowed') {
        msg =
          'Email/Password provider is not yet enabled in your Firebase Console. Please open Firebase Console > Authentication > Sign-in method and enable Email/Password.';
      }
      setErrors({ form: msg });
      setStatusMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-10 md:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[600px]">
        {/* Editorial Quote / Portrait Column */}
        <div className="lg:col-span-6">
          <div className="relative h-[240px] sm:h-[320px] lg:h-[550px] rounded-[16px] overflow-hidden">
            <EditorialImage
              variant="auth-quote"
              alt="Quiet evening veranda conversation"
              aspectClass="w-full h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#09121C]/85 via-[#09121C]/30 to-transparent flex items-end p-6 sm:p-9">
                <blockquote className="font-serif-editorial text-white text-[28px] sm:text-[36px] lg:text-[42px] leading-[1.06] font-medium max-w-[390px] m-0">
                  Every good connection starts somewhere.
                </blockquote>
              </div>
            </EditorialImage>
          </div>
        </div>

        {/* Dedicated Form Column */}
        <div className="lg:col-span-6">
          <div className="max-w-[440px] mx-auto w-full px-1">
            <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
              Welcome to Kithra
            </p>
            <h1 className="font-serif-editorial text-[42px] sm:text-[50px] leading-[1.02] font-semibold text-[var(--heading)] mt-1">
              {mode === 'signin'
                ? 'Good to see you.'
                : mode === 'join'
                  ? 'Begin at your pace.'
                  : mode === 'recover'
                    ? 'Reset your password.'
                    : mode === 'verify-email'
                      ? 'Check your inbox.'
                      : 'Account access paused.'}
            </h1>
            <p className="text-base text-[var(--muted)] mt-2 mb-6">
              {mode === 'signin'
                ? 'A calm place to begin, at your own pace.'
                : mode === 'join'
                  ? 'One account for Friendship, Dating, and Matrimony—with separate visibility.'
                  : mode === 'recover'
                    ? 'Enter the email address associated with your Kithra profile.'
                    : mode === 'verify-email'
                      ? 'Enter the 6-digit verification code to confirm your email address (Simulated UI state).'
                      : 'For your safety, sign-in attempts on this account are temporarily paused after repeated unsuccessful tries.'}
            </p>

            {/* Primary Mode Tabs */}
            <div
              role="tablist"
              aria-label="Account access mode"
              className="flex flex-wrap items-center gap-1 p-1 bg-[var(--surface2)] border border-[var(--line)] rounded-[9px] mb-5"
            >
              {(
                [
                  { id: 'signin', label: 'Sign in' },
                  { id: 'join', label: 'Join' },
                  { id: 'recover', label: 'Forgot password' },
                  { id: 'verify-email', label: 'Verify email' },
                  { id: 'locked', label: 'Locked state' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.id}
                  onClick={() => switchAuthRoute(tab.id)}
                  className={`flex-1 py-2 px-2 text-xs rounded-[7px] transition-colors cursor-pointer whitespace-nowrap min-h-[38px] ${mode === tab.id
                    ? 'bg-[var(--surface)] text-[var(--heading)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--heading)]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {mode === 'locked' ? (
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-[var(--danger)] mt-0.5 shrink-0" />
                      <div>
                        <h2 className="text-base font-bold text-[var(--heading)]">
                          Temporary cooldown active (30 minutes)
                        </h2>
                        <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                          To protect member accounts from automated credential guessing, sign-in is paused briefly. You can reset your password or return to sign in once the cooldown finishes.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => switchAuthRoute('recover')}
                        className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[44px]"
                      >
                        Reset password
                      </button>
                      <button
                        type="button"
                        onClick={() => switchAuthRoute('signin')}
                        className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[44px]"
                      >
                        Back to sign in
                      </button>
                    </div>
                  </div>
                ) : mode === 'verify-email' ? (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--line)]">
                      <div className="flex items-center gap-2 text-sm font-bold text-[var(--heading)] mb-2">
                        <MailCheck className="w-4 h-4 text-[var(--ochre-text)]" />
                        <span>Verification code (Simulated)</span>
                      </div>
                      <label
                        htmlFor="auth-verify-code"
                        className="block text-sm font-bold text-[var(--heading)] mb-1.5"
                      >
                        6-digit code
                      </label>
                      <input
                        id="auth-verify-code"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="e.g. 482910"
                        className="w-full h-[48px] bg-[var(--bg)] border border-[var(--line)] text-[var(--heading)] rounded-[9px] px-3.5 text-base tracking-widest font-mono"
                      />
                      {errors.code && (
                        <p role="alert" className="text-sm text-[var(--danger)] mt-1.5">
                          {errors.code}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] py-3.5 px-4 text-sm font-bold cursor-pointer min-h-[46px]"
                    >
                      Verify code (Preview)
                    </button>
                  </form>
                ) : (
                  <>
                    {mode !== 'recover' && (
                      <>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setIsSubmitting(true);
                              setStatusMessage('Connecting to Google Identity Provider (kithra-d3ae1)...');
                              const { user } = await loginWithGoogle();
                              const uid = user.uid || (user.email ? user.email.replace(/[^a-zA-Z0-9_-]/g, '_') : 'member-google');
                              if (typeof window !== 'undefined' && window.sessionStorage) {
                                window.sessionStorage.setItem('kithra_active_member_id', uid);
                                window.sessionStorage.setItem('kithra_firebase_uid', user.uid);
                              }

                              // P0.2 Google sign-in routing invariant: lookup authenticated profile
                              const existingProfile = memberStore.getMemberById(uid);
                              const isAdultOk = existingProfile?.eligibility?.isAdultVerified === true;
                              const hasConsent = existingProfile?.eligibility?.discoveryConsentGiven === true;

                              if (!existingProfile || !isAdultOk || !hasConsent) {
                                setStatusMessage(
                                  `Authenticated via Google as ${user.displayName || user.email}! Directing to complete 18+ age assurance & spaces...`
                                );
                                setTimeout(() => onNavigatePath('/onboarding'), 600);
                              } else {
                                setStatusMessage(
                                  `Welcome back, ${user.displayName || user.email}! Entering Kithra...`
                                );
                                setTimeout(() => onNavigatePath('/member/home'), 600);
                              }
                            } catch (err: any) {
                              if (err?.code === 'auth/popup-closed-by-user') {
                                setStatusMessage('Google authentication popup closed.');
                              } else {
                                setStatusMessage(
                                  `Google sign-in status: ${err?.message || 'Ready'}`
                                );
                              }
                            } finally {
                              setIsSubmitting(false);
                            }
                          }}
                          className="w-full flex items-center justify-center gap-3 rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] py-3 px-4 text-sm font-bold transition-colors cursor-pointer min-h-[46px]"
                        >
                          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span>Continue with Google</span>
                        </button>
                        <div className="flex items-center gap-3 text-xs text-[var(--muted)] my-4">
                          <span className="flex-1 h-px bg-[var(--line)]" />
                          <span>or with email</span>
                          <span className="flex-1 h-px bg-[var(--line)]" />
                        </div>
                      </>
                    )}

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {mode === 'join' && (
                        <>
                          <div>
                            <label
                              htmlFor="auth-fullname"
                              className="block text-sm font-bold text-[var(--heading)] mb-1.5"
                            >
                              Your first name
                            </label>
                            <input
                              id="auth-fullname"
                              type="text"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="e.g. Kavya"
                              className="w-full h-[48px] bg-[var(--surface)] border border-[var(--line)] text-[var(--heading)] rounded-[9px] px-3.5 text-base"
                            />
                            {errors.fullName && (
                              <p role="alert" className="text-sm text-[var(--danger)] mt-1">
                                {errors.fullName}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="auth-city"
                              className="block text-sm font-bold text-[var(--heading)] mb-1.5"
                            >
                              Primary city
                            </label>
                            <select
                              id="auth-city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full h-[48px] bg-[var(--surface)] border border-[var(--line)] text-[var(--heading)] rounded-[9px] px-3.5 text-base"
                            >
                              <option value="Bengaluru">Bengaluru</option>
                              <option value="Chennai">Chennai</option>
                              <option value="Mumbai">Mumbai</option>
                              <option value="Hyderabad">Hyderabad</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Pune">Pune</option>
                            </select>
                          </div>
                        </>
                      )}

                      <div>
                        <label
                          htmlFor="auth-email"
                          className="block text-sm font-bold text-[var(--heading)] mb-1.5"
                        >
                          Email address
                        </label>
                        <input
                          id="auth-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="w-full h-[48px] bg-[var(--surface)] border border-[var(--line)] text-[var(--heading)] rounded-[9px] px-3.5 text-base"
                        />
                        {errors.email && (
                          <p role="alert" className="text-sm text-[var(--danger)] mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {mode !== 'recover' && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label
                              htmlFor="auth-password"
                              className="block text-sm font-bold text-[var(--heading)]"
                            >
                              Password
                            </label>
                            {mode === 'signin' && (
                              <button
                                type="button"
                                onClick={() => switchAuthRoute('recover')}
                                className="text-xs text-[var(--muted)] hover:text-[var(--heading)] hover:underline cursor-pointer"
                              >
                                Forgot password?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              id="auth-password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              autoComplete={
                                mode === 'signin' ? 'current-password' : 'new-password'
                              }
                              className="w-full h-[48px] bg-[var(--surface)] border border-[var(--line)] text-[var(--heading)] rounded-[9px] pl-3.5 pr-11 text-base"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-[7px] inline-flex items-center justify-center text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" aria-hidden="true" />
                              ) : (
                                <Eye className="w-4 h-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                          {errors.password && (
                            <p role="alert" className="text-sm text-[var(--danger)] mt-1">
                              {errors.password}
                            </p>
                          )}
                        </div>
                      )}

                      {mode === 'join' && (
                        <label className="flex items-start gap-2.5 text-xs text-[var(--muted)] cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={acceptedPolicy}
                            onChange={(e) => setAcceptedPolicy(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[var(--ochre)] shrink-0"
                          />
                          <span>
                            I agree to Kithra&apos;s community guidelines and understand that each relationship intention (Friendship, Dating, Matrimony) uses separate visibility controls.
                          </span>
                        </label>
                      )}

                      {errors.form && (
                        <div
                          role="alert"
                          className="p-3.5 rounded-[9px] bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 leading-relaxed"
                        >
                          {errors.form}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] border border-[var(--primary)] py-3.5 px-4 text-sm font-bold hover:brightness-105 transition-all cursor-pointer mt-2 min-h-[46px] disabled:opacity-50"
                      >
                        {isSubmitting
                          ? 'Communicating with Firebase...'
                          : mode === 'signin'
                            ? 'Sign in with Firebase'
                            : mode === 'join'
                              ? 'Create account with Firebase'
                              : 'Send reset instructions'}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Test Personas & Fast Switcher */}
            <div className="mt-5 p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--ochre-text)]">
                  🧪 Test Accounts &amp; Quick Passwords
                </span>
                <span className="text-[10px] bg-[var(--surface2)] text-[var(--muted)] px-2 py-0.5 rounded-full border border-[var(--line)]">
                  Click to Autofill &amp; Sign In
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Admin Founder */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('founder@kithra.in');
                    setPassword('KithraFounder2026!');
                    setMode('signin');
                    setStatusMessage('Autofilled Founder (CEO) account: founder@kithra.in');
                  }}
                  className="text-left p-2.5 rounded-lg bg-[var(--surface2)]/70 hover:border-[var(--ochre-text)] border border-[var(--line)] transition-colors cursor-pointer space-y-0.5"
                >
                  <div className="font-bold text-[var(--heading)] flex items-center justify-between">
                    <span>👑 Founder &amp; CEO</span>
                    <span className="text-[9px] text-[var(--ochre-text)] uppercase font-extrabold">CRM / BI</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">founder@kithra.in</div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">Pass: KithraFounder2026!</div>
                </button>

                {/* Operations Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@kithra.in');
                    setPassword('KithraSecureAdmin2026!');
                    setMode('signin');
                    setStatusMessage('Autofilled Operations Admin account: admin@kithra.in');
                  }}
                  className="text-left p-2.5 rounded-lg bg-[var(--surface2)]/70 hover:border-[var(--ochre-text)] border border-[var(--line)] transition-colors cursor-pointer space-y-0.5"
                >
                  <div className="font-bold text-[var(--heading)] flex items-center justify-between">
                    <span>🛡️ Operations Admin</span>
                    <span className="text-[9px] text-[var(--friend)] uppercase font-extrabold">RBAC</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">admin@kithra.in</div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">Pass: KithraSecureAdmin2026!</div>
                </button>

                {/* Free Member */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('free.tester@kithra.in');
                    setPassword('KithraFree2026!');
                    setMode('signin');
                    setStatusMessage('Autofilled Free Member: free.tester@kithra.in (Effort-Based Discovery)');
                  }}
                  className="text-left p-2.5 rounded-lg bg-[var(--surface2)]/70 hover:border-[var(--friend)] border border-[var(--line)] transition-colors cursor-pointer space-y-0.5"
                >
                  <div className="font-bold text-[var(--heading)] flex items-center justify-between">
                    <span>👤 Free Member</span>
                    <span className="text-[9px] text-[var(--friend)] uppercase font-extrabold">₹0 Effort</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">free.tester@kithra.in</div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">Pass: KithraFree2026!</div>
                </button>

                {/* Paid Plus Member */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('paid.plus@kithra.in');
                    setPassword('KithraPlus2026!');
                    setMode('signin');
                    setStatusMessage('Autofilled Paid Plus Member: paid.plus@kithra.in (3-Month Pacing)');
                  }}
                  className="text-left p-2.5 rounded-lg bg-[var(--surface2)]/70 hover:border-[var(--ochre-text)] border border-[var(--line)] transition-colors cursor-pointer space-y-0.5"
                >
                  <div className="font-bold text-[var(--heading)] flex items-center justify-between">
                    <span>⭐ Paid Plus (Quarterly)</span>
                    <span className="text-[9px] text-[var(--ochre-text)] uppercase font-extrabold">₹999</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">paid.plus@kithra.in</div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">Pass: KithraPlus2026!</div>
                </button>

                {/* 1-Year All-Access Member */}
                <button
                  type="button"
                  onClick={() => {
                    setEmail('annual.member@kithra.in');
                    setPassword('KithraAnnual2026!');
                    setMode('signin');
                    setStatusMessage('Autofilled 1-Year All-Access: annual.member@kithra.in (365-Day Pass)');
                  }}
                  className="text-left p-2.5 rounded-lg bg-[var(--surface2)]/70 hover:border-[var(--ochre-text)] border border-[var(--line)] transition-colors cursor-pointer space-y-0.5 sm:col-span-2"
                >
                  <div className="font-bold text-[var(--heading)] flex items-center justify-between">
                    <span>⭐ 1-Year All-Access Member (Annual)</span>
                    <span className="text-[9px] text-[var(--ochre-text)] uppercase font-extrabold">₹2,499 · All 3 Intentions</span>
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-mono">annual.member@kithra.in</div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">Pass: KithraAnnual2026!</div>
                </button>
              </div>
            </div>

            <div
              role="status"
              aria-live="polite"
              className="text-sm text-[var(--muted)] bg-[var(--surface2)] border border-[var(--line)] p-4 rounded-[9px] mt-5 leading-relaxed"
            >
              <p>{statusMessage}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-[var(--line)] text-xs">
                <span className="text-[var(--muted)] font-semibold">Demo states:</span>
                <button
                  type="button"
                  onClick={() => {
                    setErrors({
                      password:
                        'We could not match that email and password. Try again or reset your password.',
                    });
                    setStatusMessage(
                      'Demonstration state: Invalid credentials error shown inline above.'
                    );
                  }}
                  className="underline text-[var(--heading)] font-semibold cursor-pointer"
                >
                  Invalid credentials
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigatePath('/410')}
                  className="underline text-[var(--heading)] font-semibold cursor-pointer"
                >
                  Expired link
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigatePath('/onboarding')}
                  className="font-bold text-[var(--heading)] underline cursor-pointer"
                >
                  Onboarding
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => onNavigatePath('/member/home')}
                  className="font-bold text-[var(--heading)] underline cursor-pointer"
                >
                  Member home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const OnboardingView: React.FC<PublicNavigateProps> = ({
  onNavigatePath,
  activeIntentions,
  onToggleActiveIntention,
  pacePreference,
  onChangePacePreference,
  activeMemberId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'English',
    'Tamil',
    'Hindi',
  ]);
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [birthYear, setBirthYear] = useState('1998');
  const [discoveryConsentGiven, setDiscoveryConsentGiven] = useState(true);
  const [sampleAnswer, setSampleAnswer] = useState('opt-slow');
  const [ageError, setAgeError] = useState<string | null>(null);

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <section className="py-10 md:py-14 max-w-[820px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
            Intention onboarding · Step {step} of 5
          </p>
          <h1 className="font-serif-editorial text-[36px] sm:text-[46px] leading-[1.04] font-semibold text-[var(--heading)] mt-1">
            {step === 1
              ? 'One account. Four independent spaces.'
              : step === 2
                ? 'Where are you based, and which languages feel like home?'
                : step === 3
                  ? 'Visibility permissions & conversational pace.'
                  : step === 4
                    ? 'Optional photo setup & 4:5 crop rules.'
                    : 'Short reflection preview.'}
          </h1>
        </div>
        <div
          className="flex items-center gap-1.5 shrink-0"
          role="group"
          aria-label={`Onboarding step ${step} of 5`}
        >
          {[1, 2, 3, 4, 5].map((idx) => {
            const isCompleted = idx < step;
            const isCurrent = idx === step;
            return (
              <button
                key={idx}
                type="button"
                disabled={idx > step}
                onClick={() => {
                  if (idx <= step) {
                    setStep(idx as 1 | 2 | 3 | 4 | 5);
                  }
                }}
                aria-label={`Onboarding step ${idx} of 5${isCurrent ? ' (current)' : isCompleted ? ' (completed)' : ' (locked)'}`}
                className={`relative h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ochre)] ${
                  isCurrent
                    ? 'w-8 bg-[var(--ochre)]'
                    : isCompleted
                      ? 'w-3 bg-[var(--ochre)]/60 hover:bg-[var(--ochre)] cursor-pointer'
                      : 'w-2.5 bg-[var(--line)] cursor-not-allowed opacity-40'
                }`}
              >
                {/* 44x44px touch target padding under WCAG 2.2 AA & Fitts's Law */}
                <span className="absolute -inset-3" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="onb-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <p className="text-base text-[var(--muted)]">
              Enable one space or more. Dating, Matrimony, Friendship, and Cofounders stay strictly separate—there is no automatic crossover of profile visibility or personal disclosures.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(['friendship', 'dating', 'matrimony', 'cofounders'] as ExtendedIntentionId[]).map((intentKey) => {
                const info = INTENTION_METADATA[intentKey];
                const isSelected = activeIntentions.includes(intentKey);
                return (
                  <button
                    key={intentKey}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => onToggleActiveIntention(intentKey)}
                    className={`text-left rounded-[15px] p-5 border transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${isSelected
                      ? 'bg-[var(--surface)] border-[var(--heading)] ring-1 ring-[var(--heading)]'
                      : 'bg-[var(--surface)]/65 border-[var(--line)] opacity-85 hover:opacity-100'
                      }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className="w-7 h-[5px] rounded-[3px]"
                          style={{ backgroundColor: info.colorVar }}
                        />
                        <span className="text-xs font-bold text-[var(--heading)]">
                          {isSelected ? '✓ Enabled' : 'Enable'}
                        </span>
                      </div>
                      <h2 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)]">
                        {info.label}
                      </h2>
                      <p className="text-sm text-[var(--muted)] leading-relaxed mt-2">
                        {info.shortTagline}
                      </p>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-4 pt-3 border-t border-[var(--line)]">
                      {info.boundarySummary}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="onb-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 space-y-5"
          >
            <div>
              <label
                htmlFor="onb-city"
                className="block text-sm font-bold text-[var(--heading)] mb-1.5"
              >
                Your primary city
              </label>
              <select
                id="onb-city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full max-w-[340px] h-[46px] rounded-[9px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-base"
              >
                <option value="Bengaluru">Bengaluru (ಬೆಂಗಳೂರು)</option>
                <option value="Chennai">Chennai (சென்னை)</option>
                <option value="Mumbai">Mumbai (मुंबई)</option>
                <option value="Hyderabad">Hyderabad (హೈదరాబాద్)</option>
                <option value="Delhi">Delhi (दिल्ली)</option>
                <option value="Pune">Pune (पुणे)</option>
                <option value="London / Global">London / Global</option>
              </select>
            </div>

            <div>
              <p className="text-sm font-bold text-[var(--heading)] mb-2">
                Languages you enjoy conversing in
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'English',
                  'हिन्दी (Hindi)',
                  'தமிழ் (Tamil)',
                  'ಕನ್ನಡ (Kannada)',
                  'മലയാളം (Malayalam)',
                  'తెలుగు (Telugu)',
                  'मराठी (Marathi)',
                  'اردو (Urdu)',
                ].map((lang) => {
                  const cleanKey = lang.split(' ')[0];
                  const active = selectedLanguages.includes(cleanKey);
                  return (
                    <button
                      key={lang}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleLanguage(cleanKey)}
                      className={`px-3.5 py-2 rounded-[8px] border text-sm font-medium cursor-pointer min-h-[42px] ${active
                        ? 'bg-[var(--surface2)] border-[var(--heading)] text-[var(--heading)] font-bold'
                        : 'border-[var(--line)] text-[var(--muted)]'
                        }`}
                    >
                      {active ? `✓ ${lang}` : lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Private Legal Age & DPDP Act Verification (Fail-Closed) */}
            <div className="pt-4 border-t border-[var(--line)] space-y-3">
              <p className="text-sm font-bold text-[var(--heading)]">
                Private Verification &amp; Discovery Consent (DPDP Act 2023)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="onb-birth-year" className="block text-xs font-semibold text-[var(--muted)] mb-1">
                    Year of Birth (Must be 18+)
                  </label>
                  <input
                    id="onb-birth-year"
                    type="number"
                    min="1920"
                    max={new Date().getFullYear() - 18}
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full h-[44px] rounded-[9px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="onb-adult-confirm"
                    type="checkbox"
                    checked={isAdultConfirmed}
                    onChange={(e) => setIsAdultConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--line)] text-[var(--ochre)] focus:ring-[var(--ochre)]"
                  />
                  <label htmlFor="onb-adult-confirm" className="text-xs text-[var(--muted)] leading-tight">
                    I confirm I am 18 years of age or older (verified adult status required for all spaces).
                  </label>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  id="onb-discovery-consent"
                  type="checkbox"
                  checked={discoveryConsentGiven}
                  onChange={(e) => setDiscoveryConsentGiven(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--line)] text-[var(--ochre)] focus:ring-[var(--ochre)] mt-0.5"
                />
                <label htmlFor="onb-discovery-consent" className="text-xs text-[var(--muted)] leading-tight">
                  I give explicit discovery consent for my profile to be discoverable in my enabled spaces. (Can be toggled off at any time).
                </label>
              </div>

              {ageError && (
                <p className="text-xs font-bold text-red-500 pt-1" role="alert">
                  ⚠️ {ageError}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="onb-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <p className="text-base text-[var(--muted)]">
              Choose the conversational pace note shown on your profile card, and review how visibility permissions work.
            </p>
            <div className="space-y-3">
              {[
                {
                  id: 'Reflective evening messages before meeting for coffee',
                  title: 'Unhurried letters first',
                  desc: 'Exchange a few thoughtful longer messages before scheduling a daytime coffee or walk.',
                },
                {
                  id: 'Early voice call or daytime coffee walk within two weeks',
                  title: 'Brief notes, then a calm voice call',
                  desc: 'Move from initial hello to a 15-minute phone conversation or public café meet-up early on.',
                },
                {
                  id: 'Small group Circles and community walks first',
                  title: 'Community Circles first',
                  desc: 'Prefer meeting inside hosted book walks, listening rooms, or small-table suppers.',
                },
              ].map((opt) => {
                const selected = pacePreference === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onChangePacePreference(opt.id)}
                    className={`w-full text-left p-5 rounded-[14px] border transition-colors cursor-pointer ${selected
                      ? 'bg-[var(--surface)] border-[var(--heading)]'
                      : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface2)]/40'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)]">
                        {opt.title}
                      </h2>
                      <span className="text-xs font-bold text-[var(--heading)]">
                        {selected ? '✓ Selected' : 'Select'}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mt-1">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="onb-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 space-y-4"
          >
            <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
              Your photos never cross intentions automatically.
            </h2>
            <p className="text-base text-[var(--muted)] leading-relaxed">
              In the Kithra Photo Manager, you can select a local portrait for preview, adjust its 4:5 crop with keyboard or slider controls, and toggle Friendship, Dating, and Matrimony visibility independently.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigatePath('/member/photos')}
                className="rounded-[9px] border border-[var(--line)] bg-[var(--surface2)] text-[var(--heading)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[44px]"
              >
                Open full Photo Manager now →
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="onb-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--ochre-text)]">
              Sample reflection question (1 of 100)
            </p>
            <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
              When two people see an important question differently, what helps you feel respected?
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  id: 'opt-slow',
                  label: 'Asking clarifying questions before assuming what the other person meant',
                },
                {
                  id: 'opt-pause',
                  label: 'Taking a short pause to reflect privately, then returning to talk calmly',
                },
                {
                  id: 'opt-direct',
                  label: 'Addressing the concern warmly and directly on the same day',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={sampleAnswer === opt.id}
                  onClick={() => setSampleAnswer(opt.id)}
                  className={`w-full text-left p-4 rounded-[11px] border text-sm cursor-pointer ${sampleAnswer === opt.id
                    ? 'bg-[var(--surface2)] border-[var(--heading)] font-bold text-[var(--heading)]'
                    : 'border-[var(--line)] text-[var(--text)]'
                    }`}
                >
                  {sampleAnswer === opt.id ? `✓ ${opt.label}` : opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--muted)] pt-2">
              This response helps shape qualitative Similar to Me and Different from Me notes in your enabled intentions ({activeIntentions.map((i) => INTENTION_METADATA[i].label).join(' · ')}).
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8 pt-5 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={() =>
            step > 1 ? setStep((step - 1) as 1 | 2 | 3 | 4 | 5) : onNavigatePath('/')
          }
          className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
        >
          {step > 1 ? '← Previous step' : '← Back to landing'}
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 2) {
                const parsedYear = parseInt(birthYear, 10);
                const currentYear = new Date().getFullYear();
                const isValidYear = !isNaN(parsedYear) && parsedYear >= 1920 && parsedYear <= currentYear;
                const calculatedAge = isValidYear ? currentYear - parsedYear : 0;
                if (!isValidYear || calculatedAge < 18 || !isAdultConfirmed) {
                  setAgeError(
                    calculatedAge < 18
                      ? 'Kithra is strictly for adults (18+). Underage members cannot participate in any space.'
                      : 'Please enter a valid birth year (18+) and confirm the adult declaration checkbox.'
                  );
                  return;
                }
                setAgeError(null);
              }
              setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
            }}
            className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
          >
            Next step →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const sessionUser = typeof window !== 'undefined' ? window.sessionStorage?.getItem('kithra_active_member_id') : null;
              const targetMemberId = activeMemberId || sessionUser || 'member-user';

              const parsedYear = parseInt(birthYear, 10);
              const currentYear = new Date().getFullYear();
              const isValidYear = !isNaN(parsedYear) && parsedYear >= 1920 && parsedYear <= currentYear;
              const calculatedAge = isValidYear ? currentYear - parsedYear : 0;
              const isAdult = isValidYear && calculatedAge >= 18;
              const isVerified = isAdult && isAdultConfirmed;
              const ageAssuranceStatus = (!isValidYear || calculatedAge <= 0)
                ? 'rejected_invalid'
                : !isAdult
                  ? 'rejected_underage'
                  : isVerified
                    ? 'self_declared'
                    : 'unverified';

              // P0.3 Invariant: Age declaration check fails closed on underage or unverified
              if (!isVerified) {
                alert('Adult verification required: You must be 18 years or older and confirm the legal affirmation to enter member discovery.');
                return;
              }

              // 1. Save initial starter reflection answer with measured timing
              memberStore.saveMemberAnswer(
                targetMemberId,
                'q1-deep-listening',
                sampleAnswer,
                2500
              );

              // 2. Persist onboarding profile data & adult verification state
              memberStore.upsertMemberProfile({
                id: targetMemberId,
                city: selectedCity,
                languages: selectedLanguages,
                intentions: activeIntentions,
                ageRange: `${calculatedAge}–${calculatedAge + 3}`,
                eligibility: {
                  isAdult: isVerified,
                  isAdultVerified: isVerified,
                  ageSelfDeclared: calculatedAge,
                  birthYearDeclared: parsedYear,
                  ageAssuranceStatus,
                  ageVerifiedAt: isVerified ? new Date().toISOString() : null,
                  verificationMethod: 'self_declaration_with_affirmation',
                  enabledIntentions: activeIntentions,
                  discoverableInIntentions: discoveryConsentGiven && isVerified ? activeIntentions : [],
                  discoveryConsentGiven: discoveryConsentGiven && isVerified,
                  discoveryEnabledByIntention: Object.fromEntries(
                    activeIntentions.map((i) => [i, discoveryConsentGiven && isVerified])
                  ),
                  blockedMemberIds: [],
                },
              });

              if (typeof window !== 'undefined' && window.sessionStorage) {
                window.sessionStorage.setItem('kithra_active_member_id', targetMemberId);
              }

              onNavigatePath('/member/discover');
            }}
            className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
          >
            Enter Member Discovery →
          </button>
        )}
      </div>
    </section>
  );
};

export const PricingView: React.FC<PublicNavigateProps> = ({ onNavigatePath }) => {
  return (
    <section className="py-10 md:py-14 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--line)]">
        <div className="max-w-[720px] space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--surface2)] text-[var(--ochre-text)] border border-[var(--line)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--ochre-text)]" />
            Fair, Transparent Indian Pricing · No Subscription Traps
          </span>
          <h1 className="font-serif-editorial text-[38px] sm:text-[48px] lg:text-[54px] leading-[1.04] font-semibold text-[var(--heading)]">
            Meaningful connection priced honestly for India.
          </h1>
          <p className="text-base text-[var(--muted)] leading-relaxed">
            No predatory auto-renewals, no fake surge-pricing, and no paywalls on safety or basic questions. Completing self-reflection questions unlocks daily curated matches for free. Plus members unlock deep 12-domain psychological radar breakdowns, unhurried discovery lenses, personalized introductory notes, and matrimony expectation guides.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onNavigatePath('/member/settings')}
            className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[44px] hover:opacity-95 transition-opacity"
          >
            Manage Membership in Settings →
          </button>
        </div>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <p className="text-xs uppercase tracking-[2px] font-bold text-[var(--ochre-text)]">
            Single Membership · Friendship, Dating &amp; Matrimony
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--heading)]">
            Choose your pace of connection
          </h2>
          <p className="text-sm text-[var(--muted)]">
            One membership unlocks all three intention scopes. Every tier is billed once upfront with zero hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INDIAN_PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between p-6 rounded-2xl bg-[var(--surface)] border transition-all duration-200 ${plan.isPopular
                ? 'border-[var(--ochre-text)] shadow-lg shadow-amber-900/10 ring-1 ring-[var(--ochre-text)]'
                : 'border-[var(--line)] hover:border-[var(--muted)]'
                }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--ochre-text)] text-[#09121C] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular · Sweet Spot
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--ochre-text)]">
                    {plan.billingCadence.split(' ')[0]}
                  </span>
                  {plan.savingsBadge && (
                    <span className="text-[11px] font-bold text-[var(--friend)] bg-[var(--surface2)] px-2 py-0.5 rounded-full border border-[var(--line)]">
                      {plan.savingsBadge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--heading)]">{plan.name}</h3>
                  <p className="text-xs text-[var(--muted)] mt-1 min-h-[36px]">{plan.description}</p>
                </div>

                <div className="pt-2 pb-4 border-y border-[var(--line)]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-serif font-bold text-[var(--heading)]">
                      {formatInrCurrency(plan.priceInr)}
                    </span>
                    <span className="text-xs text-[var(--muted)] font-sans">
                      {plan.id === 'kithra-membership-monthly' ? '/ month' : 'total'}
                    </span>
                  </div>
                  {plan.id !== 'kithra-membership-monthly' && (
                    <p className="text-xs text-[var(--friend)] font-medium mt-1">
                      Equivalent to {plan.billingCadence.match(/\(.*\)/)?.[0]?.replace(/[()]/g, '') || ''}
                    </p>
                  )}
                </div>

                <ul className="space-y-2 text-xs text-[var(--text)]">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--friend)] shrink-0" />
                    <span>Friendship, Dating &amp; Matrimony</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--friend)] shrink-0" />
                    <span>Full 12-domain dimensional radar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--friend)] shrink-0" />
                    <span>All 3 lenses (Similar, Different, Balance)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--friend)] shrink-0" />
                    <span>Thoughtful introductory notes</span>
                  </li>
                  {(plan.id === 'kithra-membership-halfyearly' || plan.id === 'kithra-matrimony-annual') && (
                    <li className="flex items-center gap-2 font-medium text-[var(--heading)]">
                      <Check className="w-4 h-4 text-[var(--ochre-text)] shrink-0" />
                      <span>Matrimony family expectation guides</span>
                    </li>
                  )}
                  {plan.id === 'kithra-matrimony-annual' && (
                    <li className="flex items-center gap-2 font-medium text-[var(--heading)]">
                      <Check className="w-4 h-4 text-[var(--ochre-text)] shrink-0" />
                      <span>Verified Serious-Intent Profile Badge</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="pt-6 mt-4">
                <button
                  type="button"
                  onClick={() => onNavigatePath('/member/settings')}
                  className={`w-full py-2.5 px-4 rounded-[10px] text-xs font-bold cursor-pointer transition-colors ${plan.isPopular
                    ? 'bg-[var(--ochre-text)] text-[#09121C] hover:opacity-90'
                    : 'bg-[var(--surface2)] text-[var(--heading)] hover:bg-[var(--line)] border border-[var(--line)]'
                    }`}
                >
                  Choose {plan.name.split(' ')[0]} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Free vs Plus Detailed Comparison Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-[var(--heading)]">
            Free vs Plus Capability &amp; Boundary Matrix
          </h3>
          <p className="text-xs text-[var(--muted)]">
            Transparently comparing what you earn through effort versus what unlocks with Plus.
          </p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] border-b border-[var(--line)] text-[var(--heading)]">
                  <th className="p-4 sm:p-5 font-bold w-2/5">Capability / Principle</th>
                  <th className="p-4 sm:p-5 font-bold w-3/10 text-center bg-[var(--surface2)]/80">
                    <div>Free Member</div>
                    <div className="text-[11px] font-normal text-[var(--muted)] mt-0.5">Effort-to-Discovery</div>
                  </th>
                  <th className="p-4 sm:p-5 font-bold w-3/10 text-center bg-[var(--surface)] text-[var(--primary)] border-l border-[var(--line)]">
                    <div>Plus Member</div>
                    <div className="text-[11px] font-normal text-[var(--ochre-text)] mt-0.5">From ₹208 to ₹499/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)] text-xs sm:text-sm">
                {[
                  {
                    feature: 'Psychological Questionnaires (60 candidate items)',
                    detail: 'Starter battery, adaptive follow-ups, and self-reflection items',
                    free: '100% Free · Always unlimited',
                    plus: '100% Free · Always unlimited',
                    highlight: false,
                  },
                  {
                    feature: 'Daily Curated Match Discovery',
                    detail: 'Profiles recommended based on psychological triangulation',
                    free: '3–10 profiles / day (Unlocked by answering questions)',
                    plus: 'Unlimited curated profiles',
                    highlight: true,
                  },
                  {
                    feature: 'Discovery Lenses',
                    detail: 'Viewing prospective connections from different angles',
                    free: 'Similar to Me lens only',
                    plus: 'All 3 Lenses (Similar, Different, We Balance)',
                    highlight: true,
                  },
                  {
                    feature: '12-Domain Dimensional Radar & Harmony',
                    detail: 'Circadian sync, conflict repair, social battery, financial philosophy',
                    free: 'Overall 0–100% match percentage only',
                    plus: 'Full 12-domain radar & harmony breakdown',
                    highlight: true,
                  },
                  {
                    feature: 'Thoughtful Introductory Notes',
                    detail: 'Personalized 150-character introductory note on connection requests',
                    free: 'Standard mutual connection request',
                    plus: 'Included with every request',
                    highlight: true,
                  },
                  {
                    feature: 'Matrimony & Family Alignment Guides',
                    detail: 'In-law boundaries, long-term living plans, financial harmony',
                    free: 'Starter conversation prompts',
                    plus: 'Full couple & family discussion guides',
                    highlight: false,
                  },
                  {
                    feature: 'Safety, Blocking & DPDP Section 27 Data Erasure',
                    detail: 'Permanent account and question answer deletion on request',
                    free: 'Always 100% Free (Safety is never monetized)',
                    plus: 'Always 100% Free (Safety is never monetized)',
                    highlight: false,
                  },
                ].map((row, idx) => (
                  <tr key={idx} className={row.highlight ? 'bg-[var(--surface2)]/20' : ''}>
                    <td className="p-4 sm:p-5">
                      <div className="font-semibold text-[var(--heading)]">{row.feature}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{row.detail}</div>
                    </td>
                    <td className="p-4 sm:p-5 text-center text-[var(--text)] bg-[var(--surface2)]/30">
                      {row.free}
                    </td>
                    <td className="p-4 sm:p-5 text-center font-medium text-[var(--heading)] border-l border-[var(--line)]">
                      {row.plus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Safe Simulated Billing Notice */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-5">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--heading)]">
            Truthful Pilot Mode Notice
          </h4>
          <p className="text-xs text-[var(--muted)] max-w-[680px]">
            No live payment gateway is charged in this preview build. Subscribing selects your tier label inside Member Settings and immediately activates the corresponding UI privileges for local evaluation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigatePath('/member/settings')}
          className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-xs font-bold cursor-pointer whitespace-nowrap min-h-[40px] hover:opacity-90"
        >
          Open Member Settings →
        </button>
      </div>
    </section>
  );
};
