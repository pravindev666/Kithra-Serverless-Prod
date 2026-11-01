import React, { useState } from 'react';
import {
  Check,
  CreditCard,
  Download,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, BillingTermMonths, MembershipTier } from '../types';
import { useToast } from './ToastProvider';

interface BillingViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ setActiveTab }) => {
  const { addToast } = useToast();

  const [currentTier, setCurrentTier] = useState<MembershipTier>('plus');
  const [termMonths, setTermMonths] = useState<BillingTermMonths>(1);
  const [autoRenewCancelled, setAutoRenewCancelled] = useState(false);
  const [refundRequested, setRefundRequested] = useState(false);

  const plusByTerm: Record<BillingTermMonths, { perMo: number; total: number }> = {
    1: { perMo: 149, total: 149 },
    3: { perMo: 133, total: 399 },
    6: { perMo: 116, total: 699 },
    12: { perMo: 99, total: 1199 },
  };

  const connectByTerm: Record<BillingTermMonths, { perMo: number; total: number }> = {
    1: { perMo: 249, total: 249 },
    3: { perMo: 216, total: 649 },
    6: { perMo: 199, total: 1194 },
    12: { perMo: 166, total: 1999 },
  };

  const invoices = [
    {
      id: 'INV-2026-8841',
      date: '01 Nov 2026',
      plan: 'Kithra Plus (Unified 3-Mode Membership · 1 Month)',
      amount: '₹149.00 INR',
      status: 'Paid (UPI)',
    },
    {
      id: 'INV-2026-7910',
      date: '01 Oct 2026',
      plan: 'Kithra Plus (Unified 3-Mode Membership · 1 Month)',
      amount: '₹149.00 INR',
      status: 'Paid (UPI)',
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Top Unified Membership Banner (D-07 Architecture C) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
              MEM-028..031 · Decision D-07 · Unified Architecture C Pricing
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold">
              One Membership Across Friendship, Dating &amp; Matrimony
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              No mode-specific upcharges. Safety tools, blocking, basic discovery, and mutual
              messaging remain free forever.
            </p>
          </div>

          <div className="inline-flex p-1.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] self-start">
            {([1, 3, 6, 12] as BillingTermMonths[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTermMonths(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold ${
                  termMonths === t
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {t === 1 ? '1 Mo' : `${t} Mos`}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div
            className={`rounded-2xl border p-6 flex flex-col justify-between space-y-5 ${
              currentTier === 'free'
                ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-subtle)]/20'
                : 'border-[var(--border-default)] bg-[var(--bg-subtle)]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold">Kithra Free</h2>
                <span className="font-mono text-xs text-[var(--text-muted)]">Forever</span>
              </div>
              <div className="font-mono text-3xl font-bold tabular-nums">₹0</div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>All 3 relationship modes + Echo lens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Unlimited mutual-consent 1:1 messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>0ms Block, Mute, Report &amp; Data Export</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentTier('free');
                addToast('Switched to Kithra Free (₹0).', 'info');
              }}
              className="w-full py-2.5 rounded-xl border border-[var(--border-default)] text-xs font-semibold"
            >
              {currentTier === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </button>
          </div>

          {/* Plus */}
          <div
            className={`rounded-2xl border p-6 flex flex-col justify-between space-y-5 ${
              currentTier === 'plus'
                ? 'border-2 border-[var(--accent-primary)] bg-[var(--bg-elevated)] shadow-xs'
                : 'border-[var(--border-default)] bg-[var(--bg-subtle)]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold">Kithra Plus</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[var(--accent-primary)] text-[var(--text-on-accent)]">
                  Popular
                </span>
              </div>
              <div className="font-mono text-3xl font-bold tabular-nums">
                ₹{plusByTerm[termMonths].perMo}
                <span className="text-xs font-normal text-[var(--text-muted)]"> / mo</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Unlocks Counterpoint &amp; Mosaic Fit lenses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Full 12-theme breakdown &amp; Candidate Compare</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Join up to 5 community Circles</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentTier('plus');
                setAutoRenewCancelled(false);
                addToast(`Activated Kithra Plus (₹${plusByTerm[termMonths].total}).`, 'success');
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              {currentTier === 'plus'
                ? `Active Plan (₹${plusByTerm[termMonths].total})`
                : `Select Plus — ₹${plusByTerm[termMonths].total}`}
            </button>
          </div>

          {/* Connect */}
          <div
            className={`rounded-2xl border p-6 flex flex-col justify-between space-y-5 ${
              currentTier === 'connect'
                ? 'border-2 border-[var(--accent-primary)] bg-[var(--bg-elevated)] shadow-xs'
                : 'border-[var(--border-default)] bg-[var(--bg-subtle)]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold">Kithra Connect</h2>
                <span className="font-mono text-xs text-[var(--text-muted)]">All Features</span>
              </div>
              <div className="font-mono text-3xl font-bold tabular-nums">
                ₹{connectByTerm[termMonths].perMo}
                <span className="text-xs font-normal text-[var(--text-muted)]"> / mo</span>
              </div>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Deterministic If-Then Scenario Simulator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Create &amp; host community Circles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Revocable read-only Matrimony summary link</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentTier('connect');
                setAutoRenewCancelled(false);
                addToast(`Upgraded to Kithra Connect (₹${connectByTerm[termMonths].total}).`, 'success');
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              {currentTier === 'connect'
                ? `Active Plan (₹${connectByTerm[termMonths].total})`
                : `Select Connect — ₹${connectByTerm[termMonths].total}`}
            </button>
          </div>
        </div>
      </div>

      {/* One-Step Cancellation & Refund Request Flow (MEM-031) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4">
          <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            MEM-031 · Zero Dark-Pattern One-Step Cancellation
          </span>
          <h3 className="font-heading text-xl font-semibold">
            Cancel Auto-Renewal or Request a Refund
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Per 12_BILLING_RD, cancelling your subscription takes a single click with zero retention
            mazes. Your modes, connections, and safety controls remain active on Kithra Free.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setAutoRenewCancelled(true);
                addToast('Auto-renewal cancelled in one click (0ms).', 'info');
              }}
              className="px-4 py-2.5 rounded-xl border border-[var(--state-danger)]/40 text-[var(--state-danger)] text-xs font-semibold transition-none"
            >
              {autoRenewCancelled ? '✓ Auto-Renewal Cancelled' : 'One-Click Cancel Subscription (0ms)'}
            </button>

            <button
              type="button"
              onClick={() => {
                setRefundRequested(true);
                addToast('Refund request #RF-2026-109 submitted to Billing Ops.', 'info');
              }}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs font-medium"
            >
              {refundRequested ? '✓ Refund Request Logged (#RF-2026-109)' : 'Request Prorated Refund'}
            </button>
          </div>
        </div>

        {/* Invoices Table (MEM-030) */}
        <div className="lg:col-span-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 space-y-4">
          <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
            MEM-030 · GST-Ready Receipts &amp; Billing History
          </span>
          <div className="space-y-2.5">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-semibold text-[var(--text-primary)]">
                    {inv.id} · {inv.amount}
                  </div>
                  <div className="text-[var(--text-secondary)]">{inv.plan}</div>
                </div>
                <span className="font-mono text-[11px] text-[var(--state-success)]">
                  {inv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
