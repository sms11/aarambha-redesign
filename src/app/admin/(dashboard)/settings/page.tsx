'use client';

import { useEffect, useState } from 'react';
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

  function updateValue(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setIsSaved(false);

    const result = await updateSettings(values);

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
      {/* Page Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#1B2A4A]">
          ⚙️ Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Social links, WhatsApp, and map configuration — used across the website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Social Links Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500" />
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-lg text-white">
                🔗
              </span>
              <div>
                <h2 className="text-base font-bold text-[#1B2A4A]">Social Links</h2>
                <p className="text-xs text-gray-400">Shown in the footer and contact page</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Facebook */}
              <div className="flex items-start gap-3">
                <div className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label htmlFor="facebook_url" className="mb-1 block text-sm font-medium text-[#1B2A4A]">
                    Facebook
                  </label>
                  <input
                    id="facebook_url"
                    type="text"
                    value={values.facebook_url}
                    onChange={(e) => updateValue('facebook_url', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                  {errors.facebook_url && <p className="mt-1 text-xs text-red-600">{errors.facebook_url[0]}</p>}
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-start gap-3">
                <div className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label htmlFor="instagram_url" className="mb-1 block text-sm font-medium text-[#1B2A4A]">
                    Instagram
                  </label>
                  <input
                    id="instagram_url"
                    type="text"
                    value={values.instagram_url}
                    onChange={(e) => updateValue('instagram_url', e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  />
                  {errors.instagram_url && <p className="mt-1 text-xs text-red-600">{errors.instagram_url[0]}</p>}
                </div>
              </div>

              {/* TikTok */}
              <div className="flex items-start gap-3">
                <div className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label htmlFor="tiktok_url" className="mb-1 block text-sm font-medium text-[#1B2A4A]">
                    TikTok
                  </label>
                  <input
                    id="tiktok_url"
                    type="text"
                    value={values.tiktok_url}
                    onChange={(e) => updateValue('tiktok_url', e.target.value)}
                    placeholder="https://tiktok.com/@yourpage"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20"
                  />
                  {errors.tiktok_url && <p className="mt-1 text-xs text-red-600">{errors.tiktok_url[0]}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Settings Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-md shadow-black/5">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                📱
              </span>
              <div>
                <h2 className="text-base font-bold text-[#1B2A4A]">Contact & Map</h2>
                <p className="text-xs text-gray-400">WhatsApp button and embedded Google Map</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <label htmlFor="whatsapp_number" className="mb-1 block text-sm font-medium text-[#1B2A4A]">
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsapp_number"
                    type="text"
                    value={values.whatsapp_number}
                    onChange={(e) => updateValue('whatsapp_number', e.target.value)}
                    placeholder="e.g. +977-9800000000"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                  />
                  {errors.whatsapp_number && <p className="mt-1 text-xs text-red-600">{errors.whatsapp_number[0]}</p>}
                  <p className="mt-1 text-xs text-gray-400">Used for the floating WhatsApp button on the contact page</p>
                </div>
              </div>

              {/* Map Embed URL */}
              <div>
                <label htmlFor="map_embed_url" className="mb-1 block text-sm font-medium text-[#1B2A4A]">
                  📍 Google Maps Embed URL
                </label>
                <textarea
                  id="map_embed_url"
                  value={values.map_embed_url}
                  onChange={(e) => updateValue('map_embed_url', e.target.value)}
                  placeholder="Paste the Google Maps embed URL here..."
                  rows={3}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
                {errors.map_embed_url && <p className="mt-1 text-xs text-red-600">{errors.map_embed_url[0]}</p>}
                <p className="mt-1 text-xs text-gray-400">
                  Go to Google Maps → Share → Embed → Copy the src URL from the iframe
                </p>

                {/* Map Preview */}
                {values.map_embed_url && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
                    <iframe
                      src={values.map_embed_url}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Map preview"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#1B2A4A] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Save All Settings'
            )}
          </button>
          {isSaved && (
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Settings saved!
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
