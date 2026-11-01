import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  ShieldCheck, 
  Keyboard, 
  HelpCircle, 
  LogOut, 
  Crown, 
  CheckCircle2, 
  Laptop,
  ChevronDown
} from 'lucide-react';
import { ActiveTab, AppMode } from '../types';

interface ProfileDropdownProps {
  setActiveTab: (tab: ActiveTab) => void;
  setAppMode: (mode: AppMode) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  setActiveTab,
  setAppMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-kithra bg-[var(--bg-main)] hover:border-[var(--accent-sage)] transition-all cursor-pointer shadow-2xs group"
      >
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="User avatar"
            className="w-7 h-7 rounded-full object-cover border border-[var(--accent-sage)]"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[var(--surface-main)]" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1">
            <span className="font-heading font-bold text-xs text-kithra">Dr. Ananya</span>
            <ShieldCheck className="w-3 h-3 text-[var(--gold-verify)]" />
          </div>
          <span className="font-data text-[9px] text-[var(--accent-sage)] font-bold block leading-none uppercase tracking-wider">
            MASTER OS
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-kithra-muted group-hover:text-kithra transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-[var(--surface-main)] border border-kithra shadow-xl rounded-2xl p-2 z-50 divide-y divide-kithra/10"
          >
            {/* Header User Card */}
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-[var(--gold-verify)]"
                />
                <div>
                  <h4 className="font-heading font-bold text-sm text-kithra flex items-center gap-1">
                    Dr. Ananya
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold-verify)]" />
                  </h4>
                  <span className="font-data text-[10px] text-kithra-muted block">ananya@kithra.os</span>
                </div>
              </div>

              {/* Active Plan Pill */}
              <div className="p-2 rounded-xl bg-gradient-to-r from-[var(--accent-sage)]/10 to-[var(--gold-verify)]/10 border border-[var(--accent-sage)]/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-data text-[10px] font-bold text-[var(--accent-sage)] uppercase tracking-wider">
                  <Crown className="w-3.5 h-3.5 text-[var(--gold-verify)]" />
                  <span>Master OS Member</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-data text-[9px] font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Main Navigation Options */}
            <div className="py-1 space-y-0.5">
              <button
                onClick={() => { setActiveTab('profile'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading font-semibold text-kithra hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-kithra-muted" />
                <span>My Profile & Credentials</span>
              </button>

              <button
                onClick={() => { setActiveTab('billing'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading font-semibold text-kithra hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-kithra-muted" />
                <span>Subscription & Invoices</span>
              </button>

              <button
                onClick={() => { setActiveTab('security'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading font-semibold text-kithra hover:bg-[var(--bg-main)] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-kithra-muted" />
                <span>Security & DPDP Center</span>
              </button>
            </div>

            {/* Quick System Helpers */}
            <div className="py-1 space-y-0.5">
              <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-data text-kithra-muted">
                <span className="flex items-center gap-1.5">
                  <Laptop className="w-3 h-3" />
                  <span>MacBook Pro (Active)</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Synced</span>
                </span>
              </div>
            </div>

            {/* Footer Logout */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setAppMode('public');
                  setActiveTab('landing');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-heading font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of OS</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
