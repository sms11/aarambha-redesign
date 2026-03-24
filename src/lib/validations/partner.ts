import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  logo: z.string().url('A valid logo URL is required'),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
