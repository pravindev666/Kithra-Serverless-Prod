import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Kithra Warm Knot Mark (Provisional D-06 Brand Identity):
 * Two interlocking editorial loops representing Kith (friends/community) + Mitra (trusted companion),
 * rendered in dynamic semantic brand tokens (--accent-primary & --accent-secondary).
 */
export const KithraLogo: React.FC<LogoProps> = ({ className = 'w-9 h-9' }) => {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="kithra warm knot mark"
    >
      <circle
        cx="23"
        cy="24"
        r="14"
        stroke="var(--accent-primary)"
        strokeWidth="4.25"
      />
      <circle
        cx="41"
        cy="24"
        r="14"
        stroke="var(--accent-secondary)"
        strokeWidth="4.25"
      />
      <circle
        cx="32"
        cy="24"
        r="3.2"
        fill="var(--accent-tertiary)"
      />
    </svg>
  );
};
