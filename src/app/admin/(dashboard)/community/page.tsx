'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  getAllCommunityItems,
  createCommunityItem,
  updateCommunityItem,
  deleteCommunityItem,
  reorderCommunityItem,
} from '@/lib/actions/community';

interface CommunityItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  color: string | null;
  section: string;
  sortOrder: number;
}

const SECTIONS = [
  { value: 'parent_teacher', label: 'Parent-Teacher' },
  { value: 'business', label: 'Business Partnerships' },
  { value: 'educational', label: 'Educational Partnerships' },
] as const;

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'section', label: 'Section' },
  { key: 'color', label: 'Color' },
  { key: 'image', label: 'Image' },
];

export default function CommunityPage() {
  const [data, setData] = useState<CommunityItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('parent_teacher');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CommunityItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllCommunityItems();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = data.filter((item) => item.section === activeTab);

  function handleEdit(item: Record<string, unknown>) {
    const community = item as unknown as CommunityItem;
    setEditingItem(community);
    setImageUrl(community.image || '');
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
      ? await updateCommunityItem(editingItem.id, formData)
      : await createCommunityItem(formData);

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

  async function handleDelete(item: Record<string, unknown>) {
    await deleteCommunityItem(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderCommunityItem(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Involvement</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage community involvement items displayed on the admissions page.
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Item
          </button>
        )}
      </div>

      {/* Section Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {SECTIONS.map((section) => (
          <button
            key={section.value}
            type="button"
            onClick={() => setActiveTab(section.value)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === section.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.label}
            <span className="ml-1.5 text-xs text-gray-400">
              ({data.filter((d) => d.section === section.value).length})
            </span>
          </button>
        ))}
      </div>

      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingItem ? 'Edit Item' : 'Add Item'}
          </h2>

          <div className="grid gap-4">
            <FormField
              label="Title"
              name="title"
              required
              value={editingItem?.title}
              error={errors.title?.[0]}
              placeholder="e.g. Parent Workshops"
            />

            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              value={editingItem?.description}
              error={errors.description?.[0]}
              placeholder="Describe the community involvement..."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Section"
                name="section"
                type="select"
                required
                value={editingItem?.section || activeTab}
                error={errors.section?.[0]}
                options={SECTIONS.map((s) => ({ label: s.label, value: s.value }))}
              />
              <FormField
                label="Color"
                name="color"
                value={editingItem?.color || ''}
                error={errors.color?.[0]}
                placeholder="e.g. #FF6B35 or emerald"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image
              </label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
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
                  ? 'Update Item'
                  : 'Add Item'}
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
          data={filteredData as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
}
