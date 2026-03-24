'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
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

// ─── Stats Section ───────────────────────────────────────────────────────────

function StatsSection() {
  const [data, setData] = useState<Stat[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Stat | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'emoji', label: 'Emoji' },
    { key: 'label', label: 'Label' },
    { key: 'value', label: 'Value' },
    { key: 'suffix', label: 'Suffix' },
  ];

  async function loadData() {
    const items = await getAllStats();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const stat = item as unknown as Stat;
    setEditingItem(stat);
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
      label: formData.get('label') as string,
      value: formData.get('value') as string,
      suffix: (formData.get('suffix') as string) || undefined,
      emoji: formData.get('emoji') as string,
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteStat(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderStat(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Stats</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Stat
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit Stat' : 'Add Stat'}
          </h3>
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
            <FormField
              label="Emoji"
              name="emoji"
              required
              value={editingItem?.emoji}
              error={errors.emoji?.[0]}
              placeholder="e.g. 🎓"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Stat' : 'Add Stat'}
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

// ─── Homepage Features Section ───────────────────────────────────────────────

function FeaturesSection() {
  const [data, setData] = useState<HomepageFeature[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomepageFeature | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'icon', label: 'Icon' },
  ];

  async function loadData() {
    const items = await getAllHomepageFeatures();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const feature = item as unknown as HomepageFeature;
    setEditingItem(feature);
    setImageUrl(feature.image);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
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
      icon: formData.get('icon') as string,
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteHomepageFeature(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderHomepageFeature(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Homepage Features</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Feature
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit Feature' : 'Add Feature'}
          </h3>
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
              <FormField
                label="Icon"
                name="icon"
                required
                value={editingItem?.icon}
                error={errors.icon?.[0]}
                placeholder="e.g. AcademicCapIcon"
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
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image<span className="ml-0.5 text-red-500">*</span>
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
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Feature' : 'Add Feature'}
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

// ─── School Life Section ─────────────────────────────────────────────────────

function SchoolLifeSection() {
  const [data, setData] = useState<SchoolLifeItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolLifeItem | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'icon', label: 'Icon' },
  ];

  async function loadData() {
    const items = await getAllSchoolLifeItems();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const sli = item as unknown as SchoolLifeItem;
    setEditingItem(sli);
    setImageUrl(sli.image);
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCreate() {
    setEditingItem(null);
    setImageUrl('');
    setErrors({});
    setIsFormOpen(true);
  }

  function handleCancel() {
    setIsFormOpen(false);
    setEditingItem(null);
    setImageUrl('');
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteSchoolLifeItem(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderSchoolLifeItem(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">School Life Items</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Item
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit School Life Item' : 'Add School Life Item'}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Title"
              name="title"
              required
              value={editingItem?.title}
              error={errors.title?.[0]}
              placeholder="e.g. Sports Day"
            />
            <FormField
              label="Icon"
              name="icon"
              required
              value={editingItem?.icon}
              error={errors.icon?.[0]}
              placeholder="e.g. TrophyIcon"
            />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Image<span className="ml-0.5 text-red-500">*</span>
            </label>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
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
      <h2 className="text-lg font-semibold text-gray-900">Principal Message</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-4">
          <div>
            <label
              htmlFor="principal_name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
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
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
            {errors.principal_name && (
              <p className="mt-1 text-sm text-red-600">{errors.principal_name[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="principal_message"
              className="mb-1.5 block text-sm font-medium text-gray-700"
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
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
            />
            {errors.principal_message && (
              <p className="mt-1 text-sm text-red-600">{errors.principal_message[0]}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Principal Image
            </label>
            <ImageUpload value={principalImage} onChange={setPrincipalImage} />
            {errors.principal_image && (
              <p className="mt-1 text-sm text-red-600">{errors.principal_image[0]}</p>
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

export default function HomepageAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stats');

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Homepage</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage content displayed on the homepage.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <TabButton
          label="Stats"
          active={activeTab === 'stats'}
          onClick={() => setActiveTab('stats')}
        />
        <TabButton
          label="Features"
          active={activeTab === 'features'}
          onClick={() => setActiveTab('features')}
        />
        <TabButton
          label="School Life"
          active={activeTab === 'schoolLife'}
          onClick={() => setActiveTab('schoolLife')}
        />
        <TabButton
          label="Principal Message"
          active={activeTab === 'principal'}
          onClick={() => setActiveTab('principal')}
        />
      </div>

      <div className="mt-6">
        {activeTab === 'stats' && <StatsSection />}
        {activeTab === 'features' && <FeaturesSection />}
        {activeTab === 'schoolLife' && <SchoolLifeSection />}
        {activeTab === 'principal' && <PrincipalMessageSection />}
      </div>
    </div>
  );
}
