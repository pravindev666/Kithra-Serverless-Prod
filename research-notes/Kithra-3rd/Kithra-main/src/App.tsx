import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ActiveTab,
  AppMode,
  BrandPalette,
  CompatibilityReport,
  ModeEnrollmentState,
  RelationshipMode,
  SupportedLocale,
} from './types';
import { DEFAULT_REPORT } from './data/mockReport';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { UserSidebar } from './components/UserSidebar';
import { UserTopHeader } from './components/UserTopHeader';
import { HomeDashboardView } from './components/HomeDashboardView';
import { AssessmentView } from './components/AssessmentView';
import { CompatibilityReportView } from './components/CompatibilityReportView';
import { MatchesView } from './components/MatchesView';
import { MessagingView } from './components/MessagingView';
import { JournalView } from './components/JournalView';
import { InsightsView } from './components/InsightsView';
import { ProfileView } from './components/ProfileView';
import { BillingView } from './components/BillingView';
import { SecurityView } from './components/SecurityView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsOverlay } from './components/KeyboardShortcutsOverlay';
import { ToastProvider, useToast } from './components/ToastProvider';
import { useKithraMotion } from './lib/motion';

function KithraAppContent() {
  const { addToast } = useToast();
  const { dur, easeStandard, shouldReduce } = useKithraMotion();

  const [appMode, setAppMode] = useState<AppMode>('public');
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  // Provisional Visual System (D-04: D2 Ink & Clay default + live D5 Forest & Sand + D1 Sunlit Humanist)
  const [palette, setPalette] = useState<BrandPalette>('D2');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [locale, setLocale] = useState<SupportedLocale>('EN');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);

  // Active Relationship Mode & Strict Per-Mode Consent State (D-02)
  const [activeRelationshipMode, setActiveRelationshipMode] =
    useState<RelationshipMode>('dating');

  const [modeEnrollments, setModeEnrollments] = useState<
    Record<RelationshipMode, ModeEnrollmentState>
  >({
    friendship: {
      mode: 'friendship',
      enabled: true,
      discoverableConsent: true,
      paused: false,
      bio: 'Looking for Saturday bookstore walks, cycling loops around Cubbon Park, and small supper clubs.',
      intentSummary: 'Platonic creative friends & neighbourhood circles',
    },
    dating: {
      mode: 'dating',
      enabled: true,
      discoverableConsent: true,
      paused: false,
      bio: 'Seeking an intentional, unhurried partnership built on calm communication and shared curiosity.',
      intentSummary: 'Intentional long-term partnership',
    },
    matrimony: {
      mode: 'matrimony',
      enabled: true,
      discoverableConsent: true,
      paused: false,
      bio: 'Exploring an egalitarian life partnership where dual careers, shared domestic care, and warm family boundaries align.',
      intentSummary: 'Adult-led marriage & shared household',
    },
  });

  const [reportData, setReportData] = useState<CompatibilityReport>(DEFAULT_REPORT);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState<boolean>(true);
  const [selectedMatchIdForChat, setSelectedMatchIdForChat] = useState<string | null>('m1');
  const [blockedMemberIds, setBlockedMemberIds] = useState<string[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Sync HTML attributes for D2/D5/D1 palettes, Light/Dark mode, Locale script line-height, and Reduced Motion
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
    root.setAttribute('data-low-data', lowDataMode ? 'true' : 'false');
    root.setAttribute('lang', locale.toLowerCase());
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [palette, isDarkMode, reducedMotion, lowDataMode, locale]);

  // 0ms Instant Block Handler (Zero animation delay across all 3 modes)
  const handleBlockMemberInstant = (memberId: string, name: string) => {
    setBlockedMemberIds((prev) => (prev.includes(memberId) ? prev : [...prev, memberId]));
    addToast(
      `BLOCKED ${name} (0ms): Bidirectional visibility and threads severed across Friendship, Dating & Matrimony.`,
      'info'
    );
  };

  const handleToggleModeConsent = (mode: RelationshipMode) => {
    setModeEnrollments((prev) => {
      const current = prev[mode];
      const nextEnabled = !(current.enabled && current.discoverableConsent);
      return {
        ...prev,
        [mode]: {
          ...current,
          enabled: nextEnabled,
          discoverableConsent: nextEnabled,
        },
      };
    });
  };

  const handleToggleModePause = (mode: RelationshipMode) => {
    setModeEnrollments((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        paused: !prev[mode].paused,
      },
    }));
  };

  const handleUpdateModeBio = (
    mode: RelationshipMode,
    bio: string,
    intentSummary: string
  ) => {
    setModeEnrollments((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        bio,
        intentSummary,
      },
    }));
  };

  // Switch to Admin Surface if activeTab === 'admin' or appMode === 'admin'
  if (appMode === 'admin' || activeTab === 'admin') {
    return (
      <AdminView
        setActiveTab={setActiveTab}
        setAppMode={setAppMode}
      />
    );
  }

  // Public Standalone Auth Pages
  if (activeTab === 'login') {
    return (
      <LoginPage
        onSuccess={() => {
          setAppMode('user');
          setActiveTab('home');
        }}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (activeTab === 'signup') {
    return (
      <SignupPage
        onSuccess={(selectedModes) => {
          if (selectedModes && selectedModes.length > 0) {
            setActiveRelationshipMode(selectedModes[0]);
            setModeEnrollments((prev) => ({
              friendship: {
                ...prev.friendship,
                enabled: selectedModes.includes('friendship'),
                discoverableConsent: selectedModes.includes('friendship'),
              },
              dating: {
                ...prev.dating,
                enabled: selectedModes.includes('dating'),
                discoverableConsent: selectedModes.includes('dating'),
              },
              matrimony: {
                ...prev.matrimony,
                enabled: selectedModes.includes('matrimony'),
                discoverableConsent: selectedModes.includes('matrimony'),
              },
            }));
          }
          setAppMode('user');
          setActiveTab('assessment');
        }}
        setActiveTab={setActiveTab}
      />
    );
  }

  // Public Editorial Landing Surface
  if (appMode === 'public' && activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)]">
        <Navbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== 'landing' && tab !== 'login' && tab !== 'signup') {
              setAppMode('user');
            }
            setActiveTab(tab);
          }}
          appMode={appMode}
          setAppMode={setAppMode}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          palette={palette}
          setPalette={setPalette}
          locale={locale}
          setLocale={setLocale}
        />
        <LandingPage
          onStart={() => setActiveTab('signup')}
          setActiveTab={(tab) => {
            if (tab !== 'landing' && tab !== 'login' && tab !== 'signup') {
              setAppMode('user');
            }
            setActiveTab(tab);
          }}
          palette={palette}
          setPalette={setPalette}
          locale={locale}
          setLocale={setLocale}
          onSelectModeAndEnter={(mode) => {
            setActiveRelationshipMode(mode);
            setAppMode('user');
            setActiveTab('matches');
          }}
        />
      </div>
    );
  }

  // Authenticated Member Workspace Shell
  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex">
      <UserSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setAppMode={setAppMode}
        activeRelationshipMode={activeRelationshipMode}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <UserTopHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setAppMode={setAppMode}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          activeRelationshipMode={activeRelationshipMode}
          setActiveRelationshipMode={setActiveRelationshipMode}
          modeEnrollments={modeEnrollments}
          palette={palette}
          setPalette={setPalette}
          locale={locale}
          setLocale={setLocale}
        />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeRelationshipMode}`}
              initial={shouldReduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: dur.ui, ease: easeStandard }}
            >
              {activeTab === 'home' && (
                <HomeDashboardView
                  setActiveTab={setActiveTab}
                  reportData={reportData}
                  hasCompletedAssessment={hasCompletedAssessment}
                  activeRelationshipMode={activeRelationshipMode}
                  setActiveRelationshipMode={setActiveRelationshipMode}
                  modeEnrollments={modeEnrollments}
                  onToggleModeConsent={handleToggleModeConsent}
                  onToggleModePause={handleToggleModePause}
                />
              )}

              {activeTab === 'assessment' && (
                <AssessmentView
                  initialAnswers={quizAnswers}
                  onComplete={(newReport, newAnswers) => {
                    setReportData(newReport);
                    setQuizAnswers(newAnswers);
                    setHasCompletedAssessment(true);
                    setActiveTab('report');
                  }}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'report' && (
                <CompatibilityReportView
                  report={reportData}
                  setActiveTab={setActiveTab}
                  onRetake={() => setActiveTab('assessment')}
                />
              )}

              {activeTab === 'matches' && (
                <MatchesView
                  setActiveTab={setActiveTab}
                  userReport={reportData}
                  onSelectMatchForChat={(matchId) => setSelectedMatchIdForChat(matchId)}
                  activeRelationshipMode={activeRelationshipMode}
                  setActiveRelationshipMode={setActiveRelationshipMode}
                  modeEnrollments={modeEnrollments}
                  blockedMemberIds={blockedMemberIds}
                  onBlockMemberInstant={handleBlockMemberInstant}
                />
              )}

              {activeTab === 'messages' && (
                <MessagingView
                  selectedMatchId={selectedMatchIdForChat}
                  setActiveTab={setActiveTab}
                  activeRelationshipMode={activeRelationshipMode}
                  blockedMemberIds={blockedMemberIds}
                  onBlockMemberInstant={handleBlockMemberInstant}
                />
              )}

              {activeTab === 'journal' && (
                <JournalView
                  setActiveTab={setActiveTab}
                  activeRelationshipMode={activeRelationshipMode}
                />
              )}

              {activeTab === 'insights' && (
                <InsightsView
                  report={reportData}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView
                  setActiveTab={setActiveTab}
                  activeRelationshipMode={activeRelationshipMode}
                  modeEnrollments={modeEnrollments}
                  onUpdateModeBio={handleUpdateModeBio}
                />
              )}

              {activeTab === 'billing' && (
                <BillingView setActiveTab={setActiveTab} />
              )}

              {activeTab === 'security' && (
                <SecurityView
                  setActiveTab={setActiveTab}
                  modeEnrollments={modeEnrollments}
                  onToggleModeConsent={handleToggleModeConsent}
                  reportData={reportData}
                  blockedMemberIds={blockedMemberIds}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  setActiveTab={setActiveTab}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  palette={palette}
                  setPalette={setPalette}
                  locale={locale}
                  setLocale={setLocale}
                  reducedMotion={reducedMotion}
                  setReducedMotion={setReducedMotion}
                  lowDataMode={lowDataMode}
                  setLowDataMode={setLowDataMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        setAppMode={setAppMode}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <KeyboardShortcutsOverlay />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <KithraAppContent />
    </ToastProvider>
  );
}
