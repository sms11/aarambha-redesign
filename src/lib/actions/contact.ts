'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';

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
