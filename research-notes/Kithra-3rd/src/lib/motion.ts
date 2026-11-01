import { useReducedMotion } from 'framer-motion';

export const DUR = {
  safety: 0, // 0ms invariant for Block, Mute, Report, Cancel
  micro: 0.14,
  modal: 0.18,
  quiz: 0.2,
  ui: 0.22,
  hero: 0.52,
} as const;

export const EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_ENTER: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_EXIT: [number, number, number, number] = [0.4, 0, 1, 1];
export const STAGGER_CAP = 8;

export function useKithraMotion() {
  const prefersReduced = useReducedMotion();
  const htmlReduced =
    typeof document !== 'undefined' &&
    (document.documentElement.getAttribute('data-reduced-motion') === 'true' ||
      document.documentElement.getAttribute('data-low-data') === 'true');
  const shouldReduce = Boolean(prefersReduced || htmlReduced);

  return {
    shouldReduce,
    dur: shouldReduce
      ? {
          safety: 0,
          micro: 0.08,
          modal: 0.1,
          quiz: 0.1,
          ui: 0.1,
          hero: 0.12,
        }
      : DUR,
    easeStandard: EASE_STANDARD,
    easeEnter: EASE_ENTER,
    easeExit: EASE_EXIT,
    staggerCap: STAGGER_CAP,
  };
}
