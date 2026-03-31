"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { getIcon } from "@/lib/icons";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface StatItem {
  id: number;
  value: string;
  label: string;
  emoji: string;
  suffix: string | null;
}

interface ProgramItem {
  id: number;
  name: string;
  grades: string;
  description: string;
  image: string;
  color: string;
}

interface SchoolLifeItemData {
  id: number;
  title: string;
  icon: string;
  image: string;
}

interface TeamMemberItem {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
}

interface PartnerItem {
  id: number;
  name: string;
  logo: string;
}

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string;
}

interface PrincipalData {
  message: string;
  name: string;
  title: string;
  image: string;
}

interface NewsEventItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
}

interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string | null;
  publishedAt: string;
}

export interface HomePageClientProps {
  stats: StatItem[];
  programs: ProgramItem[];
  schoolLifeItems: SchoolLifeItemData[];
  teamMembers: TeamMemberItem[];
  testimonials: TestimonialItem[];
  partners: PartnerItem[];
  features: FeatureItem[];
  principalData: PrincipalData;
  aboutText: string[];
  newsEvents: NewsEventItem[];
  blogPosts: BlogPostItem[];
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

export default function HomePageClient({
  stats,
  programs,
  schoolLifeItems,
  teamMembers,
  testimonials,
  partners,
  features,
  principalData,
  aboutText,
  newsEvents,
  blogPosts,
}: HomePageClientProps) {
  return (
    <>
      <HeroSection />
      <ProgramsSection programs={programs} />
      <PrincipalMessage principalData={principalData} />
      <AboutSection aboutText={aboutText} />
      <StatsBar stats={stats} />
      <WhyDifferentSection features={features} />
      {newsEvents.length > 0 && <NewsEventsSection items={newsEvents} />}
      {blogPosts.length > 0 && <BlogSection posts={blogPosts} />}
      <SchoolLifeSection schoolLifeItems={schoolLifeItems} />
      <TeamSection teamMembers={teamMembers} />
      <TestimonialSection testimonials={testimonials} />
      <PartnersSection partners={partners} />
      <CTASection />
    </>
  );
}

/* ──────────────────────────────────────────────
   Section 1 — Hero with rotating taglines
   ────────────────────────────────────────────── */

const taglines = [
  "Learning",
  "Growth",
  "Leadership",
  "Creativity",
  "Discovery",
];

function HeroSection() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[70vh] md:min-h-[80vh] lg:min-h-screen flex items-center justify-center">
      <SmartImage
        src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80"
        alt="Students learning together"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.85)] via-[rgba(30,74,122,0.75)] to-[rgba(19,47,80,0.9)]" />

      {/* Floating decorative shapes */}
      <FloatingShape color="#F5A623" size={80} top="10%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="20%" left="85%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="70%" left="10%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={60} top="65%" left="80%" shape="square" delay={0.5} />
      <FloatingShape color="#4EAED8" size={35} top="40%" left="92%" shape="circle" delay={1.5} />

      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="text-label text-[var(--gold)] inline-flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SparklesIcon className="w-4 h-4" />
          Aarambha Sanskar Vidyalaya
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          Empowering a Journey of{" "}
          <span className="relative inline-block min-w-[200px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={taglineIndex}
                className="text-[var(--gold)] inline-block"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {taglines[taglineIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Where Eastern Values Meet 21st-Century Innovation to Shape
          Future-Ready Leaders
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/community/form" className="btn-cta">
            Enroll Now
          </Link>
          <Link href="/about" className="btn-secondary">
            Learn More
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDownIcon className="w-8 h-8 text-white/70" />
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Programs Carousel
   ────────────────────────────────────────────── */

function ProgramsSection({ programs }: { programs: ProgramItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-white py-24 px-6 overflow-hidden">
      <FloatingShape color="#F5A623" size={100} top="5%" left="90%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={60} top="80%" left="3%" shape="triangle" delay={1} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <SectionLabel>Our Programs</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)]">
              A Place for Every Learner
            </h2>
            <p className="text-body text-[var(--muted)] mt-3 max-w-lg">
              From curious toddlers to aspiring graduates, every stage of learning
              is thoughtfully designed.
            </p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border-2 border-[var(--navy)] flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll programs left"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border-2 border-[var(--navy)] flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors cursor-pointer"
              aria-label="Scroll programs right"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.name}
              className="min-w-[300px] md:min-w-[320px] snap-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card group cursor-pointer h-full">
                <div className="relative h-52 overflow-hidden">
                  <SmartImage
                    src={program.image}
                    alt={program.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-tiny font-semibold"
                    style={{ backgroundColor: program.color }}
                  >
                    {program.grades}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-subtitle font-display text-[var(--navy)] mb-2">
                    {program.name}
                  </h3>
                  <p className="text-small text-[var(--muted)]">{program.description}</p>
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-1 text-[var(--navy)] font-semibold text-small mt-4 hover:gap-2 transition-all"
                  >
                    Learn More
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Principal Message
   ────────────────────────────────────────────── */

function PrincipalMessage({ principalData }: { principalData: PrincipalData }) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={70} top="10%" left="85%" shape="star" delay={0} />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <SmartImage
                src={principalData.image}
                alt={principalData.name}
                width={600}
                height={500}
                className="w-full h-[400px] lg:h-[480px] object-cover object-top"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full animate-blob opacity-30"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Welcome</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-6">
              Message from the Principal
            </h2>
            <div className="relative">
              <span className="text-[72px] leading-none font-display text-[var(--gold)] opacity-40 absolute -top-6 -left-2">
                &ldquo;
              </span>
              <p className="text-body text-[var(--muted)] italic pl-6">
                {principalData.message}
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-[2px] bg-[var(--gold)]" />
              <div>
                <p className="font-display text-[var(--navy)] font-semibold">
                  {principalData.name}
                </p>
                <p className="text-small text-[var(--muted)]">
                  {principalData.title}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — About (reverse alternating)
   ────────────────────────────────────────────── */

function AboutSection({ aboutText }: { aboutText: string[] }) {
  return (
    <section className="bg-[#f9f8f6] py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            {/* Green bar + label */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full" />
              <span className="text-[#2e7d32] font-semibold text-sm uppercase tracking-wider">
                Our Life
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display text-[var(--navy)] mb-6 leading-tight">
              About Us
            </h2>

            {aboutText.map((paragraph, i) => (
              <p key={i} className="text-base text-[#5a5a5a] leading-relaxed mb-5">
                {paragraph}
              </p>
            ))}

            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[var(--navy)] text-white font-semibold px-7 py-3.5 rounded-full hover:bg-[#1a2744] transition-colors mt-2 group"
            >
              Learn more
              <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Image side */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <SmartImage
                src="/images/about-1.webp"
                alt="Aarambha School campus life"
                width={600}
                height={500}
                className="w-full h-[400px] lg:h-[480px] object-cover"
              />
            </div>

            {/* Trusted by badge — top right */}
            <motion.div
              className="absolute -top-3 -right-3 lg:top-2 lg:-right-5 z-10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <div className="w-24 h-24 rounded-full bg-[var(--navy)] text-white flex flex-col items-center justify-center shadow-lg border-4 border-white">
                <span className="text-[10px] uppercase tracking-wide font-medium opacity-80">
                  Trusted by
                </span>
                <span className="text-xl font-display font-bold leading-none">
                  30K +
                </span>
              </div>
            </motion.div>

            {/* 10+ Years badge — bottom center */}
            <motion.div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="bg-white rounded-xl px-5 py-3 shadow-md border border-dashed border-[#c5cae9] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8eaf6] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[var(--navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[var(--navy)] whitespace-nowrap">
                  10+ Years of Excellence
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative wave elements at bottom */}
      <div className="flex justify-center mt-16">
        <svg width="80" height="40" viewBox="0 0 80 40" fill="none" className="text-[#f5a623]">
          <path d="M5 30 Q20 5 40 20 Q55 32 70 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M65 12 L72 8 L68 16" fill="currentColor" />
        </svg>
      </div>
      {/* Decorative teal waves — bottom right */}
      <div className="absolute bottom-8 right-8 opacity-40">
        <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
          <path d="M0 8 Q10 0 20 8 Q30 16 40 8 Q50 0 60 8" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M0 18 Q10 10 20 18 Q30 26 40 18 Q50 10 60 18" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Stats Bar (playful)
   ────────────────────────────────────────────── */

function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <>
      <WaveDivider color="var(--navy)" />
      <section className="bg-[var(--navy)] py-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
            >
              <span className="text-3xl mb-2 block">{stat.emoji}</span>
              <div className="text-title font-display text-[var(--gold)]">
                {stat.value}{stat.suffix && stat.suffix}
              </div>
              <div className="text-label text-white/70 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
      <WaveDivider flip color="var(--navy)" />
    </>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — Why Different (image cards)
   ────────────────────────────────────────────── */

function WhyDifferentSection({ features }: { features: FeatureItem[] }) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={60} top="5%" left="50%" shape="star" delay={0} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>What Makes Us Special</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Why Are We Different
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Following features make Aarambha School a standout choice for parents
            seeking a transformative and future-focused education for their
            children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon);
            return (
              <motion.div
                key={feature.title}
                className="card group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="relative h-52 overflow-hidden">
                  <SmartImage
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center">
                    {IconComponent && <IconComponent className="w-6 h-6 text-[var(--navy)]" />}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-subtitle font-display text-[var(--navy)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-small text-[var(--muted)]">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section — News & Events Carousel
   ────────────────────────────────────────────── */

function NewsEventsSection({ items }: { items: NewsEventItem[] }) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const visibleItems = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <section className="bg-[#f9f8f6] py-24 px-6 relative overflow-hidden">
      {/* Decorative element top-right */}
      <div className="absolute top-8 right-8 opacity-20">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M40 10 L50 30 L70 30 L55 45 L60 65 L40 55 L20 65 L25 45 L10 30 L30 30 Z" stroke="var(--teal)" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#2e7d32] rounded-full" />
              <span className="text-[#2e7d32] font-semibold text-sm uppercase tracking-wider">
                Involvement
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-[var(--navy)] leading-tight">
              News and Events
            </h2>
          </motion.div>

          <motion.p
            className="lg:max-w-md text-base text-[#5a5a5a] leading-relaxed lg:pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            We promote active collaboration between parents, teachers, and the community through regular meetings, events, and initiatives, fostering a supportive environment for student success.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence mode="wait">
            {visibleItems.map((item, i) => (
              <motion.div
                key={`${page}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {item.image && (
                  <div className="p-3 pb-0">
                    <div className="rounded-xl overflow-hidden">
                      <SmartImage
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={280}
                        className="w-full h-[150px] md:h-[180px] object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="p-4 pt-3">
                  <h3 className="font-display font-bold text-[var(--navy)] text-base mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5a5a5a] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination + Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === page
                      ? "bg-[var(--navy)] ring-2 ring-[var(--navy)]/30"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-10 h-10 rounded-full border-2 border-[var(--navy)] flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section — Blog / Latest Insights
   ────────────────────────────────────────────── */

function BlogSection({ posts }: { posts: BlogPostItem[] }) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(posts.length / perPage);
  const visible = posts.slice(page * perPage, (page + 1) * perPage);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-[#FF6B35] rounded-full" />
              <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
                Blogs
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-[var(--navy)] leading-tight">
              Latest Insights of Aarambha
            </h2>
          </motion.div>

          <motion.p
            className="lg:max-w-md text-base text-[#5a5a5a] leading-relaxed lg:pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Stay updated with the latest developments, innovative teaching methods, and inspiring stories from Aarambha.
          </motion.p>
        </div>

        {/* Cards — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <AnimatePresence mode="wait">
            {visible.map((post, i) => (
              <motion.article
                key={`${page}-${post.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group"
              >
                {post.image && (
                  <div className="overflow-hidden">
                    <SmartImage
                      src={post.image}
                      alt={post.title}
                      width={500}
                      height={300}
                      className="w-full h-[180px] md:h-[220px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4 md:p-5">
                  <span className="text-xs text-[#FF6B35] font-medium flex items-center gap-1 mb-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                    {formatDate(post.publishedAt)}
                  </span>
                  <h3 className="font-display font-bold text-[var(--navy)] text-base leading-snug mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#5a5a5a] leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-[var(--navy)] font-semibold text-sm hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i === page
                      ? "bg-[var(--navy)] ring-2 ring-[var(--navy)]/30"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--navy)] hover:text-[var(--navy)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="w-10 h-10 rounded-full border-2 border-[var(--navy)] flex items-center justify-center text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 7 — School Life (image-heavy grid)
   ────────────────────────────────────────────── */

function SchoolLifeSection({ schoolLifeItems }: { schoolLifeItems: SchoolLifeItemData[] }) {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#4ECDC4" size={80} top="5%" left="92%" shape="circle" delay={0} />
      <FloatingShape color="#FF6B6B" size={45} top="85%" left="5%" shape="square" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>School Life</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Fun Beyond The Classroom
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            At Aarambha School, we believe learning shouldn&apos;t stop at textbooks.
            That&apos;s why we offer a variety of exciting activities to help your
            child grow and develop outside the classroom!
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {schoolLifeItems.map((item, index) => {
            const IconComponent = getIcon(item.icon);
            return (
              <motion.div
                key={item.title}
                className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/80 via-[var(--navy)]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                    {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                  </div>
                  <h3 className="font-display text-white text-sm font-semibold leading-tight">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/programs" className="btn-cta">
            View All Activities
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 8 — Meet Our Team
   ────────────────────────────────────────────── */

function TeamSection({ teamMembers }: { teamMembers: TeamMemberItem[] }) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={55} top="10%" left="8%" shape="triangle" delay={0} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Our Team</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Meet Our Team
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Dedicated professionals committed to inspiring, guiding, and
            empowering every learner.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative w-28 h-28 mx-auto mb-5">
                <SmartImage
                  src={member.image}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full object-cover object-top ring-4 ring-[var(--cream)]"
                />
                <div
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--gold)" }}
                >
                  <StarIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="font-display text-[var(--navy)] font-semibold text-lg">
                {member.name}
              </h3>
              <p className="text-small text-[var(--muted)] mt-1">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 9 — Testimonials (carousel)
   ────────────────────────────────────────────── */

function TestimonialSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <>
      <WaveDivider color="var(--navy-deep)" />
      <section className="bg-[var(--navy-deep)] py-24 px-6 relative overflow-hidden">
        <FloatingShape color="#F5A623" size={60} top="15%" left="5%" shape="circle" delay={0} />
        <FloatingShape color="#4ECDC4" size={40} top="70%" left="90%" shape="star" delay={1} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-title font-display text-white mb-4">
            Hear From Our Community
          </h2>
          <p className="text-small text-white/50 mb-14">
            Stories of Growth, Impact, and Connection
          </p>

          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10">
                  <p className="text-subtitle font-display italic text-white leading-relaxed">
                    &ldquo;{testimonials[active].quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <SmartImage
                      src={testimonials[active].image}
                      alt={testimonials[active].name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[var(--gold)]"
                    />
                    <div className="text-left">
                      <p className="text-[var(--gold)] font-semibold">
                        {testimonials[active].name}
                      </p>
                      <p className="text-tiny text-white/60">
                        {testimonials[active].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                aria-label={`View testimonial ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  index === active
                    ? "w-8 bg-[var(--gold)]"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
      <WaveDivider flip color="var(--navy-deep)" />
    </>
  );
}

/* ──────────────────────────────────────────────
   Section 10 — Partners (infinite marquee)
   ────────────────────────────────────────────── */

function PartnersSection({ partners }: { partners: PartnerItem[] }) {
  return (
    <section className="bg-white py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Our Partners</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Trusted Collaborations
          </h2>
        </div>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="overflow-hidden">
          <div className="marquee-track flex items-center gap-12 w-max">
            {/* Double the logos for seamless loop */}
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="bg-[var(--cream)] rounded-xl px-8 py-5 flex items-center justify-center shrink-0 hover:shadow-md transition-shadow"
              >
                <SmartImage
                  src={partner.logo}
                  alt={partner.name}
                  width={120}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 11 — CTA
   ────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative bg-[var(--navy)] py-28 px-6 overflow-hidden">
      {/* Playful background shapes */}
      <FloatingShape color="#F5A623" size={120} top="10%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={80} top="60%" left="85%" shape="triangle" delay={0.5} />
      <FloatingShape color="#FF6B6B" size={50} top="20%" left="75%" shape="star" delay={1} />
      <FloatingShape color="#A78BFA" size={70} top="70%" left="15%" shape="square" delay={1.5} />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-5xl mb-4 block">🎓</span>
        <h2 className="text-title font-display text-white mb-4">
          Ready to Begin Your Child&apos;s Journey?
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Admissions for the upcoming academic year are now open. Take the first
          step toward a transformative education for your child.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/community/form" className="btn-cta">
            Admission Form
          </Link>
          <Link href="/contact" className="btn-secondary">
            Schedule a Visit
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
