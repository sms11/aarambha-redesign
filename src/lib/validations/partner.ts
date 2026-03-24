import { z } from 'zod';

export const partnerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  logo: z.string().url('A valid logo URL is required').max(500),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
