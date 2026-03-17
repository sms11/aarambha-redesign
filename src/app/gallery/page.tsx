"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PlayCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const categories = ["All", "Campus", "Classrooms", "Events", "Sports", "Labs"] as const;

const categoryColors: Record<string, string> = {
  All: "var(--gold)",
  Campus: "var(--coral)",
  Classrooms: "var(--mint)",
  Events: "var(--lavender)",
  Sports: "var(--peach)",
  Labs: "var(--navy-light)",
};

const galleryItems = [
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "School building exterior", category: "Campus" },
  { src: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80", alt: "Campus grounds", category: "Campus" },
  { src: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80", alt: "School entrance", category: "Campus" },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", alt: "Students in classroom", category: "Classrooms" },
  { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", alt: "Interactive learning", category: "Classrooms" },
  { src: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&q=80", alt: "Graduation ceremony", category: "Events" },
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80", alt: "Annual day celebration", category: "Events" },
  { src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80", alt: "Cultural program", category: "Events" },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", alt: "Sports ground", category: "Sports" },
  { src: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80", alt: "Athletics event", category: "Sports" },
  { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80", alt: "Science laboratory", category: "Labs" },
  { src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80", alt: "Computer lab", category: "Labs" },
];

const videoItems = ["Campus Tour", "A Day at Aarambha", "Student Testimonials"];

const videoColors = ["var(--coral)", "var(--mint)", "var(--lavender)"];

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

export default function GalleryPage() {
  return (
    <>
      <HeroSection />
      <GallerySection />
    </>
  );
}

/* ──────────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1920&q=80"
        alt="Life at Aarambha"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.85)] via-[rgba(30,74,122,0.75)] to-[rgba(19,47,80,0.9)]" />

      {/* Floating decorative shapes */}
      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="18%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="square" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="65%" left="82%" shape="circle" delay={0.5} />
      <FloatingShape color="#FBBF77" size={35} top="40%" left="93%" shape="triangle" delay={1.5} />

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

function GallerySection() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <>
      {/* Filter Pills */}
      <section className="relative bg-white py-24 px-6 overflow-hidden">
        <FloatingShape color="#F5A623" size={70} top="3%" left="92%" shape="circle" delay={0} />
        <FloatingShape color="#4ECDC4" size={45} top="90%" left="4%" shape="triangle" delay={1} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <SectionLabel>Explore Moments</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)]">
              Browse Our Photo Gallery
            </h2>
            <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
              Filter by category to explore different aspects of campus life, events,
              and learning at Aarambha.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((category) => {
              const isActive = activeFilter === category;
              const accentColor = categoryColors[category];
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
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                  className="break-inside-avoid mb-5 relative group rounded-2xl overflow-hidden cursor-pointer"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={400}
                    className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,47,80,0.8)] via-[rgba(30,74,122,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-start justify-end p-5">
                    <span
                      className="px-3 py-1 rounded-full text-white text-tiny font-semibold mb-2"
                      style={{ backgroundColor: categoryColors[item.category] }}
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
        </div>
      </section>

      {/* Video Section */}
      <WaveDivider color="var(--navy)" />
      <section className="bg-[var(--navy)] py-24 px-6 relative overflow-hidden">
        <FloatingShape color="#F5A623" size={80} top="10%" left="5%" shape="circle" delay={0} />
        <FloatingShape color="#FF6B6B" size={50} top="70%" left="90%" shape="square" delay={1} />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <SectionLabel>Watch & Discover</SectionLabel>
            <h2 className="text-title font-display text-white">
              Video Gallery
            </h2>
            <p className="text-body text-white/60 mt-4 max-w-xl mx-auto">
              Experience Aarambha through our collection of video stories and campus highlights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videoItems.map((title, index) => (
              <motion.div
                key={title}
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -6 }}
              >
                <div
                  className="h-56 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${videoColors[index]}22, ${videoColors[index]}11)`,
                  }}
                >
                  {/* Decorative accent corner */}
                  <div
                    className="absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-20"
                    style={{ backgroundColor: videoColors[index] }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-16 h-16 rounded-tr-[32px] opacity-15"
                    style={{ backgroundColor: videoColors[index] }}
                  />

                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${videoColors[index]}30`,
                      border: `2px solid ${videoColors[index]}60`,
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <PlayCircleIcon
                      className="w-12 h-12"
                      style={{ color: videoColors[index] }}
                    />
                  </motion.div>
                </div>

                <div className="p-5 bg-white/5 backdrop-blur-sm border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: videoColors[index] }}
                    />
                    <h3 className="text-small font-display text-white font-semibold">
                      {title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <WaveDivider flip color="var(--navy)" />

      {/* CTA Section */}
      <section className="relative bg-[var(--cream)] py-28 px-6 overflow-hidden">
        <FloatingShape color="#F5A623" size={100} top="10%" left="5%" shape="circle" delay={0} />
        <FloatingShape color="#4ECDC4" size={70} top="60%" left="88%" shape="triangle" delay={0.5} />
        <FloatingShape color="#FF6B6B" size={45} top="20%" left="78%" shape="square" delay={1} />
        <FloatingShape color="#A78BFA" size={60} top="70%" left="12%" shape="circle" delay={1.5} />

        <motion.div
          className="max-w-3xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-5xl mb-4 block">📸</span>
          <h2 className="text-title font-display text-[var(--navy)] mb-4">
            Want to See More?
          </h2>
          <p className="text-body text-[var(--muted)] max-w-2xl mx-auto mb-10">
            Photos capture moments, but nothing compares to experiencing our campus
            in person. Schedule a visit or start your application today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-cta">
              Schedule a Visit
            </Link>
            <Link
              href="/admissions"
              className="btn-secondary text-[var(--navy)] border-[var(--navy)]"
            >
              Apply Now
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
