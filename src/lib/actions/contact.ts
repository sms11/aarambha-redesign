'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { contactInfoSchema } from '@/lib/validations/contact-info';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function submitContactForm(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    purpose: formData.get('purpose'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { success: false, error: 'Please fill in all fields.' };
  }

  await prisma.contactSubmission.create({
    data: parsed.data,
  });

  return { success: true };
}

// ─── ContactInfo CRUD ───────────────────────────────────────────────────────

export async function getAllContactInfo() {
  return prisma.contactInfo.findMany({ orderBy: { sortOrder: 'asc' } });
}

export async function createContactInfo(formData: FormData) {
  const parsed = contactInfoSchema.safeParse({
    label: formData.get('label'),
    value: formData.get('value'),
    type: formData.get('type'),
    icon: formData.get('icon'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const maxOrder = await prisma.contactInfo.findFirst({
    orderBy: { sortOrder: 'desc' },
  });

  await prisma.contactInfo.create({
    data: {
      ...parsed.data,
      sortOrder: (maxOrder?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath('/contact');
  return { success: true };
}

export async function updateContactInfo(id: number, formData: FormData) {
  const parsed = contactInfoSchema.safeParse({
    label: formData.get('label'),
    value: formData.get('value'),
    type: formData.get('type'),
    icon: formData.get('icon'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  await prisma.contactInfo.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath('/contact');
  return { success: true };
}

export async function deleteContactInfo(id: number) {
  await prisma.contactInfo.delete({ where: { id } });
  revalidatePath('/contact');
  return { success: true };
}

export async function reorderContactInfo(id: number, direction: 'up' | 'down') {
  const current = await prisma.contactInfo.findUnique({ where: { id } });
  if (!current) return;

  const adjacent = await prisma.contactInfo.findFirst({
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
      prisma.contactInfo.update({
        where: { id: current.id },
        data: { sortOrder: adjacent.sortOrder },
      }),
      prisma.contactInfo.update({
        where: { id: adjacent.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);
  }

  revalidatePath('/contact');
}

// ─── Contact Submissions Management ─────────────────────────────────────────

export async function getAllSubmissions() {
  return prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function markAsRead(id: number) {
  await prisma.contactSubmission.update({
    where: { id },
    data: { read: true },
  });
  return { success: true };
}

export async function deleteSubmission(id: number) {
  await prisma.contactSubmission.delete({ where: { id } });
  return { success: true };
}
