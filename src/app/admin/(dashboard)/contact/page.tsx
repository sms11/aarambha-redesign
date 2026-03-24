'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
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

const TYPE_OPTIONS = [
  { label: 'Address', value: 'address' },
  { label: 'Phone', value: 'phone' },
  { label: 'Email', value: 'email' },
  { label: 'Hours', value: 'hours' },
];

const infoColumns = [
  { key: 'icon', label: 'Icon' },
  { key: 'label', label: 'Label' },
  { key: 'value', label: 'Value' },
  { key: 'type', label: 'Type' },
];

export default function ContactAdminPage() {
  const [activeSection, setActiveSection] = useState<'info' | 'submissions'>('info');

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage contact information and view form submissions.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        <button
          type="button"
          onClick={() => setActiveSection('info')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeSection === 'info'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Contact Info
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('submissions')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeSection === 'submissions'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Submissions
        </button>
      </div>

      {activeSection === 'info' ? <ContactInfoSection /> : <SubmissionsSection />}
    </div>
  );
}

function ContactInfoSection() {
  const [data, setData] = useState<ContactInfoItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContactInfoItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllContactInfo();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const info = item as unknown as ContactInfoItem;
    setEditingItem(info);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteContactInfo(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderContactInfo(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="mt-6 flex justify-end">
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Contact Info
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingItem ? 'Edit Contact Info' : 'Add Contact Info'}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
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
            <FormField
              label="Type"
              name="type"
              type="select"
              required
              value={editingItem?.type}
              error={errors.type?.[0]}
              options={TYPE_OPTIONS}
              placeholder="Select type"
            />
            <FormField
              label="Icon"
              name="icon"
              required
              value={editingItem?.icon}
              error={errors.icon?.[0]}
              placeholder="e.g. MapPinIcon"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : editingItem
                  ? 'Update Info'
                  : 'Add Info'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <DataTable
          columns={infoColumns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
}

function SubmissionsSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filterUnread, setFilterUnread] = useState(false);

  async function loadSubmissions() {
    const items = await getAllSubmissions();
    setSubmissions(items);
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function handleMarkAsRead(id: number) {
    await markAsRead(id);
    await loadSubmissions();
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this submission? This action cannot be undone.'
    );
    if (!confirmed) return;
    await deleteSubmission(id);
    await loadSubmissions();
  }

  const displayed = filterUnread
    ? submissions.filter((s) => !s.read)
    : submissions;

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {unreadCount} unread submission{unreadCount !== 1 ? 's' : ''}
        </p>
        <button
          type="button"
          onClick={() => setFilterUnread(!filterUnread)}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            filterUnread
              ? 'border-gray-900 bg-gray-900 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {filterUnread ? 'Show All' : 'Show Unread Only'}
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">No submissions found.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Message
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayed.map((sub) => (
                  <tr
                    key={sub.id}
                    className={`transition-colors hover:bg-gray-50 ${
                      !sub.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          sub.read
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {sub.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{sub.phone}</td>
                    <td className="px-4 py-3 text-gray-700">{sub.purpose}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-gray-700">
                      {sub.message}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {!sub.read && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(sub.id)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id)}
                          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
