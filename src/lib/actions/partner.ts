'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { partnerSchema } from '@/lib/validations/partner';

export async function getAllPartners() {
  return prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getPartnerById(id: number) {
  return prisma.partner.findUnique({ where: { id } });
}

export async function createPartner(formData: FormData) {
  const parsed = partnerSchema.safeParse({
    name: formData.get('name'),
    logo: formData.get('logo'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.partner.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.partner.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  revalidatePath('/admissions');
  return { success: true };
}

export async function updatePartner(id: number, formData: FormData) {
  const parsed = partnerSchema.safeParse({
    name: formData.get('name'),
    logo: formData.get('logo'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.partner.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  revalidatePath('/admissions');
  return { success: true };
}

export async function deletePartner(id: number) {
  await prisma.partner.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admissions');
  return { success: true };
}

export async function reorderPartner(id: number, direction: 'up' | 'down') {
  const current = await prisma.partner.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.partner.findFirst({
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
      prisma.partner.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.partner.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
  revalidatePath('/admissions');
}
