"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  SparklesIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { getIcon } from "@/lib/icons";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface InvolvementItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  color: string | null;
  section: string;
}

interface TestimonialItem {
  id: number;
  quote: string;
  name: string;
  role: string;
  image: string;
  stars: number;
  color: string;
}

interface PartnerItem {
  id: number;
  name: string;
  logo: string;
}

export interface AdmissionsPageClientProps {
  involvementItems: InvolvementItem[];
  businessPartnerships: InvolvementItem[];
  educationalPartnerships: InvolvementItem[];
  testimonials: TestimonialItem[];
  partners: PartnerItem[];
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

export default function AdmissionsPageClient({
  involvementItems,
  businessPartnerships,
  educationalPartnerships,
  testimonials,
  partners,
}: AdmissionsPageClientProps) {
  return (
    <>
      <HeroSection />
      <WaveDivider color="white" />
      <InvolvementSection involvementItems={involvementItems} />
      <WaveDivider color="var(--cream)" flip />
      <PartnershipsSection
        businessPartnerships={businessPartnerships}
        educationalPartnerships={educationalPartnerships}
      />
      <WaveDivider color="white" />
      <PartnersMarquee partners={partners} />
      <WaveDivider color="var(--cream)" />
      <TestimonialsSection testimonials={testimonials} />
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
        src="/images/community/partnerships-1.webp"
        alt="Aarambha School community partnerships"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.88)] via-[rgba(30,74,122,0.78)] to-[rgba(19,47,80,0.92)]" />

      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="15%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="68%" left="82%" shape="square" delay={0.5} />
      <FloatingShape color="#FBBF77" size={35} top="35%" left="93%" shape="circle" delay={1.5} />

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
          Community
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          Stronger <span className="text-[var(--gold)]">Together</span>
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          We promote active collaboration between parents, teachers, and the
          community through regular meetings, events, and initiatives, fostering
          a supportive environment for student success.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link href="/contact" className="btn-cta">
            Get Involved
          </Link>
          <a href="#testimonials" className="btn-secondary">
            Hear Our Stories
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 2 — Parent-Teacher & Community Involvement
   ────────────────────────────────────────────── */

function InvolvementSection({ involvementItems }: { involvementItems: InvolvementItem[] }) {
  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="4%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Involvement</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Parent-Teacher Associations &<br />Community Involvement
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-2xl mx-auto">
            We promote active collaboration between parents, teachers, and the
            community through regular meetings, events, and initiatives,
            fostering a supportive environment for student success.
          </p>
        </div>

        {involvementItems.map((item, index) => (
          <motion.div
            key={item.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              index % 2 !== 0 ? "lg:direction-rtl" : ""
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Image */}
            <div className="relative h-[300px] lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={item.image ?? ""}
                alt={item.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div
                className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full animate-blob opacity-20"
                style={{ backgroundColor: item.color ?? "var(--coral)" }}
              />
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color ?? "var(--coral)"}15` }}
                >
                  <UserGroupIcon className="w-6 h-6" style={{ color: item.color ?? "var(--coral)" }} />
                </div>
                <h3 className="text-subtitle font-display text-[var(--navy)]">
                  {item.title}
                </h3>
              </div>
              <div
                className="w-12 h-1 rounded-full mb-5"
                style={{ backgroundColor: item.color ?? "var(--coral)" }}
              />
              <p className="text-body text-[var(--muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Partnerships
   ────────────────────────────────────────────── */

function PartnershipsSection({
  businessPartnerships,
  educationalPartnerships,
}: {
  businessPartnerships: InvolvementItem[];
  educationalPartnerships: InvolvementItem[];
}) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#A78BFA" size={60} top="8%" left="88%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={45} top="75%" left="5%" shape="square" delay={1.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Involvement</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Partnerships with Local Businesses &<br />Educational Institutions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Partnership cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* Business Partnerships */}
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, var(--mint), var(--navy-light))" }}
              />
              <div className="w-14 h-14 rounded-2xl bg-[rgba(78,205,196,0.1)] flex items-center justify-center mb-6">
                <AcademicCapIcon className="w-7 h-7 text-[var(--mint)]" />
              </div>
              <h3 className="text-subtitle font-display text-[var(--navy)] mb-6">
                Business Partnerships
              </h3>
              <div className="space-y-6">
                {businessPartnerships.map((item) => {
                  const IconComponent = getIcon(item.image ?? "");
                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-1"
                        style={{ backgroundColor: `${item.color ?? "var(--mint)"}15` }}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" style={{ color: item.color ?? "var(--mint)" }} />}
                      </div>
                      <div>
                        <h4 className="text-small font-semibold text-[var(--navy)] mb-1">
                          {item.title}
                        </h4>
                        <p className="text-small text-[var(--muted)] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Educational Partnerships */}
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, var(--lavender), var(--peach))" }}
              />
              <div className="w-14 h-14 rounded-2xl bg-[rgba(167,139,250,0.1)] flex items-center justify-center mb-6">
                <AcademicCapIcon className="w-7 h-7 text-[var(--lavender)]" />
              </div>
              <h3 className="text-subtitle font-display text-[var(--navy)] mb-6">
                Educational Partnerships
              </h3>
              <div className="space-y-6">
                {educationalPartnerships.map((item) => {
                  const IconComponent = getIcon(item.image ?? "");
                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-1"
                        style={{ backgroundColor: `${item.color ?? "var(--lavender)"}15` }}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" style={{ color: item.color ?? "var(--lavender)" }} />}
                      </div>
                      <div>
                        <h4 className="text-small font-semibold text-[var(--navy)] mb-1">
                          {item.title}
                        </h4>
                        <p className="text-small text-[var(--muted)] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right: Partnership images */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-[280px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/community/partnerships-1.webp"
                alt="Aarambha community partnership event"
                fill
                className="object-cover"
              />
              <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-[var(--gold)] opacity-20 animate-blob" />
            </div>
            <div className="relative h-[280px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/community/partnerships-2.webp"
                alt="Aarambha students in community program"
                fill
                className="object-cover"
              />
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-[var(--mint)] opacity-20 animate-blob" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Partners Marquee
   ────────────────────────────────────────────── */

function PartnersMarquee({ partners }: { partners: PartnerItem[] }) {
  const doubled = [...partners, ...partners];

  return (
    <section className="bg-white py-20 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel>School Life</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Meet Our Partners
          </h2>
        </div>

        <div className="overflow-hidden">
          <div className="marquee-track flex items-center gap-16 w-max">
            {doubled.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex items-center justify-center h-16 w-32 shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={110}
                  height={44}
                  className="object-contain h-full w-auto"
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
   Section 5 — Testimonials
   ────────────────────────────────────────────── */

function TestimonialsSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, next]);

  const current = testimonials[active];

  return (
    <section id="testimonials" className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FBBF77" size={70} top="5%" left="3%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="92%" shape="square" delay={1} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <SectionLabel>Testimonial</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Hear From Our Community
          </h2>
          <p className="text-body text-[var(--muted)] mt-3">
            Stories of Growth, Impact, and Connection
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 25 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden"
            >
              {/* Accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                style={{ backgroundColor: current.color }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: current.stars }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[var(--gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg md:text-xl font-display text-[var(--navy)] leading-relaxed mb-8">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-3 ring-offset-2 ring-[var(--gold)]">
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-[var(--navy)]">
                    {current.name}
                  </h4>
                  <p className="text-small text-[var(--muted)]">{current.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[var(--cream)] transition-colors cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-5 h-5 text-[var(--navy)]" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    active === i
                      ? "w-8 bg-[var(--gold)]"
                      : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[var(--cream)] transition-colors cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="w-5 h-5 text-[var(--navy)]" />
            </button>
          </div>
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
      <FloatingShape color="#FF6B6B" size={50} top="20%" left="78%" shape="star" delay={1} />
      <FloatingShape color="#A78BFA" size={70} top="70%" left="12%" shape="square" delay={1.5} />

      <motion.div
        className="max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-5xl mb-4 block">🤝</span>
        <h2 className="text-title font-display text-white mb-4">
          Join the Aarambha Community
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Be part of a vibrant community where parents, teachers, students, and
          partners come together to create an extraordinary learning environment.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-cta">
            Get in Touch
          </Link>
          <Link href="/admissions" className="btn-secondary">
            Admission Process
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
