import React, { useRef } from 'react';
import { Brain, Heart, Compass, Activity, Target, Users, DollarSign, Sparkles, Fingerprint } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface ConstellationVizProps {
  activeNodes: number[];
}

const NODES = [
  { id: 1, label: 'Communication', icon: Brain, x: 50, y: 15 },
  { id: 2, label: 'Values', icon: Heart, x: 85, y: 30 },
  { id: 3, label: 'Lifestyle', icon: Compass, x: 85, y: 70 },
  { id: 4, label: 'Conflict', icon: Activity, x: 50, y: 85 },
  { id: 5, label: 'Goals', icon: Target, x: 15, y: 70 },
  { id: 6, label: 'Family', icon: Users, x: 15, y: 30 },
  { id: 7, label: 'Financial', icon: DollarSign, x: 35, y: 50 },
  { id: 8, label: 'Growth', icon: Sparkles, x: 65, y: 50 },
];

const EDGES = [
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], // Outer ring
  [1, 7], [6, 7], [5, 7], [4, 7], // Inner connections to 7
  [1, 8], [2, 8], [3, 8], [4, 8], // Inner connections to 8
  [7, 8] // Core connection
];

export const ConstellationViz: React.FC<ConstellationVizProps> = ({ activeNodes }) => {
  const isComplete = activeNodes.length === 8; // We have 8 psychological dimensions in total

  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      className="relative w-full aspect-square max-w-md mx-auto [perspective:1000px]"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
    >
      <motion.div 
        className="w-full h-full relative"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" style={{ transform: "translateZ(-20px)" }}>
          {EDGES.map(([sourceId, targetId]) => {
            const source = NODES.find(n => n.id === sourceId)!;
            const target = NODES.find(n => n.id === targetId)!;
            
            const isActive = activeNodes.includes(sourceId) && activeNodes.includes(targetId);

            return (
              <g key={`${sourceId}-${targetId}`}>
                {/* Faint base track (always visible, pulsing) */}
                <motion.line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-kithra-muted"
                  animate={{ opacity: [0.03, 0.1, 0.03] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: (sourceId + targetId) * 0.1 }}
                />
                {/* Active animated line using Framer Motion */}
                <motion.line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="var(--accent-sage)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: isActive ? 1 : 0, 
                    opacity: isActive ? 0.6 : 0 
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                {/* Traveling Light */}
                {isActive && (
                  <motion.circle
                    r="0.8"
                    fill="var(--accent-sage)"
                    initial={{ cx: source.x, cy: source.y, opacity: 0 }}
                    animate={{ 
                      cx: [source.x, target.x], 
                      cy: [source.y, target.y],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      ease: "linear",
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Final Blueprint connections (glow when complete) */}
          {activeNodes.map(nodeId => {
            const source = NODES.find(n => n.id === nodeId)!;
            return (
              <motion.line
                key={`center-${nodeId}`}
                x1={source.x}
                y1={source.y}
                x2={50} // Center X
                y2={50} // Center Y
                stroke="var(--gold-verify)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: isComplete ? 1 : 0, 
                  opacity: isComplete ? 0.4 : 0 
                }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
            );
          })}
        </svg>

      {/* Nodes */}
      {NODES.map((node) => {
        const isActive = activeNodes.includes(node.id);
        const Icon = node.icon;

        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <motion.div 
              initial={false}
              animate={isActive ? {
                backgroundColor: 'var(--surface-main)',
                borderColor: 'var(--accent-sage)',
                boxShadow: '0 0 20px rgba(13,148,136,0.3)',
                scale: 1.1,
                y: 0
              } : {
                backgroundColor: 'var(--bg-main)',
                borderColor: 'rgba(var(--color-kithra), 0.2)',
                boxShadow: 'none',
                scale: 1,
                y: [0, -4, 0]
              }}
              transition={isActive ? { 
                type: "spring", stiffness: 300, damping: 20 
              } : {
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: node.id * 0.2 }
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border shadow-sm"
            >
              <motion.div
                initial={false}
                animate={{ 
                  opacity: isActive ? 1 : 0.3, 
                  color: isActive ? 'var(--accent-sage)' : 'var(--color-kithra-muted)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </motion.div>
            
            <motion.span 
              initial={false}
              animate={{ 
                opacity: isActive ? 1 : 0, 
                y: isActive ? 0 : -5 
              }}
              transition={{ duration: 0.4 }}
              className="absolute top-full mt-2 font-data text-[10px] uppercase tracking-wider font-bold text-kithra whitespace-nowrap"
            >
              {node.label}
            </motion.span>
          </div>
        );
      })}

      {/* Center "Compatibility Blueprint" Node (Appears only when complete) */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isComplete ? 1 : 0, 
          scale: isComplete ? 1 : 0 
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.5 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20"
      >
        <div className="w-20 h-20 rounded-full bg-[var(--surface-main)] border-2 border-[var(--gold-verify)] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.4)] relative">
          <div className="absolute inset-0 rounded-full border border-[var(--gold-verify)] animate-ping opacity-20" />
          <Fingerprint className="w-8 h-8 text-[var(--gold-verify)]" />
        </div>
        <span className="font-heading font-extrabold text-sm sm:text-base text-kithra whitespace-nowrap bg-[var(--surface-main)] px-4 py-1.5 rounded-full border border-kithra/10 shadow-sm">
          Compatibility Blueprint
        </span>
      </motion.div>
      </motion.div>
    </div>
  );
};
