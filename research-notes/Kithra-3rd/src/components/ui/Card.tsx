import React from 'react';

/**
 * Kithra Design System — Card Primitive
 * 
 * Unified card container eliminating ~40 inline card patterns.
 * Supports 4 visual variants to break the "uniform border card" anti-pattern.
 */

type CardVariant = 'default' | 'elevated' | 'tinted' | 'accent-left';

interface CardProps {
  variant?: CardVariant;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  accentColor?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
  default: [
    'bg-[var(--surface-main)]',
    'border border-[var(--border-main)]',
    'shadow-xs',
  ].join(' '),
  elevated: [
    'bg-[var(--surface-main)]',
    'border border-[var(--border-main)]',
    'shadow-md',
  ].join(' '),
  tinted: [
    'bg-[var(--accent-sage)]/[0.03]',
    'border border-[var(--accent-sage)]/10',
  ].join(' '),
  'accent-left': [
    'bg-[var(--surface-main)]',
    'border border-[var(--border-main)]',
    'border-l-[3px] border-l-[var(--accent-sage)]',
    'shadow-xs',
  ].join(' '),
};

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  interactive = false,
  accentColor,
  className = '',
  children,
  onClick,
}) => {
  const interactiveClasses = interactive
    ? 'cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] hover:-translate-y-0.5 hover:shadow-lg hover:border-[var(--accent-sage)]/40 active:translate-y-0 active:shadow-sm'
    : '';

  const accentStyle = accentColor && variant === 'accent-left'
    ? { borderLeftColor: accentColor }
    : undefined;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      style={accentStyle}
      className={[
        'rounded-2xl',
        variantClasses[variant],
        paddingClasses[padding],
        interactiveClasses,
        onClick ? 'text-left w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </Component>
  );
};
