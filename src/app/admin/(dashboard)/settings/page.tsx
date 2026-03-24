'use client';

import { useEffect, useState } from 'react';
import FormField from '@/components/admin/FormField';
import { getAllSettings, updateSettings } from '@/lib/actions/settings';

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
    whatsapp_number: '',
    map_embed_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const settings = await getAllSettings();
      setValues(settings);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setIsSaved(false);

    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value as string;
    }

    const result = await updateSettings(data);

    if (result?.error) {
      setErrors(result.error as Record<string, string[]>);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure social links and contact settings used across the website.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-gray-200 bg-white p-6"
      >
        {/* Social Links */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Social Links</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              label="Facebook URL"
              name="facebook_url"
              value={values.facebook_url}
              error={errors.facebook_url?.[0]}
              placeholder="https://facebook.com/..."
            />
            <FormField
              label="Instagram URL"
              name="instagram_url"
              value={values.instagram_url}
              error={errors.instagram_url?.[0]}
              placeholder="https://instagram.com/..."
            />
            <FormField
              label="TikTok URL"
              name="tiktok_url"
              value={values.tiktok_url}
              error={errors.tiktok_url?.[0]}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </div>

        {/* Contact Settings */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact</h2>
          <div className="grid gap-4">
            <FormField
              label="WhatsApp Number"
              name="whatsapp_number"
              value={values.whatsapp_number}
              error={errors.whatsapp_number?.[0]}
              placeholder="e.g. +977-9800000000"
            />
            <FormField
              label="Map Embed URL"
              name="map_embed_url"
              type="textarea"
              value={values.map_embed_url}
              error={errors.map_embed_url?.[0]}
              placeholder="Google Maps embed URL..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
          {isSaved && (
            <span className="text-sm font-medium text-green-600">
              Settings saved successfully.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
