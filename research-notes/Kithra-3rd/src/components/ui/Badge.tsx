import React from 'react';

/**
 * Kithra Design System — Badge Primitive
 * 
 * Unified pill/badge component for status indicators, trust signals,
 * and categorical labels. Replaces 8+ inconsistent inline badge styles.
 */

type BadgeVariant = 'sage' | 'gold' | 'coral' | 'neutral' | 'white';
type BadgeSize = 'xs' | 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  sage: 'bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] border-[var(--accent-sage)]/20',
  gold: 'bg-[var(--gold-verify)]/10 text-[var(--gold-verify)] border-[var(--gold-verify)]/20',
  coral: 'bg-[var(--coral-highlight)]/10 text-[var(--coral-highlight)] border-[var(--coral-highlight)]/20',
  neutral: 'bg-[var(--bg-main)] text-[var(--text-muted)] border-[var(--border-main)]',
  white: 'bg-white/20 text-white border-white/10',
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'px-2 py-0.5 text-[10px] gap-1',
  sm: 'px-2.5 py-1 text-xs gap-1.5',
  md: 'px-3.5 py-1.5 text-sm gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'sage',
  size = 'sm',
  icon,
  dot = false,
  children,
  className = '',
}) => {
  return (
    <span
      className={[
        'inline-flex items-center font-data font-bold rounded-full border',
        'select-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
