'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  getAllEnquiries,
  markEnquiryAsRead,
  deleteEnquiry,
} from '@/lib/actions/admission';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Enquiry {
  id: number;
  studentName: string;
  age: string;
  gender: string;
  gradeApplied: string;
  address: string;
  previousSchool: string | null;
  guardianName: string;
  relation: string;
  contactNumber: string;
  read: boolean;
  createdAt: Date;
}

type ReadFilter = 'all' | 'unread' | 'read';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGradeColor(grade: string): { bg: string; text: string; ring: string } {
  if (['Nursery', 'LKG', 'UKG'].includes(grade)) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'bg-emerald-500' };
  }
  if (['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].includes(grade)) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', ring: 'bg-blue-500' };
  }
  if (['Grade 6', 'Grade 7', 'Grade 8'].includes(grade)) {
    return { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'bg-purple-500' };
  }
  return { bg: 'bg-teal-50', text: 'text-teal-700', ring: 'bg-teal-500' };
}

function getInitialColor(grade: string): string {
  if (['Nursery', 'LKG', 'UKG'].includes(grade)) return 'bg-emerald-500';
  if (['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'].includes(grade)) return 'bg-blue-500';
  if (['Grade 6', 'Grade 7', 'Grade 8'].includes(grade)) return 'bg-purple-500';
  return 'bg-teal-500';
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function exportCSV(enquiries: Enquiry[]) {
  const headers = [
    'Student Name', 'Age', 'Gender', 'Grade Applied', 'Address',
    'Previous School', 'Guardian Name', 'Relation', 'Contact Number',
    'Date', 'Status',
  ];
  const rows = enquiries.map(e => [
    e.studentName, e.age, e.gender, e.gradeApplied, e.address,
    e.previousSchool || '', e.guardianName, e.relation, e.contactNumber,
    new Date(e.createdAt).toLocaleDateString(), e.read ? 'Read' : 'Unread',
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aarambha-enquiries-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdmissionsAdminPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function loadData() {
    const items = await getAllEnquiries();
    setEnquiries(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Derived stats
  const totalCount = enquiries.length;
  const unreadCount = enquiries.filter((e) => !e.read).length;
  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return enquiries.filter((e) => {
      const d = new Date(e.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [enquiries]);

  // Unique grades for filter dropdown
  const uniqueGrades = useMemo(() => {
    const grades = new Set(enquiries.map((e) => e.gradeApplied));
    return Array.from(grades).sort();
  }, [enquiries]);

  // Client-side filtering
  const displayed = useMemo(() => {
    let filtered = [...enquiries];

    if (readFilter === 'unread') filtered = filtered.filter((e) => !e.read);
    if (readFilter === 'read') filtered = filtered.filter((e) => e.read);

    if (gradeFilter !== 'all') {
      filtered = filtered.filter((e) => e.gradeApplied === gradeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.studentName.toLowerCase().includes(q) ||
          e.guardianName.toLowerCase().includes(q) ||
          e.contactNumber.includes(q)
      );
    }

    return filtered;
  }, [enquiries, readFilter, gradeFilter, searchQuery]);

  async function handleMarkAsRead(id: number) {
    await markEnquiryAsRead(id);
    await loadData();
  }

  async function handleDelete(enquiry: Enquiry) {
    const confirmed = window.confirm(
      `Delete enquiry for ${enquiry.studentName}? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteEnquiry(enquiry.id);
    if (expandedId === enquiry.id) setExpandedId(null);
    await loadData();
  }

  return (
    <div className="pb-8">
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
              Admissions
            </h1>
            {totalCount > 0 && (
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                {totalCount}
              </span>
            )}
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B35]/10 px-2.5 py-0.5 text-xs font-semibold text-[#FF6B35]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B35]" />
                </span>
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Student enquiry submissions from your website
          </p>
        </div>

        {totalCount > 0 && (
          <button
            type="button"
            onClick={() => exportCSV(enquiries)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {/* ── Summary Stats Bar ─────────────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1B2A4A]">{totalCount}</p>
            <p className="text-xs text-gray-500">Total Enquiries</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35] opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FF6B35]" />
              </span>
            )}
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1B2A4A]">{unreadCount}</p>
            <p className="text-xs text-gray-500">Unread</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1B2A4A]">{thisMonthCount}</p>
            <p className="text-xs text-gray-500">This Month</p>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Bar ───────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, guardian, or contact..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1B2A4A] placeholder-gray-400 shadow-sm transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
          />
        </div>

        {/* Read filter pills */}
        <div className="flex gap-1 rounded-xl bg-orange-50/60 p-1">
          {(['all', 'unread', 'read'] as ReadFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setReadFilter(filter)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold capitalize transition-all ${
                readFilter === filter
                  ? 'bg-white text-[#1B2A4A] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Read'}
            </button>
          ))}
        </div>

        {/* Grade filter dropdown */}
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium text-[#1B2A4A] shadow-sm transition-all focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
        >
          <option value="all">All Grades</option>
          {uniqueGrades.map((grade) => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
      </div>

      {/* ── Enquiry Cards ─────────────────────────────────────────────── */}
      {displayed.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <span className="text-5xl">
            {enquiries.length === 0 ? '🎓' : '🔍'}
          </span>
          <p className="mt-4 max-w-xs text-center text-sm text-gray-500">
            {enquiries.length === 0
              ? 'No enquiries yet — submissions from your admission form will appear here'
              : 'No enquiries match your search'}
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {displayed.map((enquiry) => {
            const isUnread = !enquiry.read;
            const isExpanded = expandedId === enquiry.id;
            const gradeColor = getGradeColor(enquiry.gradeApplied);
            const initial = enquiry.studentName.charAt(0).toUpperCase();
            const avatarColor = getInitialColor(enquiry.gradeApplied);

            return (
              <div
                key={enquiry.id}
                className={`overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
                  isUnread
                    ? 'border-l-4 border-[#FF6B35] bg-gradient-to-r from-orange-50/40 to-white'
                    : ''
                }`}
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row">
                  {/* Left: Avatar */}
                  <div className="flex shrink-0 items-start">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${avatarColor} text-lg font-bold text-white shadow-sm`}>
                      {initial}
                    </div>
                  </div>

                  {/* Middle: Info */}
                  <div className="min-w-0 flex-1">
                    {/* Row 1: Name, grade, unread dot */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[#1B2A4A]">
                        {enquiry.studentName}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${gradeColor.bg} ${gradeColor.text}`}>
                        {enquiry.gradeApplied}
                      </span>
                      {isUnread && (
                        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF6B35]" />
                      )}
                    </div>

                    {/* Row 2: Age and gender */}
                    <p className="mt-1 text-xs text-gray-400">
                      {enquiry.age} &bull; {enquiry.gender}
                    </p>

                    {/* Row 3: Guardian and contact */}
                    <p className="mt-1.5 text-sm text-gray-600">
                      <span className="mr-1">👨‍👩‍👧</span>
                      {enquiry.guardianName} ({enquiry.relation})
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="mr-1">📱</span>
                      {enquiry.contactNumber}
                    </p>

                    {/* Row 4: Address */}
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="mr-1">🏠</span>
                      <span className="line-clamp-1">{enquiry.address}</span>
                    </p>

                    {/* Row 5: Previous school (if present) */}
                    {enquiry.previousSchool && (
                      <p className="mt-1 text-sm text-gray-500">
                        <span className="mr-1">🏫</span>
                        {enquiry.previousSchool}
                      </p>
                    )}
                  </div>

                  {/* Right: Date + Actions */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-xs text-gray-400">
                      {formatDate(enquiry.createdAt)}
                    </span>

                    <div className="flex flex-col gap-1.5">
                      {isUnread && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(enquiry.id)}
                          className="rounded-lg border border-[#FF6B35] px-3 py-1.5 text-xs font-semibold text-[#FF6B35] transition-all hover:bg-[#FF6B35] hover:text-white"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : enquiry.id)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-50"
                      >
                        {isExpanded ? 'Close' : 'View Details'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(enquiry)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-500 transition-all hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Expanded Detail View ──────────────────────────────── */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-5">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      <InfoField label="Student Name" value={enquiry.studentName} />
                      <InfoField label="Age" value={enquiry.age} />
                      <InfoField label="Gender" value={enquiry.gender} />
                      <InfoField label="Grade Applied" value={enquiry.gradeApplied} />
                      <InfoField label="Address" value={enquiry.address} />
                      <InfoField label="Previous School" value={enquiry.previousSchool || 'N/A'} />
                      <InfoField label="Guardian Name" value={enquiry.guardianName} />
                      <InfoField label="Relation" value={enquiry.relation} />
                      <InfoField label="Contact Number" value={enquiry.contactNumber} />
                      <InfoField label="Submitted" value={formatDateTime(enquiry.createdAt)} />
                      <InfoField
                        label="Status"
                        value={enquiry.read ? 'Read' : 'Unread'}
                        highlight={!enquiry.read}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── InfoField Component ────────────────────────────────────────────────────

function InfoField({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span
        className={`text-sm ${
          highlight ? 'font-semibold text-[#FF6B35]' : 'text-[#1B2A4A]'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
