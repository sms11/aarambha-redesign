"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import {
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { getIcon } from "@/lib/icons";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface ProgramItem {
  id: number;
  name: string;
  ages: string;
  grades: string;
  description: string;
  highlights: string[];
  teaching: string;
  image: string;
  color: string;
  emoji: string;
}

interface SpecialFeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

interface KeyBenefitItem {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
}

export interface ProgramsPageClientProps {
  programs: ProgramItem[];
  specialFeatures: SpecialFeatureItem[];
  keyBenefits: KeyBenefitItem[];
}

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

export default function ProgramsPageClient({
  programs,
  specialFeatures,
  keyBenefits,
}: ProgramsPageClientProps) {
  return (
    <>
      <HeroSection />
      <WaveDivider color="white" />
      <ThematicApproach />
      <WaveDivider color="var(--cream)" flip />
      <ProgramTabs programs={programs} />
      <WaveDivider color="white" />
      <SpecialFeaturesSection specialFeatures={specialFeatures} />
      <WaveDivider color="var(--cream)" />
      <KeyBenefitsSection keyBenefits={keyBenefits} />
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
          Academic Excellence
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
          Our programs are tailored for each age group, utilizing a thematic
          approach in our academic teaching to shape well-rounded, future-ready
          learners.
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
   Section 2 — Thematic Approach
   ────────────────────────────────────────────── */

function ThematicApproach() {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={60} top="10%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={40} top="80%" left="5%" shape="circle" delay={1} />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {/* Image */}
          <motion.div
            className="relative h-[350px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
              alt="Children learning with thematic approach"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/30 to-transparent" />
            <div className="absolute -bottom-3 -right-3 w-28 h-28 rounded-full bg-[var(--gold)] opacity-20 animate-blob" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionLabel>Our Approach</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-5">
              Thematic Teaching for{" "}
              <span className="text-[var(--gold)]">Deeper Learning</span>
            </h2>
            <p className="text-body text-[var(--muted)] mb-5">
              Aarambha School selects a relevant theme for each term and
              integrates it into thoughtfully designed programs. This thematic
              approach helps students make meaningful connections across subjects,
              sparking curiosity and fostering deeper understanding.
            </p>
            <p className="text-body text-[var(--muted)] mb-8">
              From the earliest years to secondary school, every program is
              designed to match each developmental stage — ensuring students build
              skills progressively while staying engaged, motivated, and excited
              about learning.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Play-Based", "Experiential", "Project-Based", "STEAM-Focused"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-[var(--cream)] text-[var(--navy)] text-small font-semibold"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Program Tabs
   ────────────────────────────────────────────── */

function ProgramTabs({ programs }: { programs: ProgramItem[] }) {
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
    [programs.length]
  );

  const current = programs[activeTab];

  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="3%" shape="circle" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel>Our Programs</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            A Program for Every Stage
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            From curious toddlers to ambitious young adults, every stage of
            learning is thoughtfully designed to match their developmental needs.
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
              id={`program-${program.id}`}
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
            aria-labelledby={`program-${current.id}`}
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
                  className="inline-block px-4 py-1.5 rounded-full text-white text-tiny font-semibold mb-2"
                  style={{ backgroundColor: current.color }}
                >
                  {current.emoji} {current.name}
                </div>
                <div className="flex gap-3 mt-1">
                  <span className="text-white/80 text-sm bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
                    {current.grades}
                  </span>
                  <span className="text-white/80 text-sm bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full">
                    {current.ages}
                  </span>
                </div>
              </div>
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full animate-blob opacity-25"
                style={{ backgroundColor: current.color }}
              />
            </div>

            {/* Right: details */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-title font-display text-[var(--navy)]">
                  {current.name}
                </h2>
              </div>
              <div className="flex gap-3 mb-5">
                <span
                  className="text-tiny font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${current.color}20`, color: current.color }}
                >
                  {current.grades}
                </span>
                <span
                  className="text-tiny font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${current.color}20`, color: current.color }}
                >
                  {current.ages}
                </span>
              </div>
              <div
                className="w-12 h-1 rounded-full mb-5"
                style={{ backgroundColor: current.color }}
              />
              <p className="text-body text-[var(--muted)] mb-6">
                {current.description}
              </p>

              {/* Highlights */}
              <div className="space-y-4 mb-6">
                {current.highlights.map((highlight, i) => {
                  const [title, description] = highlight.split(" — ");
                  return (
                    <motion.div
                      key={title}
                      className="flex items-start gap-3 bg-white rounded-2xl px-5 py-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <CheckCircleIcon
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: current.color }}
                      />
                      <div>
                        <span className="text-small text-[var(--charcoal)] font-semibold block">
                          {title}
                        </span>
                        <span className="text-small text-[var(--muted)]">
                          {description}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Teaching approach badge */}
              <div
                className="rounded-2xl px-5 py-3 mb-6"
                style={{ backgroundColor: `${current.color}10`, borderLeft: `3px solid ${current.color}` }}
              >
                <span className="text-tiny font-semibold text-[var(--navy)] block mb-1">
                  Teaching Approach
                </span>
                <span className="text-small text-[var(--muted)]">
                  {current.teaching}
                </span>
              </div>

              <Link
                href="/admissions"
                className="btn-cta inline-flex items-center gap-2"
              >
                Apply for {current.name}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Special Features
   ────────────────────────────────────────────── */

function SpecialFeaturesSection({ specialFeatures }: { specialFeatures: SpecialFeatureItem[] }) {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={60} top="8%" left="88%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={40} top="75%" left="5%" shape="star" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>What Makes Us Special</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            The Aarambha Advantage
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            Every aspect of our school is designed with one goal — to provide
            the best possible environment for your child to learn and grow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {specialFeatures.map((feature, index) => {
            const IconComponent = getIcon(feature.icon);
            return (
              <motion.div
                key={feature.title}
                className="bg-[var(--cream)] rounded-3xl p-8 text-center relative overflow-hidden"
                style={{ borderBottom: `3px solid ${feature.color}` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: feature.bg }}
                >
                  {IconComponent && <IconComponent className="w-8 h-8" style={{ color: feature.color }} />}
                </div>
                <h3 className="font-display text-[var(--navy)] text-lg font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Key Benefits
   ────────────────────────────────────────────── */

function KeyBenefitsSection({ keyBenefits }: { keyBenefits: KeyBenefitItem[] }) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FBBF77" size={70} top="5%" left="3%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="92%" shape="square" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Why Aarambha</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Key Benefits for Your Child
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            We go beyond academics to ensure every child is equipped with the
            skills, confidence, and values they need to succeed in life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {keyBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="rounded-3xl p-8 relative overflow-hidden"
              style={{
                backgroundColor: benefit.bg,
                border: `2px solid ${benefit.border}`,
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 180 }}
              whileHover={{ y: -4 }}
            >
              <span
                className="absolute top-4 right-4 text-6xl opacity-10 select-none"
                aria-hidden="true"
              >
                {benefit.emoji}
              </span>

              <div className="relative z-10">
                <span className="text-3xl mb-4 block">{benefit.emoji}</span>
                <h3 className="text-subtitle font-display text-[var(--navy)] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — CTA
   ────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative bg-[var(--navy)] py-28 px-6 overflow-hidden">
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
          Ready to Start Your Child&apos;s Journey?
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Join a community of learners where every child is encouraged to
          explore, grow, and achieve their fullest potential through our
          thematic, student-centered approach.
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
