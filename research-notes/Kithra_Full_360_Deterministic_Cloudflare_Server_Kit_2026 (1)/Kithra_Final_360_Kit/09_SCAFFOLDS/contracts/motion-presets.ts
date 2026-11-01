// Production-compatible Motion for React example presets; test with chosen motion version.
export const MOTION = {
  hero: { duration: 0.52, ease: [0.2, 0.7, 0.2, 1] },
  card: { duration: 0.30, ease: [0.2, 0.7, 0.2, 1] },
  micro: { duration: 0.16, ease: [0.2, 0.7, 0.2, 1] },
  quiz: { duration: 0.20, ease: [0.2, 0.7, 0.2, 1] },
  admin: { duration: 0.14, ease: [0.2, 0.7, 0.2, 1] },
  layoutSpring: { type: 'spring', stiffness: 380, damping: 30 }
} as const;
