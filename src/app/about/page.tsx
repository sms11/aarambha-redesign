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
} from "@heroicons/react/24/outline";

const milestones = [
  { year: "2008", title: "Founded", desc: "Aarambha Sanskar Vidyalaya established with a vision for holistic education." },
  { year: "2012", title: "Expanded to K-8", desc: "Added middle school grades with specialized subject teaching." },
  { year: "2015", title: "STEAM Program", desc: "Introduced hands-on STEAM education across all grades." },
  { year: "2018", title: "Full K-12", desc: "Launched high school program with comprehensive curriculum." },
  { year: "2021", title: "New Laboratories", desc: "State-of-the-art science and computer labs opened." },
  { year: "2023", title: "Campus Expansion", desc: "New sports complex and auditorium completed." },
];

const values = [
  { icon: LightBulbIcon, title: "Curiosity", description: "We celebrate questions and foster a lifelong love of learning." },
  { icon: ShieldCheckIcon, title: "Integrity", description: "We uphold honesty and ethical behavior in all interactions." },
  { icon: ArrowTrendingUpIcon, title: "Growth", description: "We believe every child can grow with effort and support." },
  { icon: HeartIcon, title: "Respect", description: "We honor diverse perspectives and treat everyone with dignity." },
  { icon: SparklesIcon, title: "Creativity", description: "We encourage original thinking and innovative problem-solving." },
  { icon: FireIcon, title: "Resilience", description: "We teach students to embrace challenges and learn from setbacks." },
];

const leaders = [
  { name: "Dr. Suman Adhikari", role: "Principal", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80" },
  { name: "Mrs. Anita Gurung", role: "Vice Principal", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Mr. Rajesh Shrestha", role: "Academic Director", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <MissionVisionSection />
      <ValuesSection />
      <HistorySection />
      <LeadershipSection />
      <CTASection />
    </>
  );
}

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
      <div className="absolute inset-0 bg-[rgba(30,74,122,0.85)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center px-6"
      >
        <span className="text-label text-[var(--gold)] block mb-4">Our Story</span>
        <h1 className="text-hero font-display text-white">
          Where Tradition Meets Innovation
        </h1>
      </motion.div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 border-l-4 border-[var(--gold)]"
        >
          <h2 className="text-title font-display text-[var(--navy)] mb-4">Our Mission</h2>
          <p className="text-body text-[var(--muted)]">
            To nurture holistic development through academic excellence, character building, and
            cultural values, empowering students to become responsible global citizens.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8 border-l-4 border-[var(--navy)]"
        >
          <h2 className="text-title font-display text-[var(--navy)] mb-4">Our Vision</h2>
          <p className="text-body text-[var(--muted)]">
            To be a leading institution that inspires lifelong learners, fosters innovation, and
            cultivates leaders who make a positive impact on society.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-6" />
        <h2 className="text-title font-display text-[var(--navy)]">Our Core Values</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {values.map((value, index) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-[var(--cream)] rounded-xl p-6 text-center"
          >
            <value.icon className="w-12 h-12 mx-auto mb-4 text-[var(--navy)]" />
            <h3 className="text-subtitle font-display text-[var(--navy)] mb-2">{value.title}</h3>
            <p className="text-small text-[var(--muted)]">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HistorySection() {
  return (
    <section className="py-20 px-6 bg-[var(--cream)]">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-6" />
        <h2 className="text-title font-display text-[var(--navy)]">Our Journey</h2>
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden lg:block max-w-6xl mx-auto">
        <div className="relative flex flex-row justify-between items-start">
          {/* Gold horizontal line */}
          <div className="absolute top-6 left-0 right-0 h-[3px] bg-[var(--gold)]" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex-1 px-3 text-center"
            >
              {/* Dot on the line */}
              <div className="w-3 h-3 rounded-full bg-[var(--gold)] mx-auto mb-4 relative z-10" />
              <p className="text-title font-display text-[var(--gold)]">{milestone.year}</p>
              <h3 className="text-subtitle font-display text-[var(--navy)] mt-1 mb-1">{milestone.title}</h3>
              <p className="text-small text-[var(--muted)]">{milestone.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical timeline */}
      <div className="lg:hidden max-w-md mx-auto">
        <div className="relative border-l-[3px] border-[var(--gold)] pl-8 space-y-10">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative"
            >
              {/* Dot on the vertical line */}
              <div className="absolute -left-[calc(2rem+7.5px)] top-1 w-3 h-3 rounded-full bg-[var(--gold)]" />
              <p className="text-title font-display text-[var(--gold)]">{milestone.year}</p>
              <h3 className="text-subtitle font-display text-[var(--navy)] mt-1 mb-1">{milestone.title}</h3>
              <p className="text-small text-[var(--muted)]">{milestone.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadershipSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-6" />
        <h2 className="text-title font-display text-[var(--navy)]">Our Leadership</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="relative h-64">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-subtitle font-display text-[var(--navy)]">{leader.name}</h3>
              <p className="text-small text-[var(--muted)]">{leader.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-6 bg-[var(--cream)] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-title font-display text-[var(--navy)] mb-4">Experience Our Campus</h2>
        <p className="text-body text-[var(--muted)] mb-8">
          See firsthand what makes Aarambha special.
        </p>
        <Link href="/contact" className="btn-cta">
          Schedule a Visit
        </Link>
      </motion.div>
    </section>
  );
}
