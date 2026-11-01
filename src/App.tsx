/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import {
  AuditLogEntry,
  CommunityCircle,
  ConversationThread,
  IntentionId,
  MemberPhoto,
  MemberProfile,
  PhotoModerationItem,
  StaffCase,
  SystemErrorCode,
} from './types/kithra';
import {
  ASSESSMENT_QUESTIONS,
  INITIAL_AUDIT_LOG,
  INITIAL_CIRCLES,
  INITIAL_CONVERSATIONS,
  INITIAL_MEMBER_PHOTOS,
  INITIAL_MEMBER_PROFILES,
  INITIAL_PHOTO_REVIEWS,
  INITIAL_STAFF_CASES,
} from './data/mockFixtures';
import {
  getPageTitleForRoute,
  ParsedRoute,
  parsePathnameToRoute,
} from './utils/kithraLogic';
import {
  AuthView,
  LandingView,
  OnboardingView,
  PricingView,
} from './components/PublicViews';
import { MemberShell } from './components/MemberViews';
import { AdminLoginView, AdminShell } from './components/AdminViews';
import { SystemStatesView } from './components/SystemStatesView';

function resolveInitialPathname(): string {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  if (params.get('autostart') === '1') {
    return '/member/discover';
  }
  const viewParam = params.get('view');
  if (viewParam === 'signin') return '/signin';
  if (viewParam === 'join') return '/join';
  if (viewParam === 'onboarding') return '/onboarding';
  if (viewParam === 'pricing') return '/pricing';
  if (viewParam === 'member') return '/member/discover';
  if (viewParam === 'admin') return '/admin/overview';
  if (viewParam === 'states') return '/__preview';
  return pathname || '/';
}

export default function App() {
  const mainRef = useRef<HTMLElement | null>(null);

  // Theme state with system preference fallback & localStorage persistence
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem('kithra-theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  // Manual reduced-motion override for accessibility & deterministic testing
  const [manualReduceMotion, setManualReduceMotion] = useState<boolean>(() => {
    try {
      const saved = window.localStorage.getItem('kithra-reduce-motion');
      if (saved === '1') return true;
      return (
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (isDark) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
    try {
      window.localStorage.setItem('kithra-theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors in restricted contexts
    }
  }, [isDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (manualReduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    try {
      window.localStorage.setItem(
        'kithra-reduce-motion',
        manualReduceMotion ? '1' : '0'
      );
    } catch {
      // ignore storage errors
    }
  }, [manualReduceMotion]);

  // Real browser pathname route state
  const [route, setRoute] = useState<ParsedRoute>(() => {
    const initialPath = resolveInitialPathname();
    if (initialPath !== window.location.pathname) {
      try {
        window.history.replaceState({}, '', initialPath);
      } catch {
        // ignore history error
      }
    }
    return parsePathnameToRoute(initialPath);
  });

  const [devStateCode, setDevStateCode] = useState<SystemErrorCode>('inventory');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [intentionFilter, setIntentionFilter] = useState<IntentionId | 'all'>('all');

  // Interactive application state
  const [activeIntentions, setActiveIntentions] = useState<IntentionId[]>([
    'friendship',
    'matrimony',
  ]);
  const [pacePreference, setPacePreference] = useState<string>(
    'Reflective evening messages before meeting for coffee'
  );
  const [profiles, setProfiles] = useState<MemberProfile[]>(INITIAL_MEMBER_PROFILES);
  const [photos, setPhotos] = useState<MemberPhoto[]>(INITIAL_MEMBER_PHOTOS);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({
    'q-pace': 'opt-slow',
    'q-disagreement': 'opt-curiosity',
  });
  const [conversations, setConversations] =
    useState<ConversationThread[]>(INITIAL_CONVERSATIONS);
  const [circles, setCircles] = useState<CommunityCircle[]>(INITIAL_CIRCLES);
  const [staffCases, setStaffCases] = useState<StaffCase[]>(INITIAL_STAFF_CASES);
  const [photoReviews, setPhotoReviews] =
    useState<PhotoModerationItem[]>(INITIAL_PHOTO_REVIEWS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Sync document title on route changes
  useEffect(() => {
    document.title = getPageTitleForRoute(route);
  }, [route]);

  // Listen to browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = parsePathnameToRoute(window.location.pathname);
      setRoute(nextRoute);
      setMobileMenuOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavigatePath = (
    targetPath: string,
    options?: { intentionFilter?: IntentionId | 'all' }
  ) => {
    if (options?.intentionFilter) {
      setIntentionFilter(options.intentionFilter);
    }
    setMobileMenuOpen(false);

    // Handle hash anchor scrolling (e.g., '/#intentions', '/#how-it-works', '/#compatibility')
    if (targetPath.startsWith('/#') || targetPath.startsWith('#')) {
      const hashId = targetPath.replace(/^\/?#/, '');
      if (route.section !== 'landing') {
        try {
          window.history.pushState({}, '', `/#${hashId}`);
        } catch {
          // ignore
        }
        const nextRoute = parsePathnameToRoute('/');
        setRoute(nextRoute);
        window.setTimeout(() => {
          const el = document.getElementById(hashId);
          if (el) {
            el.scrollIntoView({
              behavior: manualReduceMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        }, 60);
      } else {
        try {
          window.history.pushState({}, '', `/#${hashId}`);
        } catch {
          // ignore
        }
        const el = document.getElementById(hashId);
        if (el) {
          el.scrollIntoView({
            behavior: manualReduceMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      }
      return;
    }

    // Standard pathname route push
    const cleanPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
    try {
      if (window.location.pathname !== cleanPath) {
        window.history.pushState({}, '', cleanPath);
      }
    } catch {
      // ignore history errors
    }

    const nextRoute = parsePathnameToRoute(cleanPath);
    setRoute(nextRoute);
    if (nextRoute.section === 'dev-preview') {
      setDevStateCode('inventory');
    }

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    // Accessible focus restoration to primary heading
    window.requestAnimationFrame(() => {
      const heading = mainRef.current?.querySelector('h1');
      if (heading instanceof HTMLElement) {
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        heading.focus({ preventScroll: true });
      }
    });
  };

  const handleToggleActiveIntention = (intention: IntentionId) => {
    setActiveIntentions((prev) => {
      if (prev.includes(intention)) {
        return prev.length > 1 ? prev.filter((i) => i !== intention) : prev;
      }
      return [...prev, intention];
    });
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `msg-${Date.now()}`,
              sender: 'self',
              text,
              timestamp: 'Just now',
            },
          ],
        };
      })
    );
  };

  const handleToggleCircleJoin = (circleId: string) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;
        const nextJoined = !c.joined;
        return {
          ...c,
          joined: nextJoined,
          memberCount: nextJoined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1),
        };
      })
    );
  };

  const handleAppendAudit = (action: string, target: string, detail: string) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(
      2,
      '0'
    )}:${String(now.getMinutes()).padStart(2, '0')}`;
    setAuditLog((prev) => [
      {
        id: `aud-${Date.now()}`,
        timestamp: formatted,
        actor: 'Preview Reviewer (Local)',
        action,
        target,
        detail,
      },
      ...prev,
    ]);
  };

  const isMemberContext = route.section === 'member';
  const showDevPreviewLink =
    import.meta.env.DEV || import.meta.env.VITE_APP_ENV !== 'production';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      {/* Coromandel Topline */}
      <div className="topline-gradient w-full shrink-0" aria-hidden="true" />

      <div className="w-[min(1160px,calc(100%-32px))] sm:w-[min(1160px,calc(100%-48px))] mx-auto flex-1 flex flex-col">
        {/* CONSUMER HEADER (No public Design preview switcher or Staff links per P0.1 & P0.2) */}
        <header className="flex items-center justify-between gap-4 sm:gap-8 min-h-[76px] border-b border-[var(--line)]">
          {/* Zone 1: Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigatePath('/');
            }}
            className="font-serif-editorial text-[34px] sm:text-[37px] leading-[0.9] font-semibold tracking-[-1.3px] text-[var(--heading)] whitespace-nowrap shrink-0"
          >
            kithra<b className="text-[var(--ochre)]">.</b>
          </a>

          {/* Zone 2: Desktop Primary Navigation */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 lg:gap-7 text-[13px] font-semibold text-[var(--muted)]"
          >
            {isMemberContext ? (
              <>
                <a
                  href="/member"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/member');
                  }}
                  aria-current={route.memberTab === 'home' ? 'page' : undefined}
                  className={`hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0 ${
                    route.memberTab === 'home' ? 'text-[var(--heading)] font-bold' : ''
                  }`}
                >
                  Member home
                </a>
                <a
                  href="/member/discover"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/member/discover');
                  }}
                  aria-current={
                    route.memberTab === 'discover' || route.memberTab === 'match'
                      ? 'page'
                      : undefined
                  }
                  className={`hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0 ${
                    route.memberTab === 'discover' || route.memberTab === 'match'
                      ? 'text-[var(--heading)] font-bold'
                      : ''
                  }`}
                >
                  Discover
                </a>
                <a
                  href="/member/photos"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/member/photos');
                  }}
                  aria-current={route.memberTab === 'photos' ? 'page' : undefined}
                  className={`hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0 ${
                    route.memberTab === 'photos' ? 'text-[var(--heading)] font-bold' : ''
                  }`}
                >
                  Your photos
                </a>
                <a
                  href="/member/assessments"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/member/assessments');
                  }}
                  aria-current={route.memberTab === 'assessments' ? 'page' : undefined}
                  className={`hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0 ${
                    route.memberTab === 'assessments'
                      ? 'text-[var(--heading)] font-bold'
                      : ''
                  }`}
                >
                  Reflections
                </a>
                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/pricing');
                  }}
                  className="hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0"
                >
                  Membership
                </a>
              </>
            ) : (
              <>
                <a
                  href="/#intentions"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/#intentions');
                  }}
                  className="hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0"
                >
                  Intentions
                </a>
                <a
                  href="/#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/#how-it-works');
                  }}
                  className="hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0"
                >
                  How it works
                </a>
                <a
                  href="/#compatibility"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/#compatibility');
                  }}
                  className="hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0"
                >
                  Compatibility
                </a>
                <a
                  href="/pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/pricing');
                  }}
                  aria-current={route.section === 'pricing' ? 'page' : undefined}
                  className={`hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0 ${
                    route.section === 'pricing' ? 'text-[var(--heading)] font-bold' : ''
                  }`}
                >
                  Membership
                </a>
                <a
                  href="/member/discover"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/member/discover');
                  }}
                  className="hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0"
                >
                  Explore member shell
                </a>
              </>
            )}
          </nav>

          {/* Zone 3: Theme Switcher, Primary CTA & Mobile Drawer Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="min-h-[42px] rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] px-3 py-2 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[var(--ochre-text)]" aria-hidden="true" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[var(--primary)]" aria-hidden="true" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                handleNavigatePath(isMemberContext ? '/member/photos' : '/signin')
              }
              className="hidden sm:inline-flex items-center justify-center min-h-[42px] rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] border border-[var(--primary)] px-4 py-2 text-[13px] font-bold hover:brightness-105 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {isMemberContext ? 'Photo studio' : 'Sign in / Join'}
            </button>

            {/* Mobile Menu Button (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden min-h-[44px] min-w-[44px] rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)] inline-flex items-center justify-center cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        {/* RESPONSIVE MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav-drawer"
            aria-label="Mobile navigation"
            className="md:hidden bg-[var(--surface)] border-b border-[var(--line)] py-4 px-3 space-y-1.5 shadow-sm"
          >
            {[
              { label: 'Kithra Home', path: '/' },
              { label: 'Three Intentions', path: '/#intentions' },
              { label: 'How It Works', path: '/#how-it-works' },
              { label: 'Echo, Counterpoint & Mosaic Fit', path: '/#compatibility' },
              { label: 'Unified Membership & Pricing', path: '/pricing' },
              { label: 'Member Discovery Workspace', path: '/member/discover' },
              { label: 'Photo Studio & Visibility', path: '/member/photos' },
              { label: '100-Question Reflection Map', path: '/member/assessments' },
              { label: 'Sign in / Create account', path: '/signin' },
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigatePath(item.path);
                }}
                className="flex items-center justify-between min-h-[44px] px-3.5 py-2.5 rounded-[10px] text-sm font-semibold text-[var(--heading)] hover:bg-[var(--surface2)] transition-colors"
              >
                <span>{item.label}</span>
                <span className="text-xs text-[var(--muted)]" aria-hidden="true">
                  →
                </span>
              </a>
            ))}

            <div className="pt-3 mt-2 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2 px-2">
              <button
                type="button"
                onClick={() => setManualReduceMotion((prev) => !prev)}
                className="min-h-[44px] px-3 py-2 rounded-[9px] border border-[var(--line)] bg-[var(--surface2)] text-xs font-bold text-[var(--heading)] cursor-pointer"
              >
                {manualReduceMotion ? 'Reduced motion: On' : 'Reduced motion: Off'}
              </button>
              <button
                type="button"
                onClick={() => setIsDark((prev) => !prev)}
                className="min-h-[44px] px-3 py-2 rounded-[9px] border border-[var(--line)] bg-[var(--surface2)] text-xs font-bold text-[var(--heading)] cursor-pointer"
              >
                {isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
              </button>
            </div>
          </nav>
        )}

        {/* MAIN VIEWPORT */}
        <main ref={mainRef} className="flex-1">
          {route.section === 'landing' && (
            <LandingView
              onNavigatePath={handleNavigatePath}
              activeIntentions={activeIntentions}
              onToggleActiveIntention={handleToggleActiveIntention}
              pacePreference={pacePreference}
              onChangePacePreference={setPacePreference}
              manualReduceMotion={manualReduceMotion}
            />
          )}

          {(route.section === 'signin' ||
            route.section === 'join' ||
            route.section === 'recover' ||
            route.section === 'verify-email' ||
            route.section === 'locked') && (
            <AuthView
              initialMode={route.section}
              onNavigatePath={handleNavigatePath}
              activeIntentions={activeIntentions}
              onToggleActiveIntention={handleToggleActiveIntention}
              pacePreference={pacePreference}
              onChangePacePreference={setPacePreference}
              manualReduceMotion={manualReduceMotion}
            />
          )}

          {route.section === 'onboarding' && (
            <OnboardingView
              onNavigatePath={handleNavigatePath}
              activeIntentions={activeIntentions}
              onToggleActiveIntention={handleToggleActiveIntention}
              pacePreference={pacePreference}
              onChangePacePreference={setPacePreference}
              manualReduceMotion={manualReduceMotion}
            />
          )}

          {route.section === 'pricing' && (
            <PricingView
              onNavigatePath={handleNavigatePath}
              activeIntentions={activeIntentions}
              onToggleActiveIntention={handleToggleActiveIntention}
              pacePreference={pacePreference}
              onChangePacePreference={setPacePreference}
              manualReduceMotion={manualReduceMotion}
            />
          )}

          {route.section === 'member' && (
            <MemberShell
              activeTab={route.memberTab}
              matchMemberId={route.matchMemberId}
              onNavigateMemberPath={handleNavigatePath}
              intentionFilter={intentionFilter}
              onChangeIntentionFilter={setIntentionFilter}
              profiles={profiles}
              onUpdateProfiles={setProfiles}
              photos={photos}
              onUpdatePhotos={setPhotos}
              questions={ASSESSMENT_QUESTIONS}
              assessmentAnswers={assessmentAnswers}
              onSelectAssessmentAnswer={(qId, optId) =>
                setAssessmentAnswers((prev) => ({ ...prev, [qId]: optId }))
              }
              conversations={conversations}
              onSendMessage={handleSendMessage}
              circles={circles}
              onToggleCircleJoin={handleToggleCircleJoin}
              activeIntentions={activeIntentions}
              onToggleActiveIntention={handleToggleActiveIntention}
              pacePreference={pacePreference}
              onChangePacePreference={setPacePreference}
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              manualReduceMotion={manualReduceMotion}
              onToggleReduceMotion={() => setManualReduceMotion((prev) => !prev)}
            />
          )}

          {route.section === 'admin-login' && (
            <AdminLoginView onNavigatePath={handleNavigatePath} />
          )}

          {route.section === 'admin' && (
            <AdminShell
              activeTab={route.adminTab}
              onNavigateAdminPath={handleNavigatePath}
              cases={staffCases}
              onUpdateCases={setStaffCases}
              photoReviews={photoReviews}
              onUpdatePhotoReviews={setPhotoReviews}
              auditLog={auditLog}
              onAppendAudit={handleAppendAudit}
              profiles={profiles}
              circles={circles}
            />
          )}

          {(route.section === 'states' || route.section === 'dev-preview') && (
            <SystemStatesView
              activeCode={
                route.section === 'dev-preview' ? devStateCode : route.stateCode
              }
              isDevPreviewRoute={route.section === 'dev-preview'}
              onSelectDevCode={setDevStateCode}
              onNavigatePath={handleNavigatePath}
            />
          )}
        </main>

        {/* QUIET FOOTER */}
        <footer className="border-t border-[var(--line)] py-6 mt-10 text-xs text-[var(--muted)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span>© Kithra · Coromandel Indigo & Ochre</span>
            <span aria-hidden="true"> · </span>
            <span>One account · Three intentions · Frontend shell specification</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/pricing"
              onClick={(e) => {
                e.preventDefault();
                handleNavigatePath('/pricing');
              }}
              className="hover:text-[var(--heading)] hover:underline cursor-pointer"
            >
              Unified membership
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/onboarding"
              onClick={(e) => {
                e.preventDefault();
                handleNavigatePath('/onboarding');
              }}
              className="hover:text-[var(--heading)] hover:underline cursor-pointer"
            >
              Onboarding
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/member/photos"
              onClick={(e) => {
                e.preventDefault();
                handleNavigatePath('/member/photos');
              }}
              className="hover:text-[var(--heading)] hover:underline cursor-pointer"
            >
              Photo studio
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="/404"
              onClick={(e) => {
                e.preventDefault();
                handleNavigatePath('/404');
              }}
              className="hover:text-[var(--heading)] hover:underline cursor-pointer"
            >
              404 page
            </a>
            {showDevPreviewLink && (
              <>
                <span aria-hidden="true">·</span>
                <a
                  href="/__preview"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigatePath('/__preview');
                  }}
                  className="hover:text-[var(--heading)] hover:underline cursor-pointer font-mono text-[11px]"
                >
                  /__preview
                </a>
              </>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
