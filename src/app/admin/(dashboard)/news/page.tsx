'use client';

import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import SmartImage from '@/components/SmartImage';
import {
  getNewsEvents,
  createNewsEvent,
  updateNewsEvent,
  deleteNewsEvent,
} from '@/lib/actions/news-event';

interface NewsEvent {
  id: number;
  title: string;
  description: string;
  content: string | null;
  image: string | null;
  date: Date;
  category: string;
  featured: boolean;
  sortOrder: number;
}

const CATEGORIES = [
  { value: 'news', label: 'News', color: '#3B82F6' },
  { value: 'event', label: 'Event', color: '#14B8A6' },
  { value: 'announcement', label: 'Announcement', color: '#F59E0B' },
];

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

export default function NewsAdminPage() {
  const [items, setItems] = useState<NewsEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('news');
  const [featured, setFeatured] = useState(false);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    const data = await getNewsEvents();
    setItems(data as NewsEvent[]);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setTitle('');
    setDescription('');
    setContent('');
    setImage('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('news');
    setFeatured(false);
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(item: NewsEvent) {
    setTitle(item.title);
    setDescription(item.description);
    setContent(item.content || '');
    setImage(item.image || '');
    setDate(new Date(item.date).toISOString().split('T')[0]);
    setCategory(item.category);
    setFeatured(item.featured);
    setEditingId(item.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const data = { title, description, content, image, date, category, featured };

    const result = editingId
      ? await updateNewsEvent(editingId, data)
      : await createNewsEvent(data);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    resetForm();
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this item?')) return;
    await deleteNewsEvent(id);
    load();
  }

  function getCategoryBadge(cat: string) {
    const c = CATEGORIES.find((c) => c.value === cat);
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: c?.color || '#6B7280' }}
      >
        {c?.label || cat}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">News & Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage news articles, events, and announcements ({items.length} items)
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md"
        >
          <PlusIcon /> Add New
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md shadow-black/5">
          <div className="h-1 bg-[#FF6B35]" />
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#1B2A4A]">
              {editingId ? 'Edit Item' : 'Add New Item'}
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Title<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                  placeholder="e.g. Annual Sports Day 2026"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>}
              </div>

              <div className="grid gap-5 grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                    Date<span className="ml-0.5 text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date[0]}</p>}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                Short Description<span className="ml-0.5 text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={2}
                maxLength={500}
                placeholder="Brief summary shown on cards..."
                className="w-full resize-y rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                Full Content (optional)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                maxLength={5000}
                placeholder="Detailed article content..."
                className="w-full resize-y rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-[1fr_auto]">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">Image</label>
                <ImageUpload value={image} onChange={setImage} />
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>}
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                  />
                  <span className="text-sm font-medium text-[#1B2A4A]">Featured on homepage</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {item.image && (
              <div className="relative h-40 overflow-hidden">
                <SmartImage src={item.image} alt={item.title} fill className="object-cover" />
                {item.featured && (
                  <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                    Featured
                  </div>
                )}
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {getCategoryBadge(item.category)}
                <span className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="font-bold text-[#1B2A4A] text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => startEdit(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <PencilIcon /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <TrashIcon /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">📰</span>
          <p className="text-gray-500 text-sm">No news or events yet. Click &quot;Add New&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}
