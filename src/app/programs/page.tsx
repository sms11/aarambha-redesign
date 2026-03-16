"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  CalculatorIcon,
  BeakerIcon,
  BookOpenIcon,
  LanguageIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  MusicalNoteIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";

const programs = [
  {
    id: "preschool",
    name: "Pre-School",
    desc: "Our early years program nurtures curiosity through play-based learning, creating a safe and stimulating environment for children aged 3-5.",
    highlights: [
      "Creative Play & Exploration",
      "Language Development",
      "Motor Skills Building",
      "Social & Emotional Growth",
      "Early Numeracy",
      "Music & Movement",
    ],
    image:
      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80",
  },
  {
    id: "primary",
    name: "Primary School",
    desc: "Building strong foundations in literacy, numeracy, and character development through an engaging and supportive learning environment.",
    highlights: [
      "Core Academics",
      "Reading & Writing",
      "Mathematics",
      "Science Discovery",
      "Arts Integration",
      "Physical Education",
    ],
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
  },
  {
    id: "middle",
    name: "Middle School",
    desc: "Developing critical thinking, leadership, and subject expertise as students prepare for the challenges of higher education.",
    highlights: [
      "Advanced Academics",
      "Research Projects",
      "Leadership Programs",
      "Technology Skills",
      "Community Service",
      "Sports & Athletics",
    ],
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
  },
  {
    id: "high",
    name: "High School",
    desc: "Comprehensive preparation for university and beyond, with specialized tracks and real-world learning experiences.",
    highlights: [
      "University Prep",
      "Career Counseling",
      "Advanced Sciences",
      "Global Perspectives",
      "Internship Programs",
      "Competitive Exams",
    ],
    image:
      "https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80",
  },
];

const subjects = [
  { name: "Mathematics", Icon: CalculatorIcon },
  { name: "Science", Icon: BeakerIcon },
  { name: "English", Icon: BookOpenIcon },
  { name: "Nepali", Icon: LanguageIcon },
  { name: "Social Studies", Icon: GlobeAltIcon },
  { name: "Computer Science", Icon: ComputerDesktopIcon },
  { name: "Arts & Music", Icon: MusicalNoteIcon },
  { name: "Physical Education", Icon: TrophyIcon },
];

const extracurriculars = [
  {
    category: "Sports",
    items: ["Football", "Basketball", "Cricket", "Swimming", "Athletics"],
  },
  {
    category: "Arts",
    items: ["Painting", "Sculpture", "Drama", "Dance", "Photography"],
  },
  {
    category: "Clubs",
    items: ["Debate", "Science", "Literature", "Environment", "Robotics"],
  },
  {
    category: "Programs",
    items: [
      "Student Council",
      "Community Service",
      "Cultural Exchange",
      "Annual Day",
      "Field Trips",
    ],
  },
];

export default function ProgramsPage() {
  return (
    <>
      <HeroSection />
      <ProgramTabs />
      <CurriculumSection />
      <ExtracurricularSection />
      <CTASection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80"
        alt="Students learning in a classroom"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[var(--navy)]/80" />
      <div className="relative z-10 text-center px-6">
        <span className="text-label font-semibold text-[var(--gold)] tracking-widest mb-4 block">
          Academics
        </span>
        <h1 className="text-hero font-display text-white">
          Learning Journeys for Every Stage
        </h1>
      </div>
    </section>
  );
}

function ProgramTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveTab((prev) => (prev + 1) % programs.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveTab((prev) => (prev - 1 + programs.length) % programs.length);
      }
    },
    []
  );

  const current = programs[activeTab];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      {/* Tab buttons */}
      <div
        className="flex gap-3 flex-wrap justify-center mb-12"
        role="tablist"
        onKeyDown={handleKeyDown}
      >
        {programs.map((program, index) => (
          <button
            key={program.id}
            id={program.id}
            role="tab"
            aria-selected={activeTab === index}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              activeTab === index
                ? "bg-[var(--navy)] text-white"
                : "bg-white text-[var(--muted)] border border-gray-200"
            }`}
          >
            {program.name}
          </button>
        ))}
      </div>

      {/* Active program detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          role="tabpanel"
          aria-labelledby={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left: image */}
          <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden">
            <Image
              src={current.image}
              alt={current.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Right: details */}
          <div>
            <h2 className="text-title font-display text-[var(--navy)]">
              {current.name}
            </h2>
            <p className="text-body text-[var(--muted)] mt-3">
              {current.desc}
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              {current.highlights.map((highlight) => (
                <div key={highlight} className="flex items-center">
                  <CheckCircleIcon className="text-[var(--gold)] w-5 h-5 inline mr-2 flex-shrink-0" />
                  <span className="text-small text-[var(--charcoal)]">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function CurriculumSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="text-title font-display text-[var(--navy)]">
          Our Curriculum
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {subjects.map(({ name, Icon }) => (
          <div
            key={name}
            className="bg-[var(--cream)] rounded-xl p-6 text-center"
          >
            <Icon className="w-10 h-10 mx-auto mb-3 text-[var(--navy)]" />
            <h3 className="font-display text-[var(--navy)] text-sm font-semibold">
              {name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExtracurricularSection() {
  return (
    <section className="py-20 px-6 bg-[var(--cream)]">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="text-title font-display text-[var(--navy)]">
          Beyond the Classroom
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {extracurriculars.map(({ category, items }) => (
          <div key={category} className="bg-white rounded-xl p-6">
            <h3 className="text-subtitle font-display text-[var(--navy)] mb-4">
              {category}
            </h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-body text-[var(--charcoal)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--gold)] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-title font-display text-[var(--navy)] mb-4">
        Start Your Application
      </h2>
      <p className="text-body text-[var(--muted)] max-w-xl mx-auto mb-8">
        Join a community of learners where every child is encouraged to explore,
        grow, and achieve their fullest potential.
      </p>
      <Link href="/admissions" className="btn-cta">
        Apply Now
      </Link>
    </section>
  );
}
