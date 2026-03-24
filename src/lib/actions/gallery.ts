'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { galleryImageSchema } from '@/lib/validations/gallery';
import { requireAuth } from '@/lib/auth';

export async function getAllGalleryImages() {
  return prisma.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createGalleryImage(data: {
  src: string;
  alt: string;
  category: string;
}) {
  await requireAuth();
  const parsed = galleryImageSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.galleryImage.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.galleryImage.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/gallery');
  return { success: true };
}

export async function updateGalleryImage(
  id: number,
  data: {
    src: string;
    alt: string;
    category: string;
  }
) {
  await requireAuth();
  const parsed = galleryImageSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.galleryImage.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/gallery');
  return { success: true };
}

export async function deleteGalleryImage(id: number) {
  await requireAuth();
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath('/gallery');
  return { success: true };
}

export async function reorderGalleryImage(id: number, direction: 'up' | 'down') {
  await requireAuth();
  const current = await prisma.galleryImage.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.galleryImage.findFirst({
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
      prisma.galleryImage.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.galleryImage.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/gallery');
}
