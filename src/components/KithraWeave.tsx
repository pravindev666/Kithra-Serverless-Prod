import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * The Kithra Weave
 * ----------------
 * Original brand artwork: three independent organic strokes (indigo, muted
 * teal, soft clay) woven Borromean-style — each passes over one strand and
 * under the other, so no single strand dominates. Where they cross, a quiet
 * ochre glow marks the shared ground between independent people.
 *
 * Motion: strokes draw once via `pathLength`, subtly staggered; the central
 * meeting point fades in last. All motion completes in ~1.4s, never loops,
 * and is skipped entirely under reduced-motion preferences. The final static
 * frame is the designed artwork.
 */

// Geometry (viewBox 0 0 560 520). Crossings were computed numerically:
//   A×B ≈ (283.3, 356.7)   B×C ≈ (303.6, 290.6)   A×C ≈ (265.3, 291.3)
const STRAND_A =
  'M 80 150 C 170 70, 258 140, 262 250 S 300 450, 470 410'; // indigo
const STRAND_B =
  'M 110 440 C 220 470, 330 340, 298 258 S 330 70, 470 110'; // muted teal
const STRAND_C =
  'M 40 250 C 110 200, 210 296, 282 292 S 430 280, 520 200'; // soft clay

const MEETING_POINT = { x: 284, y: 313 };
const CROSS_AB = { x: 283.3, y: 356.7 };

interface KithraWeaveProps {
  manualReduceMotion?: boolean;
  className?: string;
}

export const KithraWeave: React.FC<KithraWeaveProps> = ({
  manualReduceMotion = false,
  className = '',
}) => {
  const systemReduced = useReducedMotion();
  const reduced = Boolean(systemReduced || manualReduceMotion);
  const uid = useId().replace(/:/g, '');
  const clipId = `kw-clip-${uid}`;
  const glowId = `kw-glow-${uid}`;
  const titleId = `kw-title-${uid}`;

  const ease: [number, number, number, number] = [0.65, 0, 0.35, 1];
  const draw = (delay: number) =>
    reduced
      ? { initial: false as const, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            pathLength: { duration: 0.95, delay, ease },
            opacity: { duration: 0.12, delay },
          },
        };

  // Each strand = background-coloured halo (creates the woven gap) + stroke.
  const strand = (
    key: string,
    d: string,
    color: string,
    width: number,
    delay: number,
    clipPath?: string
  ) => (
    <g key={key} clipPath={clipPath}>
      <motion.path
        d={d}
        stroke="var(--bg)"
        strokeWidth={width + 9}
        strokeLinecap="round"
        fill="none"
        {...draw(delay)}
      />
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        fill="none"
        {...draw(delay)}
      />
    </g>
  );

  return (
    <svg
      viewBox="20 40 520 450"
      role="img"
      aria-labelledby={titleId}
      className={`block w-full h-auto overflow-visible ${className}`}
    >
      <title id={titleId}>
        The Kithra Weave — three independent threads meeting at a shared point
      </title>
      <defs>
        <clipPath id={clipId}>
          <circle cx={CROSS_AB.x} cy={CROSS_AB.y} r="22" />
        </clipPath>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="var(--weave-ochre)" stopOpacity="0.55" />
          <stop offset="60%" stopColor="var(--weave-ochre)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--weave-ochre)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm meeting glow sits beneath the strands */}
      <motion.circle
        cx={MEETING_POINT.x}
        cy={MEETING_POINT.y}
        r="74"
        fill={`url(#${glowId})`}
        initial={reduced ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduced ? undefined : { duration: 0.5, delay: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: `${MEETING_POINT.x}px ${MEETING_POINT.y}px` }}
      />

      {/* Weave order: A, then C over A, then B over C; A is re-laid over B at their crossing */}
      {strand('a', STRAND_A, 'var(--weave-indigo)', 11, 0)}
      {strand('c', STRAND_C, 'var(--weave-clay)', 8, 0.12)}
      {strand('b', STRAND_B, 'var(--weave-teal)', 9.5, 0.24)}
      {strand('a-over', STRAND_A, 'var(--weave-indigo)', 11, 0, `url(#${clipId})`)}

      {/* Shared ground — a single restrained ochre point */}
      <motion.circle
        cx={MEETING_POINT.x}
        cy={MEETING_POINT.y}
        r="5"
        fill="var(--weave-ochre)"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? undefined : { duration: 0.4, delay: 1.0 }}
      />
    </svg>
  );
};
