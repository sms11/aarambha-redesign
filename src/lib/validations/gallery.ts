import { z } from 'zod';

export const galleryImageSchema = z.object({
  src: z.string().url('A valid image URL is required').max(500),
  alt: z.string().min(1, 'Alt text is required').max(200),
  category: z.enum(['School Life', 'Campus', 'Labs', 'Community', 'Team']),
});

export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
