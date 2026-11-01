import React from 'react';

/**
 * Shared props for all proprietary illustrations
 */
interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Invisible Walls Illustration (For "Why current apps fail" section)
 * Two abstract figures separated by labeled invisible barriers.
 */
export const InvisibleWallsIllustration: React.FC<IllustrationProps> = ({ className = '', ...props }) => (
  <svg 
    viewBox="0 0 400 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto ${className}`}
    {...props}
  >
    {/* Left Figure */}
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
      <circle cx="60" cy="80" r="16" />
      <path d="M20 160 C 20 120, 100 120, 100 160" />
    </g>

    {/* Right Figure */}
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
      <circle cx="340" cy="80" r="16" />
      <path d="M300 160 C 300 120, 380 120, 380 160" />
    </g>

    {/* Invisible Walls (Dashed) */}
    <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3">
      <line x1="160" y1="40" x2="160" y2="160" />
      <line x1="200" y1="20" x2="200" y2="180" />
      <line x1="240" y1="40" x2="240" y2="160" />
    </g>

    {/* Labels */}
    <g fill="currentColor" fontSize="10" fontFamily="'JetBrains Mono', monospace" opacity="0.6" textAnchor="middle" transform="rotate(-90 150 100)">
      <text x="150" y="100">COMMUNICATION</text>
    </g>
    <g fill="currentColor" fontSize="10" fontFamily="'JetBrains Mono', monospace" opacity="0.6" textAnchor="middle" transform="rotate(-90 190 100)">
      <text x="190" y="100">VALUES</text>
    </g>
    <g fill="currentColor" fontSize="10" fontFamily="'JetBrains Mono', monospace" opacity="0.6" textAnchor="middle" transform="rotate(-90 230 100)">
      <text x="230" y="100">LIFESTYLE</text>
    </g>
  </svg>
);

/**
 * Clinical Dossier Anatomy Illustration (For "Sample Report" section)
 * Minimalist human outline with anatomical highlight regions.
 */
export const AnatomyDossierIllustration: React.FC<IllustrationProps> = ({ className = '', ...props }) => (
  <svg 
    viewBox="0 0 300 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto ${className}`}
    {...props}
  >
    {/* Minimalist Anatomy Outline */}
    <g stroke="currentColor" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M150 40 C 130 40, 120 60, 120 90 C 120 110, 130 120, 140 125 L 140 140 C 120 140, 70 150, 60 190 L 60 380 M 150 40 C 170 40, 180 60, 180 90 C 180 110, 170 120, 160 125 L 160 140 C 180 140, 230 150, 240 190 L 240 380" />
    </g>

    {/* Highlight Nodes */}
    <g fill="var(--accent-sage)">
      {/* Brain/Logic */}
      <circle cx="150" cy="80" r="4" />
      {/* Heart/Empathy */}
      <circle cx="140" cy="180" r="4" />
      {/* Core/Lifestyle */}
      <circle cx="150" cy="260" r="4" />
    </g>

    {/* Connecting lines & labels */}
    <g stroke="currentColor" strokeWidth="1" opacity="0.4">
      <polyline points="154,80 200,60 250,60" />
      <polyline points="136,180 90,160 40,160" />
      <polyline points="154,260 200,280 250,280" />
    </g>

    <g fill="currentColor" fontSize="10" fontFamily="'JetBrains Mono', monospace" opacity="0.8">
      <text x="250" y="55" textAnchor="end">COMMUNICATION</text>
      <text x="40" y="155" textAnchor="start">EMPATHY</text>
      <text x="250" y="275" textAnchor="end">LIFESTYLE</text>
    </g>
  </svg>
);

/**
 * Institutional Trust Flow Illustration (For "Trust" section)
 * ID -> Shield -> Human
 */
export const InstitutionalFlowIllustration: React.FC<IllustrationProps> = ({ className = '', ...props }) => (
  <svg 
    viewBox="0 0 500 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto ${className}`}
    {...props}
  >
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* ID Card */}
      <rect x="50" y="40" width="60" height="40" rx="4" opacity="0.8" />
      <circle cx="70" cy="55" r="6" opacity="0.8" />
      <line x1="85" y1="52" x2="100" y2="52" opacity="0.8" />
      <line x1="85" y1="60" x2="95" y2="60" opacity="0.8" />

      {/* Arrow 1 */}
      <line x1="140" y1="60" x2="200" y2="60" strokeDasharray="4 4" opacity="0.4" />
      <polyline points="195,55 200,60 195,65" opacity="0.4" />

      {/* Shield/Lock */}
      <path d="M 250 30 L 280 40 L 280 70 C 280 90, 250 110, 250 110 C 250 110, 220 90, 220 70 L 220 40 Z" opacity="0.8" />
      <circle cx="250" cy="65" r="6" opacity="0.8" />
      <line x1="250" y1="71" x2="250" y2="78" opacity="0.8" />

      {/* Arrow 2 */}
      <line x1="300" y1="60" x2="360" y2="60" strokeDasharray="4 4" opacity="0.4" />
      <polyline points="355,55 360,60 355,65" opacity="0.4" />

      {/* Verified Human */}
      <circle cx="410" cy="45" r="12" opacity="0.8" />
      <path d="M 390 85 C 390 65, 430 65, 430 85" opacity="0.8" />
      {/* Verified Badge */}
      <circle cx="425" cy="75" r="8" fill="var(--bg-main)" stroke="none" />
      <circle cx="425" cy="75" r="7" stroke="var(--accent-sage)" opacity="1" />
      <polyline points="422,75 424,78 428,72" stroke="var(--accent-sage)" opacity="1" />
    </g>

    <g fill="currentColor" fontSize="10" fontFamily="'JetBrains Mono', monospace" opacity="0.6" textAnchor="middle">
      <text x="80" y="100">GOVT. ID</text>
      <text x="250" y="120">AES-256 ENCRYPTION</text>
      <text x="410" y="100">VERIFIED PROFILE</text>
    </g>
  </svg>
);
