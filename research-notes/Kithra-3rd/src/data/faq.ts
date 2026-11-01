import { FAQItem } from '../types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Matching & Honesty',
    question: 'Does Kithra use AI twins, LLMs, or soulmate predictions to match people?',
    answer:
      'No. Under Decision D-01, Kithra uses zero generative AI, zero digital twins, and zero opaque embeddings. Every compatibility view is a deterministic Agreement Index across the questions both people have chosen to answer, shown alongside item coverage (e.g., 68/100), model version (v1.2), and a clear reminder that agreement is a conversation starter—not a prediction.',
  },
  {
    id: 'faq-2',
    category: 'Relationship Modes',
    question: 'If I enable Friendship and Dating on one account, can my Friendship circle see my Dating profile?',
    answer:
      'Never. Friendship, Dating, and Matrimony operate in strict mode isolation. A member is only visible in a mode if both you and they have explicitly enabled and consented to discoverability in that exact mode. You also control photo visibility (Public, Connected Matches Only, or Hidden) separately for each mode.',
  },
  {
    id: 'faq-3',
    category: 'Matching & Honesty',
    question: 'What is the difference between the Echo, Counterpoint, and Mosaic Fit lenses?',
    answer:
      'Echo highlights people who answered similarly across shared themes. Counterpoint surfaces healthy contrast on flexible themes (such as weekend hobbies) while requiring core boundaries and ethics to align. Mosaic Fit uses an explicit, inspectable rule table (such as Planner + Spontaneous Explorer) to highlight complementary habits.',
  },
  {
    id: 'faq-4',
    category: 'Privacy & Safety',
    question: 'Can Kithra moderators or staff read my raw questionnaire answers?',
    answer:
      'No. Under our deny-by-default Staff RBAC and data classification policy (D-10), raw psychometric questionnaire responses are restricted from all staff roles—including superadmins. Trust & Safety analysts only access case-scoped, redacted report evidence via time-boxed Just-In-Time (JIT) grants that are recorded in a hash-chained audit log.',
  },
  {
    id: 'faq-5',
    category: 'Billing & Membership',
    question: 'Are safety tools, blocking, or basic discovery ever locked behind a paywall?',
    answer:
      'Never. Core safety actions (Block, Mute, Report, and Mode Pause) execute in 0ms and are free forever for every member. Kithra uses one account-wide membership (Free ₹0, Plus ₹149/mo, Connect ₹249/mo) that covers all enabled modes with no mode-specific surcharge and one-step cancellation.',
  },
  {
    id: 'faq-6',
    category: 'Cultural & Family Autonomy',
    question: 'In Matrimony mode, do parents or family members automatically get access to my chats?',
    answer:
      'No. Kithra is adult-first and consent-led. In Matrimony mode, your chats, photos, and questionnaire patterns remain private to you. If you wish to share a curated summary card with family elders, you can toggle an optional, revocable read-only share link at any time.',
  },
];
