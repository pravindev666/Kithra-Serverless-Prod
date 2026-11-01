import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Compass 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccessLogin }) => {
  const [step, setStep] = useState<'mobile' | 'otp' | 'username' | 'admin'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [username, setUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length === 6 || otpInput === '123456') {
      setStep('username');
    }
  };

  const handleCompleteUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSuccessLogin();
      onClose();
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'kithra2026' || adminPassword) {
      onSuccessLogin();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[var(--surface-main)] border border-kithra rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-kithra">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0D9488] text-white flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-heading font-extrabold text-lg text-kithra">
              KITHRA AUTH
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-kithra text-kithra-muted hover:text-kithra"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Mobile Phone Number */}
        {step === 'mobile' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-xl text-kithra">
                Mobile OTP Authentication
              </h2>
              <p className="text-xs text-kithra-muted">
                No passwords or email required. Pure mobile OTP verification.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-data text-xs text-kithra-muted uppercase block">
                Mobile Number (+91 India)
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2.5 rounded-xl bg-[var(--bg-main)] border border-kithra font-data text-xs text-kithra font-bold">
                  +91
                </span>
                <input 
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-kithra text-xs font-data text-kithra focus:outline-none focus:border-[var(--accent-sage)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0D9488] hover:bg-[#0B7C72] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Send OTP Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setStep('admin')}
                className="font-data text-[11px] text-kithra-muted hover:text-[var(--gold-verify)] underline"
              >
                Mission Control Admin Login →
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-xl text-kithra">
                Enter Verification Code
              </h2>
              <p className="text-xs text-kithra-muted">
                Sent to +91 {mobileNumber}. (Test code: <span className="font-data font-bold text-kithra">123456</span>)
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-data text-xs text-kithra-muted uppercase block">
                6-Digit OTP
              </label>
              <input 
                type="text"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-kithra text-center font-data text-lg tracking-widest text-kithra focus:outline-none focus:border-[var(--accent-sage)]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0D9488] hover:bg-[#0B7C72] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Verify & Continue</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 3: Create Username */}
        {step === 'username' && (
          <form onSubmit={handleCompleteUsername} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-xl text-kithra">
                Create Unique Handle
              </h2>
              <p className="text-xs text-kithra-muted">
                Your handle is used for Signal encrypted compatibility requests.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-data text-xs text-kithra-muted uppercase block">
                Username Handle
              </label>
              <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-kithra font-data text-xs text-kithra">
                <span className="text-[var(--accent-sage)] font-bold">@</span>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="ananya_sharma"
                  className="flex-1 bg-transparent focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0D9488] hover:bg-[#0B7C72] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Complete Setup & Enter Kithra</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Admin Login Backdoor */}
        {step === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-xl text-kithra flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--gold-verify)]" />
                <span>Mission Control Admin Access</span>
              </h2>
              <p className="text-xs text-kithra-muted">
                Admin credentials verification route.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-data text-xs text-kithra-muted uppercase block">
                Master Security Password
              </label>
              <input 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin key..."
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-main)] border border-kithra text-xs font-data text-kithra focus:outline-none focus:border-[var(--gold-verify)]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--gold-verify)] text-white font-heading font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Authenticate Mission Control</span>
            </button>

            <button
              type="button"
              onClick={() => setStep('mobile')}
              className="w-full text-center font-data text-xs text-kithra-muted pt-2"
            >
              ← Back to Mobile OTP
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
