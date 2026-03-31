'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  publishedAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  return (
    <>
      {/* Hero with cover image */}
      <section className="relative">
        {post.image && (
          <div className="relative h-[300px] md:h-[400px]">
            <SmartImage src={post.image} alt={post.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/60 to-transparent" />
          </div>
        )}
        {!post.image && (
          <div className="h-[200px] bg-gradient-to-br from-[var(--navy)] via-[#1a3a5c] to-[#0d2137]" />
        )}

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4" /> Back to Blog
            </Link>
            <motion.h1
              className="text-3xl md:text-4xl font-display text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {post.title}
            </motion.h1>
            <div className="flex items-center gap-4 mt-4 text-white/70 text-sm">
              <span>{post.author}</span>
              <span>&middot;</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16 px-6">
        <article className="max-w-3xl mx-auto prose prose-lg prose-slate">
          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-[#333] leading-relaxed mb-5 text-base">
              {paragraph}
            </p>
          ))}
        </article>
      </section>

      {/* Back */}
      <section className="bg-[#f9f8f6] py-10 px-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#1a2744] transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" /> All Blog Posts
        </Link>
      </section>
    </>
  );
}
