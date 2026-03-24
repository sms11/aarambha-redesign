import { z } from 'zod';

export const coreValueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  icon: z.string().min(1, 'Icon is required'),
  emoji: z.string().min(1, 'Emoji is required'),
  color: z.string().min(1, 'Color is required'),
});

export type CoreValueInput = z.infer<typeof coreValueSchema>;

export const philosophySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  emoji: z.string().min(1, 'Emoji is required'),
  color: z.string().min(1, 'Color is required'),
});

export type PhilosophyInput = z.infer<typeof philosophySchema>;

export const missionVisionSchema = z.object({
  mission: z.string().min(1, 'Mission is required'),
  vision: z.string().min(1, 'Vision is required'),
});

export type MissionVisionInput = z.infer<typeof missionVisionSchema>;
