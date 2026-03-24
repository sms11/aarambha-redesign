'use client';

import { useEffect, useState } from 'react';
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

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function AdmissionsAdminPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);

  async function loadData() {
    const items = await getAllEnquiries();
    setEnquiries(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  const unreadCount = enquiries.filter((e) => !e.read).length;
  const displayed = filterUnread ? enquiries.filter((e) => !e.read) : enquiries;

  async function handleMarkAsRead(id: number) {
    await markEnquiryAsRead(id);
    await loadData();
  }

  async function handleDelete(enquiry: Enquiry) {
    const confirmed = window.confirm(
      `Delete enquiry for ${enquiry.studentName}?`
    );
    if (!confirmed) return;
    await deleteEnquiry(enquiry.id);
    await loadData();
  }

  return (
    <div>
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
          Admissions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Student enquiry form submissions
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 flex items-center gap-2">
        <div className="flex gap-1 rounded-xl bg-orange-50/50 p-1">
          <button
            type="button"
            onClick={() => setFilterUnread(false)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              !filterUnread
                ? 'bg-white text-[#1B2A4A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Enquiries
          </button>
          <button
            type="button"
            onClick={() => setFilterUnread(true)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              filterUnread
                ? 'bg-white text-[#1B2A4A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread Only
            {unreadCount > 0 && (
              <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-[#FF6B35] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Enquiry Cards */}
      {displayed.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <span className="text-4xl">🎓</span>
          <p className="mt-3 text-sm text-gray-500">
            No enquiries yet &mdash; submissions from your admission form will
            appear here
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {displayed.map((enquiry) => {
            const isUnread = !enquiry.read;
            return (
              <div
                key={enquiry.id}
                className={`rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  isUnread
                    ? 'border-l-4 border-[#FF6B35] bg-orange-50/30'
                    : ''
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isUnread && (
                      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF6B35]" />
                    )}
                    <h3 className="font-semibold text-[#1B2A4A]">
                      {enquiry.studentName}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Info Grid */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                  <InfoField label="Age & Gender" value={`${enquiry.age} / ${enquiry.gender}`} />
                  <InfoField label="Grade Applied" value={enquiry.gradeApplied} />
                  <InfoField label="Guardian" value={`${enquiry.guardianName} (${enquiry.relation})`} />
                  <InfoField label="Contact" value={enquiry.contactNumber} />
                  <InfoField label="Address" value={enquiry.address} />
                  {enquiry.previousSchool && (
                    <InfoField label="Previous School" value={enquiry.previousSchool} />
                  )}
                </div>

                {/* Action Row */}
                <div className="mt-4 flex items-center gap-2">
                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(enquiry.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF6B35] px-3 py-1.5 text-xs font-medium text-[#FF6B35] transition-all hover:bg-orange-50"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(enquiry)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Small labeled field pair used in the info grid */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-sm text-[#1B2A4A]">{value}</span>
    </div>
  );
}
