import { z } from 'zod';

export const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  image: z.string().url('A valid image URL is required').or(z.literal('')).default(''),
  stars: z.coerce.number().int().min(1, 'Stars must be 1-5').max(5, 'Stars must be 1-5').default(5),
  color: z.string().min(1, 'Color is required'),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
