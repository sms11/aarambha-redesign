import { z } from 'zod';

export const specialFeatureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  color: z.string().min(1, 'Color is required'),
  bg: z.string().min(1, 'Background is required'),
});

export type SpecialFeatureInput = z.infer<typeof specialFeatureSchema>;
