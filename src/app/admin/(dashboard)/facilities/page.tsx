'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormField from '@/components/admin/FormField';
import ImageUpload from '@/components/admin/ImageUpload';
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

// ─── Activities Section ──────────────────────────────────────────────────────

function ActivitiesSection() {
  const [data, setData] = useState<Activity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Activity | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'tag', label: 'Tag' },
    { key: 'section', label: 'Section' },
    { key: 'color', label: 'Color' },
  ];

  async function loadData() {
    const items = await getAllActivities();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const act = item as unknown as Activity;
    setEditingItem(act);
    setImageUrl(act.image);
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
      tag: formData.get('tag') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: imageUrl,
      color: formData.get('color') as string,
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteActivity(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderActivity(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Activity
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit Activity' : 'Add Activity'}
          </h3>
          <div className="grid gap-4">
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
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label="Section"
                name="section"
                required
                value={editingItem?.section}
                error={errors.section?.[0]}
                placeholder="e.g. sports"
              />
              <FormField
                label="Color"
                name="color"
                required
                value={editingItem?.color}
                error={errors.color?.[0]}
                placeholder="e.g. #FF6B35"
              />
            </div>
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
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Activity' : 'Add Activity'}
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

// ─── Facilities Section ──────────────────────────────────────────────────────

const categoryOptions = [
  { label: 'Resource', value: 'resource' },
  { label: 'Lab', value: 'lab' },
  { label: 'Digital', value: 'digital' },
  { label: 'Health', value: 'health' },
  { label: 'Convenience', value: 'convenience' },
];

function FacilitiesSection() {
  const [data, setData] = useState<Facility[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Facility | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'image', label: 'Image' },
  ];

  async function loadData() {
    const items = await getAllFacilities();
    setData(items);
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleEdit(item: Record<string, unknown>) {
    const fac = item as unknown as Facility;
    setEditingItem(fac);
    setImageUrl(fac.image || '');
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
      subtitle: (formData.get('subtitle') as string) || undefined,
      description: formData.get('description') as string,
      image: imageUrl || undefined,
      category: formData.get('category') as string,
      icon: (formData.get('icon') as string) || undefined,
      color: (formData.get('color') as string) || undefined,
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
    setIsSubmitting(false);
    await loadData();
  }

  async function handleDelete(item: Record<string, unknown>) {
    await deleteFacility(item.id as number);
    await loadData();
  }

  async function handleReorder(id: number, direction: 'up' | 'down') {
    await reorderFacility(id, direction);
    await loadData();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Facilities</h2>
        {!isFormOpen && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add Facility
          </button>
        )}
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
        >
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            {editingItem ? 'Edit Facility' : 'Add Facility'}
          </h3>
          <div className="grid gap-4">
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
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                label="Category"
                name="category"
                type="select"
                required
                value={editingItem?.category}
                error={errors.category?.[0]}
                options={categoryOptions}
                placeholder="Select a category"
              />
              <FormField
                label="Icon"
                name="icon"
                value={editingItem?.icon ?? ''}
                error={errors.icon?.[0]}
                placeholder="e.g. BeakerIcon"
              />
              <FormField
                label="Color"
                name="color"
                value={editingItem?.color ?? ''}
                error={errors.color?.[0]}
                placeholder="e.g. #FF6B35"
              />
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
              {isSubmitting ? 'Saving...' : editingItem ? 'Update Facility' : 'Add Facility'}
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

// ─── Counseling Points Section ───────────────────────────────────────────────

function CounselingPointsSection() {
  const [points, setPoints] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getCounselingPoints();
      setPoints(data.length > 0 ? data : ['']);
    }
    load();
  }, []);

  function addPoint() {
    setPoints([...points, '']);
  }

  function removePoint(index: number) {
    setPoints(points.filter((_, i) => i !== index));
  }

  function updatePoint(index: number, value: string) {
    const updated = [...points];
    updated[index] = value;
    setPoints(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSaved(false);

    const filtered = points.filter((p) => p.trim() !== '');
    const result = await updateCounselingPoints(filtered);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setPoints(filtered.length > 0 ? filtered : ['']);
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Counseling Points</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 rounded-xl border border-gray-200 bg-white p-6"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Points
          </label>
          <div className="space-y-2">
            {points.map((point, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => updatePoint(index, e.target.value)}
                  placeholder={`Point ${index + 1}`}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
                <button
                  type="button"
                  onClick={() => removePoint(index)}
                  className="shrink-0 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                  aria-label={`Remove point ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addPoint}
            className="mt-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-800"
          >
            + Add Point
          </button>
          {errors.counseling_points && (
            <p className="mt-1 text-sm text-red-600">
              {errors.counseling_points[0]}
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Points'}
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

export default function FacilitiesAdminPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('activities');

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facilities</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage activities, facilities, and counseling content.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <TabButton
          label="Activities"
          active={activeTab === 'activities'}
          onClick={() => setActiveTab('activities')}
        />
        <TabButton
          label="Facilities"
          active={activeTab === 'facilities'}
          onClick={() => setActiveTab('facilities')}
        />
        <TabButton
          label="Counseling Points"
          active={activeTab === 'counseling'}
          onClick={() => setActiveTab('counseling')}
        />
      </div>

      <div className="mt-6">
        {activeTab === 'activities' && <ActivitiesSection />}
        {activeTab === 'facilities' && <FacilitiesSection />}
        {activeTab === 'counseling' && <CounselingPointsSection />}
      </div>
    </div>
  );
}
