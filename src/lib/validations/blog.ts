import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required').max(20000),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
  author: z.string().max(100).optional().default('Aarambha School'),
  published: z.boolean().optional().default(true),
  publishedAt: z.string().min(1, 'Date is required'),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
