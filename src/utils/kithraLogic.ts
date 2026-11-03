import {
  AdminTab,
  AssessmentQuestion,
  DiscoveryLensView,
  IntentionId,
  MemberEligibilityRequirements,
  MemberPhoto,
  MemberProfile,
  MemberTab,
  PhotoCropTransform,
  QualitativeAlignment,
  RelationshipSignalKind,
  ShellSection,
  SimilarityPresetId,
  StaffCase,
  SystemErrorCode,
} from '../types/kithra';
import {
  filterProfilesByFullSimilaritySpectrum,
  resolvePresetRange,
} from '../domain/psychologyEngine';

export interface ParsedRoute {
  pathname: string;
  section: ShellSection;
  memberTab: MemberTab;
  adminTab: AdminTab;
  stateCode: SystemErrorCode;
  matchMemberId?: string;
}

const VALID_MEMBER_TABS: MemberTab[] = [
  'home',
  'discover',
  'connections',
  'match',
  'messages',
  'circles',
  'assessments',
  'insights',
  'photos',
  'profile',
  'privacy',
  'settings',
  'more',
];

const VALID_ADMIN_TABS: AdminTab[] = [
  'overview',
  'members',
  'growth',
  'profiles',
  'connections',
  'subscriptions',
  'revenue',
  'map',
  'support',
  'safety',
  'photos',
  'staff',
  'audit',
  'questions',
  'settings',
  'reports',
  'users',
  'groups',
  'privacy',
  'analytics',
];

export function parsePathnameToRoute(rawPathname: string): ParsedRoute {
  const clean = (rawPathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  const defaults: Omit<ParsedRoute, 'pathname' | 'section'> = {
    memberTab: 'discover',
    adminTab: 'overview',
    stateCode: '404',
  };

  if (clean === '/') {
    return { pathname: '/', section: 'landing', ...defaults };
  }
  if (clean === '/signin') {
    return { pathname: '/signin', section: 'signin', ...defaults };
  }
  if (clean === '/join') {
    return { pathname: '/join', section: 'join', ...defaults };
  }
  if (clean === '/forgot-password' || clean === '/recover') {
    return { pathname: '/forgot-password', section: 'recover', ...defaults };
  }
  if (clean === '/verify-email') {
    return { pathname: '/verify-email', section: 'verify-email', ...defaults };
  }
  if (clean === '/locked') {
    return { pathname: '/locked', section: 'locked', ...defaults };
  }
  if (clean === '/onboarding') {
    return { pathname: '/onboarding', section: 'onboarding', ...defaults };
  }
  if (clean === '/pricing') {
    return { pathname: '/pricing', section: 'pricing', ...defaults };
  }
  if (clean === '/__preview') {
    return { pathname: '/__preview', section: 'dev-preview', ...defaults, stateCode: 'inventory' };
  }

  // Member routes
  if (clean === '/member') {
    return { pathname: '/member/home', section: 'member', ...defaults, memberTab: 'home' };
  }
  if (clean.startsWith('/member/match/')) {
    const matchId = clean.replace('/member/match/', '').trim() || 'member-aarav';
    return {
      pathname: `/member/match/${matchId}`,
      section: 'member',
      ...defaults,
      memberTab: 'match',
      matchMemberId: matchId,
    };
  }
  if (clean.startsWith('/member/')) {
    const sub = clean.replace('/member/', '') as MemberTab;
    if (VALID_MEMBER_TABS.includes(sub)) {
      return { pathname: clean, section: 'member', ...defaults, memberTab: sub };
    }
  }

  // Admin routes
  if (clean === '/admin/login') {
    return { pathname: '/admin/login', section: 'admin-login', ...defaults };
  }
  if (clean === '/admin') {
    return { pathname: '/admin/overview', section: 'admin', ...defaults, adminTab: 'overview' };
  }
  if (clean.startsWith('/admin/')) {
    const sub = clean.replace('/admin/', '') as AdminTab;
    if (VALID_ADMIN_TABS.includes(sub)) {
      return { pathname: clean, section: 'admin', ...defaults, adminTab: sub };
    }
  }

  // Error & system routes
  const errorMap: Record<string, SystemErrorCode> = {
    '/404': '404',
    '/403': '403',
    '/410': '410',
    '/429': '429',
    '/500': '500',
    '/503': '503',
    '/offline': 'offline',
    '/empty': 'empty',
    '/loading': 'loading',
    '/image-error': 'image-fallback',
    '/image-fallback': 'image-fallback',
    '/validation': 'validation',
    '/states': 'inventory',
  };

  if (errorMap[clean]) {
    return {
      pathname: clean,
      section: 'states',
      ...defaults,
      stateCode: errorMap[clean],
    };
  }

  // Fallback to 404 for unknown routes
  return {
    pathname: clean,
    section: 'states',
    ...defaults,
    stateCode: '404',
  };
}

export function getPageTitleForRoute(route: ParsedRoute): string {
  switch (route.section) {
    case 'landing':
      return 'Kithra — Connections with Intention';
    case 'signin':
      return 'Sign in · Kithra';
    case 'join':
      return 'Create account · Kithra';
    case 'recover':
      return 'Forgot password · Kithra';
    case 'verify-email':
      return 'Verify your email · Kithra';
    case 'locked':
      return 'Account access paused · Kithra';
    case 'onboarding':
      return 'Intention setup · Kithra';
    case 'pricing':
      return 'Unified Membership · Kithra';
    case 'member': {
      const titles: Record<MemberTab, string> = {
        home: 'Home · Your Kithra',
        discover: 'Discover introductions · Kithra',
        connections: 'Connections & saved profiles · Kithra',
        match: 'Similar to Me, Different from Me & We Balance Each Other · Kithra',
        messages: 'Messages · Kithra',
        circles: 'Community Circles · Kithra',
        assessments: 'Reflection Questions (100-Question Map) · Kithra',
        insights: 'Psychological Self-Understanding · Kithra',
        photos: 'Photo Manager & Visibility · Kithra',
        profile: 'Your Profile & Intention Preview · Kithra',
        privacy: 'Privacy & Intention Boundaries · Kithra',
        settings: 'Account Settings · Kithra',
        more: 'More · Kithra',
      };
      return titles[route.memberTab] || 'Member Workspace · Kithra';
    }
    case 'admin-login':
      return 'Staff Sign-In Preview · Kithra';
    case 'admin':
      return `Staff ${route.adminTab.charAt(0).toUpperCase() + route.adminTab.slice(1)} (Preview) · Kithra`;
    case 'dev-preview':
      return 'Developer Design QA & Route Directory · Kithra';
    case 'states':
      return `System State (${route.stateCode.toUpperCase()}) · Kithra`;
    default:
      return 'Kithra — Connections with Intention';
  }
}

export interface ProfileFilterCriteria {
  intention: IntentionId | 'all';
  city: string;
  searchQuery: string;
  savedOnly: boolean;
  minSimilarity?: number;
  maxSimilarity?: number;
  similarityPreset?: SimilarityPresetId;
  lensView?: DiscoveryLensView;
  sortBySimilarity?: 'desc' | 'asc' | 'none';
  viewerEligibility?: MemberEligibilityRequirements;
}

export function filterProfiles(
  profiles: MemberProfile[],
  criteria: ProfileFilterCriteria
): MemberProfile[] {
  const hasSpectrumFilter =
    criteria.minSimilarity !== undefined ||
    criteria.maxSimilarity !== undefined ||
    criteria.similarityPreset !== undefined ||
    criteria.lensView !== undefined ||
    criteria.sortBySimilarity !== undefined ||
    criteria.viewerEligibility !== undefined;

  if (hasSpectrumFilter) {
    const presetBounds = criteria.similarityPreset
      ? resolvePresetRange(
        criteria.similarityPreset,
        criteria.minSimilarity ?? 0,
        criteria.maxSimilarity ?? 100
      )
      : {
        min: criteria.minSimilarity ?? 0,
        max: criteria.maxSimilarity ?? 100,
      };

    return filterProfilesByFullSimilaritySpectrum(profiles, {
      intention: criteria.intention,
      city: criteria.city,
      searchQuery: criteria.searchQuery,
      savedOnly: criteria.savedOnly,
      minSimilarity: presetBounds.min,
      maxSimilarity: presetBounds.max,
      lensView: criteria.lensView ?? 'all',
      sortBySimilarity: criteria.sortBySimilarity ?? 'none',
      viewerEligibility: criteria.viewerEligibility,
    });
  }

  const normalizedQuery = criteria.searchQuery.trim().toLowerCase();

  return profiles.filter((profile) => {
    if (criteria.intention !== 'all') {
      if (!profile.intentions.includes(criteria.intention)) {
        return false;
      }
    } else if (criteria.viewerEligibility) {
      const viewerIntentions = criteria.viewerEligibility.enabledIntentions ?? [];
      const shared = viewerIntentions.filter((i) => profile.intentions.includes(i as IntentionId));
      if (shared.length === 0) {
        return false;
      }
    }
    if (criteria.city !== 'All cities' && profile.city !== criteria.city) {
      return false;
    }
    if (criteria.savedOnly && !profile.saved) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const searchable = [
        profile.name,
        profile.city,
        profile.headline,
        profile.bio,
        profile.occupation,
        ...profile.interests,
        ...profile.languages,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export interface AuthValidationInput {
  mode: 'signin' | 'join' | 'recover';
  email: string;
  password?: string;
  fullName?: string;
  city?: string;
}

export interface AuthValidationResult {
  valid: boolean;
  errors: {
    email?: string;
    password?: string;
    fullName?: string;
    city?: string;
  };
}

export function validateAuthForm(input: AuthValidationInput): AuthValidationResult {
  const errors: AuthValidationResult['errors'] = {};
  const trimmedEmail = input.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.email = 'Enter a complete email address, such as name@example.com.';
  }

  if (input.mode !== 'recover') {
    const pwd = input.password ?? '';
    if (!pwd) {
      errors.password = 'Please enter a password.';
    } else if (pwd.length < 8) {
      errors.password = 'Use at least 8 characters for your password.';
    }
  }

  if (input.mode === 'join') {
    if (!input.fullName || input.fullName.trim().length < 2) {
      errors.fullName = 'Please share the name you would like members to see.';
    }
    if (!input.city || input.city.trim().length < 2) {
      errors.city = 'Please select or enter your primary city.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function togglePhotoIntentionVisibility(
  photos: MemberPhoto[],
  photoId: string,
  intention: IntentionId
): MemberPhoto[] {
  return photos.map((photo) => {
    if (photo.id !== photoId) return photo;
    return {
      ...photo,
      visibleIn: {
        ...photo.visibleIn,
        [intention]: !photo.visibleIn[intention],
      },
    };
  });
}

export function getVisiblePhotosForIntention(
  photos: MemberPhoto[],
  intention: IntentionId
): MemberPhoto[] {
  return photos.filter((photo) => photo.visibleIn[intention]);
}

export function reorderPhotos(
  photos: MemberPhoto[],
  photoId: string,
  direction: 'up' | 'down'
): MemberPhoto[] {
  const index = photos.findIndex((p) => p.id === photoId);
  if (index === -1) return photos;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= photos.length) return photos;

  const next = [...photos];
  const [moved] = next.splice(index, 1);
  next.splice(targetIndex, 0, moved);

  return next.map((item, idx) => ({
    ...item,
    isPrimary: idx === 0,
  }));
}

export function applyPhotoCropAdjustment(
  current: PhotoCropTransform,
  patch: Partial<PhotoCropTransform>
): PhotoCropTransform {
  const zoom =
    patch.zoom !== undefined
      ? Math.min(2.2, Math.max(1.0, Number(patch.zoom.toFixed(2))))
      : current.zoom;
  const panX =
    patch.panX !== undefined
      ? Math.min(40, Math.max(-40, Math.round(patch.panX)))
      : current.panX;
  const panY =
    patch.panY !== undefined
      ? Math.min(40, Math.max(-40, Math.round(patch.panY)))
      : current.panY;
  const rotation =
    patch.rotation !== undefined ? patch.rotation : current.rotation;

  return { zoom, panX, panY, rotation };
}

export function groupAlignmentByKind(
  alignments: QualitativeAlignment[],
  intention?: IntentionId | 'all'
): Record<RelationshipSignalKind, QualitativeAlignment[]> {
  const filtered =
    !intention || intention === 'all'
      ? alignments
      : alignments.filter((a) => a.applicableIntentions.includes(intention));

  return {
    echo: filtered.filter((a) => a.kind === 'echo'),
    counterpoint: filtered.filter((a) => a.kind === 'counterpoint'),
    mosaic: filtered.filter((a) => a.kind === 'mosaic'),
  };
}

export interface StaffCaseFilter {
  priority: 'All' | 'High' | 'Normal';
  status: 'All' | StaffCase['status'];
  query: string;
}

export function filterStaffCases(
  cases: StaffCase[],
  filter: StaffCaseFilter
): StaffCase[] {
  const q = filter.query.trim().toLowerCase();
  return cases.filter((c) => {
    if (filter.priority !== 'All' && c.priority !== filter.priority) return false;
    if (filter.status !== 'All' && c.status !== filter.status) return false;
    if (q.length > 0) {
      const hay = `${c.id} ${c.category} ${c.summary} ${c.reportedContext} ${c.assignedTo}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function computeAssessmentProgress(
  questions: AssessmentQuestion[],
  answers: Record<string, string>
): { answeredCount: number; totalCount: number; percent: number } {
  const totalCount = questions.length;
  if (totalCount === 0) {
    return { answeredCount: 0, totalCount: 0, percent: 0 };
  }
  const answeredCount = questions.filter((q) => Boolean(answers[q.id])).length;
  const percent = Math.round((answeredCount / totalCount) * 100);
  return { answeredCount, totalCount, percent };
}
