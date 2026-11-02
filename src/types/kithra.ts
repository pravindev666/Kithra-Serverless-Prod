export type IntentionId = 'friendship' | 'dating' | 'matrimony';

/**
 * Internal stable identifiers preserved for backend/storage compatibility ('echo' | 'counterpoint' | 'mosaic').
 * Member-facing UI displays:
 * - 'echo' -> 'Similar to Me'
 * - 'counterpoint' -> 'Different from Me'
 * - 'mosaic' -> 'We Balance Each Other'
 */
export type RelationshipSignalKind = 'echo' | 'counterpoint' | 'mosaic';

export type DiscoveryLensView =
  | 'all'
  | 'similar_to_me'
  | 'different_from_me'
  | 'we_balance_each_other';

export type SimilarityPresetId =
  | 'all_0_100'
  | 'very_similar_80_100'
  | 'somewhat_similar_50_79'
  | 'quite_different_0_49'
  | 'custom';

export type ConstructLayerId =
  | 'personality_traits'
  | 'personal_values'
  | 'communication'
  | 'emotional_regulation'
  | 'conflict_repair'
  | 'trust_reliability'
  | 'autonomy_boundaries'
  | 'daily_lifestyle'
  | 'social_friendship'
  | 'romantic_expectations'
  | 'family_domestic'
  | 'adaptability_change'
  | 'C1_openness'
  | 'C2_planfulness'
  | 'C3_social_energy'
  | 'C4_warmth'
  | 'C5_steadiness'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | (string & {});

export type QuestionFormatType =
  | 'direct_preference'
  | 'situational_judgment'
  | 'contextual_trait'
  | 'values_tradeoff'
  | 'forced_choice'
  | 'importance_boundary'
  | 'optional_reflection';

export type ImportanceLevel =
  | 'essential'
  | 'important'
  | 'strong_preference'
  | 'flexible'
  | 'not_important'
  | 'unsure'
  | 'prefer_not_to_answer';

export type RelationshipStructureRequirement =
  | 'exclusive_required'
  | 'exclusive_preferred'
  | 'open_required'
  | 'open_preferred'
  | 'flexible_either'
  | 'unknown'
  | 'prefer_not_to_answer';

export type LongTermChildrenPreference =
  | 'wants_children'
  | 'does_not_want_children'
  | 'open_or_flexible'
  | 'open_or_unsure'
  | 'unknown'
  | 'prefer_not_to_answer';

export type SmokingHabitStatus =
  | 'non_smoker'
  | 'occasional_social_smoker'
  | 'regular_smoker'
  | 'vape_only'
  | 'prefer_not_to_say'
  | 'unknown';

export type SmokingEnvironmentComfort =
  | 'smoke_free_only'
  | 'outdoors_only'
  | 'fully_comfortable'
  | 'prefer_not_to_say'
  | 'unknown';

export type PartnerSmokingRequirement =
  | 'must_be_non_smoker'
  | 'occasional_or_vape_acceptable'
  | 'no_preference'
  | 'prefer_not_to_say'
  | 'unknown';

export interface SmokingVapingProfile {
  personalHabit: SmokingHabitStatus;
  environmentComfort: SmokingEnvironmentComfort;
  partnerRequirementByIntention: Partial<Record<IntentionId, PartnerSmokingRequirement>>;
  isVoluntarilyDisclosed: boolean;
}

export type AssessmentStage =
  | 'stage_1_lightweight'
  | 'stage_2_initial'
  | 'stage_3_thematic_deep'
  | 'stage_4_reassessment'
  | 1
  | 2
  | 3;

export type ResponseQualityState =
  | 'valid_high_confidence'
  | 'valid_provisional'
  | 'clarification_needed'
  | 'low_confidence_validity'
  | 'no_concern_detected'
  | 'further_clarification_recommended'
  | 'insufficient_reliable_information';

export type ArchetypeConfidenceBand =
  | 'insufficient_for_pattern'
  | 'provisional_early_note'
  | 'developing_pattern'
  | 'established_experimental_pattern';

export type ExperimentalArchetypeId =
  | 'steady_anchor'
  | 'warm_bridge'
  | 'curious_spark'
  | 'mosaic_builder'
  | 'deep_current'
  | 'horizon_planner'
  | 'calm_rhythm'
  | 'circle_gatherer';

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
  | 'audit'
  | 'questions';

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

export interface MemberEligibilityRequirements {
  memberId?: string;
  isAdult?: boolean;
  isAdultVerified?: boolean;
  enabledIntentions: IntentionId[];
  discoverableInIntentions?: IntentionId[];
  discoveryEnabledByIntention?: Record<IntentionId, boolean>;
  blockedMemberIds: string[];
  relationshipStructure?: RelationshipStructureRequirement;
  relationshipStructureByIntention?: Partial<
    Record<IntentionId, RelationshipStructureRequirement>
  >;
  relationshipStructureImportance?: ImportanceLevel;
  childrenPreference?: LongTermChildrenPreference;
  childrenRequirementLevel?: ImportanceLevel;
  childrenPreferenceImportance?: ImportanceLevel;
  relocationOpenness?: 'open' | 'anchored_in_city' | 'flexible' | 'unknown';
  smokingVapingProfile?: SmokingVapingProfile;
}

export interface ConstructVectorPoint {
  constructId: ConstructLayerId;
  constructName?: string;
  layer?: 'personality' | 'values' | 'preferences' | 'boundaries';
  /** Normalized 0..100 continuous construct value */
  score: number;
  /** Measurement confidence (0..1) */
  confidence?: number;
  /** Flexibility / openness to difference on this construct (0..100) */
  flexibility?: number;
  /** Welcomes complementary partner contrast on this construct */
  welcomesComplementarity?: boolean;
  /** Answered item count contributing to this construct */
  itemCount?: number;
  answeredItemCount?: number;
  importance?: ImportanceLevel;
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
  /**
   * Deterministic 0-100 Attribute Similarity Score relative to the active member
   * (or null when comparable questionnaire responses are insufficient).
   */
  attributeSimilarityScore?: number | null;
  /**
   * Measured complementary balance indicator (0-100) when both members welcome complementary habits.
   */
  complementaryBalanceScore?: number;
  /**
   * Plain-language card summaries for the three discovery lenses:
   * - Shared Ground (Similar to Me)
   * - Difference (Different from Me)
   * - Potential Balance (We Balance Each Other)
   */
  sharedGroundSummary?: string;
  differenceSummary?: string;
  potentialBalanceSummary?: string;
  /**
   * Experimental primary & secondary pattern summaries (only shown when coverage threshold is met)
   */
  experimentalPrimaryPattern?: ExperimentalArchetypeId;
  experimentalSecondaryPattern?: ExperimentalArchetypeId;
  /**
   * Structured psychological construct profile for live deterministic calculations
   */
  constructProfile?: ConstructVectorPoint[];
  /**
   * Explicit mutual eligibility settings
   */
  eligibility?: MemberEligibilityRequirements;
  /**
   * Lifestyle smoking and vaping profile (voluntarily disclosed)
   */
  smokingVapingProfile?: SmokingVapingProfile;
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
  constructLayer?: ConstructLayerId;
}

export interface AssessmentQuestionOption {
  id: string;
  /** Stable semantic identifier independent of visual display order */
  semanticId?: string;
  label: string;
  reflection: string;
  signalEffect: string;
  /** Normalized 0..100 construct score contribution */
  normalizedValue?: number;
  /** Context tag for behavioral triangulation */
  contextTag?: string;
  /** Indicates whether choosing this option welcomes complementary differences */
  welcomesComplementarity?: boolean;
  /** Flags if an option represents tolerance of boundary violation (never rewarded) */
  isBoundaryViolationTolerance?: boolean;
  /** Tamil translation of the option label */
  labelTa?: string;
  /** Hindi translation of the option label */
  labelHi?: string;
  /** Translation review status */
  translationReviewStatus?: 'machine_translation_pending_human_review' | 'human_reviewed';
  /** Measured flexibility contribution when this option explicitly reflects adaptability */
  measuredFlexibility?: number;
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
  | 'Long-Term Partnership & Family Context'
  | 'Lifestyle, Health & Habits';
  intentionScope: 'All intentions' | 'Friendship & Dating' | 'Matrimony & Partnership';
  applicableIntentions: IntentionId[];
  prompt: string;
  context: string;
  whyWeAsk: string;
  options: AssessmentQuestionOption[];
  /** Extended research metadata */
  constructId?: ConstructLayerId;
  facetId?: string;
  formatType?: QuestionFormatType;
  stage?: AssessmentStage;
  reverseKeyed?: boolean;
  expectedResponseTimeMs?: number;
  sensitivityLevel?: 'low' | 'moderate' | 'high_voluntary_preference';
  version?: string;
  validationStatus?: 'ORIGINAL / UNVALIDATED' | 'PILOT_REVIEWED' | 'VALIDATED';
  supportedLanguages?: ('en' | 'ta' | 'hi')[];
  translations?: Partial<Record<'ta' | 'hi', string>>;
  /** Psychometric scoring classification */
  scoringType?: 'continuous_trait' | 'categorical_preference' | 'essential_gate' | 'qualitative_reflection';
  researchBasis?: string;
  measurementLimitations?: string;
  targetFacetName?: string;
  optionTranslationsReviewStatus?: 'machine_translation_pending_human_review' | 'human_reviewed';
  /** Admin publication workflow: unapproved candidate items are never administered to members */
  isApprovedForMembers?: boolean;
  /** Follow-up item links for adaptive response-aware branching and contextual triangulation */
  pairedFollowUpIds?: string[];
  /** Expected participant time burden in milliseconds (e.g. 15000) */
  completionBurdenMs?: number;
  /** Notes on cultural suitability and regional nuances (South Asian / Indian urban contexts) */
  culturalSuitabilityNotes?: string;
  /** Progressive profile section identifier */
  sectionId?: ProfileSectionId;
  /** Cluster identifier for multi-scenario psychological triangulation */
  triangulationClusterId?: string;
}

export type ProfileSectionId =
  | 'basic_profile'
  | 'relationship_intentions'
  | 'communication_style'
  | 'everyday_values'
  | 'social_energy'
  | 'emotional_repair'
  | 'independence_finances'
  | 'lifestyle_health'
  | 'relational_boundaries'
  | 'family_future';

export interface ProfileSectionStatus {
  sectionId: ProfileSectionId;
  title: string;
  shortLabel: string;
  category: 'core_account' | 'essential_preferences' | 'personality_traits' | 'deeper_reflection';
  status: 'completed' | 'in_progress' | 'not_started' | 'optional_available';
  answeredCount: number;
  targetCount: number;
  estimatedMinutesRemaining: number;
  description: string;
  privacyBadge: string;
  constructId?: ConstructLayerId;
  questionIds: string[];
}

export interface ProfileReadinessBreakdown {
  accountProfileReadiness: number;
  relationshipPreferenceReadiness: number;
  psychologicalAssessmentCoverage: number;
  optionalAssessmentDepth: number;
  isReadyForDiscovery: boolean;
  headlineSummary: string;
  nextRecommendedSection: ProfileSectionId;
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

export interface AdminQualityReviewEvent {
  eventType: 'assessment_quality_review_recommended';
  sessionReference: string;
  sessionId?: string;
  assessmentVersion: string;
  broadCategory:
  | 'rapid_completion_and_uniform_pattern'
  | 'high_missingness_or_incomplete'
  | 'paired_item_inconsistency_review';
  timestamp: string;
  reviewStatus: 'pending_optional_member_retry' | 'resolved' | 'dismissed';
  rawAnswersIncluded: false;
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
