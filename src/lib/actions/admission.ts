'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { headers } from 'next/headers';

const enquirySchema = z.object({
  studentName: z.string().min(1, 'Student name is required').max(100),
  age: z.string().min(1, 'Age is required').max(20).regex(/^\d+/, 'Age must start with a number'),
  gender: z.enum(['Male', 'Female', 'Other']),
  gradeApplied: z.enum(['Nursery', 'LKG', 'UKG', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']),
  address: z.string().min(1, 'Address is required').max(500),
  previousSchool: z.string().max(200).optional().default(''),
  guardianName: z.string().min(1, "Guardian's name is required").max(100),
  relation: z.string().min(1, 'Relation is required').max(50),
  contactNumber: z.string().min(1, 'Contact number is required').max(20).regex(/^[+\d\s\-()]+$/, 'Invalid phone number format'),
});

export async function submitEnquiry(formData: FormData) {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(`admission-form:${ip}`)) {
    return { success: false, error: 'Too many submissions. Please try again in a minute.' };
  }

  const recaptchaToken = formData.get('recaptchaToken') as string;
  if (!recaptchaToken) {
    return { success: false, error: 'Please complete the CAPTCHA verification.' };
  }
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return { success: false, error: 'CAPTCHA verification failed. Please try again.' };
  }

  const parsed = enquirySchema.safeParse({
    studentName: formData.get('studentName'),
    age: formData.get('age'),
    gender: formData.get('gender'),
    gradeApplied: formData.get('gradeApplied'),
    address: formData.get('address'),
    previousSchool: formData.get('previousSchool'),
    guardianName: formData.get('guardianName'),
    relation: formData.get('relation'),
    contactNumber: formData.get('contactNumber'),
  });

  if (!parsed.success) {
    return { success: false, error: 'Please fill in all required fields.' };
  }

  await prisma.admissionEnquiry.create({ data: parsed.data });
  return { success: true };
}

// ─── Admin Actions ──────────────────────────────────────────────────────────

export async function getAllEnquiries() {
  await requireAuth();
  return prisma.admissionEnquiry.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function markEnquiryAsRead(id: number) {
  await requireAuth();
  await prisma.admissionEnquiry.update({ where: { id }, data: { read: true } });
  revalidatePath('/admin/admissions');
}

export async function deleteEnquiry(id: number) {
  await requireAuth();
  await prisma.admissionEnquiry.delete({ where: { id } });
  revalidatePath('/admin/admissions');
}
