export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import GalleryPageClient from "@/components/pages/GalleryPageClient";

export const metadata: Metadata = {
  title: "Gallery | Aarambha School",
  description: "Browse photos of Aarambha School campus, events, classrooms, activities, and student life.",
};

export default async function GalleryPage() {
  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  /** Serialize Prisma DateTime fields to plain objects for client component */
  const serialized = JSON.parse(JSON.stringify(galleryImages)) as typeof galleryImages;

  return <GalleryPageClient galleryImages={serialized} />;
}
