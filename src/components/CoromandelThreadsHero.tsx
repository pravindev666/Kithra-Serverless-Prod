import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { EditorialImage } from './EditorialImage';

interface CoromandelThreadsHeroProps {
  manualReduceMotion?: boolean;
  onPrimaryAction: () => void;
  onSecondaryScrollToHowItWorks: () => void;
}

export const CoromandelThreadsHero: React.FC<CoromandelThreadsHeroProps> = ({
  manualReduceMotion = false,
  onPrimaryAction,
  onSecondaryScrollToHowItWorks,
}) => {
  const prefersReduced = useReducedMotion();
  const isReducedMotion = Boolean(prefersReduced || manualReduceMotion);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Subtle pointer parallax (non-touch desktop only, clamped to ±2.5deg and ±7px)
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isReducedMotion || e.pointerType === 'touch' || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setPointerOffset({
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
    });
  };

  const handlePointerLeave = () => {
    setPointerOffset({ x: 0, y: 0 });
  };

  const rotateX = isReducedMotion ? 0 : Number((-pointerOffset.y * 2.2).toFixed(2));
  const rotateY = isReducedMotion ? 0 : Number((pointerOffset.x * 2.4).toFixed(2));
  const translateX = isReducedMotion ? 0 : Number((pointerOffset.x * 6).toFixed(1));
  const translateY = isReducedMotion ? 0 : Number((pointerOffset.y * 6).toFixed(1));

  return (
    <section
      aria-labelledby="hero-heading"
      className="py-10 sm:py-14 lg:py-[68px] border-b border-[var(--line)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* LEFT COLUMN: Staged Typographic Reveal + Single Clear Primary CTA */}
        <motion.div
          initial={isReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            isReducedMotion
              ? { duration: 0 }
              : { duration: 0.42, ease: [0.16, 1, 0.3, 1] }
          }
          className="lg:col-span-6"
        >
          <p className="uppercase tracking-[2.3px] text-xs font-bold text-[var(--ochre-text)]">
            Connections with intention
          </p>
          <h1
            id="hero-heading"
            className="font-serif-editorial text-[var(--heading)] font-semibold mt-4 mb-4"
            style={{
              fontSize: 'clamp(2.75rem, 5.6vw, 4.75rem)',
              lineHeight: 0.99,
              textWrap: 'balance',
            }}
          >
            Find your kind of people.
          </h1>
          <p className="text-base sm:text-[17px] text-[var(--muted)] leading-[1.7] max-w-[520px]">
            Friendship, dating or marriage-minded introductions—shaped by thoughtful questions, clear visibility boundaries, and unhurried conversation.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 mt-7 mb-5">
            {/* ONE Clear Primary CTA */}
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center gap-2 rounded-[9px] bg-[var(--primary)] text-[var(--on-primary)] border border-[var(--primary)] px-5 py-3.5 text-sm font-bold transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0 min-h-[44px]"
            >
              <span>Begin with your intention</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                onSecondaryScrollToHowItWorks();
              }}
              className="inline-flex items-center rounded-[9px] border border-[var(--line)] text-[var(--heading)] bg-transparent hover:bg-[var(--surface2)] px-4 py-3.5 text-sm font-bold transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              How Kithra works
            </a>
          </div>

          <p className="text-sm text-[var(--muted)]">
            One account · Three independent intentions · Echo, Counterpoint &amp; Mosaic Fit
          </p>
        </motion.div>

        {/* RIGHT COLUMN: 2.5D "Coromandel Threads / Connection Paths" Stage */}
        <div
          ref={stageRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="lg:col-span-6"
          style={{ perspective: '1100px' }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 160, damping: 24 }}
            className="relative w-full max-w-[520px] mx-auto lg:max-w-none"
          >
            {/* Layer 1: Restrained Indigo Accent Plane */}
            <div
              aria-hidden="true"
              style={{
                transform: `translate3d(${-translateX * 0.5}px, ${-translateY * 0.5}px, 0px)`,
                transition: 'transform 180ms ease-out',
              }}
              className="hidden sm:block absolute -top-3 left-2 w-[78%] h-[86%] rounded-[16px] border border-[var(--line)] bg-[var(--surface2)]/70"
            />

            {/* Layer 2: Thin Ochre & Teal Relationship-Path Lines (Coromandel Threads) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 560 470"
              fill="none"
              className="pointer-events-none absolute inset-0 w-full h-full z-10 overflow-visible"
              style={{
                transform: `translate3d(${translateX * 0.7}px, ${translateY * 0.7}px, 12px)`,
                transition: 'transform 180ms ease-out',
              }}
            >
              {/* Path 1: Echo (Converging warm ochre thread) */}
              <motion.path
                d="M 18 390 C 145 375, 215 245, 345 205 C 425 180, 485 110, 542 54"
                stroke="var(--ochre)"
                strokeWidth="1.75"
                strokeOpacity="0.72"
                strokeLinecap="round"
                initial={isReducedMotion ? { pathLength: 1, opacity: 0.72 } : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.72 }}
                transition={
                  isReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.62, delay: 0.12, ease: 'easeOut' }
                }
              />
              {/* Path 2: Counterpoint (Gentle divergence & respect) */}
              <motion.path
                d="M 48 92 C 165 118, 235 190, 345 205 C 430 218, 485 280, 538 335"
                stroke="var(--friend)"
                strokeWidth="1.4"
                strokeOpacity="0.6"
                strokeDasharray="4 4"
                strokeLinecap="round"
                initial={isReducedMotion ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={
                  isReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.64, delay: 0.18, ease: 'easeOut' }
                }
              />
              {/* Subtle convergence node */}
              <circle cx="345" cy="205" r="4.5" fill="var(--ochre)" fillOpacity="0.85" />
              <circle
                cx="345"
                cy="205"
                r="11"
                stroke="var(--ochre)"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            </svg>

            {/* Layer 3: Primary 4:5 Editorial Portrait + Desktop Contextual Image */}
            <div className="relative z-20 sm:h-[450px]">
              {/* Primary 4:5 Human Editorial Image (Single stable aspect ratio on mobile, 74% width on desktop) */}
              <motion.div
                initial={isReducedMotion ? false : { scale: 1.025, opacity: 0.92 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  isReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.56, ease: [0.16, 1, 0.3, 1] }
                }
                style={{
                  transform: `translate3d(${translateX * 0.4}px, ${translateY * 0.4}px, 8px)`,
                }}
                className="w-full sm:w-[74%] sm:ml-[4%] aspect-[4/5] sm:h-[405px]"
              >
                <EditorialImage
                  variant="hero-main"
                  alt="Three friends talking warmly in morning daylight on a veranda"
                  aspectClass="w-full h-full"
                  lazy={false}
                />
              </motion.div>

              {/* Secondary Contextual Editorial Image (Desktop / Tablet only so mobile has a single stable 4:5 frame) */}
              <motion.div
                initial={isReducedMotion ? false : { scale: 1.025, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  isReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.58, delay: 0.08, ease: [0.16, 1, 0.3, 1] }
                }
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, 18px)`,
                  boxShadow: 'var(--shadow)',
                }}
                className="hidden sm:block w-[46%] h-[255px] absolute right-0 bottom-0 rounded-[13px] p-1.5 bg-[var(--bg)]"
              >
                <EditorialImage
                  variant="hero-side"
                  alt="Two people in unhurried conversation over filter coffee"
                  aspectClass="w-full h-full"
                  lazy={false}
                />
              </motion.div>

              {/* Quiet Editorial Caption Card */}
              <div
                style={{
                  transform: `translate3d(${translateX * 0.8}px, ${translateY * 0.8}px, 22px)`,
                  boxShadow: 'var(--shadow)',
                }}
                className="mt-3 sm:mt-0 sm:absolute sm:bottom-3 sm:left-0 bg-[var(--surface)] text-[var(--heading)] border border-[var(--line)] rounded-[10px] px-4 py-3 text-xs sm:text-[13px] font-bold sm:max-w-[295px]"
              >
                <span>Echo, Counterpoint &amp; Mosaic Fit.</span>
                <span className="block text-[var(--muted)] font-normal mt-1">
                  Shared habits and honest differences—never an artificial soulmate score.
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
