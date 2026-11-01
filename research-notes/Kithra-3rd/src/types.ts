export type AppMode = 'public' | 'user' | 'admin';

export type ActiveTab =
  | 'landing'
  | 'login'
  | 'signup'
  | 'home'
  | 'assessment'
  | 'report'
  | 'matches'
  | 'messages'
  | 'journal'
  | 'insights'
  | 'profile'
  | 'billing'
  | 'security'
  | 'settings'
  | 'admin';

export type RelationshipMode = 'friendship' | 'dating' | 'matrimony';

export type MatchingLens = 'echo' | 'counterpoint' | 'mosaic';

export type BrandPalette = 'D2' | 'D5' | 'D1';

export type SupportedLocale = 'EN' | 'HI' | 'TA' | 'TE' | 'ML' | 'KN' | 'BN';

export type HeroNarrativeId = 'H-B' | 'H-A' | 'H-C';

export type BillingTermMonths = 1 | 3 | 6 | 12;

export type MembershipTier = 'free' | 'plus' | 'connect';

export type PhotoVisibilityScope = 'public' | 'matches_only' | 'hidden';

export type AuthFlowState =
  | 'idle'
  | 'submitting'
  | 'invalid_email'
  | 'wrong_credentials'
  | 'rate_limited_429'
  | 'unverified_email'
  | 'session_expired'
  | 'forgot_password';

export type DiscoverViewState =
  | 'normal'
  | 'skeleton'
  | 'empty_city'
  | 'filtered_zero'
  | 'low_coverage'
  | 'error_503';

export type HttpErrorCode =
  | '404'
  | '403'
  | '410'
  | '429'
  | '500'
  | '503'
  | 'offline'
  | 'blocked';

export type DomainType =
  | 'communication'
  | 'values'
  | 'finances'
  | 'lifestyle'
  | 'family'
  | 'intimacy'
  | 'intellectual'
  | 'boundaries';

export type CanonicalThemeCode =
  | 'COMM'
  | 'BOUN'
  | 'TIME'
  | 'FIN'
  | 'FAM'
  | 'SOC'
  | 'VAL'
  | 'EMOT'
  | 'ROLE'
  | 'WORK'
  | 'LEIS'
  | 'TRST';

export interface CanonicalThemeMeta {
  code: CanonicalThemeCode;
  name: string;
  description: string;
  placeholderBankSize: number;
  samplePrompt: string;
  domainKey: DomainType;
}

export interface QuestionOption {
  id: string;
  text: string;
  traits: string[];
  scoreValue?: number;
}

export interface Question {
  id: number;
  itemCode?: string;
  themeCode?: CanonicalThemeCode;
  domain: DomainType;
  text: string;
  context: string;
  isDraftPlaceholder?: boolean;
  options: QuestionOption[];
}

export interface DomainResult {
  score: number;
  summary: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
  coverageCount?: number;
  totalThemeItems?: number;
  band?: string;
}

export interface CompatibilityReport {
  overallScore: number;
  summary: string;
  comparableItemsAnswered: number;
  totalItemsInBank: number;
  modelVersion: string;
  scoringVersion: string;
  domains: Record<DomainType, DomainResult>;
}

export interface MosaicRuleMatch {
  ruleId: string;
  label: string;
  themeCode: CanonicalThemeCode;
  matched: boolean;
  score: number;
  explanation: string;
}

export interface AgreementScoreOutput {
  lens: MatchingLens;
  band: 'Strong agreement' | 'Notable agreement' | 'Moderate agreement' | 'Mixed rhythm' | 'Insufficient coverage';
  score: number | null;
  coverageCount: number;
  totalEligibleCount: number;
  coverageRatio: number;
  modelVersion: string;
  scoringVersion: string;
  caveat: string;
  topSharedThemes: string[];
  topFrictionPoints: string[];
  mosaicRules?: MosaicRuleMatch[];
}

export interface ScenarioSimulationResult {
  scenarioId: string;
  title: string;
  context: string;
  lens: MatchingLens;
  agreementBand: string;
  score: number;
  whatWorks: string;
  watchOutFor: string;
  deterministicCheckInPrompt: string;
}

export interface ModeEnrollmentState {
  mode: RelationshipMode;
  enabled: boolean;
  discoverableConsent: boolean;
  paused: boolean;
  bio: string;
  intentSummary: string;
}

export interface MemberPhoto {
  id: string;
  url: string;
  caption: string;
  aspectRatio: '4:5';
  moderationStatus: 'approved' | 'pending' | 'quarantined';
  exifStripped: boolean;
  blurUntilApproved: boolean;
  visibilityByMode: Record<RelationshipMode, PhotoVisibilityScope>;
}

export interface MatchUser {
  id: string;
  name: string;
  age: number;
  location: string;
  distanceKm: number;
  occupation: string;
  bio: string;
  modeBios: Partial<Record<RelationshipMode, string>>;
  avatar: string;
  compatibilityScore: number;
  lensScores: Record<MatchingLens, number>;
  agreementBand: string;
  coverageCount: number;
  totalEligibleItems: number;
  modelVersion: string;
  enabledModes: RelationshipMode[];
  modeConsent: Record<RelationshipMode, boolean>;
  photoVisibilityByMode: Record<RelationshipMode, PhotoVisibilityScope>;
  sharedThemes: string[];
  frictionPoints: string[];
  mosaicRuleHighlights: string[];
  domains: Record<DomainType, number>;
  topTraits: string[];
  intent: string;
  connectionState: 'connected' | 'incoming_request' | 'outgoing_request' | 'none';
  requestMessage?: string;
  lastActiveLabel: string;
  languages: string[];
}

export interface CommunityCircle {
  id: string;
  name: string;
  mode: RelationshipMode;
  city: string;
  topic: string;
  memberCount: number;
  maxCapacity: number;
  nextGatheringLabel: string;
  rulesAccepted: boolean;
  joined: boolean;
  hostName: string;
  description: string;
  messages: Array<{
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }>;
}

export type StaffRole =
  | 'support_tier_1'
  | 'support_tier_2'
  | 'trust_safety_analyst'
  | 'trust_safety_lead'
  | 'photo_moderator'
  | 'billing_ops'
  | 'content_psychometrics_editor'
  | 'privacy_dpo_officer'
  | 'sre_release_operator'
  | 'superadmin';

export interface ModerationCase {
  caseId: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
  queue: 'safety_reports' | 'photo_moderation' | 'appeals' | 'billing_refunds';
  status: 'open' | 'in_review' | 'resolved';
  mode: RelationshipMode;
  reportedMemberId: string;
  reporterMemberId: string;
  reasonCode: string;
  createdAt: string;
  slaDueInMinutes: number;
  summary: string;
  evidenceRedactedPreview: string;
  jitUnlocked: boolean;
  jitExpiresAt?: string;
  entityGraph: Array<{
    id: string;
    type: 'Case' | 'Report' | 'Evidence' | 'Actor' | 'Action' | 'Appeal';
    label: string;
    meta: string;
  }>;
}

export interface AuditLogEvent {
  eventId: string;
  timestampIso: string;
  actorId: string;
  actorRole: StaffRole;
  actionType: string;
  targetId: string;
  reasonCode: string;
  prevHash: string;
  eventHash: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
