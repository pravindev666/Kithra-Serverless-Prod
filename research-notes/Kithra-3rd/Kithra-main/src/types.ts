export type RelationshipMode = 'friendship' | 'dating' | 'matrimony';

export type MatchingLens = 'echo' | 'counterpoint' | 'mosaic';

export type BrandPalette = 'd2' | 'd5' | 'd1';

export type SupportedLocale = 'en' | 'hi' | 'ta' | 'te' | 'ml' | 'kn' | 'bn';

export type HeroNarrativeId = 'H-B' | 'H-A' | 'H-C';

export type ActiveTab = 
  | 'home'
  | 'landing' 
  | 'login'
  | 'signup'
  | 'assessment' 
  | 'report' 
  | 'matches' 
  | 'messages' 
  | 'journal' 
  | 'insights' 
  | 'profile' 
  | 'settings'
  | 'billing'
  | 'security' 
  | 'admin';

export type AppMode = 'public' | 'user' | 'admin';

export type HttpErrorCode = '404' | '403' | '410' | '429' | '500' | '503' | 'offline' | 'blocked';

export type ProfileSubTab = 
  | 'Identity'
  | 'Photos'
  | 'Mode Visibility'
  | 'Values'
  | 'Lifestyle'
  | 'Compatibility DNA'
  | 'Verification';

export type ReportSubTab = 
  | 'Overview'
  | 'Relationship Map'
  | 'Communication'
  | 'Lifestyle'
  | 'Family'
  | 'Conflict'
  | 'Growth'
  | 'Financial'
  | 'What We Do Not Measure';

export type QuestionDomain = 
  | 'Communication'
  | 'Values'
  | 'Lifestyle'
  | 'Emotions'
  | 'Goals'
  | 'Family'
  | 'Conflict'
  | 'Purpose';

export type CanonicalThemeId =
  | 'conversation_conflict'
  | 'values_priorities'
  | 'emotional_regulation'
  | 'social_rhythms'
  | 'boundaries_privacy'
  | 'conflict_repair'
  | 'trust_reliability'
  | 'life_plans'
  | 'interests_learning'
  | 'routines_lifestyle'
  | 'community_collaboration'
  | 'compatibility_preferences';

export interface CanonicalThemeMeta {
  id: CanonicalThemeId;
  title: string;
  domain: QuestionDomain;
  edition: string;
  version: string;
  itemCount: number;
  estimatedMinutes: number;
  status: 'published_draft' | 'editorial_review' | 'psychometric_review';
  description: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  scoreValue: number; // Normalized 0.0 to 1.0 for deterministic scoring
  traitWeight: Record<string, number>;
}

export interface Question {
  id: number;
  itemCode: string; // e.g. KT-BNK-01-037
  domain: QuestionDomain;
  themeId?: CanonicalThemeId;
  questionText: string;
  subtext?: string;
  reverseKeyed?: boolean;
  isDraftPlaceholder?: boolean;
  options: QuestionOption[];
}

export interface DomainScore {
  domain: QuestionDomain;
  score: number; // 0 to 100
  coverage: number; // 0.0 to 1.0
  band: 'High Agreement' | 'Balanced' | 'Moderate' | 'Contrasting' | 'Insufficient Data';
  label: string;
  summary: string;
  details: string;
}

export interface PsychometricReport {
  modelVersion: string;
  scoringVersion: string;
  comparableItemsAnswered: number;
  totalItemsInBank: number;
  overallSelfAwareness: number;
  communicationStyle: string;
  conflictStyle: string;
  stressResponse: string;
  loveLanguagePrimary: string;
  attachmentStyle: string;
  financialBehavior: string;
  growthMindsetScore: number;
  domainScores: DomainScore[];
  keyStrengths: string[];
  growthAreas: string[];
  withdrawnAt?: string | null;
}

export type PhotoVisibilityLevel = 'public' | 'matches-only' | 'hidden';

export interface MemberPhoto {
  id: string;
  url: string;
  caption: string;
  aspectRatio: '4:5' | '1:1' | '16:9';
  isPrimary: boolean;
  blurUntilApproved: boolean;
  status: 'approved' | 'processing' | 'held_for_review' | 'rejected';
  exifScrubbed: boolean;
  modeVisibility: Record<RelationshipMode, PhotoVisibilityLevel>;
}

export interface ModeEnrollmentState {
  mode: RelationshipMode;
  enabled: boolean;
  paused: boolean;
  consentGranted: boolean;
  consentVersion: string;
  consentedAt: string | null;
  displayName: string;
  bio: string;
  familyInviteOptIn?: boolean; // Matrimony only, explicit opt-in
}

export interface MatchUser {
  id: string;
  name: string;
  initials: string;
  age: number;
  location: string;
  avatarUrl: string;
  hasPhoto: boolean;
  isVerified: boolean;
  modesEnabled: RelationshipMode[];
  primaryMode: RelationshipMode;
  matchPercentage: number; // Echo Agreement Index
  counterpointPercentage: number; // Counterpoint Index
  mosaicPercentage: number; // Mosaic Fit Index
  mosaicRuleMatched?: string;
  comparableAnswered: number;
  totalComparablePool: number;
  modelVersion: string;
  agreementBand: 'Similar (80–89)' | 'High Agreement (90+)' | 'Notable Overlap (70–79)' | 'Complementary Mosaic' | 'Distinct Perspective';
  tagline: string;
  profession: string;
  communicationStyle: string;
  conflictStyle: string;
  topSharedValues: string[];
  whyYouAlign: string;
  potentialFrictionPoint: string;
  unmeasuredAreas: string[];
  verifiedBadges: string[];
  bio: string;
  dimensions: Record<QuestionDomain, number>; // 0 to 100
  connectionState?: 'eligible' | 'request_received' | 'request_sent' | 'connected' | 'blocked';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  sequence: number;
  mode: RelationshipMode;
  deliveryState: 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';
  isEncrypted: boolean;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  image?: string;
}

export interface CommunityCircle {
  id: string;
  name: string;
  mode: RelationshipMode;
  city: string;
  memberCount: number;
  visibility: 'public_mode' | 'invite_only';
  state: 'active' | 'pending_review' | 'archived';
  description: string;
  nextActivity: string;
  rulesSummary: string;
  joined: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  domain: QuestionDomain;
  insight: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'Science & Methodology' | 'Privacy & Security' | 'Matches & Platform' | 'Pricing & Account';
}

export type StaffRole =
  | 'trust_safety'
  | 'photo_moderator'
  | 'privacy_officer'
  | 'billing_agent'
  | 'psychometric_reviewer'
  | 'support_agent'
  | 'grievance_officer'
  | 'auditor_readonly'
  | 'ops_engineer'
  | 'superadmin';

export interface ModerationCase {
  id: string;
  queue: 'Urgent Safety' | 'Impersonation' | 'Photo Review' | 'Data Deletion' | 'Subscription Dispute' | 'Circle Policy';
  severity: 'URGENT' | 'HIGH' | 'STANDARD';
  state: 'New' | 'Triage' | 'Assigned' | 'Investigating' | 'Action Proposed' | 'Actioned' | 'Appeal' | 'Closed';
  ownerRole: StaffRole;
  ownerHandle: string;
  slaRemaining: string;
  subjectPseudonym: string;
  modeContext: RelationshipMode;
  summary: string;
  evidenceRefs: {
    id: string;
    type: 'photo_ref' | 'message_excerpt' | 'billing_ledger' | 'profile_snapshot';
    label: string;
    redactedByDefault: boolean;
  }[];
  createdAt: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: StaffRole;
  action: string;
  caseId: string;
  reason: string;
  prevHash: string;
  eventHash: string;
}
