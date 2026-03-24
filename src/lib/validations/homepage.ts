import { z } from 'zod';

export const statSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  suffix: z.string().optional().default(''),
  emoji: z.string().min(1, 'Emoji is required'),
});

export type StatInput = z.infer<typeof statSchema>;

export const homepageFeatureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1, 'Icon is required'),
  image: z.string().url('A valid image URL is required'),
});

export type HomepageFeatureInput = z.infer<typeof homepageFeatureSchema>;

export const schoolLifeItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  icon: z.string().min(1, 'Icon is required'),
  image: z.string().url('A valid image URL is required'),
});

export type SchoolLifeItemInput = z.infer<typeof schoolLifeItemSchema>;

export const principalMessageSchema = z.object({
  principal_message: z.string().min(1, 'Principal message is required'),
  principal_name: z.string().min(1, 'Principal name is required'),
  principal_image: z.string().url('A valid image URL is required').or(z.literal('')).default(''),
});

export type PrincipalMessageInput = z.infer<typeof principalMessageSchema>;
