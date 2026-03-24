'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
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

const columns = [
  { key: 'logo', label: 'Logo' },
  { key: 'name', label: 'Name' },
];

export default function PartnersPage() {
  const [data, setData] = useState<Partner[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllPartners();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const partner = item as unknown as Partner;
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

  async function handleDelete(item: Record<string, unknown>) {
    await deletePartner(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderPartner(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage partner logos displayed on the website.
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Partner
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
            {editingItem ? 'Edit Partner' : 'Add Partner'}
          </h2>

          <div className="grid gap-4">
            <FormField
              label="Name"
              name="name"
              required
              value={editingItem?.name}
              error={errors.name?.[0]}
              placeholder="e.g. UNICEF Nepal"
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Logo<span className="ml-0.5 text-red-500">*</span>
              </label>
              <ImageUpload value={logoUrl} onChange={setLogoUrl} />
              {errors.logo && (
                <p className="mt-1 text-sm text-red-600">{errors.logo[0]}</p>
              )}
            </div>
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
                  ? 'Update Partner'
                  : 'Add Partner'}
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
          columns={columns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
}
