'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SmartImage from '@/components/SmartImage';

interface NewsEventItem {
  id: number;
  title: string;
  description: string;
  content: string | null;
  image: string | null;
  date: string;
  category: string;
  featured: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  news: '#3B82F6',
  event: '#14B8A6',
  announcement: '#F59E0B',
};

const CATEGORY_LABELS: Record<string, string> = {
  news: 'News',
  event: 'Event',
  announcement: 'Announcement',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function NewsPageClient({ items }: { items: NewsEventItem[] }) {
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

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
            Stay Updated
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6">
            News & Events
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Latest happenings, events, and announcements from Aarambha School
          </p>
        </motion.div>
      </section>

      {/* Filter + Content */}
      <section className="bg-[#f9f8f6] py-16 px-6 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === cat
                    ? 'bg-[var(--navy)] text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'all' ? 'All' : CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                {item.image && (
                  <div className="relative h-48 overflow-hidden">
                    <SmartImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className="inline-flex px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#6B7280' }}
                      >
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2 font-medium">
                    {formatDate(item.date)}
                  </p>
                  <h2 className="font-display font-bold text-[var(--navy)] text-lg mb-2 leading-snug">
                    {item.title}
                  </h2>
                  <p className="text-sm text-[#5a5a5a] leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {item.content && (
                    <>
                      {expandedId === item.id ? (
                        <div className="mt-3 text-sm text-[#5a5a5a] leading-relaxed whitespace-pre-line border-t border-gray-100 pt-3">
                          {item.content}
                          <button
                            onClick={() => setExpandedId(null)}
                            className="block mt-3 text-[var(--navy)] font-semibold text-xs hover:underline"
                          >
                            Show less
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setExpandedId(item.id)}
                          className="text-[var(--navy)] font-semibold text-sm hover:underline"
                        >
                          Read more &rarr;
                        </button>
                      )}
                    </>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <span className="text-5xl mb-4 block">📰</span>
              <p className="text-gray-500">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
