'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import {
  statSchema,
  homepageFeatureSchema,
  schoolLifeItemSchema,
  principalMessageSchema,
} from '@/lib/validations/homepage';

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function getAllStats() {
  return prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createStat(data: {
  label: string;
  value: string;
  suffix?: string;
  emoji: string;
}) {
  const parsed = statSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.stat.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.stat.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function updateStat(
  id: number,
  data: {
    label: string;
    value: string;
    suffix?: string;
    emoji: string;
  }
) {
  const parsed = statSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.stat.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  return { success: true };
}

export async function deleteStat(id: number) {
  await prisma.stat.delete({ where: { id } });
  revalidatePath('/');
  return { success: true };
}

export async function reorderStat(id: number, direction: 'up' | 'down') {
  const current = await prisma.stat.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.stat.findFirst({
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
      prisma.stat.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.stat.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
}

// ─── Homepage Features ───────────────────────────────────────────────────────

export async function getAllHomepageFeatures() {
  return prisma.homepageFeature.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createHomepageFeature(data: {
  title: string;
  description: string;
  icon: string;
  image: string;
}) {
  const parsed = homepageFeatureSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.homepageFeature.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.homepageFeature.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function updateHomepageFeature(
  id: number,
  data: {
    title: string;
    description: string;
    icon: string;
    image: string;
  }
) {
  const parsed = homepageFeatureSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.homepageFeature.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  return { success: true };
}

export async function deleteHomepageFeature(id: number) {
  await prisma.homepageFeature.delete({ where: { id } });
  revalidatePath('/');
  return { success: true };
}

export async function reorderHomepageFeature(id: number, direction: 'up' | 'down') {
  const current = await prisma.homepageFeature.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.homepageFeature.findFirst({
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
      prisma.homepageFeature.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.homepageFeature.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
}

// ─── School Life Items ───────────────────────────────────────────────────────

export async function getAllSchoolLifeItems() {
  return prisma.schoolLifeItem.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createSchoolLifeItem(data: {
  title: string;
  icon: string;
  image: string;
}) {
  const parsed = schoolLifeItemSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.schoolLifeItem.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.schoolLifeItem.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function updateSchoolLifeItem(
  id: number,
  data: {
    title: string;
    icon: string;
    image: string;
  }
) {
  const parsed = schoolLifeItemSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.schoolLifeItem.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  return { success: true };
}

export async function deleteSchoolLifeItem(id: number) {
  await prisma.schoolLifeItem.delete({ where: { id } });
  revalidatePath('/');
  return { success: true };
}

export async function reorderSchoolLifeItem(id: number, direction: 'up' | 'down') {
  const current = await prisma.schoolLifeItem.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.schoolLifeItem.findFirst({
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
      prisma.schoolLifeItem.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.schoolLifeItem.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
}

// ─── Principal Message (SiteSettings) ────────────────────────────────────────

export async function getPrincipalMessage() {
  const keys = ['principal_message', 'principal_name', 'principal_image'];
  const settings = await prisma.siteSettings.findMany({
    where: { key: { in: keys } },
  });

  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }
  return result;
}

export async function updatePrincipalMessage(data: {
  principal_message: string;
  principal_name: string;
  principal_image: string;
}) {
  const parsed = principalMessageSchema.safeParse(data);
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

  revalidatePath('/');
  return { success: true };
}
