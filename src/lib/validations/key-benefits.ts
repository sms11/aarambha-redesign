import { z } from 'zod';

export const keyBenefitSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  emoji: z.string().min(1, 'Emoji is required'),
  color: z.string().min(1, 'Color is required'),
  bg: z.string().min(1, 'Background is required'),
  border: z.string().min(1, 'Border is required'),
});

export type KeyBenefitInput = z.infer<typeof keyBenefitSchema>;
