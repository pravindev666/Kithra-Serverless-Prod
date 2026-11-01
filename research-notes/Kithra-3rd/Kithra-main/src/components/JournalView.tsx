import React, { useState } from 'react';
import {
  Check,
  MapPin,
  MessageSquare,
  Plus,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { ActiveTab, CommunityCircle, RelationshipMode } from '../types';
import { INITIAL_CIRCLES } from '../data/mockMatches';
import { useToast } from './ToastProvider';

interface JournalViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  activeRelationshipMode?: RelationshipMode;
}

/**
 * Circles & Small-Group Communities View (MEM-022..024):
 * Mode-scoped small groups (max 35 members) with mandatory Community Rules acceptance gate,
 * group discussion feed, and Create Circle modal.
 */
export const JournalView: React.FC<JournalViewProps> = ({
  activeRelationshipMode = 'friendship',
}) => {
  const { addToast } = useToast();
  const [circles, setCircles] = useState<CommunityCircle[]>(INITIAL_CIRCLES);
  const [selectedCircleId, setSelectedCircleId] = useState<string>('cir-1');
  const [rulesGateModalCircle, setRulesGateModalCircle] = useState<CommunityCircle | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleCity, setNewCircleCity] = useState('Bengaluru · Indiranagar');
  const [newCircleTopic, setNewCircleTopic] = useState('Books, Architecture & Slow Walks');
  const [groupDraftMsg, setGroupDraftMsg] = useState('');

  const selectedCircle =
    circles.find((c) => c.id === selectedCircleId) || circles[0];

  const handleJoinCircleAfterRules = (circleId: string) => {
    setCircles((prev) =>
      prev.map((c) =>
        c.id === circleId
          ? { ...c, joined: true, rulesAccepted: true, memberCount: c.memberCount + 1 }
          : c
      )
    );
    setSelectedCircleId(circleId);
    setRulesGateModalCircle(null);
    addToast('Community Charter accepted. You have joined the Circle.', 'success');
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCircleName.trim()) return;
    const created: CommunityCircle = {
      id: `cir-${Date.now()}`,
      name: newCircleName.trim(),
      mode: activeRelationshipMode,
      city: newCircleCity,
      topic: newCircleTopic,
      memberCount: 1,
      maxCapacity: 30,
      nextGatheringLabel: 'Sat, 11:00 AM · Host-scheduled',
      rulesAccepted: true,
      joined: true,
      hostName: 'Aarav M. (You)',
      description: `Member-hosted ${activeRelationshipMode} circle governed by Kithra’s zero-pressure community charter.`,
      messages: [
        {
          id: `cm-${Date.now()}`,
          author: 'Aarav M. (You)',
          text: `Welcome to ${newCircleName.trim()}! Feel free to introduce yourself and share what you are reading or working on.`,
          timestamp: 'Just now',
        },
      ],
    };
    setCircles((prev) => [created, ...prev]);
    setSelectedCircleId(created.id);
    setNewCircleName('');
    setCreateModalOpen(false);
    addToast(`Created Circle "${created.name}" in ${activeRelationshipMode} mode.`, 'success');
  };

  const handleSendGroupMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupDraftMsg.trim()) return;
    setCircles((prev) =>
      prev.map((c) =>
        c.id === selectedCircle.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `cm-${Date.now()}`,
                  author: 'Aarav M. (You)',
                  text: groupDraftMsg.trim(),
                  timestamp: 'Just now',
                },
              ],
            }
          : c
      )
    );
    setGroupDraftMsg('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-primary)]">
            <Users className="w-3.5 h-3.5" />
            <span>MEM-022..024 · Mode-Scoped Community Circles</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-semibold">
            Small-Group Circles &amp; Topic Tables
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Intimate groups capped at 35 members. Joining any Circle requires accepting its
            mode-specific Community Rules gate.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Create Circle (MEM-024)</span>
        </button>
      </div>

      {/* Circles Grid + Active Circle Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Circle Cards */}
        <div className="lg:col-span-5 space-y-3">
          {circles.map((cir) => {
            const isSelected = cir.id === selectedCircle.id;
            return (
              <div
                key={cir.id}
                onClick={() => setSelectedCircleId(cir.id)}
                className={`cursor-pointer rounded-3xl border p-5 space-y-3 transition-all ${
                  isSelected
                    ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)] shadow-xs'
                    : 'bg-[var(--bg-elevated)]/70 border-[var(--border-subtle)] hover:border-[var(--border-default)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]">
                    {cir.mode} circle
                  </span>
                  <span className="text-[11px] font-mono text-[var(--text-muted)]">
                    {cir.memberCount}/{cir.maxCapacity} members
                  </span>
                </div>
                <h2 className="font-heading text-lg font-semibold">{cir.name}</h2>
                <p className="text-xs text-[var(--text-secondary)]">{cir.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{cir.city}</span>
                  </span>
                  {cir.joined ? (
                    <span className="font-mono text-[var(--accent-primary)] font-semibold">
                      ✓ Joined
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRulesGateModalCircle(cir);
                      }}
                      className="px-3 py-1 rounded-lg bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-semibold"
                    >
                      Review Rules &amp; Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 7 Cols: Active Circle Feed & Charter */}
        <div className="lg:col-span-7 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-xs font-mono text-[var(--accent-primary)]">
                  Hosted by {selectedCircle.hostName} · {selectedCircle.topic}
                </span>
                <h2 className="font-heading text-2xl font-semibold">{selectedCircle.name}</h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Next Gathering: {selectedCircle.nextGatheringLabel}
                </p>
              </div>
              {selectedCircle.joined ? (
                <button
                  type="button"
                  onClick={() => {
                    setCircles((prev) =>
                      prev.map((c) =>
                        c.id === selectedCircle.id ? { ...c, joined: false } : c
                      )
                    );
                    addToast(`Left "${selectedCircle.name}" in 0ms.`, 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[var(--border-default)] text-xs text-[var(--text-secondary)]"
                >
                  Leave Circle (0ms)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setRulesGateModalCircle(selectedCircle)}
                  className="px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
                >
                  Accept Rules to Join Circle
                </button>
              )}
            </div>

            {/* Circle Discussion Feed */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {selectedCircle.messages.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-[var(--text-primary)]">{m.author}</strong>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {m.timestamp}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedCircle.joined ? (
            <form onSubmit={handleSendGroupMessage} className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <input
                type="text"
                placeholder={`Post a note to ${selectedCircle.name}...`}
                value={groupDraftMsg}
                onChange={(e) => setGroupDraftMsg(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs sm:text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
              >
                Post Note
              </button>
            </form>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] flex items-center justify-between">
              <span>Accept the Circle Community Rules to participate in this discussion thread.</span>
              <button
                type="button"
                onClick={() => setRulesGateModalCircle(selectedCircle)}
                className="font-semibold text-[var(--accent-primary)] underline ml-2"
              >
                Review Rules →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Community Rules Gate Modal (MEM-023) */}
      {rulesGateModalCircle && (
        <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-heading text-xl font-semibold">
                Circle Community Charter ({rulesGateModalCircle.mode.toUpperCase()})
              </h3>
              <button
                type="button"
                onClick={() => setRulesGateModalCircle(null)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>
                  Respect the explicit mode boundary ({rulesGateModalCircle.mode})—never use a
                  Circle thread for unsolicited DMs or off-mode solicitation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>
                  Never share another member&apos;s attendance, photos, or stories outside the
                  Circle.
                </span>
              </li>
            </ul>
            <button
              type="button"
              onClick={() => handleJoinCircleAfterRules(rulesGateModalCircle.id)}
              className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              I Agree to the Charter — Join Circle
            </button>
          </div>
        </div>
      )}

      {/* Create Circle Modal (MEM-024) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <form
            onSubmit={handleCreateCircle}
            className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
              <h3 className="font-heading text-xl font-semibold">
                Create a {activeRelationshipMode} Circle (MEM-024)
              </h3>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Circle Name
              </label>
              <input
                type="text"
                placeholder="e.g., Cubbon Park Sunday Sketchbook Walk"
                value={newCircleName}
                onChange={(e) => setNewCircleName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                City / Neighbourhood
              </label>
              <input
                type="text"
                value={newCircleCity}
                onChange={(e) => setNewCircleCity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Primary Topic
              </label>
              <input
                type="text"
                value={newCircleTopic}
                onChange={(e) => setNewCircleTopic(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              Publish Circle in {activeRelationshipMode.toUpperCase()} Mode
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
