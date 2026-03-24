'use client';

import { useEffect, useState, useRef } from 'react';
import SmartImage from '@/components/SmartImage';
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
  { value: 'parent_teacher', label: 'Parent-Teacher', emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}', max: 3 },
  { value: 'business', label: 'Business', emoji: '\u{1F4BC}', max: 3 },
  { value: 'educational', label: 'Educational', emoji: '\u{1F393}', max: 3 },
] as const;

const COLOR_PRESETS = [
  '#059669', '#0891b2', '#7c3aed', '#db2777',
  '#ea580c', '#ca8a04', '#16a34a', '#2563eb',
  '#dc2626', '#64748b',
];

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

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        Color
      </label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`h-8 w-8 rounded-full border-2 transition-all ${
              value === color
                ? 'scale-110 border-[#1B2A4A] ring-2 ring-[#1B2A4A]/20'
                : 'border-gray-200 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
      {value && (
        <p className="mt-1.5 text-xs text-gray-500">
          Selected: <span className="font-mono font-medium">{value}</span>
        </p>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [data, setData] = useState<CommunityItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('parent_teacher');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CommunityItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [sectionValue, setSectionValue] = useState('parent_teacher');
  const [colorValue, setColorValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<CommunityItem | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllCommunityItems();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = data.filter((item) => item.section === activeTab);

  function getSectionCount(sectionValue: string) {
    return data.filter((item) => item.section === sectionValue).length;
  }

  function getSectionConfig(sectionValue: string) {
    return SECTIONS.find((s) => s.value === sectionValue);
  }

  function isSectionFull(sectionVal: string) {
    const config = getSectionConfig(sectionVal);
    if (!config) return false;
    return getSectionCount(sectionVal) >= config.max;
  }

  const activeSection = getSectionConfig(activeTab);
  const activeCount = getSectionCount(activeTab);
  const activeSectionFull = activeSection ? activeCount >= activeSection.max : false;

  function handleEdit(item: CommunityItem) {
    setEditingItem(item);
    setImageUrl(item.image || '');
    setSectionValue(item.section);
    setColorValue(item.color || '');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setSectionValue(activeTab);
    setColorValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setSectionValue(activeTab);
    setColorValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set('image', imageUrl);
    formData.set('section', sectionValue);
    formData.set('color', colorValue);

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
    setColorValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: CommunityItem) {
    await deleteCommunityItem(item.id);
    setDeletingItem(null);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderCommunityItem(id, direction);
    await loadData();
  }

  const emptyMessages: Record<string, string> = {
    parent_teacher: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467} No parent-teacher items yet',
    business: '\u{1F4BC} No business partnerships yet',
    educational: '\u{1F393} No educational partnerships yet',
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B2A4A]">
              <span className="mr-2">{'\u{1F91D}'}</span>Community
            </h1>
            {data.length > 0 && (
              <span className="rounded-full bg-[#059669]/10 px-3 py-0.5 text-xs font-semibold text-[#059669]">
                {data.length} total
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Community partnerships and involvement &mdash; shown on the Admissions page
          </p>
        </div>
        {!isFormOpen && (
          activeSectionFull ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
              Maximum {activeSection?.max} items reached
            </span>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857]"
            >
              <PlusIcon className="h-4 w-4" />
              Add Item
            </button>
          )
        )}
      </div>

      {/* Section Tabs */}
      <div className="mt-6 flex gap-1 rounded-2xl bg-emerald-50/50 p-1.5">
        {SECTIONS.map((section) => {
          const count = getSectionCount(section.value);
          return (
            <button
              key={section.value}
              type="button"
              onClick={() => setActiveTab(section.value)}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                activeTab === section.value
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-emerald-50'
              }`}
            >
              <span className="mr-1">{section.emoji}</span>
              {section.label}
              <span className={`ml-1.5 text-xs ${
                activeTab === section.value ? 'text-white/80' : 'text-gray-400'
              }`}>
                {count}/{section.max}
              </span>
            </button>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {isFormOpen && (
        <form
          ref={formRef}
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-2xl border border-gray-200 border-t-4 border-t-[#059669] bg-white p-6 shadow-md shadow-black/5"
        >
          <h2 className="mb-5 font-[family-name:var(--font-display)] text-lg font-semibold text-[#1B2A4A]">
            {editingItem ? '\u{1F91D} Edit Item' : '\u{1F91D} Add New Item'}
          </h2>

          <div className="grid gap-5">
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

            {/* Section Button Group */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Section <span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {SECTIONS.map((section) => {
                  const count = getSectionCount(section.value);
                  const isSelected = sectionValue === section.value;
                  const isFull = count >= section.max;
                  const isEditingSameSection = editingItem?.section === section.value;
                  const disabled = isFull && !isEditingSameSection;

                  return (
                    <button
                      key={section.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSectionValue(section.value)}
                      className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[#059669] text-white shadow-sm'
                          : disabled
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'bg-gray-50 text-gray-600 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="mr-1">{section.emoji}</span>
                      {section.label}
                      <span className={`ml-1 text-xs ${
                        isSelected ? 'text-white/80' : 'text-gray-400'
                      }`}>
                        {count}/{section.max}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.section && (
                <p className="mt-1 text-sm text-red-600">{errors.section[0]}</p>
              )}
            </div>

            {/* Color Picker */}
            <ColorPicker value={colorValue} onChange={setColorValue} />
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color[0]}</p>
            )}

            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image
              </label>
              <div className="flex items-start gap-4">
                <div className="flex h-24 w-36 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                  {imageUrl ? (
                    <SmartImage
                      src={imageUrl}
                      alt="Preview"
                      width={144}
                      height={96}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-gray-300">{'\u{1F5BC}\uFE0F'}</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
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

      {/* Item Cards Grid */}
      {filteredData.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredData.map((item) => {
            const sectionConfig = getSectionConfig(item.section);
            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-2xl bg-white shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                {/* Card Body */}
                <div className="flex flex-1 gap-4 p-4">
                  {/* Image (if present) */}
                  {item.image && (
                    <div className="shrink-0">
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        width={96}
                        height={96}
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start gap-2">
                      {item.color && (
                        <span
                          className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <h3 className="font-semibold text-[#1B2A4A] leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-500 leading-relaxed">
                      {item.description}
                    </p>
                    {sectionConfig && (
                      <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-[#059669]">
                        {sectionConfig.emoji} {sectionConfig.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center gap-1 border-t border-gray-100 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => handleReorder(item.id, 'up')}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#059669]"
                    title="Move up"
                  >
                    <ChevronUpIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(item.id, 'down')}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#059669]"
                    title="Move down"
                  >
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#059669]"
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16">
          <p className="text-lg text-gray-400">
            {emptyMessages[activeTab] || 'No items yet'}
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Add items to build this section
          </p>
          {!activeSectionFull && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#047857]"
            >
              <PlusIcon className="h-4 w-4" />
              Add Item
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#1B2A4A]">
              Remove Item
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Remove &lsquo;<strong>{deletingItem.title}</strong>&rsquo;? This can&apos;t be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deletingItem)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
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
