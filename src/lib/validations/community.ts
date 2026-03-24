import { z } from 'zod';

export const communitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('A valid image URL is required').or(z.literal('')).default(''),
  color: z.string().default(''),
  section: z.enum(['parent_teacher', 'business', 'educational']),
});

export type CommunityInput = z.infer<typeof communitySchema>;
