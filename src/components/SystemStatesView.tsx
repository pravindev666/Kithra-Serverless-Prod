import React from 'react';
import {
  RouteInventoryItem,
  SystemErrorCode,
} from '../types/kithra';
import { ROUTE_INVENTORY } from '../data/mockFixtures';
import { EditorialImage } from './EditorialImage';

interface SystemStatesViewProps {
  activeCode: SystemErrorCode;
  isDevPreviewRoute: boolean;
  onSelectDevCode: (code: SystemErrorCode) => void;
  onNavigatePath: (path: string) => void;
}

const STATE_CATALOG: {
  code: SystemErrorCode;
  routePath: string;
  badge: string;
  title: string;
  summary: string;
  guidance: string;
  primaryCta: string;
  primaryTargetPath: string;
  secondaryCta: string;
  secondaryTargetPath: string;
}[] = [
  {
    code: 'inventory',
    routePath: '/__preview',
    badge: 'Developer QA · /__preview',
    title: 'Complete route & state directory.',
    summary:
      'Every public, member, staff, and error state implemented in the Kithra frontend shell.',
    guidance:
      'Separated from consumer navigation. Click any route row below to navigate via real browser pathname.',
    primaryCta: 'Return to landing page',
    primaryTargetPath: '/',
    secondaryCta: 'Open Member Discovery',
    secondaryTargetPath: '/member/discover',
  },
  {
    code: '404',
    routePath: '/404',
    badge: 'HTTP 404 · Page not found',
    title: 'This page appears to have moved.',
    summary:
      'The link you followed does not match an active page on Kithra, or the address was mistyped.',
    guidance:
      'You can return to the landing page, explore Member Discovery, or review unified membership.',
    primaryCta: 'Return to Kithra home',
    primaryTargetPath: '/',
    secondaryCta: 'Explore Member Discovery',
    secondaryTargetPath: '/member/discover',
  },
  {
    code: '403',
    routePath: '/403',
    badge: 'HTTP 403 · Visibility or access boundary',
    title: 'You do not have access to this view.',
    summary:
      'This profile or community Circle is restricted to a different intention mode or requires staff permissions.',
    guidance:
      'On Kithra, members control whether their profile and photos are visible in Friendship, Dating, or Matrimony.',
    primaryCta: 'Review your intention settings',
    primaryTargetPath: '/member/settings',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
  {
    code: '410',
    routePath: '/410',
    badge: 'HTTP 410 · Introduction or link expired',
    title: 'This profile or invitation is no longer available.',
    summary:
      'The member may have paused their account, changed their active intentions, or closed this Circle invitation.',
    guidance:
      'When someone steps away or switches off an intention, their shared links expire gracefully.',
    primaryCta: 'Browse active introductions',
    primaryTargetPath: '/member/discover',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
  {
    code: '429',
    routePath: '/429',
    badge: 'HTTP 429 · Unhurried pace limit',
    title: 'Let us pause for a moment.',
    summary:
      'To keep Kithra calm and prevent automated scraping or rapid-fire messaging, we pace how many actions can happen at once.',
    guidance: 'Please wait a few minutes before sending additional requests.',
    primaryCta: 'Return to your overview',
    primaryTargetPath: '/member',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
  {
    code: '500',
    routePath: '/500',
    badge: 'HTTP 500 · Unexpected server error',
    title: 'Something went wrong on our side.',
    summary:
      'Your notes and preferences are safe, but we could not complete that request right now.',
    guidance:
      'Try refreshing the view in a moment, or return to your home workspace.',
    primaryCta: 'Return to Kithra home',
    primaryTargetPath: '/',
    secondaryCta: 'Open Member Home',
    secondaryTargetPath: '/member',
  },
  {
    code: '503',
    routePath: '/503',
    badge: 'HTTP 503 · Scheduled maintenance',
    title: 'Kithra is taking a brief quiet window for updates.',
    summary:
      'We are performing scheduled maintenance and will be back shortly.',
    guidance:
      'No action is needed from you—active conversations and Circle RSVPs remain intact.',
    primaryCta: 'Return to Kithra home',
    primaryTargetPath: '/',
    secondaryCta: 'View unified membership',
    secondaryTargetPath: '/pricing',
  },
  {
    code: 'offline',
    routePath: '/offline',
    badge: 'Network · Offline state',
    title: 'You appear to be offline.',
    summary:
      'We cannot reach Kithra right now. Cached pages remain readable, and new messages will wait until your connection returns.',
    guidance: 'Check your Wi-Fi or mobile data connection and try again.',
    primaryCta: 'Return to Kithra home',
    primaryTargetPath: '/',
    secondaryCta: 'Open Member Home',
    secondaryTargetPath: '/member',
  },
  {
    code: 'empty',
    routePath: '/empty',
    badge: 'UI State · Empty collection',
    title: 'No introductions in this filter yet.',
    summary:
      'When you narrow by city, language, or intention and no profiles match yet, Kithra shows a clear, honest empty state rather than filler profiles.',
    guidance: 'Expand your city filter or explore another intention at any time.',
    primaryCta: 'Browse all intentions',
    primaryTargetPath: '/member/discover',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
  {
    code: 'loading',
    routePath: '/loading',
    badge: 'UI State · Calm skeleton loading',
    title: 'Preparing your workspace...',
    summary:
      'Demonstrates Kithra’s low-contrast, geometry-matched skeleton placeholders that prevent layout shift while loading.',
    guidance: 'No spinning wheels or jarring flashes.',
    primaryCta: 'Open loaded member workspace',
    primaryTargetPath: '/member/discover',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
  {
    code: 'image-fallback',
    routePath: '/image-error',
    badge: 'UI State · Resilient portrait fallback',
    title: 'Graceful portrait fallback state.',
    summary:
      'If a member portrait fails to load on a slow connection, Kithra renders a structured Coromandel card fallback with alt context.',
    guidance: 'Never displays a broken browser image icon.',
    primaryCta: 'Open photo management',
    primaryTargetPath: '/member/photos',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
  {
    code: 'validation',
    routePath: '/__preview',
    badge: 'UI State · Accessible form validation',
    title: 'Clear, human form validation.',
    summary:
      'Demonstrates accessible inline field errors linked via role="alert" without browser popups or cryptic codes.',
    guidance: 'Every form validates required inputs before transitioning state.',
    primaryCta: 'Test live sign-in form',
    primaryTargetPath: '/signin',
    secondaryCta: 'Return to Kithra home',
    secondaryTargetPath: '/',
  },
];

export const SystemStatesView: React.FC<SystemStatesViewProps> = ({
  activeCode,
  isDevPreviewRoute,
  onSelectDevCode,
  onNavigatePath,
}) => {
  const effectiveCode = isDevPreviewRoute
    ? activeCode
    : activeCode === 'inventory'
    ? '404'
    : activeCode;

  const currentMeta =
    STATE_CATALOG.find((item) => item.code === effectiveCode) ?? STATE_CATALOG[1];

  const handleInventoryRowOpen = (item: RouteInventoryItem) => {
    onNavigatePath(item.routePath);
  };

  return (
    <section className="py-8 md:py-12">
      {/* Developer QA Header & Switcher ONLY on /__preview */}
      {isDevPreviewRoute && (
        <div className="mb-8 bg-[var(--surface)] border border-[var(--ochre)] rounded-[16px] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                Developer-Only Design QA Route · /__preview
              </p>
              <h1
                tabIndex={-1}
                className="font-serif-editorial text-[34px] sm:text-[42px] leading-[1.04] font-semibold text-[var(--heading)] mt-1 outline-none"
              >
                Route directory & system state inspector.
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                Separated from consumer navigation per P0.1. Inspect every pathname route, error page, and UI state.
              </p>
            </div>
            <span className="self-start sm:self-auto rounded-[8px] bg-[var(--surface2)] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--ochre-text)] whitespace-nowrap">
              Excluded from consumer header
            </span>
          </div>

          <div
            role="tablist"
            aria-label="Developer state inspector tabs"
            className="flex flex-wrap gap-1.5 pt-4 border-t border-[var(--line)]"
          >
            {STATE_CATALOG.map((item) => {
              const selected = item.code === effectiveCode;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onSelectDevCode(item.code)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-[8px] text-xs transition-colors cursor-pointer whitespace-nowrap ${
                    selected
                      ? 'bg-[var(--primary)] text-[var(--on-primary)] font-bold'
                      : 'bg-[var(--surface2)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--heading)]'
                  }`}
                >
                  {item.code === 'inventory'
                    ? 'Route Directory'
                    : item.code.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ROUTE INVENTORY CHECKLIST VIEW (only on /__preview when 'inventory' selected) */}
      {isDevPreviewRoute && effectiveCode === 'inventory' ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] overflow-hidden">
          <div className="p-5 border-b border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
                Implemented Route & Screen Inventory ({ROUTE_INVENTORY.length} routes)
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)]">
                Every route and key interactive state uses real browser pathnames (`window.history.pushState`).
              </p>
            </div>
            <span className="text-xs font-bold text-[var(--ochre-text)]">
              100% Pathname Routing Coverage
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[var(--surface2)] text-[var(--muted)] text-left">
                  <th className="p-3.5 font-bold">Pathname</th>
                  <th className="p-3.5 font-bold">Shell</th>
                  <th className="p-3.5 font-bold">Screen</th>
                  <th className="p-3.5 font-bold">Key States Rendered</th>
                  <th className="p-3.5 font-bold text-right">Navigate</th>
                </tr>
              </thead>
              <tbody>
                {ROUTE_INVENTORY.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-[var(--line)] hover:bg-[var(--surface2)]/40"
                  >
                    <td className="p-3.5 font-bold text-[var(--heading)] font-mono">
                      {item.routePath}
                    </td>
                    <td className="p-3.5 text-[var(--muted)] whitespace-nowrap">
                      {item.shell}
                    </td>
                    <td className="p-3.5 font-semibold text-[var(--heading)]">
                      {item.screenName}
                    </td>
                    <td className="p-3.5 text-[var(--muted)]">
                      {item.keyStates.join(' · ')}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleInventoryRowOpen(item)}
                        className="min-h-[38px] rounded-[7px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] px-3 py-1.5 text-xs font-bold cursor-pointer whitespace-nowrap"
                      >
                        Visit {item.routePath} →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* STANDALONE GENUINE PRODUCT ERROR / SYSTEM STATE PAGE */
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-7 sm:p-10 md:p-12 max-w-[760px] mx-auto shadow-sm">
          <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
            {currentMeta.badge}
          </p>
          <h1
            tabIndex={-1}
            className="font-serif-editorial text-[36px] sm:text-[46px] leading-[1.05] font-semibold text-[var(--heading)] mt-2 outline-none"
          >
            {currentMeta.title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text)] leading-relaxed mt-3">
            {currentMeta.summary}
          </p>
          <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
            {currentMeta.guidance}
          </p>

          {/* Specialized State Previews */}
          {effectiveCode === 'loading' && (
            <div
              aria-label="Loading skeleton preview"
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="rounded-[14px] border border-[var(--line)] p-4 space-y-3"
                >
                  <div className="h-36 rounded-[10px] bg-[var(--surface2)] animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-[var(--surface2)] animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-[var(--surface2)] animate-pulse" />
                  <div className="h-3 w-5/6 rounded bg-[var(--surface2)] animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {effectiveCode === 'image-fallback' && (
            <div className="mt-6 max-w-[300px]">
              <EditorialImage
                variant="broken-demo"
                forceFallback={true}
                alt="Sample portrait fallback when media asset is unavailable"
                aspectClass="aspect-[4/5]"
              />
            </div>
          )}

          {effectiveCode === 'validation' && (
            <div className="mt-6 p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--line)] space-y-3 max-w-[420px]">
              <div>
                <label
                  htmlFor="demo-invalid-email"
                  className="block text-xs font-bold text-[var(--heading)] mb-1"
                >
                  Email address
                </label>
                <input
                  id="demo-invalid-email"
                  type="email"
                  readOnly
                  value="incomplete-email-address"
                  aria-invalid="true"
                  className="w-full min-h-[42px] rounded-[8px] border border-[var(--danger)] bg-[var(--surface)] text-[var(--heading)] px-3 text-xs sm:text-sm"
                />
                <p role="alert" className="text-xs text-[var(--danger)] font-semibold mt-1">
                  Enter a complete email address, such as name@example.com.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-5 border-t border-[var(--line)] flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigatePath(currentMeta.primaryTargetPath)}
              className="min-h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer hover:brightness-105 transition-all"
            >
              {currentMeta.primaryCta}
            </button>
            <button
              type="button"
              onClick={() => onNavigatePath(currentMeta.secondaryTargetPath)}
              className="min-h-[44px] rounded-[10px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
            >
              {currentMeta.secondaryCta}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
