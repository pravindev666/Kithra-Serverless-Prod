import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Menu,
  X,
  Palette,
  Globe,
  Shield,
  Users,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ActiveTab,
  AppMode,
  BrandPalette,
  SupportedLocale,
} from '../types';
import { Wordmark } from './Wordmark';
import { LOCALE_META } from '../lib/i18n';
import { useKithraMotion } from '../lib/motion';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  palette?: BrandPalette;
  setPalette?: (palette: BrandPalette) => void;
  locale?: SupportedLocale;
  setLocale?: (locale: SupportedLocale) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  appMode,
  setAppMode,
  isDarkMode,
  setIsDarkMode,
  palette = 'D2',
  setPalette,
  locale = 'EN',
  setLocale,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dur, easeStandard } = useKithraMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: Array<{ id: string; label: string; href: string }> = [
    { id: 'modes', label: 'Modes', href: '#modes' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'relationship-map', label: 'Relationship Map', href: '#relationship-map' },
    { id: 'themes', label: '12 Themes', href: '#themes' },
    { id: 'safety', label: 'Safety', href: '#safety' },
    { id: 'pricing', label: 'Pricing', href: '#pricing' },
  ];

  const handleAnchorClick = (href: string) => {
    setMobileMenuOpen(false);
    if (activeTab !== 'landing') {
      setActiveTab('landing');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? 'h-16 bg-[var(--bg-canvas)]/92 backdrop-blur-md border-[var(--border-subtle)] shadow-xs'
          : 'h-[72px] bg-[var(--bg-canvas)]/85 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Wordmark */}
        <button
          type="button"
          onClick={() => {
            setAppMode('public');
            setActiveTab('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <Wordmark />
        </button>

        {/* Center: Editorial Section Anchors */}
        <nav className="hidden xl:flex items-center gap-6" aria-label="Primary sections">
          {navLinks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleAnchorClick(item.href)}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Palette Switcher, Locale, Theme, Surface Switcher, Auth */}
        <div className="hidden md:flex items-center gap-2">
          {/* Live Palette Switcher (D-04: D2 default + D5 + D1) */}
          {setPalette && (
            <div
              className="inline-flex items-center rounded-xl p-0.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)]"
              title="Compare Provisional Brand Palettes (D2 Ink & Clay, D5 Forest & Sand, D1 Sunlit Humanist)"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--text-muted)] ml-2 mr-1" />
              {(['D2', 'D5', 'D1'] as BrandPalette[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPalette(p)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors ${
                    palette === p
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Locale Switcher (EN + 6 Indic Scripts) */}
          {setLocale && (
            <div className="relative inline-flex items-center">
              <Globe className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 pointer-events-none" />
              <select
                aria-label="Select Language"
                value={locale}
                onChange={(e) => setLocale(e.target.value as SupportedLocale)}
                className="pl-7 pr-2.5 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              >
                {LOCALE_META.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.code} · {l.nativeLabel}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Light / Dark Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={isDarkMode ? 'Switch to warm paper light mode' : 'Switch to warm charcoal dark mode'}
            title={isDarkMode ? 'Light mode (Warm Paper)' : 'Dark mode (Warm Charcoal)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[var(--accent-secondary)]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Interactive Surface Switcher (Member Demo & Staff Console) */}
          <button
            type="button"
            onClick={() => {
              setAppMode('user');
              setActiveTab('home');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Enter Member App Experience"
          >
            <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Member App</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAppMode('admin');
              setActiveTab('admin');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Enter 3-Pane Staff Operations Console (/staff)"
          >
            <Shield className="w-3.5 h-3.5 text-[var(--accent-tertiary)]" />
            <span>/staff</span>
          </button>

          {/* Sign in & Join Kithra */}
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Kithra</span>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: dur.modal, ease: easeStandard }}
            className="md:hidden bg-[var(--bg-elevated)] border-b border-[var(--border-default)] px-4 pt-3 pb-6 space-y-4 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAnchorClick(item.href)}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {setPalette && (
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-xs font-mono text-[var(--text-muted)]">Brand Direction:</span>
                <div className="flex gap-1">
                  {(['D2', 'D5', 'D1'] as BrandPalette[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPalette(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                        palette === p
                          ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('login');
                }}
                className="w-full py-2.5 rounded-xl border border-[var(--border-default)] text-sm font-medium text-[var(--text-primary)]"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActiveTab('signup');
                }}
                className="w-full py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-sm font-semibold"
              >
                Join Kithra
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAppMode('user');
                  setActiveTab('home');
                }}
                className="w-full py-2 rounded-xl bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-secondary)]"
              >
                Open Member App
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAppMode('admin');
                  setActiveTab('admin');
                }}
                className="w-full py-2 rounded-xl bg-[var(--bg-subtle)] text-xs font-mono text-[var(--text-secondary)]"
              >
                Open /staff Console
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
