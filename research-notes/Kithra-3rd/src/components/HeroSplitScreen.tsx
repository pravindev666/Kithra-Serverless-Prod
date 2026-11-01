import React from 'react';
import { motion } from 'framer-motion';

export const HeroSplitScreen: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 20 }
    }
  };

  const visibleTraits = [
    "Age", "Height", "Salary", "Religion", "Occupation", "Photos"
  ];

  const invisibleTraits = [
    "Conflict Style", "Communication", "Values", "Goals", "Emotional Regulation", "Attachment", "Growth", "Boundaries"
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="mt-16 w-full max-w-5xl mx-auto rounded-3xl overflow-hidden flex flex-col md:flex-row border border-kithra/10 shadow-sm"
    >
      {/* Left Side: What everyone sees (Faded, struck through) */}
      <div className="flex-1 bg-[var(--surface-main)] p-8 md:p-12 border-b md:border-b-0 md:border-r border-kithra/10 flex flex-col items-center justify-center text-center">
        <h3 className="font-data text-[10px] uppercase tracking-[0.2em] text-kithra-muted mb-8 font-bold opacity-60">
          What everyone sees.
        </h3>
        <div className="flex flex-col gap-4">
          {visibleTraits.map((trait, idx) => (
            <motion.div key={idx} variants={itemVariants} className="relative">
              <span className="font-heading font-semibold text-lg text-kithra-muted/40 line-through decoration-kithra-muted/30">
                {trait}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side: What actually predicts compatibility (High contrast, focused) */}
      <div className="flex-1 bg-[#17181C] text-white p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#0D9488]/10 blur-[80px] pointer-events-none" />
        
        <h3 className="font-data text-[10px] uppercase tracking-[0.2em] text-[#0D9488] mb-8 font-bold z-10">
          What actually predicts compatibility.
        </h3>
        <div className="flex flex-col gap-4 z-10">
          {invisibleTraits.map((trait, idx) => (
            <motion.div key={idx} variants={itemVariants} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
              <span className="font-heading font-bold text-lg tracking-wide text-white/90">
                {trait}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
