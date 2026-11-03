import {
  CommunityCircle,
  CircleProposalInput,
  ExtendedIntentionId,
  MemberProfile,
} from '../types/kithra';

export type MemberCircleAllowedIntention = 'friendship' | 'cofounders';

export interface TribeAffinityTheme {
  id: string;
  label: string;
  constructId: string;
  tagline: string;
  description: string;
  space: MemberCircleAllowedIntention;
  recommendedFormats: CommunityCircle['format'][];
}

/**
 * Standard Psychometric Affinity Themes for Member-Initiated Circles / Tribes.
 * Strictly scoped to Friendship and Cofounders.
 * 
 * - Friendship Themes: Platonic affinity, intellectual curiosity, unhurried conversations.
 * - Cofounder Themes: Technical architecture, commercial sprints, complementary skill building.
 * 
 * Note: Dating and Matrimony are strictly excluded from member-initiated tribes to preserve
 * private, 1:1 romantic dignity and prevent unwanted group solicitation.
 */
export const TRIBE_AFFINITY_THEMES: TribeAffinityTheme[] = [
  {
    id: 'curious_explorers',
    label: 'Curious Explorers · Ideas, Arts & Philosophy',
    constructId: 'C1_openness',
    space: 'friendship',
    tagline: 'High curiosity, open minds & lateral thinking',
    description: 'For members who love discussing books, architecture, music, ideas, and cultural heritage.',
    recommendedFormats: ['In-person walk', 'Cultural salon', 'Online reading circle'],
  },
  {
    id: 'unhurried_gatherers',
    label: 'Unhurried Conversations · Warmth & Meaning',
    constructId: 'C4_warmth',
    space: 'friendship',
    tagline: 'Empathetic presence, gentle pacing & deep listening',
    description: 'A cozy, low-pressure gathering focused on authentic listening without rushing or performing.',
    recommendedFormats: ['Small table conversation', 'Listening session', 'In-person walk'],
  },
  {
    id: 'quiet_currents',
    label: 'Quiet Currents · Introvert-Friendly Gatherings',
    constructId: 'C3_social_energy',
    space: 'friendship',
    tagline: 'Low-stimulation, zero forced mingling & small groups',
    description: 'Designed specifically for members with thoughtful, introverted social tempos who prefer quiet company.',
    recommendedFormats: ['In-person walk', 'Listening session', 'Online reading circle'],
  },
  {
    id: 'steady_anchors',
    label: 'Grounded Anchors · Shared Routines & Life Planning',
    constructId: 'C2_planfulness',
    space: 'friendship',
    tagline: 'Methodical habits, financial wisdom & structured living',
    description: 'For members who appreciate structure, punctuality, and thoughtful long-term life architecture.',
    recommendedFormats: ['Small table conversation', 'Online reading circle'],
  },
  {
    id: 'cofounder_builders',
    label: 'Technical & Commercial Builders · Startup Sprints',
    constructId: 'C1_openness',
    space: 'cofounders',
    tagline: 'Complementary skill building, sprint coworking & accountability',
    description: 'For founders and creators collaborating on prototypes, customer discovery, and shared milestones.',
    recommendedFormats: ['Coworking & sprint', 'Small table conversation'],
  },
];

export interface CircleValidationResult {
  isValid: boolean;
  error?: string;
  reasons: string[];
}

/**
 * Validates a member's proposal to form a new Community Circle / Tribe.
 * Enforces safety guardrails, adulthood verification, and capacity boundaries.
 */
export function validateCircleProposal(
  creator: MemberProfile | null | undefined,
  input: CircleProposalInput
): CircleValidationResult {
  const reasons: string[] = [];

  if (!creator) {
    return {
      isValid: false,
      error: 'Creator profile is required to propose a Community Circle.',
      reasons: ['missing_creator_profile'],
    };
  }

  // P0 Security Invariant: Only verified adult members may initiate gatherings
  if (creator.eligibility?.isAdultVerified !== true) {
    return {
      isValid: false,
      error: 'Adult verification (18+) is required to initiate a community gathering.',
      reasons: ['creator_not_adult_verified'],
    };
  }

  // Founder Intention Invariant:
  // Member-initiated tribes and circles are strictly restricted to Friendship and Cofounders.
  // Dating and Matrimony are strictly private 1:1 spaces to protect member dignity, prevent
  // uncomfortable group dynamics, and avoid unwanted group solicitation.
  if (input.intention !== 'friendship' && input.intention !== 'cofounders') {
    return {
      isValid: false,
      error: 'Member-initiated tribes and circles are strictly restricted to Friendship and Cofounders. Dating and Matrimony are private 1:1 spaces to protect member dignity and emotional safety.',
      reasons: ['dating_and_matrimony_prohibited_for_member_tribes'],
    };
  }

  // Validate Title
  const trimmedTitle = input.title?.trim() ?? '';
  if (trimmedTitle.length < 5) {
    reasons.push('title_too_short');
  } else if (trimmedTitle.length > 70) {
    reasons.push('title_too_long');
  }

  // Validate Description
  const trimmedDesc = input.description?.trim() ?? '';
  if (trimmedDesc.length < 15) {
    reasons.push('description_too_short');
  } else if (trimmedDesc.length > 600) {
    reasons.push('description_too_long');
  }

  // Validate Capacity Guardrail (Safety bounds: 6 to 22 members)
  const capacity = input.maxCapacity ?? 15;
  if (capacity < 6 || capacity > 22) {
    reasons.push('capacity_out_of_bounds');
  }

  // Validate City
  if (!input.city || input.city.trim().length < 2) {
    reasons.push('city_required');
  }

  if (reasons.length > 0) {
    return {
      isValid: false,
      error: `Validation failed: ${reasons.join(', ')}`,
      reasons,
    };
  }

  return { isValid: true, reasons: [] };
}

/**
 * Creates an authoritative Member-Initiated CommunityCircle instance.
 * Automatically designates User A as the Founding Host and first member.
 */
export function createMemberCircle(
  creator: MemberProfile,
  input: CircleProposalInput
): { success: boolean; circle?: CommunityCircle; error?: string } {
  const validation = validateCircleProposal(creator, input);
  if (!validation.isValid) {
    return { success: false, error: validation.error };
  }

  const capacity = Math.min(22, Math.max(6, input.maxCapacity ?? 15));
  const circleId = `circle_member_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newCircle: CommunityCircle = {
    id: circleId,
    title: input.title.trim(),
    city: input.city.trim(),
    format: input.format,
    intention: input.intention,
    cadence: input.cadence.trim() || 'Fortnightly gathering',
    memberCount: 1, // Founding member (User A) is automatically enrolled
    maxCapacity: capacity,
    description: input.description.trim(),
    joined: true, // User A is joined by default
    isMemberInitiated: true,
    creatorMemberId: creator.id,
    creatorMemberName: creator.name || 'Member Host',
    tribeTheme: input.tribeTheme?.trim() || 'Shared Curiosity',
    targetAffinityTrait: input.targetAffinityTrait?.trim(),
    targetConstructId: input.targetConstructId,
    cohortComfort: input.cohortComfort || 'all_genders',
    targetLens: input.targetLens || 'similar_to_me',
    invitedMemberIds: [],
    status: 'active',
    createdAt: Date.now(),
  };

  return { success: true, circle: newCircle };
}

/**
 * Invites a compatible candidate member to an active Community Circle / Tribe.
 * Verifies host ownership, adult verification, capacity limits, and space isolation.
 */
export function inviteMemberToCircle(
  circle: CommunityCircle,
  hostId: string,
  targetMember: MemberProfile
): { success: boolean; updatedCircle?: CommunityCircle; error?: string } {
  if (circle.creatorMemberId !== hostId) {
    return {
      success: false,
      error: 'Only the Founding Host may invite members directly to this Circle.',
    };
  }

  if (targetMember.eligibility?.isAdultVerified !== true) {
    return {
      success: false,
      error: 'Cannot invite unverified members (Adult verification 18+ required).',
    };
  }

  // Prevent inviting blocked members
  if (targetMember.eligibility?.blockedMemberIds?.includes(hostId)) {
    return {
      success: false,
      error: 'Cannot invite this member due to mutual block settings.',
    };
  }

  const existingInvited = circle.invitedMemberIds || [];
  if (existingInvited.includes(targetMember.id)) {
    return {
      success: false,
      error: `${targetMember.name} has already been invited to this Circle.`,
    };
  }

  // Check capacity boundary
  const maxCap = circle.maxCapacity || 20;
  if (circle.memberCount >= maxCap) {
    return {
      success: false,
      error: `This Circle has reached its maximum small-table capacity (${maxCap} members).`,
    };
  }

  const updatedCircle: CommunityCircle = {
    ...circle,
    invitedMemberIds: [...existingInvited, targetMember.id],
  };

  return { success: true, updatedCircle };
}

export interface AffinityCohortEstimate {
  estimatedCount: number;
  sampleMemberNames: string[];
  summaryNote: string;
}

/**
 * Estimates how many kindred spirits in the target city share the specified
 * intention and character affinity traits, giving User A instant feedback.
 */
export function estimateTribeAffinityCohort(
  allProfiles: MemberProfile[],
  creatorId: string,
  intention: ExtendedIntentionId,
  city: string,
  targetConstructId?: string
): AffinityCohortEstimate {
  const normalizedCity = city.trim().toLowerCase();

  const candidates = allProfiles.filter((p) => {
    if (p.id === creatorId) return false;
    if (p.eligibility?.isAdultVerified !== true) return false;
    if (!p.intentions.includes(intention)) return false;

    // Proximity check (city matching or online)
    if (normalizedCity !== 'online' && p.city.trim().toLowerCase() !== normalizedCity) {
      return false;
    }

    // Optional Construct Affinity Filter
    if (targetConstructId && p.constructProfile) {
      const point = p.constructProfile.find((v) => v.constructId === targetConstructId);
      // Affinity threshold: score >= 60 indicates positive trait alignment
      if (point && point.score < 60) {
        return false;
      }
    }

    return true;
  });

  const sampleNames = candidates.slice(0, 3).map((p) => p.name);
  const count = candidates.length;

  let summaryNote = `${count} members in ${city} match your intention (${intention}).`;
  if (targetConstructId) {
    summaryNote = `${count} members in ${city} share this character affinity and intention.`;
  }

  return {
    estimatedCount: count,
    sampleMemberNames: sampleNames,
    summaryNote,
  };
}
