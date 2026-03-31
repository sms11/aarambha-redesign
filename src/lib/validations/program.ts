import { z } from 'zod';

export const programSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  ages: z.string().min(1, 'Ages is required').max(50),
  grades: z.string().min(1, 'Grades is required').max(50),
  description: z.string().min(1, 'Description is required').max(2000),
  highlights: z.array(z.string().min(1)).default([]),
  teaching: z.string().min(1, 'Teaching approach is required').max(2000),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
  color: z.string().min(1, 'Color is required').max(50),
  emoji: z.string().min(1, 'Emoji is required').max(10),
  sectionLabel: z.string().max(100).optional(),
  featureCards: z.string().max(5000).optional(),
  programHighlights: z.string().max(5000).optional(),
  galleryImages: z.array(z.string().url()).max(5).optional().default([]),
});

export type ProgramInput = z.infer<typeof programSchema>;
