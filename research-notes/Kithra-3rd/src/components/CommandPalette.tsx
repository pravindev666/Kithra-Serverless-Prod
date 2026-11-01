import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Brain, 
  Heart, 
  Users, 
  MessageSquare, 
  BookOpen, 
  BarChart3, 
  User, 
  Settings, 
  ShieldCheck, 
  CreditCard, 
  Moon, 
  Sun, 
  ArrowRight,
  Command,
  X
} from 'lucide-react';
import { ActiveTab } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
}) => {
  const [query, setQuery] = useState('');

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'assessment', title: 'Continue Assessment', category: 'Navigation', icon: Brain, action: () => { setActiveTab('assessment'); onClose(); } },
    { id: 'matches', title: 'View Verified Matches', category: 'Navigation', icon: Users, action: () => { setActiveTab('matches'); onClose(); } },
    { id: 'messages', title: 'Open Encrypted Messages', category: 'Navigation', icon: MessageSquare, action: () => { setActiveTab('messages'); onClose(); } },
    { id: 'report', title: 'Psychometric Report', category: 'Navigation', icon: Heart, action: () => { setActiveTab('report'); onClose(); } },
    { id: 'journal', title: 'Personal Journal', category: 'Navigation', icon: BookOpen, action: () => { setActiveTab('journal'); onClose(); } },
    { id: 'insights', title: 'Growth Insights & Trends', category: 'Navigation', icon: BarChart3, action: () => { setActiveTab('insights'); onClose(); } },
    { id: 'profile', title: 'View Profile', category: 'Account', icon: User, action: () => { setActiveTab('profile'); onClose(); } },
    { id: 'billing', title: 'Subscription & Billing', category: 'Account', icon: CreditCard, action: () => { setActiveTab('billing'); onClose(); } },
    { id: 'security', title: 'Security & DPDP Center', category: 'Account', icon: ShieldCheck, action: () => { setActiveTab('security'); onClose(); } },
    { id: 'settings', title: 'System Settings', category: 'System', icon: Settings, action: () => { setActiveTab('settings'); onClose(); } },
    { id: 'theme', title: isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme', category: 'Preferences', icon: isDarkMode ? Sun : Moon, action: () => { setIsDarkMode(!isDarkMode); onClose(); } },
  ];

  const filteredActions = query.trim() === '' 
    ? actions 
    : actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
        
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-xl bg-[var(--surface-main)] border border-kithra shadow-2xl rounded-2xl overflow-hidden z-10"
        >
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-kithra/30 gap-3">
            <Search className="w-5 h-5 text-kithra-muted shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-heading text-sm text-kithra placeholder-kithra-muted outline-none"
            />
            <button onClick={onClose} className="p-1 text-kithra-muted hover:text-kithra rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center text-kithra-muted font-body text-xs">
                No commands found for "{query}"
              </div>
            ) : (
              filteredActions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[var(--accent-sage)]/10 text-left transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[var(--bg-main)] text-[var(--accent-sage)] border border-kithra/20 group-hover:border-[var(--accent-sage)]/30">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-heading font-semibold text-xs text-kithra block">{item.title}</span>
                        <span className="font-data text-[10px] text-kithra-muted uppercase tracking-wider">{item.category}</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-kithra-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts hint */}
          <div className="p-3 bg-[var(--bg-main)] border-t border-kithra/20 flex items-center justify-between font-data text-[10px] text-kithra-muted">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded border border-kithra/40 bg-[var(--surface-main)]">ESC</span>
              <span>to close</span>
            </div>
            <div className="flex items-center gap-1">
              <Command className="w-3 h-3" />
              <span>+ K Command Palette</span>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
