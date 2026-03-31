'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { whatWeOfferSchema } from '@/lib/validations/what-we-offer';

export async function getWhatWeOffer() {
  return prisma.whatWeOffer.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createWhatWeOffer(data: unknown) {
  await requireAuth();
  const parsed = whatWeOfferSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  const count = await prisma.whatWeOffer.count();
  await prisma.whatWeOffer.create({ data: { ...parsed.data, sortOrder: count } });

  revalidatePath('/about');
  return { success: true };
}

export async function updateWhatWeOffer(id: number, data: unknown) {
  await requireAuth();
  const parsed = whatWeOfferSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  await prisma.whatWeOffer.update({ where: { id }, data: parsed.data });

  revalidatePath('/about');
  return { success: true };
}

export async function deleteWhatWeOffer(id: number) {
  await requireAuth();
  await prisma.whatWeOffer.delete({ where: { id } });
  revalidatePath('/about');
  return { success: true };
}
