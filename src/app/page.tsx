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
  LightBulbIcon,
  HeartIcon,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

const stats = [
  { value: "K-12", label: "Grade Levels" },
  { value: "15+", label: "Years" },
  { value: "500+", label: "Alumni" },
  { value: "50+", label: "Faculty" },
];

const schoolLifeItems = [
  { title: "Explore Your Interests", icon: LightBulbIcon },
  { title: "Get Active and Healthy", icon: HeartIcon },
  { title: "Explore the World Around You", icon: GlobeAltIcon },
  { title: "Express Yourself", icon: PaintBrushIcon },
  { title: "Find Your Voice", icon: ChatBubbleLeftRightIcon },
  { title: "Join the Club", icon: UserGroupIcon },
  { title: "Make Beautiful Music", icon: MusicalNoteIcon },
  { title: "Move and Groove", icon: BeakerIcon },
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
  },
  {
    icon: GlobeAltIcon,
    title: "Global Exposure",
    desc: "Study tours to USA, UK, China, India and other countries, plus a \u201cKnow Nepal Program\u201d with field visits, trekking, and industrial visits.",
  },
  {
    icon: AcademicCapIcon,
    title: "Academic Excellence",
    desc: "A rigorous curriculum prescribed by the National Examinations Board with Aarambha Standard of Excellence and personalized attention.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
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
   Section 1 — Hero
   ────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[70vh] md:min-h-[80vh] lg:min-h-screen flex items-center justify-center">
      <Image
        src="/images/hero.webp"
        alt="Aarambha School students"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className="absolute inset-0 bg-[rgba(30,74,122,0.7)]" />

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
   Section 2 — Principal Message
   ────────────────────────────────────────────── */
function PrincipalMessage() {
  return (
    <section className="bg-[var(--cream)] py-20 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-label text-[var(--gold)] block mb-2">Welcome</span>
        <h2 className="text-title font-display text-[var(--navy)] mb-8">
          Message from Principal
        </h2>
        <div className="relative">
          <span className="text-[80px] leading-none font-display text-[var(--gold)] absolute -top-8 -left-4">
            &ldquo;
          </span>
          <p className="text-body text-[var(--muted)] italic px-8">
            At Aarambha Sanskar Vidyalaya, we blend traditional values with
            modern learning to nurture curious, creative, and compassionate
            leaders. Our STEAM-rich curriculum and cultural roots prepare students
            to excel academically and thrive as global citizens. With our
            dedicated educators and innovative programs, we provide a supportive
            environment where every child&apos;s potential blossoms.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Image
            src="/images/principal.webp"
            alt="Naresh Prasad Shrestha"
            width={64}
            height={64}
            className="rounded-full object-cover w-16 h-16"
          />
          <div className="text-left">
            <p className="font-display text-[var(--navy)] font-semibold">
              Naresh Prasad Shrestha
            </p>
            <p className="text-small text-[var(--muted)]">
              Chairman and Principal, Aarambha School
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 3 — About
   ────────────────────────────────────────────── */
function AboutSection() {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[400px] lg:h-auto">
          <Image
            src="/images/about-1.webp"
            alt="Aarambha School campus life"
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
          <span className="text-label text-[var(--gold)]">About Us</span>
          <h2 className="text-title font-display text-[var(--navy)] mt-4 mb-6">
            A Progressive K-12 Institution
          </h2>
          <p className="text-body text-[var(--muted)] mb-4">
            Welcome to Aarambha School, a progressive K-12 educational
            institution strategically located in the heart of Kathmandu at Pipal
            Bot, Galko Pakha Marga, Ward Number 26.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-display text-[var(--navy)] font-semibold mb-2">
                Vision
              </h3>
              <p className="text-small text-[var(--muted)]">
                To create a transformative educational experience that blends
                Eastern values and philosophy with 21st-century digital
                innovation.
              </p>
            </div>
            <div>
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
   Section 5 — Why Different
   ────────────────────────────────────────────── */
function WhyDifferentSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="gold-line mx-auto mb-6" />
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
   Section 6 — School Life
   ────────────────────────────────────────────── */
function SchoolLifeSection() {
  return (
    <section className="bg-[var(--cream)] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-label text-[var(--gold)] block mb-2">
            School Life
          </span>
          <h2 className="text-title font-display text-[var(--navy)]">
            Fun Beyond The Classroom
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            At Aarambha School, we believe learning shouldn&apos;t stop at textbooks.
            That&apos;s why we offer a variety of exciting activities to help your
            child grow and develop outside the classroom!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schoolLifeItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <item.icon className="w-10 h-10 mx-auto mb-3 text-[var(--navy)]" />
              <h3 className="font-display text-[var(--navy)] text-sm font-semibold">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/programs" className="btn-cta">
            View Details &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 7 — Meet Our Team
   ────────────────────────────────────────────── */
function TeamSection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-label text-[var(--gold)] block mb-2">
            Our Team
          </span>
          <h2 className="text-title font-display text-[var(--navy)]">
            Meet Our Team
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Dedicated professionals committed to inspiring, guiding, and
            empowering every learner.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={120}
                height={120}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="font-display text-[var(--navy)] font-semibold">
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
   Section 8 — Testimonials
   ────────────────────────────────────────────── */
function TestimonialSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="bg-[var(--navy)] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-label text-[var(--gold)] block mb-2">
          Testimonial
        </span>
        <h2 className="text-title font-display text-white mb-2">
          Hear From Our Community
        </h2>
        <p className="text-small text-white/60 mb-10">
          Stories of Growth, Impact, and Connection
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-subtitle font-display italic text-white">
              &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Image
                src={testimonials[activeTestimonial].image}
                alt={testimonials[activeTestimonial].name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="text-small text-[var(--gold)] font-semibold">
                  {testimonials[activeTestimonial].name}
                </p>
                <p className="text-tiny text-white/60">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              aria-label={`View testimonial ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
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
   Section 9 — Partners
   ────────────────────────────────────────────── */
function PartnersSection() {
  return (
    <section className="bg-[var(--cream)] py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-label text-[var(--gold)] block mb-2">
            School Life
          </span>
          <h2 className="text-title font-display text-[var(--navy)]">
            Meet Our Partners
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-white rounded-lg px-6 py-4 shadow-sm flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={110}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Section 10 — CTA
   ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-title font-display text-[var(--navy)]">
          Ready to Begin Your Child&apos;s Journey?
        </h2>
        <p className="text-body text-[var(--muted)] mt-4 mb-8">
          Admissions for the upcoming academic year are now open. Take the first
          step toward a transformative education for your child.
        </p>
        <Link href="/admissions" className="btn-cta">
          Admission Form
        </Link>
      </div>
    </section>
  );
}
