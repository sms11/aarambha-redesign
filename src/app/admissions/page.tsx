"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDownIcon,
  CheckIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  UserPlusIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

/* ──────────────────────────────────────────────
   Data
   ────────────────────────────────────────────── */

const steps = [
  { num: 1, title: "Apply", desc: "Submit online application form", icon: ClipboardDocumentListIcon, color: "var(--coral)" },
  { num: 2, title: "Assessment", desc: "Age-appropriate entrance evaluation", icon: AcademicCapIcon, color: "var(--mint)" },
  { num: 3, title: "Interview", desc: "Parent and student interaction", icon: ChatBubbleLeftRightIcon, color: "var(--lavender)" },
  { num: 4, title: "Decision", desc: "Admission decision communicated", icon: CheckBadgeIcon, color: "var(--peach)" },
  { num: 5, title: "Enrollment", desc: "Complete enrollment formalities", icon: UserPlusIcon, color: "var(--gold)" },
];

const documents = [
  "Birth Certificate",
  "Previous Report Cards (last 2 years)",
  "Passport-size Photos (4 copies)",
  "Transfer Certificate (if applicable)",
  "Immunization Records",
];

const eligibility = [
  "Age-appropriate for grade level",
  "Entrance assessment clearance",
  "Parent/guardian interview",
  "Previous academic records review",
  "Willingness to abide by school values",
];

const fees = [
  { level: "Pre-School", fee: "NPR 1,20,000", items: ["Tuition", "Books & Materials", "Activities", "Snacks"], color: "var(--coral)", popular: false },
  { level: "Primary", fee: "NPR 1,50,000", items: ["Tuition", "Books & Materials", "Lab Access", "Activities", "Library"], color: "var(--mint)", popular: true },
  { level: "Middle School", fee: "NPR 1,80,000", items: ["Tuition", "Books & Materials", "Lab Access", "Activities", "Library", "Sports"], color: "var(--lavender)", popular: false },
  { level: "High School", fee: "NPR 2,20,000", items: ["Tuition", "Books & Materials", "Lab Access", "Activities", "Library", "Sports", "Career Counseling"], color: "var(--navy)", popular: false },
];

const faqs = [
  { q: "When does the academic year begin?", a: "The academic year begins in mid-April and ends in March. Admissions for the new session typically open in January." },
  { q: "Is transportation available?", a: "Yes, we provide bus services covering major routes across Kathmandu valley. Routes and schedules are shared upon enrollment." },
  { q: "What is the student-teacher ratio?", a: "We maintain a ratio of approximately 20:1, ensuring personalized attention for every student." },
  { q: "Are scholarships available?", a: "Yes, merit-based and need-based scholarships are available for students from Grade 1 onwards. Contact admissions for details." },
  { q: "What is the admission timeline?", a: "Applications open in January, assessments in February, interviews in March, and results by late March." },
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

export default function AdmissionsPage() {
  return (
    <>
      <HeroSection />
      <WaveDivider color="white" />
      <ProcessSection />
      <WaveDivider color="var(--cream)" />
      <RequirementsSection />
      <WaveDivider color="white" />
      <FeeStructureSection />
      <WaveDivider color="var(--cream)" />
      <FAQSection />
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
        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80"
        alt="Students collaborating in a classroom"
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
          Join Our Family
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <h1 className="text-hero font-display text-white mt-6 mb-4">
          Begin Your Journey With Us
        </h1>

        <motion.p
          className="text-body text-white/80 max-w-xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Take the first step toward a transformative education that blends
          Eastern values with 21st-century innovation.
        </motion.p>

        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--gold)] bg-[rgba(246,206,107,0.12)] backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-[var(--gold)]">
            Admissions Open 2026-27
          </span>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Link href="/contact" className="btn-cta">
            Apply Now
          </Link>
          <a href="#process" className="btn-secondary">
            Learn the Process
          </a>
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
   Section 2 — Admission Process
   ────────────────────────────────────────────── */

function ProcessSection() {
  return (
    <section id="process" className="relative bg-white py-24 px-6 overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="90%" shape="star" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="4%" shape="circle" delay={1} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Admission Process
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            A simple, transparent five-step journey from application to enrollment.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[var(--coral)] via-[var(--mint)] to-[var(--gold)] rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.num}
                className="flex flex-col items-center text-center relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10"
                  style={{ backgroundColor: step.color }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </motion.div>

                <div className="mt-5">
                  <span
                    className="inline-block text-tiny font-bold px-2.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: `color-mix(in srgb, ${step.color} 15%, white)`, color: step.color }}
                  >
                    Step {step.num}
                  </span>
                  <h3 className="text-subtitle font-display text-[var(--navy)]">
                    {step.title}
                  </h3>
                  <p className="text-small text-[var(--muted)] mt-1 max-w-[180px] mx-auto">
                    {step.desc}
                  </p>
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
   Section 3 — Requirements
   ────────────────────────────────────────────── */

function RequirementsSection() {
  return (
    <section className="relative bg-[var(--cream)] py-24 px-6 overflow-hidden">
      <FloatingShape color="#A78BFA" size={60} top="10%" left="88%" shape="triangle" delay={0} />
      <FloatingShape color="#FF6B6B" size={45} top="75%" left="5%" shape="square" delay={1.5} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>What You Need</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Requirements
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            Gather the following documents and ensure eligibility before applying.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Documents Card */}
          <motion.div
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
              style={{ background: "linear-gradient(90deg, var(--coral), var(--peach))" }}
            />
            <div className="w-14 h-14 rounded-2xl bg-[rgba(255,107,107,0.1)] flex items-center justify-center mb-6">
              <DocumentTextIcon className="w-7 h-7 text-[var(--coral)]" />
            </div>
            <h3 className="text-subtitle font-display text-[var(--navy)] mb-5">
              Documents Required
            </h3>
            <ul className="space-y-3.5">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-3 text-body text-[var(--muted)]">
                  <span className="mt-1 w-5 h-5 rounded-full bg-[rgba(255,107,107,0.1)] flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3 h-3 text-[var(--coral)]" />
                  </span>
                  {doc}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Eligibility Card */}
          <motion.div
            className="bg-white rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
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
              <ShieldCheckIcon className="w-7 h-7 text-[var(--mint)]" />
            </div>
            <h3 className="text-subtitle font-display text-[var(--navy)] mb-5">
              Eligibility Criteria
            </h3>
            <ul className="space-y-3.5">
              {eligibility.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-[var(--muted)]">
                  <span className="mt-1 w-5 h-5 rounded-full bg-[rgba(78,205,196,0.1)] flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3 h-3 text-[var(--mint)]" />
                  </span>
                  {item}
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
   Section 4 — Fee Structure
   ────────────────────────────────────────────── */

function FeeStructureSection() {
  return (
    <section className="relative bg-white py-24 px-6 overflow-hidden">
      <FloatingShape color="#FBBF77" size={80} top="5%" left="3%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="80%" left="92%" shape="triangle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Investment in Education</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Fee Structure
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            Transparent pricing for every level of your child&apos;s academic journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fees.map((fee, index) => (
            <motion.div
              key={fee.level}
              className={`relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all ${
                fee.popular ? "ring-2 ring-[var(--mint)] md:scale-105" : ""
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{ y: -8 }}
            >
              {/* Colored top accent */}
              <div
                className="h-2"
                style={{ backgroundColor: fee.color }}
              />

              {/* Popular badge */}
              {fee.popular && (
                <div className="absolute top-5 right-4 bg-[var(--mint)] text-white text-tiny font-bold px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}

              <div className="p-7 text-center">
                <h3 className="text-subtitle font-display text-[var(--navy)]">
                  {fee.level}
                </h3>
                <div className="mt-4 mb-1">
                  <span className="text-title font-display" style={{ color: fee.color }}>
                    {fee.fee}
                  </span>
                </div>
                <span className="text-small text-[var(--muted)]">per year</span>

                <div className="w-full h-px bg-gray-100 my-5" />

                <ul className="text-left space-y-2.5">
                  {fee.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-small text-[var(--muted)]">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `color-mix(in srgb, ${fee.color} 12%, white)` }}
                      >
                        <CheckIcon className="w-3 h-3" style={{ color: fee.color }} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full mt-6 py-3 rounded-xl text-small font-semibold transition-colors"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${fee.color} 10%, white)`,
                    color: fee.color,
                  }}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — FAQ
   ────────────────────────────────────────────── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const accentColors = ["var(--coral)", "var(--mint)", "var(--lavender)", "var(--peach)", "var(--navy-light)"];

  return (
    <section className="relative bg-[var(--cream)] py-24 px-6 overflow-hidden">
      <FloatingShape color="#A78BFA" size={55} top="8%" left="5%" shape="star" delay={0} />
      <FloatingShape color="#FF6B6B" size={40} top="85%" left="90%" shape="circle" delay={1} />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Got Questions?</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Frequently Asked Questions
          </h2>
          <p className="text-body text-[var(--muted)] mt-3 max-w-lg mx-auto">
            Everything you need to know about admissions at Aarambha School.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const accentColor = accentColors[index % accentColors.length];

            return (
              <motion.div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm transition-shadow"
                style={{
                  boxShadow: isOpen ? "0 8px 30px rgba(0,0,0,0.08)" : undefined,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center gap-4 text-left cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div
                    className="w-1 h-8 rounded-full shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isOpen ? accentColor : "transparent",
                    }}
                  />
                  <span className="text-subtitle font-display text-[var(--navy)] flex-1">
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="shrink-0"
                  >
                    <ChevronDownIcon className="w-5 h-5 text-[var(--muted)]" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pl-11">
                        <p className="text-body text-[var(--muted)] leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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
        <span className="text-5xl mb-4 block">📞</span>
        <h2 className="text-title font-display text-white mb-4">
          Have Questions? We&apos;re Here to Help
        </h2>
        <p className="text-body text-white/70 mt-4 mb-10 max-w-xl mx-auto">
          Our admissions team is ready to guide you through every step of the
          process. Reach out and we will get back to you promptly.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:info@aarambha.school" className="btn-cta">
            Email Us
          </a>
          <a href="tel:+9779823837865" className="btn-secondary">
            Call Us
          </a>
        </div>
      </motion.div>
    </section>
  );
}
