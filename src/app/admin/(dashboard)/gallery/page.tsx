'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImage,
} from '@/lib/actions/gallery';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  sortOrder: number;
}

const categoryOptions = [
  { label: 'School Life', value: 'School Life' },
  { label: 'Campus', value: 'Campus' },
  { label: 'Labs', value: 'Labs' },
  { label: 'Community', value: 'Community' },
  { label: 'Team', value: 'Team' },
];

const columns = [
  { key: 'src', label: 'Image' },
  { key: 'alt', label: 'Alt Text' },
  { key: 'category', label: 'Category' },
];

export default function GalleryAdminPage() {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllGalleryImages();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const img = item as unknown as GalleryImage;
    setEditingItem(img);
    setImageUrl(img.src);
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
    const payload = {
      src: imageUrl,
      alt: formData.get('alt') as string,
      category: formData.get('category') as string,
    };

    const result = editingItem
      ? await updateGalleryImage(editingItem.id, payload)
      : await createGalleryImage(payload);

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
    await deleteGalleryImage(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderGalleryImage(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage gallery images displayed on the website.
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Image
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingItem ? 'Edit Image' : 'Add Image'}
          </h2>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Alt Text"
                name="alt"
                required
                value={editingItem?.alt}
                error={errors.alt?.[0]}
                placeholder="Describe the image..."
              />
              <FormField
                label="Category"
                name="category"
                type="select"
                required
                value={editingItem?.category}
                error={errors.category?.[0]}
                options={categoryOptions}
                placeholder="Select a category"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image<span className="ml-0.5 text-red-500">*</span>
              </label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
              {errors.src && (
                <p className="mt-1 text-sm text-red-600">{errors.src[0]}</p>
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
                  ? 'Update Image'
                  : 'Add Image'}
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
