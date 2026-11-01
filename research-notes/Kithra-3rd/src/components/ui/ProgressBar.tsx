import React from 'react';

/**
 * Kithra Design System — ProgressBar Primitive
 * 
 * Unified progress indicator with milestone markers and celebration states.
 * Replaces 6+ inline progress bar implementations.
 */

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  valueLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'sage' | 'gold' | 'default';
  showMilestones?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

const colorClasses = {
  sage: 'bg-[var(--cta-sage)]',
  gold: 'bg-[var(--gold-verify)]',
  default: 'bg-[var(--accent-sage)]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  valueLabel,
  size = 'md',
  color = 'default',
  showMilestones = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || valueLabel) && (
        <div className="flex justify-between items-center text-xs font-data">
          {label && <span className="text-[var(--text-muted)]">{label}</span>}
          {valueLabel && <span className="font-bold text-[var(--accent-sage)]">{valueLabel}</span>}
        </div>
      )}

      <div className="relative">
        <div className={`w-full bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-main)] ${sizeClasses[size]}`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${colorClasses[color]}`}
            style={{ width: `${clampedValue}%` }}
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Milestone markers */}
        {showMilestones && (
          <div className="absolute inset-0 flex items-center pointer-events-none" aria-hidden="true">
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className={`absolute w-0.5 ${sizeClasses[size]} ${
                  clampedValue >= milestone ? 'bg-white/40' : 'bg-[var(--border-main)]'
                }`}
                style={{ left: `${milestone}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
