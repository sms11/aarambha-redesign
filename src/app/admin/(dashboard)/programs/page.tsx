'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
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

const programColumns = [
  { key: 'emoji', label: 'Emoji' },
  { key: 'name', label: 'Name' },
  { key: 'ages', label: 'Ages' },
  { key: 'grades', label: 'Grades' },
  { key: 'color', label: 'Color' },
];

const featureColumns = [
  { key: 'icon', label: 'Icon' },
  { key: 'title', label: 'Title' },
  { key: 'color', label: 'Color' },
  { key: 'bg', label: 'Background' },
];

const benefitColumns = [
  { key: 'emoji', label: 'Emoji' },
  { key: 'title', label: 'Title' },
  { key: 'color', label: 'Color' },
  { key: 'bg', label: 'Background' },
];

export default function ProgramsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('Programs');

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage academic programs, special features, and key benefits.
        </p>
      </div>

      {/* Section Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
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

  async function loadData() {
    const items = await getAllPrograms();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const program = item as unknown as Program;
    setEditingItem(program);
    setImageUrl(program.image || '');
    setHighlights(program.highlights || []);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setHighlights([]);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
    setHighlights([]);
    setErrors({});
  }

  function addHighlight() {
    setHighlights([...highlights, '']);
  }

  function removeHighlight(index: number) {
    setHighlights(highlights.filter((_, i) => i !== index));
  }

  function updateHighlight(index: number, value: string) {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
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
      color: formData.get('color') as string,
      emoji: formData.get('emoji') as string,
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

  async function handleDelete(item: Record<string, unknown>) {
    await deleteProgram(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderProgram(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="mt-6 flex justify-end">
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Program
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {editingItem ? 'Edit Program' : 'Add Program'}
          </h2>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Name"
                name="name"
                required
                value={editingItem?.name}
                error={errors.name?.[0]}
                placeholder="e.g. Early Childhood"
              />
              <FormField
                label="Emoji"
                name="emoji"
                required
                value={editingItem?.emoji}
                error={errors.emoji?.[0]}
                placeholder="e.g. 🌱"
              />
            </div>

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

            <FormField
              label="Color"
              name="color"
              required
              value={editingItem?.color}
              error={errors.color?.[0]}
              placeholder="e.g. #FF6B35 or emerald"
            />

            {/* Highlights multi-input */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Highlights
              </label>
              <div className="space-y-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder={`Highlight ${index + 1}`}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                    />
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="shrink-0 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      aria-label={`Remove highlight ${index + 1}`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addHighlight}
                className="mt-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
              >
                + Add Highlight
              </button>
              {errors.highlights && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.highlights[0]}
                </p>
              )}
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
                  ? 'Update Program'
                  : 'Add Program'}
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
          columns={programColumns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
}

// ─── Special Features Section ───────────────────────────────────────────────

function SpecialFeaturesSection() {
  const [data, setData] = useState<SpecialFeature[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpecialFeature | null>(null);
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

  function handleEdit(item: Record<string, unknown>) {
    const feature = item as unknown as SpecialFeature;
    setEditingItem(feature);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

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

  async function handleDelete(item: Record<string, unknown>) {
    await deleteSpecialFeature(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderSpecialFeature(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="mt-6 flex justify-end">
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Special Feature
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
            {editingItem ? 'Edit Special Feature' : 'Add Special Feature'}
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
              <FormField
                label="Icon"
                name="icon"
                required
                value={editingItem?.icon}
                error={errors.icon?.[0]}
                placeholder="e.g. BeakerIcon"
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
              <FormField
                label="Color"
                name="color"
                required
                value={editingItem?.color}
                error={errors.color?.[0]}
                placeholder="e.g. text-blue-600"
              />
              <FormField
                label="Background"
                name="bg"
                required
                value={editingItem?.bg}
                error={errors.bg?.[0]}
                placeholder="e.g. bg-blue-50"
              />
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
                  ? 'Update Feature'
                  : 'Add Feature'}
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
          columns={featureColumns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
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
  const formRef = useRef<HTMLFormElement>(null);

  async function loadData() {
    const items = await getAllKeyBenefits();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const benefit = item as unknown as KeyBenefit;
    setEditingItem(benefit);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

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

  async function handleDelete(item: Record<string, unknown>) {
    await deleteKeyBenefit(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderKeyBenefit(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="mt-6 flex justify-end">
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Key Benefit
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
            {editingItem ? 'Edit Key Benefit' : 'Add Key Benefit'}
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
              <FormField
                label="Emoji"
                name="emoji"
                required
                value={editingItem?.emoji}
                error={errors.emoji?.[0]}
                placeholder="e.g. 🌟"
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

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting
                ? 'Saving...'
                : editingItem
                  ? 'Update Benefit'
                  : 'Add Benefit'}
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
          columns={benefitColumns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
    </div>
  );
}
