'use client';

import { useEffect, useState } from 'react';
import FormField from '@/components/admin/FormField';
import EmojiPicker from '@/components/admin/EmojiPicker';
import IconPicker from '@/components/admin/IconPicker';
import { getIcon } from '@/lib/icons';
import {
  getAllCoreValues,
  createCoreValue,
  updateCoreValue,
  deleteCoreValue,
  reorderCoreValue,
  getAllPhilosophies,
  createPhilosophy,
  updatePhilosophy,
  deletePhilosophy,
  reorderPhilosophy,
  getMissionVision,
  updateMissionVision,
} from '@/lib/actions/about';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CoreValue {
  id: number;
  title: string;
  icon: string;
  emoji: string;
  color: string;
  sortOrder: number;
}

interface Philosophy {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
  sortOrder: number;
}

type ActiveTab = 'coreValues' | 'philosophy' | 'missionVision';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function PlusIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function PencilIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function TrashIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function ChevronUpIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// ─── Color Picker ────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Purple', hex: '#9333ea' },
  { name: 'Teal', hex: '#0d9488' },
  { name: 'Orange', hex: '#ea580c' },
  { name: 'Pink', hex: '#db2777' },
  { name: 'Amber', hex: '#d97706' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Cyan', hex: '#0891b2' },
];

function ColorPicker({
  value,
  onChange,
  label,
  error,
}: {
  value: string;
  onChange: (hex: string) => void;
  label?: string;
  error?: string;
}) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.hex}
            type="button"
            onClick={() => onChange(preset.hex)}
            title={preset.name}
            className={`h-8 w-8 rounded-full border-2 transition-all hover:scale-110 ${
              value === preset.hex
                ? 'border-[#1B2A4A] ring-2 ring-[#14B8A6]/40 scale-110'
                : 'border-transparent hover:border-gray-300'
            }`}
            style={{ backgroundColor: preset.hex }}
          />
        ))}
      </div>
      {value && (
        <p className="mt-1.5 text-xs text-gray-500">
          Selected: <span className="font-mono font-medium">{value}</span>
          <span
            className="ml-1.5 inline-block h-3 w-3 rounded-full align-middle"
            style={{ backgroundColor: value }}
          />
        </p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

// ─── Core Values Section ─────────────────────────────────────────────────────

function CoreValuesSection() {
  const [data, setData] = useState<CoreValue[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CoreValue | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconValue, setIconValue] = useState('');
  const [emojiValue, setEmojiValue] = useState('');
  const [colorValue, setColorValue] = useState('');

  async function loadData() {
    const items = await getAllCoreValues();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: CoreValue) {
    setEditingItem(item);
    setIconValue(item.icon || '');
    setEmojiValue(item.emoji || '');
    setColorValue(item.color || '');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setIconValue('');
    setEmojiValue('');
    setColorValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setIconValue('');
    setEmojiValue('');
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
      icon: iconValue,
      emoji: emojiValue,
      color: colorValue,
    };

    const result = editingItem
      ? await updateCoreValue(editingItem.id, payload)
      : await createCoreValue(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setIconValue('');
    setEmojiValue('');
    setColorValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this core value?')) return;
    await deleteCoreValue(id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderCoreValue(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Core Values</h2>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${data.length >= 10 ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
            {data.length}/10
          </span>
        </div>
        {!isFormOpen && data.length < 10 && (
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d9488] hover:shadow-md"
          >
            <PlusIcon className="h-4 w-4" />
            Add Core Value
          </button>
        )}
        {!isFormOpen && data.length >= 10 && (
          <span className="text-xs text-gray-400">Maximum 10 core values reached</span>
        )}
      </div>

      {/* Form */}
      {isFormOpen && (
        <form
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-gray-100 border-t-4 border-t-[#14B8A6] bg-white p-6 shadow-sm"
        >
          <h3 className="mb-5 text-base font-semibold text-[#1B2A4A]">
            {editingItem ? 'Edit Core Value' : 'Add Core Value'}
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Title"
              name="title"
              required
              value={editingItem?.title}
              error={errors.title?.[0]}
              placeholder="e.g. Integrity"
            />
            <IconPicker
              label="Icon"
              value={iconValue}
              onChange={setIconValue}
              error={errors.icon?.[0]}
            />
            <EmojiPicker
              label="Emoji"
              value={emojiValue}
              onChange={setEmojiValue}
              error={errors.emoji?.[0]}
            />
            <ColorPicker
              label="Color"
              value={colorValue}
              onChange={setColorValue}
              error={errors.color?.[0]}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#14B8A6] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d9488] hover:shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Value' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid */}
      {data.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16">
          <span className="text-4xl">💎</span>
          <p className="mt-3 text-sm font-medium text-gray-500">No core values yet</p>
          <p className="mt-1 text-xs text-gray-400">Click &quot;Add Core Value&quot; to get started</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item, index) => {
            const IconComponent = getIcon(item.icon);
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-white p-4 shadow-sm shadow-gray-200/80 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Icon circle with emoji badge */}
                <div className="relative mb-3 inline-block">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ backgroundColor: item.color ? `${item.color}20` : '#14B8A620' }}
                  >
                    {IconComponent ? (
                      <IconComponent
                        className="h-6 w-6"
                        style={{ color: item.color || '#14B8A6' }}
                      />
                    ) : (
                      <span className="text-lg">{item.emoji}</span>
                    )}
                  </div>
                  {item.emoji && IconComponent && (
                    <span className="absolute -right-1 -top-1 text-sm">{item.emoji}</span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#1B2A4A]">{item.title}</h3>

                {/* Color dot */}
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color || '#14B8A6' }}
                  />
                  <span className="text-[10px] font-mono text-gray-400">{item.color}</span>
                </div>

                {/* Action bar */}
                <div className="mt-3 flex items-center gap-1 border-t border-gray-100 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleReorder(item.id, 'up')}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-[#14B8A6] disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUpIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(item.id, 'down')}
                    disabled={index === data.length - 1}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-[#14B8A6] disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDownIcon />
                  </button>
                  <div className="flex-1" />
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-[#14B8A6]"
                    title="Edit"
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Delete"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Philosophy Section ──────────────────────────────────────────────────────

function PhilosophySection() {
  const [data, setData] = useState<Philosophy[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Philosophy | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiValue, setEmojiValue] = useState('');
  const [colorValue, setColorValue] = useState('');

  async function loadData() {
    const items = await getAllPhilosophies();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Philosophy) {
    setEditingItem(item);
    setEmojiValue(item.emoji || '');
    setColorValue(item.color || '');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setEmojiValue('');
    setColorValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setEmojiValue('');
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
      description: formData.get('description') as string,
      emoji: emojiValue,
      color: colorValue,
    };

    const result = editingItem
      ? await updatePhilosophy(editingItem.id, payload)
      : await createPhilosophy(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setEmojiValue('');
    setColorValue('');
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this philosophy item?')) return;
    await deletePhilosophy(id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderPhilosophy(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Philosophy</h2>
          <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${data.length >= 5 ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-teal-600'}`}>
            {data.length}/5
          </span>
        </div>
        {!isFormOpen && data.length < 5 && (
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-xl bg-[#14B8A6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d9488] hover:shadow-md"
          >
            <PlusIcon className="h-4 w-4" />
            Add Philosophy
          </button>
        )}
        {!isFormOpen && data.length >= 5 && (
          <span className="text-xs text-gray-400">Maximum 5 philosophy items reached</span>
        )}
      </div>

      {/* Form */}
      {isFormOpen && (
        <form
          key={editingItem?.id ?? 'new'}
          onSubmit={handleSubmit}
          className="mt-5 rounded-2xl border border-gray-100 border-t-4 border-t-[#14B8A6] bg-white p-6 shadow-sm"
        >
          <h3 className="mb-5 text-base font-semibold text-[#1B2A4A]">
            {editingItem ? 'Edit Philosophy' : 'Add Philosophy'}
          </h3>
          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                label="Title"
                name="title"
                required
                value={editingItem?.title}
                error={errors.title?.[0]}
                placeholder="e.g. Holistic Development"
              />
              <EmojiPicker
                label="Emoji"
                value={emojiValue}
                onChange={setEmojiValue}
                error={errors.emoji?.[0]}
              />
            </div>
            <FormField
              label="Description"
              name="description"
              type="textarea"
              required
              value={editingItem?.description}
              error={errors.description?.[0]}
              placeholder="Describe this philosophy..."
            />
            <ColorPicker
              label="Color"
              value={colorValue}
              onChange={setColorValue}
              error={errors.color?.[0]}
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#14B8A6] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d9488] hover:shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Philosophy' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid */}
      {data.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16">
          <span className="text-4xl">🌿</span>
          <p className="mt-3 text-sm font-medium text-gray-500">No philosophy items yet</p>
          <p className="mt-1 text-xs text-gray-400">Click &quot;Add Philosophy&quot; to get started</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-2xl bg-white p-5 shadow-sm shadow-gray-200/80 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Emoji & color dot */}
              <div className="mb-3 flex items-start justify-between">
                <span className="text-2xl">{item.emoji}</span>
                <span
                  className="mt-1 inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color || '#14B8A6' }}
                />
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-[#1B2A4A]">{item.title}</h3>

              {/* Description (2-line truncated) */}
              <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>

              {/* Action bar */}
              <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => handleReorder(item.id, 'up')}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-[#14B8A6] disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUpIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(item.id, 'down')}
                  disabled={index === data.length - 1}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-[#14B8A6] disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDownIcon />
                </button>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-teal-50 hover:text-[#14B8A6]"
                  title="Edit"
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mission & Vision Section ────────────────────────────────────────────────

function MissionVisionSection() {
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getMissionVision();
      setMission(data.mission || '');
      setVision(data.vision || '');
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSaved(false);

    const result = await updateMissionVision({ mission, vision });

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
      <h2 className="text-lg font-semibold text-[#1B2A4A]">Mission & Vision</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-2xl border border-gray-100 border-t-4 border-t-[#14B8A6] bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mission Card */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <h3 className="text-sm font-bold text-[#1B2A4A]">Mission</h3>
            </div>
            <label htmlFor="mission" className="sr-only">Mission</label>
            <textarea
              id="mission"
              value={mission}
              onChange={(e) => { if (e.target.value.length <= 500) setMission(e.target.value); }}
              required
              maxLength={500}
              rows={6}
              placeholder="Write the school's mission statement..."
              className="w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.mission ? (
                <p className="text-sm text-red-600">{errors.mission[0]}</p>
              ) : <span />}
              <span className={`text-xs ${mission.length >= 450 ? 'text-amber-500' : 'text-gray-400'}`}>
                {mission.length}/500
              </span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">👁️</span>
              <h3 className="text-sm font-bold text-[#1B2A4A]">Vision</h3>
            </div>
            <label htmlFor="vision" className="sr-only">Vision</label>
            <textarea
              id="vision"
              value={vision}
              onChange={(e) => { if (e.target.value.length <= 500) setVision(e.target.value); }}
              required
              maxLength={500}
              rows={6}
              placeholder="Write the school's vision statement..."
              className="w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#1B2A4A] placeholder-gray-400 outline-none transition-all focus:border-[#14B8A6] focus:ring-2 focus:ring-[#14B8A6]/20"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.vision ? (
                <p className="text-sm text-red-600">{errors.vision[0]}</p>
              ) : <span />}
              <span className={`text-xs ${vision.length >= 450 ? 'text-amber-500' : 'text-gray-400'}`}>
                {vision.length}/500
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#14B8A6] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0d9488] hover:shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Changes saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'coreValues', label: '💎 Core Values' },
  { key: 'philosophy', label: '🌿 Philosophy' },
  { key: 'missionVision', label: '🎯 Mission & Vision' },
];

export default function AboutAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('coreValues');

  return (
    <div>
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1B2A4A]">
          ℹ️ About Page
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Core values, philosophy, and mission — what defines your school
        </p>
      </div>

      {/* Pill Tabs */}
      <div className="mt-6 rounded-2xl bg-teal-50/50 p-1.5">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#14B8A6] text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-teal-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'coreValues' && <CoreValuesSection />}
        {activeTab === 'philosophy' && <PhilosophySection />}
        {activeTab === 'missionVision' && <MissionVisionSection />}
      </div>
    </div>
  );
}
