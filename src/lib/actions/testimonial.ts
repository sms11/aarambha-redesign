'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { testimonialSchema } from '@/lib/validations/testimonial';
import { requireAuth } from '@/lib/auth';

export async function getAllTestimonials() {
  return prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getTestimonialById(id: number) {
  return prisma.testimonial.findUnique({ where: { id } });
}

export async function createTestimonial(formData: FormData) {
  await requireAuth();
  const parsed = testimonialSchema.safeParse({
    quote: formData.get('quote'),
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image') || '',
    stars: formData.get('stars'),
    color: formData.get('color'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.testimonial.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.testimonial.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  revalidatePath('/community');
  return { success: true };
}

export async function updateTestimonial(id: number, formData: FormData) {
  await requireAuth();
  const parsed = testimonialSchema.safeParse({
    quote: formData.get('quote'),
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image') || '',
    stars: formData.get('stars'),
    color: formData.get('color'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.testimonial.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  revalidatePath('/community');
  return { success: true };
}

export async function deleteTestimonial(id: number) {
  await requireAuth();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/community');
  return { success: true };
}

export async function reorderTestimonial(id: number, direction: 'up' | 'down') {
  await requireAuth();
  const current = await prisma.testimonial.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.testimonial.findFirst({
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
      prisma.testimonial.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.testimonial.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
  revalidatePath('/community');
}
