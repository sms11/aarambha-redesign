'use client';

import { useEffect, useState, useRef } from 'react';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  getAllTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMember,
} from '@/lib/actions/team';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  sortOrder: number;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : '';
  return (first + last).toUpperCase();
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

export default function TeamMembersPage() {
  const [data, setData] = useState<TeamMember[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllTeamMembers();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(member: TeamMember) {
    setEditingItem(member);
    setImageUrl(member.image);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set('image', imageUrl);

    const result = editingItem
      ? await updateTeamMember(editingItem.id, formData)
      : await createTeamMember(formData);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(member: TeamMember) {
    const confirmed = window.confirm(
      `Remove ${member.name} from the team? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteTeamMember(member.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderTeamMember(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
              Team Members
            </h1>
            {data.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                {data.length} {data.length === 1 ? 'member' : 'members'}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage your school&apos;s team &mdash; they appear on the Homepage and About page
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e55a2b] hover:shadow-md"
          >
            <PlusIcon />
            Add Member
          </button>
        )}
      </div>

      {/* Add/Edit Form Panel */}
      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border-t-4 border-[#FF6B35] bg-white p-6 shadow-md shadow-black/5 sm:p-8"
        >
          <h2 className="mb-6 text-lg font-bold text-[#1B2A4A]">
            {editingItem ? '👤 Edit Member' : '👤 Add New Member'}
          </h2>

          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Left: Image upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-28 w-28 rounded-full border-4 border-teal-100 object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-teal-50 text-2xl font-bold text-teal-400">
                    {editingItem ? getInitials(editingItem.name) : '?'}
                  </div>
                )}
              </div>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image[0]}</p>
              )}
            </div>

            {/* Right: Text fields */}
            <div className="flex flex-1 flex-col gap-4">
              <FormField
                label="Name"
                name="name"
                required
                value={editingItem?.name}
                error={errors.name?.[0]}
                placeholder="e.g. John Doe"
              />
              <FormField
                label="Role"
                name="role"
                required
                value={editingItem?.role}
                error={errors.role?.[0]}
                placeholder="e.g. Principal"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e55a2b] hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Saving...' : 'Save Member'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Team Member Cards */}
      {data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md shadow-black/5">
          <div className="text-6xl">👥</div>
          <h3 className="mt-4 text-lg font-bold text-[#1B2A4A]">No team members yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first team member to get started
          </p>
          {!isFormOpen && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e55a2b] hover:shadow-md"
            >
              <PlusIcon />
              Add Member
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {data.map((member, index) => (
            <div
              key={member.id}
              className="group flex flex-col items-center rounded-2xl bg-white px-4 pb-4 pt-6 shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Avatar */}
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-100"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-50 text-xl font-bold text-teal-500 ring-4 ring-teal-100">
                  {getInitials(member.name)}
                </div>
              )}

              {/* Name and Role */}
              <h3 className="mt-3 text-center text-sm font-bold text-[#1B2A4A]">
                {member.name}
              </h3>
              <p className="mt-0.5 text-center text-xs text-gray-500">
                {member.role}
              </p>

              {/* Action Bar */}
              <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleReorder(member.id, 'up')}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  aria-label={`Move ${member.name} up`}
                >
                  <ChevronUpIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(member.id, 'down')}
                  disabled={index === data.length - 1}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  aria-label={`Move ${member.name} down`}
                >
                  <ChevronDownIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(member)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35]"
                  aria-label={`Edit ${member.name}`}
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(member)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Delete ${member.name}`}
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
