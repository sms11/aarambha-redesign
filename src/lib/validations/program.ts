import { z } from 'zod';

export const programSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ages: z.string().min(1, 'Ages is required'),
  grades: z.string().min(1, 'Grades is required'),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string().min(1)).default([]),
  teaching: z.string().min(1, 'Teaching approach is required'),
  image: z.string().url('A valid image URL is required').or(z.literal('')).default(''),
  color: z.string().min(1, 'Color is required'),
  emoji: z.string().min(1, 'Emoji is required'),
});

export type ProgramInput = z.infer<typeof programSchema>;
