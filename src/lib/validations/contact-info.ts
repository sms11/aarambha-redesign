import { z } from 'zod';

export const contactInfoSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  type: z.enum(['address', 'phone', 'email', 'hours']),
  icon: z.string().min(1, 'Icon is required'),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
