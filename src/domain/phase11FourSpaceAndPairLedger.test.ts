/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA PHASE 11 COMPREHENSIVE TEST SUITE:
 * FOUR-SPACE PSYCHOLOGICAL MATCHING, CANONICAL PAIR LEDGER,
 * CROSS-CONTEXT SUPPRESSION & SECURITY NEGATIVE SUITE
 * 
 * Founder's Master Invariant:
 * "Once two members form an accepted connection in one Kithra space, they must not
 * automatically rediscover, match with or receive introductions from each other in any other space.
 * One pair, one active connection context by default."
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateMutualEligibility,
  evaluateMemberPairwiseMatch,
  filterProfilesByFullSimilaritySpectrum,
} from './psychologyEngine';
import { calculateCofounderSynergy } from './cofounderSynergyEngine';
import { memberStore } from './memberStore';
import {
  LocalD1DatabaseMock,
  KithraD1Service,
  getCanonicalPairId,
} from '../server/d1Database';
import { handleApiRequest } from '../server/apiRouter';
import {
  MemberProfile,
  MemberEligibilityRequirements,
  ExtendedIntentionId,
  ConstructVectorPoint,
} from '../types/kithra';

// ============================================================================
// 16 SYNTHETIC ADULT PERSONAS (ACROSS BENGALURU, MUMBAI, DELHI, CHENNAI, HYD, PUNE)
// ============================================================================

function createConstructVector(pace: number, plan: number, social: number, direct: number): ConstructVectorPoint[] {
  return [
    { constructId: 'C1_openness', score: pace, confidence: 0.88, itemCount: 6, answeredItemCount: 6 },
    { constructId: 'C2_planfulness', score: plan, confidence: 0.85, itemCount: 6, answeredItemCount: 6 },
    { constructId: 'C3_social_energy', score: social, confidence: 0.89, itemCount: 5, answeredItemCount: 5 },
    { constructId: 'C4_warmth', score: direct, confidence: 0.87, itemCount: 5, answeredItemCount: 5 },
  ];
}

export const SYNTHETIC_PERSONAS: Record<string, MemberProfile> = {
  'p01-priya': {
    id: 'p01-priya',
    name: 'Priya Sharma',
    ageRange: '29',
    city: 'Bengaluru',
    neighborhood: 'Indiranagar',
    languages: ['English', 'Hindi', 'Kannada'],
    intentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    primaryIntention: 'dating',
    headline: 'Product architect passionate about calm software systems and urban tree canopies.',
    bio: 'Designing thoughtful experiences. Values long-term clarity, intellectual steadiness, and quiet morning walks.',
    interests: ['Typography', 'Urban Ecology', 'Specialty Coffee', 'Architecture'],
    paceNote: 'Reflective; prefers thoughtful evening letters.',
    occupation: 'Lead Product Architect',
    portraitVariant: 'member-kavya',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(85, 80, 40, 75),
    eligibility: {
      memberId: 'p01-priya',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
      discoverableInIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
      datingPurpose: 'committed_long_term',
      acceptableDatingPurposes: ['committed_long_term', 'open_to_marriage'],
      childrenPreference: 'wants_children',
      childrenRequirementLevel: 'flexible',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { dating: 'must_be_non_smoker', matrimony: 'must_be_non_smoker', friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p02-vikas': {
    id: 'p02-vikas',
    name: 'Vikas Malhotra',
    ageRange: '31',
    city: 'Bengaluru',
    neighborhood: 'Koramangala',
    languages: ['English', 'Hindi', 'Punjabi'],
    intentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
    primaryIntention: 'dating',
    headline: 'Distributed systems engineer and avid historical fiction reader.',
    bio: 'Values architectural elegance in software and honesty in human connection. Loves unhurried dinners and discussions on governance.',
    interests: ['Distributed Systems', 'History', 'Cycling', 'Espresso'],
    paceNote: 'Thoughtful communicator; values intentional conversation.',
    occupation: 'Principal Systems Engineer',
    portraitVariant: 'member-aarav',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(80, 85, 45, 80),
    eligibility: {
      memberId: 'p02-vikas',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
      discoverableInIntentions: ['friendship', 'dating', 'matrimony', 'cofounders'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
      datingPurpose: 'committed_long_term',
      acceptableDatingPurposes: ['committed_long_term', 'open_to_marriage'],
      childrenPreference: 'wants_children',
      childrenRequirementLevel: 'flexible',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { dating: 'must_be_non_smoker', matrimony: 'must_be_non_smoker', friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p03-ananya': {
    id: 'p03-ananya',
    name: 'Ananya Desai',
    ageRange: '27',
    city: 'Mumbai',
    neighborhood: 'Bandra',
    languages: ['English', 'Gujarati', 'Hindi'],
    intentions: ['friendship', 'cofounders'],
    primaryIntention: 'cofounders',
    headline: 'Commercial strategist and brand operator building next-gen healthtech.',
    bio: 'Experienced in GTM, enterprise sales and fundraising. Looking for a high-integrity technical cofounder.',
    interests: ['HealthTech', 'Venture Strategy', 'Running', 'Contemporary Art'],
    paceNote: 'Dynamic, proactive, direct.',
    occupation: 'Commercial Co-Founder',
    portraitVariant: 'member-meera',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(45, 90, 85, 90),
    eligibility: {
      memberId: 'p03-ananya',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'cofounders'],
      discoverableInIntentions: ['friendship', 'cofounders'],
      blockedMemberIds: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: { friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    cofounderProfile: {
      workStyle: 'collaborative_iterative',
      riskTolerance: 'high',
      commitmentLevel: 'full_time',
      timeCommitment: 'full_time_now',
      ideaStage: 'validated_concept',
      fundingPreference: 'venture_capital',
      locationPreference: 'in_person_city',
      domainExpertise: ['Commercial / GTM', 'Product Strategy', 'Fundraising'],
      startupInterests: ['Digital Health', 'Bioinformatics'],
      skillsOffered: [
        { skillId: 'commercial_gtm', name: 'Commercial GTM', proficiency: 'expert' },
        { skillId: 'product_strategy', name: 'Product Strategy', proficiency: 'expert' },
        { skillId: 'fundraising_finance', name: 'Fundraising', proficiency: 'proficient' },
      ],
      skillsNeeded: [
        { skillId: 'fullstack_engineering', priority: 'critical' },
        { skillId: 'backend_architecture', priority: 'critical' },
      ],
    } as any,
    alignment: [],
    measuredDimensions: [],
  },

  'p04-karan': {
    id: 'p04-karan',
    name: 'Karan Mehta',
    ageRange: '30',
    city: 'Mumbai',
    neighborhood: 'Powai',
    languages: ['English', 'Hindi', 'Marathi'],
    intentions: ['friendship', 'cofounders'],
    primaryIntention: 'cofounders',
    headline: 'Technical founder & fullstack engineering leader with AI/ML background.',
    bio: 'Passionate about distributed backend architecture and low-latency infrastructure. Looking for an energetic commercial operator.',
    interests: ['Machine Learning', 'Open Source', 'Chess', 'Hiking'],
    paceNote: 'Deep-work oriented; communicates in structured updates.',
    occupation: 'Technical Co-Founder / CTO',
    portraitVariant: 'member-rohan',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(60, 85, 45, 80),
    eligibility: {
      memberId: 'p04-karan',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'cofounders'],
      discoverableInIntentions: ['friendship', 'cofounders'],
      blockedMemberIds: [],
      smokingVapingProfile: {
        personalHabit: 'occasional_social_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: { friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    cofounderProfile: {
      workStyle: 'autonomous_focused',
      riskTolerance: 'high',
      commitmentLevel: 'full_time',
      timeCommitment: 'full_time_now',
      ideaStage: 'validated_concept',
      fundingPreference: 'venture_capital',
      locationPreference: 'in_person_city',
      domainExpertise: ['Fullstack Engineering', 'Backend Architecture', 'AI/ML'],
      startupInterests: ['Digital Health', 'Developer Tools'],
      skillsOffered: [
        { skillId: 'fullstack_engineering', name: 'Fullstack Engineering', proficiency: 'expert' },
        { skillId: 'backend_architecture', name: 'Backend Architecture', proficiency: 'expert' },
        { skillId: 'ai_ml_engineering', name: 'AI/ML', proficiency: 'expert' },
      ],
      skillsNeeded: [
        { skillId: 'commercial_gtm', priority: 'critical' },
        { skillId: 'fundraising_finance', priority: 'critical' },
      ],
    } as any,
    alignment: [],
    measuredDimensions: [],
  },

  'p05-diya': {
    id: 'p05-diya',
    name: 'Diya Sen',
    ageRange: '28',
    city: 'Delhi',
    neighborhood: 'Hauz Khas',
    languages: ['English', 'Bengali', 'Hindi'],
    intentions: ['dating', 'matrimony'],
    primaryIntention: 'matrimony',
    headline: 'Clinical research scientist seeking an unhurried, marriage-oriented partnership.',
    bio: 'Dedicated to oncology trials. Believes family warmth, steady trust, and intellectual curiosity form the bedrock of marriage.',
    interests: ['Oncology Research', 'Literature', 'Classical Piano', 'Baking'],
    paceNote: 'Gentle, thoughtful, deep.',
    occupation: 'Clinical Research Scientist',
    portraitVariant: 'member-tara',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(85, 90, 35, 70),
    eligibility: {
      memberId: 'p05-diya',
      isAdultVerified: true,
      enabledIntentions: ['dating', 'matrimony'],
      discoverableInIntentions: ['dating', 'matrimony'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
      datingPurpose: 'open_to_marriage',
      acceptableDatingPurposes: ['open_to_marriage'],
      childrenPreference: 'wants_children',
      childrenRequirementLevel: 'essential',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { dating: 'must_be_non_smoker', matrimony: 'must_be_non_smoker' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p06-arjun': {
    id: 'p06-arjun',
    name: 'Arjun Kapoor',
    ageRange: '30',
    city: 'Delhi',
    neighborhood: 'Defence Colony',
    languages: ['English', 'Hindi'],
    intentions: ['dating', 'matrimony'],
    primaryIntention: 'matrimony',
    headline: 'IP attorney with a love for classical literature and weekend tennis.',
    bio: 'Specializing in copyright and design law. Looking for a life partner with shared family values, warmth, and quiet integrity.',
    interests: ['Law', 'Tennis', 'Biographies', 'Museum Walks'],
    paceNote: 'Warm, consistent, reliable.',
    occupation: 'Intellectual Property Lawyer',
    portraitVariant: 'member-vikram',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(80, 90, 40, 75),
    eligibility: {
      memberId: 'p06-arjun',
      isAdultVerified: true,
      enabledIntentions: ['dating', 'matrimony'],
      discoverableInIntentions: ['dating', 'matrimony'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
      datingPurpose: 'open_to_marriage',
      acceptableDatingPurposes: ['open_to_marriage'],
      childrenPreference: 'wants_children',
      childrenRequirementLevel: 'essential',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { dating: 'must_be_non_smoker', matrimony: 'must_be_non_smoker' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p07-meera': {
    id: 'p07-meera',
    name: 'Meera Krishnan',
    ageRange: '26',
    city: 'Chennai',
    neighborhood: 'Mylapore',
    languages: ['English', 'Tamil'],
    intentions: ['friendship'],
    primaryIntention: 'friendship',
    headline: 'Carnatic vocalist and acoustic researcher exploring ancient soundscapes.',
    bio: 'I teach microtonal vocal traditions and record temple acoustics. Seeking quiet friends who enjoy tea, concerts, and long conversations.',
    interests: ['Carnatic Music', 'Acoustics', 'Filter Coffee', 'Tamil Poetry'],
    paceNote: 'Unhurried, reflective, contemplative.',
    occupation: 'Vocalist & Sound Researcher',
    portraitVariant: 'member-meera',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(90, 75, 30, 85),
    eligibility: {
      memberId: 'p07-meera',
      isAdultVerified: true,
      enabledIntentions: ['friendship'],
      discoverableInIntentions: ['friendship'],
      blockedMemberIds: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p08-siddharth': {
    id: 'p08-siddharth',
    name: 'Siddharth Raman',
    ageRange: '28',
    city: 'Chennai',
    neighborhood: 'Besant Nagar',
    languages: ['English', 'Tamil'],
    intentions: ['friendship'],
    primaryIntention: 'friendship',
    headline: 'Acoustic instrument restorer and classical music enthusiast.',
    bio: 'Restoring antique veenas and violins. Looking for kindred spirits who appreciate slow crafts, quiet evening walks, and chamber concerts.',
    interests: ['Instrument Restoration', 'Beach Walks', 'Acoustics', 'Books'],
    paceNote: 'Unhurried, attentive, gentle listener.',
    occupation: 'Instrument Restorer',
    portraitVariant: 'member-aarav',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(90, 70, 35, 80),
    eligibility: {
      memberId: 'p08-siddharth',
      isAdultVerified: true,
      enabledIntentions: ['friendship'],
      discoverableInIntentions: ['friendship'],
      blockedMemberIds: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p09-rohit': {
    id: 'p09-rohit',
    name: 'Rohit Varma',
    ageRange: '32',
    city: 'Hyderabad',
    neighborhood: 'Jubilee Hills',
    languages: ['English', 'Telugu', 'Hindi'],
    intentions: ['friendship', 'dating'],
    primaryIntention: 'dating',
    headline: 'Data infrastructure consultant and indie film enthusiast.',
    bio: 'Enjoys open, non-hierarchical conversations and weekend film screenings. Flexible in relationship style.',
    interests: ['Indie Film', 'Data Engineering', 'Bouldering', 'Vinyl'],
    paceNote: 'Active communicator; spontaneous weekend plans.',
    occupation: 'Data Consultant',
    portraitVariant: 'member-rohan',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(45, 40, 75, 75),
    eligibility: {
      memberId: 'p09-rohit',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating'],
      discoverableInIntentions: ['friendship', 'dating'],
      blockedMemberIds: [],
      relationshipStructure: 'open_preferred',
      datingPurpose: 'intentional_dating',
      acceptableDatingPurposes: ['intentional_dating', 'committed_long_term'],
      childrenPreference: 'open_or_unsure',
      childrenRequirementLevel: 'flexible',
      smokingVapingProfile: {
        personalHabit: 'occasional_social_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: { dating: 'occasional_or_vape_acceptable', friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p10-tanvi': {
    id: 'p10-tanvi',
    name: 'Tanvi Reddy',
    ageRange: '29',
    city: 'Hyderabad',
    neighborhood: 'Gachibowli',
    languages: ['English', 'Telugu', 'Hindi'],
    intentions: ['friendship', 'dating'],
    primaryIntention: 'dating',
    headline: 'UI/UX designer and ceramic pottery maker.',
    bio: 'Sculpting pottery and designing design systems. Open-minded about relationship frameworks; values emotional transparency.',
    interests: ['Ceramics', 'Design Systems', 'Electronic Music', 'Tea'],
    paceNote: 'Expressive and communicative.',
    occupation: 'Staff Product Designer',
    portraitVariant: 'member-kavya',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(50, 45, 70, 80),
    eligibility: {
      memberId: 'p10-tanvi',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating'],
      discoverableInIntentions: ['friendship', 'dating'],
      blockedMemberIds: [],
      relationshipStructure: 'open_preferred',
      datingPurpose: 'intentional_dating',
      acceptableDatingPurposes: ['intentional_dating', 'committed_long_term'],
      childrenPreference: 'open_or_unsure',
      childrenRequirementLevel: 'flexible',
      smokingVapingProfile: {
        personalHabit: 'occasional_social_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: { dating: 'occasional_or_vape_acceptable', friendship: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p11-neha': {
    id: 'p11-neha',
    name: 'Neha Kulkarni',
    ageRange: '27',
    city: 'Pune',
    neighborhood: 'Kothrud',
    languages: ['English', 'Marathi', 'Hindi'],
    intentions: ['cofounders'],
    primaryIntention: 'cofounders',
    headline: 'Hardware IoT architect developing sustainable agriculture sensors.',
    bio: 'Deep technical background in embedded firmware and IoT telemetry. Looking for an operations & supply chain cofounder.',
    interests: ['AgriTech', 'Embedded Systems', 'Trekking', 'Robotics'],
    paceNote: 'Action-oriented, clear technical communication.',
    occupation: 'IoT Hardware Architect',
    portraitVariant: 'member-tara',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(70, 90, 45, 85),
    eligibility: {
      memberId: 'p11-neha',
      isAdultVerified: true,
      enabledIntentions: ['cofounders'],
      discoverableInIntentions: ['cofounders'],
      blockedMemberIds: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: {},
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    cofounderProfile: {
      workStyle: 'autonomous_focused',
      riskTolerance: 'high',
      commitmentLevel: 'full_time',
      timeCommitment: 'full_time_now',
      ideaStage: 'building_prototype',
      fundingPreference: 'bootstrapped',
      locationPreference: 'in_person_city',
      domainExpertise: ['IoT Hardware', 'Embedded Firmware', 'Telemetry'],
      startupInterests: ['AgriTech', 'ClimateTech'],
      skillsOffered: [
        { skillId: 'backend_architecture', name: 'Embedded Firmware', proficiency: 'expert' },
        { skillId: 'fullstack_engineering', name: 'Hardware Telemetry', proficiency: 'proficient' },
      ],
      skillsNeeded: [
        { skillId: 'operations_supply_chain', priority: 'critical' },
        { skillId: 'commercial_gtm', priority: 'critical' },
      ],
    } as any,
    alignment: [],
    measuredDimensions: [],
  },

  'p12-aditya': {
    id: 'p12-aditya',
    name: 'Aditya Joshi',
    ageRange: '33',
    city: 'Pune',
    neighborhood: 'Kalyani Nagar',
    languages: ['English', 'Marathi', 'Hindi'],
    intentions: ['cofounders'],
    primaryIntention: 'cofounders',
    headline: 'Supply chain director & operations operator in agritech and industrial logistics.',
    bio: '10 years scaling factory logistics, B2B procurement and vendor relations. Seeking a hardware/firmware cofounder for climate/agritech.',
    interests: ['Logistics', 'AgriTech', 'Endurance Cycling', 'Economics'],
    paceNote: 'Operational precision, regular structured syncs.',
    occupation: 'Operations Co-Founder',
    portraitVariant: 'member-vikram',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(65, 95, 60, 85),
    eligibility: {
      memberId: 'p12-aditya',
      isAdultVerified: true,
      enabledIntentions: ['cofounders'],
      discoverableInIntentions: ['cofounders'],
      blockedMemberIds: [],
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: {},
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    cofounderProfile: {
      workStyle: 'collaborative_iterative',
      riskTolerance: 'high',
      commitmentLevel: 'full_time',
      timeCommitment: 'full_time_now',
      ideaStage: 'building_prototype',
      fundingPreference: 'bootstrapped',
      locationPreference: 'in_person_city',
      domainExpertise: ['Operations & Supply Chain', 'Procurement', 'B2B Logistics'],
      startupInterests: ['AgriTech', 'ClimateTech'],
      skillsOffered: [
        { skillId: 'operations_supply_chain', name: 'Supply Chain Operations', proficiency: 'expert' },
        { skillId: 'commercial_gtm', name: 'B2B Logistics GTM', proficiency: 'proficient' },
      ],
      skillsNeeded: [
        { skillId: 'backend_architecture', priority: 'critical' },
        { skillId: 'fullstack_engineering', priority: 'critical' },
      ],
    } as any,
    alignment: [],
    measuredDimensions: [],
  },

  'p13-kabir': {
    id: 'p13-kabir',
    name: 'Kabir Singhania',
    ageRange: '34',
    city: 'Bengaluru',
    neighborhood: 'Lavelle Road',
    languages: ['English', 'Hindi'],
    intentions: ['matrimony'],
    primaryIntention: 'matrimony',
    headline: 'Senior heritage restoration architect seeking a traditional marriage partnership.',
    bio: 'Restoring historical stone monuments across Karnataka. Looking for an emotionally steady partner with deep family roots.',
    interests: ['Architecture', 'Classical Arts', 'Woodworking', 'Books'],
    paceNote: 'Patient, methodical, attentive.',
    occupation: 'Conservation Architect',
    portraitVariant: 'member-aarav',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(85, 90, 40, 80),
    eligibility: {
      memberId: 'p13-kabir',
      isAdultVerified: true,
      enabledIntentions: ['matrimony'],
      discoverableInIntentions: ['matrimony'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
      datingPurpose: 'open_to_marriage',
      acceptableDatingPurposes: ['open_to_marriage'],
      childrenPreference: 'wants_children',
      childrenRequirementLevel: 'essential',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { matrimony: 'must_be_non_smoker' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p14-shreya': {
    id: 'p14-shreya',
    name: 'Shreya Iyer',
    ageRange: '32',
    city: 'Bengaluru',
    neighborhood: 'Malleshwaram',
    languages: ['English', 'Tamil', 'Kannada'],
    intentions: ['matrimony'],
    primaryIntention: 'matrimony',
    headline: 'Development economist and university lecturer looking for a marriage foundation.',
    bio: 'Researching rural development and water policy. Values family closeness, cultural heritage, and lifelong mutual growth.',
    interests: ['Economics', 'Carnatic Music', 'Gardening', 'Filter Coffee'],
    paceNote: 'Calm, thoughtful, grounded.',
    occupation: 'Development Economist',
    portraitVariant: 'member-kavya',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(85, 85, 45, 80),
    eligibility: {
      memberId: 'p14-shreya',
      isAdultVerified: true,
      enabledIntentions: ['matrimony'],
      discoverableInIntentions: ['matrimony'],
      blockedMemberIds: [],
      relationshipStructure: 'exclusive_required',
      datingPurpose: 'open_to_marriage',
      acceptableDatingPurposes: ['open_to_marriage'],
      childrenPreference: 'wants_children',
      childrenRequirementLevel: 'essential',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'smoke_free_only',
        partnerRequirementByIntention: { matrimony: 'must_be_non_smoker' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p15-zoya': {
    id: 'p15-zoya',
    name: 'Zoya Merchant',
    ageRange: '25',
    city: 'Mumbai',
    neighborhood: 'Versova',
    languages: ['English', 'Hindi'],
    intentions: ['friendship', 'dating'],
    primaryIntention: 'friendship',
    headline: 'Documentary film editor and experimental sound collagist.',
    bio: 'Working on cinema verite projects. Interested in creative friendships, poetry readings, and thoughtful connection.',
    interests: ['Documentary', 'Sound Collage', 'Cinema', 'Graphic Novels'],
    paceNote: 'Creative and expressive.',
    occupation: 'Film Editor',
    portraitVariant: 'member-meera',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(60, 50, 60, 75),
    eligibility: {
      memberId: 'p15-zoya',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating'],
      discoverableInIntentions: ['friendship', 'dating'],
      blockedMemberIds: [],
      relationshipStructure: 'flexible_either',
      datingPurpose: 'intentional_dating',
      acceptableDatingPurposes: ['intentional_dating', 'committed_long_term'],
      childrenPreference: 'open_or_unsure',
      childrenRequirementLevel: 'flexible',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: { friendship: 'no_preference', dating: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },

  'p16-rahul': {
    id: 'p16-rahul',
    name: 'Rahul Sen',
    ageRange: '26',
    city: 'Mumbai',
    neighborhood: 'Colaba',
    languages: ['English', 'Hindi', 'Bengali'],
    intentions: ['friendship', 'dating'],
    primaryIntention: 'friendship',
    headline: 'Graphic novelist and ink artist exploring historical city maps.',
    bio: 'Illustrating architectural graphic novels. Seeking creative collaborators and easygoing friends for gallery visits.',
    interests: ['Illustration', 'Printmaking', 'Cafes', 'History'],
    paceNote: 'Unhurried and conversational.',
    occupation: 'Illustrator & Novelist',
    portraitVariant: 'member-aarav',
    saved: false,
    connectionState: 'discover',
    constructProfile: createConstructVector(65, 55, 55, 75),
    eligibility: {
      memberId: 'p16-rahul',
      isAdultVerified: true,
      enabledIntentions: ['friendship', 'dating'],
      discoverableInIntentions: ['friendship', 'dating'],
      blockedMemberIds: [],
      relationshipStructure: 'flexible_either',
      datingPurpose: 'intentional_dating',
      acceptableDatingPurposes: ['intentional_dating', 'committed_long_term'],
      childrenPreference: 'open_or_unsure',
      childrenRequirementLevel: 'flexible',
      smokingVapingProfile: {
        personalHabit: 'non_smoker',
        environmentComfort: 'fully_comfortable',
        partnerRequirementByIntention: { friendship: 'no_preference', dating: 'no_preference' },
        isVoluntarilyDisclosed: true,
      },
      hideCrossContextConnectionsByDefault: true,
    },
    alignment: [],
    measuredDimensions: [],
  },
};

// Seed personas into memberStore
for (const p of Object.values(SYNTHETIC_PERSONAS)) {
  memberStore.upsertMemberProfile(p);
}

// ============================================================================
// SUITE 1: THE 8 CORE MASTER SCENARIOS ACROSS FOUR SPACES
// ============================================================================

test('Phase 11 — Scenario 1: Friendship Mutual Match (Meera & Siddharth)', () => {
  const meera = SYNTHETIC_PERSONAS['p07-meera'];
  const siddharth = SYNTHETIC_PERSONAS['p08-siddharth'];

  // 1. Stage A Mutual Eligibility in Friendship
  const elig = evaluateMutualEligibility(meera.eligibility!, siddharth.eligibility!, siddharth.id, meera.id, 'friendship');
  assert.strictEqual(elig.eligible, true);
  assert.strictEqual(elig.status, 'eligible');

  // 2. Stage C Pairwise Psychological Match
  const match = evaluateMemberPairwiseMatch(meera, siddharth, 'friendship');
  assert.ok(match.dynamicSimilarityScore! >= 80, 'Expected high similarity in conversational pace and solitude preference');
  assert.strictEqual(match.dominantLens, 'Similar to Me');

  // 3. Connect in Friendship
  const intro = memberStore.createIntroduction({
    senderId: meera.id,
    receiverId: siddharth.id,
    intention: 'friendship',
    noteText: 'Hello Siddharth, I loved reading about your work with veena restoration.',
  });
  assert.strictEqual(intro.success, true);
  const acceptRes = memberStore.acceptIntroduction(intro.introduction!.id, siddharth.id);
  assert.strictEqual(acceptRes.success, true);

  // 4. Invariant: Disappear from friendship discovery because they are connected
  const meeraUpdated = memberStore.getMemberById(meera.id)!;
  const siddharthUpdated = memberStore.getMemberById(siddharth.id)!;
  const recheckFriendship = evaluateMutualEligibility(
    meeraUpdated.eligibility!,
    siddharthUpdated.eligibility!,
    siddharth.id,
    meera.id,
    'friendship'
  );
  assert.strictEqual(recheckFriendship.eligible, false);
  assert.ok(recheckFriendship.reasons.includes('already_connected_in_space'));
});

test('Phase 11 — Scenario 2: Dating Serious Match (Rohit & Tanvi)', () => {
  const rohit = SYNTHETIC_PERSONAS['p09-rohit'];
  const tanvi = SYNTHETIC_PERSONAS['p10-tanvi'];

  // 1. Dating eligibility: compatible open_preferred relationship structure & social smoking comfort
  const elig = evaluateMutualEligibility(rohit.eligibility!, tanvi.eligibility!, tanvi.id, rohit.id, 'dating');
  assert.strictEqual(elig.eligible, true);

  // 2. Pairwise match in Dating
  const match = evaluateMemberPairwiseMatch(rohit, tanvi, 'dating');
  assert.ok(typeof match.dynamicSimilarityScore === 'number');

  // 3. Connect in Dating
  const intro = memberStore.createIntroduction({
    senderId: rohit.id,
    receiverId: tanvi.id,
    intention: 'dating',
    noteText: 'Hi Tanvi, loved your design perspective and ceramic projects.',
  });
  assert.strictEqual(intro.success, true);
  const accept = memberStore.acceptIntroduction(intro.introduction!.id, tanvi.id);
  assert.strictEqual(accept.success, true);

  // 4. Invariant: Disappear from new dating discovery
  const rohitUp = memberStore.getMemberById(rohit.id)!;
  const tanviUp = memberStore.getMemberById(tanvi.id)!;
  const recheckDating = evaluateMutualEligibility(rohitUp.eligibility!, tanviUp.eligibility!, tanvi.id, rohit.id, 'dating');
  assert.strictEqual(recheckDating.eligible, false);
  assert.ok(recheckDating.reasons.includes('already_connected_in_space'));

  // 5. Invariant: Suppressed from friendship discovery
  const recheckFriendship = evaluateMutualEligibility(rohitUp.eligibility!, tanviUp.eligibility!, tanvi.id, rohit.id, 'friendship');
  assert.strictEqual(recheckFriendship.eligible, false);
  assert.ok(recheckFriendship.reasons.includes('cross_context_connection_suppressed'));
});

test('Phase 11 — Scenario 3: Matrimony Traditional Match (Kabir & Shreya)', () => {
  const kabir = SYNTHETIC_PERSONAS['p13-kabir'];
  const shreya = SYNTHETIC_PERSONAS['p14-shreya'];

  // 1. Matrimony eligibility: exclusive required, non-smoker, wants children essential
  const elig = evaluateMutualEligibility(kabir.eligibility!, shreya.eligibility!, shreya.id, kabir.id, 'matrimony');
  assert.strictEqual(elig.eligible, true);

  // 2. Connect in Matrimony
  const intro = memberStore.createIntroduction({
    senderId: kabir.id,
    receiverId: shreya.id,
    intention: 'matrimony',
    noteText: 'Respected Shreya, your research in economics and water policy is deeply inspiring.',
  });
  assert.strictEqual(intro.success, true);
  memberStore.acceptIntroduction(intro.introduction!.id, shreya.id);

  // 3. Invariant: Suppressed across all spaces
  const kUp = memberStore.getMemberById(kabir.id)!;
  const sUp = memberStore.getMemberById(shreya.id)!;
  for (const space of ['friendship', 'dating', 'matrimony', 'cofounders'] as const) {
    const res = evaluateMutualEligibility(kUp.eligibility!, sUp.eligibility!, shreya.id, kabir.id, space);
    assert.strictEqual(res.eligible, false, `Must be suppressed in ${space}`);
  }
});

test('Phase 11 — Scenario 4: Cofounder Synergy Match (Ananya & Karan)', () => {
  const ananya = SYNTHETIC_PERSONAS['p03-ananya'];
  const karan = SYNTHETIC_PERSONAS['p04-karan'];

  // 1. Cofounder eligibility
  const elig = evaluateMutualEligibility(ananya.eligibility!, karan.eligibility!, karan.id, ananya.id, 'cofounders');
  assert.strictEqual(elig.eligible, true);

  // 2. Directional Skill Complementarity
  const synergy = calculateCofounderSynergy(
    { id: ananya.id, name: ananya.name, profile: ananya.cofounderProfile!, constructs: ananya.constructProfile! },
    { id: karan.id, name: karan.name, profile: karan.cofounderProfile!, constructs: karan.constructProfile! }
  );
  assert.ok(synergy.skillComplementarity.mutualSynergyScore >= 80, 'Expected high complementary score between commercial and technical cofounders');
  assert.strictEqual(synergy.skillComplementarity.mutualSynergyLabel, 'High Mutual Complementarity');

  // 3. Connect in Cofounders
  const intro = memberStore.createIntroduction({
    senderId: ananya.id,
    receiverId: karan.id,
    intention: 'cofounders',
    noteText: 'Hi Karan, let us explore co-founding in healthtech.',
  });
  assert.strictEqual(intro.success, true);
  memberStore.acceptIntroduction(intro.introduction!.id, karan.id);

  // 4. Invariant: Suppressed from friendship discovery
  const aUp = memberStore.getMemberById(ananya.id)!;
  const kUp = memberStore.getMemberById(karan.id)!;
  const resFriend = evaluateMutualEligibility(aUp.eligibility!, kUp.eligibility!, karan.id, ananya.id, 'friendship');
  assert.strictEqual(resFriend.eligible, false);
  assert.ok(resFriend.reasons.includes('cross_context_connection_suppressed'));
});

test('Phase 11 — Scenario 5: Cross-Context Suppression Invariant (Priya & Vikas)', () => {
  // Both have ALL 4 spaces enabled originally
  const priya = SYNTHETIC_PERSONAS['p01-priya'];
  const vikas = SYNTHETIC_PERSONAS['p02-vikas'];

  // Before connecting, they are eligible in dating and matrimony
  const preDating = evaluateMutualEligibility(priya.eligibility!, vikas.eligibility!, vikas.id, priya.id, 'dating');
  const preMatrimony = evaluateMutualEligibility(priya.eligibility!, vikas.eligibility!, vikas.id, priya.id, 'matrimony');
  assert.strictEqual(preDating.eligible, true);
  assert.strictEqual(preMatrimony.eligible, true);

  // Connect in Dating
  const intro = memberStore.createIntroduction({
    senderId: priya.id,
    receiverId: vikas.id,
    intention: 'dating',
    noteText: 'Hello Vikas, I really enjoyed your notes on distributed systems.',
  });
  assert.strictEqual(intro.success, true);
  const acceptRes = memberStore.acceptIntroduction(intro.introduction!.id, vikas.id);
  assert.strictEqual(acceptRes.success, true);

  // THE FOUNDER MASTER INVARIANT VERIFICATION:
  const priyaUp = memberStore.getMemberById(priya.id)!;
  const vikasUp = memberStore.getMemberById(vikas.id)!;

  // Disappears from Matrimony discovery
  const matrimonyPtoV = evaluateMutualEligibility(priyaUp.eligibility!, vikasUp.eligibility!, vikas.id, priya.id, 'matrimony');
  assert.strictEqual(matrimonyPtoV.eligible, false);
  assert.ok(matrimonyPtoV.reasons.includes('cross_context_connection_suppressed'));

  const matrimonyVtoP = evaluateMutualEligibility(vikasUp.eligibility!, priyaUp.eligibility!, priya.id, vikas.id, 'matrimony');
  assert.strictEqual(matrimonyVtoP.eligible, false);
  assert.ok(matrimonyVtoP.reasons.includes('cross_context_connection_suppressed'));

  // Disappears from Friendship discovery
  const friendRes = evaluateMutualEligibility(priyaUp.eligibility!, vikasUp.eligibility!, vikas.id, priya.id, 'friendship');
  assert.strictEqual(friendRes.eligible, false);
  assert.ok(friendRes.reasons.includes('cross_context_connection_suppressed'));

  // Disappears from Cofounders discovery
  const cofounderRes = evaluateMutualEligibility(priyaUp.eligibility!, vikasUp.eligibility!, vikas.id, priya.id, 'cofounders');
  assert.strictEqual(cofounderRes.eligible, false);
  assert.ok(cofounderRes.reasons.includes('cross_context_connection_suppressed'));

  // Disappears from Dating discovery (they are already connected!)
  const datingRes = evaluateMutualEligibility(priyaUp.eligibility!, vikasUp.eligibility!, vikas.id, priya.id, 'dating');
  assert.strictEqual(datingRes.eligible, false);
  assert.ok(datingRes.reasons.includes('already_connected_in_space'));

  // Cannot send second introduction in Matrimony
  const secondIntro = memberStore.createIntroduction({
    senderId: priya.id,
    receiverId: vikas.id,
    intention: 'matrimony',
    noteText: 'Can we connect in Matrimony too?',
  });
  assert.strictEqual(secondIntro.success, false);
  assert.ok(
    secondIntro.error?.includes('already connected') ||
    secondIntro.error?.includes('cross_context_connection_suppressed')
  );
});

test('Phase 11 — Scenario 6: Same-Context Discovery Cleanup in filterProfilesByFullSimilaritySpectrum', () => {
  const priya = memberStore.getMemberById('p01-priya')!;
  const vikas = memberStore.getMemberById('p02-vikas')!;

  // Both are connected in Dating from Scenario 5.
  // Discovery feed for Priya in Dating MUST NOT include Vikas!
  const results = filterProfilesByFullSimilaritySpectrum([vikas], {
    intention: 'dating',
    city: 'all',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 100,
    lensView: 'all',
    sortBySimilarity: 'none',
    viewerEligibility: priya.eligibility,
    viewerId: priya.id,
  });

  assert.strictEqual(results.length, 0, 'Connected partner must not show up in new discovery feed');
});

test('Phase 11 — Scenario 7: Asymmetric Intention Isolation (Meera & Priya)', () => {
  const meera = SYNTHETIC_PERSONAS['p07-meera']; // Only Friendship enabled
  const priya = SYNTHETIC_PERSONAS['p01-priya']; // All 4 enabled

  // In Friendship: Eligible
  const friendRes = evaluateMutualEligibility(priya.eligibility!, meera.eligibility!, meera.id, priya.id, 'friendship');
  assert.strictEqual(friendRes.eligible, true);

  // In Dating: Strictly Ineligible (Meera does not have dating enabled)
  const datingRes = evaluateMutualEligibility(priya.eligibility!, meera.eligibility!, meera.id, priya.id, 'dating');
  assert.strictEqual(datingRes.eligible, false);
  assert.ok(datingRes.reasons.includes('intention_not_mutually_enabled'));

  // Priya cannot create a dating introduction to Meera
  const introAttempt = memberStore.createIntroduction({
    senderId: priya.id,
    receiverId: meera.id,
    intention: 'dating',
    noteText: 'Would you like to date?',
  });
  assert.strictEqual(introAttempt.success, false);
  assert.ok(introAttempt.error?.includes('intention_not_mutually_enabled'));
});

test('Phase 11 — Scenario 8: Mutual Decline / Withdrawal State Machine (Zoya & Rahul)', () => {
  const zoya = SYNTHETIC_PERSONAS['p15-zoya'];
  const rahul = SYNTHETIC_PERSONAS['p16-rahul'];

  // Zoya sends intro note to Rahul in Friendship
  const intro1 = memberStore.createIntroduction({
    senderId: zoya.id,
    receiverId: rahul.id,
    intention: 'friendship',
    noteText: 'Hey Rahul, let us check out the comic art gallery exhibition.',
  });
  assert.strictEqual(intro1.success, true);
  assert.strictEqual(intro1.introduction!.state, 'sent');

  // While pending, Rahul cannot send duplicate intro to Zoya
  const dup = memberStore.createIntroduction({
    senderId: rahul.id,
    receiverId: zoya.id,
    intention: 'friendship',
    noteText: 'Hey Zoya!',
  });
  assert.strictEqual(dup.success, false);
  assert.ok(dup.error?.includes('active introduction or connection already exists'));

  // Rahul declines intro
  const decline = memberStore.declineIntroduction(intro1.introduction!.id, rahul.id);
  assert.strictEqual(decline.success, true);

  // After decline, Zoya withdraws or state allows clean termination without dangling connection
  const introList = memberStore.getIntroductionsForMember(zoya.id);
  const introRecord = introList.find((i) => i.id === intro1.introduction!.id);
  assert.strictEqual(introRecord?.state, 'declined');
});

// ============================================================================
// SUITE 2: 1,024-CELL EXHAUSTIVE PERMUTATION MATRIX VERIFICATION
// ============================================================================

test('Phase 11 — 1,024-Cell Permutation Matrix (16 Personas x 16 Candidates x 4 Spaces)', () => {
  const personaIds = Object.keys(SYNTHETIC_PERSONAS);
  assert.strictEqual(personaIds.length, 16, 'Cohort must contain exactly 16 synthetic personas');

  const spaces: ExtendedIntentionId[] = ['friendship', 'dating', 'matrimony', 'cofounders'];
  let totalEvaluations = 0;
  let selfMatchesBlocked = 0;
  let eligibleCount = 0;
  let ineligibleCount = 0;

  for (const vId of personaIds) {
    const viewer = SYNTHETIC_PERSONAS[vId];
    for (const cId of personaIds) {
      const candidate = SYNTHETIC_PERSONAS[cId];
      for (const space of spaces) {
        totalEvaluations++;

        const result = evaluateMutualEligibility(
          viewer.eligibility!,
          candidate.eligibility!,
          cId,
          vId,
          space
        );

        if (vId === cId) {
          selfMatchesBlocked++;
          assert.strictEqual(result.eligible, false, 'Self-matching must always be false');
          assert.ok(result.reasons.includes('self_matching_prohibited'));
        } else if (result.eligible) {
          eligibleCount++;
          // Ensure mutual enablement invariant holds whenever eligible
          assert.ok(viewer.eligibility!.enabledIntentions?.includes(space));
          assert.ok(candidate.eligibility!.enabledIntentions?.includes(space));
        } else {
          ineligibleCount++;
          assert.ok(result.reasons.length > 0, 'Every rejection must provide transparent reasons');
        }
      }
    }
  }

  assert.strictEqual(totalEvaluations, 1024, 'Expected exactly 16 * 16 * 4 = 1,024 cells evaluated');
  assert.strictEqual(selfMatchesBlocked, 64, 'Expected exactly 16 personas * 4 spaces = 64 self-match blocks');
  assert.ok(eligibleCount > 0, 'Expected positive valid matches in matrix');
});

// ============================================================================
// SUITE 3: 20 NEGATIVE SECURITY & EDGE-CASE ATTACK VECTORS
// ============================================================================

test('Phase 11 — Negative Security Attack Vectors 1 to 10', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Vector 1: Self-introduction attempt
  const v1 = await d1Service.createIntroduction('p01-priya', 'p01-priya', 'dating', 'Note to self');
  assert.strictEqual(v1.success, false);
  assert.ok(v1.error?.includes('self'));

  // Vector 2: Unverified adult candidate fails closed
  const unverifiedCandidate: MemberEligibilityRequirements = {
    memberId: 'unverified-1',
    isAdultVerified: false,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };
  const v2 = evaluateMutualEligibility(
    SYNTHETIC_PERSONAS['p01-priya'].eligibility!,
    unverifiedCandidate,
    'unverified-1',
    'p01-priya',
    'dating'
  );
  assert.strictEqual(v2.eligible, false);
  assert.ok(v2.reasons.includes('adult_verification_required_fail_closed'));

  // Vector 3: Unverified adult viewer fails closed
  const unverifiedViewer: MemberEligibilityRequirements = {
    memberId: 'unverified-viewer',
    isAdultVerified: false,
    enabledIntentions: ['dating'],
    discoverableInIntentions: ['dating'],
    blockedMemberIds: [],
  };
  const v3 = evaluateMutualEligibility(
    unverifiedViewer,
    SYNTHETIC_PERSONAS['p02-vikas'].eligibility!,
    'p02-vikas',
    'unverified-viewer',
    'dating'
  );
  assert.strictEqual(v3.eligible, false);
  assert.ok(v3.reasons.includes('adult_verification_required_fail_closed'));

  // Vector 4: Revoked discovery consent (discoverableInIntentions = [])
  const noDiscoveryCandidate: MemberEligibilityRequirements = {
    memberId: 'no-discovery',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoverableInIntentions: [], // explicit empty
    blockedMemberIds: [],
  };
  const v4 = evaluateMutualEligibility(
    SYNTHETIC_PERSONAS['p01-priya'].eligibility!,
    noDiscoveryCandidate,
    'no-discovery',
    'p01-priya',
    'dating'
  );
  assert.strictEqual(v4.eligible, false);
  assert.ok(v4.reasons.includes('intention_not_mutually_enabled'));

  // Vector 5: Revoked discovery consent via discoveryConsentGiven = false
  const consentRevoked: MemberEligibilityRequirements = {
    memberId: 'revoked',
    isAdultVerified: true,
    enabledIntentions: ['dating'],
    discoveryConsentGiven: false,
    blockedMemberIds: [],
  };
  const v5 = evaluateMutualEligibility(
    SYNTHETIC_PERSONAS['p01-priya'].eligibility!,
    consentRevoked,
    'revoked',
    'p01-priya',
    'dating'
  );
  assert.strictEqual(v5.eligible, false);

  // Vector 6: Missing eligibility record on candidate fails closed
  const v6 = filterProfilesByFullSimilaritySpectrum([
    { ...SYNTHETIC_PERSONAS['p02-vikas'], eligibility: undefined } as any,
  ], {
    intention: 'dating',
    city: 'all',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 100,
    lensView: 'all',
    sortBySimilarity: 'none',
    viewerEligibility: SYNTHETIC_PERSONAS['p01-priya'].eligibility,
  });
  assert.strictEqual(v6.length, 0);

  // Vector 7: Missing eligibility record on viewer fails closed
  const v7 = filterProfilesByFullSimilaritySpectrum([SYNTHETIC_PERSONAS['p02-vikas']], {
    intention: 'dating',
    city: 'all',
    searchQuery: '',
    savedOnly: false,
    minSimilarity: 0,
    maxSimilarity: 100,
    lensView: 'all',
    sortBySimilarity: 'none',
    viewerEligibility: undefined,
  });
  assert.strictEqual(v7.length, 0);

  // Vector 8: Blocked member cannot be discovered
  const blockingViewer: MemberEligibilityRequirements = {
    ...SYNTHETIC_PERSONAS['p01-priya'].eligibility!,
    blockedMemberIds: ['p02-vikas'],
  };
  const v8 = evaluateMutualEligibility(
    blockingViewer,
    SYNTHETIC_PERSONAS['p02-vikas'].eligibility!,
    'p02-vikas',
    'p01-priya',
    'dating'
  );
  assert.strictEqual(v8.eligible, false);
  assert.ok(v8.reasons.includes('member_block_active'));

  // Vector 9: Blocked member attempt to introduce returns failure
  memberStore.blockMember('p01-priya', 'p02-vikas');
  await d1Service.blockMember('p01-priya', 'p02-vikas');
  const v9 = await handleApiRequest({
    method: 'POST',
    path: '/api/member/introductions',
    headers: { Authorization: 'Bearer dev-token-p02-vikas-member' },
    body: { receiverId: 'p01-priya', intention: 'dating', noteText: 'Hello' },
  }, { db: mockD1, allowDevTokens: true });
  assert.ok([400, 403, 409].includes(v9.status));

  // Vector 10: Unauthorized introduction accept (third party user)
  const introRes = await d1Service.createIntroduction('p05-diya', 'p06-arjun', 'matrimony', 'Intro note');
  assert.strictEqual(introRes.success, true);
  const v10 = await d1Service.acceptIntroduction(introRes.introduction!.id, 'attacker-user');
  assert.strictEqual(v10.success, false);
  assert.ok(v10.error?.includes('Unauthorized'));
});

test('Phase 11 — Negative Security Attack Vectors 11 to 20', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1Service = new KithraD1Service(mockD1);

  // Vector 11: Unauthorized introduction decline (sender cannot decline their own intro)
  const introRes1 = await d1Service.createIntroduction('p05-diya', 'p06-arjun', 'matrimony', 'Intro note');
  const v11 = await d1Service.declineIntroduction(introRes1.introduction!.id, 'p05-diya');
  assert.strictEqual(v11.success, false);
  assert.ok(v11.error?.includes('Unauthorized'));

  // Vector 12: Unauthorized introduction withdraw (receiver cannot withdraw intro sent to them)
  const v12 = await d1Service.withdrawIntroduction(introRes1.introduction!.id, 'p06-arjun');
  assert.strictEqual(v12.success, false);
  assert.ok(v12.error?.includes('Unauthorized'));

  // Vector 13: Expired introduction acceptance
  const expiredIntro = await d1Service.createIntroduction('p15-zoya', 'p16-rahul', 'dating', 'Expired test');
  await mockD1
    .prepare('UPDATE introductions SET expires_at = ? WHERE id = ?')
    .bind(Date.now() - 1000, expiredIntro.introduction!.id)
    .run();
  const v13 = await d1Service.acceptIntroduction(expiredIntro.introduction!.id, 'p16-rahul');
  assert.strictEqual(v13.success, false);
  assert.ok(v13.error?.includes('expired'));

  // Vector 14: Cross-context introduction bypass in D1
  await d1Service.acceptIntroduction(introRes1.introduction!.id, 'p06-arjun');
  const v14 = await d1Service.createIntroduction('p05-diya', 'p06-arjun', 'dating', 'Trying second intro');
  assert.strictEqual(v14.success, false);
  assert.ok(v14.error?.includes('already have an active connection in matrimony'));

  // Vector 15: Duplicate active introduction race condition
  const introA = await d1Service.createIntroduction('p11-neha', 'p12-aditya', 'cofounders', 'First intro');
  assert.strictEqual(introA.success, true);
  const v15 = await d1Service.createIntroduction('p11-neha', 'p12-aditya', 'cofounders', 'Duplicate race intro');
  assert.strictEqual(v15.success, false);
  assert.ok(v15.error?.includes('already pending'));

  // Vector 16: Message injection into non-connected pair conversation
  const v16 = await d1Service.sendMessage('conv_nonexistent', 'p01-priya', 'p02-vikas', 'Injected message');
  assert.strictEqual(v16.success, false);
  assert.ok(v16.error?.includes('Conversation not found'));

  // Vector 17: Canonical pair key commutativity
  const key1 = getCanonicalPairId('user-alpha', 'user-beta');
  const key2 = getCanonicalPairId('user-beta', 'user-alpha');
  assert.strictEqual(key1, key2, 'Canonical pair key must be commutative');
  assert.strictEqual(key1, 'pair_user-alpha_user-beta');

  // Vector 18: Staff Raw Answer 403 Forbidden Access
  const v18 = await handleApiRequest({
    method: 'GET',
    path: '/api/admin/quiz-answers/p01-priya',
    headers: { Authorization: 'Bearer dev-token-staff-admin' },
  }, { allowDevTokens: true });
  assert.strictEqual(v18.status, 403);
  assert.strictEqual((v18.body as any).error, 'SERVER_SIDE_ACCESS_DENIED');

  // Vector 19: Cryptographic Token Requirement in Staging
  const v19 = await handleApiRequest({
    method: 'GET',
    path: '/api/member/profile',
    headers: { Authorization: 'Bearer mock-token-123' },
  }, { requireCrypto: true, allowDevTokens: false });
  assert.strictEqual(v19.status, 401);

  // Vector 20: DPDP Act 2023 Section 12 Data Erasure purges answers
  await d1Service.recordQuizAnswer('p01-priya', 'q-pace', 'opt-slow', 'sem-slow', 0, 3200);
  const answersPre = await d1Service.getSavedQuizAnswers('p01-priya');
  assert.ok(answersPre['q-pace']);
  await d1Service.deleteMemberAssessmentData('p01-priya');
  const answersPost = await d1Service.getSavedQuizAnswers('p01-priya');
  assert.strictEqual(Object.keys(answersPost).length, 0, 'DPDP erasure must completely purge answers');
});

// ============================================================================
// SUITE 4: D1 RELATIONAL PERSISTENCE & REST APIS END-TO-END
// ============================================================================

test('Phase 11 — D1 Pair Relationship Ledger & Conversation Messaging Flow', async () => {
  const mockD1 = new LocalD1DatabaseMock();
  const d1 = new KithraD1Service(mockD1);

  // 1. Initial State: pair relationship is empty
  const initialPair = await d1.getPairRelationshipBetween('p05-diya', 'p06-arjun');
  assert.strictEqual(initialPair, null);

  // 2. Diya creates introduction to Arjun
  const introRes = await d1.createIntroduction(
    'p05-diya',
    'p06-arjun',
    'matrimony',
    'Hello Arjun, I found your legal background and values very inspiring.'
  );
  assert.strictEqual(introRes.success, true);
  const introId = introRes.introduction!.id;

  // Verify pair relationship is pending_introduction
  const pendingPair = await d1.getPairRelationshipBetween('p05-diya', 'p06-arjun');
  assert.ok(pendingPair);
  assert.strictEqual(pendingPair?.relationship_state, 'pending_introduction');
  assert.strictEqual(pendingPair?.suppression_status, 'space_suppressed');

  // 3. Arjun accepts introduction via API router
  const acceptApiRes = await handleApiRequest({
    method: 'POST',
    path: `/api/member/introductions/${introId}/accept`,
    headers: { Authorization: 'Bearer dev-token-p06-arjun-member' },
  }, { db: mockD1, allowDevTokens: true });

  assert.strictEqual(acceptApiRes.status, 200);
  assert.strictEqual((acceptApiRes.body as any).success, true);
  const convId = (acceptApiRes.body as any).conversationId;
  assert.ok(convId);

  // 4. Verify pair relationship is now accepted_connection with all_spaces_suppressed
  const acceptedPair = await d1.getPairRelationshipBetween('p05-diya', 'p06-arjun');
  assert.strictEqual(acceptedPair?.relationship_state, 'accepted_connection');
  assert.strictEqual(acceptedPair?.suppression_status, 'all_spaces_suppressed');
  assert.strictEqual(acceptedPair?.active_space, 'matrimony');

  // 5. Send real messages within the accepted conversation
  const msg1 = await d1.sendMessage(convId, 'p06-arjun', 'p05-diya', 'Thank you for your note, Diya.');
  assert.strictEqual(msg1.success, true);

  const msg2 = await d1.sendMessage(convId, 'p05-diya', 'p06-arjun', 'Nice to connect, Arjun!');
  assert.strictEqual(msg2.success, true);

  const messages = await d1.getMessages(convId);
  assert.strictEqual(messages.length, 2);
  assert.strictEqual(messages[0].content, 'Thank you for your note, Diya.');
  assert.strictEqual(messages[1].content, 'Nice to connect, Arjun!');

  // 6. Active Connections query
  const diyaConnections = await d1.getActiveConnectionsForMember('p05-diya');
  assert.strictEqual(diyaConnections.length, 1);
  assert.strictEqual(diyaConnections[0].active_space, 'matrimony');
});
