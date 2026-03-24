'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { programSchema } from '@/lib/validations/program';

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
