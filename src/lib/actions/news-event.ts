'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { newsEventSchema } from '@/lib/validations/news-event';

export async function getNewsEvents() {
  return prisma.newsEvent.findMany({ orderBy: { date: 'desc' } });
}

export async function createNewsEvent(data: unknown) {
  await requireAuth();
  const parsed = newsEventSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { date, ...rest } = parsed.data;
  await prisma.newsEvent.create({
    data: { ...rest, date: new Date(date) },
  });

  revalidatePath('/');
  revalidatePath('/news');
  return { success: true };
}

export async function updateNewsEvent(id: number, data: unknown) {
  await requireAuth();
  const parsed = newsEventSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { date, ...rest } = parsed.data;
  await prisma.newsEvent.update({
    where: { id },
    data: { ...rest, date: new Date(date) },
  });

  revalidatePath('/');
  revalidatePath('/news');
  return { success: true };
}

export async function deleteNewsEvent(id: number) {
  await requireAuth();
  await prisma.newsEvent.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/news');
  return { success: true };
}
