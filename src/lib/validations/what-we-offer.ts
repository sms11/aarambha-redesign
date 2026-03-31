import { z } from 'zod';

export const whatWeOfferSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  image: z.string().url('A valid image URL is required').max(500).or(z.literal('')).default(''),
});

export type WhatWeOfferInput = z.infer<typeof whatWeOfferSchema>;
