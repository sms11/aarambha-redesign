"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface GalleryImageItem {
  id: number;
  src: string;
  alt: string;
  category: string;
}

export interface GalleryPageClientProps {
  galleryImages: GalleryImageItem[];
}

/* ──────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────── */

const categoryColors: Record<string, string> = {
  All: "var(--gold)",
  "School Life": "var(--coral)",
  Campus: "var(--mint)",
  Labs: "var(--lavender)",
  Community: "var(--peach)",
  Team: "var(--navy-light)",
};

/* ──────────────────────────────────────────────
   Decorative Components
   ────────────────────────────────────────────── */

function FloatingShape({
  color,
  size,
  top,
  left,
  delay = 0,
  shape = "circle",
}: {
  color: string;
  size: number;
  top: string;
  left: string;
  delay?: number;
  shape?: "circle" | "triangle" | "star" | "square";
}) {
  const shapeStyles: React.CSSProperties = {
    position: "absolute",
    top,
    left,
    width: size,
    height: size,
    opacity: 0.15,
    zIndex: 0,
    animationDelay: `${delay}s`,
  };

  if (shape === "circle") {
    return (
      <div
        className="animate-float-slow"
        style={{ ...shapeStyles, borderRadius: "50%", backgroundColor: color }}
      />
    );
  }
  if (shape === "triangle") {
    return (
      <div
        className="animate-float"
        style={{
          ...shapeStyles,
          width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        }}
      />
    );
  }
  if (shape === "star") {
    return (
      <div className="animate-wiggle" style={shapeStyles}>
        <StarIcon style={{ width: size, height: size, color }} />
      </div>
    );
  }
  return (
    <div
      className="animate-float"
      style={{
        ...shapeStyles,
        borderRadius: "4px",
        backgroundColor: color,
        transform: "rotate(15deg)",
      }}
    />
  );
}

function WaveDivider({ flip = false, color = "var(--cream)" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px]">
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-label text-[var(--gold)] block mb-3 tracking-[3px]">
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */

export default function GalleryPageClient({ galleryImages }: GalleryPageClientProps) {
  return (
    <>
      <HeroSection />
      <WaveDivider color="white" />
      <GallerySection galleryImages={galleryImages} />
      <WaveDivider color="var(--navy)" />
      <CTASection />
    </>
  );
}

/* ──────────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center">
      <SmartImage
        src="/images/facilities/club-activities.webp"
        alt="Life at Aarambha"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.85)] via-[rgba(30,74,122,0.75)] to-[rgba(19,47,80,0.9)]" />

      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="18%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="65%" left="82%" shape="square" delay={0.5} />
      <FloatingShape color="#FBBF77" size={35} top="40%" left="93%" shape="circle" delay={1.5} />

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="text-label text-[var(--gold)] inline-flex items-center gap-2 tracking-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SparklesIcon className="w-4 h-4" />
          Life at Aarambha
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          Our <span className="text-[var(--gold)]">Gallery</span>
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A glimpse into the vibrant life, learning moments, and celebrations
          that make Aarambha truly special.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Gallery Grid with Filters
   ────────────────────────────────────────────── */

function GallerySection({ galleryImages }: { galleryImages: GalleryImageItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  /** Derive unique categories from the data */
  const categories = ["All", ...Array.from(new Set(galleryImages.map((item) => item.category)))];

  const filtered =
    activeFilter === "All"
      ? galleryImages
      : galleryImages.filter((item) => item.category === activeFilter);

  const counts = galleryImages.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <section className="relative bg-white py-24 px-6 overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="3%" left="92%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={45} top="90%" left="4%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <SectionLabel>Explore Moments</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Browse Our Photo Gallery
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Filter by category to explore different aspects of campus life,
            activities, and learning at Aarambha.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => {
            const isActive = activeFilter === category;
            const accentColor = categoryColors[category] ?? "var(--gold)";
            const count =
              category === "All"
                ? galleryImages.length
                : counts[category] || 0;
            return (
              <motion.button
                key={category}
                onClick={() => setActiveFilter(category)}
                aria-pressed={isActive}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer border-2"
                style={{
                  backgroundColor: isActive ? accentColor : "transparent",
                  borderColor: isActive ? accentColor : "#e5e7eb",
                  color: isActive ? "#fff" : "var(--muted)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {category}
                <span
                  className="ml-2 text-xs opacity-70"
                  style={{ color: isActive ? "#fff" : "var(--muted)" }}
                >
                  ({count})
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Masonry Photo Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  delay: index * 0.04,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className="break-inside-avoid mb-5 relative group rounded-2xl overflow-hidden cursor-pointer"
              >
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,47,80,0.85)] via-[rgba(30,74,122,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-5">
                  <span
                    className="px-3 py-1 rounded-full text-white text-tiny font-semibold mb-2"
                    style={{
                      backgroundColor: categoryColors[item.category] ?? "var(--gold)",
                    }}
                  >
                    {item.category}
                  </span>
                  <span className="text-small font-display text-white font-semibold">
                    {item.alt}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Count indicator */}
        <motion.p
          className="text-center text-small text-[var(--muted)] mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={activeFilter}
        >
          Showing {filtered.length} of {galleryImages.length} photos
          {activeFilter !== "All" && (
            <button
              onClick={() => setActiveFilter("All")}
              className="ml-2 text-[var(--navy)] font-semibold underline underline-offset-2 cursor-pointer"
            >
              Show all
            </button>
          )}
        </motion.p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — CTA
   ────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative bg-[var(--navy)] py-28 px-6 overflow-hidden">
      <FloatingShape color="#F5A623" size={120} top="10%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={80} top="60%" left="85%" shape="triangle" delay={0.5} />
      <FloatingShape color="#FF6B6B" size={50} top="20%" left="78%" shape="star" delay={1} />
      <FloatingShape color="#A78BFA" size={70} top="70%" left="12%" shape="square" delay={1.5} />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-5xl mb-4 block">📸</span>
        <h2 className="text-title font-display text-white mb-4">
          Want to See More?
        </h2>
        <p className="text-body text-white/70 max-w-2xl mx-auto mb-10">
          Photos capture moments, but nothing compares to experiencing our campus
          in person. Schedule a visit or start your application today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-cta">
            Schedule a Visit
          </Link>
          <Link href="/community" className="btn-secondary">
            Apply Now
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
