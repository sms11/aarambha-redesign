'use client';

import { useEffect, useState } from 'react';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import SmartImage from '@/components/SmartImage';
import {
  getAllGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '@/lib/actions/gallery';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  sortOrder: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_PHOTOS = 30;

const categoryOptions = [
  { label: 'School Life', value: 'School Life', emoji: '📚' },
  { label: 'Campus', value: 'Campus', emoji: '🏫' },
  { label: 'Labs', value: 'Labs', emoji: '🔬' },
  { label: 'Community', value: 'Community', emoji: '🤝' },
  { label: 'Team', value: 'Team', emoji: '👥' },
];

const filterOptions = [
  { label: 'All', value: 'All', emoji: '' },
  ...categoryOptions,
];

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

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

// ─── Page Component ──────────────────────────────────────────────────────────

export default function GalleryAdminPage() {
  const [data, setData] = useState<GalleryImage[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [categoryValue, setCategoryValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllGalleryImages();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  // ─── Derived data ──────────────────────────────────────────────────────────

  const filteredData =
    activeFilter === 'All'
      ? data
      : data.filter((img) => img.category === activeFilter);

  function getCategoryCount(category: string): number {
    if (category === 'All') return data.length;
    return data.filter((img) => img.category === category).length;
  }

  const isAtLimit = data.length >= MAX_PHOTOS;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleEdit(item: GalleryImage) {
    setEditingItem(item);
    setImageUrl(item.src);
    setCategoryValue(item.category);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setCategoryValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setCategoryValue('');
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
      category: categoryValue,
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
    setCategoryValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: GalleryImage) {
    if (!window.confirm('Remove this photo from the gallery?')) return;
    await deleteGalleryImage(item.id);
    await loadData();
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B2A4A]">
              📸 Gallery
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Your school&apos;s photo gallery — shown on the Gallery page
            </p>
          </div>
          <span className="ml-2 rounded-full bg-pink-100 px-3 py-0.5 text-sm font-semibold text-pink-700">
            {data.length}/{MAX_PHOTOS}
          </span>
        </div>
        {!isFormOpen && !isAtLimit && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-600"
          >
            <PlusIcon />
            Add Photo
          </button>
        )}
      </div>

      {/* ── Add/Edit Form ───────────────────────────────────────────────── */}
      {isFormOpen && (
        <form
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 border-t-4 border-t-[#EC4899] bg-white p-6 shadow-sm"
        >
          <h2 className="mb-5 text-lg font-semibold text-[#1B2A4A]">
            {editingItem ? 'Edit Photo' : 'Add Photo'}
          </h2>

          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
            {/* Left — Image preview & upload */}
            <div>
              {imageUrl ? (
                <div className="mb-3 overflow-hidden rounded-xl bg-gray-50">
                  <SmartImage
                    src={imageUrl}
                    alt="Preview"
                    width={600}
                    height={400}
                    className="max-h-64 w-full rounded-xl object-cover"
                  />
                </div>
              ) : (
                <div className="mb-3 flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                  <div className="text-center">
                    <span className="text-4xl">📷</span>
                    <p className="mt-2 text-sm">Upload a photo</p>
                  </div>
                </div>
              )}
              <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
              {errors.src && (
                <p className="mt-1 text-sm text-red-600">{errors.src[0]}</p>
              )}
            </div>

            {/* Right — Fields */}
            <div className="flex flex-col gap-4">
              <FormField
                label="Alt Text"
                name="alt"
                required
                value={editingItem?.alt}
                error={errors.alt?.[0]}
                placeholder="Describe the image..."
              />

              {/* Category button group */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category<span className="ml-0.5 text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategoryValue(opt.value)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        categoryValue === opt.value
                          ? 'bg-[#EC4899] text-white shadow-sm'
                          : 'bg-pink-50 text-gray-600 hover:bg-pink-100'
                      }`}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-600 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : editingItem
                  ? 'Update Photo'
                  : 'Save Photo'}
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

      {/* ── Category Filter Bar ─────────────────────────────────────────── */}
      <div className="mt-6 flex flex-wrap gap-2">
        {filterOptions.map((opt) => {
          const count = getCategoryCount(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setActiveFilter(opt.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === opt.value
                  ? 'bg-[#EC4899] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-pink-50'
              }`}
            >
              {opt.emoji}{opt.emoji ? ' ' : ''}{opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Photo Grid (Masonry) ────────────────────────────────────────── */}
      {filteredData.length > 0 ? (
        <div className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4">
          {filteredData.map((img) => (
            <div
              key={img.id}
              className="group relative mb-3 break-inside-avoid overflow-hidden rounded-xl"
            >
              <SmartImage
                src={img.src}
                alt={img.alt}
                width={400}
                height={300}
                className="w-full rounded-xl object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-between rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                {/* Top-right actions */}
                <div className="flex justify-end gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(img)}
                    className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(img)}
                    className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80"
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>

                {/* Bottom info */}
                <div className="flex items-end justify-between gap-2 p-3">
                  <p className="max-w-[70%] truncate text-sm font-medium text-white">
                    {img.alt}
                  </p>
                  <span className="shrink-0 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {img.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Empty State ──────────────────────────────────────────────── */
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <span className="text-6xl">📸</span>
          <p className="mt-4 text-lg font-medium text-gray-600">
            No photos yet — start building your gallery
          </p>
          {!isFormOpen && !isAtLimit && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#EC4899] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-pink-600"
            >
              <PlusIcon />
              Add Photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
