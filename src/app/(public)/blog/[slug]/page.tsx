export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  return {
    title: post ? `${post.title} | Aarambha School Blog` : "Blog Post | Aarambha School",
    description: post?.excerpt || "Read this blog post from Aarambha School.",
  };
}
import { notFound } from 'next/navigation';
import BlogPostClient from '@/components/pages/BlogPostClient';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });

  if (!post || !post.published) notFound();

  const serialized = JSON.parse(JSON.stringify(post));
  return <BlogPostClient post={serialized} />;
}
