import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Eye,
  Heart,
  Layers,
  Lock,
  Shield,
  Sliders,
  Sparkles,
  Users,
  Ban,
  Flag,
  PauseCircle,
  CheckCircle2,
  Info,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ActiveTab,
  BillingTermMonths,
  BrandPalette,
  HeroNarrativeId,
  MatchingLens,
  RelationshipMode,
  SupportedLocale,
} from '../types';
import { CANONICAL_THEMES } from '../data/questions';
import { FAQ_ITEMS } from '../data/faq';
import { HERO_NARRATIVES, LOCALE_META } from '../lib/i18n';
import { useKithraMotion } from '../lib/motion';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  palette?: BrandPalette;
  setPalette?: (palette: BrandPalette) => void;
  locale?: SupportedLocale;
  setLocale?: (locale: SupportedLocale) => void;
  onSelectModeAndEnter?: (mode: RelationshipMode) => void;
}

interface MapNodeSpec {
  id: string;
  code: string;
  label: string;
  x: number;
  y: number;
  echoBand: string;
  echoScore: number;
  counterpointBand: string;
  counterpointScore: number;
  mosaicBand: string;
  mosaicScore: number;
  sharedSummary: string;
  watchOut: string;
}

const DEMO_MAP_NODES: MapNodeSpec[] = [
  {
    id: 'n1',
    code: 'COMM',
    label: 'Communication & Repair',
    x: 200,
    y: 62,
    echoBand: 'Strong agreement',
    echoScore: 90,
    counterpointBand: 'Strong agreement',
    counterpointScore: 86,
    mosaicBand: 'Strong agreement',
    mosaicScore: 92,
    sharedSummary: 'Both prefer pausing 20 minutes during tension and repairing the same evening.',
    watchOut: 'Neither likes leaving a tense thread unread overnight.',
  },
  {
    id: 'n2',
    code: 'BOUN',
    label: 'Boundaries & Space',
    x: 318,
    y: 128,
    echoBand: 'Strong agreement',
    echoScore: 89,
    counterpointBand: 'Strong agreement',
    counterpointScore: 88,
    mosaicBand: 'Strong agreement',
    mosaicScore: 90,
    sharedSummary: 'Both protect one unscheduled evening a week and asynchronous workday focus.',
    watchOut: 'Give a heads-up when a busy sprint week lowers texting frequency.',
  },
  {
    id: 'n3',
    code: 'TIME',
    label: 'Time & Weekend Rhythm',
    x: 318,
    y: 252,
    echoBand: 'Notable agreement',
    echoScore: 76,
    counterpointBand: 'Strong agreement',
    counterpointScore: 89,
    mosaicBand: 'Strong agreement',
    mosaicScore: 93,
    sharedSummary: 'Mosaic Rule Match (RULE-PLAN-SPONT): Anchored Thursday planner pairs with gentle Saturday explorer.',
    watchOut: 'Agree on one anchor plan by Thursday and leave Sunday afternoon open.',
  },
  {
    id: 'n4',
    code: 'FIN',
    label: 'Financial Outlook',
    x: 200,
    y: 318,
    echoBand: 'Strong agreement',
    echoScore: 85,
    counterpointBand: 'Notable agreement',
    counterpointScore: 80,
    mosaicBand: 'Strong agreement',
    mosaicScore: 88,
    sharedSummary: 'Shared household budget pool paired with personal discretionary autonomy.',
    watchOut: 'Align on a clear ceiling before spontaneous travel upgrades.',
  },
  {
    id: 'n5',
    code: 'FAM',
    label: 'Family & Community',
    x: 82,
    y: 252,
    echoBand: 'Notable agreement',
    echoScore: 82,
    counterpointBand: 'Notable agreement',
    counterpointScore: 81,
    mosaicBand: 'Strong agreement',
    mosaicScore: 86,
    sharedSummary: 'Warm intergenerational ties paired with private partner-first alignment.',
    watchOut: 'Set holiday travel calendars two weeks in advance.',
  },
  {
    id: 'n6',
    code: 'VAL',
    label: 'Values & Ethics',
    x: 82,
    y: 128,
    echoBand: 'Strong agreement',
    echoScore: 92,
    counterpointBand: 'Strong agreement',
    counterpointScore: 91,
    mosaicBand: 'Strong agreement',
    mosaicScore: 91,
    sharedSummary: 'Non-negotiable alignment on everyday kindness, civic care, and mutual respect.',
    watchOut: 'Zero friction on core ethical guardrails.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  setActiveTab,
  palette = 'D2',
  setPalette,
  locale = 'EN',
  setLocale,
  onSelectModeAndEnter,
}) => {
  const { dur, easeStandard, easeEnter, shouldReduce } = useKithraMotion();

  // S0 Hero Narrative Switcher (H-B Recommended Default, H-A, H-C)
  const [heroNarrative, setHeroNarrative] = useState<HeroNarrativeId>('H-B');
  // Hero Interactive Mode Pill
  const [heroMode, setHeroMode] = useState<RelationshipMode>('dating');
  // S2 4-Step Interactive Stepper
  const [activeHowStep, setActiveHowStep] = useState<number>(0);
  // S3 Interactive Relationship Map Lens & Node
  const [activeLens, setActiveLens] = useState<MatchingLens>('echo');
  const [selectedMapNodeId, setSelectedMapNodeId] = useState<string>('n1');
  // S4 Theme Filter
  const [selectedThemeCode, setSelectedThemeCode] = useState<string>('COMM');
  // S6 Safety instant demo state (0ms)
  const [safetyDemoAction, setSafetyDemoAction] = useState<string | null>(null);
  // S7 Billing Term Switcher (1 / 3 / 6 / 12 months)
  const [billingTerm, setBillingTerm] = useState<BillingTermMonths>(1);
  // S8 FAQ Accordion
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  const currentHeroCopy =
    HERO_NARRATIVES[heroNarrative][locale] || HERO_NARRATIVES[heroNarrative].EN;
  const selectedMapNode =
    DEMO_MAP_NODES.find((n) => n.id === selectedMapNodeId) || DEMO_MAP_NODES[0];
  const selectedTheme =
    CANONICAL_THEMES.find((t) => t.code === selectedThemeCode) || CANONICAL_THEMES[0];

  const getPlusPrice = (term: BillingTermMonths) => {
    if (term === 1) return { perMonth: 149, total: 149, badge: 'Monthly' };
    if (term === 3) return { perMonth: 133, total: 399, badge: 'Save 11%' };
    if (term === 6) return { perMonth: 116, total: 699, badge: 'Save 22%' };
    return { perMonth: 99, total: 1199, badge: 'Save 33%' };
  };

  const getConnectPrice = (term: BillingTermMonths) => {
    if (term === 1) return { perMonth: 249, total: 249, badge: 'Monthly' };
    if (term === 3) return { perMonth: 216, total: 649, badge: 'Save 13%' };
    if (term === 6) return { perMonth: 199, total: 1194, badge: 'Save 20%' };
    return { perMonth: 166, total: 1999, badge: 'Save 33%' };
  };

  const plusPrice = getPlusPrice(billingTerm);
  const connectPrice = getConnectPrice(billingTerm);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] selection:bg-[var(--accent-primary-subtle)]">
      {/* =====================================================================
          S0: HERO SECTION (H-B Recommended Default + H-A & H-C Switcher)
         ===================================================================== */}
      <section className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Founder Review Bar: Narrative & Palette Live Switcher (D-04, 04A) */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] px-2">
                Hero Narrative (04A):
              </span>
              {(
                [
                  { id: 'H-B', label: 'H-B · Find Your People (Recommended)' },
                  { id: 'H-A', label: 'H-A · Three Modes, One Membership' },
                  { id: 'H-C', label: 'H-C · Compatibility With Context' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHeroNarrative(item.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                    heroNarrative === item.id
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {setPalette && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Palette:
                </span>
                {(
                  [
                    { id: 'D2', label: 'D2 Ink & Clay' },
                    { id: 'D5', label: 'D5 Forest & Sand' },
                    { id: 'D1', label: 'D1 Sunlit Humanist' },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                      palette === p.id
                        ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left 7 Columns: Editorial Copy & Dual CTAs */}
            <motion.div
              key={`${heroNarrative}-${locale}`}
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.hero, ease: easeEnter }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--accent-primary-subtle)] border border-[var(--border-subtle)] text-[var(--accent-primary)] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentHeroCopy.eyebrow}</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-[var(--text-primary)] leading-[1.1]">
                {currentHeroCopy.headline}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {currentHeroCopy.subheadline}
              </p>

              {/* Mode Preview Selector Pill */}
              <div className="pt-1">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Preview a strictly isolated relationship mode:
                </div>
                <div className="inline-flex flex-wrap gap-2 p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  {(
                    [
                      {
                        id: 'friendship',
                        symbol: '◌',
                        label: 'Friendship',
                        desc: 'Platonic circles & slow weekend rituals',
                      },
                      {
                        id: 'dating',
                        symbol: '♡',
                        label: 'Dating',
                        desc: 'Unhurried, mutual-consent dating',
                      },
                      {
                        id: 'matrimony',
                        symbol: '◇',
                        label: 'Matrimony',
                        desc: 'Adult-first life partnership',
                      },
                    ] as const
                  ).map((m) => {
                    const active = heroMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setHeroMode(m.id)}
                        className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          active
                            ? 'text-[var(--text-on-accent)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="hero-mode-pill"
                            transition={{ duration: dur.ui, ease: easeStandard }}
                            className="absolute inset-0 rounded-xl bg-[var(--accent-primary)]"
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5">
                          <span>{m.symbol}</span>
                          <span>{m.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dual Primary + Secondary CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectModeAndEnter) {
                      onSelectModeAndEnter(heroMode);
                    } else {
                      onStart();
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] font-semibold text-base shadow-sm transition-all"
                >
                  <span>{currentHeroCopy.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-default)] font-medium text-base transition-colors"
                >
                  <span>{currentHeroCopy.secondaryCta}</span>
                </button>
              </div>

              {/* Honest Trust Strip */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Zero AI twins or soulmate claims (D-01)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Separate consent per mode (D-02)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                  <span>Band + Coverage + Model v1.2 shown</span>
                </div>
              </div>
            </motion.div>

            {/* Right 5 Columns: Live Mode-Isolated Preview Card */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: dur.hero, ease: easeEnter, delay: shouldReduce ? 0 : 0.08 }}
              className="lg:col-span-5"
            >
              <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 shadow-md space-y-5">
                <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Active Pool Isolation
                    </span>
                    <div className="font-heading text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      {heroMode === 'friendship' && '◌ Friendship & Circles Pool'}
                      {heroMode === 'dating' && '♡ Intentional Dating Pool'}
                      {heroMode === 'matrimony' && '◇ Adult-Led Matrimony Pool'}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                    Consent: Active
                  </span>
                </div>

                {/* Candidate Preview with 4:5 Portrait + Honest Agreement Badge */}
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border-subtle)] relative">
                      <img
                        src={
                          heroMode === 'friendship'
                            ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80'
                            : heroMode === 'dating'
                            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
                            : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80'
                        }
                        alt="Illustrative member portrait"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 right-2 px-2 py-0.5 rounded-md bg-black/65 text-white text-[10px] font-mono text-center">
                        Illustrative image · 4:5
                      </span>
                    </div>
                  </div>

                  <div className="col-span-7 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-xl font-semibold text-[var(--text-primary)]">
                        {heroMode === 'friendship'
                          ? 'Kabir, 27'
                          : heroMode === 'dating'
                          ? 'Aarav, 29'
                          : 'Kavya, 30'}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)]">
                        {heroMode === 'friendship'
                          ? 'New Delhi'
                          : heroMode === 'dating'
                          ? 'Bengaluru'
                          : 'Kochi'}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {heroMode === 'friendship'
                        ? 'Strictly platonic creative circle: Sunday bookbinding workshops, heritage walks, and chai.'
                        : heroMode === 'dating'
                        ? 'Seeking an unhurried partnership built on calm evening repair and shared curiosity.'
                        : 'Partner-led matrimony conversation where both medical/design careers and quiet home life align.'}
                    </p>

                    {/* Mandatory Honest Score Anatomy: Band + Coverage + Model Version + Caveat */}
                    <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--accent-primary)]">
                          Strong agreement (88%)
                        </span>
                        <span className="text-[11px] font-mono text-[var(--text-muted)] tabular-nums">
                          74/100 items · v1.2
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                        <div className="h-full bg-[var(--accent-primary)] w-[74%]" />
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Agreement across compared answers, not a prediction.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mode Isolation Guarantee Pill */}
                <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">
                    Hidden from{' '}
                    {heroMode === 'friendship'
                      ? 'Dating & Matrimony'
                      : heroMode === 'dating'
                      ? 'Friendship & Matrimony'
                      : 'Friendship & Dating'}{' '}
                    unless separately enabled.
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('signup')}
                    className="font-semibold text-[var(--accent-primary)] hover:underline ml-2 shrink-0"
                  >
                    Try Mode →
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          S1: THREE RELATIONSHIP MODES (STRICT ISOLATION BY DESIGN)
         ===================================================================== */}
      <section id="modes" className="py-20 lg:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              Section S1 · Three Modes, Zero Context Collapse
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
              Friendship, Dating, and Matrimony—under one account, never mixed without consent.
            </h2>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
              Enable one, two, or all three modes. Each mode maintains its own discoverability
              consent, its own bio, its own 4:5 photo visibility ACLs, and its own candidate pool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(
              [
                {
                  mode: 'friendship' as RelationshipMode,
                  symbol: '◌',
                  title: 'Friendship & Circles',
                  badge: 'Strictly Platonic',
                  description:
                    'Find neighbourhood reading circles, makers, runners, and unhurried weekend friends without romantic ambiguity.',
                  highlights: [
                    'Opt-in local & topic Circles (max 35 members)',
                    'Zero crossover into Dating or Matrimony feeds',
                    'Per-photo visibility control for platonic connections',
                  ],
                },
                {
                  mode: 'dating' as RelationshipMode,
                  symbol: '♡',
                  title: 'Intentional Dating',
                  badge: 'Mutual Consent First',
                  description:
                    'Move past reflex swiping. Compare how you repair conflict, pace affection, and spend weekends before you chat.',
                  highlights: [
                    'Echo, Counterpoint & Mosaic Fit lenses',
                    'Shared themes & friction points named upfront',
                    'Chat opens only after mutual connection approval',
                  ],
                },
                {
                  mode: 'matrimony' as RelationshipMode,
                  symbol: '◇',
                  title: 'Adult-Led Matrimony',
                  badge: 'Autonomy + Warm Boundaries',
                  description:
                    'Built for consenting adults exploring marriage with clarity on finances, caregiving, career horizon, and family roles.',
                  highlights: [
                    'Your chats and answers stay private to you',
                    'Optional, revocable read-only summary card for family',
                    'No horoscope or caste determinism',
                  ],
                },
              ] as const
            ).map((card) => (
              <motion.div
                key={card.mode}
                whileHover={shouldReduce ? undefined : { y: -2 }}
                transition={{ duration: dur.micro, ease: easeStandard }}
                className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-7 flex flex-col justify-between space-y-6 shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-11 h-11 rounded-2xl bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)] font-heading text-2xl flex items-center justify-center">
                      {card.symbol}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {card.description}
                  </p>
                  <ul className="space-y-2.5 pt-2">
                    {card.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-[var(--text-secondary)]">
                        <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (onSelectModeAndEnter) {
                      onSelectModeAndEnter(card.mode);
                    } else {
                      setActiveTab('signup');
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] text-[var(--text-primary)] font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Explore {card.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          S2: HOW MATCHING WORKS (4-STEP DETERMINISTIC STEPPER)
         ===================================================================== */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              Section S2 · Transparent Deterministic Psychometrics
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
              How Kithra computes agreement—with zero black-box AI.
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Every score is reproducible, versioned (`model v1.2`), and grounded in the exact
              questions both people chose to answer.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              {[
                {
                  step: '01',
                  title: 'Choose your modes & independent consent',
                  summary:
                    'Turn on Friendship, Dating, or Matrimony individually. Pause or withdraw any mode in one tap.',
                },
                {
                  step: '02',
                  title: 'Answer modular questions at your own pace',
                  summary:
                    'Explore 12 everyday relationship themes. Skip any question and resume anytime—coverage is always shown honestly.',
                },
                {
                  step: '03',
                  title: 'Switch between Echo, Counterpoint & Mosaic Fit',
                  summary:
                    'See where similar habits steady you (Echo), where healthy differences spark growth (Counterpoint), or where explicit trait rules complement each other (Mosaic).',
                },
                {
                  step: '04',
                  title: 'Connect only when curiosity is mutual',
                  summary:
                    'Send a thoughtful note tied to a shared theme. 1:1 messaging opens only after both people accept.',
                },
              ].map((item, idx) => {
                const isActive = activeHowStep === idx;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setActiveHowStep(idx)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)] shadow-xs'
                        : 'bg-[var(--bg-canvas)]/60 border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                        STEP {item.step}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-mono text-[var(--text-muted)]">
                          Active Preview
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHowStep}
                  initial={shouldReduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: dur.ui, ease: easeStandard }}
                  className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-8 shadow-sm space-y-6"
                >
                  {activeHowStep === 0 && (
                    <div className="space-y-4">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                        Step 01 · Per-Mode Access Control
                      </span>
                      <h3 className="font-heading text-2xl font-semibold">
                        Your modes never bleed into each other.
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        Our eligibility engine enforces `isCandidateEligibleForMode()`: if a coworker
                        or acquaintance is in Friendship mode and you are in Dating mode, neither of
                        you will ever see that the other has Dating enabled unless both explicitly opt
                        in to the same pool.
                      </p>
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        {(['Friendship ◌', 'Dating ♡', 'Matrimony ◇'] as const).map((label, i) => (
                          <div
                            key={label}
                            className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-center space-y-1"
                          >
                            <div className="font-heading font-semibold text-sm">{label}</div>
                            <div className="text-[11px] font-mono text-[var(--accent-primary)]">
                              {i < 2 ? 'Opted In · Isolated' : 'Off · Hidden'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeHowStep === 1 && (
                    <div className="space-y-4">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                        Step 02 · Coverage Gate (&ge;50% Required)
                      </span>
                      <h3 className="font-heading text-2xl font-semibold">
                        Honest coverage instead of fake precision.
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        If two members share fewer than 50% of eligible questions in a theme, Kithra
                        refuses to invent a number and displays{' '}
                        <code className="px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] font-mono text-xs">
                          Insufficient coverage
                        </code>{' '}
                        until more items are answered.
                      </p>
                      <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                          <span>Compared Items: 68 / 100</span>
                          <span className="text-[var(--accent-primary)]">Coverage Gate: PASSED (&ge;50%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                          <div className="h-full bg-[var(--accent-primary)] w-[68%]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHowStep === 2 && (
                    <div className="space-y-4">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                        Step 03 · Three Inspectable Lenses
                      </span>
                      <h3 className="font-heading text-2xl font-semibold">
                        Similarity isn&apos;t the only way two people fit.
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1">
                          <div className="font-semibold text-sm">Echo (Similar)</div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Normalized proximity across shared items (`1 - |a - b| / 4`).
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1">
                          <div className="font-semibold text-sm">Counterpoint</div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Healthy contrast on flexible themes while core boundary guardrails align.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1">
                          <div className="font-semibold text-sm">Mosaic Fit</div>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Explicit rule table (`RULE-PLAN-SPONT`, `RULE-TALK-REFLECT`) for complementary pairs.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeHowStep === 3 && (
                    <div className="space-y-4">
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                        Step 04 · Mutual Introduction &amp; 0ms Safety
                      </span>
                      <h3 className="font-heading text-2xl font-semibold">
                        Calm introductions with instant exit controls.
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        No unsolicited media, no read-receipt pressure on free tiers, and one-tap
                        Block, Mute, or Report that executes in 0ms without confirmation friction.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          S3: INTERACTIVE RELATIONSHIP MAP DEMO (ECHO / COUNTERPOINT / MOSAIC)
         ===================================================================== */}
      <section id="relationship-map" className="py-20 lg:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
                Section S3 · Interactive Relationship Map (Declared Dimensions Only)
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
                Switch lenses to see how two real response profiles interact.
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                Click any theme node on the map below or toggle between <strong>Echo</strong>,{' '}
                <strong>Counterpoint</strong>, and <strong>Mosaic Fit</strong>.
              </p>
            </div>

            {/* Lens Segmented Control */}
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
                    className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      active
                        ? 'text-[var(--text-on-accent)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="map-lens-pill"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 6 Cols: Interactive SVG Relationship Map */}
            <div className="lg:col-span-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col items-center">
              <svg
                viewBox="0 0 400 380"
                className="w-full max-w-[380px] h-auto select-none"
                role="img"
                aria-label="Interactive 6-node relationship map across declared themes"
              >
                {/* Concentric Reference Rings */}
                <circle
                  cx="200"
                  cy="190"
                  r="130"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="200"
                  cy="190"
                  r="75"
                  fill="none"
                  stroke="var(--border-subtle)"
                />

                {/* Spokes from center to each declared theme node */}
                {DEMO_MAP_NODES.map((node) => (
                  <line
                    key={`line-${node.id}`}
                    x1={200}
                    y1={190}
                    x2={node.x}
                    y2={node.y}
                    stroke={
                      selectedMapNodeId === node.id
                        ? 'var(--accent-primary)'
                        : 'var(--border-default)'
                    }
                    strokeWidth={selectedMapNodeId === node.id ? 2.5 : 1.25}
                  />
                ))}

                {/* Center Hub */}
                <circle
                  cx="200"
                  cy="190"
                  r="28"
                  fill="var(--bg-subtle)"
                  stroke="var(--accent-primary)"
                  strokeWidth="2"
                />
                <text
                  x="200"
                  y="187"
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-[var(--text-primary)] font-bold"
                >
                  {activeLens.toUpperCase()}
                </text>
                <text
                  x="200"
                  y="200"
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-[var(--text-muted)]"
                >
                  v1.2 · 74/100
                </text>

                {/* Theme Nodes */}
                {DEMO_MAP_NODES.map((node) => {
                  const isSelected = selectedMapNodeId === node.id;
                  const score =
                    activeLens === 'echo'
                      ? node.echoScore
                      : activeLens === 'counterpoint'
                      ? node.counterpointScore
                      : node.mosaicScore;
                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedMapNodeId(node.id)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isSelected ? 26 : 22}
                        fill={
                          isSelected
                            ? 'var(--accent-primary)'
                            : 'var(--bg-Canvas, var(--bg-elevated))'
                        }
                        stroke="var(--accent-primary)"
                        strokeWidth={isSelected ? 3 : 1.75}
                      />
                      <text
                        x={node.x}
                        y={node.y - 2}
                        textAnchor="middle"
                        fill={isSelected ? 'var(--text-on-accent)' : 'var(--text-primary)'}
                        className="text-[10px] font-mono font-bold"
                      >
                        {node.code}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 10}
                        textAnchor="middle"
                        fill={isSelected ? 'var(--text-on-accent)' : 'var(--text-secondary)'}
                        className="text-[9px] font-mono"
                      >
                        {score}%
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="w-full pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                <span>Click any node (COMM, BOUN, TIME, FIN, FAM, VAL)</span>
                <span>Declared Dimensions Only</span>
              </div>
            </div>

            {/* Right 6 Cols: Node Detail Inspector */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-7 space-y-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-[var(--accent-primary)] font-semibold">
                      Theme Node · {selectedMapNode.code}
                    </span>
                    <h3 className="font-heading text-2xl font-semibold text-[var(--text-primary)]">
                      {selectedMapNode.label}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[var(--accent-primary)]">
                      {activeLens === 'echo'
                        ? `${selectedMapNode.echoBand} (${selectedMapNode.echoScore}%)`
                        : activeLens === 'counterpoint'
                        ? `${selectedMapNode.counterpointBand} (${selectedMapNode.counterpointScore}%)`
                        : `${selectedMapNode.mosaicBand} (${selectedMapNode.mosaicScore}%)`}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--text-muted)]">
                      Coverage: 12/14 items · Model v1.2
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] mb-1">
                      What aligns under {activeLens.toUpperCase()} lens
                    </div>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                      {selectedMapNode.sharedSummary}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--accent-secondary-text)] mb-1">
                      Practical conversation prompt / watch-out
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {selectedMapNode.watchOut}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--accent-primary-subtle)]/50 border border-[var(--border-subtle)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                  <Info className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Psychometric Honesty Rule (D-01):</strong> Scores summarize agreement
                    across compared self-report items. They are never predictions of relationship
                    longevity.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          S4: 12 CANONICAL QUESTION THEMES (2,400-ITEM PLACEHOLDER REGISTRY)
         ===================================================================== */}
      <section id="themes" className="py-20 lg:py-24 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
                Section S4 · 12 Canonical Themes (2,400 Registry Slots)
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
                Questions about real Tuesdays—not abstract personality tropes.
              </h2>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-mono bg-[var(--state-warning-bg)] text-[var(--state-warning)] self-start">
              Draft items — shown for illustration only (D-08)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {CANONICAL_THEMES.map((theme) => {
              const isSelected = theme.code === selectedThemeCode;
              return (
                <button
                  key={theme.code}
                  type="button"
                  onClick={() => setSelectedThemeCode(theme.code)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)] shadow-xs'
                      : 'bg-[var(--bg-canvas)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                      {theme.code}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {theme.placeholderBankSize} IDs
                    </span>
                  </div>
                  <div className="font-heading font-semibold text-sm text-[var(--text-primary)]">
                    {theme.name}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {theme.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Sample Prompt Preview Bar */}
          <div className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-[var(--accent-primary)]">
                Sample Prompt · {selectedTheme.code} ({selectedTheme.name}) · [Draft item — shown for illustration only]
              </div>
              <p className="font-heading text-lg text-[var(--text-primary)]">
                &ldquo;{selectedTheme.samplePrompt}&rdquo;
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('assessment')}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-sm font-semibold shrink-0"
            >
              Answer in Questionnaire →
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          S5: PHOTOGRAPHY STORYTELLING & PER-MODE PHOTO PRIVACY
         ===================================================================== */}
      <section className="py-20 lg:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              Section S5 · Editorial 4:5 Photography &amp; Per-Mode ACLs
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
              Warm natural light, mandatory EXIF scrubbing, and per-mode photo visibility.
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Choose whether each 4:5 portrait is <strong>Public in mode</strong>,{' '}
              <strong>Connected matches only</strong>, or <strong>Hidden</strong> independently across
              Friendship, Dating, and Matrimony—or use our warm monogram avatar mode with zero photos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
                modeLabel: 'Friendship · Public in Mode',
                title: 'Sunday Bookstore & Essay Circles',
                caption: 'Illustrative image · EXIF GPS stripped prior to upload',
              },
              {
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
                modeLabel: 'Dating · Connected Matches Only',
                title: 'Unhurried Filter-Coffee Introductions',
                caption: 'Illustrative image · Blurred until mutual consent',
              },
              {
                img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
                modeLabel: 'Matrimony · Partner-Led Privacy',
                title: 'Adult Autonomy & Warm Family Boundaries',
                caption: 'Illustrative image · Optional read-only family share link',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden shadow-xs"
              >
                <div className="aspect-[4/5] relative bg-[var(--bg-subtle)]">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono bg-black/70 text-white">
                    {card.modeLabel}
                  </span>
                </div>
                <div className="p-5 space-y-1">
                  <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                    {card.title}
                  </h3>
                  <p className="text-xs font-mono text-[var(--text-muted)]">{card.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          S6: TRUST, PRIVACY & 0MS SAFETY CONTROLS
         ===================================================================== */}
      <section id="safety" className="py-20 lg:py-24 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
                Section S6 · Zero-Delay Safety Architecture
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
                Safety controls execute in 0ms—never behind decorative animations or paywalls.
              </h2>
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                Blocking, muting, reporting, or pausing a mode bypasses all motion transitions (`0ms`)
                and immediately revokes discovery and messaging access across every mode.
              </p>
              <ul className="space-y-2.5 text-sm text-[var(--text-secondary)] pt-2">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Bidirectional block severs Friendship, Dating, and Matrimony simultaneously</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Raw quiz answers are denied to all staff roles—including superadmins (D-10)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Hash-chained audit log for every moderation or JIT evidence action</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-7 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <div className="text-xs font-mono text-[var(--text-muted)]">
                      Interactive 0ms Safety Bar Demo
                    </div>
                    <div className="font-heading text-lg font-semibold">
                      Test instant state transition (0ms motion budget)
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                    duration: 0ms
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSafetyDemoAction(
                        'MODE PAUSED (0ms): Your profile is immediately hidden from new discovery in Dating mode.'
                      )
                    }
                    className="p-3.5 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] flex flex-col items-center gap-1.5 text-xs font-semibold"
                  >
                    <PauseCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                    <span>Pause Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSafetyDemoAction(
                        'MEMBER BLOCKED (0ms): Bidirectional visibility and threads severed across all 3 modes.'
                      )
                    }
                    className="p-3.5 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--state-danger-bg)] text-[var(--state-danger)] flex flex-col items-center gap-1.5 text-xs font-semibold"
                  >
                    <Ban className="w-5 h-5" />
                    <span>Instant Block</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSafetyDemoAction(
                        'REPORT FILED (0ms): Case #KT-2045 queued for Trust & Safety with redacted message window.'
                      )
                    }
                    className="p-3.5 rounded-2xl border border-[var(--border-default)] hover:bg-[var(--state-warning-bg)] text-[var(--state-warning)] flex flex-col items-center gap-1.5 text-xs font-semibold"
                  >
                    <Flag className="w-5 h-5" />
                    <span>Report &amp; Hide</span>
                  </button>
                </div>

                {safetyDemoAction && (
                  <div
                    role="status"
                    aria-live="assertive"
                    className="p-4 rounded-xl bg-[var(--accent-primary-subtle)] border border-[var(--accent-primary)] text-xs font-mono text-[var(--text-primary)] flex items-center justify-between gap-3"
                  >
                    <span>{safetyDemoAction}</span>
                    <button
                      type="button"
                      onClick={() => setSafetyDemoAction(null)}
                      className="underline shrink-0"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          S7: UNIFIED PRICING (ARCHITECTURE C: FREE ₹0 / PLUS ₹149 / CONNECT ₹249)
         ===================================================================== */}
      <section id="pricing" className="py-20 lg:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
                Section S7 · Unified Pricing (Decision D-07 · Architecture C)
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[var(--text-primary)]">
                One honest membership across Friendship, Dating, and Matrimony.
              </h2>
              <p className="text-base text-[var(--text-secondary)]">
                No mode-specific tax, no pay-per-message coins, and no dark-pattern cancellation.
                Discovery, safety tools, and mutual messaging are free forever.
              </p>
            </div>

            {/* Term Toggle (1 / 3 / 6 / 12 Months) */}
            <div className="inline-flex p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] self-start">
              {([1, 3, 6, 12] as BillingTermMonths[]).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setBillingTerm(term)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-colors ${
                    billingTerm === term
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {term === 1 ? '1 Mo' : `${term} Mos`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Tier 1: Free */}
            <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-2xl font-semibold">Kithra Free</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                    Forever Free
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-4xl font-bold">₹0</span>
                  <span className="text-xs text-[var(--text-muted)]">/ forever</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Full access to all 3 relationship modes, core questionnaire, Echo lens, and mutual
                  messaging.
                </p>
                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Enable Friendship, Dating &amp; Matrimony</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Echo Agreement Index &amp; top shared themes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Unlimited 1:1 chat after mutual consent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>All 0ms safety controls, Block, Report &amp; Data Export</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="w-full py-3 rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] text-sm font-semibold transition-colors"
              >
                Start Free
              </button>
            </div>

            {/* Tier 2: Plus (Recommended) */}
            <div className="rounded-3xl bg-[var(--bg-elevated)] border-2 border-[var(--accent-primary)] p-7 flex flex-col justify-between space-y-6 shadow-md relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-2xl font-semibold">Kithra Plus</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--accent-primary)] text-[var(--text-on-accent)]">
                    Recommended · {plusPrice.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-4xl font-bold">₹{plusPrice.perMonth}</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    / month {billingTerm > 1 && `(₹${plusPrice.total} billed every ${billingTerm} mos)`}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Unlocks all three matching lenses, deep 12-theme breakdowns, and side-by-side
                  candidate comparison across every mode.
                </p>
                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Everything in Free across all 3 modes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Counterpoint &amp; Mosaic Fit lenses unlocked</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Full 12-theme agreement breakdown &amp; Compare view</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Join up to 5 active Friendship/Topic Circles</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('billing')}
                className="w-full py-3 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] text-sm font-semibold transition-colors"
              >
                Choose Plus — ₹{plusPrice.total}
              </button>
            </div>

            {/* Tier 3: Connect */}
            <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-2xl font-semibold">Kithra Connect</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-[var(--bg-subtle)] text-[var(--text-secondary)]">
                    {connectPrice.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono tabular-nums">
                  <span className="text-4xl font-bold">₹{connectPrice.perMonth}</span>
                  <span className="text-xs text-[var(--text-muted)]">
                    / month {billingTerm > 1 && `(₹${connectPrice.total} billed every ${billingTerm} mos)`}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Adds the Deterministic Scenario Simulator, custom Circle creation, and optional
                  revocable Matrimony family summary links.
                </p>
                <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Everything in Plus across all 3 modes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Deterministic If-Then Scenario Simulator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Create &amp; host community Circles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Revocable read-only Matrimony summary link</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('billing')}
                className="w-full py-3 rounded-xl border border-[var(--border-default)] hover:bg-[var(--bg-subtle)] text-sm font-semibold transition-colors"
              >
                Choose Connect — ₹{connectPrice.total}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          S8: HONEST FAQ ACCORDION
         ===================================================================== */}
      <section className="py-20 lg:py-24 bg-[var(--bg-subtle)] border-b border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold">
              Section S8 · Frequently Asked Questions
            </span>
            <h2 className="font-heading text-3xl font-semibold text-[var(--text-primary)]">
              Clear answers on privacy, psychometrics, and mode isolation.
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-[11px] font-mono text-[var(--accent-primary)] uppercase">
                        {faq.category}
                      </span>
                      <div className="font-heading text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                        {faq.question}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--text-muted)] shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          S9: LANGUAGES, ACCESSIBILITY & LOW-DATA SUPPORT
         ===================================================================== */}
      <section className="py-16 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
              <Globe className="w-4 h-4" />
              <span>Section S9 · Multi-Script &amp; Low-Data Ready</span>
            </div>
            <h3 className="font-heading text-2xl font-semibold">
              Designed for English + 6 Indic scripts, WCAG 2.2 AA contrast, and 2G/3G Low-Data Mode.
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Select any script below to preview localized hero typography with automatic line-height
              expansion (`1.65`) for Devanagari, Tamil, Telugu, Malayalam, Kannada, and Bengali.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {LOCALE_META.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLocale && setLocale(l.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  locale === l.code
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] border-[var(--accent-primary)]'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-default)] hover:text-[var(--text-primary)]'
                }`}
              >
                {l.nativeLabel} ({l.code})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* S10: Footer */}
      <Footer
        setActiveTab={setActiveTab}
        palette={palette}
        onSelectPalette={setPalette}
      />
    </div>
  );
};
