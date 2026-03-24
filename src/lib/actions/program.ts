'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { programSchema } from '@/lib/validations/program';
import { specialFeatureSchema } from '@/lib/validations/special-features';
import { keyBenefitSchema } from '@/lib/validations/key-benefits';

export async function getAllPrograms() {
  return prisma.program.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getProgramById(id: number) {
  return prisma.program.findUnique({ where: { id } });
}

export async function createProgram(data: {
  name: string;
  ages: string;
  grades: string;
  description: string;
  highlights: string[];
  teaching: string;
  image: string;
  color: string;
  emoji: string;
}) {
  const parsed = programSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.program.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.program.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  revalidatePath('/programs');
  return { success: true };
}

export async function updateProgram(
  id: number,
  data: {
    name: string;
    ages: string;
    grades: string;
    description: string;
    highlights: string[];
    teaching: string;
    image: string;
    color: string;
    emoji: string;
  }
) {
  const parsed = programSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.program.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  revalidatePath('/programs');
  return { success: true };
}

export async function deleteProgram(id: number) {
  await prisma.program.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/programs');
  return { success: true };
}

export async function reorderProgram(id: number, direction: 'up' | 'down') {
  const current = await prisma.program.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.program.findFirst({
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
      prisma.program.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.program.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
  revalidatePath('/programs');
}

// ─── SpecialFeature CRUD ────────────────────────────────────────────────────

export async function getAllSpecialFeatures() {
  return prisma.specialFeature.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createSpecialFeature(formData: FormData) {
  const parsed = specialFeatureSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    icon: formData.get('icon'),
    color: formData.get('color'),
    bg: formData.get('bg'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.specialFeature.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.specialFeature.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/programs');
  return { success: true };
}

export async function updateSpecialFeature(id: number, formData: FormData) {
  const parsed = specialFeatureSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    icon: formData.get('icon'),
    color: formData.get('color'),
    bg: formData.get('bg'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.specialFeature.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/programs');
  return { success: true };
}

export async function deleteSpecialFeature(id: number) {
  await prisma.specialFeature.delete({ where: { id } });
  revalidatePath('/programs');
  return { success: true };
}

export async function reorderSpecialFeature(id: number, direction: 'up' | 'down') {
  const current = await prisma.specialFeature.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.specialFeature.findFirst({
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
      prisma.specialFeature.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.specialFeature.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/programs');
}

// ─── KeyBenefit CRUD ────────────────────────────────────────────────────────

export async function getAllKeyBenefits() {
  return prisma.keyBenefit.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createKeyBenefit(formData: FormData) {
  const parsed = keyBenefitSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    emoji: formData.get('emoji'),
    color: formData.get('color'),
    bg: formData.get('bg'),
    border: formData.get('border'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.keyBenefit.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.keyBenefit.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/programs');
  return { success: true };
}

export async function updateKeyBenefit(id: number, formData: FormData) {
  const parsed = keyBenefitSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    emoji: formData.get('emoji'),
    color: formData.get('color'),
    bg: formData.get('bg'),
    border: formData.get('border'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.keyBenefit.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/programs');
  return { success: true };
}

export async function deleteKeyBenefit(id: number) {
  await prisma.keyBenefit.delete({ where: { id } });
  revalidatePath('/programs');
  return { success: true };
}

export async function reorderKeyBenefit(id: number, direction: 'up' | 'down') {
  const current = await prisma.keyBenefit.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.keyBenefit.findFirst({
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
      prisma.keyBenefit.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.keyBenefit.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/programs');
}
