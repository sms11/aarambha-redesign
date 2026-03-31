'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  author: string;
  publishedAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BlogListClient({ posts }: { posts: BlogPostItem[] }) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[50vh] md:min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.9)] via-[rgba(30,74,122,0.8)] to-[rgba(19,47,80,0.92)]" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-4 block">
            Insights & Stories
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6">
            Our Blog
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Stay updated with the latest developments, innovative teaching methods, and inspiring stories from Aarambha.
          </p>
        </motion.div>
      </section>

      {/* Posts Grid */}
      <section className="bg-[#f9f8f6] py-16 px-6 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                <Link href={`/blog/${post.slug}`}>
                  {post.image && (
                    <div className="relative h-52 overflow-hidden">
                      <SmartImage
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display font-bold text-[var(--navy)] text-lg leading-snug">
                        {post.title}
                      </h2>
                      <span className="text-xs text-[#FF6B35] font-medium flex items-center gap-1 whitespace-nowrap ml-3">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-[#5a5a5a] leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <span className="text-[var(--navy)] font-semibold text-sm hover:underline">
                      Read More
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">✍️</span>
              <p className="text-gray-500">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
