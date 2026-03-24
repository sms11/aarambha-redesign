import { z } from 'zod';

export const communitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
  color: z.string().max(50).default(''),
  section: z.enum(['parent_teacher', 'business', 'educational']),
});

export type CommunityInput = z.infer<typeof communitySchema>;
