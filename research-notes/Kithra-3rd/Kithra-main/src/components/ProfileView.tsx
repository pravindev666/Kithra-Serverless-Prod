import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
} from 'lucide-react';
import {
  ActiveTab,
  MemberPhoto,
  ModeEnrollmentState,
  PhotoVisibilityScope,
  RelationshipMode,
} from '../types';
import { INITIAL_MEMBER_PHOTOS } from '../data/mockMatches';
import { useToast } from './ToastProvider';

interface ProfileViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  activeRelationshipMode?: RelationshipMode;
  modeEnrollments?: Record<RelationshipMode, ModeEnrollmentState>;
  onUpdateModeBio?: (mode: RelationshipMode, bio: string, intentSummary: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  activeRelationshipMode = 'dating',
  modeEnrollments,
  onUpdateModeBio,
}) => {
  const { addToast } = useToast();

  const [selectedModeTab, setSelectedModeTab] = useState<RelationshipMode>(activeRelationshipMode);
  const [photos, setPhotos] = useState<MemberPhoto[]>(INITIAL_MEMBER_PHOTOS);
  const [noPhotoMonogramMode, setNoPhotoMonogramMode] = useState(false);
  const [uploadPipelineStage, setUploadPipelineStage] = useState<
    'idle' | 'uploading' | 'exif_scrub' | 'moderation_hold' | 'approved'
  >('idle');

  const [biosByMode, setBiosByMode] = useState<
    Record<RelationshipMode, { bio: string; intent: string }>
  >({
    friendship: {
      bio: modeEnrollments?.friendship.bio || 'Saturday bookstore walks, Cubbon Park cycling loops, and small filter-coffee essay circles.',
      intent: modeEnrollments?.friendship.intentSummary || 'Platonic creative friends & neighbourhood circles',
    },
    dating: {
      bio: modeEnrollments?.dating.bio || 'Urban transit architect looking for an unhurried, thoughtful relationship grounded in calm evening repair.',
      intent: modeEnrollments?.dating.intentSummary || 'Intentional long-term partnership',
    },
    matrimony: {
      bio: modeEnrollments?.matrimony.bio || 'Exploring an egalitarian life partnership where dual careers, shared domestic care, and warm family boundaries align.',
      intent: modeEnrollments?.matrimony.intentSummary || 'Adult-led marriage & shared household',
    },
  });

  const handleVisibilityChange = (
    photoId: string,
    mode: RelationshipMode,
    scope: PhotoVisibilityScope
  ) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? {
              ...p,
              visibilityByMode: {
                ...p.visibilityByMode,
                [mode]: scope,
              },
            }
          : p
      )
    );
    addToast(`Updated photo ACL for ${mode.toUpperCase()} mode to "${scope}".`, 'info');
  };

  const simulatePhotoUploadPipeline = () => {
    setUploadPipelineStage('uploading');
    setTimeout(() => setUploadPipelineStage('exif_scrub'), 350);
    setTimeout(() => setUploadPipelineStage('moderation_hold'), 750);
    setTimeout(() => {
      setUploadPipelineStage('approved');
      const newPhoto: MemberPhoto = {
        id: `ph-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        caption: 'Newly uploaded 4:5 portrait (EXIF GPS scrubbed)',
        aspectRatio: '4:5',
        moderationStatus: 'approved',
        exifStripped: true,
        blurUntilApproved: true,
        visibilityByMode: {
          friendship: 'public',
          dating: 'matches_only',
          matrimony: 'hidden',
        },
      };
      setPhotos((prev) => [...prev, newPhoto]);
      addToast('4:5 portrait uploaded, EXIF GPS stripped, and per-mode ACLs applied.', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Section 1: Per-Mode Persona & Bio Editor (MEM-005 / MEM-025) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
              MEM-005 · Per-Mode Persona &amp; Bio Isolation
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold">
              Aarav Mehta, 29 · Indiranagar, Bengaluru
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Edit how you introduce yourself in each relationship mode separately.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] self-start">
            {(['friendship', 'dating', 'matrimony'] as RelationshipMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedModeTab(m)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                  selectedModeTab === m
                    ? 'bg-[var(--accent-primary)] text-[var(--text-on-accent)]'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {m} Bio
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              {selectedModeTab.toUpperCase()} Mode Bio (Shown only in {selectedModeTab} pool)
            </label>
            <textarea
              rows={3}
              value={biosByMode[selectedModeTab].bio}
              onChange={(e) =>
                setBiosByMode((prev) => ({
                  ...prev,
                  [selectedModeTab]: { ...prev[selectedModeTab], bio: e.target.value },
                }))
              }
              className="w-full p-3.5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs sm:text-sm"
            />
          </div>
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                {selectedModeTab.toUpperCase()} Intent Summary
              </label>
              <input
                type="text"
                value={biosByMode[selectedModeTab].intent}
                onChange={(e) =>
                  setBiosByMode((prev) => ({
                    ...prev,
                    [selectedModeTab]: { ...prev[selectedModeTab], intent: e.target.value },
                  }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] text-xs sm:text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (onUpdateModeBio) {
                  onUpdateModeBio(
                    selectedModeTab,
                    biosByMode[selectedModeTab].bio,
                    biosByMode[selectedModeTab].intent
                  );
                }
                addToast(`Saved isolated bio for ${selectedModeTab.toUpperCase()} mode.`, 'success');
              }}
              className="self-end px-5 py-2.5 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              Save {selectedModeTab} Bio
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: 4:5 Photo Gallery & Per-Photo Mode Visibility Matrix (04B_AUTH_PHOTO_AND_ERRORS_RD) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[var(--accent-primary)]">
              MEM-006..007 · 4:5 Portrait Pipeline &amp; Per-Mode Photo ACL Matrix
            </span>
            <h2 className="font-heading text-2xl font-semibold">
              Control which mode sees which photo
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Every uploaded portrait has EXIF/GPS metadata stripped automatically and obeys
              independent visibility rules per mode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={noPhotoMonogramMode}
                onChange={(e) => setNoPhotoMonogramMode(e.target.checked)}
                className="accent-[var(--accent-primary)]"
              />
              <span>No-Photo Monogram Avatar Mode</span>
            </label>

            <button
              type="button"
              onClick={simulatePhotoUploadPipeline}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] text-xs font-semibold"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload 4:5 Portrait</span>
            </button>
          </div>
        </div>

        {/* Upload Pipeline Progress Indicator */}
        {uploadPipelineStage !== 'idle' && (
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span>
              Pipeline Status:{' '}
              <strong className="text-[var(--accent-primary)] uppercase">
                {uploadPipelineStage.replace('_', ' ')}
              </strong>
            </span>
            <span>1. Pre-Signed URL &rarr; 2. EXIF GPS Strip &rarr; 3. Safety Scan &rarr; 4. ACL Ready</span>
          </div>
        )}

        {noPhotoMonogramMode ? (
          <div className="p-8 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-3">
            <div className="w-20 h-20 rounded-3xl bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-heading text-3xl flex items-center justify-center font-semibold">
              AM
            </div>
            <h3 className="font-heading text-lg font-semibold">
              Warm Monogram Mode Enabled
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-md">
              All portraits are hidden across Friendship, Dating, and Matrimony. Candidates see your
              editorial monogram and agreement patterns until you choose to reveal photos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-subtle)] overflow-hidden flex flex-col justify-between"
              >
                <div className="aspect-[4/5] relative bg-black/10">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className={`w-full h-full object-cover ${
                      photo.blurUntilApproved ? 'blur-[2px]' : ''
                    }`}
                  />
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                      4:5 · EXIF Stripped
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-900/85 text-emerald-100 text-[10px] font-mono">
                      {photo.moderationStatus}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs font-medium text-[var(--text-primary)]">{photo.caption}</p>

                  {/* Per-Mode ACL Selectors */}
                  <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                    {(['friendship', 'dating', 'matrimony'] as RelationshipMode[]).map((m) => (
                      <div key={m} className="flex items-center justify-between text-xs">
                        <span className="font-mono capitalize text-[var(--text-secondary)]">
                          {m}:
                        </span>
                        <select
                          aria-label={`${m} visibility for ${photo.caption}`}
                          value={photo.visibilityByMode[m]}
                          onChange={(e) =>
                            handleVisibilityChange(
                              photo.id,
                              m,
                              e.target.value as PhotoVisibilityScope
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[11px] font-mono"
                        >
                          <option value="public">Public in Mode</option>
                          <option value="matches_only">Connected Matches Only</option>
                          <option value="hidden">Hidden in Mode</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Honest Verification Status (MEM-039 & Decision D-12) */}
      <div className="rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-default)] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[var(--accent-primary)]">
            <ShieldCheck className="w-4 h-4" />
            <span>MEM-039 · Honest Account Verification Status (Decision D-12)</span>
          </div>
          <h3 className="font-heading text-lg font-semibold">
            Email &amp; Active Session Verified · Optional Selfie Check Modular
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl">
            Per Decision D-12, Kithra never claims government ID or DigiLocker verification unless a
            live contracted KYC provider is enabled. Your email and device session are verified.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-[var(--state-success-bg)] text-[var(--state-success)] text-xs font-mono font-semibold shrink-0">
          ✓ Email &amp; 18+ Gate Verified
        </span>
      </div>
    </div>
  );
};
