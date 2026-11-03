export type IntentionId = 'friendship' | 'dating' | 'matrimony';

/**
 * Phase 10 Extended Intention Space.
 * Includes proposed fourth space 'cofounders' (professional partnership beta).
 * Active core in production remains Friendship, Dating, and Matrimony.
 */
export type ExtendedIntentionId = 'friendship' | 'dating' | 'matrimony' | 'cofounders';

/**
 * Explicit Dating Relationship Purpose:
 * Strictly prioritizes intentional, long-term human connection over casual hookups.
 */
export type DatingRelationshipPurpose =
  | 'committed_long_term' // Seeking a committed long-term relationship
  | 'open_to_marriage'    // Seeking a relationship that could lead to marriage
  | 'intentional_dating'; // Exploring meaningful dating, but not seeking casual hookups

export type DatingPacePreference =
  | 'unhurried'    // Prefer gradual, steady acquaintance
  | 'moderate'     // Natural, balanced progression
  | 'spontaneous'; // Open to faster conversational connection

export type DatingBoundariesPreference =
  | 'clear_early'      // Clear boundaries stated upfront
  | 'gradual_organic'  // Boundaries communicated as trust builds
  | 'flexible';        // Low-friction, adaptable boundaries

export type DatingCommunicationPreference =
  | 'daily_checkins'       // Frequent daily updates
  | 'thoughtful_unhurried' // Thoughtful, reflective messages without constant urgency
  | 'flexible';            // Whatever feels natural in the moment

/**
 * Cofounder Space (Fire + Air Synergy) Types:
 * Complementary skills, professional working styles, and shared business direction.
 */
export type SkillProficiencyLevel =
  | 'learning'
  | 'working_knowledge'
  | 'experienced'
  | 'advanced';

export type CofounderSkillCategory =
  | 'engineering'
  | 'ai_ml'
  | 'frontend'
  | 'backend'
  | 'cloud_devops'
  | 'mobile'
  | 'product_management'
  | 'ui_ux_design'
  | 'user_research'
  | 'b2b_sales'
  | 'growth_marketing'
  | 'content_branding'
  | 'partnerships'
  | 'finance_fundraising'
  | 'operations'
  | 'legal_compliance'
  | 'talent_hiring'
  | 'industry_specialist';

export interface CofounderOfferedSkill {
  skillId: CofounderSkillCategory;
  name: string;
  proficiency: SkillProficiencyLevel;
  evidenceSummary?: string; // Optional portfolio link or project description
}

export interface CofounderNeededSkill {
  skillId: CofounderSkillCategory;
  priority: 'critical' | 'preferred';
  canHireInstead?: boolean;
}

export type StartupIdeaStage =
  | 'exploring_ideas'
  | 'validated_concept'
  | 'building_prototype'
  | 'launched_mvp'
  | 'scaling_revenue';

export type StartupFundingPreference =
  | 'bootstrapped'
  | 'venture_capital'
  | 'open_to_either';

export type FounderTimeCommitment =
  | 'full_time_now'
  | 'transition_in_3_months'
  | 'part_time_evenings'
  | 'flexible';

export type FounderLocationPreference =
  | 'in_person_city'
  | 'hybrid'
  | 'remote_first';

export type FounderEquityExpectation =
  | 'equal_split_ethos'
  | 'contribution_and_risk_weighted'
  | 'open_discussion';

export interface CofounderProfile {
  headline: string;
  startupInterests: string[];
  skillsOffered: CofounderOfferedSkill[];
  skillsNeeded: CofounderNeededSkill[];
  ideaStage: StartupIdeaStage;
  fundingPreference: StartupFundingPreference;
  timeCommitment: FounderTimeCommitment;
  locationPreference: FounderLocationPreference;
  city?: string;
  equityExpectation: FounderEquityExpectation;
  summaryNote?: string;
  isDiscoverable: boolean;
}

export interface CommunityRespectPledgeSignature {
  signed: boolean;
  signedAt: number;
  version: string;
}

export type IntroductionState =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'withdrawn';

export interface IntentionIntroduction {
  id: string;
  senderId: string;
  receiverId: string;
  intention: ExtendedIntentionId;
  noteText: string;
  state: IntroductionState;
  createdAt: number;
  respondedAt?: number;
  expiresAt: number;
}

export interface PairExclusionRule {
  id: string;
  memberIdA: string;
  memberIdB: string;
  scope: 'all_spaces' | 'space_specific';
  excludedSpace?: ExtendedIntentionId;
  reason: 'connected_in_other_space' | 'user_hidden' | 'boundary_protection';
  createdAt: number;
}

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
  partnerRequirementByIntention: Partial<Record<ExtendedIntentionId, PartnerSmokingRequirement>>;
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
  | 'valid_moderate_confidence'
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
  | 'insights'
  | 'photos'
  | 'profile'
  | 'privacy'
  | 'settings'
  | 'more';

export type AdminTab =
  | 'overview'
  | 'members'
  | 'growth'
  | 'profiles'
  | 'connections'
  | 'subscriptions'
  | 'revenue'
  | 'map'
  | 'support'
  | 'safety'
  | 'photos'
  | 'staff'
  | 'audit'
  | 'questions'
  | 'settings'
  // Legacy aliases for backward compatibility
  | 'users'
  | 'reports'
  | 'groups'
  | 'privacy'
  | 'analytics';

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
  enabledIntentions: ExtendedIntentionId[];
  discoverableInIntentions?: ExtendedIntentionId[];
  discoveryEnabledByIntention?: Partial<Record<ExtendedIntentionId, boolean>>;
  blockedMemberIds: string[];
  pairExclusions?: PairExclusionRule[];
  connectedMemberIdsByIntention?: Partial<Record<ExtendedIntentionId, string[]>>;
  hideCrossContextConnectionsByDefault?: boolean;
  relationshipStructure?: RelationshipStructureRequirement;
  relationshipStructureByIntention?: Partial<
    Record<ExtendedIntentionId, RelationshipStructureRequirement>
  >;
  relationshipStructureImportance?: ImportanceLevel;
  childrenPreference?: LongTermChildrenPreference;
  childrenRequirementLevel?: ImportanceLevel;
  childrenPreferenceImportance?: ImportanceLevel;
  relocationOpenness?: 'open' | 'anchored_in_city' | 'flexible' | 'unknown';
  smokingVapingProfile?: SmokingVapingProfile;
  datingPurpose?: DatingRelationshipPurpose;
  acceptableDatingPurposes?: DatingRelationshipPurpose[];
  datingPacePreference?: DatingPacePreference;
  acceptableDatingPaces?: DatingPacePreference[];
  datingBoundariesPreference?: DatingBoundariesPreference;
  datingCommunicationPreference?: DatingCommunicationPreference;
  slowConnectionMode?: boolean;
  cofounderProfile?: CofounderProfile;
  acceptableFundingPreferences?: StartupFundingPreference[];
  acceptableTimeCommitments?: FounderTimeCommitment[];
  acceptableLocationPreferences?: FounderLocationPreference[];
}

export interface AdministeredItemResponse {
  questionId?: string;
  itemId?: string;
  displayedOptionIndex: number;
  semanticOptionId: string;
  responseTimeMs: number;
  normalizedValue?: number;
  semanticNormalizedValue?: number;
  constructId?: string;
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
  /** Multi-context uncertainty & coverage tracking (Phase 7A) */
  contextTags?: string[];
  contextualBreadth?: number;
  measurementUncertainty?: number;
  missingInformationNotice?: string;
  validationStatus?: 'EXPERIMENTAL / UNVALIDATED' | 'ORIGINAL / UNVALIDATED' | 'PILOT_REVIEWED' | 'VALIDATED';
  engineVersion?: string;
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
  /**
   * Optional Cofounder space profile (isolated from dating/matrimony)
   */
  cofounderProfile?: CofounderProfile;
  /**
   * Dignity-first dating purpose and connection rhythm
   */
  datingPurposeProfile?: {
    purpose: DatingRelationshipPurpose;
    pace: DatingPacePreference;
    boundaries: DatingBoundariesPreference;
    communication: DatingCommunicationPreference;
    slowConnectionMode: boolean;
  };
  /**
   * Signed community respect pledge
   */
  respectPledgeSignature?: CommunityRespectPledgeSignature;
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
  /** Semantic branch destination for adaptive exploration */
  branchToQuestionId?: string;
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
  /** Psychometric measurement category (rigorously separated across 8 empirical classes) */
  scoringType?:
  | 'continuous_trait'
  | 'categorical_preference'
  | 'value_tradeoff'
  | 'disclosed_behavior'
  | 'partner_expectation'
  | 'essential_gate'
  | 'contextual_variation'
  | 'connection_outcome'
  | 'qualitative_reflection';
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

export type TriangulationClassification =
  | 'insufficient_information'
  | 'consistent_stance'
  | 'plausible_situational_variation'
  | 'clarification_needed';

export type ContradictionEvidenceCategory =
  | 'different_facets_non_contradictory'
  | 'plausible_contextual_variation'
  | 'temporal_change_in_preference'
  | 'genuine_unresolved_conflict_equivalent_context'
  | 'potential_item_or_scoring_defect'
  | 'insufficient_information';

export interface ItemEvidenceTrace {
  questionId: string;
  version: string;
  contextTag: string;
  facetId: string;
  normalizedValue: number;
  semanticOptionId: string;
  answeredAt?: number;
}

export interface TriangulationEvidenceReview {
  facetId: string;
  constructId: string;
  facetName: string;
  itemCount: number;
  evidenceCategory: ContradictionEvidenceCategory;
  isGenuinelyComparable: boolean;
  directionsAligned: boolean;
  situationalDifferencesExplainVariation: boolean;
  contextualExplanation?: string;
  potentialItemDefectFlag?: boolean;
  temporalRevisionDetected?: boolean;
  insufficientInformation: boolean;
  clarificationRecommended: boolean;
  clarificationOptions?: ClarificationOption[];
  traceability: ItemEvidenceTrace[];
  psychometricInterpretation: string;
  userFacingExplanation: string;
}

export interface ClarificationOption {
  id: string;
  label: string;
  explanation: string;
}

export interface ClarificationRequest {
  id: string;
  clusterId: string;
  constructId: string;
  facetId: string;
  conflictingQuestionIds: string[];
  prompt: string;
  options: ClarificationOption[];
  attemptCount: number;
  maxAttempts: number;
  status: 'pending' | 'resolved' | 'dismissed_by_user';
}
