import { z } from 'zod';

export const coreValueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  icon: z.string().min(1, 'Icon is required').max(50),
  emoji: z.string().min(1, 'Emoji is required').max(10),
  color: z.string().min(1, 'Color is required').max(50),
});

export type CoreValueInput = z.infer<typeof coreValueSchema>;

export const philosophySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  emoji: z.string().min(1, 'Emoji is required').max(10),
  color: z.string().min(1, 'Color is required').max(50),
});

export type PhilosophyInput = z.infer<typeof philosophySchema>;

export const missionVisionSchema = z.object({
  mission: z.string().min(1, 'Mission is required').max(500),
  vision: z.string().min(1, 'Vision is required').max(500),
});

export type MissionVisionInput = z.infer<typeof missionVisionSchema>;
