import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ShellNavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  /** Optional count shown as a pill (expanded) or dot (collapsed). */
  badge?: number;
  /** Screen-reader text for the badge, e.g. "2 unread". */
  badgeLabel?: string;
}

export interface ShellNavGroup {
  id: string;
  label?: string;
  items: ShellNavItem[];
}

export interface TooltipHandlers {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
}

export interface ShellFooterContext {
  collapsed: boolean;
  /** Attach to any element to show an accessible tooltip while collapsed. */
  tip: (label: string) => TooltipHandlers | Record<string, never>;
}

interface AppShellProps {
  /** localStorage key used to persist the collapsed preference. */
  storageKey: string;
  /** Accessible name for the navigation landmark, e.g. "Member navigation". */
  navLabel: string;
  /** Optional suffix shown beside the wordmark, e.g. "Staff". */
  brandSuffix?: string;
  homePath: string;
  groups: ShellNavGroup[];
  activeId: string;
  onNavigate: (path: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  manualReduceMotion?: boolean;
  /** Extra content rendered at the bottom of the sidebar (e.g. account card). */
  renderSidebarFooter?: (ctx: ShellFooterContext) => React.ReactNode;
  /** Content above the nav list (e.g. a role switcher). Hidden while collapsed. */
  renderSidebarTop?: (ctx: ShellFooterContext) => React.ReactNode;
  /** Optional compact bottom navigation on small screens. A "Menu" slot is appended. */
  mobileBottomNav?: ShellNavItem[];
  /** Max width of the content column. Admin uses fluid width. */
  contentMaxWidth?: string;
  children: React.ReactNode;
}

const DESKTOP_QUERY = '(min-width: 1024px)';

function readCollapsed(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === 'collapsed';
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  AppShell                                                                   */
/* -------------------------------------------------------------------------- */

export const AppShell: React.FC<AppShellProps> = ({
  storageKey,
  navLabel,
  brandSuffix,
  homePath,
  groups,
  activeId,
  onNavigate,
  isDark,
  onToggleTheme,
  manualReduceMotion = false,
  renderSidebarFooter,
  renderSidebarTop,
  mobileBottomNav,
  contentMaxWidth = '1240px',
  children,
}) => {
  const systemReduced = useReducedMotion();
  const reduced = Boolean(systemReduced || manualReduceMotion);

  const [collapsed, setCollapsed] = useState<boolean>(() => readCollapsed(storageKey));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(
    null
  );

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closingForNavigation = useRef(false);

  // Persist preference
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? 'collapsed' : 'expanded');
    } catch {
      // storage unavailable — preference simply won't persist
    }
  }, [collapsed, storageKey]);

  // Hide tooltip when expanding
  useEffect(() => {
    if (!collapsed) setTooltip(null);
  }, [collapsed]);

  // Escape dismisses a visible tooltip (WCAG 1.4.13)
  useEffect(() => {
    if (!tooltip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTooltip(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tooltip]);

  const showTip = useCallback(
    (label: string, el: HTMLElement) => {
      if (!collapsed) return;
      const r = el.getBoundingClientRect();
      setTooltip({ label, top: r.top + r.height / 2, left: r.right + 12 });
    },
    [collapsed]
  );
  const hideTip = useCallback(() => setTooltip(null), []);

  const tip = useCallback(
    (label: string): TooltipHandlers | Record<string, never> =>
      collapsed
        ? {
            onMouseEnter: (e: React.MouseEvent<HTMLElement>) => showTip(label, e.currentTarget),
            onMouseLeave: hideTip,
            onFocus: (e: React.FocusEvent<HTMLElement>) => showTip(label, e.currentTarget),
            onBlur: hideTip,
          }
        : {},
    [collapsed, showTip, hideTip]
  );

  /* ----------------------------- Mobile drawer ---------------------------- */

  const openDrawer = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setDrawerOpen(true);
  };

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Focus management, Escape, focus trap, scroll lock
  useEffect(() => {
    if (!drawerOpen) {
      if (!closingForNavigation.current) {
        returnFocusRef.current?.focus?.();
      }
      closingForNavigation.current = false;
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const raf = window.requestAnimationFrame(() => {
      const first = drawerRef.current?.querySelector<HTMLElement>('[data-autofocus]');
      first?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeDrawer();
        return;
      }
      if (e.key !== 'Tab' || !drawerRef.current) return;
      const focusables = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [drawerOpen, closeDrawer]);

  // Close the drawer if the viewport grows to desktop
  useEffect(() => {
    const mq = window.matchMedia?.(DESKTOP_QUERY);
    if (!mq) return;
    const onChange = () => {
      if (mq.matches) setDrawerOpen(false);
    };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const navigate = (path: string) => {
    if (drawerOpen) {
      closingForNavigation.current = true;
      setDrawerOpen(false);
    }
    setTooltip(null);
    onNavigate(path);
  };

  /* ------------------------------- Nav list ------------------------------- */

  const renderNav = (compact: boolean) => (
    <ul className="flex flex-col gap-1" role="list">
      {groups.map((group, gi) => (
        <li key={group.id} className={gi > 0 ? 'mt-4' : ''}>
          {group.label &&
            (compact ? (
              <div className="mx-3 mb-2 h-px bg-[var(--line)]" aria-hidden="true" />
            ) : (
              <p className="px-3 mb-1 text-[13px] font-medium text-[var(--muted)]">
                {group.label}
              </p>
            ))}
          <ul className="flex flex-col gap-0.5" role="list" aria-label={group.label}>
            {group.items.map((item) => {
              const active = item.id === activeId;
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                    aria-current={active ? 'page' : undefined}
                    {...(compact ? tip(item.label) : {})}
                    className={`group relative flex items-center gap-3 min-h-[44px] rounded-[10px] text-[15px] transition-colors ${
                      compact ? 'justify-center px-0' : 'px-3'
                    } ${
                      active
                        ? 'bg-[var(--surface2)] text-[var(--heading)] font-semibold'
                        : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface2)]/60'
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[var(--ochre)]"
                      />
                    )}
                    <span className="relative shrink-0">
                      <Icon
                        className={`w-5 h-5 ${active ? 'text-[var(--ochre-text)]' : ''}`}
                        aria-hidden="true"
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      {compact && item.badge ? (
                        <span
                          aria-hidden="true"
                          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[var(--ochre)] ring-2 ring-[var(--surface)]"
                        />
                      ) : null}
                    </span>
                    <span className={compact ? 'sr-only' : 'flex-1 truncate'}>{item.label}</span>
                    {item.badge ? (
                      <>
                        {!compact && (
                          <span
                            aria-hidden="true"
                            className="ml-auto min-w-[22px] h-[22px] px-1.5 rounded-full bg-[var(--ochre)] text-[#1F2F46] text-xs font-semibold inline-flex items-center justify-center tabular-nums"
                          >
                            {item.badge}
                          </span>
                        )}
                        <span className="sr-only">, {item.badgeLabel ?? `${item.badge} new`}</span>
                      </>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );

  const themeToggle = (compact: boolean) => {
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    return (
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={compact ? label : undefined}
        {...(compact ? tip(label) : {})}
        className={`flex items-center gap-3 min-h-[44px] w-full rounded-[10px] text-[15px] text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface2)]/60 transition-colors cursor-pointer ${
          compact ? 'justify-center' : 'px-3'
        }`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 shrink-0" aria-hidden="true" strokeWidth={1.8} />
        ) : (
          <Moon className="w-5 h-5 shrink-0" aria-hidden="true" strokeWidth={1.8} />
        )}
        {!compact && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
      </button>
    );
  };

  const wordmark = (
    <a
      href={homePath}
      onClick={(e) => {
        e.preventDefault();
        navigate(homePath);
      }}
      className="flex items-baseline gap-2 min-w-0 rounded-[6px]"
    >
      <span className="font-serif-editorial text-[30px] leading-none font-semibold tracking-[-1px] text-[var(--heading)]">
        kithra<b className="text-[var(--ochre)]">.</b>
      </span>
      {brandSuffix && (
        <span className="text-[13px] font-semibold text-[var(--muted)] truncate">
          {brandSuffix}
        </span>
      )}
    </a>
  );

  const footerCtxDesktop: ShellFooterContext = { collapsed, tip };
  const footerCtxDrawer: ShellFooterContext = { collapsed: false, tip: () => ({}) };

  const hasBottomNav = Boolean(mobileBottomNav && mobileBottomNav.length > 0);

  return (
    <div className="min-h-screen flex bg-[var(--bg)] text-[var(--text)] font-sans-ui">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[8px] focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--heading)] focus:shadow"
      >
        Skip to content
      </a>

      {/* ---------------------------- Desktop sidebar ---------------------------- */}
      <aside
        id={`${storageKey}-sidebar`}
        aria-label={navLabel}
        data-collapsed={collapsed ? 'true' : 'false'}
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-r border-[var(--line)] bg-[var(--surface)] transition-[width] duration-200 ease-out overflow-hidden"
        style={{ width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-expanded)' }}
      >
        <div
          className={`flex items-center h-16 shrink-0 border-b border-[var(--line)] ${
            collapsed ? 'justify-center px-0' : 'justify-between pl-5 pr-3'
          }`}
        >
          {!collapsed && wordmark}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-controls={`${storageKey}-sidebar`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            {...tip('Expand sidebar')}
            className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface2)] transition-colors cursor-pointer"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" aria-hidden="true" strokeWidth={1.8} />
            ) : (
              <PanelLeftClose className="w-5 h-5" aria-hidden="true" strokeWidth={1.8} />
            )}
          </button>
        </div>

        {renderSidebarTop && !collapsed && (
          <div className="px-3 pt-4">{renderSidebarTop(footerCtxDesktop)}</div>
        )}

        <nav
          aria-label={navLabel}
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 ${collapsed ? 'px-3' : 'px-3'}`}
        >
          {renderNav(collapsed)}
        </nav>

        <div className="shrink-0 border-t border-[var(--line)] p-3 flex flex-col gap-1">
          {themeToggle(collapsed)}
          {renderSidebarFooter?.(footerCtxDesktop)}
        </div>
      </aside>

      {/* ------------------------------ Main column ------------------------------ */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile / tablet top bar */}
        <header className="lg:hidden sticky top-0 z-30 h-14 flex items-center gap-2 px-2 sm:px-4 bg-[var(--surface)]/95 backdrop-blur border-b border-[var(--line)]">
          {!hasBottomNav && (
            <button
              type="button"
              onClick={openDrawer}
              aria-expanded={drawerOpen}
              aria-controls="app-shell-drawer"
              aria-label="Open navigation"
              className="inline-flex items-center justify-center w-11 h-11 rounded-[10px] text-[var(--heading)] hover:bg-[var(--surface2)] cursor-pointer"
            >
              <Menu className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
          <div className={hasBottomNav ? 'pl-2' : ''}>{wordmark}</div>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-11 h-11 rounded-[10px] text-[var(--heading)] hover:bg-[var(--surface2)] cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Moon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className={`flex-1 outline-none px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 ${
            hasBottomNav ? 'pb-28 lg:pb-12' : 'pb-12'
          }`}
        >
          <div className="mx-auto w-full" style={{ maxWidth: contentMaxWidth }}>
            {children}
          </div>
        </main>
      </div>

      {/* ---------------------------- Mobile bottom nav ---------------------------- */}
      {hasBottomNav && (
        <nav
          aria-label="Quick navigation"
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--surface)] border-t border-[var(--line)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <ul
            className="grid h-16"
            style={{ gridTemplateColumns: `repeat(${(mobileBottomNav?.length ?? 0) + 1}, minmax(0, 1fr))` }}
            role="list"
          >
            {mobileBottomNav!.map((item) => {
              const active = item.id === activeId;
              const Icon = item.icon;
              return (
                <li key={item.id} className="flex">
                  <a
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs ${
                      active ? 'text-[var(--heading)] font-semibold' : 'text-[var(--muted)]'
                    }`}
                  >
                    <span className="relative">
                      <Icon
                        className={`w-5 h-5 ${active ? 'text-[var(--ochre-text)]' : ''}`}
                        aria-hidden="true"
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      {item.badge ? (
                        <span
                          aria-hidden="true"
                          className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[var(--ochre)] ring-2 ring-[var(--surface)]"
                        />
                      ) : null}
                    </span>
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="sr-only">, {item.badgeLabel ?? `${item.badge} new`}</span>
                    ) : null}
                  </a>
                </li>
              );
            })}
            <li className="flex">
              <button
                type="button"
                onClick={openDrawer}
                aria-expanded={drawerOpen}
                aria-controls="app-shell-drawer"
                className="flex-1 flex flex-col items-center justify-center gap-1 text-xs text-[var(--muted)] cursor-pointer"
              >
                <Menu className="w-5 h-5" aria-hidden="true" strokeWidth={1.8} />
                <span>Menu</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* ------------------------------ Mobile drawer ------------------------------ */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50" id="app-shell-drawer">
            <motion.div
              aria-hidden="true"
              onClick={closeDrawer}
              className="absolute inset-0 bg-black/45"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <motion.div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label={navLabel}
              className="absolute inset-y-0 left-0 w-[min(320px,86vw)] bg-[var(--surface)] border-r border-[var(--line)] flex flex-col shadow-xl"
              initial={reduced ? false : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reduced ? { x: '-100%', transition: { duration: 0 } } : { x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between h-16 pl-5 pr-3 border-b border-[var(--line)] shrink-0">
                {wordmark}
                <button
                  type="button"
                  data-autofocus
                  onClick={closeDrawer}
                  aria-label="Close navigation"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-[10px] text-[var(--heading)] hover:bg-[var(--surface2)] cursor-pointer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              {renderSidebarTop && (
                <div className="px-3 pt-4">{renderSidebarTop(footerCtxDrawer)}</div>
              )}
              <nav aria-label={`${navLabel} (menu)`} className="flex-1 overflow-y-auto px-3 py-4">
                {renderNav(false)}
              </nav>
              <div className="shrink-0 border-t border-[var(--line)] p-3 flex flex-col gap-1">
                {themeToggle(false)}
                {renderSidebarFooter?.(footerCtxDrawer)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------- Collapsed-mode tooltip ------------------------- */}
      {tooltip && collapsed && (
        <div
          role="tooltip"
          aria-hidden="true"
          className="hidden lg:block fixed z-[70] -translate-y-1/2 pointer-events-none rounded-[8px] bg-[var(--heading)] text-[var(--bg)] px-3 py-1.5 text-[13px] font-medium whitespace-nowrap shadow-lg"
          style={{ top: tooltip.top, left: tooltip.left }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  );
};

