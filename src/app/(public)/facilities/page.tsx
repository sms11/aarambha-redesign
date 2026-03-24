"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircleIcon,
  SparklesIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data — Real content from aarambha.school/facilities
   ────────────────────────────────────────────── */

const schoolLife = [
  {
    tag: "Join the Club",
    title: "Club Activities",
    desc: "Join student-run clubs like Science, IT, Sports, or Leo Club to explore your passions, develop new skills, and connect with classmates who share similar interests!",
    image: "/images/facilities/club-activities.webp",
    color: "var(--coral)",
  },
  {
    tag: "Find Your Voice",
    title: "Public Speaking",
    desc: "Find your voice! Develop your public speaking skills through debates and elocutions. Learn to confidently express your ideas and become a powerful communicator.",
    image: "/images/facilities/public-speaking.webp",
    color: "var(--mint)",
  },
  {
    tag: "Express Yourself",
    title: "Arts and Dramatics",
    desc: "Unleash your creativity! Explore your artistic talents and learn to express yourself through visual arts and drama. Showcase your skills on stage and develop your confidence.",
    image: "/images/facilities/arts-dramatics.webp",
    color: "var(--lavender)",
  },
  {
    tag: "Explore the World Around You",
    title: "Field Trips and Outings",
    desc: "Explore beyond the classroom with exciting field trips! Discover nature, visit new places, deepen your understanding, and create lasting memories with classmates!",
    image: "/images/facilities/field-trips.webp",
    color: "var(--peach)",
  },
  {
    tag: "Get Active and Healthy",
    title: "Physical Education",
    desc: "Join our fun and engaging PE classes to stay active and build a healthy lifestyle! Enjoy a variety of options like swimming, cricket, basketball, football, yoga, table tennis, karate, and more!",
    image: "/images/facilities/physical-education.webp",
    color: "var(--navy-light)",
  },
  {
    tag: "Explore Your Interest",
    title: "Extra-Curricular Activities (ECA)",
    desc: "Discover new passions and talents with activities like sports, music, clubs, and public speaking! Build teamwork, leadership, and communication skills while having fun and exploring what you love.",
    image: "/images/facilities/eca.webp",
    color: "var(--gold)",
  },
];

const resources = [
  {
    title: "Auditorium",
    desc: "This is an ultra-modern hall for a variety of purposes, such as cultural programs, major competitions, conferences and more.",
  },
  {
    title: "Library",
    desc: "Our spacious library is filled with books, magazines, and newspapers. It's a haven for bookworms and a great place to find resources for any project.",
  },
  {
    title: "Comfortable Classrooms",
    desc: "We understand the importance of a positive learning environment. Our classrooms are bright, well-equipped, and age-appropriate.",
  },
  {
    title: "Learning Made Fun!",
    desc: "Our classrooms use innovative technology to make learning interactive and engaging. Imagine lessons coming to life with visuals, animations, and activities.",
  },
];

const labs = [
  {
    title: "Science Lab",
    subtitle: "Discover the World Around You",
    desc: "In our Science Labs (Physics, Chemistry, and Biology), students get to conduct experiments, explore scientific concepts, and gain a deeper understanding of the world.",
    image: "/images/facilities/science-lab.webp",
    color: "var(--mint)",
  },
  {
    title: "Abacus",
    subtitle: "Mental Mathematics Program",
    desc: "The Abacus Mental Mathematics Program at Aarambha School enhances students' math skills, memory, focus, and problem-solving abilities through engaging and interactive methods.",
    image: "/images/facilities/abacus.webp",
    color: "var(--coral)",
  },
  {
    title: "Math Lab",
    subtitle: "Sharpen Your Skills",
    desc: "Our well-equipped Math Lab provides a space for hands-on activities and experimentation, helping students develop strong logical reasoning and problem-solving skills.",
    image: "/images/facilities/math-lab.webp",
    color: "var(--lavender)",
  },
];

const digitalItems = [
  {
    title: "NCC Education — DigiSchool",
    desc: "A UK-based computer curriculum that provides students with a structured and innovative approach to digital learning, equipping them with essential skills in technology to thrive in today's digital world.",
    image: "/images/facilities/ncc-digischool.webp",
  },
  {
    title: "ICT and E-learning",
    desc: "We integrate Information and Communication Technology (ICT) into our curriculum. Students learn valuable computer skills and gain access to online resources, preparing them for the digital world. MeroSchool provides digital content to classes 1 through 12, making learning easy.",
    image: "/images/facilities/ict-elearning.webp",
  },
];

const counselingPoints = [
  "Personal counseling services from qualified professionals.",
  "Helping students overcome challenges and emotional hurdles.",
  "Providing guidance to help students thrive academically and personally.",
  "Offering a secure space where students can openly discuss concerns.",
];

const conveniences = [
  {
    title: "Transportation Services: Safe and Secure Journeys",
    desc: "We offer safe and reliable transportation services for students on designated routes.",
  },
  {
    title: "Cafeteria: Healthy and Delicious Meals",
    desc: "Our modern cafeteria provides nutritious and delicious meals and snacks for students and teachers.",
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

export default function FacilitiesPage() {
  return (
    <>
      <HeroSection />
      <WaveDivider color="white" />
      <SchoolLifeSection />
      <WaveDivider color="var(--cream)" flip />
      <ResourcesSection />
      <WaveDivider color="var(--navy)" />
      <LabsSection />
      <WaveDivider color="white" />
      <DigitalSection />
      <WaveDivider color="var(--cream)" />
      <HealthSection />
      <WaveDivider color="white" />
      <ConvenienceSection />
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
        src="/images/facilities/beyond-classroom.webp"
        alt="Aarambha School facilities"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.88)] via-[rgba(30,74,122,0.75)] to-[rgba(19,47,80,0.92)]" />

      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="15%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="star" delay={2} />
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
          Facilities &amp; Environment
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <motion.h1
          className="text-hero font-display text-white mt-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Fun Beyond the{" "}
          <span className="text-[var(--gold)]">Classroom</span>
        </motion.h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          At Aarambha School, we believe learning shouldn&apos;t stop at textbooks.
          That&apos;s why we offer a variety of exciting activities to help your
          child grow and develop outside the classroom!
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/contact" className="btn-cta">
            Schedule a Tour
          </Link>
          <Link href="/admissions" className="btn-secondary">
            Learn More
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — School Life Activities
   ────────────────────────────────────────────── */

function SchoolLifeSection() {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="3%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="85%" left="4%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <SectionLabel>Explore Your Interest</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            School Life: Fun Beyond the Classroom
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-2xl">
            At Aarambha School, we believe learning shouldn&apos;t stop at
            textbooks. That&apos;s why we offer a variety of exciting activities
            to help your child grow and develop outside the classroom!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schoolLife.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="p-6">
                <span
                  className="text-tiny font-bold uppercase tracking-wider"
                  style={{ color: item.color }}
                >
                  {item.tag}
                </span>
                <h3 className="text-subtitle font-display text-[var(--navy)] mt-1 mb-3">
                  {item.title}
                </h3>
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  {item.desc}
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
   Section 3 — Resources & Facilities
   ────────────────────────────────────────────── */

function ResourcesSection() {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={60} top="8%" left="88%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={40} top="75%" left="5%" shape="star" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Resources and Facilities</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Learning Beyond the Classroom
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-2xl mx-auto">
            Aarambha School provides a variety of exciting resources and
            facilities to support our student&apos;s learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Left column */}
          <div className="space-y-8">
            {resources.slice(0, 2).map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-3xl p-7 shadow-sm text-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <h3 className="font-display text-[var(--navy)] text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Center image */}
          <motion.div
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/facilities/beyond-classroom.webp"
              alt="Learning beyond the classroom at Aarambha"
              fill
              className="object-cover"
            />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 rounded-full bg-[var(--gold)] opacity-20 animate-blob" />
          </motion.div>

          {/* Right column */}
          <div className="space-y-8">
            {resources.slice(2).map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white rounded-3xl p-7 shadow-sm text-center"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <h3 className="font-display text-[var(--navy)] text-lg font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Labs
   ────────────────────────────────────────────── */

function LabsSection() {
  return (
    <section className="bg-[var(--navy)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={80} top="5%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="70%" left="90%" shape="triangle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-14">
          <span className="text-label text-[var(--gold-light)] block mb-3 tracking-[3px]">
            Learning Hubs
          </span>
          <h2 className="text-title font-display text-white">
            Labs for Hands-on Learning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {labs.map((lab, index) => (
            <motion.div
              key={lab.title}
              className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative h-[220px] overflow-hidden">
                <Image
                  src={lab.image}
                  alt={lab.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-subtitle font-display text-white mb-1">
                  {lab.title}
                </h3>
                <span
                  className="text-tiny font-semibold block mb-3"
                  style={{ color: lab.color }}
                >
                  {lab.subtitle}
                </span>
                <p className="text-small text-white/70 leading-relaxed">
                  {lab.desc}
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
   Section 5 — Digital / Evolvement
   ────────────────────────────────────────────── */

function DigitalSection() {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FBBF77" size={60} top="8%" left="88%" shape="square" delay={0} />
      <FloatingShape color="#FF6B6B" size={40} top="80%" left="5%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-14">
          <SectionLabel>Evolvement</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Stay Connected in the Digital World
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: cards */}
          <div className="space-y-6">
            {digitalItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-[var(--cream)] rounded-3xl p-7 relative overflow-hidden"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-14 shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-[var(--navy)] font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-small text-[var(--muted)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right: image */}
          <motion.div
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/images/facilities/digital-education.webp"
              alt="Digital education at Aarambha"
              fill
              className="object-cover"
            />
            <div className="absolute -top-3 -left-3 w-20 h-20 rounded-full bg-[var(--mint)] opacity-20 animate-blob" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — Health & Wellness
   ────────────────────────────────────────────── */

function HealthSection() {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={55} top="10%" left="5%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={45} top="80%" left="90%" shape="triangle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Healthy Environment</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Keeping You and Your Child Healthy
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Medicare */}
          <motion.div
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, var(--coral), var(--peach))" }}
            />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                <Image
                  src="/images/facilities/medicare.webp"
                  alt="Medicare services"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-subtitle font-display text-[var(--navy)] mb-3">
                  Medicare — Your Child&apos;s Wellbeing Matters
                </h3>
                <p className="text-small text-[var(--muted)] leading-relaxed">
                  We have a fully-equipped health unit staffed with a qualified
                  nurse available on a full-time basis to ensure the well-being
                  and safety of all students. Our health unit is designed to
                  provide immediate care for minor injuries, illnesses, and
                  emergencies, offering a supportive and caring environment.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Personal Counseling */}
          <motion.div
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, var(--mint), var(--navy-light))" }}
            />
            <h3 className="text-subtitle font-display text-[var(--navy)] mb-5">
              Personal Counseling
            </h3>
            <ul className="space-y-4">
              {counselingPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-[var(--mint)] shrink-0 mt-0.5" />
                  <span className="text-small text-[var(--muted)] leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 7 — Convenience (Transport & Cafeteria)
   ────────────────────────────────────────────── */

function ConvenienceSection() {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FBBF77" size={60} top="8%" left="3%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={45} top="80%" left="92%" shape="square" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-[55%] h-[350px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/facilities/convenience-1.webp"
                alt="Aarambha School transportation and facilities"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[45%] h-[420px] rounded-3xl overflow-hidden shadow-lg -mt-8">
              <Image
                src="/images/facilities/convenience-2.webp"
                alt="Aarambha School cafeteria"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionLabel>About Us</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-4">
              Fueling Young Minds and Bodies
            </h2>
            <p className="text-body text-[var(--muted)] mb-8">
              Aarambha School goes beyond textbooks to provide a well-rounded and
              enriching learning experience for every child.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {conveniences.map((item, index) => (
                <motion.div
                  key={item.title}
                  className="bg-[var(--cream)] rounded-2xl p-5"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <h4 className="font-display text-[var(--navy)] font-semibold text-sm mb-2">
                    {item.title}
                  </h4>
                  <p className="text-small text-[var(--muted)] leading-relaxed">
                    {item.desc}
                  </p>
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
   Section 8 — CTA
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
        <span className="text-5xl mb-4 block">🏫</span>
        <h2 className="text-title font-display text-white mb-4">
          Come See Our Campus
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Experience our facilities firsthand. Schedule a tour and discover the
          inspiring environment where your child will learn, play, and grow.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-cta">
            Schedule a Tour
          </Link>
          <Link href="/admissions" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
