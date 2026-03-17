"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  LightBulbIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  EyeIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const milestones = [
  { year: "2008", title: "Founded", desc: "Aarambha Sanskar Vidyalaya established with a vision for holistic education.", color: "var(--coral)", emoji: "🌱" },
  { year: "2012", title: "Expanded to K-8", desc: "Added middle school grades with specialized subject teaching.", color: "var(--mint)", emoji: "📚" },
  { year: "2015", title: "STEAM Program", desc: "Introduced hands-on STEAM education across all grades.", color: "var(--lavender)", emoji: "🔬" },
  { year: "2018", title: "Full K-12", desc: "Launched high school program with comprehensive curriculum.", color: "var(--gold)", emoji: "🎓" },
  { year: "2021", title: "New Laboratories", desc: "State-of-the-art science and computer labs opened.", color: "var(--navy-light)", emoji: "💻" },
  { year: "2023", title: "Campus Expansion", desc: "New sports complex and auditorium completed.", color: "var(--peach)", emoji: "🏟️" },
];

const values = [
  { icon: LightBulbIcon, title: "Curiosity", description: "We celebrate questions and foster a lifelong love of learning.", color: "var(--gold)", emoji: "💡" },
  { icon: ShieldCheckIcon, title: "Integrity", description: "We uphold honesty and ethical behavior in all interactions.", color: "var(--navy-light)", emoji: "🛡️" },
  { icon: ArrowTrendingUpIcon, title: "Growth", description: "We believe every child can grow with effort and support.", color: "var(--mint)", emoji: "📈" },
  { icon: HeartIcon, title: "Respect", description: "We honor diverse perspectives and treat everyone with dignity.", color: "var(--coral)", emoji: "❤️" },
  { icon: SparklesIcon, title: "Creativity", description: "We encourage original thinking and innovative problem-solving.", color: "var(--lavender)", emoji: "✨" },
  { icon: FireIcon, title: "Resilience", description: "We teach students to embrace challenges and learn from setbacks.", color: "var(--peach)", emoji: "🔥" },
];

const leaders = [
  { name: "Dr. Suman Adhikari", role: "Principal", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Mrs. Anita Gurung", role: "Vice Principal", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Mr. Rajesh Shrestha", role: "Academic Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
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

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <MissionVisionSection />
      <WaveDivider color="var(--white)" />
      <ValuesSection />
      <WaveDivider flip color="var(--white)" />
      <HistorySection />
      <WaveDivider color="var(--white)" />
      <LeadershipSection />
      <WaveDivider flip color="var(--white)" />
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
        alt="University campus"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.9)] via-[rgba(30,74,122,0.8)] to-[rgba(19,47,80,0.92)]" />

      {/* Floating shapes */}
      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="15%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="68%" left="82%" shape="square" delay={0.5} />
      <FloatingShape color="#FBBF77" size={35} top="42%" left="93%" shape="circle" delay={1.5} />

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
          Our Story
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          Where Tradition Meets{" "}
          <span className="text-[var(--gold)]">Innovation</span>
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Since 2008, shaping curious minds and compassionate leaders through
          holistic, values-driven education.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Mission & Vision
   ────────────────────────────────────────────── */

function MissionVisionSection() {
  return (
    <section className="py-24 px-6 bg-[var(--cream)] relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={60} top="10%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#FF6B6B" size={40} top="80%" left="5%" shape="triangle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>What Drives Us</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Our Mission & Vision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            {/* Colored accent top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--coral)] via-[var(--gold)] to-[var(--peach)]" />
            <div className="w-14 h-14 rounded-2xl bg-[var(--coral)]/10 flex items-center justify-center mb-6">
              <RocketLaunchIcon className="w-7 h-7 text-[var(--coral)]" />
            </div>
            <h2 className="text-subtitle font-display text-[var(--navy)] mb-4">Our Mission</h2>
            <p className="text-body text-[var(--muted)]">
              To nurture holistic development through academic excellence, character building, and
              cultural values, empowering students to become responsible global citizens.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            {/* Colored accent top */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--mint)] via-[var(--navy-light)] to-[var(--lavender)]" />
            <div className="w-14 h-14 rounded-2xl bg-[var(--mint)]/10 flex items-center justify-center mb-6">
              <EyeIcon className="w-7 h-7 text-[var(--mint)]" />
            </div>
            <h2 className="text-subtitle font-display text-[var(--navy)] mb-4">Our Vision</h2>
            <p className="text-body text-[var(--muted)]">
              To be a leading institution that inspires lifelong learners, fosters innovation, and
              cultivates leaders who make a positive impact on society.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Core Values
   ────────────────────────────────────────────── */

function ValuesSection() {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="92%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={45} top="85%" left="3%" shape="square" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>What We Stand For</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Our Core Values
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            The principles that guide everything we do, from curriculum design
            to how we treat one another.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6 }}
              className="bg-[var(--cream)] rounded-3xl p-7 relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-default"
            >
              {/* Colored top border */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: value.color }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `color-mix(in srgb, ${value.color} 15%, transparent)` }}
                >
                  <value.icon className="w-6 h-6" style={{ color: value.color }} />
                </div>
                <div>
                  <h3 className="text-subtitle font-display text-[var(--navy)] mb-1 flex items-center gap-2">
                    {value.title}
                    <span className="text-base">{value.emoji}</span>
                  </h3>
                  <p className="text-small text-[var(--muted)]">{value.description}</p>
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
   Section 4 — History Timeline
   ────────────────────────────────────────────── */

function HistorySection() {
  return (
    <section className="py-24 px-6 bg-[var(--cream)] relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={50} top="8%" left="5%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={60} top="75%" left="90%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Our Journey</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Milestones Along the Way
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            From a small beginning to a thriving K-12 institution, every year
            has brought new growth and possibilities.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-[28px] left-[8%] right-[8%] h-[3px] bg-gradient-to-r from-[var(--coral)] via-[var(--mint)] to-[var(--lavender)] rounded-full" />

            <div className="flex justify-between">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, type: "spring", stiffness: 200 }}
                  className="relative flex-1 px-3 text-center"
                >
                  {/* Colored dot */}
                  <div className="relative mx-auto mb-5 w-14 h-14">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl relative z-10 shadow-md"
                      style={{ backgroundColor: milestone.color }}
                    >
                      {milestone.emoji}
                    </div>
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
                      style={{ backgroundColor: milestone.color }}
                    />
                  </div>

                  <p className="text-subtitle font-display" style={{ color: milestone.color }}>
                    {milestone.year}
                  </p>
                  <h3 className="text-small font-display text-[var(--navy)] font-semibold mt-1 mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-tiny text-[var(--muted)]">{milestone.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden max-w-md mx-auto">
          <div className="relative pl-12 space-y-10">
            {/* Gradient vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--coral)] via-[var(--mint)] to-[var(--lavender)] rounded-full" />

            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                className="relative"
              >
                {/* Colored dot on line */}
                <div
                  className="absolute -left-[26px] top-0 w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-md"
                  style={{ backgroundColor: milestone.color }}
                >
                  {milestone.emoji}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <p className="text-subtitle font-display" style={{ color: milestone.color }}>
                    {milestone.year}
                  </p>
                  <h3 className="text-small font-display text-[var(--navy)] font-semibold mt-1 mb-1">
                    {milestone.title}
                  </h3>
                  <p className="text-tiny text-[var(--muted)]">{milestone.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Leadership
   ────────────────────────────────────────────── */

function LeadershipSection() {
  const ringColors = ["var(--coral)", "var(--mint)", "var(--lavender)"];

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <FloatingShape color="#F5A623" size={55} top="10%" left="8%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={70} top="75%" left="88%" shape="circle" delay={1} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Our Team</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Meet Our Leadership
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Dedicated professionals committed to inspiring, guiding, and
            empowering every learner.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader, index) => (
            <motion.div
              key={leader.name}
              className="bg-[var(--cream)] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4 }}
            >
              <div className="relative w-32 h-32 mx-auto mb-6">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover"
                  style={{
                    boxShadow: `0 0 0 4px var(--cream), 0 0 0 8px ${ringColors[index % ringColors.length]}`,
                  }}
                />
                {/* Star badge */}
                <div
                  className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: "var(--gold)" }}
                >
                  <StarIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-display text-[var(--navy)] font-semibold text-lg">
                {leader.name}
              </h3>
              <p className="text-small text-[var(--muted)] mt-1">
                {leader.role}
              </p>
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
      {/* Floating shapes */}
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
