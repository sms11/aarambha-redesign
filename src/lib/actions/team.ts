'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { teamMemberSchema } from '@/lib/validations/team';
import { requireAuth } from '@/lib/auth';

export async function getAllTeamMembers() {
  return prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function getTeamMemberById(id: number) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(formData: FormData) {
  await requireAuth();
  const parsed = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.teamMember.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.teamMember.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}

export async function updateTeamMember(id: number, formData: FormData) {
  await requireAuth();
  const parsed = teamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    image: formData.get('image'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.teamMember.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}

export async function deleteTeamMember(id: number) {
  await requireAuth();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}

export async function reorderTeamMember(id: number, direction: 'up' | 'down') {
  await requireAuth();
  const current = await prisma.teamMember.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.teamMember.findFirst({
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
      prisma.teamMember.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.teamMember.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/');
  revalidatePath('/about');
}
