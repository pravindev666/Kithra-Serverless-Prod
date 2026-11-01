import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab, AuthFlowState } from '../types';
import { Wordmark } from './Wordmark';
import { useKithraMotion } from '../lib/motion';

interface LoginPageProps {
  onSuccess: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, setActiveTab }) => {
  const { dur, easeStandard, shouldReduce } = useKithraMotion();
  const [email, setEmail] = useState('aarav.mehta@example.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [authState, setAuthState] = useState<AuthFlowState>('idle');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setAuthState('invalid_email');
      return;
    }
    if (authState === 'rate_limited_429') return;
    setAuthState('submitting');
    setTimeout(() => {
      onSuccess();
    }, 180);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
      {/* Top Bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('landing')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Kithra</span>
        </button>
        <Wordmark />
      </div>

      {/* Main 12-Col Split Layout (04B_AUTH_PHOTO_AND_ERRORS_RD) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left 6 Cols: Editorial 4:5 Story Panel (Mobile 16:9 Banner) */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] overflow-hidden shadow-xs">
            <div className="aspect-video lg:aspect-[5/4] relative bg-[var(--bg-subtle)]">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=80"
                alt="Illustrative editorial portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/80 mb-1">
                  Illustrative image · Warm Editorial D2
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-semibold leading-snug">
                  Welcome back to your private relationship workspace.
                </h2>
                <p className="text-xs sm:text-sm text-white/85 mt-2 max-w-md">
                  Your Friendship, Dating, and Matrimony modes remain strictly isolated with
                  independent consent controls.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Sign-In Form + Interactive Auth State Simulator */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur.ui, ease: easeStandard }}
          className="lg:col-span-6 max-w-xl w-full mx-auto"
        >
          <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Auth State Simulator Bar (04B_AUTH_PHOTO_AND_ERRORS_RD) */}
            <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Auth State Inspector (PUB-004..006 / 04B Spec):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'idle', label: 'Normal Sign-In' },
                    { id: 'invalid_email', label: 'Invalid Email' },
                    { id: 'wrong_credentials', label: 'Wrong Password' },
                    { id: 'rate_limited_429', label: 'Rate Limit (429)' },
                    { id: 'unverified_email', label: 'Unverified Email' },
                    { id: 'session_expired', label: 'Session Expired' },
                    { id: 'forgot_password', label: 'Forgot Password' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setResetEmailSent(false);
                      setAuthState(st.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                      authState === st.id
                        ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-heading text-3xl font-semibold text-[var(--text-primary)]">
                {authState === 'forgot_password' ? 'Reset your password' : 'Sign in to Kithra'}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {authState === 'forgot_password'
                  ? 'Enter your email address and we will send a time-boxed reset link.'
                  : 'Access your patterns, active modes, and mutual connections.'}
              </p>
            </div>

            {/* State Banners */}
            {authState === 'invalid_email' && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger)]/30 text-[var(--state-danger)] text-xs flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Invalid email format (ERR_AUTH_EMAIL_FORMAT):</strong> Please enter a
                  valid email address such as <code>name@domain.in</code>.
                </div>
              </div>
            )}

            {authState === 'wrong_credentials' && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger)]/30 text-[var(--state-danger)] text-xs flex items-start gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Incorrect email or password (ERR_AUTH_INVALID_CREDENTIALS):</strong> We
                  never disclose whether an email is registered. Check your credentials or reset
                  your password.
                </div>
              </div>
            )}

            {authState === 'rate_limited_429' && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-[var(--state-warning-bg)] border border-[var(--state-warning)]/30 text-[var(--state-warning)] text-xs flex items-start gap-2.5"
              >
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Too many sign-in attempts (HTTP 429 · Retry-After: 45s):</strong> Sign-in
                  is temporarily paused to protect your account from credential stuffing.
                </div>
              </div>
            )}

            {authState === 'unverified_email' && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-[var(--state-info-bg)] border border-[var(--state-info)]/30 text-[var(--state-info)] text-xs flex items-start gap-2.5"
              >
                <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Verify your email address (PUB-006):</strong> Check{' '}
                  <code>{email}</code> for your 6-digit verification link before enabling discovery.
                </div>
              </div>
            )}

            {authState === 'session_expired' && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-[var(--state-warning-bg)] border border-[var(--state-warning)]/30 text-[var(--state-warning)] text-xs flex items-start gap-2.5"
              >
                <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Session expired for your security:</strong> Your idle session token rotated.
                  Sign in again to resume where you left off.
                </div>
              </div>
            )}

            {authState === 'forgot_password' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                {resetEmailSent ? (
                  <div className="p-4 rounded-xl bg-[var(--state-success-bg)] text-[var(--state-success)] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      If an account exists for {email}, a 15-minute reset link has been dispatched.
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setResetEmailSent(true)}
                    className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-sm font-semibold"
                  >
                    Send Password Reset Link
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAuthState('idle')}
                  className="w-full py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-medium text-[var(--text-secondary)]"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-medium text-[var(--text-secondary)]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthState('forgot_password')}
                      className="text-xs font-medium text-[var(--accent-primary)] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authState === 'rate_limited_429'}
                  className="w-full py-3.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 text-[var(--text-on-accent)] font-semibold text-sm transition-colors shadow-xs"
                >
                  {authState === 'submitting' ? 'Signing in...' : 'Sign In to Workspace'}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
              <span>New to Kithra?</span>
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="font-semibold text-[var(--accent-primary)] hover:underline"
              >
                Create an account with 18+ &amp; mode consent →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
