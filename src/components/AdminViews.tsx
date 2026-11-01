import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ShieldAlert, KeyRound, X } from 'lucide-react';
import {
  AdminTab,
  AuditLogEntry,
  CommunityCircle,
  MemberProfile,
  PhotoModerationItem,
  StaffCase,
} from '../types/kithra';
import { filterStaffCases } from '../utils/kithraLogic';
import { EditorialImage } from './EditorialImage';
import { EditorialVariant } from '../utils/editorialMedia';

interface AdminLoginViewProps {
  onNavigatePath: (path: string) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onNavigatePath }) => {
  const [staffEmail, setStaffEmail] = useState('');
  const [attemptNotice, setAttemptNotice] = useState<string | null>(null);

  const handleAttemptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptNotice(
      'Staff authentication is disabled in this frontend shell pending AGY WebAuthn hardware-key and RBAC backend integration. No privileged session can be created from the browser.'
    );
  };

  return (
    <section className="py-10 md:py-16 max-w-[540px] mx-auto font-sans-ui">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[18px] p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-3 p-4 rounded-[12px] bg-[var(--surface2)] border border-[var(--ochre)] mb-6">
          <ShieldAlert
            className="w-5 h-5 text-[var(--ochre-text)] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
            <p className="font-bold text-[var(--heading)]">
              Staff authentication non-functional pending AGY backend
            </p>
            <p className="mt-1 text-[var(--muted)]">
              This `/admin/login` gate is an unprivileged frontend contract. Hardware WebAuthn MFA, role-based access control, and audit logging require AGY server enforcement.
            </p>
          </div>
        </div>

        <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
          Restricted Staff Route · /admin/login
        </p>
        <h1
          tabIndex={-1}
          className="text-[28px] sm:text-[32px] font-bold tracking-tight text-[var(--heading)] mt-1 outline-none"
        >
          Kithra Staff Sign-In
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
          Production staff access requires an `@kithra.in` operational identity and a registered FIDO2 / WebAuthn security key.
        </p>

        <form onSubmit={handleAttemptSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-login-email"
              className="block text-xs font-bold text-[var(--heading)] mb-1.5"
            >
              Staff operational email
            </label>
            <input
              id="admin-login-email"
              type="email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              placeholder="reviewer@kithra.in"
              className="w-full min-h-[44px] rounded-[10px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3.5 text-sm"
            />
          </div>

          <div className="p-3.5 rounded-[10px] border border-[var(--line)] bg-[var(--bg)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <KeyRound className="w-4 h-4 text-[var(--muted)] shrink-0" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--heading)]">
                WebAuthn security key challenge
              </span>
            </div>
            <span className="text-[11px] font-bold text-[var(--ochre-text)]">
              Awaiting AGY RP endpoint
            </span>
          </div>

          {attemptNotice && (
            <div
              role="alert"
              className="p-3.5 rounded-[10px] border border-[var(--danger)] bg-[var(--surface2)] text-xs font-semibold text-[var(--heading)] leading-relaxed"
            >
              {attemptNotice}
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--on-primary)] font-bold text-sm px-4 py-2.5 cursor-pointer hover:brightness-105 transition-all"
          >
            Verify hardware key (Disabled pending AGY)
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigatePath('/admin/overview')}
            className="min-h-[44px] rounded-[9px] border border-[var(--line)] bg-[var(--surface2)] hover:bg-[var(--surface)] text-[var(--heading)] px-3.5 py-2 text-xs font-bold cursor-pointer"
          >
            Inspect simulated staff workspace UI →
          </button>
          <button
            type="button"
            onClick={() => onNavigatePath('/')}
            className="min-h-[44px] text-xs font-semibold text-[var(--muted)] hover:text-[var(--heading)] underline cursor-pointer px-2"
          >
            Return to consumer home
          </button>
        </div>
      </div>
    </section>
  );
};

interface AdminShellProps {
  activeTab: AdminTab;
  onNavigateAdminPath: (path: string) => void;
  cases: StaffCase[];
  onUpdateCases: React.Dispatch<React.SetStateAction<StaffCase[]>>;
  photoReviews: PhotoModerationItem[];
  onUpdatePhotoReviews: React.Dispatch<React.SetStateAction<PhotoModerationItem[]>>;
  auditLog: AuditLogEntry[];
  onAppendAudit: (action: string, target: string, detail: string) => void;
  profiles: MemberProfile[];
  circles: CommunityCircle[];
}

const ADMIN_NAV_ITEMS: { id: AdminTab; label: string; path: string }[] = [
  { id: 'overview', label: 'Overview', path: '/admin/overview' },
  { id: 'reports', label: 'Reports & safety', path: '/admin/reports' },
  { id: 'photos', label: 'Photo review', path: '/admin/photos' },
  { id: 'users', label: 'Users', path: '/admin/users' },
  { id: 'groups', label: 'Groups', path: '/admin/groups' },
  { id: 'support', label: 'Support', path: '/admin/support' },
  { id: 'subscriptions', label: 'Subscriptions', path: '/admin/subscriptions' },
  { id: 'privacy', label: 'Privacy', path: '/admin/privacy' },
  { id: 'staff', label: 'Staff & roles', path: '/admin/staff' },
  { id: 'audit', label: 'Audit trail', path: '/admin/audit' },
];

export const AdminShell: React.FC<AdminShellProps> = ({
  activeTab,
  onNavigateAdminPath,
  cases,
  onUpdateCases,
  photoReviews,
  onUpdatePhotoReviews,
  auditLog,
  onAppendAudit,
  profiles,
  circles,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Normal'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | StaffCase['status']>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showQueueFilters, setShowQueueFilters] = useState<boolean>(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [drawerNote, setDrawerNote] = useState<string>('');
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    window.setTimeout(() => {
      setAdminToast((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  useEffect(() => {
    if (!selectedCaseId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCaseId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCaseId]);

  const filteredCases = filterStaffCases(cases, {
    priority: priorityFilter,
    status: statusFilter,
    query: searchQuery,
  });

  const activeCase = cases.find((c) => c.id === selectedCaseId) ?? null;

  const handleUpdateCaseStatus = (caseId: string, nextStatus: StaffCase['status']) => {
    onUpdateCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: nextStatus } : c))
    );
    onAppendAudit(
      'Updated mock case status',
      `Case ${caseId}`,
      `Changed status to "${nextStatus}" in frontend preview.`
    );
    triggerToast(`Case ${caseId} marked "${nextStatus}" (Mock preview state).`);
  };

  const handleAddCaseNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !drawerNote.trim()) return;
    const noteText = drawerNote.trim();
    onUpdateCases((prev) =>
      prev.map((c) =>
        c.id === activeCase.id ? { ...c, notes: [...c.notes, noteText] } : c
      )
    );
    onAppendAudit('Added sample triage note', `Case ${activeCase.id}`, noteText);
    setDrawerNote('');
    triggerToast(`Added sample note to ${activeCase.id}.`);
  };

  const handlePhotoReviewAction = (
    itemId: string,
    nextStatus: PhotoModerationItem['status']
  ) => {
    onUpdatePhotoReviews((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: nextStatus } : item))
    );
    onAppendAudit(
      'Reviewed sample photo item',
      `Photo ${itemId}`,
      `Set review state to "${nextStatus}" (Preview only).`
    );
    triggerToast(`Photo ${itemId} marked "${nextStatus}".`);
  };

  return (
    <div className="py-7 md:py-9 min-h-[640px] font-sans-ui">
      {/* Unprivileged Staff Preview Banner */}
      <div className="mb-5 rounded-[12px] bg-[var(--surface2)] border border-[var(--ochre)] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[var(--heading)]">
          <ShieldAlert className="w-4 h-4 text-[var(--ochre-text)] shrink-0" aria-hidden="true" />
          <span>
            <strong>Simulated Staff Workspace (Unauthenticated UI Spec):</strong> No real member records, MFA session, or moderation mutations are connected.
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigateAdminPath('/admin/login')}
          className="text-xs font-bold text-[var(--ochre-text)] hover:underline whitespace-nowrap cursor-pointer self-start sm:self-auto"
        >
          View /admin/login gate →
        </button>
      </div>

      {adminToast && (
        <div
          role="status"
          className="mb-5 rounded-[10px] bg-[var(--surface)] border border-[var(--ochre)] px-4 py-3 text-xs sm:text-sm font-semibold text-[var(--heading)] flex items-center justify-between gap-3"
        >
          <span>{adminToast}</span>
          <button
            type="button"
            onClick={() => setAdminToast(null)}
            aria-label="Dismiss staff notification"
            className="text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[225px_1fr] gap-6 items-start">
        {/* STAFF SIDEBAR */}
        <aside
          aria-label="Staff navigation"
          className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-2.5 lg:p-4 flex lg:flex-col gap-1 overflow-x-auto"
        >
          <div className="hidden lg:block px-2.5 pt-1 pb-4 text-[18px] font-bold tracking-tight text-[var(--heading)]">
            Kithra Staff
          </div>
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateAdminPath(item.path)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-left px-3 py-2.5 min-h-[44px] rounded-[9px] text-[13px] transition-colors cursor-pointer whitespace-nowrap shrink-0 lg:w-full ${
                  isActive
                    ? 'bg-[var(--surface2)] text-[var(--heading)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface2)]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* STAFF MAIN WORKSPACE (DM Sans operational typography) */}
        <div className="min-w-0">
          {(activeTab === 'overview' || activeTab === 'reports') && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                    Staff interface · Mock data
                  </p>
                  <h1
                    tabIndex={-1}
                    className="font-sans-ui text-[28px] sm:text-[32px] font-bold tracking-tight text-[var(--heading)] mt-1 outline-none"
                  >
                    {activeTab === 'overview' ? 'Reports overview.' : 'Reports & safety queue.'}
                  </h1>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    A calm operational workspace for safety and support. Click any case row to open the triage drawer.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQueueFilters((prev) => !prev)}
                  aria-expanded={showQueueFilters}
                  className="inline-flex items-center gap-1.5 min-h-[44px] rounded-[9px] border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface2)] text-[var(--heading)] px-3.5 py-2.5 text-xs font-bold cursor-pointer self-start whitespace-nowrap"
                >
                  <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Queue filters ▾</span>
                </button>
              </div>

              {showQueueFilters && (
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[13px] p-4 mb-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor="staff-priority-filter"
                      className="block text-xs font-bold text-[var(--heading)] mb-1"
                    >
                      Priority
                    </label>
                    <select
                      id="staff-priority-filter"
                      value={priorityFilter}
                      onChange={(e) =>
                        setPriorityFilter(e.target.value as 'All' | 'High' | 'Normal')
                      }
                      className="w-full min-h-[42px] rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-2.5 text-xs"
                    >
                      <option value="All">All priorities</option>
                      <option value="High">High priority</option>
                      <option value="Normal">Normal priority</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="staff-status-filter"
                      className="block text-xs font-bold text-[var(--heading)] mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="staff-status-filter"
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(e.target.value as 'All' | StaffCase['status'])
                      }
                      className="w-full min-h-[42px] rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-2.5 text-xs"
                    >
                      <option value="All">All statuses</option>
                      <option value="Awaiting review">Awaiting review</option>
                      <option value="In queue">In queue</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Resolved (Preview)">Resolved (Preview)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="staff-case-search"
                      className="block text-xs font-bold text-[var(--heading)] mb-1"
                    >
                      Case ID or category
                    </label>
                    <input
                      id="staff-case-search"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. K-101, impersonation..."
                      className="w-full min-h-[42px] rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-2.5 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Operational Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5">
                  <strong className="block text-[32px] leading-none font-bold text-[var(--heading)] tabular-nums">
                    12
                  </strong>
                  <p className="text-xs sm:text-sm text-[var(--muted)] mt-2">
                    Sample open reports
                  </p>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5">
                  <strong className="block text-[32px] leading-none font-bold text-[var(--heading)] tabular-nums">
                    {photoReviews.filter((p) => p.status === 'Awaiting review').length + 2}
                  </strong>
                  <p className="text-xs sm:text-sm text-[var(--muted)] mt-2">Photo reviews</p>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5">
                  <strong className="block text-[32px] leading-none font-bold text-[var(--heading)] tabular-nums">
                    3
                  </strong>
                  <p className="text-xs sm:text-sm text-[var(--muted)] mt-2">
                    Support requests
                  </p>
                </div>
              </div>

              {/* Case Triage Table */}
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[var(--surface2)] text-[var(--muted)] text-left">
                      <th className="p-3.5 font-bold">Case</th>
                      <th className="p-3.5 font-bold">Category</th>
                      <th className="p-3.5 font-bold">Priority</th>
                      <th className="p-3.5 font-bold">Status</th>
                      <th className="p-3.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCases.map((c) => (
                      <tr
                        key={c.id}
                        className="border-t border-[var(--line)] hover:bg-[var(--surface2)]/40 transition-colors"
                      >
                        <td className="p-3.5 font-bold text-[var(--heading)] tabular-nums">
                          {c.id}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-[var(--heading)] block">
                            {c.category}
                          </span>
                          <span className="text-xs text-[var(--muted)]">
                            {c.reportedContext}
                          </span>
                        </td>
                        <td
                          className={`p-3.5 font-bold ${
                            c.priority === 'High'
                              ? 'text-[var(--danger)]'
                              : 'text-[var(--text)]'
                          }`}
                        >
                          {c.priority}
                        </td>
                        <td className="p-3.5 text-[var(--text)]">{c.status}</td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedCaseId(c.id)}
                            className="min-h-[38px] rounded-[7px] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--heading)] hover:bg-[var(--surface2)] cursor-pointer whitespace-nowrap"
                          >
                            Inspect case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[var(--muted)] mt-3">
                This is visual sample data; no real cases, MFA, roles, moderation or audit logging are active until AGY backend integration.
              </p>
            </div>
          )}

          {/* TAB: PHOTO REVIEW */}
          {activeTab === 'photos' && (
            <div className="space-y-5">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Photo guidelines queue
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Photo review queue.
                </h1>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Reviewing 4:5 primary crop framing, solo portrait clarity, and requested intention visibility.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photoReviews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[15px] p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-[var(--heading)] tabular-nums">
                          {item.id} · {item.memberHandle}
                        </span>
                        <span className="text-[var(--muted)]">{item.submittedAt}</span>
                      </div>
                      <div className="h-[240px] mb-3">
                        <EditorialImage
                          variant={item.variant as EditorialVariant}
                          alt={item.caption}
                          aspectClass="w-full h-full"
                        />
                      </div>
                      <p className="text-sm font-bold text-[var(--heading)]">
                        Caption: &ldquo;{item.caption}&rdquo;
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        Requested visibility: {item.requestedVisibility.join(' · ')} · Frame:{' '}
                        {item.aspectRatio}
                      </p>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        Check: {item.guidelineCheck}
                      </p>
                      <p className="text-xs font-semibold text-[var(--ochre-text)] mt-2">
                        Status: {item.status}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handlePhotoReviewAction(item.id, 'Approved (Preview)')
                        }
                        className="flex-1 min-h-[42px] rounded-[8px] bg-[var(--primary)] text-[var(--on-primary)] py-2 text-xs font-bold cursor-pointer"
                      >
                        Approve (Preview)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handlePhotoReviewAction(item.id, 'Replacement requested')
                        }
                        className="flex-1 min-h-[42px] rounded-[8px] border border-[var(--line)] text-[var(--heading)] hover:bg-[var(--surface2)] py-2 text-xs font-bold cursor-pointer"
                      >
                        Request clearer crop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Fictional directory
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Member directory lookup.
                </h1>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[var(--surface2)] text-[var(--muted)] text-left">
                      <th className="p-3.5 font-bold">Member</th>
                      <th className="p-3.5 font-bold">City</th>
                      <th className="p-3.5 font-bold">Enabled intentions</th>
                      <th className="p-3.5 font-bold">Languages</th>
                      <th className="p-3.5 font-bold">Account state</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p) => (
                      <tr key={p.id} className="border-t border-[var(--line)]">
                        <td className="p-3.5 font-bold text-[var(--heading)]">{p.name}</td>
                        <td className="p-3.5">{p.city}</td>
                        <td className="p-3.5">{p.intentions.join(' · ')}</td>
                        <td className="p-3.5 text-[var(--muted)]">
                          {p.languages.join(' · ')}
                        </td>
                        <td className="p-3.5">Active (Sample fixture)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: GROUPS */}
          {activeTab === 'groups' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Community stewardship
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Circles & small gatherings.
                </h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {circles.map((c) => (
                  <div
                    key={c.id}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5"
                  >
                    <p className="text-xs font-bold text-[var(--ochre-text)]">
                      {c.city} · {c.format}
                    </p>
                    <h2 className="text-base font-bold text-[var(--heading)] mt-1">
                      {c.title}
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-1 tabular-nums">
                      {c.memberCount} members · {c.cadence}
                    </p>
                    <p className="text-sm text-[var(--text)] mt-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUPPORT */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Member assistance
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Support requests.
                </h1>
              </div>
              <div className="space-y-3">
                {[
                  {
                    id: 'SUP-301',
                    topic: 'How do I hide my Dating profile while keeping Matrimony active?',
                    member: 'Member #4102 · Bengaluru',
                    status: 'Guidance template ready',
                  },
                  {
                    id: 'SUP-302',
                    topic: 'Changing primary city from Mumbai to Pune next month',
                    member: 'Member #4219 · Mumbai',
                    status: 'Awaiting reply',
                  },
                  {
                    id: 'SUP-303',
                    topic: 'Hosting a neighbourhood Carnatic listening Circle in Mylapore',
                    member: 'Member #4380 · Chennai',
                    status: 'Assigned to Circle Steward',
                  },
                ].map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-bold text-[var(--heading)] tabular-nums">
                        {ticket.id}
                      </span>
                      <span className="text-[var(--muted)]"> · {ticket.member}</span>
                      <p className="font-semibold text-[var(--heading)] mt-1">
                        {ticket.topic}
                      </p>
                    </div>
                    <span className="text-[var(--muted)] shrink-0">{ticket.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Unified membership overview
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Subscriptions (Illustrative preview).
                </h1>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Single membership ladder across Friendship, Dating, and Matrimony. No live billing is connected.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { tier: 'Free', note: 'Core access across all 3 intentions', price: '₹0 (Illustrative)' },
                  { tier: 'Plus', note: 'Circles RSVP & extended city filters', price: '₹650 / mo (Illustrative)' },
                  { tier: 'Connect', note: 'Priority human review & partnership guides', price: '₹1,450 / mo (Illustrative)' },
                ].map((t) => (
                  <div
                    key={t.tier}
                    className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5"
                  >
                    <h2 className="text-lg font-bold text-[var(--heading)]">{t.tier}</h2>
                    <p className="text-sm font-bold text-[var(--ochre-text)] mt-1 tabular-nums">
                      {t.price}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--muted)] mt-2">{t.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · DPDP & GDPR workflow preview
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Privacy & data requests.
                </h1>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] p-5 space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <div>
                    <p className="font-bold text-[var(--heading)]">
                      Request #DP-09 · Portable JSON archive export
                    </p>
                    <p className="text-[var(--muted)]">
                      Includes profile text, reflection answers, and per-intention photo visibility log
                    </p>
                  </div>
                  <span className="font-semibold text-[var(--heading)]">Sample ready</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[var(--heading)]">
                      Request #DP-10 · Intention history clear (Dating only)
                    </p>
                    <p className="text-[var(--muted)]">
                      Removes Dating responses while preserving Friendship and Matrimony data
                    </p>
                  </div>
                  <span className="text-[var(--muted)]">In review (Preview)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAFF & ROLES (READ-ONLY RBAC MATRIX) */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Read-only role boundaries
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Staff & roles specification.
                </h1>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Read-only reference for AGY backend RBAC enforcement. Public role-switching and pretend privileged actions are intentionally omitted.
                </p>
              </div>
              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[var(--surface2)] text-[var(--muted)] text-left">
                      <th className="p-3.5 font-bold">Role</th>
                      <th className="p-3.5 font-bold">Permitted queues</th>
                      <th className="p-3.5 font-bold">Restricted data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[var(--line)]">
                      <td className="p-3.5 font-bold text-[var(--heading)]">Photo Reviewer</td>
                      <td className="p-3.5">4:5 portrait crop & caption queue only</td>
                      <td className="p-3.5 text-[var(--muted)]">Private messages, billing, email address</td>
                    </tr>
                    <tr className="border-t border-[var(--line)]">
                      <td className="p-3.5 font-bold text-[var(--heading)]">Circle Steward</td>
                      <td className="p-3.5">Circle venue logistics & RSVP capacities</td>
                      <td className="p-3.5 text-[var(--muted)]">Safety reports, private 1:1 threads</td>
                    </tr>
                    <tr className="border-t border-[var(--line)]">
                      <td className="p-3.5 font-bold text-[var(--heading)]">Trust & Safety Specialist</td>
                      <td className="p-3.5">Impersonation & boundary reports (flagged context only)</td>
                      <td className="p-3.5 text-[var(--muted)]">Unreported member conversations</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <p className="uppercase tracking-[2.3px] text-[11px] font-bold text-[var(--ochre-text)]">
                  Staff interface · Sample chronological records
                </p>
                <h1
                  tabIndex={-1}
                  className="text-[28px] font-bold text-[var(--heading)] mt-1 outline-none"
                >
                  Sample audit trail.
                </h1>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Actions you test in the Case Triage Drawer or Photo Review queue append a local preview entry below.
                </p>
              </div>

              <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[14px] overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[var(--surface2)] text-[var(--muted)] text-left">
                      <th className="p-3.5 font-bold">Timestamp</th>
                      <th className="p-3.5 font-bold">Actor</th>
                      <th className="p-3.5 font-bold">Action</th>
                      <th className="p-3.5 font-bold">Target</th>
                      <th className="p-3.5 font-bold">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((entry) => (
                      <tr key={entry.id} className="border-t border-[var(--line)]">
                        <td className="p-3.5 text-[var(--muted)] tabular-nums whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        <td className="p-3.5 font-semibold text-[var(--heading)]">
                          {entry.actor}
                        </td>
                        <td className="p-3.5">{entry.action}</td>
                        <td className="p-3.5 font-bold text-[var(--heading)] tabular-nums">
                          {entry.target}
                        </td>
                        <td className="p-3.5 text-[var(--muted)]">{entry.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SLIDE-OVER CASE TRIAGE DRAWER */}
      <AnimatePresence>
        {activeCase && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-drawer-title"
            className="fixed inset-0 z-50 bg-black/50 flex justify-end"
          >
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-[460px] bg-[var(--surface)] border-l border-[var(--line)] h-full p-6 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-[var(--line)]">
                  <div>
                    <p className="text-[11px] uppercase tracking-[2px] font-bold text-[var(--ochre-text)]">
                      Case triage drawer · {activeCase.id}
                    </p>
                    <h2
                      id="case-drawer-title"
                      className="text-xl font-bold text-[var(--heading)] mt-1"
                    >
                      {activeCase.category}
                    </h2>
                    <p className="text-xs text-[var(--muted)] mt-0.5">
                      Submitted {activeCase.submittedAt} · {activeCase.assignedTo}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCaseId(null)}
                    aria-label="Close case drawer"
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-[8px] text-[var(--muted)] hover:text-[var(--heading)] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-4 space-y-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-[10px] bg-[var(--surface2)]">
                    <p className="font-bold text-[var(--heading)]">Reported context</p>
                    <p className="text-[var(--text)] mt-1 leading-relaxed">
                      {activeCase.summary}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="drawer-status-select"
                      className="block font-bold text-[var(--heading)] mb-1.5"
                    >
                      Update mock case status
                    </label>
                    <select
                      id="drawer-status-select"
                      value={activeCase.status}
                      onChange={(e) =>
                        handleUpdateCaseStatus(
                          activeCase.id,
                          e.target.value as StaffCase['status']
                        )
                      }
                      className="w-full min-h-[42px] rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] px-3 text-xs font-semibold"
                    >
                      <option value="Awaiting review">Awaiting review</option>
                      <option value="In queue">In queue</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Resolved (Preview)">Resolved (Preview)</option>
                    </select>
                  </div>

                  <div>
                    <p className="font-bold text-[var(--heading)] mb-2">
                      Triage notes ({activeCase.notes.length})
                    </p>
                    <ul className="space-y-2">
                      {activeCase.notes.map((n, i) => (
                        <li
                          key={i}
                          className="p-3 rounded-[9px] border border-[var(--line)] text-[var(--text)] leading-relaxed"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <form onSubmit={handleAddCaseNote} className="pt-2">
                    <label
                      htmlFor="drawer-note-input"
                      className="block font-bold text-[var(--heading)] mb-1.5"
                    >
                      Add sample triage note
                    </label>
                    <textarea
                      id="drawer-note-input"
                      rows={3}
                      value={drawerNote}
                      onChange={(e) => setDrawerNote(e.target.value)}
                      placeholder="Document next step for this case (logs to sample Audit Trail)..."
                      className="w-full rounded-[8px] border border-[var(--line)] bg-[var(--bg)] text-[var(--heading)] p-3 text-xs sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="mt-2.5 w-full min-h-[42px] rounded-[8px] bg-[var(--primary)] text-[var(--on-primary)] py-2.5 text-xs font-bold cursor-pointer"
                    >
                      Save triage note (Preview)
                    </button>
                  </form>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] pt-4 border-t border-[var(--line)]">
                Frontend preview drawer: Updates local React state and appends to the sample Audit Trail tab. Press Esc to close.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
