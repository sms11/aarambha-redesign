"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PlayCircleIcon } from "@heroicons/react/24/outline";

const categories = ["All", "Campus", "Classrooms", "Events", "Sports", "Labs"] as const;

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

export default function GalleryPage() {
  return (
    <>
      <HeroSection />
      <CategoryFilters />
    </>
  );
}

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
      <div className="absolute inset-0 bg-[rgba(30,74,122,0.85)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center px-6"
      >
        <span className="text-label text-[var(--gold)] block mb-4">Life at Aarambha</span>
        <h1 className="text-hero font-display text-white">Gallery</h1>
      </motion.div>
    </section>
  );
}

function CategoryFilters() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <>
      {/* Category Filter Pills */}
      <section className="py-12 px-6">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              aria-pressed={activeFilter === category}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                activeFilter === category
                  ? "bg-[var(--navy)] text-white"
                  : "bg-white text-[var(--muted)] border border-gray-200 hover:border-[var(--navy)]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Photo Grid */}
      <section className="px-6 pb-20">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="break-inside-avoid mb-4 relative group rounded-xl overflow-hidden"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-[rgba(30,74,122,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-label text-[var(--gold)]">{item.category}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 px-6 bg-[var(--navy)]">
        <div className="text-center">
          <h2 className="text-title font-display text-white">Video Gallery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {videoItems.map((title) => (
            <div key={title} className="bg-white/10 rounded-xl overflow-hidden">
              <div className="h-48 flex items-center justify-center">
                <PlayCircleIcon className="w-16 h-16 text-white/50" />
              </div>
              <div className="p-4">
                <h3 className="text-small font-display text-white">{title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[var(--cream)] text-center">
        <h2 className="text-title font-display text-[var(--navy)] mb-4">Want to See More?</h2>
        <p className="text-body text-[var(--muted)] max-w-2xl mx-auto mb-10">
          Photos capture moments, but nothing compares to experiencing our campus in person.
          Schedule a visit or start your application today.
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
      </section>
    </>
  );
}
