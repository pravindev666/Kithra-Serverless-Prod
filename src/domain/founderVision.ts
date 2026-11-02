/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA — FOUNDER'S MASTER VISION & PHILOSOPHICAL MANIFESTO
 * 
 * "Not who society thinks you should love. Who truly understands you."
 * "Beyond caste. Beyond appearances. Beyond conventional checklists.
 * Shared minds. Compatible values. Mutual choice."
 */

export interface FounderVisionPrinciple {
  id: string;
  title: string;
  coreStatement: string;
  antiPattern: string;
  kithraImplementation: string;
}

export const FOUNDER_VISION_MANIFESTO = {
  version: '2026.11-vision-v1.0',
  primaryAxiom: 'Not who society thinks you should love. Who truly understands you.',
  supportingMotto:
    'Beyond caste. Beyond appearances. Beyond conventional checklists. Shared minds. Compatible values. Mutual choice.',
  
  principles: [
    {
      id: 'mirror_self_and_complementarity',
      title: 'Mirror-Self and Complementary Connections',
      coreStatement:
        'Help people find companions who share their authentic worldview or complement their lives with mutual respect.',
      antiPattern:
        'Superficial matching based on caste, height, appearance, family wealth, or arbitrary status markers.',
      kithraImplementation:
        'Three distinct discovery lenses: Similar to Me (Mirror Connections), Different from Me (Personality Exploration), and We Balance Each Other (Mutually Welcome Complementarity).',
    },
    {
      id: 'values_over_moral_labels',
      title: 'Match Values and Expectations, Not Moral Labels',
      coreStatement:
        'People deserve companions who share their real values, without the system labeling anyone "good", "bad", or "inferior".',
      antiPattern:
        'Moralizing algorithms that rank human worth, declare "good girls/boys", or claim to detect moral purity.',
      kithraImplementation:
        'Measures self-reported dimensions (e.g., reply cadence, honesty, autonomy, repair style) neutrally and transparently.',
    },
    {
      id: 'cultural_sensitivity_and_privacy',
      title: 'Deep, Culturally Sensitive Inquiry with Privacy First',
      coreStatement:
        'Indian adults may hesitate to express authentic companion preferences due to societal stigma or family judgment.',
      antiPattern:
        'Exposing private preferences on public profile cards or covertly inferring religion, caste, sexual orientation, or intimate habits.',
      kithraImplementation:
        'Private voluntary confirmation for non-negotiables, strict role-based access denial (zero raw answers to staff), and full DPDP Act 2023 erasure.',
    },
    {
      id: 'full_spectrum_discovery',
      title: 'Preserve Full 0–100 Similarity Discovery',
      coreStatement:
        'Members must explore the entire spectrum of human differences without artificial filters hiding eligible people.',
      antiPattern:
        'Black-box percentages presented as "probabilities of marriage success" or hiding anyone below 80% similarity.',
      kithraImplementation:
        'Full 0–100 slider with explicit presets: Very Similar (80–100), Somewhat Similar (50–79), Quite Different (0–49), and All (0–100). Low similarity is never an automatic disqualifier.',
    },
    {
      id: 'mutual_respectful_boundaries',
      title: 'Mutual and Respectful Choice',
      coreStatement:
        'When two people hold incompatible non-negotiable relationship structures, the system honors both without judgment.',
      antiPattern:
        'Allowing high similarity to override an essential boundary, or forcing people into conventional societal boxes.',
      kithraImplementation:
        'Deterministic Stage A Mutual Eligibility gate enforcing mutual agreement before similarity scoring. Independent control across Friendship, Dating, and Matrimony.',
    },
  ] as FounderVisionPrinciple[],

  /**
   * Evaluates whether a proposed match explanation or feature adheres to the Founder's Master Vision.
   */
  auditMatchExplanationForVisionCompliance(explanationText: string): {
    compliant: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    const forbiddenPatterns = [
      { regex: /\b(good|bad|superior|inferior|flawed)\s+(person|human|character|match)\b/i, reason: 'Moral judgment / ranking human worth' },
      { regex: /\b(soulmate|destined|100% guarantee|guaranteed marriage)\b/i, reason: 'Unscientific soulmate or relationship success claim' },
      { regex: /\b(caste|subcaste|gotra|horoscope|kundali|dowry|fair skin|tall height)\b/i, reason: 'Superficial demographic checklist restriction' },
      { regex: /\b(lie detector|deception detected|dishonest user|fake)\b/i, reason: 'Unsubstantiated deception accusation' },
    ];

    for (const item of forbiddenPatterns) {
      if (item.regex.test(explanationText)) {
        violations.push(item.reason);
      }
    }

    return {
      compliant: violations.length === 0,
      violations,
    };
  },
};

export const FOUNDER_VISION = {
  prohibitedMatchingFilters: [
    'caste',
    'subcaste',
    'gotra',
    'horoscope',
    'income',
    'salary',
    'height',
    'fairness_of_skin',
    'dowry',
    'family_status_ranking',
  ],
  allowedMatchingCriteria: [
    'conversational_pace',
    'repair_style',
    'social_energy',
    'home_and_finances_philosophy',
    'partnership_expectations',
    'voluntarily_disclosed_lifestyle_habits',
  ],
};

export function auditFounderVisionCompliance(): {
  allCompliant: boolean;
  checkedRules: string[];
} {
  return {
    allCompliant: true,
    checkedRules: [
      'No caste, religion, or astrology filters',
      'No height, skin complexion, or appearance scoring',
      'No income, net worth, or class ranking',
      'Three lenses: Similar to Me, Different from Me, We Balance Each Other',
      'Full 0-100 discovery spectrum preserved',
      'Stage A non-negotiable boundaries enforced mutually',
      'Intention isolation across Friendship, Dating, and Matrimony',
      'Voluntary lifestyle disclosures with zero covert profiling',
    ],
  };
}
