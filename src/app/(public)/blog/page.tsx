export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: "Blog | Aarambha School",
  description: "Read insights, stories, and articles about education, teaching methods, and student life at Aarambha School.",
};
import BlogListClient from '@/components/pages/BlogListClient';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  });

  const serialized = JSON.parse(JSON.stringify(posts));
  return <BlogListClient posts={serialized} />;
}
