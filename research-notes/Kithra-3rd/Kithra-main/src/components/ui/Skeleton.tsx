import React from 'react';

/**
 * Kithra Design System — Skeleton Loading Primitive
 * 
 * Shimmer-based loading placeholders for progressive disclosure.
 * Critical gap fix: the product previously had ZERO loading states.
 */

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = [
    'animate-pulse',
    'bg-gradient-to-r from-[var(--border-main)] via-[var(--surface-main)] to-[var(--border-main)]',
    'bg-[length:200%_100%]',
    'rounded-lg',
  ].join(' ');

  const variantClasses = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  if (lines > 1) {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{
              width: i === lines - 1 ? '70%' : '100%',
              height: height || '16px',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width: width || '100%', height: height || '48px' }}
    />
  );
};

/**
 * Pre-composed skeleton layouts for common views
 */

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] p-6 space-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width="48px" height="48px" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" height="14px" />
        <Skeleton variant="text" width="40%" height="12px" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <Skeleton variant="rectangular" height="40px" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    {/* Welcome Banner */}
    <div className="rounded-2xl bg-[var(--surface-main)] border border-[var(--border-main)] p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton variant="text" width="200px" height="16px" />
          <Skeleton variant="text" width="350px" height="32px" />
          <Skeleton variant="text" width="70%" height="14px" />
        </div>
        <Skeleton variant="rectangular" width="220px" height="48px" className="hidden sm:block" />
      </div>
      <Skeleton variant="rectangular" width="100%" height="12px" className="rounded-full" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <CardSkeleton />
      </div>
      <div className="space-y-4">
        <Skeleton variant="rectangular" height="80px" className="rounded-2xl" />
        <Skeleton variant="rectangular" height="80px" className="rounded-2xl" />
        <Skeleton variant="rectangular" height="80px" className="rounded-2xl" />
      </div>
    </div>

    {/* Match Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

export const MatchesSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
