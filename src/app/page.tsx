"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  BeakerIcon,
  GlobeAltIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const stats = [
  { value: "K-12", label: "Grade Levels" },
  { value: "15+", label: "Years" },
  { value: "500+", label: "Alumni" },
  { value: "50+", label: "Faculty" },
];

const programs = [
  {
    name: "Early Years",
    desc: "Nurturing curiosity through play-based learning for ages 3-5.",
    image:
      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&q=80",
  },
  {
    name: "Primary School",
    desc: "Building strong foundations in literacy, numeracy, and character.",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80",
  },
  {
    name: "Middle School",
    desc: "Developing critical thinking and leadership skills.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  },
  {
    name: "High School",
    desc: "Preparing students for higher education and global citizenship.",
    image:
      "https://images.unsplash.com/photo-1627556704302-624286467c65?w=600&q=80",
  },
];

const features = [
  {
    icon: BeakerIcon,
    title: "STEAM Education",
    desc: "Hands-on innovation labs integrating science, technology, engineering, arts, and mathematics into everyday learning.",
  },
  {
    icon: GlobeAltIcon,
    title: "Global Exposure",
    desc: "International exchange programs and cultural immersion trips that broaden horizons and build global citizens.",
  },
  {
    icon: AcademicCapIcon,
    title: "Expert Faculty",
    desc: "Dedicated educators trained in modern pedagogy, committed to nurturing each student's unique potential.",
  },
];

const testimonials = [
  {
    quote:
      "Our child has flourished beyond our expectations. The teachers truly care about each student's growth and wellbeing.",
    name: "Priya Sharma",
    role: "Parent",
  },
  {
    quote:
      "Aarambha gave me the confidence to pursue my dreams. The mentorship here is unparalleled.",
    name: "Aarav Thapa",
    role: "Alumni, Class of 2022",
  },
  {
    quote:
      "The perfect blend of academics and values. Our children love going to school every day.",
    name: "Rajan Maharjan",
    role: "Parent",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <TwoColumnSection />
      <StatsBar />
      <ProgramsSection />
      <WhyAarambhaSection />
      <TestimonialSection />
      <CTASection />
    </>
  );
}

/* ──────────────────────────────────────────────
   Section 1 — Hero
   ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] md:min-h-[80vh] lg:min-h-screen flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80"
        alt="Students learning together"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-[rgba(0,62,103,0.7)]" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-label text-[var(--gold)]">Since 2008</span>
        <h1 className="text-hero font-display text-white mt-4 mb-6">
          Nurturing Tomorrow&apos;s Leaders
        </h1>
        <p className="text-body text-white/80 max-w-xl mx-auto mb-10">
          Aarambha Sanskar Vidyalaya blends timeless Eastern wisdom with
          contemporary education, preparing students to excel as thoughtful,
          capable global citizens.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/admissions" className="btn-cta">
            Apply Now
          </Link>
          <Link href="/programs" className="btn-secondary">
            Discover More
          </Link>
        </div>
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
   Section 2 — Intro "A Place to Belong"
   ────────────────────────────────────────────── */
function IntroSection() {
  return (
    <section className="bg-[var(--cream)] py-20 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="gold-line mx-auto mb-6" />
        <h2 className="text-title font-display text-[var(--navy)]">
          A Place to Belong
        </h2>
        <p className="text-body text-[var(--muted)] mt-6">
          At Aarambha, every child is seen, heard, and valued. Our nurturing
          community fosters confidence, creativity, and a deep love for
          learning — empowering students to discover who they are and who they
          aspire to become.
        </p>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — Two-Column Image + Text
   ────────────────────────────────────────────── */
function TwoColumnSection() {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[400px] lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"
            alt="Young learners in the classroom"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <motion.div
          className="p-12 lg:p-16 flex flex-col justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-label text-[var(--gold)]">Our Approach</span>
          <h2 className="text-title font-display text-[var(--navy)] mt-4 mb-6">
            A Nurturing Space for Young Learners
          </h2>
          <p className="text-body text-[var(--muted)] mb-8">
            We believe the best learning happens when children feel safe,
            inspired, and connected. Our inquiry-based curriculum encourages
            exploration, critical thinking, and collaboration — skills that last
            a lifetime.
          </p>
          <Link
            href="/programs"
            className="text-[var(--navy)] font-semibold hover:underline"
          >
            Learn More &rarr;
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 4 — Stats Bar
   ────────────────────────────────────────────── */
function StatsBar() {
  return (
    <section className="bg-[var(--navy)] py-16 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-title font-display text-[var(--gold)]">
              {stat.value}
            </div>
            <div className="text-label text-white/70 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 5 — Programs "Our Programs"
   ────────────────────────────────────────────── */
function ProgramsSection() {
  return (
    <section className="bg-[var(--cream)] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="text-title font-display text-[var(--navy)]">
            Our Programs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.name}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative h-48">
                <Image
                  src={program.image}
                  alt={program.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className="p-5">
                <span className="text-label text-[var(--muted)]">Program</span>
                <h3 className="text-subtitle font-display text-[var(--navy)] mt-1 mb-2">
                  {program.name}
                </h3>
                <p className="text-small text-[var(--muted)]">{program.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 6 — Why Aarambha
   ────────────────────────────────────────────── */
function WhyAarambhaSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-6" />
          <h2 className="text-title font-display text-[var(--navy)]">
            Why Aarambha
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-16 h-16 rounded-full bg-[var(--cream)] flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-[var(--navy)]" />
              </div>
              <h3 className="text-subtitle font-display text-[var(--navy)]">
                {feature.title}
              </h3>
              <p className="text-small text-[var(--muted)] mt-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 7 — Testimonial
   ────────────────────────────────────────────── */
function TestimonialSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="bg-[var(--navy)] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-[80px] leading-none font-display text-[var(--gold)]">
          &ldquo;
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-subtitle font-display italic text-white">
              {testimonials[activeTestimonial].quote}
            </p>
            <p className="text-small text-[var(--gold)] font-semibold mt-6">
              {testimonials[activeTestimonial].name} &mdash;{" "}
              {testimonials[activeTestimonial].role}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              aria-label={`View testimonial ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeTestimonial
                  ? "bg-[var(--gold)]"
                  : "bg-white/30"
              }`}
            />
          ))}
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
    <section className="bg-[var(--cream)] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-title font-display text-[var(--navy)]">
          Ready to Begin Your Child&apos;s Journey?
        </h2>
        <p className="text-body text-[var(--muted)] mt-4 mb-8">
          Admissions for the upcoming academic year are now open. Take the first
          step toward a transformative education for your child.
        </p>
        <Link href="/contact" className="btn-cta">
          Inquire Now
        </Link>
      </div>
    </section>
  );
}
