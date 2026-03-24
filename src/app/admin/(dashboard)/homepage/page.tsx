'use client';

import { useEffect, useState } from 'react';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import EmojiPicker from '@/components/admin/EmojiPicker';
import IconPicker from '@/components/admin/IconPicker';
import SmartImage from '@/components/SmartImage';
import { getIcon } from '@/lib/icons';
import {
  getAllStats,
  createStat,
  updateStat,
  deleteStat,
  reorderStat,
  getAllHomepageFeatures,
  createHomepageFeature,
  updateHomepageFeature,
  deleteHomepageFeature,
  reorderHomepageFeature,
  getAllSchoolLifeItems,
  createSchoolLifeItem,
  updateSchoolLifeItem,
  deleteSchoolLifeItem,
  reorderSchoolLifeItem,
  getPrincipalMessage,
  updatePrincipalMessage,
} from '@/lib/actions/homepage';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stat {
  id: number;
  label: string;
  value: string;
  suffix: string | null;
  emoji: string;
  sortOrder: number;
}

interface HomepageFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
  sortOrder: number;
}

interface SchoolLifeItem {
  id: number;
  title: string;
  icon: string;
  image: string;
  sortOrder: number;
}

type ActiveTab = 'stats' | 'features' | 'schoolLife' | 'principal';

// ─── Shared UI Helpers ──────────────────────────────────────────────────────

function CardActionBar({
  id,
  index,
  total,
  onEdit,
  onDelete,
  onReorder,
}: {
  id: number;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onReorder: (id: number, direction: 'up' | 'down') => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => onReorder(id, 'up')}
          disabled={index === 0}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          aria-label="Move up"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onReorder(id, 'down')}
          disabled={index === total - 1}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          aria-label="Move down"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          aria-label="Edit"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
          aria-label="Delete"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function FormPanel({
  title,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
  children,
}: {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  children: React.ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-5 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md shadow-black/5"
    >
      <div className="h-1 bg-[#FF6B35]" />
      <div className="p-6">
        <h3 className="mb-5 text-base font-bold text-[#1B2A4A]">{title}</h3>
        {children}
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

function EmptyState({ emoji, message }: { emoji: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 py-16">
      <span className="text-5xl">{emoji}</span>
      <p className="mt-4 text-sm font-medium text-gray-500">{message}</p>
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#FF6B35]/10 px-2 text-xs font-bold text-[#FF6B35]">
      {count}
    </span>
  );
}

// ─── Stats Section ───────────────────────────────────────────────────────────

function StatsSection() {
  const [data, setData] = useState<Stat[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Stat | null>(null);
  const [emojiValue, setEmojiValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllStats();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(stat: Stat) {
    setEditingItem(stat);
    setEmojiValue(stat.emoji);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setEmojiValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setEmojiValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      label: formData.get('label') as string,
      value: formData.get('value') as string,
      suffix: (formData.get('suffix') as string) || undefined,
      emoji: emojiValue,
    };

    const result = editingItem
      ? await updateStat(editingItem.id, payload)
      : await createStat(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setEmojiValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(id: number) {
    await deleteStat(id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderStat(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#1B2A4A]">School Stats</h2>
          <CountBadge count={data.length} />
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md"
          >
            + Add Stat
          </button>
        )}
      </div>

      {isFormOpen && (
        <FormPanel
          key={editingItem?.id ?? 'new'}
          title={editingItem ? 'Edit Stat' : 'Add New Stat'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel={editingItem ? 'Update Stat' : 'Add Stat'}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Label"
              name="label"
              required
              value={editingItem?.label}
              error={errors.label?.[0]}
              placeholder="e.g. Students"
            />
            <FormField
              label="Value"
              name="value"
              required
              value={editingItem?.value}
              error={errors.value?.[0]}
              placeholder="e.g. 500"
            />
            <FormField
              label="Suffix"
              name="suffix"
              value={editingItem?.suffix ?? ''}
              error={errors.suffix?.[0]}
              placeholder="e.g. +"
            />
            <EmojiPicker
              label="Emoji"
              value={emojiValue}
              onChange={setEmojiValue}
              error={errors.emoji?.[0]}
            />
          </div>
        </FormPanel>
      )}

      <div className="mt-5">
        {data.length === 0 && !isFormOpen ? (
          <EmptyState emoji="📊" message="No stats yet — add your first school statistic" />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {data.map((stat, index) => (
              <div
                key={stat.id}
                className="group rounded-2xl bg-white p-4 shadow-md shadow-black/5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                    <span className="text-3xl">{stat.emoji}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#1B2A4A]">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-[#FF6B35]">{stat.suffix}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">{stat.label}</p>
                </div>
                <CardActionBar
                  id={stat.id}
                  index={index}
                  total={data.length}
                  onEdit={() => handleEdit(stat)}
                  onDelete={() => handleDelete(stat.id)}
                  onReorder={handleReorder}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Homepage Features Section ───────────────────────────────────────────────

function FeaturesSection() {
  const [data, setData] = useState<HomepageFeature[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomepageFeature | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [iconValue, setIconValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllHomepageFeatures();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(feature: HomepageFeature) {
    setEditingItem(feature);
    setImageUrl(feature.image);
    setIconValue(feature.icon);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setIconValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setIconValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      icon: iconValue,
      image: imageUrl,
    };

    const result = editingItem
      ? await updateHomepageFeature(editingItem.id, payload)
      : await createHomepageFeature(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setIconValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(id: number) {
    await deleteHomepageFeature(id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderHomepageFeature(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#1B2A4A]">Why We&apos;re Different</h2>
          <CountBadge count={data.length} />
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md"
          >
            + Add Feature
          </button>
        )}
      </div>

      {isFormOpen && (
        <FormPanel
          key={editingItem?.id ?? 'new-feature'}
          title={editingItem ? 'Edit Feature' : 'Add New Feature'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel={editingItem ? 'Update Feature' : 'Add Feature'}
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Title"
                name="title"
                required
                value={editingItem?.title}
                error={errors.title?.[0]}
                placeholder="e.g. Modern Classrooms"
              />
              <IconPicker
                label="Icon"
                value={iconValue}
                onChange={setIconValue}
                error={errors.icon?.[0]}
              />
            </div>
            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              value={editingItem?.description}
              error={errors.description?.[0]}
              placeholder="Describe this feature..."
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                Image<span className="ml-0.5 text-red-500">*</span>
              </label>
              {imageUrl && (
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <SmartImage
                    src={imageUrl}
                    alt="Feature preview"
                    width={400}
                    height={160}
                    className="h-40 w-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-sm hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}
              <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
              )}
            </div>
          </div>
        </FormPanel>
      )}

      <div className="mt-5">
        {data.length === 0 && !isFormOpen ? (
          <EmptyState emoji="✨" message="No features yet — highlight what makes your school different" />
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {data.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <div
                  key={feature.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
                >
                  {feature.image && (
                    <div className="relative h-32 w-full overflow-hidden">
                      <SmartImage
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      {Icon && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100">
                          <Icon className="h-4 w-4 text-[#14B8A6]" />
                        </div>
                      )}
                      <h3 className="font-bold text-[#1B2A4A]">{feature.title}</h3>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {feature.description}
                    </p>
                    <CardActionBar
                      id={feature.id}
                      index={index}
                      total={data.length}
                      onEdit={() => handleEdit(feature)}
                      onDelete={() => handleDelete(feature.id)}
                      onReorder={handleReorder}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── School Life Section ─────────────────────────────────────────────────────

function SchoolLifeSection() {
  const [data, setData] = useState<SchoolLifeItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolLifeItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [iconValue, setIconValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadData() {
    const items = await getAllSchoolLifeItems();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(sli: SchoolLifeItem) {
    setEditingItem(sli);
    setImageUrl(sli.image);
    setIconValue(sli.icon);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setIconValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setIconValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get('title') as string,
      icon: iconValue,
      image: imageUrl,
    };

    const result = editingItem
      ? await updateSchoolLifeItem(editingItem.id, payload)
      : await createSchoolLifeItem(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setIconValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(id: number) {
    await deleteSchoolLifeItem(id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderSchoolLifeItem(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#1B2A4A]">School Life</h2>
          <CountBadge count={data.length} />
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-xl bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md"
          >
            + Add Item
          </button>
        )}
      </div>

      {isFormOpen && (
        <FormPanel
          key={editingItem?.id ?? 'new-school-life'}
          title={editingItem ? 'Edit School Life Item' : 'Add School Life Item'}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel={editingItem ? 'Update Item' : 'Add Item'}
        >
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Title"
                name="title"
                required
                value={editingItem?.title}
                error={errors.title?.[0]}
                placeholder="e.g. Sports Day"
              />
              <IconPicker
                label="Icon"
                value={iconValue}
                onChange={setIconValue}
                error={errors.icon?.[0]}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
                Image<span className="ml-0.5 text-red-500">*</span>
              </label>
              {imageUrl && (
                <div className="relative mb-3 overflow-hidden rounded-xl">
                  <SmartImage
                    src={imageUrl}
                    alt="School life preview"
                    width={400}
                    height={160}
                    className="h-40 w-full object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-sm hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}
              <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
              )}
            </div>
          </div>
        </FormPanel>
      )}

      <div className="mt-5">
        {data.length === 0 && !isFormOpen ? (
          <EmptyState emoji="🎒" message="No school life items yet — showcase student activities" />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    {item.image ? (
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-50">
                        <span className="text-3xl text-orange-200">🖼️</span>
                      </div>
                    )}
                    {Icon && (
                      <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                        <Icon className="h-4 w-4 text-[#14B8A6]" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-center text-sm font-bold text-[#1B2A4A]">
                      {item.title}
                    </h3>
                    <CardActionBar
                      id={item.id}
                      index={index}
                      total={data.length}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                      onReorder={handleReorder}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Principal Message Section ───────────────────────────────────────────────

function PrincipalMessageSection() {
  const [principalMessage, setPrincipalMessage] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalImage, setPrincipalImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getPrincipalMessage();
      setPrincipalMessage(data.principal_message || '');
      setPrincipalName(data.principal_name || '');
      setPrincipalImage(data.principal_image || '');
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSaved(false);

    const result = await updatePrincipalMessage({
      principal_message: principalMessage,
      principal_name: principalName,
      principal_image: principalImage,
    });

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-[#1B2A4A]">Principal&apos;s Message</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md shadow-black/5"
      >
        <div className="h-1 bg-[#FF6B35]" />
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            {/* Left column: Photo */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-orange-100 bg-orange-50">
                {principalImage ? (
                  <SmartImage
                    src={principalImage}
                    alt="Principal"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-4xl">👨‍🏫</span>
                  </div>
                )}
              </div>
              <ImageUpload value={principalImage} onChange={setPrincipalImage} hidePreview />
              {errors.principal_image && (
                <p className="text-sm text-red-600">{errors.principal_image[0]}</p>
              )}
            </div>

            {/* Right column: Name & Message */}
            <div className="grid gap-4">
              <div>
                <label
                  htmlFor="principal_name"
                  className="mb-1.5 block text-sm font-medium text-[#1B2A4A]"
                >
                  Principal Name<span className="ml-0.5 text-red-500">*</span>
                </label>
                <input
                  id="principal_name"
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  required
                  placeholder="e.g. Dr. Ram Sharma"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
                {errors.principal_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.principal_name[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="principal_message"
                  className="mb-1.5 block text-sm font-medium text-[#1B2A4A]"
                >
                  Message<span className="ml-0.5 text-red-500">*</span>
                </label>
                <textarea
                  id="principal_message"
                  value={principalMessage}
                  onChange={(e) => setPrincipalMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Write the principal's message..."
                  className="w-full resize-y rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
                />
                {errors.principal_message && (
                  <p className="mt-1 text-sm text-red-600">{errors.principal_message[0]}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF6B35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#e55a2b] hover:shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Saved!
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const tabs: { key: ActiveTab; label: string }[] = [
  { key: 'stats', label: '📊 Stats' },
  { key: 'features', label: '✨ Features' },
  { key: 'schoolLife', label: '🎒 School Life' },
  { key: 'principal', label: '👨‍🏫 Principal' },
];

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stats');

  return (
    <div>
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B2A4A]">
          🏠 Homepage
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage the content visitors see first on your website
        </p>
      </div>

      {/* Pill Tabs */}
      <div className="mt-6 rounded-2xl bg-orange-50/50 p-1.5">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-[#FF6B35] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-[#FF6B35]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'stats' && <StatsSection />}
        {activeTab === 'features' && <FeaturesSection />}
        {activeTab === 'schoolLife' && <SchoolLifeSection />}
        {activeTab === 'principal' && <PrincipalMessageSection />}
      </div>
    </div>
  );
}
