import { useReducedMotion } from 'framer-motion';

/**
 * KITHRA 2026 — MOTION FOR REACT COMPLETE MATRIX & BUDGET
 * Source: 13_RESEARCH_ORIGINAL/07_MOTION/MOTION_FOR_REACT_COMPLETE_MATRIX.md
 *
 * Hard Motion Budget:
 * - Instant: 80ms
 * - Micro (toasts, badges, focus): <= 140ms
 * - Admin (drawer, queue flash): <= 140ms
 * - Modal / Sheet: <= 180ms
 * - Quiz directional step: <= 200ms
 * - UI transitions (cards, tabs, accordions): <= 220ms
 * - Hero headline & photo (mount once): <= 520ms
 * - Relationship-map SVG line draw (once): <= 600ms
 * - List stagger cap: max 8 items (40ms per item)
 * - Safety actions (Block, Report, Cancel): 0ms (NEVER delayed by animation)
 */

export const EASE_STANDARD: [number, number, number, number] = [0.2, 0.7, 0.2, 1];
export const EASE_ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_EXIT: [number, number, number, number] = [0.4, 0, 1, 1];

export const DUR = {
  instant: 0.08,
  micro: 0.14,
  admin: 0.14,
  modal: 0.18,
  quiz: 0.20,
  ui: 0.22,
  hero: 0.52,
  mapDraw: 0.60,
} as const;

export const STAGGER_CAP = 8;

export function getCappedStaggerDelay(index: number, stepSeconds = 0.04): number {
  return Math.min(index, STAGGER_CAP) * stepSeconds;
}

export function useKithraMotion(explicitReducedMotion = false, lowDataMode = false) {
  const osReduced = useReducedMotion();
  const shouldReduce = Boolean(osReduced || explicitReducedMotion || lowDataMode);

  const heroHeadingVariants = {
    hidden: shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0.12 : DUR.hero,
        ease: EASE_ENTER,
      },
    },
  };

  const heroPhotoVariants = {
    hidden: shouldReduce ? { opacity: 0 } : { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0.12 : DUR.hero,
        delay: shouldReduce ? 0 : 0.08,
        ease: EASE_ENTER,
      },
    },
  };

  const modeCardVariants = {
    hidden: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0 : DUR.ui,
        delay: shouldReduce ? 0 : Math.min(i, 3) * 0.06,
        ease: EASE_STANDARD,
      },
    }),
  };

  const listRowVariants = {
    hidden: shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0 : DUR.ui,
        delay: shouldReduce ? 0 : getCappedStaggerDelay(i, 0.04),
        ease: EASE_STANDARD,
      },
    }),
  };

  const quizStepVariants = {
    enter: (direction: number) =>
      shouldReduce
        ? { opacity: 1, x: 0 }
        : { opacity: 0, x: 16 * direction },
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduce ? 0 : DUR.quiz,
        ease: EASE_STANDARD,
      },
    },
    exit: (direction: number) =>
      shouldReduce
        ? { opacity: 0, x: 0 }
        : {
            opacity: 0,
            x: -16 * direction,
            transition: {
              duration: shouldReduce ? 0 : DUR.quiz,
              ease: EASE_EXIT,
            },
          },
  };

  const modalVariants = {
    hidden: shouldReduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduce ? 0 : DUR.modal,
        ease: EASE_ENTER,
      },
    },
    exit: {
      opacity: 0,
      scale: shouldReduce ? 1 : 0.98,
      transition: {
        duration: shouldReduce ? 0 : DUR.micro,
        ease: EASE_EXIT,
      },
    },
  };

  const adminPaneVariants = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, x: 8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduce ? 0 : DUR.admin,
        ease: EASE_STANDARD,
      },
    },
  };

  return {
    shouldReduce,
    heroHeadingVariants,
    heroPhotoVariants,
    modeCardVariants,
    listRowVariants,
    quizStepVariants,
    modalVariants,
    adminPaneVariants,
  };
}
