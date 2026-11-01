import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { KithraWeave } from './KithraWeave';

interface KithraHeroProps {
  manualReduceMotion?: boolean;
  onPrimaryAction: () => void;
  onSecondaryScrollToHowItWorks: () => void;
}

/**
 * Landing hero. The headline carries the explanation; the Kithra Weave
 * carries the emotion. No cards, labels or diagrams inside the artwork.
 */
export const KithraHero: React.FC<KithraHeroProps> = ({
  manualReduceMotion = false,
  onPrimaryAction,
  onSecondaryScrollToHowItWorks,
}) => {
  const systemReduced = useReducedMotion();
  const reduced = Boolean(systemReduced || manualReduceMotion);

  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-20 border-b border-[var(--line)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduced ? undefined : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[560px]"
        >
          <p className="text-[13px] font-semibold tracking-[0.16em] uppercase text-[var(--ochre-text)]">
            Connections with intention
          </p>
          <h1
            id="hero-heading"
            className="font-serif-editorial text-[var(--heading)] font-semibold mt-4"
            style={{
              fontSize: 'clamp(2.75rem, 6vw, 4.75rem)',
              lineHeight: 1,
              textWrap: 'balance',
            }}
          >
            Find your kind of people.
          </h1>
          <p className="mt-6 text-[17px] sm:text-lg text-[var(--muted)] leading-[1.65] max-w-[30em]">
            Friendship, dating or a life partner — Kithra helps you meet people who share
            your values, with a separate, private profile for each kind of connection.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center justify-center gap-2 min-h-[48px] rounded-[10px] bg-[var(--primary)] text-[var(--on-primary)] px-6 text-[15px] font-semibold hover:brightness-110 transition-[filter] cursor-pointer"
            >
              Get started
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                onSecondaryScrollToHowItWorks();
              }}
              className="inline-flex items-center justify-center min-h-[48px] rounded-[10px] px-5 text-[15px] font-semibold text-[var(--heading)] hover:bg-[var(--surface2)] transition-colors"
            >
              How it works
            </a>
          </div>

          <p className="mt-6 text-sm text-[var(--muted)]">
            Free to join · Your photos stay in the spaces you choose
          </p>
        </motion.div>

        <div className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] mx-auto lg:mr-0">
          <KithraWeave manualReduceMotion={manualReduceMotion} />
        </div>
      </div>
    </section>
  );
};

