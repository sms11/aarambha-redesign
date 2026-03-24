import { z } from 'zod';

export const specialFeatureSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  icon: z.string().min(1, 'Icon is required').max(50),
  color: z.string().min(1, 'Color is required').max(50),
  bg: z.string().min(1, 'Background is required').max(50),
});

export type SpecialFeatureInput = z.infer<typeof specialFeatureSchema>;
