'use client';

import { useEffect, useState, useRef } from 'react';
import FormField from '@/components/admin/FormField';
import IconPicker from '@/components/admin/IconPicker';
import { getIcon } from '@/lib/icons';
import {
  getAllContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
  reorderContactInfo,
  getAllSubmissions,
  markAsRead,
  deleteSubmission,
} from '@/lib/actions/contact';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContactInfoItem {
  id: number;
  label: string;
  value: string;
  type: string;
  icon: string;
  sortOrder: number;
}

interface Submission {
  id: number;
  name: string;
  phone: string;
  purpose: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function PlusIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function PencilIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function TrashIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function ChevronUpIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// ─── Type Options ────────────────────────────────────────────────────────────

const TYPE_BUTTONS = [
  { label: 'Address', value: 'address', emoji: '\uD83D\uDCCD' },
  { label: 'Phone', value: 'phone', emoji: '\uD83D\uDCDE' },
  { label: 'Email', value: 'email', emoji: '\u2709\uFE0F' },
  { label: 'Hours', value: 'hours', emoji: '\uD83D\uDD50' },
] as const;

const TYPE_BADGE_COLORS: Record<string, string> = {
  address: 'bg-emerald-100 text-emerald-700',
  phone: 'bg-blue-100 text-blue-700',
  email: 'bg-purple-100 text-purple-700',
  hours: 'bg-amber-100 text-amber-700',
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ContactAdminPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'submissions'>('info');
  const [unreadCount, setUnreadCount] = useState(0);

  function handleUnreadCountChange(count: number) {
    setUnreadCount(count);
  }

  return (
    <div>
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
          {'\u2709\uFE0F'} Contact
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Contact details and visitor messages &mdash; shown on the Contact page
        </p>
      </div>

      {/* Pill Tabs */}
      <div className="mt-6 flex gap-1 rounded-2xl bg-blue-50/50 p-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('info')}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-200'
              : 'bg-white text-gray-600 hover:bg-blue-50'
          }`}
        >
          {'\uD83D\uDCCB'} Contact Info
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            activeTab === 'submissions'
              ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-200'
              : 'bg-white text-gray-600 hover:bg-blue-50'
          }`}
        >
          {'\uD83D\uDCEC'} Messages
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'info' ? (
        <ContactInfoSection />
      ) : (
        <SubmissionsSection onUnreadCountChange={handleUnreadCountChange} />
      )}
    </div>
  );
}

// ─── Contact Info Section ────────────────────────────────────────────────────

function ContactInfoSection() {
  const [data, setData] = useState<ContactInfoItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContactInfoItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconValue, setIconValue] = useState('');
  const [typeValue, setTypeValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllContactInfo();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  /** Types already in use (to disable in the button group) */
  const usedTypes = data.map((item) => item.type);

  function handleEdit(item: ContactInfoItem) {
    setEditingItem(item);
    setIconValue(item.icon);
    setTypeValue(item.type);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setIconValue('');
    setTypeValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setIconValue('');
    setTypeValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set('icon', iconValue);
    formData.set('type', typeValue);

    const result = editingItem
      ? await updateContactInfo(editingItem.id, formData)
      : await createContactInfo(formData);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setIconValue('');
    setTypeValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: ContactInfoItem) {
    const confirmed = window.confirm(`Remove '${item.label}' contact info?`);
    if (!confirmed) return;
    await deleteContactInfo(item.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderContactInfo(id, direction);
    await loadData();
  }

  const canAdd = data.length < 4;

  return (
    <div className="mt-6">
      {/* Add Button */}
      {!isFormOpen && canAdd && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-600 hover:shadow-lg"
          >
            <PlusIcon className="h-4 w-4" />
            Add Contact Info
          </button>
        </div>
      )}

      {/* Form */}
      {isFormOpen && (
        <form
          ref={formRef}
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="rounded-2xl border-t-4 border-[#3B82F6] bg-white p-6 shadow-lg shadow-blue-100/50"
        >
          <h2 className="mb-5 text-lg font-bold text-[#1B2A4A]">
            {editingItem ? 'Edit Contact Info' : 'Add Contact Info'}
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Label"
              name="label"
              required
              value={editingItem?.label}
              error={errors.label?.[0]}
              placeholder="e.g. Main Office"
            />
            <FormField
              label="Value"
              name="value"
              required
              value={editingItem?.value}
              error={errors.value?.[0]}
              placeholder="e.g. +977-1-1234567"
            />
          </div>

          {/* Type Button Group */}
          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-[#1B2A4A]">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TYPE_BUTTONS.map((opt) => {
                const isSelected = typeValue === opt.value;
                const isUsed = usedTypes.includes(opt.value) && editingItem?.type !== opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isUsed}
                    onClick={() => setTypeValue(opt.value)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-200'
                        : isUsed
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400 line-through'
                          : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-blue-50 hover:ring-blue-200'
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    {opt.label}
                    {isUsed && <span className="text-[10px]">(used)</span>}
                  </button>
                );
              })}
            </div>
            {errors.type?.[0] && (
              <p className="mt-1 text-sm text-red-600">{errors.type[0]}</p>
            )}
          </div>

          {/* Icon Picker */}
          <div className="mt-5">
            <IconPicker
              label="Icon"
              value={iconValue}
              onChange={setIconValue}
              error={errors.icon?.[0]}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#3B82F6] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Contact Info Cards */}
      {data.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <span className="text-4xl">{'\uD83D\uDCCB'}</span>
          <p className="mt-3 text-sm text-gray-500">
            No contact info yet &mdash; add your first entry above
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {data.map((item, idx) => {
            const Icon = getIcon(item.icon);
            const badgeColor = TYPE_BADGE_COLORS[item.type] ?? 'bg-gray-100 text-gray-600';

            return (
              <div
                key={item.id}
                className="group relative flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Icon Circle */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  {Icon ? (
                    <Icon className="h-6 w-6 text-[#3B82F6]" />
                  ) : (
                    <span className="text-lg text-[#3B82F6]">{'\u2709\uFE0F'}</span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#1B2A4A]">{item.label}</h3>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badgeColor}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.value}</p>
                </div>

                {/* Action Bar */}
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(item.id, 'up')}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-[#3B82F6]"
                      title="Move up"
                    >
                      <ChevronUpIcon />
                    </button>
                  )}
                  {idx < data.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleReorder(item.id, 'down')}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-[#3B82F6]"
                      title="Move down"
                    >
                      <ChevronDownIcon />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-[#3B82F6]"
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <TrashIcon />
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

// ─── Submissions Section (Inbox-style) ──────────────────────────────────────

function SubmissionsSection({
  onUnreadCountChange,
}: {
  onUnreadCountChange: (count: number) => void;
}) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);

  async function loadSubmissions() {
    const items = await getAllSubmissions();
    setSubmissions(items);
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  const unreadCount = submissions.filter((s) => !s.read).length;

  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  async function handleMarkAsRead(id: number) {
    await markAsRead(id);
    await loadSubmissions();
  }

  async function handleDelete(sub: Submission) {
    const confirmed = window.confirm(`Delete this message from ${sub.name}?`);
    if (!confirmed) return;
    await deleteSubmission(sub.id);
    await loadSubmissions();
  }

  const displayed = filterUnread
    ? submissions.filter((s) => !s.read)
    : submissions;

  return (
    <div className="mt-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 rounded-xl bg-blue-50/50 p-1">
          <button
            type="button"
            onClick={() => setFilterUnread(false)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              !filterUnread
                ? 'bg-white text-[#1B2A4A] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Messages
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
              <span className="inline-flex min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Message Cards */}
      {displayed.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-sm">
          <span className="text-4xl">{'\uD83D\uDCEC'}</span>
          <p className="mt-3 text-sm text-gray-500">
            No messages yet &mdash; submissions from your contact form will appear here
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {displayed.map((sub) => {
            const isUnread = !sub.read;
            return (
              <div
                key={sub.id}
                className={`rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  isUnread
                    ? 'border-l-4 border-[#3B82F6] bg-blue-50/30'
                    : ''
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isUnread && (
                      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#3B82F6]" />
                    )}
                    <h3 className="font-semibold text-[#1B2A4A]">{sub.name}</h3>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Info Row */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {sub.phone && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {'\uD83D\uDCDE'} {sub.phone}
                    </span>
                  )}
                  {sub.purpose && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {sub.purpose}
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  {sub.message}
                </p>

                {/* Action Row */}
                <div className="mt-4 flex items-center gap-2">
                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(sub.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#3B82F6] px-3 py-1.5 text-xs font-medium text-[#3B82F6] transition-all hover:bg-blue-50"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(sub)}
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
