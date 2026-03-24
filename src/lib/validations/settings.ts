import { z } from 'zod';

const optionalUrl = z
  .string()
  .url('Must be a valid URL')
  .max(500)
  .or(z.literal(''))
  .default('');

export const settingsSchema = z.object({
  facebook_url: optionalUrl,
  instagram_url: optionalUrl,
  tiktok_url: optionalUrl,
  whatsapp_number: z.string().max(500).default(''),
  map_embed_url: z.string().max(500).default(''),
});

export type SettingsInput = z.infer<typeof settingsSchema>;

export const SETTINGS_KEYS = [
  'facebook_url',
  'instagram_url',
  'tiktok_url',
  'whatsapp_number',
  'map_embed_url',
] as const;
