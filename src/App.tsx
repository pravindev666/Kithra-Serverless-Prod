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
  ExtendedIntentionId,
  IntentionId,
  MemberPhoto,
  MemberProfile,
  MessageItem,
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
import { KithraWordmark } from './components/KithraWordmark';
import { memberStore } from './domain/memberStore';

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
  if (viewParam === 'member') return '/member/home';
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
  const [intentionFilter, setIntentionFilter] = useState<ExtendedIntentionId | 'all'>('all');

  // Interactive application state
  const [activeMemberId, setActiveMemberId] = useState<string>(() =>
    memberStore.getActiveMemberId()
  );
  const [activeIntentions, setActiveIntentions] = useState<ExtendedIntentionId[]>([
    'friendship',
    'matrimony',
  ]);
  const [pacePreference, setPacePreference] = useState<string>(
    'Reflective evening messages before meeting for coffee'
  );
  const [profiles, setProfiles] = useState<MemberProfile[]>(() =>
    memberStore.getDynamicMatchesForActiveMember(
      memberStore.getActiveMemberId(),
      'all'
    )
  );
  const [photos, setPhotos] = useState<MemberPhoto[]>(INITIAL_MEMBER_PHOTOS);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>(() =>
    memberStore.getMemberRawAnswers(
      memberStore.getActiveMemberId(),
      'member_self',
      memberStore.getActiveMemberId()
    )
  );
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
    options?: { intentionFilter?: ExtendedIntentionId | 'all' }
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

  const handleToggleActiveIntention = (intention: ExtendedIntentionId) => {
    setActiveIntentions((prev) => {
      if (prev.includes(intention)) {
        return prev.length > 1 ? prev.filter((i) => i !== intention) : prev;
      }
      return [...prev, intention];
    });
  };

  // Sync dynamic matches whenever active member or intention filter changes
  useEffect(() => {
    const dynamicCandidates = memberStore.getDynamicMatchesForActiveMember(
      activeMemberId,
      intentionFilter
    );
    setProfiles(dynamicCandidates);
  }, [activeMemberId, intentionFilter]);

  const handleSelectAssessmentAnswer = (
    questionId: string,
    optionId: string,
    displayedOptionIndex?: number,
    latencyMs?: number
  ) => {
    // P1 Fix: Record actual measured user interaction latency (fallback to 3000ms only if untracked)
    const measuredLatency = latencyMs ?? 3000;
    memberStore.saveMemberAnswer(activeMemberId, questionId, optionId, measuredLatency, displayedOptionIndex);
    setAssessmentAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    const dynamicCandidates = memberStore.getDynamicMatchesForActiveMember(
      activeMemberId,
      intentionFilter
    );
    setProfiles(dynamicCandidates);
  };

  const handleSwitchActiveMember = (newMemberId: string) => {
    memberStore.setActiveMemberId(newMemberId);
    setActiveMemberId(newMemberId);
    const answers = memberStore.getMemberRawAnswers(
      newMemberId,
      'member_self',
      newMemberId
    );
    setAssessmentAnswers(answers);
    const dynamicCandidates = memberStore.getDynamicMatchesForActiveMember(
      newMemberId,
      intentionFilter
    );
    setProfiles(dynamicCandidates);
  };

  const handleDeleteAssessmentData = () => {
    memberStore.deleteMemberAssessmentData(activeMemberId);
    setAssessmentAnswers({});
    const dynamicCandidates = memberStore.getDynamicMatchesForActiveMember(
      activeMemberId,
      intentionFilter
    );
    setProfiles(dynamicCandidates);
  };

  const handleSendMessage = async (conversationId: string, text: string) => {
    const tempId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const optimisticMessage: MessageItem = {
      id: tempId,
      sender: 'self',
      text,
      timestamp: 'Sending...',
      deliveryStatus: 'sending',
      sentAt: Date.now(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          messages: [...conv.messages, optimisticMessage],
        };
      })
    );

    try {
      const token = localStorage.getItem('kithra_auth_token') || `dev-token-${activeMemberId}-member`;
      const res = await fetch(`/api/member/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text, idempotencyKey: tempId }),
      });

      if (res.ok) {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== conversationId) return conv;
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === tempId
                  ? { ...m, timestamp: 'Just now', deliveryStatus: 'sent' }
                  : m
              ),
            };
          })
        );
      } else {
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id !== conversationId) return conv;
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === tempId
                  ? { ...m, timestamp: 'Failed to send', deliveryStatus: 'failed' }
                  : m
              ),
            };
          })
        );
      }
    } catch {
      // Local development or simulated fallback
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv;
          return {
            ...conv,
            messages: conv.messages.map((m) =>
              m.id === tempId
                ? { ...m, timestamp: 'Just now', deliveryStatus: 'sent' }
                : m
            ),
          };
        })
      );
    }
  };

  const handleRetrySendMessage = (conversationId: string, messageId: string, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== conversationId) return conv;
        return {
          ...conv,
          messages: conv.messages.filter((m) => m.id !== messageId),
        };
      })
    );
    handleSendMessage(conversationId, text);
  };

  const handleDeleteMessage = async (conversationId: string, messageId: string, scope: 'for_me' | 'unsend') => {
    if (scope === 'unsend') {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv;
          return {
            ...conv,
            messages: conv.messages.map((m) =>
              m.id === messageId
                ? { ...m, text: '[Message un-sent by sender]', isUnsent: true, unsentAt: Date.now() }
                : m
            ),
          };
        })
      );
    } else {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== conversationId) return conv;
          return {
            ...conv,
            messages: conv.messages.filter((m) => m.id !== messageId),
          };
        })
      );
    }

    try {
      const token = localStorage.getItem('kithra_auth_token') || `dev-token-${activeMemberId}-member`;
      await fetch(`/api/member/conversations/${conversationId}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scope }),
      });
    } catch {
      // silent fallback
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    try {
      const token = localStorage.getItem('kithra_auth_token') || `dev-token-${activeMemberId}-member`;
      await fetch(`/api/member/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scope: 'for_me' }),
      });
    } catch {
      // silent fallback
    }
  };

  const handleBlockPartner = async (partnerId: string, conversationId?: string) => {
    if (conversationId) {
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    }
    memberStore.blockMember(activeMemberId, partnerId);
    setProfiles((prev) => prev.filter((p) => p.id !== partnerId));

    try {
      const token = localStorage.getItem('kithra_auth_token') || `dev-token-${activeMemberId}-member`;
      await fetch('/api/member/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetMemberId: partnerId }),
      });
    } catch {
      // silent fallback
    }
  };

  const [discoveryPaused, setDiscoveryPaused] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.localStorage?.getItem('kithra_discovery_paused') === 'true';
  });

  const handleToggleDiscoveryPause = (paused: boolean) => {
    setDiscoveryPaused(paused);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('kithra_discovery_paused', paused ? 'true' : 'false');
    }
  };

  const handleToggleCircleJoin = async (circleId: string) => {
    const target = circles.find((c) => c.id === circleId);
    if (!target) return;
    const nextJoined = !target.joined;

    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;
        return {
          ...c,
          joined: nextJoined,
          memberCount: nextJoined ? c.memberCount + 1 : Math.max(1, c.memberCount - 1),
        };
      })
    );

    try {
      const token = (typeof window !== 'undefined' && window.localStorage?.getItem('kithra_auth_token')) || `dev-token-${activeMemberId}-member`;
      const endpoint = nextJoined ? `/api/member/circles/${circleId}/join` : `/api/member/circles/${circleId}/leave`;
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // offline fallback
    }
  };

  const handleArchiveCircle = async (circleId: string, reason?: string) => {
    setCircles((prev) =>
      prev.map((c) => (c.id === circleId ? { ...c, status: 'archived' } : c))
    );

    try {
      const token = (typeof window !== 'undefined' && window.localStorage?.getItem('kithra_auth_token')) || `dev-token-${activeMemberId}-member`;
      await fetch(`/api/member/circles/${circleId}/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
    } catch {
      // offline fallback
    }
  };

  const handleWithdrawIntroduction = async (introId: string, targetMemberId: string) => {
    memberStore.withdrawIntroduction(introId, activeMemberId);
    setProfiles((prev) =>
      prev.map((p) => (p.id === targetMemberId ? { ...p, connectionState: 'discover' } : p))
    );

    try {
      const token = (typeof window !== 'undefined' && window.localStorage?.getItem('kithra_auth_token')) || `dev-token-${activeMemberId}-member`;
      await fetch(`/api/member/introductions/${introId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // offline fallback
    }
  };

  const handleDisconnectPartner = async (conversationId: string, partnerId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    setProfiles((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, connectionState: 'discover' } : p))
    );

    try {
      const token = (typeof window !== 'undefined' && window.localStorage?.getItem('kithra_auth_token')) || `dev-token-${activeMemberId}-member`;
      await fetch(`/api/member/conversations/${conversationId}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // offline fallback
    }
  };

  const handleUnblockMember = async (targetMemberId: string) => {
    memberStore.unblockMember(activeMemberId, targetMemberId);
    try {
      const token = (typeof window !== 'undefined' && window.localStorage?.getItem('kithra_auth_token')) || `dev-token-${activeMemberId}-member`;
      await fetch('/api/member/unblock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetMemberId }),
      });
    } catch {
      // offline fallback
    }
  };

  const handleProposeCircle = (newCircle: CommunityCircle) => {
    setCircles((prev) => [newCircle, ...prev]);
  };

  const handleInviteMemberToCircle = (circleId: string, memberId: string) => {
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id !== circleId) return c;
        const existing = c.invitedMemberIds || [];
        if (existing.includes(memberId)) return c;
        return { ...c, invitedMemberIds: [...existing, memberId] };
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

  const isAppWorkspace = route.section === 'member' || route.section === 'admin';
  const showDevPreviewLink =
    import.meta.env.DEV || import.meta.env.VITE_APP_ENV !== 'production';

  if (isAppWorkspace) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <div className="topline-gradient w-full shrink-0" aria-hidden="true" />
        <div ref={mainRef as React.RefObject<HTMLDivElement>} className="flex-1 flex flex-col">
          {route.section === 'member' ? (
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
              onSelectAssessmentAnswer={handleSelectAssessmentAnswer}
              conversations={conversations}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onDeleteConversation={handleDeleteConversation}
              onBlockMember={handleBlockPartner}
              onRetrySendMessage={handleRetrySendMessage}
              circles={circles}
              onToggleCircleJoin={handleToggleCircleJoin}
              onProposeCircle={handleProposeCircle}
              onInviteMemberToCircle={handleInviteMemberToCircle}
              onArchiveCircle={handleArchiveCircle}
              onWithdrawIntroduction={handleWithdrawIntroduction}
              onDisconnectPartner={handleDisconnectPartner}
              onUnblockMember={handleUnblockMember}
              discoveryPaused={discoveryPaused}
              onToggleDiscoveryPause={handleToggleDiscoveryPause}
              activeIntentions={activeIntentions}
              onToggleActiveIntention={handleToggleActiveIntention}
              pacePreference={pacePreference}
              onChangePacePreference={setPacePreference}
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              manualReduceMotion={manualReduceMotion}
              onToggleReduceMotion={() => setManualReduceMotion((prev) => !prev)}
              activeMemberId={activeMemberId}
              onSwitchActiveMember={handleSwitchActiveMember}
              onDeleteAssessmentData={handleDeleteAssessmentData}
            />
          ) : (
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
              isDark={isDark}
              onToggleTheme={() => setIsDark((prev) => !prev)}
              manualReduceMotion={manualReduceMotion}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      {/* Coromandel Topline */}
      <div className="topline-gradient w-full shrink-0" aria-hidden="true" />

      <div className="w-[min(1160px,calc(100%-32px))] sm:w-[min(1160px,calc(100%-48px))] mx-auto flex-1 flex flex-col">
        {/* CONSUMER HEADER */}
        <header className="flex items-center justify-between gap-4 sm:gap-8 min-h-[76px] border-b border-[var(--line)]">
          {/* Zone 1: Wordmark with Premium Emblem */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavigatePath('/');
            }}
            className="group flex items-center gap-2.5 sm:gap-3 font-serif-editorial text-[34px] sm:text-[37px] leading-[0.9] font-semibold tracking-[-1.3px] text-[var(--heading)] whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Kithra — Return to landing page"
          >
            <img
              src="/assets/kithra/apple-touch-icon.png"
              alt=""
              width={38}
              height={38}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] object-cover shadow-[0_2px_8px_rgba(27,21,59,0.14)] border border-[var(--ochre)]/35 ring-1 ring-[var(--line)] group-hover:scale-105 group-hover:shadow-[0_4px_12px_rgba(143,82,10,0.2)] transition-all duration-200 shrink-0"
            />
            <KithraWordmark className="leading-[0.9] tracking-[-1.3px]" />
          </a>

          {/* Zone 2: Desktop Primary Navigation */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-6 lg:gap-7 text-[13px] font-semibold text-[var(--muted)]"
          >
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
              className={`hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0 ${route.section === 'pricing' ? 'text-[var(--heading)] font-bold' : ''
                }`}
            >
              Membership
            </a>
            <a
              href="/member/home"
              onClick={(e) => {
                e.preventDefault();
                handleNavigatePath('/member/home');
              }}
              className="hover:text-[var(--heading)] transition-colors whitespace-nowrap shrink-0"
            >
              Member home
            </a>
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
              onClick={() => handleNavigatePath('/signin')}
              className="hidden sm:inline-flex items-center justify-center min-h-[42px] rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] border border-[var(--primary)] px-4 py-2 text-[13px] font-bold hover:brightness-105 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign in / Join
            </button>

            {/* Mobile Menu Button (>=44px touch target) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden min-h-[44px] min-w-[44px] rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)] inline-flex items-center justify-center cursor-pointer"
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
            className="lg:hidden bg-[var(--surface)] border-b border-[var(--line)] py-4 px-3 space-y-1.5 shadow-sm"
          >
            {[
              { label: 'Kithra Home', path: '/' },
              { label: 'Three Intentions', path: '/#intentions' },
              { label: 'How It Works', path: '/#how-it-works' },
              { label: 'Compatibility & Fit', path: '/#compatibility' },
              { label: 'Frequently Asked Questions', path: '/#faq' },
              { label: 'Membership & Pricing', path: '/pricing' },
              { label: 'Member Home', path: '/member/home' },
              { label: 'Discover People', path: '/member/discover' },
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
              activeMemberId={activeMemberId}
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

          {route.section === 'admin-login' && (
            <AdminLoginView onNavigatePath={handleNavigatePath} />
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
            <span>One account · Three intentions</span>
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
              Membership
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
              href="/member/home"
              onClick={(e) => {
                e.preventDefault();
                handleNavigatePath('/member/home');
              }}
              className="hover:text-[var(--heading)] hover:underline cursor-pointer"
            >
              Member home
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
