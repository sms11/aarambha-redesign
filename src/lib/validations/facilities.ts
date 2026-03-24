import { z } from 'zod';

export const activitySchema = z.object({
  tag: z.string().min(1, 'Tag is required').max(50),
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  image: z.string().url('A valid image URL is required').max(500),
  color: z.string().min(1, 'Color is required').max(50),
  section: z.string().min(1, 'Section is required').max(50),
});

export type ActivityInput = z.infer<typeof activitySchema>;

export const facilitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  subtitle: z.string().max(200).optional().default(''),
  description: z.string().min(1, 'Description is required').max(1000),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
  category: z.enum(['resource', 'lab', 'digital', 'health', 'convenience']),
  icon: z.string().max(50).optional().default(''),
  color: z.string().max(50).optional().default(''),
});

export type FacilityInput = z.infer<typeof facilitySchema>;

export const counselingPointsSchema = z.object({
  counseling_points: z.array(z.string().min(1)).min(1, 'At least one point is required'),
});

export type CounselingPointsInput = z.infer<typeof counselingPointsSchema>;
