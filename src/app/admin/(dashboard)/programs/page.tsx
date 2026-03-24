'use client';

import { useEffect, useState, useRef } from 'react';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
import SmartImage from '@/components/SmartImage';
import IconPicker from '@/components/admin/IconPicker';
import EmojiPicker from '@/components/admin/EmojiPicker';
import { getIcon } from '@/lib/icons';
import {
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  reorderProgram,
  getAllSpecialFeatures,
  createSpecialFeature,
  updateSpecialFeature,
  deleteSpecialFeature,
  reorderSpecialFeature,
  getAllKeyBenefits,
  createKeyBenefit,
  updateKeyBenefit,
  deleteKeyBenefit,
  reorderKeyBenefit,
} from '@/lib/actions/program';

interface Program {
  id: number;
  name: string;
  ages: string;
  grades: string;
  description: string;
  highlights: string[];
  teaching: string;
  image: string;
  color: string;
  emoji: string;
  sortOrder: number;
}

interface SpecialFeature {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  sortOrder: number;
}

interface KeyBenefit {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  sortOrder: number;
}

const TABS = ['Programs', 'Special Features', 'Key Benefits'] as const;
type TabName = (typeof TABS)[number];

const TAB_EMOJIS: Record<TabName, string> = {
  Programs: '\u{1F393}',
  'Special Features': '\u2B50',
  'Key Benefits': '\u{1F3C6}',
};

const PRESET_COLORS = [
  '#8B5CF6',
  '#FF6B35',
  '#14B8A6',
  '#EC4899',
  '#F59E0B',
  '#3B82F6',
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

// Tailwind color presets for text and bg class selection
const COLOR_PRESETS = [
  { name: 'Blue', text: 'text-blue-600', bg: 'bg-blue-50', hex: '#2563eb', hexLight: '#eff6ff' },
  { name: 'Purple', text: 'text-purple-600', bg: 'bg-purple-50', hex: '#9333ea', hexLight: '#faf5ff' },
  { name: 'Teal', text: 'text-teal-600', bg: 'bg-teal-50', hex: '#0d9488', hexLight: '#f0fdfa' },
  { name: 'Orange', text: 'text-orange-600', bg: 'bg-orange-50', hex: '#ea580c', hexLight: '#fff7ed' },
  { name: 'Pink', text: 'text-pink-600', bg: 'bg-pink-50', hex: '#db2777', hexLight: '#fdf2f8' },
  { name: 'Amber', text: 'text-amber-600', bg: 'bg-amber-50', hex: '#d97706', hexLight: '#fffbeb' },
  { name: 'Emerald', text: 'text-emerald-600', bg: 'bg-emerald-50', hex: '#059669', hexLight: '#ecfdf5' },
  { name: 'Red', text: 'text-red-600', bg: 'bg-red-50', hex: '#dc2626', hexLight: '#fef2f2' },
  { name: 'Indigo', text: 'text-indigo-600', bg: 'bg-indigo-50', hex: '#4f46e5', hexLight: '#eef2ff' },
  { name: 'Cyan', text: 'text-cyan-600', bg: 'bg-cyan-50', hex: '#0891b2', hexLight: '#ecfeff' },
];

function TailwindColorPicker({
  label,
  value,
  onChange,
  type,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: 'text' | 'bg';
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#1B2A4A]">{label}</label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((c) => {
          const val = type === 'text' ? c.text : c.bg;
          const isSelected = value === val;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onChange(val)}
              title={`${c.name} — ${val}`}
              className={`group relative flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/20 scale-110'
                  : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }`}
              style={{
                backgroundColor: type === 'bg' ? c.hexLight : c.hex,
              }}
            >
              {isSelected && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={type === 'bg' ? c.hex : '#fff'} strokeWidth={3}>
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
        <p className="mt-1.5 text-xs text-gray-400">{value}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('Programs');

  return (
    <div>
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
          {'\u{1F393}'} Programs
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Academic programs, features, and benefits &mdash; shown on Homepage and Programs page
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 inline-flex rounded-2xl bg-purple-50/50 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-white text-gray-600 hover:bg-purple-50'
            }`}
          >
            {TAB_EMOJIS[tab]} {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Programs' && <ProgramsSection />}
      {activeTab === 'Special Features' && <SpecialFeaturesSection />}
      {activeTab === 'Key Benefits' && <KeyBenefitsSection />}
    </div>
  );
}

// ─── Programs Section ───────────────────────────────────────────────────────

function ProgramsSection() {
  const [data, setData] = useState<Program[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Program | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colorValue, setColorValue] = useState('#8B5CF6');
  const [emojiValue, setEmojiValue] = useState('');
  const colorInputRef = useRef<HTMLInputElement>(null);
  const highlightInputRef = useRef<HTMLInputElement>(null);

  async function loadData() {
    const items = await getAllPrograms();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(program: Program) {
    setEditingItem(program);
    setImageUrl(program.image || '');
    setHighlights(program.highlights || []);
    setColorValue(program.color || '#8B5CF6');
    setEmojiValue(program.emoji || '');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setHighlights([]);
    setColorValue('#8B5CF6');
    setEmojiValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setHighlights([]);
    setEmojiValue('');
    setErrors({});
  }

  function addHighlight() {
    const value = highlightInputRef.current?.value.trim();
    if (value) {
      setHighlights([...highlights, value]);
      highlightInputRef.current!.value = '';
    }
  }

  function removeHighlight(index: number) {
    setHighlights(highlights.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const filteredHighlights = highlights.filter((h) => h.trim() !== '');

    const payload = {
      name: formData.get('name') as string,
      ages: formData.get('ages') as string,
      grades: formData.get('grades') as string,
      description: formData.get('description') as string,
      highlights: filteredHighlights,
      teaching: formData.get('teaching') as string,
      image: imageUrl,
      color: colorValue,
      emoji: emojiValue,
    };

    const result = editingItem
      ? await updateProgram(editingItem.id, payload)
      : await createProgram(payload);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setHighlights([]);
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(program: Program) {
    const confirmed = window.confirm(
      `Delete "${program.name}"? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteProgram(program.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderProgram(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {data.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {data.length} {data.length === 1 ? 'program' : 'programs'}
            </span>
          )}
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md"
          >
            <PlusIcon />
            Add Program
          </button>
        )}
      </div>

      {/* Add/Edit Form Panel */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border-t-4 border-[#8B5CF6] bg-white p-6 shadow-md shadow-black/5 sm:p-8"
        >
          <h2 className="mb-6 text-lg font-bold text-[#1B2A4A]">
            {editingItem ? '\u{1F393} Edit Program' : '\u{1F393} Add New Program'}
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column: Image + Emoji */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Program Image
                </label>
                {imageUrl && (
                  <div className="mb-3">
                    <SmartImage
                      src={imageUrl}
                      alt="Program preview"
                      width={200}
                      height={120}
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  </div>
                )}
                <ImageUpload value={imageUrl} onChange={setImageUrl} hidePreview />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
                )}
              </div>
              <EmojiPicker
                label="Emoji"
                value={emojiValue}
                onChange={setEmojiValue}
                error={errors.emoji?.[0]}
              />
            </div>

            {/* Right Column: Core fields */}
            <div className="flex flex-col gap-4">
              <FormField
                label="Name"
                name="name"
                required
                value={editingItem?.name}
                error={errors.name?.[0]}
                placeholder="e.g. Early Childhood"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Ages"
                  name="ages"
                  required
                  value={editingItem?.ages}
                  error={errors.ages?.[0]}
                  placeholder="e.g. 3-5 years"
                />
                <FormField
                  label="Grades"
                  name="grades"
                  required
                  value={editingItem?.grades}
                  error={errors.grades?.[0]}
                  placeholder="e.g. Nursery - KG"
                />
              </div>

              {/* Color Swatches */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Color<span className="ml-0.5 text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColorValue(c)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform duration-150 hover:scale-110 ${
                        colorValue === c ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`Select color ${c}`}
                    />
                  ))}
                  <input
                    ref={colorInputRef}
                    type="text"
                    value={colorValue}
                    onChange={(e) => setColorValue(e.target.value)}
                    className="ml-2 w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-purple-200"
                    placeholder="#hex"
                  />
                </div>
                {errors.color && (
                  <p className="mt-1 text-sm text-red-600">{errors.color[0]}</p>
                )}
              </div>

              <FormField
                label="Description"
                name="description"
                type="textarea"
                required
                value={editingItem?.description}
                error={errors.description?.[0]}
                placeholder="Describe the program..."
              />
              <FormField
                label="Teaching Approach"
                name="teaching"
                type="textarea"
                required
                value={editingItem?.teaching}
                error={errors.teaching?.[0]}
                placeholder="Describe the teaching methodology..."
              />
            </div>
          </div>

          {/* Highlights Section */}
          <div className="mt-6">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Highlights
            </label>
            {highlights.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5 text-sm text-purple-700"
                  >
                    {highlight}
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="rounded-full p-0.5 text-purple-400 transition-colors hover:bg-purple-100 hover:text-purple-600"
                      aria-label={`Remove highlight: ${highlight}`}
                    >
                      <XIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={highlightInputRef}
                type="text"
                placeholder="Type a highlight and press +"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#8B5CF6] focus:ring-2 focus:ring-purple-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
              />
              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
              >
                <PlusIcon />
                Add
              </button>
            </div>
            {errors.highlights && (
              <p className="mt-1 text-sm text-red-600">{errors.highlights[0]}</p>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting
                ? 'Saving...'
                : editingItem
                  ? 'Update Program'
                  : 'Save Program'}
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

      {/* Program Cards */}
      {data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md shadow-black/5">
          <div className="text-6xl">{'\u{1F393}'}</div>
          <h3 className="mt-4 text-lg font-bold text-[#1B2A4A]">No programs yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first academic program to get started
          </p>
          {!isFormOpen && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md"
            >
              <PlusIcon />
              Add Program
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {data.map((program, index) => (
            <div
              key={program.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Left color accent strip */}
              <div
                className="absolute left-0 top-0 h-full w-1"
                style={{ backgroundColor: program.color || '#8B5CF6' }}
              />

              <div className="p-5 pl-6">
                {/* Top Row: Emoji + Name + Badges + Thumbnail */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl leading-none">{program.emoji}</span>
                    <div>
                      <h3 className="text-base font-bold text-[#1B2A4A]">
                        {program.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {program.ages && (
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                            {program.ages}
                          </span>
                        )}
                        {program.grades && (
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                            {program.grades}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {program.image ? (
                    <SmartImage
                      src={program.image}
                      alt={program.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl"
                      style={{ backgroundColor: `${program.color}20` }}
                    >
                      {program.emoji}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                  {program.description}
                </p>

                {/* Highlights as pills */}
                {program.highlights && program.highlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {program.highlights.slice(0, 3).map((hl, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                      >
                        {hl}
                      </span>
                    ))}
                    {program.highlights.length > 3 && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-400">
                        +{program.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    onClick={() => handleReorder(program.id, 'up')}
                    disabled={index === 0}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-purple-50 hover:text-[#8B5CF6] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    aria-label={`Move ${program.name} up`}
                  >
                    <ChevronUpIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(program.id, 'down')}
                    disabled={index === data.length - 1}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-purple-50 hover:text-[#8B5CF6] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    aria-label={`Move ${program.name} down`}
                  >
                    <ChevronDownIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(program)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35]"
                    aria-label={`Edit ${program.name}`}
                  >
                    <PencilIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(program)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label={`Delete ${program.name}`}
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

// ─── Special Features Section ───────────────────────────────────────────────

function SpecialFeaturesSection() {
  const [data, setData] = useState<SpecialFeature[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpecialFeature | null>(null);
  const [iconValue, setIconValue] = useState('');
  const [colorValue, setColorValue] = useState('');
  const [bgValue, setBgValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllSpecialFeatures();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(feature: SpecialFeature) {
    setEditingItem(feature);
    setIconValue(feature.icon || '');
    setColorValue(feature.color || '');
    setBgValue(feature.bg || '');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setIconValue('');
    setColorValue('');
    setBgValue('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setIconValue('');
    setColorValue('');
    setBgValue('');
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    formData.set('icon', iconValue);
    formData.set('color', colorValue);
    formData.set('bg', bgValue);

    const result = editingItem
      ? await updateSpecialFeature(editingItem.id, formData)
      : await createSpecialFeature(formData);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(feature: SpecialFeature) {
    const confirmed = window.confirm(
      `Delete "${feature.title}"? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteSpecialFeature(feature.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderSpecialFeature(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {data.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {data.length} {data.length === 1 ? 'feature' : 'features'}
            </span>
          )}
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md"
          >
            <PlusIcon />
            Add Special Feature
          </button>
        )}
      </div>

      {/* Add/Edit Form Panel */}
      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border-t-4 border-[#8B5CF6] bg-white p-6 shadow-md shadow-black/5 sm:p-8"
        >
          <h2 className="mb-6 text-lg font-bold text-[#1B2A4A]">
            {editingItem ? '\u2B50 Edit Special Feature' : '\u2B50 Add New Special Feature'}
          </h2>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Title"
                name="title"
                required
                value={editingItem?.title}
                error={errors.title?.[0]}
                placeholder="e.g. STEAM Education"
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

            <div className="grid gap-4 sm:grid-cols-2">
              <TailwindColorPicker
                label="Text Color"
                value={colorValue}
                onChange={setColorValue}
                type="text"
                error={errors.color?.[0]}
              />
              <TailwindColorPicker
                label="Background"
                value={bgValue}
                onChange={setBgValue}
                type="bg"
                error={errors.bg?.[0]}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting
                ? 'Saving...'
                : editingItem
                  ? 'Update Feature'
                  : 'Save Feature'}
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

      {/* Feature Cards */}
      {data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md shadow-black/5">
          <div className="text-6xl">{'\u2B50'}</div>
          <h3 className="mt-4 text-lg font-bold text-[#1B2A4A]">No special features yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first special feature to get started
          </p>
          {!isFormOpen && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md"
            >
              <PlusIcon />
              Add Special Feature
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((feature, index) => (
            <div
              key={feature.id}
              className="group flex flex-col rounded-2xl bg-white p-5 shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Icon Circle */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.bg} ${feature.color}`}
              >
                {(() => {
                  const Icon = getIcon(feature.icon);
                  return Icon ? <Icon className="h-6 w-6" /> : <span className="text-sm font-bold">{feature.icon}</span>;
                })()}
              </div>

              {/* Title */}
              <h3 className="mt-3 text-sm font-bold text-[#1B2A4A]">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">
                {feature.description}
              </p>

              {/* Action Bar */}
              <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleReorder(feature.id, 'up')}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-purple-50 hover:text-[#8B5CF6] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  aria-label={`Move ${feature.title} up`}
                >
                  <ChevronUpIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(feature.id, 'down')}
                  disabled={index === data.length - 1}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-purple-50 hover:text-[#8B5CF6] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  aria-label={`Move ${feature.title} down`}
                >
                  <ChevronDownIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(feature)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35]"
                  aria-label={`Edit ${feature.title}`}
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(feature)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Delete ${feature.title}`}
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

// ─── Key Benefits Section ───────────────────────────────────────────────────

function KeyBenefitsSection() {
  const [data, setData] = useState<KeyBenefit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KeyBenefit | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiValue, setEmojiValue] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllKeyBenefits();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(benefit: KeyBenefit) {
    setEditingItem(benefit);
    setEmojiValue(benefit.emoji || '');
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
    formData.set('emoji', emojiValue);

    const result = editingItem
      ? await updateKeyBenefit(editingItem.id, formData)
      : await createKeyBenefit(formData);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(benefit: KeyBenefit) {
    const confirmed = window.confirm(
      `Delete "${benefit.title}"? This can't be undone.`
    );
    if (!confirmed) return;
    await deleteKeyBenefit(benefit.id);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderKeyBenefit(id, direction);
    await loadData();
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {data.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              {data.length} {data.length === 1 ? 'benefit' : 'benefits'}
            </span>
          )}
        </div>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md"
          >
            <PlusIcon />
            Add Key Benefit
          </button>
        )}
      </div>

      {/* Add/Edit Form Panel */}
      {isFormOpen && (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border-t-4 border-[#8B5CF6] bg-white p-6 shadow-md shadow-black/5 sm:p-8"
        >
          <h2 className="mb-6 text-lg font-bold text-[#1B2A4A]">
            {editingItem ? '\u{1F3C6} Edit Key Benefit' : '\u{1F3C6} Add New Key Benefit'}
          </h2>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
              placeholder="Describe this benefit..."
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label="Color"
                name="color"
                required
                value={editingItem?.color}
                error={errors.color?.[0]}
                placeholder="e.g. text-purple-600"
              />
              <FormField
                label="Background"
                name="bg"
                required
                value={editingItem?.bg}
                error={errors.bg?.[0]}
                placeholder="e.g. bg-purple-50"
              />
              <FormField
                label="Border"
                name="border"
                required
                value={editingItem?.border}
                error={errors.border?.[0]}
                placeholder="e.g. border-purple-200"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting
                ? 'Saving...'
                : editingItem
                  ? 'Update Benefit'
                  : 'Save Benefit'}
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

      {/* Benefit Cards */}
      {data.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-white py-16 shadow-md shadow-black/5">
          <div className="text-6xl">{'\u{1F3C6}'}</div>
          <h3 className="mt-4 text-lg font-bold text-[#1B2A4A]">No key benefits yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your first key benefit to get started
          </p>
          {!isFormOpen && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7c3aed] hover:shadow-md"
            >
              <PlusIcon />
              Add Key Benefit
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((benefit, index) => (
            <div
              key={benefit.id}
              className="group flex flex-col rounded-2xl bg-white p-5 shadow-md shadow-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Large Emoji */}
              <span className="text-3xl">{benefit.emoji}</span>

              {/* Title */}
              <h3 className="mt-3 text-sm font-bold text-[#1B2A4A]">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500">
                {benefit.description}
              </p>

              {/* Color indicator dot */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${benefit.color}`}
                  style={{
                    backgroundColor: benefit.color.startsWith('#')
                      ? benefit.color
                      : undefined,
                  }}
                />
                <span className="text-xs text-gray-400">{benefit.color}</span>
              </div>

              {/* Action Bar */}
              <div className="mt-4 flex items-center gap-1 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => handleReorder(benefit.id, 'up')}
                  disabled={index === 0}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-purple-50 hover:text-[#8B5CF6] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  aria-label={`Move ${benefit.title} up`}
                >
                  <ChevronUpIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(benefit.id, 'down')}
                  disabled={index === data.length - 1}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-purple-50 hover:text-[#8B5CF6] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                  aria-label={`Move ${benefit.title} down`}
                >
                  <ChevronDownIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(benefit)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF6B35]"
                  aria-label={`Edit ${benefit.title}`}
                >
                  <PencilIcon />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(benefit)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Delete ${benefit.title}`}
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
