import React from 'react';
import {
  Compass,
  CreditCard,
  FileSpreadsheet,
  Home,
  Layers,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
  Terminal,
} from 'lucide-react';
import { ActiveTab, AppMode, RelationshipMode } from '../types';
import { Wordmark } from './Wordmark';

interface UserSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setAppMode: (mode: AppMode) => void;
  activeRelationshipMode?: RelationshipMode;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({
  activeTab,
  setActiveTab,
  setAppMode,
  activeRelationshipMode = 'dating',
}) => {
  const primaryNav: Array<{ id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    {
      id: 'matches',
      label: 'Discover Pool',
      icon: <Compass className="w-4 h-4" />,
      badge:
        activeRelationshipMode === 'friendship'
          ? '◌'
          : activeRelationshipMode === 'dating'
            ? '♡'
            : '◇',
    },
    { id: 'journal', label: 'Circles & Groups', icon: <Users className="w-4 h-4" />, badge: '3' },
    { id: 'messages', label: 'Connections & Chat', icon: <MessageSquare className="w-4 h-4" />, badge: '2' },
    { id: 'assessment', label: '12 Themes Quiz', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'report', label: 'My Patterns', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'insights', label: 'Scenario Simulator', icon: <Layers className="w-4 h-4" /> },
  ];

  const accountNav: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'profile', label: 'Profile & 4:5 Photos', icon: <User className="w-4 h-4" /> },
    { id: 'billing', label: 'Membership (₹0/149/249)', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'security', label: 'Consent, Safety & Export', icon: <Shield className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & HTTP States', icon: <Settings className="w-4 h-4" /> },
  ];

  // Mobile 5-tab bar (04_UIUX_RD: Discover, Circles, Connections, Messages, Profile)
  const mobileBottomTabs: Array<{ id: ActiveTab; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'matches', label: 'Discover', icon: <Compass className="w-5 h-5" /> },
    { id: 'journal', label: 'Circles', icon: <Users className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop 240px Left Navigation Rail */}
      <aside
        className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[var(--bg-elevated)] border-r border-[var(--border-subtle)] select-none"
        aria-label="Member navigation"
      >
        <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setAppMode('public');
              setActiveTab('landing');
            }}
            className="text-left focus:outline-none"
          >
            <Wordmark />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Relationship Workspace
            </div>
            {primaryNav.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${active
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-semibold shadow-2xs'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${active
                          ? 'bg-black/20 text-white'
                          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)]'
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Account, Privacy &amp; Trust
            </div>
            {accountNav.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${active
                      ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-semibold shadow-2xs'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Surface Switcher */}
        <div className="p-3 border-t border-[var(--border-subtle)] space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setAppMode('admin');
              setActiveTab('admin');
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[var(--accent-tertiary)]" />
              <span>Staff Console (/staff)</span>
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">RBAC</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAppMode('public');
              setActiveTab('landing');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] hover:text-[var(--state-danger)] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit to Public Site</span>
          </button>
        </div>
      </aside>

      {/* Mobile 5-Tab Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[var(--bg-elevated)]/95 backdrop-blur-md border-t border-[var(--border-subtle)] grid grid-cols-5 items-center px-2"
        aria-label="Mobile bottom navigation"
      >
        {mobileBottomTabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[11px] font-medium ${active ? 'text-[var(--accent-primary)] font-semibold' : 'text-[var(--text-muted)]'
                }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
