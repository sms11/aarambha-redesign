'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import {
  coreValueSchema,
  philosophySchema,
  missionVisionSchema,
} from '@/lib/validations/about';

// ─── Core Values ─────────────────────────────────────────────────────────────

export async function getAllCoreValues() {
  return prisma.coreValue.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createCoreValue(data: {
  title: string;
  icon: string;
  emoji: string;
  color: string;
}) {
  const parsed = coreValueSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.coreValue.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.coreValue.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/about');
  return { success: true };
}

export async function updateCoreValue(
  id: number,
  data: {
    title: string;
    icon: string;
    emoji: string;
    color: string;
  }
) {
  const parsed = coreValueSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.coreValue.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/about');
  return { success: true };
}

export async function deleteCoreValue(id: number) {
  await prisma.coreValue.delete({ where: { id } });
  revalidatePath('/about');
  return { success: true };
}

export async function reorderCoreValue(id: number, direction: 'up' | 'down') {
  const current = await prisma.coreValue.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.coreValue.findFirst({
    where: {
      sortOrder:
        direction === 'up'
          ? { lt: current.sortOrder }
          : { gt: current.sortOrder },
    },
    orderBy: {
      sortOrder: direction === 'up' ? 'desc' : 'asc',
    },
  });

  if (adjacent) {
    await prisma.$transaction([
      prisma.coreValue.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.coreValue.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/about');
}

// ─── Philosophy ──────────────────────────────────────────────────────────────

export async function getAllPhilosophies() {
  return prisma.philosophy.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createPhilosophy(data: {
  title: string;
  description: string;
  emoji: string;
  color: string;
}) {
  const parsed = philosophySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.philosophy.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.philosophy.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/about');
  return { success: true };
}

export async function updatePhilosophy(
  id: number,
  data: {
    title: string;
    description: string;
    emoji: string;
    color: string;
  }
) {
  const parsed = philosophySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.philosophy.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/about');
  return { success: true };
}

export async function deletePhilosophy(id: number) {
  await prisma.philosophy.delete({ where: { id } });
  revalidatePath('/about');
  return { success: true };
}

export async function reorderPhilosophy(id: number, direction: 'up' | 'down') {
  const current = await prisma.philosophy.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.philosophy.findFirst({
    where: {
      sortOrder:
        direction === 'up'
          ? { lt: current.sortOrder }
          : { gt: current.sortOrder },
    },
    orderBy: {
      sortOrder: direction === 'up' ? 'desc' : 'asc',
    },
  });

  if (adjacent) {
    await prisma.$transaction([
      prisma.philosophy.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.philosophy.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/about');
}

// ─── Mission & Vision (SiteSettings) ─────────────────────────────────────────

export async function getMissionVision() {
  const keys = ['mission', 'vision'];
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: keys } },
  });

  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return result;
}

export async function updateMissionVision(data: {
  mission: string;
  vision: string;
}) {
  const parsed = missionVisionSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const entries = Object.entries(parsed.data) as [string, string][];
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  revalidatePath('/about');
  return { success: true };
}
