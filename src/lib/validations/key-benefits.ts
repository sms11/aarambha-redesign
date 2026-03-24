import { z } from 'zod';

export const keyBenefitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  emoji: z.string().min(1, 'Emoji is required').max(10),
  color: z.string().min(1, 'Color is required').max(50),
  bg: z.string().min(1, 'Background is required').max(50),
  border: z.string().min(1, 'Border is required').max(50),
});

export type KeyBenefitInput = z.infer<typeof keyBenefitSchema>;
