/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA MATRIMONY & LIFELONG PARTNERSHIP DISCUSSION GUIDES
 * 
 * A research-backed, culturally grounded conversation framework for Indian adults
 * considering marriage. Designed to resolve the 4 primary causes of domestic 
 * friction before engagement:
 * 1. Financial Philosophy & Joint Wealth
 * 2. Extended Family Living & In-Law Boundaries
 * 3. Domestic Labor, Careers & Relocation
 * 4. Children, Parenting & Cultural Transmission
 */

export interface DiscussionPrompt {
  id: string;
  topic: string;
  promptQuestion: string;
  contextWhyItMatters: string;
  healthySignals: string[];
  frictionWarningSigns: string[];
}

export interface MatrimonyGuideKit {
  id: string;
  title: string;
  tagline: string;
  estimatedTimeMin: number;
  culturalContext: string;
  prompts: DiscussionPrompt[];
  takeawayWorksheet: string[];
}

export const MATRIMONY_DISCUSSION_KITS: MatrimonyGuideKit[] = [
  {
    id: 'kit-finances',
    title: 'Kit 1: Money, Debt & Financial Autonomy',
    tagline: 'Moving from individual paychecks to joint life security without secrecy or control.',
    estimatedTimeMin: 45,
    culturalContext:
      'In traditional setups, money is either treated as taboo or controlled unilaterally by one party or their parents. Modern Indian marriages require transparent boundaries around personal autonomy, shared bills, and financial support for aging parents.',
    prompts: [
      {
        id: 'fin-1',
        topic: 'Bank Account Architecture',
        promptQuestion: 'How should our salaries flow: one joint account for everything, separate accounts with a joint household pool, or completely separate?',
        contextWhyItMatters:
          'Financial autonomy prevents resentment. Couples who maintain a "Mine, Yours, and Ours" 3-pool system report lower day-to-day spending arguments.',
        healthySignals: [
          'Mutual agreement on a joint pool for rent/groceries while keeping personal discretionary spending private.',
          'Openness to sharing bank balance realities without feeling judged.',
        ],
        frictionWarningSigns: [
          'Demanding complete control over the other partner’s salary.',
          'Refusal to disclose existing EMIs, credit card debt, or student loans.',
        ],
      },
      {
        id: 'fin-2',
        topic: 'Parental Financial Support',
        promptQuestion: 'What are our expectations regarding sending monthly money to our respective parents or funding family medical expenses?',
        contextWhyItMatters:
          'In India, caring for parents is a sacred duty. Friction occurs when one partner secretly remits funds or when support is given unevenly.',
        healthySignals: [
          'Treating both sets of parents with equal dignity and pre-agreeing on transparent support budgets.',
          'Planning for comprehensive parental health insurance (₹10–25 Lakh cover) early.',
        ],
        frictionWarningSigns: [
          'Insisting that only the husband’s parents are eligible for family financial assistance.',
          'Hiding financial gifts or loans given to siblings or cousins.',
        ],
      },
      {
        id: 'fin-3',
        topic: 'Spending & Lifestyle Pacing',
        promptQuestion: 'When does a purchase require mutual consultation (e.g. any spend above ₹15,000)? What is our stance on luxury vacations vs. retirement savings?',
        contextWhyItMatters:
          'Friction arises when a natural saver marries a natural spender without setting an agreed discretionary limit.',
        healthySignals: [
          'Setting a agreed threshold (e.g. ₹10,000 or ₹25,000) above which both partners talk before buying.',
          'Aligning on long-term home ownership vs renting flexibility.',
        ],
        frictionWarningSigns: [
          'Belittling the other partner’s small pleasures or hobbies.',
          'Compulsive secret spending or hidden credit lines.',
        ],
      },
    ],
    takeawayWorksheet: [
      'Agreed monthly joint household contribution ratio (e.g. 50/50 or proportional to income).',
      'Established discretionary personal spend limit (no questions asked under ₹X).',
      'Documented existing loans, student debts, and parent medical insurance plans.',
    ],
  },
  {
    id: 'kit-living-inlaws',
    title: 'Kit 2: Living Arrangements & In-Law Boundaries',
    tagline: 'Balancing filial devotion with the sacred privacy of your new marital home.',
    estimatedTimeMin: 50,
    culturalContext:
      'Unresolved living arrangements are the #1 contributor to marital litigation and separation in urban India. Clarity on living together, living nearby, festival rotations, and daily parental involvement must be established before commitments are formalized.',
    prompts: [
      {
        id: 'inlaw-1',
        topic: 'Daily Living Structure',
        promptQuestion: 'Are we planning to live in a joint family household, in an independent home within the same neighbourhood, or in a completely separate city?',
        contextWhyItMatters:
          'Assumptions destroy marriages. A man may silently assume his wife will move into his ancestral home; a woman may assume they will rent their own apartment.',
        healthySignals: [
          'Clear, unambiguous pre-marriage agreement on physical residence for the first 3 years.',
          'Understanding that privacy is not "disrespect" toward elders.',
        ],
        frictionWarningSigns: [
          'Vague statements like "we will see after marriage" or leaving the decision to parents.',
          'Pressuring one partner into living arrangements they have repeatedly expressed dread toward.',
        ],
      },
      {
        id: 'inlaw-2',
        topic: 'Decision-Making & Emotional Boundaries',
        promptQuestion: 'When we have a private disagreement about our life, diet, or career, who is allowed inside the conversation?',
        contextWhyItMatters:
          'Parental over-involvement turns a minor 10-minute couple misunderstanding into a multi-family war.',
        healthySignals: [
          'A strict agreement that marital arguments remain strictly between the couple.',
          'Both partners defend each other respectfully when their own parents criticize the spouse.',
        ],
        frictionWarningSigns: [
          'Running to parents to complain after every minor argument.',
          'Permitting parents to dictate the couple’s dietary, social, or clothing choices.',
        ],
      },
      {
        id: 'inlaw-3',
        topic: 'Festival & Vacation Distribution',
        promptQuestion: 'How will we allocate Diwali, Eid, Christmas, Pongal/Onam, and annual holidays between both families?',
        contextWhyItMatters:
          'Festivals carry heavy emotional nostalgia. The default assumption that "all festivals happen at the husband’s ancestral house" alienates daughters-in-law.',
        healthySignals: [
          'Fair alternating schedules (e.g. Diwali in Mumbai, Christmas/New Year in Bengaluru).',
          'Creating new couple traditions independent of both extended families.',
        ],
        frictionWarningSigns: [
          'Refusing to spend any major holiday with the wife’s family.',
          'Guilt-tripping or emotional manipulation from extended relatives.',
        ],
      },
    ],
    takeawayWorksheet: [
      'Agreed physical residence plan (Independent apartment vs Joint family vs Nearby enclave).',
      'Clear boundary pact: Disagreements and financial decisions stay between husband and wife.',
      'Fair festival and annual vacation calendar split between both sets of parents.',
    ],
  },
  {
    id: 'kit-careers-labor',
    title: 'Kit 3: Domestic Labor, Careers & Relocation',
    tagline: 'Equal partnership in dual-income homes: sharing the physical and emotional load.',
    estimatedTimeMin: 40,
    culturalContext:
      'Even when both partners work demanding 50-hour corporate or medical weeks, societal conditioning often places 90% of domestic management on the wife. A thriving modern marriage requires explicit domestic contracts.',
    prompts: [
      {
        id: 'career-1',
        topic: 'The Second Shift (Cooking, Cleaning & Staff Management)',
        promptQuestion: 'How will daily chores be divided: who cooks, who cleans, who manages the domestic helpers (cook, maid, nanny), and who handles administrative logistics?',
        contextWhyItMatters:
          'Resentment builds when one partner views domestic tasks as "helping" the other, rather than joint co-ownership of their shared home.',
        healthySignals: [
          'Viewing domestic chores as 50/50 co-ownership, leveraging hired domestic help without shame.',
          'Taking ownership of specific zones (e.g. one manages kitchen & groceries, the other handles utilities & cleaning).',
        ],
        frictionWarningSigns: [
          'Expecting the wife to cook hot meals after working a full corporate day.',
          'Refusing to clean up after oneself under traditional entitlement.',
        ],
      },
      {
        id: 'career-2',
        topic: 'Career Prioritization & Relocation',
        promptQuestion: 'If one partner receives an extraordinary promotion, MBA admission, or overseas relocation offer (e.g. Singapore, London, Gurugram), how do we decide who moves?',
        contextWhyItMatters:
          'Assuming one partner’s career is "the primary breadwinner" and the other’s is "secondary" leads to long-term career sacrifice and bitterness.',
        healthySignals: [
          'Evaluating relocations based on mutual family advancement rather than gender hierarchy.',
          'Willingness to support periods where one partner studies or transitions careers.',
        ],
        frictionWarningSigns: [
          'Dismissing the wife’s career aspirations as "just a hobby until children arrive".',
          'Refusing to ever compromise location for the other partner’s dream opportunity.',
        ],
      },
    ],
    takeawayWorksheet: [
      'Inventory of domestic responsibilities and budget allocated for professional domestic support.',
      'Documented mutual career ambitions and relocation thresholds for the next 5 years.',
    ],
  },
  {
    id: 'kit-children-parenting',
    title: 'Kit 4: Children, Parenting & Future Values',
    tagline: 'Aligning on if, when, and how to raise future human beings with intention.',
    estimatedTimeMin: 45,
    culturalContext:
      'Children should never be assumed as an automatic byproduct of marriage. Clarifying fertility timelines, parenting philosophies, religious exposure, and grandparent involvement prevents painful irreconcilable differences.',
    prompts: [
      {
        id: 'child-1',
        topic: 'Desire for Children & Timeline',
        promptQuestion: 'Do we both enthusiastically want children, are we on the fence, or are we intentionally child-free? If yes, what is our preferred timeline?',
        contextWhyItMatters:
          'Marrying with the hope of "changing the other person’s mind about having kids" is a guaranteed recipe for divorce.',
        healthySignals: [
          'Complete alignment on whether children are an essential life goal.',
          'Realistic timeline (e.g. "We want 2 years to travel and stabilize our marriage first").',
        ],
        frictionWarningSigns: [
          'One partner saying "I guess so because society expects it" without genuine desire.',
          'Parental pressure dictating conception timelines within the first year of marriage.',
        ],
      },
      {
        id: 'child-2',
        topic: 'Religious, Spiritual & Schooling Values',
        promptQuestion: 'How will our children be educated? What role will religion, rituals, caste traditions, and modern rationalism play in our household?',
        contextWhyItMatters:
          'Inter-faith or inter-cultural matches thrive when traditions are celebrated collaboratively, but clash when one side demands doctrinal dominance.',
        healthySignals: [
          'Mutual celebration of cultural festivals with focus on ethics, kindness, and intellectual curiosity.',
          'Shared values regarding progressive, non-coercive schooling and emotional health.',
        ],
        frictionWarningSigns: [
          'Insisting on strict religious orthodoxy or dogmatic rituals without the other partner’s consent.',
          'Using children as pawns in extended family cultural status games.',
        ],
      },
    ],
    takeawayWorksheet: [
      'Definitive stance on children (Enthusiastic Yes / Undecided / Child-Free).',
      'Agreed timeline window for starting a family if applicable.',
      'Guiding parenting values (Compassion, emotional literacy, educational priorities).',
    ],
  },
];

