import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  MailCheck,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import {
  IntentionId,
  MemberTab,
  RelationshipSignalKind,
  ShellSection,
  SystemErrorCode,
} from '../types/kithra';
import {
  INTENTION_METADATA,
  SIGNAL_VOCABULARY_METADATA,
} from '../data/mockFixtures';
import { EditorialImage } from './EditorialImage';
import { KithraHero } from './KithraHero';
import { validateAuthForm } from '../utils/kithraLogic';

interface PublicNavigateProps {
  onNavigatePath: (
    path: string,
    options?: {
      intentionFilter?: IntentionId | 'all';
    }
  ) => void;
  activeIntentions: IntentionId[];
  onToggleActiveIntention: (intention: IntentionId) => void;
  pacePreference: string;
  onChangePacePreference: (pace: string) => void;
  manualReduceMotion?: boolean;
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
            Not every meaningful human connection is romantic. Kithra separates Friendship, Dating, and Matrimony so your photos and questionnaire reflections only appear in the intention you choose to enter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map((intentKey) => {
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
              body: 'Enable Friendship, Dating, or Matrimony independently. You decide which intention to browse at any time.',
              actionLabel: 'Set up your intentions →',
              onClick: () => onNavigatePath('/onboarding'),
            },
            {
              step: '02. Answer at your pace',
              body: 'Respond to thoughtful questions about daily life, communication, and values—save and return whenever you like.',
              actionLabel: 'Explore questions →',
              onClick: () => onNavigatePath('/member/assessments'),
            },
            {
              step: '03. Control photo visibility',
              body: 'Frame your portrait and choose whether each photo is visible in Friendship, Dating, or Matrimony separately.',
              actionLabel: 'Manage photos →',
              onClick: () => onNavigatePath('/member/photos'),
            },
            {
              step: '04. Explore three honest lenses',
              body: 'Review Similar to Me, Different from Me, and We Balance Each Other across the full 0–100 similarity spectrum before saying hello.',
              actionLabel: 'See compatibility example →',
              onClick: () => onNavigatePath('/member/match/member-aarav'),
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
              Unified membership · Illustrative pricing
            </p>
            <h2
              className="font-serif-editorial text-[var(--heading)] font-semibold mt-2 mb-2"
              style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.1rem)', lineHeight: 1.06, textWrap: 'balance' }}
            >
              One membership across all three intentions.
            </h2>
            <p className="text-base text-[var(--muted)]">
              We never charge separately for Friendship, Dating, and Matrimony, and safety protections are never paywalled. Figures below are illustrative preview examples only—no billing is active.
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            {
              name: 'Free',
              audience: 'For getting started at your own pace',
              priceText: pricingDisplayMode === 'illustrative' ? '₹0 · Illustrative' : 'Included at launch',
              cadence: 'Always available across all intentions',
              features: [
                'Enable Friendship, Dating, or Matrimony independently',
                'Answer 100 values and lifestyle questions at your own pace',
                'Per-intention photo visibility & safety controls',
                'Read Similar to Me, Different from Me & We Balance Each Other summaries',
              ],
            },
            {
              name: 'Plus',
              audience: 'For active community Circles & deeper filters',
              priceText:
                pricingDisplayMode === 'illustrative'
                  ? '₹650 / month · Illustrative'
                  : 'Coming soon · Pending approval',
              cadence: 'Covers all active intentions under one account',
              features: [
                'Everything in Free across all three intentions',
                'Join and RSVP to local and online Circles',
                'Extended city, neighbourhood & language filters',
                'Full Measured Alignment Details Sheet bands',
              ],
            },
            {
              name: 'Connect',
              audience: 'For dedicated partnership & Circle hosts',
              priceText:
                pricingDisplayMode === 'illustrative'
                  ? '₹1,450 / month · Illustrative'
                  : 'Coming soon · Pending approval',
              cadence: 'Optional support for serious introductions',
              features: [
                'Everything in Plus across all three intentions',
                'Priority human review for profile & photo guidelines',
                'Shared Matrimony discussion guides for couples',
                'Dedicated steward support for small Circle hosts',
              ],
            },
          ].map((tier) => (
            <div
              key={tier.name}
              className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-serif-editorial text-[32px] font-semibold text-[var(--heading)]">
                    {tier.name}
                  </h3>
                  <span className="text-xs text-[var(--muted)]">Single ladder</span>
                </div>
                <p className="text-sm text-[var(--muted)] mt-1">{tier.audience}</p>
                <p className="text-base font-bold text-[var(--heading)] mt-4 tabular-nums">
                  {tier.priceText}
                </p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{tier.cadence}</p>

                <ul className="mt-5 space-y-2.5 text-sm text-[var(--text)]">
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
  const [statusMessage, setStatusMessage] = useState<string>(
    'Demonstration mode: Sign-in, verification, and account creation states are interactive frontend previews.'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'verify-email') {
      if (verificationCode.trim().length < 6) {
        setErrors({ code: 'Please enter the 6-digit verification code.' });
        return;
      }
      setErrors({});
      setStatusMessage(
        'Simulated verification complete: No actual email or token verification occurred. You may proceed to Onboarding below.'
      );
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
    if (mode === 'recover') {
      setStatusMessage(
        `Simulated recovery state: In production, reset instructions would be sent to ${email}. No email is dispatched in this frontend preview.`
      );
    } else if (mode === 'join') {
      setStatusMessage(
        `Form validated for ${fullName} (${city}). Proceed to email verification preview or Intention Onboarding below.`
      );
    } else {
      setStatusMessage(
        `Sign-in form validated for ${email}. Authentication is not connected to a backend server yet—continue to the simulated member workspace below.`
      );
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
                          onClick={() =>
                            setStatusMessage(
                              'Google sign-in is a visual placeholder in this frontend shell. Use the links below to inspect Onboarding or the Member workspace.'
                            )
                          }
                          className="w-full rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] py-3 px-4 text-sm font-bold transition-colors cursor-pointer min-h-[46px]"
                        >
                          Continue with Google (Visual placeholder)
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

                      <button
                        type="submit"
                        className="w-full rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] border border-[var(--primary)] py-3.5 px-4 text-sm font-bold hover:brightness-105 transition-all cursor-pointer mt-2 min-h-[46px]"
                      >
                        {mode === 'signin'
                          ? 'Sign in'
                          : mode === 'join'
                            ? 'Create preview account'
                            : 'Send reset instructions'}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

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
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'English',
    'Tamil',
    'Hindi',
  ]);
  const [sampleAnswer, setSampleAnswer] = useState('opt-slow');

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
              ? 'One account. Three independent intentions.'
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
          {[1, 2, 3, 4, 5].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setStep(idx as 1 | 2 | 3 | 4 | 5)}
              aria-label={`Go to onboarding step ${idx}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${step === idx ? 'w-8 bg-[var(--ochre)]' : 'w-2.5 bg-[var(--line)]'
                }`}
            />
          ))}
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
              Enable one intention or more. Dating and Matrimony stay strictly separate from Friendship—there is no automatic crossover of profile visibility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map((intentKey) => {
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
                      <h2 className="font-serif-editorial text-[30px] font-semibold text-[var(--heading)]">
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
            onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4 | 5)}
            className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
          >
            Next step →
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onNavigatePath('/member/discover')}
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
  const [showPendingApproval, setShowPendingApproval] = useState(false);

  return (
    <section className="py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[var(--line)]">
        <div className="max-w-[680px]">
          <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
            Unified Membership · Free, Plus &amp; Connect
          </p>
          <h1 className="font-serif-editorial text-[42px] sm:text-[52px] leading-[1.03] font-semibold text-[var(--heading)] mt-2">
            Honest pricing across all three intentions.
          </h1>
          <p className="text-base text-[var(--muted)] mt-2">
            Whether you use Kithra for Friendship, Dating, Matrimony, or all three, one membership covers your account. Safety protections and visibility controls are always free.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPendingApproval((prev) => !prev)}
          className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-2.5 text-sm font-bold cursor-pointer self-start whitespace-nowrap min-h-[44px]"
        >
          {showPendingApproval ? 'Show illustrative amounts' : 'Preview "Coming soon" mode'}
        </button>
      </div>

      {/* Comparison Matrix */}
      <div className="my-8 bg-[var(--surface)] border border-[var(--line)] rounded-[16px] overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--surface2)] text-[var(--heading)] text-left">
              <th className="p-4 font-bold">Capability / Boundary</th>
              <th className="p-4 font-bold">Free ({showPendingApproval ? 'Included' : '₹0'})</th>
              <th className="p-4 font-bold">
                Plus ({showPendingApproval ? 'Coming soon' : '₹650 / mo · Illustrative'})
              </th>
              <th className="p-4 font-bold">
                Connect ({showPendingApproval ? 'Coming soon' : '₹1,450 / mo · Illustrative'})
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                feature: 'Independent Friendship, Dating & Matrimony scopes',
                free: 'Included',
                plus: 'Included',
                connect: 'Included',
              },
              {
                feature: 'Per-intention photo visibility & safety blocking/reporting',
                free: 'Always free',
                plus: 'Always free',
                connect: 'Always free',
              },
              {
                feature: '100-question reflection bank & Similar to Me / Different from Me / We Balance Each Other summaries',
                free: 'Included',
                plus: 'Included + full dimension bands',
                connect: 'Included + full dimension bands',
              },
              {
                feature: 'Community Circles RSVPs & neighbourhood filters',
                free: 'Browse & 1 starter RSVP',
                plus: 'Unlimited Circle RSVPs & extended filters',
                connect: 'Unlimited RSVPs + Circle host steward support',
              },
              {
                feature: 'Matrimony & long-term partnership discussion guides',
                free: 'Overview prompts',
                plus: 'Standard guides',
                connect: 'Full couple & family expectation guides + priority photo review',
              },
            ].map((row) => (
              <tr key={row.feature} className="border-t border-[var(--line)]">
                <td className="p-4 font-semibold text-[var(--heading)]">{row.feature}</td>
                <td className="p-4 text-[var(--text)]">{row.free}</td>
                <td className="p-4 text-[var(--text)]">{row.plus}</td>
                <td className="p-4 text-[var(--text)]">{row.connect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--surface2)] border border-[var(--line)] rounded-[12px] p-5">
        <p className="text-sm text-[var(--muted)] max-w-[680px]">
          Simulated billing notice: No payment gateway or checkout is connected in this frontend shell. Selecting any plan previews the tier label inside your local Settings tab without charging you.
        </p>
        <button
          type="button"
          onClick={() => onNavigatePath('/member/settings')}
          className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[44px]"
        >
          Open Member Settings →
        </button>
      </div>
    </section>
  );
};
