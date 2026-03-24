'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
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

// ─── Tab Button ──────────────────────────────────────────────────────────────

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Core Values Section ─────────────────────────────────────────────────────

function CoreValuesSection() {
  const [data, setData] = useState<CoreValue[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CoreValue | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'emoji', label: 'Emoji' },
    { key: 'title', label: 'Title' },
    { key: 'icon', label: 'Icon' },
    { key: 'color', label: 'Color' },
  ];

  async function loadData() {
    const items = await getAllCoreValues();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const cv = item as unknown as CoreValue;
    setEditingItem(cv);
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
    const payload = {
      title: formData.get('title') as string,
      icon: formData.get('icon') as string,
      emoji: formData.get('emoji') as string,
      color: formData.get('color') as string,
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteCoreValue(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderCoreValue(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Core Values</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Core Value
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit Core Value' : 'Add Core Value'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title"
              name="title"
              required
              value={editingItem?.title}
              error={errors.title?.[0]}
              placeholder="e.g. Integrity"
            />
            <FormField
              label="Icon"
              name="icon"
              required
              value={editingItem?.icon}
              error={errors.icon?.[0]}
              placeholder="e.g. ShieldCheckIcon"
            />
            <FormField
              label="Emoji"
              name="emoji"
              required
              value={editingItem?.emoji}
              error={errors.emoji?.[0]}
              placeholder="e.g. 🛡️"
            />
            <FormField
              label="Color"
              name="color"
              required
              value={editingItem?.color}
              error={errors.color?.[0]}
              placeholder="e.g. #FF6B35 or blue"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Value' : 'Add Value'}
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

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
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

  const columns = [
    { key: 'emoji', label: 'Emoji' },
    { key: 'title', label: 'Title' },
    { key: 'color', label: 'Color' },
  ];

  async function loadData() {
    const items = await getAllPhilosophies();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const phil = item as unknown as Philosophy;
    setEditingItem(phil);
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
    const payload = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      emoji: formData.get('emoji') as string,
      color: formData.get('color') as string,
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deletePhilosophy(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderPhilosophy(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Philosophy</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Philosophy
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit Philosophy' : 'Add Philosophy'}
          </h3>
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
                placeholder="e.g. 🌿"
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
            <FormField
              label="Color"
              name="color"
              required
              value={editingItem?.color}
              error={errors.color?.[0]}
              placeholder="e.g. #FF6B35 or green"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Philosophy' : 'Add Philosophy'}
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

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={data as unknown as Record<string, unknown>[]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReorder={handleReorder}
        />
      </div>
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
      <h2 className="text-lg font-semibold text-gray-900">Mission & Vision</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="mission"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Mission<span className="ml-0.5 text-red-500">*</span>
            </label>
            <textarea
              id="mission"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              required
              rows={5}
              placeholder="Write the school's mission statement..."
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
            {errors.mission && (
              <p className="mt-1 text-sm text-red-600">{errors.mission[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="vision"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Vision<span className="ml-0.5 text-red-500">*</span>
            </label>
            <textarea
              id="vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              required
              rows={5}
              placeholder="Write the school's vision statement..."
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
            {errors.vision && (
              <p className="mt-1 text-sm text-red-600">{errors.vision[0]}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          {saved && (
            <span className="text-sm text-green-600">Changes saved successfully.</span>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AboutAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('coreValues');

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage content displayed on the about page.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <TabButton
          label="Core Values"
          active={activeTab === 'coreValues'}
          onClick={() => setActiveTab('coreValues')}
        />
        <TabButton
          label="Philosophy"
          active={activeTab === 'philosophy'}
          onClick={() => setActiveTab('philosophy')}
        />
        <TabButton
          label="Mission & Vision"
          active={activeTab === 'missionVision'}
          onClick={() => setActiveTab('missionVision')}
        />
      </div>

      <div className="mt-6">
        {activeTab === 'coreValues' && <CoreValuesSection />}
        {activeTab === 'philosophy' && <PhilosophySection />}
        {activeTab === 'missionVision' && <MissionVisionSection />}
      </div>
    </div>
  );
}
