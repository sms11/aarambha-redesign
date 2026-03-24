'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import {
  activitySchema,
  facilitySchema,
  counselingPointsSchema,
} from '@/lib/validations/facilities';

// ─── Activities ──────────────────────────────────────────────────────────────

export async function getAllActivities() {
  return prisma.activity.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createActivity(data: {
  tag: string;
  title: string;
  description: string;
  image: string;
  color: string;
  section: string;
}) {
  const parsed = activitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.activity.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.activity.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/facilities');
  return { success: true };
}

export async function updateActivity(
  id: number,
  data: {
    tag: string;
    title: string;
    description: string;
    image: string;
    color: string;
    section: string;
  }
) {
  const parsed = activitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.activity.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/facilities');
  return { success: true };
}

export async function deleteActivity(id: number) {
  await prisma.activity.delete({ where: { id } });
  revalidatePath('/facilities');
  return { success: true };
}

export async function reorderActivity(id: number, direction: 'up' | 'down') {
  const current = await prisma.activity.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.activity.findFirst({
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
      prisma.activity.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.activity.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/facilities');
}

// ─── Facilities ──────────────────────────────────────────────────────────────

export async function getAllFacilities() {
  return prisma.facility.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createFacility(data: {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  category: string;
  icon?: string;
  color?: string;
}) {
  const parsed = facilitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.facility.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.facility.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/facilities');
  return { success: true };
}

export async function updateFacility(
  id: number,
  data: {
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
    category: string;
    icon?: string;
    color?: string;
  }
) {
  const parsed = facilitySchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.facility.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/facilities');
  return { success: true };
}

export async function deleteFacility(id: number) {
  await prisma.facility.delete({ where: { id } });
  revalidatePath('/facilities');
  return { success: true };
}

export async function reorderFacility(id: number, direction: 'up' | 'down') {
  const current = await prisma.facility.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.facility.findFirst({
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
      prisma.facility.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.facility.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/facilities');
}

// ─── Counseling Points (SiteSettings) ────────────────────────────────────────

export async function getCounselingPoints(): Promise<string[]> {
  const setting = await prisma.siteSettings.findUnique({
    where: { key: 'counseling_points' },
  });

  if (!setting) return [];

  try {
    return JSON.parse(setting.value) as string[];
  } catch {
    return [];
  }
}

export async function updateCounselingPoints(points: string[]) {
  const parsed = counselingPointsSchema.safeParse({ counseling_points: points });
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const value = JSON.stringify(parsed.data.counseling_points);

  await prisma.siteSettings.upsert({
    where: { key: 'counseling_points' },
    create: { key: 'counseling_points', value },
    update: { value },
  });

  revalidatePath('/facilities');
  return { success: true };
}
