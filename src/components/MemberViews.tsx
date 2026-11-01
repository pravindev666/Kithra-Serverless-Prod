import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bookmark,
  Check,
  ChevronDown,
  Compass,
  Crop,
  Filter,
  Home,
  Image as ImageIcon,
  MessageSquare,
  MoreHorizontal,
  RotateCw,
  Send,
  Shield,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  AssessmentQuestion,
  CommunityCircle,
  ConversationThread,
  IntentionId,
  MemberPhoto,
  MemberProfile,
  MemberTab,
  RelationshipSignalKind,
} from '../types/kithra';
import {
  INTENTION_METADATA,
  QUESTION_THEME_MAP,
  SIGNAL_VOCABULARY_METADATA,
} from '../data/mockFixtures';
import {
  applyPhotoCropAdjustment,
  computeAssessmentProgress,
  filterProfiles,
  getVisiblePhotosForIntention,
  groupAlignmentByKind,
  reorderPhotos,
  togglePhotoIntentionVisibility,
} from '../utils/kithraLogic';
import { EditorialImage } from './EditorialImage';
import { EditorialVariant } from '../utils/editorialMedia';

interface MemberShellProps {
  activeTab: MemberTab;
  matchMemberId?: string;
  onNavigateMemberPath: (path: string) => void;
  intentionFilter: IntentionId | 'all';
  onChangeIntentionFilter: (filter: IntentionId | 'all') => void;
  profiles: MemberProfile[];
  onUpdateProfiles: React.Dispatch<React.SetStateAction<MemberProfile[]>>;
  photos: MemberPhoto[];
  onUpdatePhotos: React.Dispatch<React.SetStateAction<MemberPhoto[]>>;
  questions: AssessmentQuestion[];
  assessmentAnswers: Record<string, string>;
  onSelectAssessmentAnswer: (questionId: string, optionId: string) => void;
  conversations: ConversationThread[];
  onSendMessage: (conversationId: string, text: string) => void;
  circles: CommunityCircle[];
  onToggleCircleJoin: (circleId: string) => void;
  activeIntentions: IntentionId[];
  onToggleActiveIntention: (intention: IntentionId) => void;
  pacePreference: string;
  onChangePacePreference: (pace: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  manualReduceMotion: boolean;
  onToggleReduceMotion: () => void;
}

const DESKTOP_SIDEBAR_ITEMS: { id: MemberTab; path: string; label: string }[] = [
  { id: 'home', path: '/member/home', label: 'Home' },
  { id: 'discover', path: '/member/discover', label: 'Discover' },
  { id: 'connections', path: '/member/connections', label: 'Connections' },
  { id: 'match', path: '/member/match/member-aarav', label: 'Match details' },
  { id: 'messages', path: '/member/messages', label: 'Messages' },
  { id: 'circles', path: '/member/circles', label: 'Circles' },
  { id: 'assessments', path: '/member/assessments', label: 'Assessments' },
  { id: 'photos', path: '/member/photos', label: 'Photos' },
  { id: 'profile', path: '/member/profile', label: 'Profile' },
  { id: 'privacy', path: '/member/privacy', label: 'Privacy' },
  { id: 'settings', path: '/member/settings', label: 'Settings' },
];

export const MemberShell: React.FC<MemberShellProps> = ({
  activeTab,
  matchMemberId,
  onNavigateMemberPath,
  intentionFilter,
  onChangeIntentionFilter,
  profiles,
  onUpdateProfiles,
  photos,
  onUpdatePhotos,
  questions,
  assessmentAnswers,
  onSelectAssessmentAnswer,
  conversations,
  onSendMessage,
  circles,
  onToggleCircleJoin,
  activeIntentions,
  onToggleActiveIntention,
  pacePreference,
  onChangePacePreference,
  isDark,
  onToggleTheme,
  manualReduceMotion,
  onToggleReduceMotion,
}) => {
  // Discover states (Scoped by active intention first)
  const [scopedIntention, setScopedIntention] = useState<IntentionId>(
    intentionFilter !== 'all' ? intentionFilter : activeIntentions[0] || 'friendship'
  );
  const [cityFilter, setCityFilter] = useState<string>('All cities');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [expandedAlignmentIds, setExpandedAlignmentIds] = useState<Record<string, boolean>>({
    'member-aarav': true,
  });
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [noteModalMember, setNoteModalMember] = useState<MemberProfile | null>(null);
  const [introNoteText, setIntroNoteText] = useState<string>('');
  const [memberFeedbackToast, setMemberFeedbackToast] = useState<string | null>(null);

  // Match Details (Echo / Counterpoint / Mosaic Fit) states
  const [selectedSignalFilter, setSelectedSignalFilter] = useState<
    RelationshipSignalKind | 'all'
  >('all');
  const [showMeasuredBandsSheet, setShowMeasuredBandsSheet] = useState<boolean>(true);

  // Messages states
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversations[0]?.id ?? 'conv-aarav'
  );
  const [draftMessage, setDraftMessage] = useState<string>('');

  // Assessments states
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('all');

  // PhotoManager states
  const [selectedPhotoId, setSelectedPhotoId] = useState<string>(photos[0]?.id ?? 'photo-1');
  const [showPhotoGuidance, setShowPhotoGuidance] = useState<boolean>(false);
  const [simulateEmptyGallery, setSimulateEmptyGallery] = useState<boolean>(false);
  const [photoPendingDelete, setPhotoPendingDelete] = useState<MemberPhoto | null>(null);
  const [expandedGalleryPhoto, setExpandedGalleryPhoto] = useState<MemberPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Profile self-editor states
  const [selfName, setSelfName] = useState<string>('Kavya Sundaram');
  const [selfCity, setSelfCity] = useState<string>('Bengaluru');
  const [selfHeadline, setSelfHeadline] = useState<string>(
    'Urban researcher drawn to long walks, regional history, and unhurried conversation.'
  );
  const [selfBio, setSelfBio] = useState<string>(
    'Living in Bengaluru and working on public library archives. I enjoy filter coffee mornings, Carnatic and jazz listening rooms, and cooking for small tables of friends.'
  );
  const [previewIntentionMode, setPreviewIntentionMode] = useState<IntentionId>('friendship');

  const showToast = (msg: string) => {
    setMemberFeedbackToast(msg);
    window.setTimeout(() => {
      setMemberFeedbackToast((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Sync intentionFilter prop if set from landing
  React.useEffect(() => {
    if (intentionFilter !== 'all') {
      setScopedIntention(intentionFilter);
    }
  }, [intentionFilter]);

  const filteredProfiles = filterProfiles(profiles, {
    intention: scopedIntention,
    city: cityFilter,
    searchQuery,
    savedOnly,
  });

  const toggleSaveProfile = (profileId: string) => {
    onUpdateProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, saved: !p.saved } : p))
    );
  };

  const handleSendIntroNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalMember || !introNoteText.trim()) return;
    onUpdateProfiles((prev) =>
      prev.map((p) =>
        p.id === noteModalMember.id ? { ...p, connectionState: 'note-sent' } : p
      )
    );
    showToast(`Thoughtful note saved for ${noteModalMember.name} (Simulated preview).`);
    setNoteModalMember(null);
    setIntroNoteText('');
  };

  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) ?? conversations[0];

  const handleComposerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !draftMessage.trim()) return;
    onSendMessage(activeConversation.id, draftMessage.trim());
    setDraftMessage('');
  };

  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId) ?? photos[0];
  const assessmentProgress = computeAssessmentProgress(questions, assessmentAnswers);
  const totalBankCompleted = 32 + assessmentProgress.answeredCount; // Out of 100-question bank
  const currentQuestion = questions[activeQuestionIndex] ?? questions[0];

  const matchTargetProfile =
    profiles.find((p) => p.id === matchMemberId) ?? profiles[0];

  // Local file picker handler using URL.createObjectURL
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const newPhoto: MemberPhoto = {
      id: `photo-local-${Date.now()}`,
      title: file.name.replace(/\.[^.]+$/, '') || `Local portrait #${photos.length + 1}`,
      caption: 'Local portrait preview — not uploaded to any server.',
      altText: `Member uploaded local preview portrait (${file.name})`,
      isPrimary: photos.length === 0,
      aspectRatio: '4:5',
      variant: 'photo-primary',
      localObjectUrl: objectUrl,
      crop: { zoom: 1, panX: 0, panY: 0, rotation: 0 },
      visibleIn: {
        friendship: scopedIntention === 'friendship',
        dating: scopedIntention === 'dating',
        matrimony: scopedIntention === 'matrimony',
      },
      moderationStatus: 'Pending review',
      moderationNote:
        'Local browser object URL preview only. No file has been transmitted to a server.',
    };
    setSimulateEmptyGallery(false);
    onUpdatePhotos((prev) => [...prev, newPhoto]);
    setSelectedPhotoId(newPhoto.id);
    showToast(
      `Loaded "${file.name}" via local browser preview. No server upload occurred.`
    );
    e.target.value = '';
  };

  const handleAddSimulatedLocalPortrait = () => {
    const nextIdx = photos.length + 1;
    const variants: EditorialVariant[] = [
      'photo-primary',
      'photo-secondary',
      'photo-third',
      'member-ananya',
    ];
    const newPhoto: MemberPhoto = {
      id: `photo-${Date.now()}`,
      title: `Portrait #${nextIdx}`,
      caption: 'Afternoon conversation on the veranda.',
      altText: 'Afternoon portrait on a sunlit veranda',
      isPrimary: photos.length === 0,
      aspectRatio: '4:5',
      variant: variants[nextIdx % variants.length],
      crop: { zoom: 1, panX: 0, panY: 0, rotation: 0 },
      visibleIn: {
        friendship: true,
        dating: false,
        matrimony: false,
      },
      moderationStatus: 'Pending review',
      moderationNote:
        'Simulated local portrait · Visibility defaults strictly to Friendship with no automatic crossover.',
    };
    setSimulateEmptyGallery(false);
    onUpdatePhotos((prev) => [...prev, newPhoto]);
    setSelectedPhotoId(newPhoto.id);
    showToast('Added simulated portrait to your local gallery (No server upload).');
  };

  const updateSelectedPhotoCrop = (
    patch: Partial<MemberPhoto['crop']>
  ) => {
    if (!selectedPhoto) return;
    onUpdatePhotos((prev) =>
      prev.map((p) =>
        p.id === selectedPhoto.id
          ? { ...p, crop: applyPhotoCropAdjustment(p.crop, patch) }
          : p
      )
    );
  };

  const handleMakePrimaryPhoto = (photoId: string) => {
    onUpdatePhotos((prev) => {
      const idx = prev.findIndex((p) => p.id === photoId);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [chosen] = copy.splice(idx, 1);
      copy.unshift(chosen);
      return copy.map((item, i) => ({
        ...item,
        isPrimary: i === 0,
        aspectRatio: i === 0 ? '4:5' : item.aspectRatio,
      }));
    });
    showToast('Updated 4:5 primary portrait.');
  };

  const handleConfirmDeletePhoto = () => {
    if (!photoPendingDelete) return;
    const removedId = photoPendingDelete.id;
    onUpdatePhotos((prev) => {
      const remaining = prev.filter((p) => p.id !== removedId);
      return remaining.map((item, idx) => ({
        ...item,
        isPrimary: idx === 0,
      }));
    });
    setPhotoPendingDelete(null);
    showToast('Removed portrait from local preview gallery.');
  };

  return (
    <div className="py-7 md:py-9 min-h-[660px] pb-24 lg:pb-10">
      {memberFeedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 rounded-[11px] bg-[var(--surface)] border border-[var(--ochre)] px-4 py-3 text-sm font-semibold text-[var(--heading)] flex items-center justify-between gap-3"
        >
          <span>{memberFeedbackToast}</span>
          <button
            type="button"
            onClick={() => setMemberFeedbackToast(null)}
            aria-label="Dismiss notification"
            className="text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[225px_1fr] gap-7 items-start">
        {/* DESKTOP MEMBER SIDEBAR */}
        <aside
          aria-label="Member workspace navigation"
          className="hidden lg:flex lg:flex-col bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-4 gap-1 sticky top-5"
        >
          <div className="px-3 pt-1 pb-3 border-b border-[var(--line)] mb-2">
            <p className="font-serif-editorial text-[28px] leading-none font-semibold text-[var(--heading)]">
              Your Kithra
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              Simulated member workspace
            </p>
          </div>
          {DESKTOP_SIDEBAR_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateMemberPath(item.path)}
                className={`text-left px-3.5 py-2.5 rounded-[9px] text-sm transition-colors cursor-pointer whitespace-nowrap w-full min-h-[42px] ${
                  isActive
                    ? 'bg-[var(--surface2)] text-[var(--heading)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface2)]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* MAIN MEMBER WORKSPACE */}
        <div className="min-w-0">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                    Simulated member workspace · Overview
                  </p>
                  <h1 className="font-serif-editorial text-[38px] sm:text-[46px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                    Good morning, {selfName.split(' ')[0]}.
                  </h1>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Your conversational pace: {pacePreference}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateMemberPath('/member/discover')}
                  className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer self-start whitespace-nowrap min-h-[44px]"
                >
                  Choose intention &amp; discover →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Independent intentions
                  </p>
                  <p className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)] mt-1">
                    {activeIntentions.map((i) => INTENTION_METADATA[i].label).join(' · ')}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Each intention keeps its own profile &amp; photo visibility scope.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateMemberPath('/member/privacy')}
                    className="text-sm font-bold text-[var(--heading)] underline mt-3 cursor-pointer"
                  >
                    Review scope boundaries
                  </button>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    100-question reflection bank
                  </p>
                  <p className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)] mt-1 tabular-nums">
                    {totalBankCompleted} of 100 saved
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Shapes your Echo, Counterpoint &amp; Mosaic Fit signals.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateMemberPath('/member/assessments')}
                    className="text-sm font-bold text-[var(--heading)] underline mt-3 cursor-pointer"
                  >
                    Open question bank map
                  </button>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Photos &amp; 4:5 crop studio
                  </p>
                  <p className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)] mt-1 tabular-nums">
                    {photos.length} portraits configured
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Zero automatic crossover between intentions.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateMemberPath('/member/photos')}
                    className="text-sm font-bold text-[var(--heading)] underline mt-3 cursor-pointer"
                  >
                    Manage photos &amp; visibility
                  </button>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
                      Recent introductions &amp; Circles
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      Simulated updates from your enabled intentions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateMemberPath('/member/messages')}
                    className="text-sm font-bold text-[var(--heading)] underline cursor-pointer whitespace-nowrap"
                  >
                    Open messages →
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="p-4 rounded-[11px] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[var(--heading)]">Aarav Iyer · Bengaluru</span>
                      <span className="text-[var(--muted)]">
                        {' '}
                        · Echo on evening conversational pace · Sent a note about Sunday Book Walk
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => onNavigateMemberPath('/member/match/member-aarav')}
                        className="font-bold text-[var(--heading)] underline cursor-pointer"
                      >
                        Match details
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigateMemberPath('/member/messages')}
                        className="font-bold text-[var(--heading)] underline cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-[11px] bg-[var(--surface2)] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[var(--heading)]">
                        Bengaluru Sunday Book &amp; Courtyard Walk
                      </span>
                      <span className="text-[var(--muted)]">
                        {' '}
                        · Next gathering: Second Sunday · 8:30 AM
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigateMemberPath('/member/circles')}
                      className="font-bold text-[var(--heading)] underline text-left cursor-pointer whitespace-nowrap"
                    >
                      View Circle details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISCOVER (INTENTION-SCOPED) */}
          {activeTab === 'discover' && (
            <div>
              {/* Mandatory Intention Scope Chooser Before Browsing Discovery */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="uppercase tracking-[2px] text-xs font-bold text-[var(--ochre-text)]">
                      Step 1 · Choose active discovery scope
                    </p>
                    <h2 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)] mt-0.5">
                      Browsing {INTENTION_METADATA[scopedIntention].label} introductions
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-0.5">
                      {INTENTION_METADATA[scopedIntention].boundarySummary}
                    </p>
                  </div>

                  <div
                    role="tablist"
                    aria-label="Choose intention scope to enter discovery"
                    className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[var(--surface2)] border border-[var(--line)] rounded-[10px] self-start"
                  >
                    {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map((intentKey) => {
                      const active = scopedIntention === intentKey;
                      const info = INTENTION_METADATA[intentKey];
                      return (
                        <button
                          key={intentKey}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => {
                            setScopedIntention(intentKey);
                            onChangeIntentionFilter(intentKey);
                          }}
                          className={`px-3.5 py-2 rounded-[8px] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
                            active
                              ? 'bg-[var(--surface)] text-[var(--heading)] shadow-xs'
                              : 'text-[var(--muted)] hover:text-[var(--heading)]'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: info.colorVar }}
                            aria-hidden="true"
                          />
                          <span>{info.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                    Simulated member profiles · Fictional preview data
                  </p>
                  <h1 className="font-serif-editorial text-[38px] sm:text-[44px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                    Connections worth exploring in {INTENTION_METADATA[scopedIntention].label}.
                  </h1>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Real faces, personal context, and Echo, Counterpoint &amp; Mosaic Fit signals—never a swipe deck.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen((prev) => !prev)}
                    aria-expanded={mobileFilterOpen}
                    className="inline-flex items-center gap-2 rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] px-4 py-2.5 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[44px]"
                  >
                    <Filter className="w-4 h-4" aria-hidden="true" />
                    <span>City &amp; keyword filters</span>
                  </button>
                </div>
              </div>

              {/* Expandable Filter Sheet / Bar */}
              <AnimatePresence initial={false}>
                {mobileFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-4 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end"
                  >
                    <div>
                      <label
                        htmlFor="discover-city-filter"
                        className="block text-sm font-bold text-[var(--heading)] mb-1"
                      >
                        City
                      </label>
                      <select
                        id="discover-city-filter"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full h-11 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3 text-sm"
                      >
                        <option value="All cities">All cities</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Delhi">Delhi</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="discover-search"
                        className="block text-sm font-bold text-[var(--heading)] mb-1"
                      >
                        Interest, language, or keyword
                      </label>
                      <input
                        id="discover-search"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g. Carnatic, books, architecture..."
                        className="w-full h-11 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3 text-sm"
                      />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2">
                      <button
                        type="button"
                        aria-pressed={savedOnly}
                        onClick={() => setSavedOnly((prev) => !prev)}
                        className={`h-11 px-3.5 rounded-[8px] border text-sm font-bold cursor-pointer whitespace-nowrap ${
                          savedOnly
                            ? 'bg-[var(--surface2)] border-[var(--heading)] text-[var(--heading)]'
                            : 'border-[var(--line)] text-[var(--muted)]'
                        }`}
                      >
                        {savedOnly ? '✓ Bookmarked only' : 'Bookmarked only'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCityFilter('All cities');
                          setSearchQuery('');
                          setSavedOnly(false);
                        }}
                        className="h-11 px-3.5 rounded-[8px] border border-[var(--line)] text-sm text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer whitespace-nowrap"
                      >
                        Reset
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty Filter State */}
              {filteredProfiles.length === 0 ? (
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-10 text-center">
                  <h2 className="font-serif-editorial text-[32px] font-semibold text-[var(--heading)]">
                    No sample profiles in {INTENTION_METADATA[scopedIntention].label} match these filters.
                  </h2>
                  <p className="text-base text-[var(--muted)] mt-2 max-w-[460px] mx-auto">
                    Try resetting your city filter or switching to another intention scope above.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCityFilter('All cities');
                      setSearchQuery('');
                      setSavedOnly(false);
                    }}
                    className="mt-5 rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    Reset city &amp; keyword filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProfiles.map((member) => {
                    const scopeMeta = INTENTION_METADATA[scopedIntention];
                    const isExpanded = Boolean(expandedAlignmentIds[member.id]);
                    const scopedSignals = member.alignment.filter((a) =>
                      a.applicableIntentions.includes(scopedIntention)
                    );
                    return (
                      <article
                        key={member.id}
                        className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[4/5] max-h-[310px] w-full">
                            <EditorialImage
                              variant={member.portraitVariant as EditorialVariant}
                              alt={`Sample portrait of ${member.name} in ${member.city}`}
                              aspectClass="w-full h-full !rounded-none"
                              lazy={true}
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className="text-xs uppercase tracking-[1.2px] font-bold"
                                style={{ color: scopeMeta.colorVar }}
                              >
                                {scopeMeta.label} scope
                              </p>
                              <button
                                type="button"
                                onClick={() => toggleSaveProfile(member.id)}
                                aria-label={
                                  member.saved
                                    ? `Remove ${member.name} from saved profiles`
                                    : `Bookmark ${member.name}`
                                }
                                className="text-sm text-[var(--muted)] hover:text-[var(--heading)] inline-flex items-center gap-1.5 cursor-pointer py-1"
                              >
                                <Bookmark
                                  className={`w-4 h-4 ${
                                    member.saved ? 'fill-current text-[var(--ochre)]' : ''
                                  }`}
                                />
                                <span>{member.saved ? 'Saved' : 'Save'}</span>
                              </button>
                            </div>

                            <h2 className="font-serif-editorial text-[32px] leading-[1.1] font-semibold text-[var(--heading)] mt-1">
                              {member.name}
                            </h2>

                            {/* Unboxed Metadata */}
                            <p className="text-sm text-[var(--muted)] mt-1 mb-3">
                              <span>Simulated profile</span>
                              <span aria-hidden="true"> · </span>
                              <span>{member.city}</span>
                              <span aria-hidden="true"> · </span>
                              <span>{member.occupation}</span>
                            </p>

                            <p className="text-base text-[var(--text)] leading-relaxed">
                              {member.bio}
                            </p>

                            <p className="text-sm text-[var(--muted)] mt-4 pt-3 border-t border-[var(--line)]">
                              <strong className="text-[var(--heading)]">Shared context:</strong>{' '}
                              {member.interests.join(' · ')}
                            </p>
                            <p className="text-sm text-[var(--muted)] mt-1.5">
                              <strong className="text-[var(--heading)]">Pace:</strong>{' '}
                              {member.paceNote}
                            </p>

                            {/* Echo / Counterpoint / Mosaic Fit Accordion */}
                            {scopedSignals.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                                <button
                                  type="button"
                                  aria-expanded={isExpanded}
                                  onClick={() =>
                                    setExpandedAlignmentIds((prev) => ({
                                      ...prev,
                                      [member.id]: !prev[member.id],
                                    }))
                                  }
                                  className="w-full flex items-center justify-between text-left text-sm font-bold text-[var(--heading)] py-1.5 cursor-pointer"
                                >
                                  <span>
                                    Echo, Counterpoint &amp; Mosaic Fit ({scopedSignals.length})
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 text-[var(--muted)] transition-transform ${
                                      isExpanded ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                                <AnimatePresence initial={false}>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.18 }}
                                      className="mt-2 space-y-3 bg-[var(--surface2)] rounded-[10px] p-4 text-sm"
                                    >
                                      {scopedSignals.map((al) => {
                                        const kindMeta = SIGNAL_VOCABULARY_METADATA[al.kind];
                                        return (
                                          <div
                                            key={al.id}
                                            className="pb-2.5 last:pb-0 border-b last:border-b-0 border-[var(--line)]"
                                          >
                                            <p
                                              className="text-xs uppercase tracking-wider font-bold"
                                              style={{ color: kindMeta.accentColor }}
                                            >
                                              {kindMeta.label} · {kindMeta.subtitle}
                                            </p>
                                            <p className="font-bold text-[var(--heading)] mt-0.5">
                                              {al.theme}
                                            </p>
                                            <p className="text-[var(--muted)] mt-0.5 leading-relaxed">
                                              {al.summary}
                                            </p>
                                          </div>
                                        );
                                      })}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onNavigateMemberPath(`/member/match/${member.id}`)
                                        }
                                        className="text-sm font-bold text-[var(--heading)] underline cursor-pointer pt-1 block"
                                      >
                                        Open Measured Alignment Details Sheet →
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="px-6 pb-5 pt-3 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {member.connectionState === 'connected' ? (
                              <button
                                type="button"
                                onClick={() => onNavigateMemberPath('/member/messages')}
                                className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[42px]"
                              >
                                Open conversation →
                              </button>
                            ) : member.connectionState === 'note-sent' ? (
                              <span className="text-sm font-bold text-[var(--muted)]">
                                ✓ Introduction note sent
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setNoteModalMember(member);
                                  setIntroNoteText(
                                    scopedSignals[0]?.conversationPrompt ??
                                      `Hello ${member.name}, I enjoyed reading your profile note.`
                                  );
                                }}
                                className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[42px]"
                              >
                                Send thoughtful note
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                onNavigateMemberPath(`/member/match/${member.id}`)
                              }
                              className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-3.5 py-2.5 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[42px]"
                            >
                              Match details
                            </button>
                          </div>

                          <span className="text-xs text-[var(--muted)]">
                            {member.languages.join(' · ')}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Modal for Sending Thoughtful Introduction Note */}
              {noteModalMember && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="intro-note-title"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setNoteModalMember(null);
                  }}
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                >
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] max-w-[490px] w-full p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs uppercase tracking-[2px] font-bold text-[var(--ochre-text)]">
                          Thoughtful introduction · Simulated
                        </p>
                        <h2
                          id="intro-note-title"
                          className="font-serif-editorial text-[32px] font-semibold text-[var(--heading)]"
                        >
                          Write a note to {noteModalMember.name}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNoteModalMember(null)}
                        aria-label="Close introduction note dialog"
                        className="text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-4">
                      Echo context: {noteModalMember.alignment[0]?.summary}
                    </p>
                    <form onSubmit={handleSendIntroNote}>
                      <label
                        htmlFor="intro-note-textarea"
                        className="block text-sm font-bold text-[var(--heading)] mb-1.5"
                      >
                        Your message
                      </label>
                      <textarea
                        id="intro-note-textarea"
                        rows={4}
                        value={introNoteText}
                        onChange={(e) => setIntroNoteText(e.target.value)}
                        className="w-full rounded-[9px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] p-3.5 text-base leading-relaxed"
                      />
                      <div className="flex items-center justify-end gap-2.5 mt-4">
                        <button
                          type="button"
                          onClick={() => setNoteModalMember(null)}
                          className="rounded-[9px] border border-[var(--line)] text-[var(--muted)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px]"
                        >
                          Save note (Preview)
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: DEDICATED MATCH DETAILS (ECHO / COUNTERPOINT / MOSAIC FIT) */}
          {activeTab === 'match' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onNavigateMemberPath('/member/discover')}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--heading)] hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to discovery</span>
                </button>

                {/* Member switcher for inspecting different match profiles */}
                <div className="flex items-center gap-2">
                  <label htmlFor="match-member-select" className="text-xs font-bold text-[var(--muted)]">
                    Inspect profile:
                  </label>
                  <select
                    id="match-member-select"
                    value={matchTargetProfile.id}
                    onChange={(e) => onNavigateMemberPath(`/member/match/${e.target.value}`)}
                    className="h-10 rounded-[8px] border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)] px-3 text-sm font-bold"
                  >
                    {profiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6">
                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-center">
                  <div className="w-[160px] sm:w-[200px] aspect-[4/5]">
                    <EditorialImage
                      variant={matchTargetProfile.portraitVariant as EditorialVariant}
                      alt={`Portrait of ${matchTargetProfile.name}`}
                      aspectClass="w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="uppercase tracking-[2px] text-xs font-bold text-[var(--ochre-text)]">
                      Echo, Counterpoint &amp; Mosaic Fit · Questionnaire Signals
                    </p>
                    <h1 className="font-serif-editorial text-[38px] sm:text-[46px] leading-[1.04] font-semibold text-[var(--heading)] mt-1">
                      Your reflection signals with {matchTargetProfile.name}.
                    </h1>
                    <p className="text-base text-[var(--muted)] mt-2 leading-relaxed">
                      {matchTargetProfile.headline}
                    </p>
                    <div className="mt-4 p-3.5 rounded-[10px] bg-[var(--surface2)] text-sm text-[var(--muted)]">
                      <strong className="text-[var(--heading)]">Important boundary:</strong> Echo, Counterpoint, and Mosaic Fit describe how similarly or differently you answered Kithra&apos;s reflection prompts. They are conversation guides—never a percentage guarantee of long-term friendship or marriage.
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter by Signal Kind */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="Filter relationship signals"
                  className="flex flex-wrap gap-1.5"
                >
                  {(
                    [
                      { id: 'all', label: 'All signals' },
                      { id: 'echo', label: 'Echo (Similarities)' },
                      { id: 'counterpoint', label: 'Counterpoint (Differences)' },
                      { id: 'mosaic', label: 'Mosaic Fit (Complementarity)' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedSignalFilter === tab.id}
                      onClick={() => setSelectedSignalFilter(tab.id)}
                      className={`px-3.5 py-2 rounded-[8px] text-sm font-bold cursor-pointer min-h-[40px] ${
                        selectedSignalFilter === tab.id
                          ? 'bg-[var(--primary)] text-[var(--on-primary)]'
                          : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--heading)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowMeasuredBandsSheet((prev) => !prev)}
                  className="rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3.5 py-2 text-sm font-bold text-[var(--heading)] cursor-pointer min-h-[40px]"
                >
                  {showMeasuredBandsSheet
                    ? 'Hide measured questionnaire bands'
                    : 'Show measured questionnaire bands'}
                </button>
              </div>

              {/* Qualitative Cards for Echo, Counterpoint, Mosaic Fit */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchTargetProfile.alignment
                  .filter(
                    (al) =>
                      selectedSignalFilter === 'all' || al.kind === selectedSignalFilter
                  )
                  .map((al) => {
                    const meta = SIGNAL_VOCABULARY_METADATA[al.kind];
                    return (
                      <article
                        key={al.id}
                        className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div
                            className="w-7 h-1.5 rounded-full mb-4"
                            style={{ backgroundColor: meta.accentColor }}
                          />
                          <p
                            className="text-xs uppercase tracking-wider font-bold"
                            style={{ color: meta.accentColor }}
                          >
                            {meta.label} · {meta.subtitle}
                          </p>
                          <h2 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)] mt-1">
                            {al.theme}
                          </h2>
                          <p className="text-sm text-[var(--text)] leading-relaxed mt-2">
                            {al.summary}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[var(--line)] text-xs text-[var(--muted)]">
                          <strong className="text-[var(--heading)]">Starter prompt:</strong>{' '}
                          {al.conversationPrompt}
                        </div>
                      </article>
                    );
                  })}
              </div>

              {/* Optional Measured Alignment Details Sheet */}
              {showMeasuredBandsSheet && (
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6 space-y-5">
                  <div>
                    <p className="uppercase tracking-[2px] text-xs font-bold text-[var(--ochre-text)]">
                      Optional Measured Alignment Details Sheet
                    </p>
                    <h2 className="font-serif-editorial text-[30px] font-semibold text-[var(--heading)] mt-1">
                      Questionnaire dimension bands
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      These bands show overlap across completed reflection modules. They are descriptive questionnaire summaries—not predictive probabilities.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {matchTargetProfile.measuredDimensions.map((dim) => {
                      const sigMeta = SIGNAL_VOCABULARY_METADATA[dim.signalKind];
                      return (
                        <div
                          key={dim.id}
                          className="p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--line)] space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <span
                                className="text-xs font-bold uppercase tracking-wider mr-2"
                                style={{ color: sigMeta.accentColor }}
                              >
                                {sigMeta.label}
                              </span>
                              <strong className="text-base text-[var(--heading)]">
                                {dim.dimension}
                              </strong>
                            </div>
                            <span className="text-xs font-bold text-[var(--heading)] tabular-nums">
                              {dim.bandLabel}
                            </span>
                          </div>

                          {/* Restrained Band Bar */}
                          <div
                            className="w-full h-2 rounded-full bg-[var(--surface)] overflow-hidden"
                            role="progressbar"
                            aria-valuenow={dim.visualFillPercent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${dim.dimension}: ${dim.bandRangeText}`}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${dim.visualFillPercent}%`,
                                backgroundColor: sigMeta.accentColor,
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm pt-1">
                            <div>
                              <span className="text-xs font-bold text-[var(--heading)] block">
                                Your questionnaire stance:
                              </span>
                              <span className="text-[var(--muted)]">{dim.viewerStance}</span>
                            </div>
                            <div>
                              <span className="text-xs font-bold text-[var(--heading)] block">
                                {matchTargetProfile.name}&apos;s stance:
                              </span>
                              <span className="text-[var(--muted)]">{dim.memberStance}</span>
                            </div>
                          </div>

                          <p className="text-xs text-[var(--muted)] pt-1 border-t border-[var(--line)]">
                            {dim.interpretationNote}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Connections &amp; bookmarks
                </p>
                <h1 className="font-serif-editorial text-[38px] sm:text-[43px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                  People you are staying in touch with.
                </h1>
                <p className="text-base text-[var(--muted)] mt-1">
                  Mutual introductions, sent notes, and saved profiles across your active intentions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {profiles
                  .filter((p) => p.connectionState !== 'discover' || p.saved)
                  .map((p) => (
                    <div
                      key={p.id}
                      className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5 flex flex-col justify-between"
                    >
                      <div>
                        <p
                          className="text-xs uppercase tracking-[1px] font-bold"
                          style={{ color: INTENTION_METADATA[p.primaryIntention].colorVar }}
                        >
                          {INTENTION_METADATA[p.primaryIntention].label} ·{' '}
                          {p.connectionState === 'connected'
                            ? 'Mutual connection'
                            : p.connectionState === 'note-sent'
                            ? 'Introduction note sent'
                            : 'Bookmarked profile'}
                        </p>
                        <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)] mt-1">
                          {p.name}
                        </h2>
                        <p className="text-sm text-[var(--muted)]">
                          {p.city} · {p.occupation}
                        </p>
                        <p className="text-sm text-[var(--text)] mt-3">{p.headline}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => onNavigateMemberPath('/member/messages')}
                            className="text-sm font-bold text-[var(--heading)] underline cursor-pointer"
                          >
                            Open messages →
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigateMemberPath(`/member/match/${p.id}`)}
                            className="text-sm font-bold text-[var(--heading)] underline cursor-pointer"
                          >
                            Match signals
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSaveProfile(p.id)}
                          className="text-sm text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
                        >
                          {p.saved ? 'Remove bookmark' : 'Bookmark'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              <div className="mb-5">
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Conversations · Simulated preview
                </p>
                <h1 className="font-serif-editorial text-[38px] sm:text-[43px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                  Unhurried messages.
                </h1>
                <p className="text-base text-[var(--muted)] mt-1">
                  Every thread remembers which intention and Echo signals brought you together.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-5">
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-3 space-y-1.5">
                  {conversations.map((conv) => {
                    const isSelected = conv.id === activeConversation?.id;
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => setSelectedConversationId(conv.id)}
                        className={`w-full text-left p-3.5 rounded-[10px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--surface2)] text-[var(--heading)]'
                            : 'hover:bg-[var(--surface2)]/40 text-[var(--muted)]'
                        }`}
                      >
                        <p
                          className="text-xs uppercase tracking-[1px] font-bold"
                          style={{ color: INTENTION_METADATA[conv.intention].colorVar }}
                        >
                          {INTENTION_METADATA[conv.intention].label}
                        </p>
                        <p className="text-base font-bold text-[var(--heading)] mt-0.5">
                          {conv.memberName}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                          {conv.messages[conv.messages.length - 1]?.text}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {activeConversation && (
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5 flex flex-col justify-between min-h-[450px]">
                    <div>
                      <div className="pb-4 border-b border-[var(--line)]">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="font-serif-editorial text-[30px] font-semibold text-[var(--heading)]">
                            {activeConversation.memberName}
                          </h2>
                          <span className="text-sm text-[var(--muted)]">
                            {activeConversation.city}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--muted)] mt-1">
                          {activeConversation.contextNote}
                        </p>
                      </div>

                      <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto">
                        {activeConversation.messages.map((m) => (
                          <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.14 }}
                            className={`max-w-[82%] rounded-[12px] p-4 text-sm leading-relaxed ${
                              m.sender === 'self'
                                ? 'ml-auto bg-[var(--primary)] text-[var(--on-primary)]'
                                : 'bg-[var(--surface2)] text-[var(--text)]'
                            }`}
                          >
                            <p>{m.text}</p>
                            <span className="block text-xs opacity-75 mt-1.5">
                              {m.timestamp}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <form
                      onSubmit={handleComposerSubmit}
                      className="pt-3 border-t border-[var(--line)]"
                    >
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          'Saturday morning coffee works well for me.',
                          'What have you been reading this week?',
                        ].map((promptChip) => (
                          <button
                            key={promptChip}
                            type="button"
                            onClick={() => setDraftMessage(promptChip)}
                            className="text-xs text-[var(--muted)] hover:text-[var(--heading)] bg-[var(--surface2)] rounded-[7px] px-3 py-1.5 cursor-pointer"
                          >
                            + &ldquo;{promptChip}&rdquo;
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <label htmlFor="message-composer-input" className="sr-only">
                          Write a message to {activeConversation.memberName}
                        </label>
                        <input
                          id="message-composer-input"
                          type="text"
                          value={draftMessage}
                          onChange={(e) => setDraftMessage(e.target.value)}
                          placeholder={`Write a thoughtful reply to ${activeConversation.memberName}...`}
                          className="flex-1 h-[46px] rounded-[9px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-sm"
                        />
                        <button
                          type="submit"
                          className="h-[46px] px-5 rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <span>Send</span>
                          <Send className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: CIRCLES */}
          {activeTab === 'circles' && (
            <div>
              <div className="mb-5">
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Community Circles · Small tables &amp; walks
                </p>
                <h1 className="font-serif-editorial text-[38px] sm:text-[43px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                  Meet around shared curiosity.
                </h1>
                <p className="text-base text-[var(--muted)] mt-1">
                  Hosted walks, listening rooms, and small-table conversations capped at 12–22 people.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {circles.map((circle) => {
                  const meta = INTENTION_METADATA[circle.intention];
                  return (
                    <article
                      key={circle.id}
                      className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 flex flex-col justify-between"
                    >
                      <div>
                        <p
                          className="text-xs uppercase tracking-[1px] font-bold"
                          style={{ color: meta.colorVar }}
                        >
                          {meta.label} · {circle.format}
                        </p>
                        <h2 className="font-serif-editorial text-[28px] leading-[1.12] font-semibold text-[var(--heading)] mt-1">
                          {circle.title}
                        </h2>
                        <p className="text-sm text-[var(--muted)] mt-1">
                          {circle.city} · {circle.cadence} ·{' '}
                          <span className="tabular-nums">{circle.memberCount} members</span>
                        </p>
                        <p className="text-base text-[var(--text)] leading-relaxed mt-3">
                          {circle.description}
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onToggleCircleJoin(circle.id)}
                          className={`rounded-[9px] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px] ${
                            circle.joined
                              ? 'bg-[var(--surface2)] border border-[var(--line)] text-[var(--heading)]'
                              : 'bg-[var(--primary)] text-[var(--on-primary)]'
                          }`}
                        >
                          {circle.joined ? '✓ Joined Circle (Leave)' : 'Join Circle (Preview)'}
                        </button>
                        <span className="text-xs text-[var(--muted)]">Steward-hosted</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: ASSESSMENTS & 100-QUESTION BANK MAP */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                    Reflection question bank · 100-question map
                  </p>
                  <h1 className="font-serif-editorial text-[38px] sm:text-[44px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                    Questions that shape Echo, Counterpoint &amp; Mosaic Fit.
                  </h1>
                  <p className="text-base text-[var(--muted)] mt-1">
                    No unapproved diagnostic claims or personality labels. Answer at your own pace—partial completion works at every stage.
                  </p>
                </div>
                <div className="text-sm font-bold text-[var(--heading)] tabular-nums shrink-0">
                  {totalBankCompleted} / 100 bank reflections saved
                </div>
              </div>

              {/* 5-Theme 100-Question Bank Map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {QUESTION_THEME_MAP.map((theme) => {
                  const isSel = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setSelectedThemeId(isSel ? 'all' : theme.id);
                        const idx = questions.findIndex((q) => q.themeId === theme.id);
                        if (idx >= 0) setActiveQuestionIndex(idx);
                      }}
                      className={`text-left p-4 rounded-[13px] border transition-colors cursor-pointer flex flex-col justify-between ${
                        isSel
                          ? 'bg-[var(--surface)] border-[var(--heading)]'
                          : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface2)]/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--ochre-text)]">
                          <span>Theme {theme.themeNumber}</span>
                          <span className="tabular-nums">
                            {theme.completedQuestions}/{theme.totalQuestions}
                          </span>
                        </div>
                        <h2 className="font-bold text-sm text-[var(--heading)] mt-1.5 leading-snug">
                          {theme.title}
                        </h2>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-3 pt-2 border-t border-[var(--line)]">
                        Applies to:{' '}
                        {theme.applicableIntentions
                          .map((i) => INTENTION_METADATA[i].label)
                          .join(', ')}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Question Selector Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {questions.map((q, idx) => {
                  const answered = Boolean(assessmentAnswers[q.id]);
                  const isCurrent = idx === activeQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setActiveQuestionIndex(idx)}
                      className={`px-3.5 py-2 rounded-[9px] border text-xs cursor-pointer whitespace-nowrap min-h-[40px] ${
                        isCurrent
                          ? 'bg-[var(--surface)] border-[var(--heading)] text-[var(--heading)] font-bold'
                          : 'bg-[var(--surface)] border-[var(--line)] text-[var(--muted)]'
                      }`}
                    >
                      Q{q.questionNumber}. {q.module} {answered ? '✓' : ''}
                    </button>
                  );
                })}
              </div>

              {currentQuestion && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--ochre-text)]">
                        Question #{currentQuestion.questionNumber} of 100 · {currentQuestion.module}
                      </p>
                      <span className="text-xs font-semibold text-[var(--muted)]">
                        Applies to:{' '}
                        {currentQuestion.applicableIntentions
                          .map((i) => INTENTION_METADATA[i].label)
                          .join(' · ')}
                      </span>
                    </div>

                    <h2 className="font-serif-editorial text-[30px] sm:text-[36px] leading-[1.1] font-semibold text-[var(--heading)] mt-2">
                      {currentQuestion.prompt}
                    </h2>
                    <p className="text-sm text-[var(--muted)] mt-2 mb-5">
                      {currentQuestion.context}
                    </p>

                    <div className="space-y-3">
                      {currentQuestion.options.map((opt) => {
                        const isChosen = assessmentAnswers[currentQuestion.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            aria-pressed={isChosen}
                            onClick={() =>
                              onSelectAssessmentAnswer(currentQuestion.id, opt.id)
                            }
                            className={`w-full text-left p-4 rounded-[12px] border transition-colors cursor-pointer ${
                              isChosen
                                ? 'bg-[var(--surface2)] border-[var(--heading)]'
                                : 'bg-[var(--bg)] border-[var(--line)] hover:bg-[var(--surface2)]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-base font-bold text-[var(--heading)]">
                                {opt.label}
                              </span>
                              <span className="text-xs font-bold text-[var(--ochre-text)] shrink-0">
                                {isChosen ? '✓ Saved' : 'Select'}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--muted)] mt-1">
                              {opt.reflection} · <span className="italic">{opt.signalEffect}</span>
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Answer Explanation Note */}
                    <div className="mt-5 p-4 rounded-[11px] bg-[var(--surface2)] text-sm text-[var(--muted)]">
                      <strong className="text-[var(--heading)]">Why we ask this:</strong>{' '}
                      {currentQuestion.whyWeAsk}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[var(--line)]">
                      <button
                        type="button"
                        disabled={activeQuestionIndex === 0}
                        onClick={() =>
                          setActiveQuestionIndex((i) => Math.max(0, i - 1))
                        }
                        className="rounded-[9px] border border-[var(--line)] px-4 py-2.5 text-sm font-bold text-[var(--heading)] disabled:opacity-40 cursor-pointer min-h-[42px]"
                      >
                        ← Previous question
                      </button>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() =>
                            showToast(
                              'Progress saved locally. Partial completion is active—return whenever you like.'
                            )
                          }
                          className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px]"
                        >
                          Save &amp; return later
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            activeQuestionIndex < questions.length - 1
                              ? setActiveQuestionIndex((i) => i + 1)
                              : showToast('Sample question set saved to your local preview profile.')
                          }
                          className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px]"
                        >
                          {activeQuestionIndex < questions.length - 1
                            ? 'Next question →'
                            : 'Complete sample set'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}

          {/* TAB 7: COMPLETE FRONTEND PHOTOMANAGER */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                    PhotoManager · Local preview, 4:5 crop &amp; visibility
                  </p>
                  <h1 className="font-serif-editorial text-[38px] sm:text-[44px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                    Show yourself, your way.
                  </h1>
                  <p className="text-base text-[var(--muted)] mt-1">
                    Select a local image for instant browser preview, adjust your 4:5 portrait crop, and control Friendship, Dating, and Matrimony visibility separately.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start">
                  <button
                    type="button"
                    onClick={() => setSimulateEmptyGallery((prev) => !prev)}
                    className="rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] px-3.5 py-2.5 text-xs font-bold cursor-pointer whitespace-nowrap min-h-[42px]"
                  >
                    {simulateEmptyGallery ? 'Restore sample gallery' : 'Preview empty gallery state'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPhotoGuidance((prev) => !prev)}
                    className="rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] px-3.5 py-2.5 text-xs font-bold cursor-pointer whitespace-nowrap min-h-[42px]"
                  >
                    {showPhotoGuidance ? 'Hide guidance' : 'Photo & consent guidance'}
                  </button>
                </div>
              </div>

              {/* Hidden Local File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="sr-only"
                aria-label="Select local image file for browser preview"
              />

              {/* Consent & Local Preview Notice */}
              <div className="p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--line)] text-sm text-[var(--muted)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <strong className="text-[var(--heading)]">
                    Privacy &amp; no-upload guarantee:
                  </strong>{' '}
                  Selecting a local photo creates a temporary browser object URL (`URL.createObjectURL`). No image leaves your device or uploads to a server in this frontend shell.
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shrink-0 min-h-[42px]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Select local image</span>
                </button>
              </div>

              {showPhotoGuidance && (
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5 text-sm space-y-2">
                  <p className="font-bold text-[var(--heading)]">
                    Kithra portrait &amp; consent guidelines
                  </p>
                  <p className="text-[var(--muted)]">
                    1. Primary portraits use a 4:5 vertical frame in natural daylight with only you in the frame.
                  </p>
                  <p className="text-[var(--muted)]">
                    2. Mode-specific photos never cross over automatically: enabling a photo in Friendship leaves Dating and Matrimony off until you explicitly toggle them on.
                  </p>
                </div>
              )}

              {/* EMPTY GALLERY STATE */}
              {simulateEmptyGallery || photos.length === 0 ? (
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-10 text-center space-y-4">
                  <ImageIcon className="w-9 h-9 text-[var(--muted)] mx-auto opacity-80" />
                  <h2 className="font-serif-editorial text-[32px] font-semibold text-[var(--heading)]">
                    Your portrait gallery is empty.
                  </h2>
                  <p className="text-base text-[var(--muted)] max-w-[480px] mx-auto">
                    You can browse Kithra while deciding which portraits to add. When ready, select a local image from your device to test 4:5 cropping and per-intention visibility switches.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
                    >
                      Select local image file
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulateEmptyGallery(false)}
                      className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] px-4 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
                    >
                      Restore sample portraits
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
                  {/* LEFT: Selected Portrait + Crop/Reposition/Visibility Studio */}
                  {selectedPhoto && (
                    <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] p-5 space-y-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--ochre-text)]">
                          {selectedPhoto.isPrimary
                            ? 'Primary 4:5 Portrait'
                            : `Gallery Item · ${selectedPhoto.aspectRatio}`}
                        </span>
                        <div className="flex items-center gap-2">
                          {!selectedPhoto.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleMakePrimaryPhoto(selectedPhoto.id)}
                              className="text-xs font-bold text-[var(--heading)] underline cursor-pointer"
                            >
                              Make primary 4:5
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setExpandedGalleryPhoto(selectedPhoto)}
                            className="text-xs font-bold text-[var(--heading)] underline cursor-pointer"
                          >
                            Expand modal view
                          </button>
                        </div>
                      </div>

                      <div className="max-w-[360px] mx-auto aspect-[4/5]">
                        <EditorialImage
                          variant={selectedPhoto.variant as EditorialVariant}
                          localObjectUrl={selectedPhoto.localObjectUrl}
                          cropTransform={selectedPhoto.crop}
                          alt={selectedPhoto.altText || selectedPhoto.caption}
                          aspectClass="w-full h-full"
                        >
                          <div className="m-3 inline-block px-3 py-1.5 rounded-[7px] bg-[var(--surface)]/95 text-[var(--heading)] border border-[var(--line)] text-xs font-bold">
                            {selectedPhoto.isPrimary
                              ? 'Primary · 4:5 crop'
                              : `${selectedPhoto.title} · ${selectedPhoto.aspectRatio}`}
                          </div>
                        </EditorialImage>
                      </div>

                      {/* Accessible Crop, Zoom, Rotate & Keyboard Nudge Controls */}
                      <div className="p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--line)] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--heading)] flex items-center gap-1.5">
                            <Crop className="w-3.5 h-3.5" />
                            <span>4:5 Crop, Zoom &amp; Keyboard Reposition</span>
                          </span>
                          <span className="text-xs text-[var(--muted)] tabular-nums">
                            Zoom {selectedPhoto.crop.zoom.toFixed(2)}x · Rotate{' '}
                            {selectedPhoto.crop.rotation}°
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div>
                            <label
                              htmlFor="photo-zoom-slider"
                              className="block text-xs font-bold text-[var(--heading)] mb-1"
                            >
                              Zoom ({selectedPhoto.crop.zoom.toFixed(2)}x)
                            </label>
                            <input
                              id="photo-zoom-slider"
                              type="range"
                              min="1"
                              max="2"
                              step="0.05"
                              value={selectedPhoto.crop.zoom}
                              onChange={(e) =>
                                updateSelectedPhotoCrop({
                                  zoom: parseFloat(e.target.value),
                                })
                              }
                              className="w-full accent-[var(--ochre)]"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateSelectedPhotoCrop({
                                  zoom: selectedPhoto.crop.zoom + 0.1,
                                })
                              }
                              aria-label="Zoom in portrait"
                              className="px-2.5 py-1.5 rounded-[7px] bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--heading)] cursor-pointer"
                            >
                              Zoom +
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSelectedPhotoCrop({
                                  zoom: selectedPhoto.crop.zoom - 0.1,
                                })
                              }
                              aria-label="Zoom out portrait"
                              className="px-2.5 py-1.5 rounded-[7px] bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--heading)] cursor-pointer"
                            >
                              Zoom −
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSelectedPhotoCrop({
                                  rotation: ((selectedPhoto.crop.rotation + 90) %
                                    360) as 0 | 90 | 180 | 270,
                                })
                              }
                              className="px-2.5 py-1.5 rounded-[7px] bg-[var(--surface)] border border-[var(--line)] text-xs font-bold text-[var(--heading)] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Rotate 90°</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateSelectedPhotoCrop({
                                  zoom: 1,
                                  panX: 0,
                                  panY: 0,
                                  rotation: 0,
                                })
                              }
                              className="px-2.5 py-1.5 rounded-[7px] border border-[var(--line)] text-xs text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        </div>

                        {/* Keyboard-accessible pan nudges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-xs text-[var(--muted)] mr-1">
                            Reposition frame:
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedPhotoCrop({
                                panY: selectedPhoto.crop.panY - 5,
                              })
                            }
                            className="px-2.5 py-1 rounded-[6px] bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold cursor-pointer"
                          >
                            Nudge Up
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedPhotoCrop({
                                panY: selectedPhoto.crop.panY + 5,
                              })
                            }
                            className="px-2.5 py-1 rounded-[6px] bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold cursor-pointer"
                          >
                            Nudge Down
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedPhotoCrop({
                                panX: selectedPhoto.crop.panX - 5,
                              })
                            }
                            className="px-2.5 py-1 rounded-[6px] bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold cursor-pointer"
                          >
                            Nudge Left
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedPhotoCrop({
                                panX: selectedPhoto.crop.panX + 5,
                              })
                            }
                            className="px-2.5 py-1 rounded-[6px] bg-[var(--surface)] border border-[var(--line)] text-xs font-semibold cursor-pointer"
                          >
                            Nudge Right
                          </button>
                        </div>
                      </div>

                      {/* Caption, Alt Text & Moderation Status */}
                      <div className="space-y-3 pt-2 border-t border-[var(--line)]">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <div>
                            <span className="font-bold text-[var(--heading)]">
                              Moderation state:{' '}
                            </span>
                            <span
                              className={
                                selectedPhoto.moderationStatus.startsWith('Rejected')
                                  ? 'text-[var(--danger)] font-bold'
                                  : 'text-[var(--ochre-text)] font-bold'
                              }
                            >
                              {selectedPhoto.moderationStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdatePhotos((prev) =>
                                  reorderPhotos(prev, selectedPhoto.id, 'up')
                                )
                              }
                              aria-label="Move selected photo earlier in gallery"
                              className="px-2.5 py-1.5 rounded-[7px] border border-[var(--line)] text-xs font-bold text-[var(--heading)] hover:bg-[var(--surface2)] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span>Earlier</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdatePhotos((prev) =>
                                  reorderPhotos(prev, selectedPhoto.id, 'down')
                                )
                              }
                              aria-label="Move selected photo later in gallery"
                              className="px-2.5 py-1.5 rounded-[7px] border border-[var(--line)] text-xs font-bold text-[var(--heading)] hover:bg-[var(--surface2)] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span>Later</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPhotoPendingDelete(selectedPhoto)}
                              aria-label={`Delete ${selectedPhoto.title}`}
                              className="px-2.5 py-1.5 rounded-[7px] border border-[var(--line)] text-xs font-bold text-[var(--danger)] hover:bg-[var(--surface2)] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {selectedPhoto.moderationNote && (
                          <p className="text-xs text-[var(--muted)] bg-[var(--surface2)] p-3 rounded-[8px]">
                            {selectedPhoto.moderationNote}
                          </p>
                        )}

                        <div>
                          <label
                            htmlFor="photo-caption-input"
                            className="block text-sm font-bold text-[var(--heading)] mb-1"
                          >
                            Photo caption
                          </label>
                          <input
                            id="photo-caption-input"
                            type="text"
                            value={selectedPhoto.caption}
                            onChange={(e) => {
                              const val = e.target.value;
                              onUpdatePhotos((prev) =>
                                prev.map((p) =>
                                  p.id === selectedPhoto.id ? { ...p, caption: val } : p
                                )
                              );
                            }}
                            className="w-full h-11 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-sm"
                          />
                        </div>

                        {/* Individual Per-Intention Visibility Switches */}
                        <div>
                          <p className="text-sm font-bold text-[var(--heading)] mb-2">
                            Individual intention visibility (No automatic crossover):
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map(
                              (intentKey) => {
                                const isVis = selectedPhoto.visibleIn[intentKey];
                                const label = INTENTION_METADATA[intentKey].label;
                                return (
                                  <button
                                    key={intentKey}
                                    type="button"
                                    aria-pressed={isVis}
                                    onClick={() =>
                                      onUpdatePhotos((prev) =>
                                        togglePhotoIntentionVisibility(
                                          prev,
                                          selectedPhoto.id,
                                          intentKey
                                        )
                                      )
                                    }
                                    className={`text-sm px-3.5 py-2 rounded-[8px] border transition-colors cursor-pointer min-h-[42px] ${
                                      isVis
                                        ? 'bg-[var(--surface2)] border-[var(--heading)] text-[var(--heading)] font-bold'
                                        : 'bg-transparent border-[var(--line)] text-[var(--muted)]'
                                    }`}
                                  >
                                    {isVis ? `✓ Visible in ${label}` : `${label} · Hidden`}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* RIGHT: Gallery Thumbnails, Moderation State Previewer & Local File Dropzone */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {photos.map((ph, idx) => {
                        const isSel = ph.id === selectedPhoto?.id;
                        return (
                          <button
                            key={ph.id}
                            type="button"
                            onClick={() => setSelectedPhotoId(ph.id)}
                            className={`text-left rounded-[13px] overflow-hidden border p-2 transition-all cursor-pointer ${
                              isSel
                                ? 'border-[var(--ochre)] bg-[var(--surface2)] ring-1 ring-[var(--ochre)]'
                                : 'border-[var(--line)] bg-[var(--surface)]'
                            }`}
                          >
                            <div className="aspect-[4/5]">
                              <EditorialImage
                                variant={ph.variant as EditorialVariant}
                                localObjectUrl={ph.localObjectUrl}
                                cropTransform={ph.crop}
                                alt={ph.altText || ph.caption}
                                aspectClass="w-full h-full"
                              />
                            </div>
                            <div className="px-1 pt-2 pb-1">
                              <p className="text-xs font-bold text-[var(--heading)] truncate">
                                {idx === 0 ? 'Primary · 4:5' : ph.title}
                              </p>
                              <p className="text-[11px] text-[var(--muted)] truncate">
                                {ph.moderationStatus}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Local Image Picker & Sample Portrait Box */}
                    <div className="border-[1.5px] border-dashed border-[var(--line)] rounded-[14px] bg-[var(--surface2)] p-6 text-center space-y-3">
                      <Upload className="w-6 h-6 text-[var(--heading)] mx-auto" />
                      <p className="text-sm font-bold text-[var(--heading)]">
                        Add another photo (Local preview only)
                      </p>
                      <p className="text-xs text-[var(--muted)] leading-relaxed">
                        Choose an image from your device to test immediate object-URL preview, 4:5 cropping, and visibility switches. No server upload occurs.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-4 py-2.5 text-xs font-bold cursor-pointer min-h-[42px]"
                        >
                          Choose local file...
                        </button>
                        <button
                          type="button"
                          onClick={handleAddSimulatedLocalPortrait}
                          className="rounded-[9px] border border-[var(--line)] bg-[var(--surface)] text-[var(--heading)] px-4 py-2.5 text-xs font-bold cursor-pointer min-h-[42px]"
                        >
                          + Add sample portrait
                        </button>
                      </div>
                    </div>

                    {/* Moderation State Inspector for Selected Photo */}
                    {selectedPhoto && (
                      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                          Preview moderation states on selected photo
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(
                            [
                              'Approved',
                              'Pending review',
                              'Rejected — Guideline note',
                            ] as const
                          ).map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() =>
                                onUpdatePhotos((prev) =>
                                  prev.map((p) =>
                                    p.id === selectedPhoto.id
                                      ? {
                                          ...p,
                                          moderationStatus: st,
                                          moderationNote:
                                            st === 'Rejected — Guideline note'
                                              ? 'Sample guideline note: Please choose a solo portrait in natural daylight without watermarks or text overlays.'
                                              : st === 'Pending review'
                                              ? 'Sample moderation state: Awaiting human guideline check before appearing in discovery.'
                                              : undefined,
                                        }
                                      : p
                                  )
                                )
                              }
                              className={`px-3 py-1.5 rounded-[7px] text-xs font-bold cursor-pointer ${
                                selectedPhoto.moderationStatus === st
                                  ? 'bg-[var(--surface2)] text-[var(--heading)] border border-[var(--heading)]'
                                  : 'border border-[var(--line)] text-[var(--muted)]'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Delete Confirmation Dialog */}
              {photoPendingDelete && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="delete-photo-title"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setPhotoPendingDelete(null);
                  }}
                  className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                >
                  <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] max-w-[420px] w-full p-6 space-y-4">
                    <h2
                      id="delete-photo-title"
                      className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]"
                    >
                      Remove this portrait?
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      &ldquo;{photoPendingDelete.title}&rdquo; will be removed from your local preview gallery across all intentions.
                    </p>
                    <div className="flex items-center justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setPhotoPendingDelete(null)}
                        className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDeletePhoto}
                        className="rounded-[9px] bg-[var(--danger)] text-white px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[42px]"
                      >
                        Confirm remove photo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded Gallery Lightbox Modal */}
              {expandedGalleryPhoto && (
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="lightbox-photo-title"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setExpandedGalleryPhoto(null);
                  }}
                  className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[16px] max-w-[500px] w-full p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        id="lightbox-photo-title"
                        className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]"
                      >
                        {expandedGalleryPhoto.title}
                      </h2>
                      <button
                        type="button"
                        onClick={() => setExpandedGalleryPhoto(null)}
                        aria-label="Close expanded photo modal"
                        className="text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="aspect-[4/5] max-h-[420px] mx-auto">
                      <EditorialImage
                        variant={expandedGalleryPhoto.variant as EditorialVariant}
                        localObjectUrl={expandedGalleryPhoto.localObjectUrl}
                        cropTransform={expandedGalleryPhoto.crop}
                        alt={expandedGalleryPhoto.altText || expandedGalleryPhoto.caption}
                        aspectClass="w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-[var(--text)]">{expandedGalleryPhoto.caption}</p>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: PROFILE & MODE PREVIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Your profile &amp; intention preview
                </p>
                <h1 className="font-serif-editorial text-[38px] sm:text-[43px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                  How you appear in each intention.
                </h1>
                <p className="text-base text-[var(--muted)] mt-1">
                  Edit your details on the left and preview how your card renders inside Friendship, Dating, or Matrimony on the right.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast('Updated your local preview profile.');
                  }}
                  className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="profile-name-input"
                      className="block text-sm font-bold text-[var(--heading)] mb-1"
                    >
                      Display name
                    </label>
                    <input
                      id="profile-name-input"
                      type="text"
                      value={selfName}
                      onChange={(e) => setSelfName(e.target.value)}
                      className="w-full h-11 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-city-input"
                      className="block text-sm font-bold text-[var(--heading)] mb-1"
                    >
                      City
                    </label>
                    <input
                      id="profile-city-input"
                      type="text"
                      value={selfCity}
                      onChange={(e) => setSelfCity(e.target.value)}
                      className="w-full h-11 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-headline-input"
                      className="block text-sm font-bold text-[var(--heading)] mb-1"
                    >
                      Short introduction line
                    </label>
                    <input
                      id="profile-headline-input"
                      type="text"
                      value={selfHeadline}
                      onChange={(e) => setSelfHeadline(e.target.value)}
                      className="w-full h-11 rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-base"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-bio-input"
                      className="block text-sm font-bold text-[var(--heading)] mb-1"
                    >
                      About you
                    </label>
                    <textarea
                      id="profile-bio-input"
                      rows={4}
                      value={selfBio}
                      onChange={(e) => setSelfBio(e.target.value)}
                      className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] p-3.5 text-base leading-relaxed"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] px-5 py-3 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    Save profile preview
                  </button>
                </form>

                {/* Live Intention Mode Preview */}
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--line)]">
                    <span className="text-sm font-bold text-[var(--heading)]">
                      Preview as seen in:
                    </span>
                    <div className="flex items-center gap-1">
                      {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map(
                        (intentKey) => (
                          <button
                            key={intentKey}
                            type="button"
                            onClick={() => setPreviewIntentionMode(intentKey)}
                            className={`px-3 py-1.5 rounded-[7px] text-xs cursor-pointer min-h-[36px] ${
                              previewIntentionMode === intentKey
                                ? 'bg-[var(--surface2)] text-[var(--heading)] font-bold'
                                : 'text-[var(--muted)]'
                            }`}
                          >
                            {INTENTION_METADATA[intentKey].label}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p
                      className="text-xs uppercase tracking-[1px] font-bold"
                      style={{
                        color: INTENTION_METADATA[previewIntentionMode].colorVar,
                      }}
                    >
                      {INTENTION_METADATA[previewIntentionMode].label} scope preview
                    </p>
                    <h2 className="font-serif-editorial text-[32px] font-semibold text-[var(--heading)] mt-1">
                      {selfName}
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      {selfCity} ·{' '}
                      {getVisiblePhotosForIntention(photos, previewIntentionMode).length} photos
                      visible in this intention
                    </p>
                    <p className="text-base font-semibold text-[var(--heading)] mt-3">
                      {selfHeadline}
                    </p>
                    <p className="text-base text-[var(--text)] leading-relaxed mt-2">
                      {selfBio}
                    </p>
                    <div className="mt-4 pt-3 border-t border-[var(--line)] text-sm text-[var(--muted)]">
                      <strong className="text-[var(--heading)]">Scope boundary:</strong>{' '}
                      {INTENTION_METADATA[previewIntentionMode].boundarySummary}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: DEDICATED PRIVACY & INTENTION BOUNDARIES */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Privacy &amp; visibility boundaries
                </p>
                <h1 className="font-serif-editorial text-[38px] sm:text-[43px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                  Your data and intention isolation.
                </h1>
                <p className="text-base text-[var(--muted)] mt-1">
                  Control how your profile, photos, and reflection answers are scoped across Friendship, Dating, and Matrimony.
                </p>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 space-y-4">
                <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
                  Cross-intention isolation rules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map((intentKey) => {
                    const enabled = activeIntentions.includes(intentKey);
                    const visPhotos = getVisiblePhotosForIntention(photos, intentKey).length;
                    return (
                      <div
                        key={intentKey}
                        className="p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--line)] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="text-base text-[var(--heading)]">
                            {INTENTION_METADATA[intentKey].label}
                          </strong>
                          <span className="text-xs font-bold text-[var(--ochre-text)]">
                            {enabled ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <p className="text-[var(--muted)]">
                          {visPhotos} portrait(s) permitted in this intention.
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {INTENTION_METADATA[intentKey].boundarySummary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-editorial text-[26px] font-semibold text-[var(--heading)]">
                    Portable data archive (Simulated preview)
                  </h2>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    Preview how you can export your profile notes, 100-question answers, and photo visibility settings once backend storage is connected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      'Simulated data export: In production, a JSON archive is prepared for download.'
                    )
                  }
                  className="rounded-[9px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] px-4 py-2.5 text-sm font-bold cursor-pointer whitespace-nowrap min-h-[44px]"
                >
                  Preview archive export
                </button>
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS (THEME, REDUCED MOTION & INTENTIONS) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Settings &amp; accessibility
                </p>
                <h1 className="font-serif-editorial text-[38px] sm:text-[43px] leading-[1.05] font-semibold text-[var(--heading)] mt-1">
                  Appearance, motion &amp; account.
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 space-y-3">
                  <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
                    Color theme
                  </h2>
                  <p className="text-sm text-[var(--muted)]">
                    Switch between warm Coromandel daylight and deep evening indigo.
                  </p>
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="rounded-[9px] border border-[var(--line)] bg-[var(--surface2)] text-[var(--heading)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    Current: {isDark ? 'Dark mode (Switch to Light)' : 'Light mode (Switch to Dark)'}
                  </button>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6 space-y-3">
                  <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
                    Motion &amp; 2.5D hero setting
                  </h2>
                  <p className="text-sm text-[var(--muted)]">
                    Kithra respects your system reduced-motion setting and also lets you pause all transitions and 2.5D parallax manually.
                  </p>
                  <button
                    type="button"
                    aria-pressed={manualReduceMotion}
                    onClick={onToggleReduceMotion}
                    className="rounded-[9px] border border-[var(--line)] bg-[var(--surface2)] text-[var(--heading)] px-4 py-2.5 text-sm font-bold cursor-pointer min-h-[44px]"
                  >
                    {manualReduceMotion
                      ? '✓ Reduced motion enabled (Static mode)'
                      : 'Standard calm motion (Click to disable animations)'}
                  </button>
                </div>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-6">
                <h2 className="font-serif-editorial text-[28px] font-semibold text-[var(--heading)]">
                  Enabled intentions
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1 mb-4">
                  Pause or enable any intention without losing your saved connections or reflections.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {(['friendship', 'dating', 'matrimony'] as IntentionId[]).map((intentKey) => {
                    const active = activeIntentions.includes(intentKey);
                    return (
                      <button
                        key={intentKey}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onToggleActiveIntention(intentKey)}
                        className={`px-4 py-2.5 rounded-[9px] border text-sm font-bold cursor-pointer min-h-[44px] ${
                          active
                            ? 'bg-[var(--surface2)] border-[var(--heading)] text-[var(--heading)]'
                            : 'border-[var(--line)] text-[var(--muted)]'
                        }`}
                      >
                        {active
                          ? `✓ ${INTENTION_METADATA[intentKey].label} active`
                          : `${INTENTION_METADATA[intentKey].label} paused`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: MOBILE "MORE" DIRECTORY SCREEN */}
          {activeTab === 'more' && (
            <div className="space-y-5">
              <div>
                <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
                  Member navigation
                </p>
                <h1 className="font-serif-editorial text-[36px] font-semibold text-[var(--heading)] mt-1">
                  More in Your Kithra.
                </h1>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    label: 'Match details (Echo / Counterpoint / Mosaic Fit)',
                    desc: 'Inspect qualitative signals and measured questionnaire bands',
                    path: '/member/match/member-aarav',
                  },
                  {
                    label: 'Connections & saved profiles',
                    desc: 'Mutual introductions and bookmarked cards',
                    path: '/member/connections',
                  },
                  {
                    label: 'Community Circles',
                    desc: 'Small neighbourhood walks and listening sessions',
                    path: '/member/circles',
                  },
                  {
                    label: 'Assessments (100-Question Bank)',
                    desc: 'Browse all 5 reflection themes and save progress',
                    path: '/member/assessments',
                  },
                  {
                    label: 'Your Profile & Intention Preview',
                    desc: 'Edit your bio and preview how you appear per intention',
                    path: '/member/profile',
                  },
                  {
                    label: 'Privacy & Intention Boundaries',
                    desc: 'Cross-intention isolation rules and archive export',
                    path: '/member/privacy',
                  },
                  {
                    label: 'Settings (Theme & Reduced Motion)',
                    desc: 'Appearance, motion controls, and active intentions',
                    path: '/member/settings',
                  },
                  {
                    label: 'Unified Membership (Free / Plus / Connect)',
                    desc: 'Compare plans across all three intentions',
                    path: '/pricing',
                  },
                ].map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => onNavigateMemberPath(item.path)}
                    className="text-left p-4 rounded-[13px] bg-[var(--surface)] border border-[var(--line)] hover:bg-[var(--surface2)]/50 cursor-pointer"
                  >
                    <p className="text-base font-bold text-[var(--heading)]">{item.label}</p>
                    <p className="text-sm text-[var(--muted)] mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AUTHENTICATED MOBILE BOTTOM NAVIGATION BAR (5 PRIMARY ITEMS, >= 44px TOUCH TARGETS) */}
      <nav
        aria-label="Mobile member navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t border-[var(--line)] px-2 py-1.5 grid grid-cols-5 gap-1"
      >
        {[
          { id: 'home', path: '/member/home', label: 'Home', Icon: Home },
          { id: 'discover', path: '/member/discover', label: 'Discover', Icon: Compass },
          {
            id: 'messages',
            path: '/member/messages',
            label: 'Messages',
            Icon: MessageSquare,
          },
          { id: 'photos', path: '/member/photos', label: 'Photos', Icon: ImageIcon },
          { id: 'more', path: '/member/more', label: 'More', Icon: MoreHorizontal },
        ].map(({ id, path, label, Icon }) => {
          const isCurrent =
            activeTab === id ||
            (id === 'more' &&
              ['connections', 'match', 'circles', 'assessments', 'profile', 'privacy', 'settings'].includes(
                activeTab
              ));
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigateMemberPath(path)}
              className={`flex flex-col items-center justify-center min-h-[48px] rounded-[8px] text-xs transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-[var(--surface2)] text-[var(--heading)] font-bold'
                  : 'text-[var(--muted)]'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" aria-hidden="true" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
