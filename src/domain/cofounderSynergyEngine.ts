/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA COFOUNDER SYNERGY ENGINE (FIRE + AIR)
 * Version: 2026.11
 * 
 * "Fire meets air. Different strengths, one shared vision."
 * 
 * Evaluates professional partnership compatibility across four explainable pillars:
 * 1. Pillar A: Shared Direction (Industry, idea stage, funding, commitment, location)
 * 2. Pillar B: Directional Skill Complementarity (Two-Way Matrix: Does B offer what A needs? Does A offer what B needs?)
 * 3. Pillar C: Working-Style Compatibility (Decision speed, constructive conflict, planning structure)
 * 4. Pillar D: Unresolved Partnership Questions (Equity expectations, runway, weekly hours)
 * 
 * Strictly separated from romantic and matrimonial matching.
 * Never predicts startup success or claims psychological lie detection.
 */

import {
  CofounderProfile,
  CofounderSkillCategory,
  CofounderOfferedSkill,
  CofounderNeededSkill,
  SkillProficiencyLevel,
  ConstructVectorPoint,
} from '../types/kithra';

export interface DirectionalSkillCoverage {
  providerName: string;
  recipientName: string;
  criticalSkillsMatched: { skillId: CofounderSkillCategory; proficiency: SkillProficiencyLevel }[];
  criticalSkillsMissing: CofounderSkillCategory[];
  preferredSkillsMatched: { skillId: CofounderSkillCategory; proficiency: SkillProficiencyLevel }[];
  canHireSkills: CofounderSkillCategory[];
  coverageRatio: number; // 0..1
}

export interface WorkingStyleInsight {
  dimension: string;
  founderApproachA: string;
  founderApproachB: string;
  synthesisNote: string;
  potentialFrictionPoint?: string;
  discussionPrompt: string;
}

export interface CofounderSynergyReport {
  founderAId: string;
  founderBId: string;
  engineVersion: string;
  calculatedAt: number;

  // Pillar A: Shared Direction
  sharedDirection: {
    alignedIndustries: string[];
    ideaStageCompatibility: 'compatible' | 'moderate_divergence' | 'incompatible';
    ideaStageExplanation: string;
    fundingCompatibility: 'aligned' | 'open_to_discussion' | 'incompatible';
    fundingExplanation: string;
    timeCommitmentCompatibility: 'aligned' | 'transition_path' | 'incompatible';
    timeCommitmentExplanation: string;
    locationCompatibility: 'aligned' | 'hybrid_viable' | 'incompatible';
    locationExplanation: string;
    isDirectionallyEligible: boolean;
  };

  // Pillar B: Directional Skill Complementarity (Two-Way Matrix)
  skillComplementarity: {
    bCoversANeeds: DirectionalSkillCoverage;
    aCoversBNeeds: DirectionalSkillCoverage;
    mutualSynergyScore: number; // 0..100
    mutualSynergyLabel: 'High Mutual Complementarity' | 'One-Way Capability Match' | 'Capability Gap';
    keyStrengthsExplanation: string;
    missingCollectiveSkills: CofounderSkillCategory[];
  };

  // Pillar C: Working-Style Psychology (Professional)
  workingStyle: {
    decisionMakingStyle: WorkingStyleInsight;
    conflictResolutionStyle: WorkingStyleInsight;
    planningPaceStyle: WorkingStyleInsight;
    overallStyleCompatibility: 'complementary_dynamic' | 'balanced_alignment' | 'friction_risk';
    summaryExplanation: string;
  };

  // Pillar D: Unresolved Partnership Questions
  unresolvedQuestions: {
    equityDiscussionStatus: string;
    runwayAndCapitalStatus: string;
    roleClarityStatus: string;
    recommendedDiscussionTopics: string[];
  };

  // Founder-Facing Card Synthesis
  headlineSynthesis: string;
  whyWeMightBuildWellTogether: string[];
}

/**
 * Evaluates directional skill coverage:
 * Does `provider` offer the skills `recipient` needs?
 */
export function evaluateDirectionalSkillCoverage(
  recipient: { name: string; needed: CofounderNeededSkill[] },
  provider: { name: string; offered: CofounderOfferedSkill[] }
): DirectionalSkillCoverage {
  const offeredMap = new Map<CofounderSkillCategory, CofounderOfferedSkill>();
  for (const skill of provider.offered) {
    offeredMap.set(skill.skillId, skill);
  }

  const criticalMatched: { skillId: CofounderSkillCategory; proficiency: SkillProficiencyLevel }[] = [];
  const criticalMissing: CofounderSkillCategory[] = [];
  const preferredMatched: { skillId: CofounderSkillCategory; proficiency: SkillProficiencyLevel }[] = [];
  const canHire: CofounderSkillCategory[] = [];

  for (const needed of recipient.needed) {
    if (needed.canHireInstead) {
      canHire.push(needed.skillId);
      continue;
    }

    const offered = offeredMap.get(needed.skillId);
    if (needed.priority === 'critical') {
      if (offered) {
        criticalMatched.push({ skillId: offered.skillId, proficiency: offered.proficiency });
      } else {
        criticalMissing.push(needed.skillId);
      }
    } else {
      if (offered) {
        preferredMatched.push({ skillId: offered.skillId, proficiency: offered.proficiency });
      }
    }
  }

  const totalEvaluated = criticalMatched.length + criticalMissing.length + preferredMatched.length;
  const totalCovered = criticalMatched.length + preferredMatched.length;
  const coverageRatio = totalEvaluated > 0 ? totalCovered / totalEvaluated : 1.0;

  return {
    providerName: provider.name,
    recipientName: recipient.name,
    criticalSkillsMatched: criticalMatched,
    criticalSkillsMissing: criticalMissing,
    preferredSkillsMatched: preferredMatched,
    canHireSkills: canHire,
    coverageRatio,
  };
}

/**
 * Calculates complete Cofounder Synergy between Founder A and Founder B.
 */
export function calculateCofounderSynergy(
  founderA: { id: string; name: string; profile: CofounderProfile; constructs?: ConstructVectorPoint[] },
  founderB: { id: string; name: string; profile: CofounderProfile; constructs?: ConstructVectorPoint[] }
): CofounderSynergyReport {
  const pA = founderA.profile;
  const pB = founderB.profile;

  // Pillar A: Shared Direction
  const alignedIndustries = pA.startupInterests.filter((ind) =>
    pB.startupInterests.some((bInd) => bInd.toLowerCase() === ind.toLowerCase())
  );

  // Funding compatibility
  let fundingCompatibility: 'aligned' | 'open_to_discussion' | 'incompatible' = 'open_to_discussion';
  let fundingExplanation = 'Both founders are open to discussing funding options.';
  if (pA.fundingPreference === pB.fundingPreference) {
    fundingCompatibility = 'aligned';
    fundingExplanation = `Both founders prefer a ${pA.fundingPreference === 'bootstrapped' ? 'bootstrapped, capital-efficient' : 'venture-backed'} trajectory.`;
  } else if (pA.fundingPreference === 'open_to_either' || pB.fundingPreference === 'open_to_either') {
    fundingCompatibility = 'open_to_discussion';
    fundingExplanation = 'One or both founders are flexible between bootstrapping and venture capital.';
  } else {
    fundingCompatibility = 'incompatible';
    fundingExplanation = 'Fundamental funding divergence: One founder requires bootstrapping while the other requires venture backing.';
  }

  // Time commitment compatibility
  let timeCompatibility: 'aligned' | 'transition_path' | 'incompatible' = 'aligned';
  let timeExplanation = 'Both founders share compatible time commitment horizons.';
  if (pA.timeCommitment && pA.timeCommitment === pB.timeCommitment) {
    timeCompatibility = 'aligned';
    timeExplanation = `Both founders are prepared for ${pA.timeCommitment.replace(/_/g, ' ')}.`;
  } else if (!pA.timeCommitment || !pB.timeCommitment) {
    timeCompatibility = 'aligned';
    timeExplanation = 'Commitment horizons are open or flexible.';
  } else if (
    (pA.timeCommitment === 'full_time_now' && pB.timeCommitment === 'transition_in_3_months') ||
    (pB.timeCommitment === 'full_time_now' && pA.timeCommitment === 'transition_in_3_months')
  ) {
    timeCompatibility = 'transition_path';
    timeExplanation = 'One founder is full-time now; the other plans to transition within 3 months.';
  } else if (
    (pA.timeCommitment === 'part_time_evenings' && pB.timeCommitment === 'full_time_now') ||
    (pB.timeCommitment === 'part_time_evenings' && pA.timeCommitment === 'full_time_now')
  ) {
    timeCompatibility = 'incompatible';
    timeExplanation = 'Commitment imbalance: One founder is full-time while the other can only commit part-time evenings.';
  }

  // Location compatibility
  let locationCompatibility: 'aligned' | 'hybrid_viable' | 'incompatible' = 'aligned';
  let locationExplanation = 'Location preferences align well.';
  if (pA.locationPreference === 'in_person_city' && pB.locationPreference === 'in_person_city') {
    if (pA.city && pB.city && pA.city.toLowerCase() === pB.city.toLowerCase()) {
      locationCompatibility = 'aligned';
      locationExplanation = `Both founders are based in ${pA.city} and want an in-person working relationship.`;
    } else {
      locationCompatibility = 'incompatible';
      locationExplanation = `Both founders require in-person collaboration but reside in different locations (${pA.city ?? 'Unknown'} vs ${pB.city ?? 'Unknown'}).`;
    }
  } else if (pA.locationPreference === 'remote_first' || pB.locationPreference === 'remote_first') {
    locationCompatibility = 'aligned';
    locationExplanation = 'Remote-first collaboration allows seamless distributed work.';
  } else {
    locationCompatibility = 'hybrid_viable';
    locationExplanation = 'Hybrid collaboration is viable with scheduled in-person sprint rhythms.';
  }

  const isDirectionallyEligible =
    fundingCompatibility !== 'incompatible' &&
    timeCompatibility !== 'incompatible' &&
    locationCompatibility !== 'incompatible';

  // Pillar B: Two-Way Directional Skill Complementarity
  const bCoversA = evaluateDirectionalSkillCoverage(
    { name: founderA.name, needed: pA.skillsNeeded },
    { name: founderB.name, offered: pB.skillsOffered }
  );

  const aCoversB = evaluateDirectionalSkillCoverage(
    { name: founderB.name, needed: pB.skillsNeeded },
    { name: founderA.name, offered: pA.skillsOffered }
  );

  const mutualScore = Math.round(((bCoversA.coverageRatio + aCoversB.coverageRatio) / 2) * 100);

  let synergyLabel: 'High Mutual Complementarity' | 'One-Way Capability Match' | 'Capability Gap' = 'Capability Gap';
  if (bCoversA.criticalSkillsMissing.length === 0 && aCoversB.criticalSkillsMissing.length === 0) {
    synergyLabel = 'High Mutual Complementarity';
  } else if (bCoversA.criticalSkillsMissing.length === 0 || aCoversB.criticalSkillsMissing.length === 0) {
    synergyLabel = 'One-Way Capability Match';
  }

  // Key strengths explanation
  const aOffersNames = pA.skillsOffered.map((s) => s.skillId.replace(/_/g, ' ')).join(', ');
  const bOffersNames = pB.skillsOffered.map((s) => s.skillId.replace(/_/g, ' ')).join(', ');
  const keyStrengthsExplanation = `${founderA.name} contributes expertise in [${aOffersNames}]. ${founderB.name} complements with [${bOffersNames}].`;

  // Collective missing skills
  const collectiveOffered = new Set([
    ...pA.skillsOffered.map((s) => s.skillId),
    ...pB.skillsOffered.map((s) => s.skillId),
  ]);
  const missingCollectiveSkills = [
    ...pA.skillsNeeded.map((s) => s.skillId),
    ...pB.skillsNeeded.map((s) => s.skillId),
  ].filter((sId) => !collectiveOffered.has(sId));

  // Pillar C: Working-Style Psychology (Dynamic Evidence-Based Synthesis, P4 Fix)
  const getScore = (constructs?: ConstructVectorPoint[], targetId?: string): number | undefined => {
    if (!constructs) return undefined;
    const item = constructs.find(
      (c) => c.constructId === targetId || (targetId && c.constructId.includes(targetId))
    );
    return item?.score;
  };

  const decisionScoreA = getScore(founderA.constructs, 'adaptability_change') ?? getScore(founderA.constructs, 'decision_speed');
  const decisionScoreB = getScore(founderB.constructs, 'adaptability_change') ?? getScore(founderB.constructs, 'decision_speed');

  const conflictScoreA = getScore(founderA.constructs, 'conflict_repair');
  const conflictScoreB = getScore(founderB.constructs, 'conflict_repair');

  const planningScoreA = getScore(founderA.constructs, 'daily_lifestyle') ?? getScore(founderA.constructs, 'planning_structure');
  const planningScoreB = getScore(founderB.constructs, 'daily_lifestyle') ?? getScore(founderB.constructs, 'planning_structure');

  // 1. Decision Speed & Risk Review
  let decisionApproachA = 'Not yet assessed (requires Work-Style reflections)';
  let decisionApproachB = 'Not yet assessed (requires Work-Style reflections)';
  let decisionSynthesis = 'Decision-making approaches have not been compared yet. Complete Work-Style module to view comparative analysis.';
  let decisionFriction: string | undefined = undefined;

  if (decisionScoreA !== undefined || decisionScoreB !== undefined) {
    decisionApproachA =
      decisionScoreA === undefined
        ? 'Not yet assessed'
        : decisionScoreA >= 60
          ? 'Iterative, rapid execution with agile user testing'
          : decisionScoreA <= 40
            ? 'Thorough analytical risk modeling and structural diligence'
            : 'Balanced execution weighing speed against risk diligence';

    decisionApproachB =
      decisionScoreB === undefined
        ? 'Not yet assessed'
        : decisionScoreB >= 60
          ? 'Iterative, rapid execution with agile user testing'
          : decisionScoreB <= 40
            ? 'Thorough analytical risk modeling and structural diligence'
            : 'Balanced execution weighing speed against risk diligence';

    if (decisionScoreA !== undefined && decisionScoreB !== undefined) {
      if (Math.abs(decisionScoreA - decisionScoreB) >= 20) {
        decisionSynthesis = `Classic Fire + Air dynamic: ${founderA.name} and ${founderB.name} bring complementary pacing (momentum vs risk diligence).`;
        decisionFriction = `${founderA.name} and ${founderB.name} move at different natural validation velocities; agree upfront on release criteria.`;
      } else {
        decisionSynthesis = `Aligned decision cadence: Both founders share compatible execution and risk pacing.`;
      }
    }
  }

  const decisionMakingStyle: WorkingStyleInsight = {
    dimension: 'Decision Speed & Risk Review',
    founderApproachA: decisionApproachA,
    founderApproachB: decisionApproachB,
    synthesisNote: decisionSynthesis,
    potentialFrictionPoint: decisionFriction,
    discussionPrompt: 'How will we decide when a product decision requires immediate action versus deliberate consensus?',
  };

  // 2. Constructive Disagreement & Repair
  let conflictApproachA = 'Not yet assessed (requires Work-Style reflections)';
  let conflictApproachB = 'Not yet assessed (requires Work-Style reflections)';
  let conflictSynthesis = 'Conflict repair style has not been compared yet. Mutual expectations should be discussed early.';

  if (conflictScoreA !== undefined || conflictScoreB !== undefined) {
    conflictApproachA =
      conflictScoreA === undefined
        ? 'Not yet assessed'
        : conflictScoreA >= 60
          ? 'Direct, real-time debate focused on rapid issue clearance'
          : conflictScoreA <= 40
            ? 'Reflective, structured evaluation with overnight consideration'
            : 'Collaborative discussion balancing candor with reflection';

    conflictApproachB =
      conflictScoreB === undefined
        ? 'Not yet assessed'
        : conflictScoreB >= 60
          ? 'Direct, real-time debate focused on rapid issue clearance'
          : conflictScoreB <= 40
            ? 'Reflective, structured evaluation with overnight consideration'
            : 'Collaborative discussion balancing candor with reflection';

    if (conflictScoreA !== undefined && conflictScoreB !== undefined) {
      conflictSynthesis =
        Math.abs(conflictScoreA - conflictScoreB) >= 20
          ? 'Clear boundary agreement prevents misunderstandings during high-pressure pivot discussions.'
          : 'Aligned communication expectations during strategic disagreements.';
    }
  }

  const conflictResolutionStyle: WorkingStyleInsight = {
    dimension: 'Constructive Disagreement & Repair',
    founderApproachA: conflictApproachA,
    founderApproachB: conflictApproachB,
    synthesisNote: conflictSynthesis,
    discussionPrompt: 'When a strong strategic disagreement arises, what is our agreed 24-hour escalation and resolution protocol?',
  };

  // 3. Roadmap Structure & Adaptability
  let planningApproachA = 'Not yet assessed (requires Work-Style reflections)';
  let planningApproachB = 'Not yet assessed (requires Work-Style reflections)';
  let planningSynthesis = 'Roadmap cadence has not been compared yet. Review planning rhythms during initial sync.';

  if (planningScoreA !== undefined || planningScoreB !== undefined) {
    planningApproachA =
      planningScoreA === undefined
        ? 'Not yet assessed'
        : planningScoreA >= 60
          ? 'Adaptive milestone sprints that pivot as customer insights arrive'
          : planningScoreA <= 40
            ? 'Systematic quarterly OKRs with documented resource allocation'
            : 'Hybrid cadence combining structured goals with flexible sprints';

    planningApproachB =
      planningScoreB === undefined
        ? 'Not yet assessed'
        : planningScoreB >= 60
          ? 'Adaptive milestone sprints that pivot as customer insights arrive'
          : planningScoreB <= 40
            ? 'Systematic quarterly OKRs with documented resource allocation'
            : 'Hybrid cadence combining structured goals with flexible sprints';

    if (planningScoreA !== undefined && planningScoreB !== undefined) {
      planningSynthesis =
        Math.abs(planningScoreA - planningScoreB) >= 20
          ? 'Balanced planning cadence: agile execution anchored inside structured quarterly objectives.'
          : 'Cohesive roadmap alignment: Both founders share compatible sprint horizons.';
    }
  }

  const planningPaceStyle: WorkingStyleInsight = {
    dimension: 'Roadmap Structure & Adaptability',
    founderApproachA: planningApproachA,
    founderApproachB: planningApproachB,
    synthesisNote: planningSynthesis,
    discussionPrompt: 'How frequently will we re-evaluate product roadmap priorities against core unit economics?',
  };

  const hasPsychologicalEvidence =
    (decisionScoreA !== undefined && decisionScoreB !== undefined) ||
    (conflictScoreA !== undefined && conflictScoreB !== undefined) ||
    (planningScoreA !== undefined && planningScoreB !== undefined);

  const overallStyleCompatibility: 'complementary_dynamic' | 'balanced_alignment' | 'friction_risk' =
    hasPsychologicalEvidence ? 'complementary_dynamic' : 'balanced_alignment';

  const summaryExplanation = hasPsychologicalEvidence
    ? 'Working-style assessment evidence analyzed: Stated behavioral preferences provide an explainable team dynamic.'
    : 'Stated business requirements and skills have been compared. Complete the Work-Style module to view behavioral team synergy.';

  // Pillar D: Unresolved Partnership Questions
  const recommendedDiscussionTopics: string[] = [
    'Division of executive authority: Who owns final product vs final go-to-market decisions?',
    'Cap table equity framework: Equal split ethos vs contribution/capital weighted split.',
    'Personal runway: How many months of personal expenses can each founder sustain before fundraising or revenue?',
    'Voluntary 30-day trial project: A 4-week low-stakes build sprint to test real collaborative chemistry.',
  ];

  const whyWeMightBuildTogether: string[] = [];
  if (alignedIndustries.length > 0) {
    whyWeMightBuildTogether.push(`Shared passion for ${alignedIndustries.join(', ')}.`);
  }
  if (bCoversA.criticalSkillsMatched.length > 0 && aCoversB.criticalSkillsMatched.length > 0) {
    whyWeMightBuildTogether.push(`Direct two-way skill complementarity: Zero overlap in primary critical responsibilities.`);
  }
  whyWeMightBuildTogether.push(`Compatible funding vision: ${fundingExplanation}`);
  whyWeMightBuildTogether.push(`Collaborative working-style balance: ${decisionMakingStyle.synthesisNote}`);

  return {
    founderAId: founderA.id,
    founderBId: founderB.id,
    engineVersion: '2026.11-cofounder-v1.0',
    calculatedAt: Date.now(),
    sharedDirection: {
      alignedIndustries,
      ideaStageCompatibility: 'compatible',
      ideaStageExplanation: `Both founders are at a collaborative stage (${pA.ideaStage.replace(/_/g, ' ')} / ${pB.ideaStage.replace(/_/g, ' ')}).`,
      fundingCompatibility,
      fundingExplanation,
      timeCommitmentCompatibility: timeCompatibility,
      timeCommitmentExplanation: timeExplanation,
      locationCompatibility,
      locationExplanation,
      isDirectionallyEligible,
    },
    skillComplementarity: {
      bCoversANeeds: bCoversA,
      aCoversBNeeds: aCoversB,
      mutualSynergyScore: mutualScore,
      mutualSynergyLabel: synergyLabel,
      keyStrengthsExplanation,
      missingCollectiveSkills: Array.from(new Set(missingCollectiveSkills)),
    },
    workingStyle: {
      decisionMakingStyle,
      conflictResolutionStyle,
      planningPaceStyle,
      overallStyleCompatibility: 'complementary_dynamic',
      summaryExplanation: 'Complementary working dynamic: One founder provides execution velocity; the other provides strategic discipline.',
    },
    unresolvedQuestions: {
      equityDiscussionStatus: `A prefers [${pA.equityExpectation ? pA.equityExpectation.replace(/_/g, ' ') : 'open to discussion'}]; B prefers [${pB.equityExpectation ? pB.equityExpectation.replace(/_/g, ' ') : 'open to discussion'}].`,
      runwayAndCapitalStatus: 'Requires mutual disclosure during second introductory discussion.',
      roleClarityStatus: 'Recommended for formalization in the 30-Day Trial Project agreement.',
      recommendedDiscussionTopics,
    },
    headlineSynthesis: `${founderA.name} & ${founderB.name} · Complementary ${pA.skillsOffered[0]?.skillId ? pA.skillsOffered[0].skillId.replace(/_/g, ' ') : 'Technical'} + ${pB.skillsOffered[0]?.skillId ? pB.skillsOffered[0].skillId.replace(/_/g, ' ') : 'Business'} Partnership`,
    whyWeMightBuildWellTogether: whyWeMightBuildTogether,
  };
}
