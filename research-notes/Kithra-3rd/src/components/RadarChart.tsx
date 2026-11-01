import React from 'react';
import { motion } from 'framer-motion';
import { DomainResult, DomainType } from '../types';

interface RadarChartProps {
  className?: string;
  domains?: Record<DomainType, DomainResult>;
}

export const RadarChart: React.FC<RadarChartProps> = ({ className = '', domains }) => {
  const size = 460;
  const center = size / 2;
  const radius = 145;

  const domainKeys: DomainType[] = [
    'communication',
    'values',
    'finances',
    'lifestyle',
    'family',
    'intimacy',
    'intellectual',
    'boundaries',
  ];

  const axes = [
    'Communication',
    'Values',
    'Finances',
    'Lifestyle',
    'Family',
    'Emotional Pace',
    'Curiosity',
    'Boundaries',
  ];
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  const youData = domains
    ? domainKeys.map((k) => Math.max(0.2, Math.min(0.96, (domains[k]?.score ?? 80) / 100)))
    : [0.88, 0.9, 0.82, 0.79, 0.81, 0.85, 0.86, 0.89];

  const getPath = (data: number[]) => {
    const points = data.map((val, idx) => {
      const angle = idx * angleStep - Math.PI / 2;
      const r = val * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return `M ${points.join(' L ')} Z`;
  };

  const axisEnds = axes.map((_, idx) => {
    const angle = idx * angleStep - Math.PI / 2;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  });

  const labels = axes.map((label, idx) => {
    const angle = idx * angleStep - Math.PI / 2;
    const r = radius + 34;
    const anchor: 'start' | 'end' | 'middle' =
      Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle';
    return {
      label,
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      anchor,
    };
  });

  return (
    <div className={`relative w-full max-w-[460px] mx-auto ${className}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto">
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {axisEnds.map((end, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="var(--border-subtle)"
            strokeWidth="1"
          />
        ))}

        {labels.map((lb, i) => (
          <text
            key={i}
            x={lb.x}
            y={lb.y + 4}
            textAnchor={lb.anchor}
            fill="var(--text-secondary)"
            className="text-[12px] font-heading font-semibold"
          >
            {lb.label}
          </text>
        ))}

        <motion.path
          initial={{ opacity: 0.2 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.22 }}
          d={getPath(youData)}
          fill="var(--accent-primary)"
          fillOpacity={0.2}
          stroke="var(--accent-primary)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        <circle cx={center} cy={center} r="3.5" fill="var(--accent-primary)" />
      </svg>
    </div>
  );
};
