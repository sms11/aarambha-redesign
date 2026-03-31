import { z } from 'zod';

export const newsEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(500),
  content: z.string().max(5000).optional().default(''),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
  date: z.string().min(1, 'Date is required'),
  category: z.enum(['news', 'event', 'announcement']),
  featured: z.boolean().optional().default(false),
});

export type NewsEventInput = z.infer<typeof newsEventSchema>;
