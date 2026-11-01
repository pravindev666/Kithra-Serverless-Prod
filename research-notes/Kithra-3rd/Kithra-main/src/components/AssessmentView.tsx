import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  Check,
  Info,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, CompatibilityReport } from '../types';
import { CANONICAL_THEMES, QUESTIONS } from '../data/questions';
import { DEFAULT_REPORT } from '../data/mockReport';
import { useKithraMotion } from '../lib/motion';
import { useToast } from './ToastProvider';

interface AssessmentViewProps {
  onComplete: (report: CompatibilityReport, answers: Record<number, string>) => void;
  setActiveTab: (tab: ActiveTab) => void;
  initialAnswers?: Record<number, string>;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onComplete,
  setActiveTab,
  initialAnswers = {},
}) => {
  const { dur, easeStandard, shouldReduce } = useKithraMotion();
  const { addToast } = useToast();

  const [viewMode, setViewMode] = useState<'catalog' | 'quiz'>('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [skippedIds, setSkippedIds] = useState<number[]>([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  // Keyboard 1-4 selection & arrow navigation (04_UIUX_RD)
  useEffect(() => {
    if (viewMode !== 'quiz') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const opt = currentQuestion?.options[idx];
        if (opt) {
          handleSelectOption(opt.id);
        }
      } else if (e.key === 'ArrowRight' && currentIndex < QUESTIONS.length - 1) {
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex((i) => i - 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [viewMode, currentIndex, currentQuestion]);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSkip = () => {
    if (!skippedIds.includes(currentQuestion.id)) {
      setSkippedIds((prev) => [...prev, currentQuestion.id]);
    }
    if (currentIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      handleFinish();
    }
  };

  const handleSaveAndResume = () => {
    addToast(
      `Saved ${answeredCount} responses. Coverage updated deterministically.`,
      'success'
    );
    setActiveTab('home');
  };

  const handleFinish = () => {
    const newCoverage = Math.min(100, Math.max(68, 60 + Object.keys(answers).length * 4));
    const updatedReport: CompatibilityReport = {
      ...DEFAULT_REPORT,
      comparableItemsAnswered: newCoverage,
    };
    addToast('Questionnaire patterns saved. Agreement indices recomputed (v1.2).', 'success');
    onComplete(updatedReport, answers);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('quiz')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'quiz'
                ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            Interactive Question Flow ({currentIndex + 1}/{QUESTIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              viewMode === 'catalog'
                ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]'
            }`}
          >
            12-Theme Registry (2,400 Slots)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[var(--state-warning-bg)] text-[var(--state-warning)]">
            Draft items — shown for illustration only (D-08)
          </span>
          <button
            type="button"
            onClick={handleSaveAndResume}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)]"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Save &amp; Resume Later</span>
          </button>
        </div>
      </div>

      {viewMode === 'catalog' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CANONICAL_THEMES.map((theme) => (
            <div
              key={theme.code}
              className="rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-5 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
                    {theme.code}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    {theme.placeholderBankSize} IDs
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold">{theme.name}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {theme.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const idx = QUESTIONS.findIndex((q) => q.themeCode === theme.code);
                  if (idx >= 0) setCurrentIndex(idx);
                  setViewMode('quiz');
                }}
                className="w-full py-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--accent-primary)] hover:text-[var(--text-on-accent)] text-xs font-semibold transition-colors"
              >
                Practice Theme →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
              <span>
                Item {currentQuestion.itemCode || `Q_${currentQuestion.id}`} · Theme{' '}
                {currentQuestion.themeCode || currentQuestion.domain.toUpperCase()}
              </span>
              <span>
                Answered: {answeredCount}/{QUESTIONS.length} · Skipped: {skippedIds.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-[var(--bg-subtle)] overflow-hidden">
              <motion.div
                className="h-full bg-[var(--accent-primary)]"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: dur.ui, ease: easeStandard }}
              />
            </div>
          </div>

          {/* Directional Slide Question Card (≤200ms per MOTION_FOR_REACT_COMPLETE_MATRIX.md) */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              initial={shouldReduce ? false : { opacity: 0, x: 16 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduce ? undefined : { opacity: 0, x: -16 * direction }}
              transition={{ duration: dur.quiz, ease: easeStandard }}
              className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--accent-primary)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {currentQuestion.domain} · {currentQuestion.itemCode}
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
                  {currentQuestion.text}
                </h2>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{currentQuestion.context}</span>
                </p>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label={currentQuestion.text}>
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                        isSelected
                          ? 'bg-[var(--accent-primary-subtle)]/50 border-[var(--accent-primary)] shadow-2xs'
                          : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                            Key {idx + 1}
                          </span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {opt.text}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pl-12">
                          {opt.traits.map((tr) => (
                            <span
                              key={tr}
                              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                            >
                              {tr}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                            : 'border border-[var(--border-default)]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border-default)] disabled:opacity-40 text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Skip Question</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-[var(--text-on-accent)] text-xs font-semibold"
                  >
                    <span>
                      {currentIndex === QUESTIONS.length - 1
                        ? 'Compute My Patterns'
                        : 'Next Question'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
