import { z } from 'zod';

export const activitySchema = z.object({
  tag: z.string().min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('A valid image URL is required'),
  color: z.string().min(1, 'Color is required'),
  section: z.string().min(1, 'Section is required'),
});

export type ActivityInput = z.infer<typeof activitySchema>;

export const facilitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional().default(''),
  description: z.string().min(1, 'Description is required'),
  image: z.string().url('A valid image URL is required').or(z.literal('')).default(''),
  category: z.enum(['resource', 'lab', 'digital', 'health', 'convenience'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
  icon: z.string().optional().default(''),
  color: z.string().optional().default(''),
});

export type FacilityInput = z.infer<typeof facilitySchema>;

export const counselingPointsSchema = z.object({
  counseling_points: z.array(z.string().min(1)).min(1, 'At least one point is required'),
});

export type CounselingPointsInput = z.infer<typeof counselingPointsSchema>;
