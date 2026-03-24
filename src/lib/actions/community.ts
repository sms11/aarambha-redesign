'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { communitySchema } from '@/lib/validations/community';

export async function getAllCommunityItems() {
  return prisma.communityInvolvement.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getCommunityItemById(id: number) {
  return prisma.communityInvolvement.findUnique({ where: { id } });
}

export async function createCommunityItem(formData: FormData) {
  const parsed = communitySchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    image: formData.get('image') || '',
    color: formData.get('color') || '',
    section: formData.get('section'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.communityInvolvement.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.communityInvolvement.create({
    data: {
      ...parsed.data,
      image: parsed.data.image || null,
      color: parsed.data.color || null,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/community');
  return { success: true };
}

export async function updateCommunityItem(id: number, formData: FormData) {
  const parsed = communitySchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    image: formData.get('image') || '',
    color: formData.get('color') || '',
    section: formData.get('section'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.communityInvolvement.update({
    where: { id },
    data: {
      ...parsed.data,
      image: parsed.data.image || null,
      color: parsed.data.color || null,
    },
  });

  revalidatePath('/community');
  return { success: true };
}

export async function deleteCommunityItem(id: number) {
  await prisma.communityInvolvement.delete({ where: { id } });
  revalidatePath('/community');
  return { success: true };
}

export async function reorderCommunityItem(id: number, direction: 'up' | 'down') {
  const current = await prisma.communityInvolvement.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.communityInvolvement.findFirst({
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
      prisma.communityInvolvement.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.communityInvolvement.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/community');
}
