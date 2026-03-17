"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  BeakerIcon,
  BookOpenIcon,
  MusicalNoteIcon,
  TrophyIcon,
  CakeIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const facilities = [
  {
    name: "Smart Classrooms",
    desc: "Interactive whiteboards and digital learning tools in every classroom.",
    icon: ComputerDesktopIcon,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
    color: "var(--coral)",
  },
  {
    name: "Innovation Lab",
    desc: "Dedicated STEAM space for robotics, coding, and hands-on projects.",
    icon: CpuChipIcon,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
    color: "var(--mint)",
  },
  {
    name: "Science Labs",
    desc: "Fully equipped physics, chemistry, and biology laboratories.",
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
    color: "var(--lavender)",
  },
  {
    name: "Library",
    desc: "Over 10,000 books with a dedicated digital resource center.",
    icon: BookOpenIcon,
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
    color: "var(--peach)",
  },
  {
    name: "Computer Lab",
    desc: "Modern workstations with high-speed internet and latest software.",
    icon: ComputerDesktopIcon,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
    color: "var(--coral)",
  },
  {
    name: "Art & Music Studio",
    desc: "Creative spaces for visual arts, music practice, and performances.",
    icon: MusicalNoteIcon,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    color: "var(--mint)",
  },
  {
    name: "Sports Complex",
    desc: "Multi-sport facilities including basketball, football, and athletics.",
    icon: TrophyIcon,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
    color: "var(--lavender)",
  },
  {
    name: "Cafeteria",
    desc: "Nutritious meals prepared in a hygienic, spacious dining area.",
    icon: CakeIcon,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80",
    color: "var(--peach)",
  },
  {
    name: "Auditorium",
    desc: "300-seat hall for assemblies, performances, and special events.",
    icon: BuildingLibraryIcon,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    color: "var(--coral)",
  },
];

const campusStats = [
  { value: "2", label: "Acres", emoji: "🏞️", color: "var(--coral)" },
  { value: "50+", label: "Classrooms", emoji: "🏫", color: "var(--mint)" },
  { value: "5", label: "Laboratories", emoji: "🔬", color: "var(--lavender)" },
  { value: "1000+", label: "Capacity", emoji: "👨‍🎓", color: "var(--peach)" },
];

const safetyItems = [
  { label: "CCTV Surveillance", emoji: "📹", color: "var(--coral)" },
  { label: "Trained Security Personnel", emoji: "👮", color: "var(--mint)" },
  { label: "Fire Safety Systems", emoji: "🧯", color: "var(--lavender)" },
  { label: "First Aid Stations", emoji: "🩺", color: "var(--peach)" },
  { label: "Child-Safe Infrastructure", emoji: "🛡️", color: "var(--navy-light)" },
  { label: "Evacuation Plans", emoji: "🗺️", color: "var(--coral)" },
  { label: "Secure Entry Points", emoji: "🔐", color: "var(--mint)" },
  { label: "Regular Safety Drills", emoji: "🔔", color: "var(--lavender)" },
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

export default function FacilitiesPage() {
  return (
    <>
      <HeroSection />
      <WaveDivider color="var(--cream)" />
      <FacilitiesGrid />
      <WaveDivider color="var(--navy)" />
      <CampusOverview />
      <WaveDivider flip color="var(--navy)" />
      <SafetySection />
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
        src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
        alt="School campus facilities"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.85)] via-[rgba(30,74,122,0.75)] to-[rgba(19,47,80,0.9)]" />

      <FloatingShape color="#F5A623" size={90} top="8%" left="6%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="18%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={45} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="62%" left="82%" shape="square" delay={0.5} />
      <FloatingShape color="#FBBF77" size={35} top="42%" left="92%" shape="circle" delay={1.5} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
      >
        <motion.span
          className="text-label text-[var(--gold)] inline-flex items-center gap-2 tracking-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SparklesIcon className="w-4 h-4" />
          Campus
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          A Space Designed for{" "}
          <span className="text-[var(--gold)]">Discovery</span>
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Explore world-class facilities built to inspire curiosity, creativity,
          and a lifelong love of learning.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/contact" className="btn-cta">
            Schedule a Tour
          </Link>
          <Link href="/admissions" className="btn-secondary">
            Apply Now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Facilities Grid
   ────────────────────────────────────────────── */

function FacilitiesGrid() {
  return (
    <section className="py-24 px-6 bg-[var(--cream)] relative overflow-hidden">
      <FloatingShape color="#F5A623" size={100} top="3%" left="90%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={60} top="85%" left="4%" shape="triangle" delay={1} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Our Facilities</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Everything Your Child Needs
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            From cutting-edge technology labs to inspiring creative spaces, our
            campus is equipped to nurture every dimension of your child&apos;s growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={facility.image}
                  alt={facility.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 to-transparent" />

                {/* Icon badge */}
                <div
                  className="absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                  style={{ backgroundColor: `color-mix(in srgb, ${facility.color} 80%, transparent)` }}
                >
                  <facility.icon className="w-6 h-6 text-white" />
                </div>

                {/* Name overlay on image */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="font-display text-white text-lg font-semibold drop-shadow-lg">
                    {facility.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  {facility.desc}
                </p>
                <div
                  className="mt-4 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-20"
                  style={{ backgroundColor: facility.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Campus Overview (alternating)
   ────────────────────────────────────────────── */

function CampusOverview() {
  return (
    <section className="bg-[var(--navy)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={80} top="5%" left="85%" shape="star" delay={0} />
      <FloatingShape color="#FF6B6B" size={50} top="75%" left="5%" shape="circle" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
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
              <Image
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"
                alt="Aarambha School campus aerial view"
                width={600}
                height={500}
                className="w-full h-[380px] lg:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/40 to-transparent" />
            </div>
            <div
              className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full animate-blob opacity-25"
              style={{ backgroundColor: "var(--gold)" }}
            />
          </motion.div>

          {/* Text + stats side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Our Campus</SectionLabel>
            <h2 className="text-title font-display text-white mb-6">
              Where Learning Comes Alive
            </h2>
            <p className="text-body text-white/80 leading-relaxed mb-10">
              Our sprawling 2-acre campus in Kathmandu provides a safe, green, and
              stimulating environment for learning. From modern classrooms to expansive
              sports grounds, every space is designed to inspire curiosity and foster
              growth.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {campusStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -4 }}
                >
                  <span className="text-2xl block mb-2">{stat.emoji}</span>
                  <div
                    className="text-title font-display"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-label text-white/70 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Safety & Security
   ────────────────────────────────────────────── */

function SafetySection() {
  return (
    <section className="py-24 px-6 bg-[var(--cream)] relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={70} top="8%" left="88%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="6%" shape="triangle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Safety &amp; Security</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Your Child&apos;s Safety is Our Priority
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            We maintain the highest standards of safety and security across our
            entire campus, ensuring peace of mind for every family.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {safetyItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -4 }}
            >
              {/* Colored top border */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: item.color }}
              />

              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
              >
                <span className="text-2xl">{item.emoji}</span>
              </div>

              <CheckBadgeIcon
                className="w-5 h-5 mx-auto mb-2"
                style={{ color: item.color }}
              />
              <p className="text-small font-display text-[var(--navy)] font-semibold">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Extra trust badge */}
        <motion.div
          className="mt-14 bg-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--mint)]/15 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-8 h-8 text-[var(--mint)]" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-display text-[var(--navy)] font-semibold text-lg mb-1">
              Fully Compliant Campus
            </h3>
            <p className="text-small text-[var(--muted)]">
              Our campus meets all government safety regulations and is regularly
              audited to ensure the highest standards of child protection and
              infrastructure safety.
            </p>
          </div>
        </motion.div>
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
          See It for Yourself
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Photos can only show so much. Schedule a campus tour and experience our
          world-class facilities firsthand. Your child&apos;s future starts here.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-cta">
            Schedule a Campus Tour
          </Link>
          <Link href="/admissions" className="btn-secondary">
            Start Application
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
