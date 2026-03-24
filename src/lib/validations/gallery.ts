import { z } from 'zod';

export const galleryImageSchema = z.object({
  src: z.string().url('A valid image URL is required'),
  alt: z.string().min(1, 'Alt text is required'),
  category: z.enum(['School Life', 'Campus', 'Labs', 'Community', 'Team'], {
    errorMap: () => ({ message: 'Please select a valid category' }),
  }),
});

export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
