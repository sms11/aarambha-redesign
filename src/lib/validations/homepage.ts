import { z } from 'zod';

export const statSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  value: z.string().min(1, 'Value is required').max(50),
  suffix: z.string().max(10).optional().default(''),
  emoji: z.string().min(1, 'Emoji is required').max(10),
});

export type StatInput = z.infer<typeof statSchema>;

export const homepageFeatureSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  icon: z.string().min(1, 'Icon is required').max(50),
  image: z.string().url('A valid image URL is required').max(500),
});

export type HomepageFeatureInput = z.infer<typeof homepageFeatureSchema>;

export const schoolLifeItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  icon: z.string().min(1, 'Icon is required').max(50),
  image: z.string().url('A valid image URL is required').max(500),
});

export type SchoolLifeItemInput = z.infer<typeof schoolLifeItemSchema>;

export const principalMessageSchema = z.object({
  principal_message: z.string().min(1, 'Principal message is required').max(2000),
  principal_name: z.string().min(1, 'Principal name is required').max(100),
  principal_image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
});

export type PrincipalMessageInput = z.infer<typeof principalMessageSchema>;
