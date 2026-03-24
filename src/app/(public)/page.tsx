"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BeakerIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  LightBulbIcon,
  HeartIcon,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PaintBrushIcon,
  StarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const stats = [
  { value: "K-12", label: "Grade Levels", emoji: "🎓" },
  { value: "15+", label: "Years", emoji: "🏫" },
  { value: "500+", label: "Alumni", emoji: "🌟" },
  { value: "50+", label: "Faculty", emoji: "👨‍🏫" },
];

const programs = [
  {
    name: "Early Years",
    grades: "Nursery – KG",
    desc: "A nurturing play-based environment where little learners explore, create, and discover the joy of learning.",
    image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80",
    color: "var(--coral)",
  },
  {
    name: "Primary School",
    grades: "Grade 1 – 5",
    desc: "Building strong foundations in literacy, numeracy, and character through hands-on experiential learning.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
    color: "var(--mint)",
  },
  {
    name: "Middle School",
    grades: "Grade 6 – 8",
    desc: "Developing critical thinking, leadership skills, and a passion for STEAM through project-based learning.",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    color: "var(--navy-light)",
  },
  {
    name: "High School",
    grades: "Grade 9 – 12",
    desc: "Preparing students for higher education and global citizenship with rigorous academics and real-world exposure.",
    image: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80",
    color: "var(--lavender)",
  },
];

const schoolLifeItems = [
  { title: "Explore Your Interests", icon: LightBulbIcon, image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
  { title: "Get Active and Healthy", icon: HeartIcon, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80" },
  { title: "Explore the World", icon: GlobeAltIcon, image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
  { title: "Express Yourself", icon: PaintBrushIcon, image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
  { title: "Find Your Voice", icon: ChatBubbleLeftRightIcon, image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80" },
  { title: "Join the Club", icon: UserGroupIcon, image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80" },
  { title: "Make Beautiful Music", icon: MusicalNoteIcon, image: "https://images.unsplash.com/photo-1514119412350-e174d90d585e?w=600&q=80" },
  { title: "Move and Groove", icon: BeakerIcon, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
];

const teamMembers = [
  { name: "Naresh Prasad Shrestha", role: "Chairman and Principal", image: "/images/team/naresh.webp" },
  { name: "Rossete Dela Rosa Tamang", role: "Vice Principal (Pre-school to Grade 5)", image: "/images/team/rossete.webp" },
  { name: "Dinesh Shrestha", role: "Vice Principal (Grade 6-12)", image: "/images/team/dinesh.webp" },
  { name: "Sunita Maharjan", role: "Coordinator (Pre-school to Grade 5)", image: "/images/team/sunita.webp" },
  { name: "Deepika Shrestha", role: "Coordinator (Grade 6-10)", image: "/images/team/deepika.webp" },
  { name: "Kripa Bajracharya", role: "ECA Coordinator", image: "/images/team/kripa.webp" },
];

const testimonials = [
  {
    quote:
      "Aarambha School has truly transformed my daughter\u2019s learning experience. The teachers are not only highly qualified but also genuinely care about each child\u2019s growth. The school\u2019s focus on values and creativity is unmatched!",
    name: "Sita Sharma",
    role: "Parent of Grade 4 Student",
    image: "/images/testimonials/sita.webp",
  },
  {
    quote:
      "I love going to Aarambha School because learning here is fun! My teachers make every subject interesting, and I\u2019ve made lots of new friends. The playground and art classes are my favorite!",
    name: "Ramesh Karki",
    role: "Grade 3 Student",
    image: "/images/testimonials/ramesh.webp",
  },
  {
    quote:
      "Aarambha School laid a strong foundation for my academic journey. The skills and discipline I learned there helped me succeed in higher studies and beyond. I\u2019m proud to be an Aarambha alumnus!",
    name: "Priyanka Adhikari",
    role: "Batch of 2018",
    image: "/images/testimonials/priyanka.webp",
  },
  {
    quote:
      "As a teacher at Aarambha School, I\u2019ve seen how a nurturing and inclusive environment can inspire students to reach their full potential. The support from the administration and the passion from our students make teaching here incredibly rewarding.",
    name: "Mr. Rajan Shrestha",
    role: "Science Teacher",
    image: "/images/testimonials/rajan.webp",
  },
];

const partners = [
  { name: "FranklinCovey Education", logo: "/images/partners/franklincovey.webp" },
  { name: "Kalpavariksha Education Foundation", logo: "/images/partners/kalpavariksha.webp" },
  { name: "NYEF", logo: "/images/partners/nyef.webp" },
  { name: "Programiz", logo: "/images/partners/programiz.webp" },
  { name: "Duke of Edinburgh\u2019s Award", logo: "/images/partners/duke-edinburgh.webp" },
  { name: "Digital Nepal", logo: "/images/partners/digital-nepal.webp" },
  { name: "Robotics Association of Nepal", logo: "/images/partners/robotics-nepal.webp" },
  { name: "NCC Education", logo: "/images/partners/ncc-education.webp" },
  { name: "digiSchool", logo: "/images/partners/digischool.webp" },
  { name: "Code Himalaya", logo: "/images/partners/code-himalaya.webp" },
  { name: "Techspire College", logo: "/images/partners/techspire.webp" },
];

const features = [
  {
    icon: BeakerIcon,
    title: "STEAM & Experiential Learning",
    desc: "A curriculum that integrates science, technology, engineering, arts, and mathematics with hands-on experiential learning and global exposure trips.",
    image: "/images/why-different.webp",
  },
  {
    icon: GlobeAltIcon,
    title: "Global Exposure",
    desc: "Study tours to USA, UK, China, India and other countries, plus a \u201cKnow Nepal Program\u201d with field visits, trekking, and industrial visits.",
    image: "/images/partnerships.webp",
  },
  {
    icon: AcademicCapIcon,
    title: "Academic Excellence",
    desc: "A rigorous curriculum prescribed by the National Examinations Board with Aarambha Standard of Excellence and personalized attention.",
    image: "/images/about-2.webp",
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

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProgramsSection />
      <PrincipalMessage />
      <AboutSection />
      <StatsBar />
      <WhyDifferentSection />
      <SchoolLifeSection />
      <TeamSection />
      <TestimonialSection />
      <PartnersSection />
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
      <Image
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
          <Link href="/admissions" className="btn-cta">
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

function ProgramsSection() {
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
                  <Image
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
                  <p className="text-small text-[var(--muted)]">{program.desc}</p>
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
   Section 3 — Principal Message (alternating layout)
   ────────────────────────────────────────────── */

function PrincipalMessage() {
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
              <Image
                src="/images/principal.webp"
                alt="Naresh Prasad Shrestha"
                width={600}
                height={500}
                className="w-full h-[400px] lg:h-[480px] object-cover object-top"
              />
            </div>
            {/* Decorative blob behind */}
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
                At Aarambha Sanskar Vidyalaya, we blend traditional values with
                modern learning to nurture curious, creative, and compassionate
                leaders. Our STEAM-rich curriculum and cultural roots prepare students
                to excel academically and thrive as global citizens. With our
                dedicated educators and innovative programs, we provide a supportive
                environment where every child&apos;s potential blossoms.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-[2px] bg-[var(--gold)]" />
              <div>
                <p className="font-display text-[var(--navy)] font-semibold">
                  Naresh Prasad Shrestha
                </p>
                <p className="text-small text-[var(--muted)]">
                  Chairman &amp; Principal
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

function AboutSection() {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FF6B6B" size={50} top="15%" left="5%" shape="triangle" delay={0.5} />
      <FloatingShape color="#4EAED8" size={40} top="75%" left="90%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side first (reverse of principal) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <SectionLabel>About Us</SectionLabel>
            <h2 className="text-title font-display text-[var(--navy)] mb-6">
              A Progressive K-12 Institution
            </h2>
            <p className="text-body text-[var(--muted)] mb-6">
              Welcome to Aarambha School, a progressive K-12 educational
              institution strategically located in the heart of Kathmandu at Pipal
              Bot, Galko Pakha Marga, Ward Number 26.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-[var(--cream)] rounded-2xl p-5">
                <h3 className="font-display text-[var(--navy)] font-semibold mb-2">
                  Vision
                </h3>
                <p className="text-small text-[var(--muted)]">
                  To create a transformative educational experience that blends
                  Eastern values with 21st-century digital innovation.
                </p>
              </div>
              <div className="bg-[var(--cream)] rounded-2xl p-5">
                <h3 className="font-display text-[var(--navy)] font-semibold mb-2">
                  Mission
                </h3>
                <p className="text-small text-[var(--muted)]">
                  To cultivate a learning environment that combines advanced digital
                  technology with the timeless wisdom of Eastern philosophy.
                </p>
              </div>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[var(--navy)] font-semibold hover:gap-3 transition-all"
            >
              Learn More
              <ChevronRightIcon className="w-4 h-4" />
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
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/about-1.webp"
                alt="Aarambha School campus life"
                width={600}
                height={500}
                className="w-full h-[400px] lg:h-[480px] object-cover"
              />
            </div>
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full animate-blob opacity-25"
              style={{ backgroundColor: "var(--mint)" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Stats Bar (playful)
   ────────────────────────────────────────────── */

function StatsBar() {
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
                {stat.value}
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

function WhyDifferentSection() {
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
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="card group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 to-transparent" />
                <div className="absolute bottom-4 left-4 w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[var(--navy)]" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-subtitle font-display text-[var(--navy)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-small text-[var(--muted)]">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 7 — School Life (image-heavy grid)
   ────────────────────────────────────────────── */

function SchoolLifeSection() {
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
          {schoolLifeItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)]/80 via-[var(--navy)]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display text-white text-sm font-semibold leading-tight">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
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

function TeamSection() {
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
                <Image
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

function TestimonialSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
                    <Image
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

function PartnersSection() {
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
                <Image
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
          <Link href="/admissions" className="btn-cta">
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
