export type IntentionId = 'friendship' | 'dating' | 'matrimony';

export type RelationshipSignalKind = 'echo' | 'counterpoint' | 'mosaic';

export type ShellSection =
  | 'landing'
  | 'signin'
  | 'join'
  | 'recover'
  | 'verify-email'
  | 'locked'
  | 'onboarding'
  | 'pricing'
  | 'member'
  | 'admin-login'
  | 'admin'
  | 'states'
  | 'dev-preview';

export type MemberTab =
  | 'home'
  | 'discover'
  | 'connections'
  | 'match'
  | 'messages'
  | 'circles'
  | 'assessments'
  | 'photos'
  | 'profile'
  | 'privacy'
  | 'settings'
  | 'more';

export type AdminTab =
  | 'overview'
  | 'reports'
  | 'photos'
  | 'users'
  | 'groups'
  | 'support'
  | 'subscriptions'
  | 'privacy'
  | 'staff'
  | 'audit';

export type SystemErrorCode =
  | '404'
  | '403'
  | '410'
  | '429'
  | '500'
  | '503'
  | 'offline'
  | 'empty'
  | 'loading'
  | 'image-fallback'
  | 'validation'
  | 'inventory';

export interface QualitativeAlignment {
  id: string;
  kind: RelationshipSignalKind;
  theme: string;
  summary: string;
  sharedSignals: string[];
  conversationPrompt: string;
  applicableIntentions: IntentionId[];
}

export interface MeasuredAlignmentDimension {
  id: string;
  dimension: string;
  signalKind: RelationshipSignalKind;
  bandLabel: string;
  bandRangeText: string;
  visualFillPercent: number;
  viewerStance: string;
  memberStance: string;
  interpretationNote: string;
  applicableIntentions: IntentionId[];
}

export interface MemberProfile {
  id: string;
  name: string;
  ageRange: string;
  city: string;
  neighborhood?: string;
  languages: string[];
  intentions: IntentionId[];
  primaryIntention: IntentionId;
  headline: string;
  bio: string;
  interests: string[];
  paceNote: string;
  occupation: string;
  portraitVariant: string;
  alignment: QualitativeAlignment[];
  measuredDimensions: MeasuredAlignmentDimension[];
  connectionState: 'discover' | 'connected' | 'note-sent';
  saved: boolean;
}

export interface PhotoCropTransform {
  zoom: number;
  panX: number;
  panY: number;
  rotation: 0 | 90 | 180 | 270;
}

export interface MemberPhoto {
  id: string;
  title: string;
  caption: string;
  altText: string;
  isPrimary: boolean;
  aspectRatio: '4:5' | '1:1';
  variant: string;
  localObjectUrl?: string;
  crop: PhotoCropTransform;
  visibleIn: Record<IntentionId, boolean>;
  moderationStatus: 'Approved' | 'Pending review' | 'Rejected — Guideline note';
  moderationNote?: string;
}

export interface QuestionThemeMapItem {
  id: string;
  themeNumber: string;
  title: string;
  subtitle: string;
  totalQuestions: number;
  completedQuestions: number;
  applicableIntentions: IntentionId[];
  sampleTopics: string[];
}

export interface AssessmentQuestion {
  id: string;
  themeId: string;
  questionNumber: number;
  module:
    | 'Conversational Pace & Presence'
    | 'Everyday Values & Repair'
    | 'Social Energy & Community'
    | 'Independence, Home & Finances'
    | 'Long-Term Partnership & Family Context';
  intentionScope: 'All intentions' | 'Friendship & Dating' | 'Matrimony & Partnership';
  applicableIntentions: IntentionId[];
  prompt: string;
  context: string;
  whyWeAsk: string;
  options: {
    id: string;
    label: string;
    reflection: string;
    signalEffect: string;
  }[];
}

export interface MessageItem {
  id: string;
  sender: 'self' | 'member';
  text: string;
  timestamp: string;
}

export interface ConversationThread {
  id: string;
  memberId: string;
  memberName: string;
  city: string;
  intention: IntentionId;
  portraitVariant: string;
  contextNote: string;
  messages: MessageItem[];
}

export interface CommunityCircle {
  id: string;
  title: string;
  city: string;
  format:
    | 'In-person walk'
    | 'Listening session'
    | 'Small table conversation'
    | 'Online reading circle';
  intention: IntentionId;
  cadence: string;
  memberCount: number;
  description: string;
  joined: boolean;
}

export interface StaffCase {
  id: string;
  category:
    | 'Impersonation concern'
    | 'Photo report'
    | 'Group moderation'
    | 'Boundary concern'
    | 'Account verification';
  priority: 'High' | 'Normal';
  status: 'Awaiting review' | 'In queue' | 'Assigned' | 'Resolved (Preview)';
  reportedContext: string;
  submittedAt: string;
  assignedTo: string;
  summary: string;
  notes: string[];
}

export interface PhotoModerationItem {
  id: string;
  memberHandle: string;
  submittedAt: string;
  aspectRatio: '4:5' | '1:1';
  requestedVisibility: IntentionId[];
  caption: string;
  variant: string;
  status: 'Awaiting review' | 'Approved (Preview)' | 'Replacement requested';
  guidelineCheck: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
}

export interface RouteInventoryItem {
  id: string;
  routePath: string;
  shell: 'Public' | 'Member' | 'Staff / Admin' | 'System & States' | 'Developer QA';
  screenName: string;
  keyStates: string[];
  targetSection: ShellSection;
  targetMemberTab?: MemberTab;
  targetAdminTab?: AdminTab;
  targetStateCode?: SystemErrorCode;
}
