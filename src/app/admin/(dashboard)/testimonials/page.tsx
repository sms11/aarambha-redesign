'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonial,
} from '@/lib/actions/testimonial';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
  stars: number;
  color: string;
  sortOrder: number;
}

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'quote', label: 'Quote' },
  { key: 'stars', label: 'Stars' },
  { key: 'color', label: 'Color' },
];

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllTestimonials();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const testimonial = item as unknown as Testimonial;
    setEditingItem(testimonial);
    setImageUrl(testimonial.image || '');
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
      ? await updateTestimonial(editingItem.id, formData)
      : await createTestimonial(formData);

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
    await deleteTestimonial(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderTestimonial(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage testimonials displayed on the website.
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Testimonial
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
            {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>

          <div className="grid gap-4">
            <FormField
              label="Quote"
              name="quote"
              type="textarea"
              required
              value={editingItem?.quote}
              error={errors.quote?.[0]}
              placeholder="What did they say?"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Name"
                name="name"
                required
                value={editingItem?.name}
                error={errors.name?.[0]}
                placeholder="e.g. Ram Sharma"
              />
              <FormField
                label="Role"
                name="role"
                required
                value={editingItem?.role}
                error={errors.role?.[0]}
                placeholder="e.g. Parent"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Stars"
                name="stars"
                type="number"
                required
                value={editingItem?.stars ?? 5}
                error={errors.stars?.[0]}
                placeholder="1-5"
              />
              <FormField
                label="Color"
                name="color"
                required
                value={editingItem?.color}
                error={errors.color?.[0]}
                placeholder="e.g. #FF6B35 or orange"
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
                  ? 'Update Testimonial'
                  : 'Add Testimonial'}
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
