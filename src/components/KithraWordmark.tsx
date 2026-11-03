/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA BRAND WORDMARK COMPONENT
 * 
 * Renders the intentional "kı̇thra" editorial serif wordmark:
 * - Subtle brand Easter egg: The tittle dot of the 'i' is colored in signature Ochre (`var(--ochre)` / `#8F520A`),
 *   replacing the legacy trailing period (`kithra.`).
 * - Accessible: Renders `aria-label="kithra"` for screen readers and clean pronunciation.
 * - Perfectly balanced Cormorant Garamond editorial styling.
 */

import React from 'react';

interface KithraWordmarkProps {
  className?: string;
  dotClassName?: string;
}

export const KithraWordmark: React.FC<KithraWordmarkProps> = ({
  className = '',
  dotClassName = '',
}) => {
  return (
    <span
      className={`font-serif-editorial inline-flex items-baseline select-none ${className}`}
      aria-label="kithra"
    >
      <span aria-hidden="true">k</span>
      <span aria-hidden="true" className="relative inline-block leading-none">
        ı
        <span
          className={`absolute top-[0.16em] left-1/2 -translate-x-[42%] w-[0.2em] h-[0.2em] rounded-full bg-[var(--ochre)] shadow-[0_0_1px_rgba(143,82,10,0.8)] pointer-events-none ${dotClassName}`}
        />
      </span>
      <span aria-hidden="true">thra</span>
    </span>
  );
};

