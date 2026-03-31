'use client';

import { useEffect, useState } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import SmartImage from '@/components/SmartImage';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/lib/actions/blog';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  published: boolean;
  publishedAt: Date;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function BlogAdminPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [author, setAuthor] = useState('Aarambha School');
  const [published, setPublished] = useState(true);
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
  const [autoSlug, setAutoSlug] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function load() {
    const data = await getBlogPosts();
    setItems(data as BlogPost[]);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setTitle(''); setSlug(''); setExcerpt(''); setContent('');
    setImage(''); setAuthor('Aarambha School'); setPublished(true);
    setPublishedAt(new Date().toISOString().split('T')[0]);
    setAutoSlug(true); setErrors({}); setEditingId(null); setShowForm(false);
  }

  function startEdit(item: BlogPost) {
    setTitle(item.title);
    setSlug(item.slug);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setImage(item.image || '');
    setAuthor(item.author);
    setPublished(item.published);
    setPublishedAt(new Date(item.publishedAt).toISOString().split('T')[0]);
    setAutoSlug(false);
    setEditingId(item.id);
    setShowForm(true);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (autoSlug) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const data = { title, slug, excerpt, content, image, author, published, publishedAt };
    const result = editingId
      ? await updateBlogPost(editingId, data)
      : await createBlogPost(data);

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
    if (!confirm('Delete this blog post?')) return;
    await deleteBlogPost(id);
    load();
  }

  const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Write articles, insights, and stories ({items.length} posts)
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Post
        </button>
      </div>

      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md">
          <div className="h-1 bg-[#FF6B35]" />
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#1B2A4A]">
              {editingId ? 'Edit Post' : 'New Blog Post'}
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Title<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)}
                  required maxLength={200} placeholder="e.g. The Future of Learning" className={inputClass} />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Slug<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input type="text" value={slug}
                  onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }}
                  required placeholder="the-future-of-learning" className={inputClass} />
                {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug[0]}</p>}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Aarambha School" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Publish Date<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)}
                  required className={inputClass} />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]" />
                  <span className="text-sm font-medium text-[#1B2A4A]">Published</span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                Excerpt<span className="ml-0.5 text-red-500">*</span>
              </label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                required rows={2} maxLength={500} placeholder="Short summary shown on cards..."
                className={inputClass + ' resize-y'} />
              {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                Content<span className="ml-0.5 text-red-500">*</span>
              </label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                required rows={10} maxLength={20000} placeholder="Write your blog post content..."
                className={inputClass + ' resize-y'} />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content[0]}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">Cover Image</label>
              <ImageUpload value={image} onChange={setImage} />
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={isSubmitting}
                className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md disabled:opacity-50">
                {isSubmitting ? 'Saving...' : editingId ? 'Update Post' : 'Publish'}
              </button>
              <button type="button" onClick={resetForm}
                className="rounded-xl border-2 border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
            {item.image && (
              <div className="relative h-44 overflow-hidden">
                <SmartImage src={item.image} alt={item.title} fill className="object-cover" />
                {!item.published && (
                  <div className="absolute top-2 left-2 bg-gray-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                    Draft
                  </div>
                )}
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-[#FF6B35] font-medium flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  {new Date(item.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-xs text-gray-400">by {item.author}</span>
              </div>
              <h3 className="font-bold text-[#1B2A4A] text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => startEdit(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100">
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div className="text-center py-16">
          <span className="text-5xl mb-4 block">✍️</span>
          <p className="text-gray-500 text-sm">No blog posts yet. Click &quot;New Post&quot; to start writing.</p>
        </div>
      )}
    </div>
  );
}
