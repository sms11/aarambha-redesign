'use client';

import { useEffect, useState } from 'react';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import SmartImage from '@/components/SmartImage';
import IconPicker from '@/components/admin/IconPicker';
import { getIcon } from '@/lib/icons';
import {
  getAllActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  reorderActivity,
  getAllFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  reorderFacility,
  getCounselingPoints,
  updateCounselingPoints,
} from '@/lib/actions/facilities';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Activity {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  color: string;
  section: string;
  sortOrder: number;
}

interface Facility {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  image: string | null;
  category: string;
  icon: string | null;
  color: string | null;
  sortOrder: number;
}

type ActiveTab = 'activities' | 'facilities' | 'counseling';

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

function XIcon() {
  return (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Color Picker (hex presets) ──────────────────────────────────────────────

const HEX_PRESETS = [
  { name: 'Orange', hex: '#FF6B35' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Cyan', hex: '#06B6D4' },
];

function HexColorPicker({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">{label}</label>
      <div className="flex flex-wrap gap-2">
        {HEX_PRESETS.map((c) => {
          const isSelected = value === c.hex;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onChange(c.hex)}
              title={c.name}
              className={`group relative flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-[#F59E0B] ring-2 ring-[#F59E0B]/20 scale-110'
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {isSelected && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
              <span className="pointer-events-none absolute -top-7 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-[#1B2A4A] px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100">
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
      {value && (
        <div className="mt-1.5 flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded border border-gray-200" style={{ backgroundColor: value }} />
          <span className="text-xs text-gray-400">{value}</span>
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ─── Category Options ────────────────────────────────────────────────────────

const categoryOptions = [
  { label: 'Resource', value: 'resource', emoji: '\u{1F4DA}' },
  { label: 'Lab', value: 'lab', emoji: '\u{1F52C}' },
  { label: 'Digital', value: 'digital', emoji: '\u{1F4BB}' },
  { label: 'Health', value: 'health', emoji: '\u2764\uFE0F' },
  { label: 'Convenience', value: 'convenience', emoji: '\u{1F68C}' },
];

const categoryHeaders: Record<string, string> = {
  resource: '\u{1F4DA} Resources',
  lab: '\u{1F52C} Labs',
  digital: '\u{1F4BB} Digital',
  health: '\u2764\uFE0F Health',
  convenience: '\u{1F68C} Convenience',
};

// ─── Activities Section ──────────────────────────────────────────────────────

function ActivitiesSection() {
  const [data, setData] = useState<Activity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Activity | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [colorValue, setColorValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllActivities();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(act: Activity) {
    setEditingItem(act);
    setImageUrl(act.image);
    setColorValue(act.color);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setColorValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setColorValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      tag: formData.get('tag') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: imageUrl,
      color: colorValue,
      section: formData.get('section') as string,
    };

    const result = editingItem
      ? await updateActivity(editingItem.id, payload)
      : await createActivity(payload);

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

  async function handleDelete(act: Activity) {
    if (!window.confirm(`Delete "${act.title}"? This action cannot be undone.`)) return;
    await deleteActivity(act.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderActivity(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Activities</h2>
          <span className="rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#F59E0B]">
            {data.length}
          </span>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            <PlusIcon />
            Add Activity
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-5 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
        >
          <div className="h-1 bg-[#F59E0B]" />
          <div className="p-6">
            <h3 className="mb-5 text-base font-bold text-[#1B2A4A]">
              {editingItem ? 'Edit Activity' : 'New Activity'}
            </h3>
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Title"
                  name="title"
                  required
                  value={editingItem?.title}
                  error={errors.title?.[0]}
                  placeholder="e.g. Football Training"
                />
                <FormField
                  label="Tag"
                  name="tag"
                  required
                  value={editingItem?.tag}
                  error={errors.tag?.[0]}
                  placeholder="e.g. Sports"
                />
              </div>
              <FormField
                label="Description"
                name="description"
                type="textarea"
                required
                value={editingItem?.description}
                error={errors.description?.[0]}
                placeholder="Describe the activity..."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Section"
                  name="section"
                  required
                  value={editingItem?.section}
                  error={errors.section?.[0]}
                  placeholder="e.g. sports"
                />
                <HexColorPicker
                  label="Color"
                  value={colorValue}
                  onChange={setColorValue}
                  error={errors.color?.[0]}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Image<span className="ml-0.5 text-red-500">*</span>
                </label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
                {imageUrl && (
                  <div className="relative mt-3 h-36 w-full overflow-hidden rounded-xl border border-amber-100">
                    <SmartImage
                      src={imageUrl}
                      alt="Activity preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingItem ? 'Update Activity' : 'Add Activity'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {data.length === 0 && !isFormOpen ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 py-16 text-center">
          <span className="text-4xl">&#x1F3C3;</span>
          <p className="mt-3 text-sm font-medium text-gray-500">
            No activities yet &mdash; add student activities
          </p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.map((act, idx) => (
            <div
              key={act.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md shadow-amber-100/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-100"
            >
              {/* Image */}
              <div className="relative h-36 w-full overflow-hidden">
                <SmartImage
                  src={act.image}
                  alt={act.title}
                  fill
                  className="rounded-t-2xl object-cover"
                />
                {/* Tag badge */}
                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-gray-700 backdrop-blur">
                  {act.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-[#1B2A4A]">{act.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{act.description}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: act.color }}
                  />
                  {act.section}
                </div>

                {/* Action bar */}
                <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleReorder(act.id, 'up')}
                    disabled={idx === 0}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B] disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUpIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(act.id, 'down')}
                    disabled={idx === data.length - 1}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B] disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDownIcon />
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => handleEdit(act)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B]"
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(act)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Facilities Section ──────────────────────────────────────────────────────

function FacilitiesSection() {
  const [data, setData] = useState<Facility[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Facility | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [categoryValue, setCategoryValue] = useState('resource');
  const [iconValue, setIconValue] = useState('');
  const [colorValue, setColorValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllFacilities();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(fac: Facility) {
    setEditingItem(fac);
    setImageUrl(fac.image || '');
    setCategoryValue(fac.category);
    setIconValue(fac.icon || '');
    setColorValue(fac.color || '');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setCategoryValue('resource');
    setIconValue('');
    setColorValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setCategoryValue('resource');
    setIconValue('');
    setColorValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title') as string,
      subtitle: (formData.get('subtitle') as string) || undefined,
      description: formData.get('description') as string,
      image: imageUrl || undefined,
      category: categoryValue,
      icon: iconValue || undefined,
      color: colorValue || undefined,
    };

    const result = editingItem
      ? await updateFacility(editingItem.id, payload)
      : await createFacility(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setCategoryValue('resource');
    setIconValue('');
    setColorValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(fac: Facility) {
    if (!window.confirm(`Delete "${fac.title}"? This action cannot be undone.`)) return;
    await deleteFacility(fac.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderFacility(id, direction);
    await loadData();
  }

  // Group facilities by category in display order
  const categoryOrder = ['resource', 'lab', 'digital', 'health', 'convenience'];
  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      header: categoryHeaders[cat],
      items: data.filter((f) => f.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Facilities</h2>
          <span className="rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#F59E0B]">
            {data.length}
          </span>
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            <PlusIcon />
            Add Facility
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-5 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
        >
          <div className="h-1 bg-[#F59E0B]" />
          <div className="p-6">
            <h3 className="mb-5 text-base font-bold text-[#1B2A4A]">
              {editingItem ? 'Edit Facility' : 'New Facility'}
            </h3>
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Title"
                  name="title"
                  required
                  value={editingItem?.title}
                  error={errors.title?.[0]}
                  placeholder="e.g. Science Lab"
                />
                <FormField
                  label="Subtitle"
                  name="subtitle"
                  value={editingItem?.subtitle ?? ''}
                  error={errors.subtitle?.[0]}
                  placeholder="e.g. State-of-the-art equipment"
                />
              </div>
              <FormField
                label="Description"
                name="description"
                type="textarea"
                required
                value={editingItem?.description}
                error={errors.description?.[0]}
                placeholder="Describe the facility..."
              />

              {/* Category button group */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Category<span className="ml-0.5 text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategoryValue(cat.value)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                        categoryValue === cat.value
                          ? 'bg-[#F59E0B] text-white shadow-md shadow-amber-200 scale-105'
                          : 'bg-amber-50 text-gray-600 hover:bg-amber-100'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category[0]}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <IconPicker
                  label="Icon (optional)"
                  value={iconValue}
                  onChange={setIconValue}
                />
                <HexColorPicker
                  label="Color (optional)"
                  value={colorValue}
                  onChange={setColorValue}
                  error={errors.color?.[0]}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                  Image
                </label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
                {imageUrl && (
                  <div className="relative mt-3 h-28 w-full overflow-hidden rounded-xl border border-amber-100">
                    <SmartImage
                      src={imageUrl}
                      alt="Facility preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingItem ? 'Update Facility' : 'Add Facility'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {data.length === 0 && !isFormOpen ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 py-16 text-center">
          <span className="text-4xl">&#x1F3D7;&#xFE0F;</span>
          <p className="mt-3 text-sm font-medium text-gray-500">
            No facilities yet &mdash; showcase your campus
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-6">
          {grouped.map((group) => (
            <div key={group.category}>
              <h3 className="mb-3 text-sm font-semibold text-gray-500">{group.header}</h3>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((fac, idx) => {
                  const FacIcon = fac.icon ? getIcon(fac.icon) : null;
                  return (
                    <div
                      key={fac.id}
                      className="group relative overflow-hidden rounded-2xl bg-white shadow-md shadow-amber-100/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-100"
                    >
                      {/* Image or colored placeholder */}
                      {fac.image ? (
                        <div className="relative h-28 w-full overflow-hidden">
                          <SmartImage
                            src={fac.image}
                            alt={fac.title}
                            fill
                            className="rounded-t-2xl object-cover"
                          />
                          {FacIcon && (
                            <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 backdrop-blur">
                              <FacIcon className="h-4 w-4 text-[#1B2A4A]" />
                            </span>
                          )}
                        </div>
                      ) : (
                        <div
                          className="relative flex h-28 w-full items-center justify-center rounded-t-2xl"
                          style={{ backgroundColor: fac.color ? `${fac.color}20` : '#F59E0B20' }}
                        >
                          {FacIcon ? (
                            <FacIcon
                              className="h-10 w-10"
                              style={{ color: fac.color || '#F59E0B' }}
                            />
                          ) : (
                            <span className="text-3xl opacity-40">&#x1F3DB;&#xFE0F;</span>
                          )}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-[#1B2A4A]">{fac.title}</h3>
                          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                            {categoryOptions.find((c) => c.value === fac.category)?.label ?? fac.category}
                          </span>
                        </div>
                        {fac.subtitle && (
                          <p className="mt-0.5 text-sm italic text-gray-400">{fac.subtitle}</p>
                        )}
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{fac.description}</p>

                        {/* Action bar */}
                        <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3">
                          <button
                            type="button"
                            onClick={() => handleReorder(fac.id, 'up')}
                            disabled={idx === 0}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B] disabled:opacity-30"
                            title="Move up"
                          >
                            <ChevronUpIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(fac.id, 'down')}
                            disabled={idx === group.items.length - 1}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B] disabled:opacity-30"
                            title="Move down"
                          >
                            <ChevronDownIcon />
                          </button>
                          <div className="flex-1" />
                          <button
                            type="button"
                            onClick={() => handleEdit(fac)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-amber-50 hover:text-[#F59E0B]"
                            title="Edit"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(fac)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Counseling Points Section ───────────────────────────────────────────────

function CounselingPointsSection() {
  const [points, setPoints] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editPoints, setEditPoints] = useState<string[]>([]);
  const [newPoint, setNewPoint] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getCounselingPoints();
      setPoints(data.length > 0 ? data : []);
    }
    load();
  }, []);

  function startEditing() {
    setEditPoints([...points]);
    setIsEditing(true);
    setSaved(false);
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditPoints([]);
    setNewPoint('');
    setErrors({});
  }

  function addPoint() {
    if (newPoint.trim()) {
      setEditPoints([...editPoints, newPoint.trim()]);
      setNewPoint('');
    }
  }

  function removePoint(index: number) {
    setEditPoints(editPoints.filter((_, i) => i !== index));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPoint();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSaved(false);

    const filtered = editPoints.filter((p) => p.trim() !== '');
    const result = await updateCounselingPoints(filtered);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setPoints(filtered);
    setIsEditing(false);
    setEditPoints([]);
    setNewPoint('');
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Counseling Points</h2>
          <span className="rounded-full bg-[#F59E0B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#F59E0B]">
            {points.length}
          </span>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="flex items-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            <PencilIcon />
            Edit Points
          </button>
        )}
      </div>

      {saved && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Changes saved successfully
        </div>
      )}

      {/* Read-only view */}
      {!isEditing && (
        <div className="mt-5">
          {points.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/30 py-12 text-center">
              <span className="text-4xl">&#x1F49A;</span>
              <p className="mt-3 text-sm font-medium text-gray-500">
                No counseling points yet &mdash; add student wellness information
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
              <div className="h-1 bg-[#F59E0B]" />
              <ol className="divide-y divide-amber-50 p-4">
                {points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/10 text-xs font-bold text-[#F59E0B]">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700">{point}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Editing view */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
        >
          <div className="h-1 bg-[#F59E0B]" />
          <div className="p-6">
            <h3 className="mb-4 text-base font-bold text-[#1B2A4A]">Edit Counseling Points</h3>

            {/* Points as removable pills */}
            <div className="flex flex-wrap gap-2">
              {editPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-gray-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/20 text-[10px] font-bold text-[#F59E0B]">
                    {idx + 1}
                  </span>
                  <span className="max-w-xs truncate">{point}</span>
                  <button
                    type="button"
                    onClick={() => removePoint(idx)}
                    className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-100 hover:text-red-500"
                    title={`Remove: ${point}`}
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>

            {editPoints.length === 0 && (
              <p className="mb-3 text-sm text-gray-400">No points yet. Add one below.</p>
            )}

            {/* Add new point input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newPoint}
                onChange={(e) => setNewPoint(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a counseling point and press Enter..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20"
              />
              <button
                type="button"
                onClick={addPoint}
                disabled={!newPoint.trim()}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-[#F59E0B] transition-colors hover:bg-amber-100 disabled:opacity-40"
              >
                <PlusIcon />
                Add
              </button>
            </div>

            {errors.counseling_points && (
              <p className="mt-2 text-sm text-red-600">{errors.counseling_points[0]}</p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Points'}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TABS: { key: ActiveTab; label: string; emoji: string }[] = [
  { key: 'activities', label: 'Activities', emoji: '\u{1F3C3}' },
  { key: 'facilities', label: 'Facilities', emoji: '\u{1F3D7}\uFE0F' },
  { key: 'counseling', label: 'Counseling', emoji: '\u{1F49A}' },
];

export default function FacilitiesAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('activities');

  return (
    <div>
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B2A4A]">
          &#x1F3EB; Facilities
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Campus activities, resources, and student wellness &mdash; shown on the Facilities page
        </p>
      </div>

      {/* Pill tabs */}
      <div className="mt-6 inline-flex rounded-2xl bg-amber-50/50 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#F59E0B] text-white shadow-md shadow-amber-200'
                : 'bg-white text-gray-600 hover:bg-amber-50'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'activities' && <ActivitiesSection />}
        {activeTab === 'facilities' && <FacilitiesSection />}
        {activeTab === 'counseling' && <CounselingPointsSection />}
      </div>
    </div>
  );
}
