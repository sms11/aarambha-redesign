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
import {
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

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
    color: "var(--coral)",
    emoji: "🎨",
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
    color: "var(--mint)",
    emoji: "📚",
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
    color: "var(--lavender)",
    emoji: "🔬",
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
    color: "var(--peach)",
    emoji: "🎓",
  },
];

const subjects = [
  { name: "Mathematics", Icon: CalculatorIcon, color: "var(--coral)", bg: "#FF6B6B15" },
  { name: "Science", Icon: BeakerIcon, color: "var(--mint)", bg: "#4ECDC415" },
  { name: "English", Icon: BookOpenIcon, color: "var(--lavender)", bg: "#A78BFA15" },
  { name: "Nepali", Icon: LanguageIcon, color: "var(--peach)", bg: "#FBBF7715" },
  { name: "Social Studies", Icon: GlobeAltIcon, color: "var(--navy-light)", bg: "#4EAED815" },
  { name: "Computer Science", Icon: ComputerDesktopIcon, color: "var(--coral)", bg: "#FF6B6B15" },
  { name: "Arts & Music", Icon: MusicalNoteIcon, color: "var(--mint)", bg: "#4ECDC415" },
  { name: "Physical Education", Icon: TrophyIcon, color: "var(--lavender)", bg: "#A78BFA15" },
];

const extracurriculars = [
  {
    category: "Sports",
    emoji: "🏅",
    color: "var(--coral)",
    bg: "#FF6B6B10",
    border: "#FF6B6B30",
    items: ["Football", "Basketball", "Cricket", "Swimming", "Athletics"],
  },
  {
    category: "Arts",
    emoji: "🎭",
    color: "var(--lavender)",
    bg: "#A78BFA10",
    border: "#A78BFA30",
    items: ["Painting", "Sculpture", "Drama", "Dance", "Photography"],
  },
  {
    category: "Clubs",
    emoji: "🧪",
    color: "var(--mint)",
    bg: "#4ECDC410",
    border: "#4ECDC430",
    items: ["Debate", "Science", "Literature", "Environment", "Robotics"],
  },
  {
    category: "Programs",
    emoji: "🌍",
    color: "var(--peach)",
    bg: "#FBBF7710",
    border: "#FBBF7730",
    items: [
      "Student Council",
      "Community Service",
      "Cultural Exchange",
      "Annual Day",
      "Field Trips",
    ],
  },
];

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-label text-[var(--gold)] block mb-3 tracking-[3px]">
      {children}
    </span>
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

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */

export default function ProgramsPage() {
  return (
    <>
      <HeroSection />
      <WaveDivider color="white" />
      <ProgramTabs />
      <WaveDivider color="var(--cream)" />
      <CurriculumSection />
      <WaveDivider color="white" />
      <ExtracurricularSection />
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
      <Image
        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80"
        alt="Students learning in a classroom"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.85)] via-[rgba(30,74,122,0.75)] to-[rgba(19,47,80,0.9)]" />

      {/* Floating decorative shapes */}
      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="18%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={45} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="60%" left="82%" shape="square" delay={0.5} />
      <FloatingShape color="#FBBF77" size={35} top="35%" left="93%" shape="circle" delay={1.5} />

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
          Academics
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <motion.h1
          className="text-hero font-display text-white mt-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Learning Journeys for{" "}
          <span className="text-[var(--gold)]">Every Stage</span>
        </motion.h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          From playful beginnings to ambitious futures, every program at
          Aarambha is designed to inspire, challenge, and nurture.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/admissions" className="btn-cta">
            Apply Now
          </Link>
          <Link href="/contact" className="btn-secondary">
            Schedule a Visit
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Program Tabs
   ────────────────────────────────────────────── */

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
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="3%" shape="circle" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel>Our Programs</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            A Place for Every Learner
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            From curious toddlers to aspiring graduates, every stage of learning
            is thoughtfully designed.
          </p>
        </div>

        {/* Tab buttons */}
        <div
          className="flex gap-3 flex-wrap justify-center mb-14"
          role="tablist"
          onKeyDown={handleKeyDown}
        >
          {programs.map((program, index) => (
            <motion.button
              key={program.id}
              id={program.id}
              role="tab"
              aria-selected={activeTab === index}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`relative px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === index
                  ? "text-white shadow-lg"
                  : "bg-white text-[var(--muted)] border-2 border-gray-200 hover:border-gray-300"
              }`}
              style={
                activeTab === index
                  ? { backgroundColor: program.color }
                  : undefined
              }
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {program.emoji} {program.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Active program detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            aria-labelledby={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 200, damping: 25 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            {/* Left: image card */}
            <div className="group relative h-[320px] lg:h-[440px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={current.image}
                alt={current.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div
                  className="inline-block px-4 py-1.5 rounded-full text-white text-tiny font-semibold mb-3"
                  style={{ backgroundColor: current.color }}
                >
                  {current.emoji} {current.name}
                </div>
              </div>
              {/* Decorative blob */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full animate-blob opacity-25"
                style={{ backgroundColor: current.color }}
              />
            </div>

            {/* Right: details */}
            <div>
              <h2 className="text-title font-display text-[var(--navy)] mb-1">
                {current.name}
              </h2>
              <div
                className="w-12 h-1 rounded-full mb-5"
                style={{ backgroundColor: current.color }}
              />
              <p className="text-body text-[var(--muted)] mb-8">
                {current.desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {current.highlights.map((highlight, i) => (
                  <motion.div
                    key={highlight}
                    className="flex items-center gap-3 bg-[var(--cream)] rounded-2xl px-4 py-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <CheckCircleIcon
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: current.color }}
                    />
                    <span className="text-small text-[var(--charcoal)] font-medium">
                      {highlight}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div className="mt-8">
                <Link
                  href="/admissions"
                  className="btn-cta inline-flex items-center gap-2"
                >
                  Apply for {current.name}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Curriculum
   ────────────────────────────────────────────── */

function CurriculumSection() {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={60} top="8%" left="88%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={40} top="75%" left="5%" shape="star" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Curriculum</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            What We Teach
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            A well-rounded curriculum designed to develop academic excellence
            alongside creative and physical abilities.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {subjects.map(({ name, Icon, color, bg }, index) => (
            <motion.div
              key={name}
              className="bg-white rounded-3xl p-7 text-center shadow-sm cursor-pointer"
              style={{ borderBottom: `3px solid ${color}` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6, scale: 1.03 }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: bg }}
              >
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <h3 className="font-display text-[var(--navy)] text-sm font-semibold">
                {name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Extracurriculars
   ────────────────────────────────────────────── */

function ExtracurricularSection() {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FBBF77" size={70} top="5%" left="3%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="92%" shape="square" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Beyond Academics</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Beyond the Classroom
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            We nurture talents, build character, and create lifelong memories
            through a vibrant extracurricular program.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {extracurriculars.map(({ category, emoji, color, bg, border, items }, index) => (
            <motion.div
              key={category}
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                backgroundColor: bg,
                border: `2px solid ${border}`,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 180 }}
              whileHover={{ y: -4 }}
            >
              {/* Decorative emoji background */}
              <span
                className="absolute top-4 right-4 text-6xl opacity-10 select-none"
                aria-hidden="true"
              >
                {emoji}
              </span>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{emoji}</span>
                  <h3 className="text-subtitle font-display text-[var(--navy)]">
                    {category}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-body text-[var(--charcoal)]">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — CTA
   ────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative bg-[var(--navy)] py-28 px-6 overflow-hidden">
      {/* Playful background shapes */}
      <FloatingShape color="#F5A623" size={120} top="10%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={80} top="60%" left="85%" shape="triangle" delay={0.5} />
      <FloatingShape color="#FF6B6B" size={50} top="20%" left="75%" shape="star" delay={1} />
      <FloatingShape color="#A78BFA" size={70} top="70%" left="15%" shape="square" delay={1.5} />
      <FloatingShape color="#FBBF77" size={40} top="15%" left="45%" shape="circle" delay={2} />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-5xl mb-4 block">🎓</span>
        <h2 className="text-title font-display text-white mb-4">
          Ready to Start Your Application?
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Join a community of learners where every child is encouraged to
          explore, grow, and achieve their fullest potential.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/admissions" className="btn-cta">
            Apply Now
          </Link>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
