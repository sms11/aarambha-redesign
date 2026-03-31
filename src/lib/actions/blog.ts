'use server';

import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { blogPostSchema } from '@/lib/validations/blog';

export async function getBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { publishedAt: 'desc' } });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function createBlogPost(data: unknown) {
  await requireAuth();
  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { publishedAt, ...rest } = parsed.data;
  await prisma.blogPost.create({
    data: { ...rest, publishedAt: new Date(publishedAt) },
  });

  revalidatePath('/');
  revalidatePath('/blog');
  return { success: true };
}

export async function updateBlogPost(id: number, data: unknown) {
  await requireAuth();
  const parsed = blogPostSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { publishedAt, ...rest } = parsed.data;
  await prisma.blogPost.update({
    where: { id },
    data: { ...rest, publishedAt: new Date(publishedAt) },
  });

  revalidatePath('/');
  revalidatePath('/blog');
  return { success: true };
}

export async function deleteBlogPost(id: number) {
  await requireAuth();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/blog');
  return { success: true };
}
