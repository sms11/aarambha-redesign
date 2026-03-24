'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { settingsSchema, SETTINGS_KEYS } from '@/lib/validations/settings';

export async function getAllSettings() {
  const rows = await prisma.siteSettings.findMany({
    where: { key: { in: [...SETTINGS_KEYS] } },
  });

  const settings: Record<string, string> = {};
  for (const key of SETTINGS_KEYS) {
    settings[key] = rows.find((r) => r.key === key)?.value ?? '';
  }
  return settings;
}

export async function updateSettings(data: Record<string, string>) {
  const parsed = settingsSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const entries = Object.entries(parsed.data) as [string, string][];

  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidatePath('/');
  revalidatePath('/contact');
  return { success: true };
}
