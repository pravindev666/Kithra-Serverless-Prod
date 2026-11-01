import React from 'react';
import { KithraLogo } from './Logo';

interface WordmarkProps {
  className?: string;
  showTagline?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({ className = '', showTagline = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <KithraLogo className="w-8 h-8 shrink-0" />
      <div className="flex flex-col">
        <span className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] font-heading lowercase leading-none">
          kithra<span className="text-[var(--accent-primary)]">.</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-mono tracking-wider text-[var(--text-muted)] uppercase mt-1">
            Friendship · Dating · Matrimony
          </span>
        )}
      </div>
    </div>
  );
};
