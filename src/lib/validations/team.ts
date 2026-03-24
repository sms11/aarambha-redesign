import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.string().min(1, 'Role is required').max(100),
  image: z.string().url('A valid image URL is required').max(500),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
