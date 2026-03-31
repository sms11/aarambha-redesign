"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface FacilityItem {
  id: number;
  title: string;
  subtitle: string | null;
  description: string;
  image: string | null;
  category: string;
}

export interface FacilitiesPageClientProps {
  beyondTextbooks: FacilityItem[];
  eca: FacilityItem[];
  resources: FacilityItem[];
}

/* ──────────────────────────────────────────────
   Category metadata
   ────────────────────────────────────────────── */

const CATEGORIES = [
  {
    key: "beyond_textbooks",
    tabLabel: "Learn Beyond Textbooks",
    emoji: "📖",
    sectionLabel: "From Knowledge to Real-World Skills",
    heading: "Learning Goes Beyond Textbooks at Aarambha!",
    description:
      "At Aarambha, we believe learning should be fun, engaging, and prepare you for the future, no matter what path you choose! Here's what sets our teaching approach apart.",
    overviewTitle: "Learning Approach Overview",
  },
  {
    key: "eca",
    tabLabel: "ECA",
    emoji: "🏆",
    sectionLabel: "From Learning to Life Skills",
    heading: "Extra-Curricular Activities at Aarambha",
    description:
      "At Aarambha School, we believe learning shouldn't stop at textbooks. That's why we offer a variety of exciting activities to help your child grow and develop outside the classroom!",
    overviewTitle: "ECA Overview",
  },
  {
    key: "resources",
    tabLabel: "Learning Resources",
    emoji: "🏫",
    sectionLabel: "From Infrastructure to Inspiration",
    heading: "Learning Beyond the Classroom at Aarambha",
    description:
      "We are equipped with modern learning spaces, advanced technology, and student-focused facilities that support academic excellence, creativity, safety, and overall wellbeing.",
    overviewTitle: "Resources Overview",
  },
];

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */

export default function FacilitiesPageClient({
  beyondTextbooks,
  eca,
  resources,
}: FacilitiesPageClientProps) {
  const [activeTab, setActiveTab] = useState(0);
  const dataMap: Record<string, FacilityItem[]> = {
    beyond_textbooks: beyondTextbooks,
    eca,
    resources,
  };

  const cat = CATEGORIES[activeTab];
  const items = dataMap[cat.key] || [];

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
            Facilities & Environment
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6">
            {cat.tabLabel}
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Discover our world-class facilities designed to inspire learning, creativity, and growth.
          </p>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-center">
          <div className="inline-flex bg-gray-50 rounded-full p-1.5 gap-1 flex-wrap justify-center overflow-x-auto max-w-full">
            {CATEGORIES.map((c, i) => (
              <button
                key={c.key}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  i === activeTab
                    ? "bg-[var(--navy)] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-base">{c.emoji}</span>
                {c.tabLabel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={cat.key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Section Intro */}
        <section className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-[#FF6B35] rounded-full" />
                  <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
                    {cat.sectionLabel}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display text-[var(--navy)] leading-tight max-w-lg">
                  {cat.heading}
                </h2>
              </div>
              <p className="lg:max-w-sm text-base text-[#5a5a5a] leading-relaxed lg:pt-6">
                {cat.description}
              </p>
            </div>

            {/* Image Grid (use first 3 facility images) */}
            {items.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 md:mb-16 rounded-2xl overflow-hidden">
                <div className="col-span-2 row-span-2">
                  <SmartImage
                    src={items[0]?.image || "/images/placeholder.webp"}
                    alt={items[0]?.title || "Facility"}
                    width={800}
                    height={500}
                    className="w-full h-full min-h-[300px] object-cover rounded-2xl"
                  />
                </div>
                {items.slice(1, 3).map((item, i) => (
                  <div key={item.id}>
                    <SmartImage
                      src={item.image || "/images/placeholder.webp"}
                      alt={item.title}
                      width={400}
                      height={250}
                      className="w-full h-full min-h-[145px] object-cover rounded-2xl"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Decorative star */}
            <div className="relative">
              <div className="absolute -top-8 right-0 opacity-15">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M30 5 L35 20 L50 20 L38 30 L42 45 L30 37 L18 45 L22 30 L10 20 L25 20 Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            </div>

            {/* Overview Title */}
            <h3 className="text-2xl font-display font-bold text-[var(--navy)] text-center mb-16">
              {cat.overviewTitle}
            </h3>

            {/* Facility Items — alternating layout */}
            <div className="space-y-24">
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Text — always on left */}
                  <div className="relative">
                    {/* Decorative teal waves */}
                    {i === 0 && (
                      <div className="absolute -left-8 top-0 opacity-25">
                        <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
                          <path d="M0 6 Q6 0 12 6 Q18 12 24 6 Q30 0 36 6" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" fill="none" />
                          <path d="M0 14 Q6 8 12 14 Q18 20 24 14 Q30 8 36 14" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-5 bg-[#FF6B35] rounded-full" />
                      <span className="text-[#FF6B35] font-semibold text-xs uppercase tracking-wider">
                        {item.subtitle || item.title}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display text-[var(--navy)] mb-4 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-base text-[#5a5a5a] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className="relative">
                    {/* Decorative star top-right */}
                    {i === 0 && (
                      <div className="absolute -top-4 -right-4 opacity-20">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <path d="M20 4 L24 15 L35 15 L26 22 L29 33 L20 27 L11 33 L14 22 L5 15 L16 15 Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
                        </svg>
                      </div>
                    )}
                    {item.image && (
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        width={600}
                        height={400}
                        className="w-full h-[300px] lg:h-[350px] object-cover rounded-2xl shadow-lg"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[var(--navy)] py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[var(--gold)] animate-blob" />
            <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-[var(--teal)] animate-blob" style={{ animationDelay: "1.5s" }} />
          </div>
          <motion.div
            className="relative z-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
              Experience Our Facilities
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Schedule a visit to see our campus and learning environment in person.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[var(--orange)] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#e55a2b] transition-colors shadow-lg"
              >
                Schedule a Visit
              </Link>
              <Link
                href="/gallery"
                className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                View Gallery
              </Link>
            </div>
          </motion.div>
        </section>
      </motion.div>
    </>
  );
}
