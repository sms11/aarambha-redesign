'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  getAllPartners,
  createPartner,
  updatePartner,
  deletePartner,
  reorderPartner,
} from '@/lib/actions/partner';

interface Partner {
  id: number;
  name: string;
  logo: string;
  sortOrder: number;
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.519.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 1 .7.798l-.35 5.25a.75.75 0 0 1-1.497-.1l.35-5.25a.75.75 0 0 1 .797-.699Zm2.84 0a.75.75 0 0 1 .798.699l.35 5.25a.75.75 0 0 1-1.498.1l-.35-5.25a.75.75 0 0 1 .7-.798Z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  );
}

export default function PartnersPage() {
  const [data, setData] = useState<Partner[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllPartners();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(partner: Partner) {
    setEditingItem(partner);
    setLogoUrl(partner.logo);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setLogoUrl('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setLogoUrl('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set('logo', logoUrl);

    const result = editingItem
      ? await updatePartner(editingItem.id, formData)
      : await createPartner(formData);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setLogoUrl('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(partner: Partner) {
    await deletePartner(partner.id);
    setDeletingPartner(null);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderPartner(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B2A4A]">
              Partners
            </h1>
            <span className="text-2xl" role="img" aria-label="handshake">🤝</span>
            {data.length > 0 && (
              <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
                {data.length} {data.length === 1 ? 'partner' : 'partners'}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Organizations we collaborate with &mdash; shown on Homepage and Community page
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e55a2a]"
          >
            <PlusIcon className="h-4 w-4" />
            Add Partner
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-2xl border border-gray-200 border-t-4 border-t-[#FF6B35] bg-white p-6 shadow-md shadow-black/5"
        >
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-lg font-semibold text-[#1B2A4A]">
            {editingItem ? '🤝 Edit Partner' : '🤝 Add New Partner'}
          </h2>

          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Left: Logo preview + upload */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-32 w-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Logo preview"
                    width={192}
                    height={128}
                    className="h-full w-full rounded-xl object-contain p-3"
                  />
                ) : (
                  <span className="text-4xl text-gray-300">🏢</span>
                )}
              </div>
              <ImageUpload value={logoUrl} onChange={setLogoUrl} hidePreview />
              {errors.logo && (
                <p className="text-sm text-red-600">{errors.logo[0]}</p>
              )}
            </div>

            {/* Right: Name field */}
            <div className="flex-1">
              <FormField
                label="Name"
                name="name"
                required
                value={editingItem?.name}
                error={errors.name?.[0]}
                placeholder="e.g. UNICEF Nepal"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e55a2a] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Partner'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Partner Cards Grid */}
      {data.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((partner) => (
            <div
              key={partner.id}
              className="group flex flex-col rounded-2xl border-t-2 border-[#14B8A6]/30 bg-white shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Logo area */}
              <div className="flex flex-1 items-center justify-center p-4">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={160}
                    height={80}
                    className="h-20 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-3xl">🏢</span>
                  </div>
                )}
              </div>

              {/* Name */}
              <p className="truncate px-3 pb-2 text-center text-sm font-semibold text-[#1B2A4A]">
                {partner.name}
              </p>

              {/* Action bar */}
              <div className="flex items-center justify-center gap-1 border-t border-gray-100 px-2 py-2">
                <button
                  type="button"
                  onClick={() => handleReorder(partner.id, 'up')}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#14B8A6]"
                  title="Move up"
                >
                  <ChevronUpIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(partner.id, 'down')}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#14B8A6]"
                  title="Move down"
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(partner)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#FF6B35]"
                  title="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingPartner(partner)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                  title="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16">
          <span className="text-5xl">🤝</span>
          <h3 className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold text-[#1B2A4A]">
            No partners yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your partner organizations and their logos
          </p>
          <button
            type="button"
            onClick={handleCreate}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#e55a2a]"
          >
            <PlusIcon className="h-4 w-4" />
            Add Partner
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1B2A4A]">
              Remove Partner
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Remove <strong>{deletingPartner.name}</strong> from partners? This can&apos;t be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deletingPartner)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => setDeletingPartner(null)}
                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
