import { z } from 'zod';

export const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required').max(1000),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
  stars: z.coerce.number().int().min(1, 'Stars must be 1-5').max(5, 'Stars must be 1-5').default(5),
  color: z.string().min(1, 'Color is required').max(50),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
