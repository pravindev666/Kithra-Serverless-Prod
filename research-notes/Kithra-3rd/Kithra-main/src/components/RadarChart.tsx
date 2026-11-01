import React from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  className?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ className = "" }) => {
  // SVG Setup
  const size = 500; // Increased size to prevent label clipping
  const center = size / 2;
  const radius = 150; 
  const axes = [
    "Conflict", "Communication", "Values", "Goals",
    "Emotion", "Attachment", "Growth", "Boundaries"
  ];
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;

  // Calculate path strings based on data arrays (0 to 1 scale)
  const youData = [0.8, 0.9, 0.7, 0.6, 0.85, 0.9, 0.75, 0.8];
  const partnerData = [0.75, 0.85, 0.8, 0.65, 0.9, 0.8, 0.7, 0.85];

  const getPath = (data: number[]) => {
    const points = data.map((val, idx) => {
      const angle = (idx * angleStep) - (Math.PI / 2);
      const r = val * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
    return `M ${points.join(" L ")} Z`;
  };

  const getAxisLines = () => {
    return axes.map((_, idx) => {
      const angle = (idx * angleStep) - (Math.PI / 2);
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle)
      };
    });
  };

  const getLabelPositions = () => {
    return axes.map((label, idx) => {
      const angle = (idx * angleStep) - (Math.PI / 2);
      const r = radius + 35; // Push label out further
      return {
        label,
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        anchor: Math.cos(angle) > 0.1 ? 'start' : Math.cos(angle) < -0.1 ? 'end' : 'middle',
      };
    });
  };

  const axisEnds = getAxisLines();
  const labels = getLabelPositions();

  return (
    <div className={`relative w-full max-w-[600px] mx-auto ${className}`}>
      
      {/* Legend */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        viewport={{ once: true }}
        className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10 font-data text-xs uppercase tracking-widest font-bold"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--accent-sage)]/20 border border-[var(--accent-sage)]" />
          <span className="text-[var(--accent-sage)]">You</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[var(--gold-verify)]/20 border border-[var(--gold-verify)]" />
          <span className="text-[var(--gold-verify)]">Partner</span>
        </div>
      </motion.div>

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto drop-shadow-sm">
        {/* Background Grid Circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <motion.circle 
            key={i} 
            initial={{ opacity: 0, r: 0 }}
            whileInView={{ opacity: 1, r: radius * scale }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            viewport={{ once: true }}
            cx={center} 
            cy={center} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeDasharray="4 4"
            className="text-kithra/10"
          />
        ))}

        {/* Axis Lines */}
        {axisEnds.map((end, i) => (
          <motion.line 
            key={i} 
            initial={{ x2: center, y2: center, opacity: 0 }}
            whileInView={{ x2: end.x, y2: end.y, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 + (i * 0.1) }}
            viewport={{ once: true }}
            x1={center} 
            y1={center} 
            stroke="currentColor" 
            strokeWidth="1" 
            className="text-kithra/10"
          />
        ))}

        {/* Labels */}
        {labels.map((lb, i) => (
          <motion.text
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            viewport={{ once: true }}
            x={lb.x}
            y={lb.y + 4} // adjust for vertical centering
            textAnchor={lb.anchor}
            fill="currentColor"
            className="text-[13px] font-heading font-bold text-kithra-muted/60"
          >
            {lb.label}
          </motion.text>
        ))}

        {/* You Polygon */}
        <motion.path
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 0.2 }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut", delay: 2.5 },
            fillOpacity: { duration: 1, delay: 4.5 }
          }}
          viewport={{ once: true }}
          d={getPath(youData)}
          fill="var(--accent-sage)"
          stroke="var(--accent-sage)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Partner Polygon */}
        <motion.path
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 0.2 }}
          transition={{ 
            pathLength: { duration: 2, ease: "easeInOut", delay: 5.5 },
            fillOpacity: { duration: 1, delay: 7.5 }
          }}
          viewport={{ once: true }}
          d={getPath(partnerData)}
          fill="var(--gold-verify)"
          stroke="var(--gold-verify)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Center Point */}
        <motion.circle 
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          cx={center} cy={center} r="4" fill="currentColor" className="text-kithra" 
        />
      </svg>
    </div>
  );
};
