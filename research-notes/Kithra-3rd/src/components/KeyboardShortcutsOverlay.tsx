import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home,
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
  Search,
  Moon
} from 'lucide-react';

interface KeyboardShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsOverlay: React.FC<KeyboardShortcutsOverlayProps> = ({
  isOpen,
  onClose
}) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const sections = [
    {
      title: 'Navigation',
      shortcuts: [
        { keys: ['G', 'H'], label: 'Go to Home', icon: Home },
        { keys: ['G', 'A'], label: 'Go to Assessment', icon: Brain },
        { keys: ['G', 'R'], label: 'Go to Report', icon: Heart },
        { keys: ['G', 'M'], label: 'Go to Matches', icon: Users },
        { keys: ['G', 'C'], label: 'Go to Messages', icon: MessageSquare },
        { keys: ['G', 'J'], label: 'Go to Journal', icon: BookOpen },
        { keys: ['G', 'I'], label: 'Go to Insights', icon: BarChart3 },
      ]
    },
    {
      title: 'Account',
      shortcuts: [
        { keys: ['G', 'P'], label: 'Go to Profile', icon: User },
        { keys: ['G', 'S'], label: 'Go to Settings', icon: Settings },
        { keys: ['G', 'B'], label: 'Go to Billing', icon: CreditCard },
        { keys: ['G', 'X'], label: 'Go to Security', icon: ShieldCheck },
      ]
    },
    {
      title: 'Global',
      shortcuts: [
        { keys: ['⌘', 'K'], label: 'Command Palette', icon: Search },
        { keys: ['?'], label: 'Keyboard Shortcuts', icon: Settings },
        { keys: ['D'], label: 'Toggle Dark Mode', icon: Moon },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={onClose} 
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="relative w-full max-w-lg bg-[var(--surface-main)] border border-kithra rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-kithra/30">
              <h2 className="font-heading font-bold text-base text-kithra">Keyboard Shortcuts</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg text-kithra-muted hover:text-kithra hover:bg-[var(--bg-main)] transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcut Groups */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-data text-[10px] uppercase tracking-wider text-kithra-muted font-bold mb-3">{section.title}</h3>
                  <div className="space-y-1.5">
                    {section.shortcuts.map((shortcut) => {
                      const IconComp = shortcut.icon;
                      return (
                        <div key={shortcut.label} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[var(--bg-main)] transition-colors">
                          <div className="flex items-center gap-3">
                            <IconComp className="w-3.5 h-3.5 text-kithra-muted" />
                            <span className="font-body text-xs text-kithra">{shortcut.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <span className="text-kithra-muted text-[10px] mx-0.5">then</span>}
                                <kbd className="px-2 py-1 rounded-lg border border-kithra/30 bg-[var(--bg-main)] font-data text-[10px] font-bold text-kithra-muted shadow-sm min-w-[24px] text-center">
                                  {key}
                                </kbd>
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-[var(--bg-main)] border-t border-kithra/20 flex items-center justify-between">
              <span className="font-data text-[10px] text-kithra-muted">Press <kbd className="px-1.5 py-0.5 mx-1 rounded border border-kithra/30 bg-[var(--surface-main)] font-bold">?</kbd> to toggle</span>
              <span className="font-data text-[10px] text-kithra-muted">
                <kbd className="px-1.5 py-0.5 mx-1 rounded border border-kithra/30 bg-[var(--surface-main)] font-bold">ESC</kbd> to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
