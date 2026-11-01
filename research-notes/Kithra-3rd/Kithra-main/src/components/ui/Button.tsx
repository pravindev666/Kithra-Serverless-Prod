import React from 'react';

/**
 * Kithra Design System — Button Primitive
 * 
 * Unified button component eliminating 40+ inline button definitions.
 * Every button in Kithra must use this component.
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--cta-sage)] hover:bg-[color-mix(in_srgb,var(--cta-sage)_85%,black)]',
    'text-white font-semibold',
    'shadow-md hover:shadow-lg hover:shadow-[var(--cta-sage)]/15',
    'hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
  ].join(' '),
  secondary: [
    'bg-[var(--surface-main)] hover:bg-[var(--bg-main)]',
    'text-[var(--text-main)] font-medium',
    'border border-[var(--border-main)] hover:border-[var(--accent-sage)]',
    'shadow-xs hover:shadow-sm',
    'hover:-translate-y-0.5 active:translate-y-0',
  ].join(' '),
  ghost: [
    'bg-transparent hover:bg-[var(--bg-main)]',
    'text-[var(--text-muted)] hover:text-[var(--text-main)]',
    'font-medium',
  ].join(' '),
  outline: [
    'bg-transparent',
    'text-[var(--accent-sage)] font-semibold',
    'border border-[var(--accent-sage)]/30 hover:border-[var(--accent-sage)]',
    'hover:bg-[var(--accent-sage)]/5',
  ].join(' '),
  destructive: [
    'bg-transparent',
    'text-rose-500 font-semibold',
    'border border-rose-500/20 hover:border-rose-500/50',
    'hover:bg-rose-500/5',
  ].join(' '),
  gold: [
    'bg-[var(--gold-verify)]/10',
    'text-[var(--gold-verify)] font-semibold',
    'border border-[var(--gold-verify)]/30 hover:border-[var(--gold-verify)]',
    'hover:bg-[var(--gold-verify)]/15',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center font-heading',
        'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
        'cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)]',
        'disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && !isLoading && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
};
