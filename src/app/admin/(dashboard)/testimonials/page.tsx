'use client';

import { useEffect, useState, useRef } from 'react';
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

const PRESET_COLORS = [
  '#FF6B35',
  '#14B8A6',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#3B82F6',
];

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

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [starsValue, setStarsValue] = useState(5);
  const [colorValue, setColorValue] = useState('#FF6B35');
  const formRef = useRef<HTMLFormElement>(null);
  const starsInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

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
    setStarsValue(testimonial.stars ?? 5);
    setColorValue(testimonial.color || '#FF6B35');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setStarsValue(5);
    setColorValue('#FF6B35');
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
    formData.set('stars', String(starsValue));
    formData.set('color', colorValue);

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

  async function handleDelete(item: Testimonial) {
    const confirmed = window.confirm(
      `Remove ${item.name}'s testimonial? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteTestimonial(item.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderTestimonial(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
              💬 Testimonials
            </h1>
            {data.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                {data.length} {data.length === 1 ? 'testimonial' : 'testimonials'}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            What people say about Aarambha &mdash; shown on Homepage and Community page
          </p>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e55a2b] hover:shadow-md"
          >
            <PlusIcon />
            Add Testimonial
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
            {editingItem ? '✍️ Edit Testimonial' : '✍️ Add New Testimonial'}
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
                  <div
                    className="flex h-28 w-28 items-center justify-center rounded-full text-2xl font-bold text-white"
                    style={{ backgroundColor: colorValue }}
                  >
                    {editingItem ? getInitials(editingItem.name) : '?'}
                  </div>
                )}
              </div>
              <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image[0]}</p>
              )}
            </div>

            {/* Right: Form fields */}
            <div className="flex flex-1 flex-col gap-4">
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

              {/* Star Rating Picker */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Rating<span className="ml-0.5 text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarsValue(star)}
                      className="text-2xl transition-transform duration-150 hover:scale-110"
                      aria-label={`Set rating to ${star} stars`}
                    >
                      <span className={star <= starsValue ? 'text-amber-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{starsValue}/5</span>
                </div>
                <input ref={starsInputRef} type="hidden" name="stars" value={starsValue} />
                {errors.stars && (
                  <p className="mt-1 text-sm text-red-600">{errors.stars[0]}</p>
                )}
              </div>

              {/* Color Picker */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Color<span className="ml-0.5 text-red-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorValue(color)}
                      className={`h-8 w-8 rounded-full border-2 transition-all duration-150 hover:scale-110 ${
                        colorValue === color
                          ? 'border-gray-800 ring-2 ring-gray-300'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                  <div className="ml-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={colorValue}
                      onChange={(e) => setColorValue(e.target.value)}
                      className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                      placeholder="#hex"
                    />
                    <div
                      className="h-6 w-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: colorValue }}
                    />
                  </div>
                </div>
                <input ref={colorInputRef} type="hidden" name="color" value={colorValue} />
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e55a2b] hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? 'Saving...' : 'Save Testimonial'}
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

      {/* Testimonial Cards */}
      {data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md shadow-black/5">
          <div className="text-6xl">💬</div>
          <h3 className="mt-4 text-lg font-bold text-[#1B2A4A]">No testimonials yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first testimonial to share what people say
          </p>
          {!isFormOpen && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e55a2b] hover:shadow-md"
            >
              <PlusIcon />
              Add Testimonial
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {data.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ borderLeft: `4px solid ${testimonial.color}` }}
            >
              <div className="p-5">
                {/* Decorative open quote */}
                <span
                  className="pointer-events-none absolute left-4 top-2 select-none text-7xl font-bold leading-none"
                  style={{ color: testimonial.color, opacity: 0.15 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Quote text */}
                <p className="relative z-10 mt-4 line-clamp-3 text-sm italic leading-relaxed text-gray-700">
                  {testimonial.quote}
                </p>

                {/* Star rating */}
                <div className="mt-3 flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= testimonial.stars ? 'text-amber-400' : 'text-gray-300'}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Author info + actions row */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-teal-100"
                      />
                    ) : (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-teal-100"
                        style={{ backgroundColor: testimonial.color }}
                      >
                        {getInitials(testimonial.name)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-[#1B2A4A]">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleReorder(testimonial.id, 'up')}
                      disabled={index === 0}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      aria-label={`Move ${testimonial.name} up`}
                    >
                      <ChevronUpIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(testimonial.id, 'down')}
                      disabled={index === data.length - 1}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-500 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                      aria-label={`Move ${testimonial.name} down`}
                    >
                      <ChevronDownIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(testimonial as unknown as Record<string, unknown>)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35]"
                      aria-label={`Edit ${testimonial.name}`}
                    >
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(testimonial)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label={`Delete ${testimonial.name}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
