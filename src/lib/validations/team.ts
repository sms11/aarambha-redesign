import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  image: z.string().url('A valid image URL is required'),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
