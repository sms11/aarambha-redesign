"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { getIcon } from "@/lib/icons";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface FeatureCard {
  title: string;
  description: string;
}

interface ProgramHighlight {
  title: string;
  description: string;
}

interface ProgramItem {
  id: number;
  name: string;
  ages: string;
  grades: string;
  description: string;
  highlights: string[];
  teaching: string;
  image: string;
  color: string;
  emoji: string;
  sectionLabel: string | null;
  featureCards: string | null;
  programHighlights: string | null;
  galleryImages: string[];
}

interface SpecialFeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}

interface KeyBenefitItem {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
}

export interface ProgramsPageClientProps {
  programs: ProgramItem[];
  specialFeatures: SpecialFeatureItem[];
  keyBenefits: KeyBenefitItem[];
}

/* ──────────────────────────────────────────────
   Helper to parse JSON fields
   ────────────────────────────────────────────── */

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */

export default function ProgramsPageClient({
  programs,
  specialFeatures,
  keyBenefits,
}: ProgramsPageClientProps) {
  const [activeTab, setActiveTab] = useState(0);
  const program = programs[activeTab];

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No programs available.</p>
      </div>
    );
  }

  const featureCards = parseJson<FeatureCard[]>(program.featureCards, []);
  const programHighlights = parseJson<ProgramHighlight[]>(program.programHighlights, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[50vh] md:min-h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.9)] via-[rgba(30,74,122,0.8)] to-[rgba(19,47,80,0.92)]" />
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-4 block">
            Academic Excellence
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6">
            Our Programs
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Comprehensive education from Pre-School through Secondary, designed to nurture every stage of growth.
          </p>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <div className="bg-white sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-center">
          <div className="inline-flex bg-gray-50 rounded-full p-1.5 gap-1 flex-wrap justify-center overflow-x-auto max-w-full">
            {programs.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  i === activeTab
                    ? "bg-[var(--navy)] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-base">{p.emoji}</span>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Program Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={program.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Section Header */}
          <section className="bg-white py-16 px-6 relative overflow-hidden">
            {/* Decorative star top-right */}
            <div className="absolute top-8 right-8 opacity-15">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <path d="M30 5 L35 20 L50 20 L38 30 L42 45 L30 37 L18 45 L22 30 L10 20 L25 20 Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
              </svg>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Label + Title */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-[#2e7d32] rounded-full" />
                  <span className="text-[#FF6B35] font-semibold text-sm uppercase tracking-wider">
                    {program.sectionLabel || "Our Program"}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display text-[var(--navy)] leading-tight">
                  {program.name} ({program.grades})
                </h2>
              </div>

              {/* Feature Cards — 3 columns */}
              {featureCards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {featureCards.map((card, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e8eaf6] flex items-center justify-center">
                          <span className="text-lg">{program.emoji}</span>
                        </div>
                        <h3 className="font-display font-bold text-[var(--navy)] text-base">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[#5a5a5a] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quote/Description block with gold left border */}
              <div className="relative bg-gray-50 rounded-2xl p-8 mb-16">
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-[var(--gold)] rounded-full" />
                <p className="text-base text-[#444] leading-relaxed pl-6">
                  {program.description}
                </p>
              </div>

              {/* Program Highlights */}
              {programHighlights.length > 0 && (
                <div>
                  <h3 className="text-2xl font-display font-bold text-[var(--navy)] mb-8">
                    Our Program Highlights
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left: highlight items */}
                    <div className="space-y-1">
                      {programHighlights.map((hl, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#e8eaf6] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5 text-[var(--navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-[var(--navy)] text-sm mb-0.5">
                              {hl.title}
                            </h4>
                            <p className="text-sm text-[#5a5a5a]">{hl.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right: image grid */}
                    <div className="relative">
                      <div className="absolute -top-4 -right-4 opacity-20">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                          <path d="M25 5 L30 18 L43 18 L33 27 L36 40 L25 33 L14 40 L17 27 L7 18 L20 18 Z" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
                        </svg>
                      </div>
                      {(() => {
                        const imgs = program.galleryImages.length > 0 ? program.galleryImages : [program.image];
                        const topRow = imgs.slice(0, 3);
                        const bottomRow = imgs.slice(3, 5);
                        return (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {topRow.map((src, i) => (
                                <SmartImage
                                  key={i}
                                  src={src}
                                  alt={`${program.name} ${i + 1}`}
                                  width={300}
                                  height={200}
                                  className="w-full h-[140px] object-cover rounded-xl"
                                />
                              ))}
                            </div>
                            {bottomRow.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {bottomRow.map((src, i) => (
                                  <SmartImage
                                    key={i}
                                    src={src}
                                    alt={`${program.name} ${i + 4}`}
                                    width={400}
                                    height={250}
                                    className="w-full h-[180px] object-cover rounded-xl"
                                  />
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                      <div className="absolute -bottom-4 -left-4 opacity-30">
                        <svg width="50" height="25" viewBox="0 0 50 25" fill="none">
                          <path d="M0 8 Q8 0 16 8 Q24 16 32 8 Q40 0 50 8" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" fill="none" />
                          <path d="M0 18 Q8 10 16 18 Q24 26 32 18 Q40 10 50 18" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* Special Features */}
      {specialFeatures.length > 0 && (
        <section className="bg-[var(--cream)] py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-3 block">
                What Makes Us Special
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-[var(--navy)]">
                Special Features
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {specialFeatures.map((feature, i) => {
                const Icon = getIcon(feature.icon);
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: feature.bg || "#e8eaf6", color: feature.color }}
                    >
                      {Icon ? <Icon className="w-6 h-6" /> : <span className="text-xl">{feature.icon}</span>}
                    </div>
                    <h3 className="font-display font-bold text-[var(--navy)] text-base mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#5a5a5a] leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Key Benefits */}
      {keyBenefits.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-[var(--gold)] font-semibold text-sm uppercase tracking-wider mb-3 block">
                Why Choose Aarambha
              </span>
              <h2 className="text-3xl md:text-4xl font-display text-[var(--navy)]">
                Key Benefits
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {keyBenefits.map((benefit, i) => (
                <motion.div
                  key={benefit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl p-6 border-2 transition-shadow hover:shadow-md"
                  style={{
                    backgroundColor: benefit.bg,
                    borderColor: benefit.border,
                  }}
                >
                  <span className="text-3xl mb-3 block">{benefit.emoji}</span>
                  <h3
                    className="font-display font-bold text-base mb-2"
                    style={{ color: benefit.color }}
                  >
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-[#5a5a5a] leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--navy)] py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[var(--gold)] animate-blob" />
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-[var(--teal)] animate-blob" style={{ animationDelay: "1.5s" }} />
        </div>
        <motion.div
          className="relative z-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-display text-white mb-4">
            Ready to Join Aarambha?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Give your child the best start with our comprehensive programs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/community/form"
              className="bg-[var(--orange)] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#e55a2b] transition-colors shadow-lg"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
