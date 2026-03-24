"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  SparklesIcon,
  StarIcon,
  EyeIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { getIcon } from "@/lib/icons";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface CoreValueItem {
  id: number;
  title: string;
  icon: string;
  emoji: string;
  color: string;
}

interface PhilosophyItem {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

interface TeamMemberItem {
  id: number;
  name: string;
  role: string;
  image: string;
}

export interface AboutPageClientProps {
  coreValues: CoreValueItem[];
  philosophy: PhilosophyItem[];
  teamMembers: TeamMemberItem[];
  mission: string;
  vision: string;
  aboutText: string[];
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
    return <div className="animate-float-slow" style={{ ...shapeStyles, borderRadius: "50%", backgroundColor: color }} />;
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
      style={{ ...shapeStyles, borderRadius: "4px", backgroundColor: color, transform: "rotate(15deg)" }}
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
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill={color} />
      </svg>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */

export default function AboutPageClient({
  coreValues,
  philosophy,
  teamMembers,
  mission,
  vision,
  aboutText,
}: AboutPageClientProps) {
  return (
    <>
      <HeroSection />
      <AboutSection aboutText={aboutText} />
      <WaveDivider color="var(--white)" />
      <MissionVisionSection mission={mission} vision={vision} />
      <WaveDivider flip color="var(--white)" />
      <CoreValuesSection coreValues={coreValues} />
      <WaveDivider color="var(--white)" />
      <PhilosophySection philosophy={philosophy} />
      <WaveDivider flip color="var(--white)" />
      <TeamSection teamMembers={teamMembers} />
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
        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80"
        alt="School campus"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.9)] via-[rgba(30,74,122,0.8)] to-[rgba(19,47,80,0.92)]" />

      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="15%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="68%" left="82%" shape="square" delay={0.5} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.span
          className="text-label text-[var(--gold)] inline-flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SparklesIcon className="w-4 h-4" />
          About Us
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          Aarambha <span className="text-[var(--gold)]">School</span>
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          A progressive K-12 educational institution in the heart of Kathmandu
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — About Us (alternating layout)
   ────────────────────────────────────────────── */

function AboutSection({ aboutText }: { aboutText: string[] }) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={70} top="10%" left="85%" shape="star" delay={0} />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Aarambha School</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-6">
              About Us
            </h2>
            <div className="space-y-4 text-body text-[var(--muted)]">
              {aboutText.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-1.webp"
                alt="Aarambha School campus"
                width={600}
                height={500}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full animate-blob opacity-30"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Empowered by Innovation: Vision & Mission
   ────────────────────────────────────────────── */

function MissionVisionSection({ mission, vision }: { mission: string; vision: string }) {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <FloatingShape color="#FF6B6B" size={40} top="80%" left="5%" shape="triangle" delay={1} />
      <FloatingShape color="#4ECDC4" size={50} top="10%" left="90%" shape="circle" delay={0} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Empowered by Innovation</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Shaping the Future with Tradition and Innovation
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Merging Eastern Wisdom with Modern Education for Holistic Growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-[var(--cream)] rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--mint)] via-[var(--navy-light)] to-[var(--lavender)]" />
            <div className="w-14 h-14 rounded-2xl bg-[var(--mint)]/10 flex items-center justify-center mb-6">
              <EyeIcon className="w-7 h-7 text-[var(--mint)]" />
            </div>
            <h2 className="text-subtitle font-display text-[var(--navy)] mb-4">Our Vision</h2>
            <p className="text-body text-[var(--muted)]">
              {vision}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-[var(--cream)] rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--coral)] via-[var(--gold)] to-[var(--peach)]" />
            <div className="w-14 h-14 rounded-2xl bg-[var(--coral)]/10 flex items-center justify-center mb-6">
              <RocketLaunchIcon className="w-7 h-7 text-[var(--coral)]" />
            </div>
            <h2 className="text-subtitle font-display text-[var(--navy)] mb-4">Our Mission</h2>
            <p className="text-body text-[var(--muted)]">
              {mission}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Core Values
   ────────────────────────────────────────────── */

function CoreValuesSection({ coreValues }: { coreValues: CoreValueItem[] }) {
  return (
    <section className="py-24 px-6 bg-[var(--cream)] relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="92%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={45} top="85%" left="3%" shape="square" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>About Us</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-6">
              Core Values and Guiding Principles
            </h2>
            <p className="text-body text-[var(--muted)]">
              Based on our vision, mission, and values, the expectations from students
              align with the goal of developing well-rounded, future-ready individuals who
              can thrive in a fast-paced, globalized world while staying grounded in Eastern
              values. These expectations focus on critical skills, mindsets, and behaviors
              that reflect 21st-century competencies.
            </p>
          </motion.div>

          {/* Right: value cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((value, index) => {
              const IconComponent = getIcon(value.icon);
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: value.color }} />
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `color-mix(in srgb, ${value.color} 15%, transparent)` }}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5" style={{ color: value.color }} />}
                    </div>
                    <h3 className="font-display text-[var(--navy)] font-semibold text-sm flex items-center gap-1.5">
                      {value.title}
                      <span className="text-sm">{value.emoji}</span>
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Our Philosophy (alternating layout)
   ────────────────────────────────────────────── */

function PhilosophySection({ philosophy }: { philosophy: PhilosophyItem[] }) {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={50} top="8%" left="5%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={60} top="75%" left="90%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: philosophy items */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <SectionLabel>Our Philosophy</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-4">
              What We Believe
            </h2>
            <p className="text-body text-[var(--muted)] mb-8">
              At Aarambha Sanskar Vidyalaya, we believe:
            </p>

            <div className="space-y-5">
              {philosophy.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <h3 className="font-display text-[var(--navy)] font-semibold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-small text-[var(--muted)]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-2.webp"
                alt="Students at Aarambha School"
                width={600}
                height={625}
                className="w-full h-[450px] lg:h-[550px] object-cover"
              />
            </div>
            <div
              className="absolute -top-4 -left-4 w-24 h-24 rounded-full animate-blob opacity-25"
              style={{ backgroundColor: "var(--mint)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — Meet Our Team
   ────────────────────────────────────────────── */

function TeamSection({ teamMembers }: { teamMembers: TeamMemberItem[] }) {
  const ringColors = ["var(--coral)", "var(--mint)", "var(--lavender)", "var(--gold)", "var(--peach)", "var(--navy-light)"];

  return (
    <section className="py-24 px-6 bg-[var(--cream)] relative overflow-hidden" id="team">
      <FloatingShape color="#F5A623" size={55} top="10%" left="8%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={70} top="75%" left="88%" shape="circle" delay={1} />

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
              className="bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover object-top"
                  style={{
                    boxShadow: `0 0 0 4px white, 0 0 0 8px ${ringColors[index % ringColors.length]}`,
                  }}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: "var(--gold)" }}
                >
                  <StarIcon className="w-5 h-5 text-white" />
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
   Section 7 — CTA
   ────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="relative bg-[var(--navy)] py-28 px-6 overflow-hidden">
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
        <span className="text-5xl mb-4 block">🏫</span>
        <h2 className="text-title font-display text-white mb-4">
          Experience Our Campus
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          See firsthand what makes Aarambha special. Schedule a visit and
          discover the environment where your child will thrive.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-cta">
            Schedule a Visit
          </Link>
          <Link href="/admissions" className="btn-secondary">
            Apply Now
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
