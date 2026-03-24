import { z } from 'zod';

export const contactInfoSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  value: z.string().min(1, 'Value is required').max(500),
  type: z.enum(['address', 'phone', 'email', 'hours']),
  icon: z.string().min(1, 'Icon is required').max(50),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;
