"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const steps = [
  { num: 1, title: "Apply", desc: "Submit online application form" },
  { num: 2, title: "Assessment", desc: "Age-appropriate entrance evaluation" },
  { num: 3, title: "Interview", desc: "Parent and student interaction" },
  { num: 4, title: "Decision", desc: "Admission decision communicated" },
  { num: 5, title: "Enrollment", desc: "Complete enrollment formalities" },
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
  { level: "Pre-School", fee: "NPR 1,20,000", items: ["Tuition", "Books & Materials", "Activities", "Snacks"] },
  { level: "Primary", fee: "NPR 1,50,000", items: ["Tuition", "Books & Materials", "Lab Access", "Activities", "Library"] },
  { level: "Middle School", fee: "NPR 1,80,000", items: ["Tuition", "Books & Materials", "Lab Access", "Activities", "Library", "Sports"] },
  { level: "High School", fee: "NPR 2,20,000", items: ["Tuition", "Books & Materials", "Lab Access", "Activities", "Library", "Sports", "Career Counseling"] },
];

const faqs = [
  { q: "When does the academic year begin?", a: "The academic year begins in mid-April and ends in March. Admissions for the new session typically open in January." },
  { q: "Is transportation available?", a: "Yes, we provide bus services covering major routes across Kathmandu valley. Routes and schedules are shared upon enrollment." },
  { q: "What is the student-teacher ratio?", a: "We maintain a ratio of approximately 20:1, ensuring personalized attention for every student." },
  { q: "Are scholarships available?", a: "Yes, merit-based and need-based scholarships are available for students from Grade 1 onwards. Contact admissions for details." },
  { q: "What is the admission timeline?", a: "Applications open in January, assessments in February, interviews in March, and results by late March." },
];

export default function AdmissionsPage() {
  return (
    <>
      <HeroSection />
      <ProcessSection />
      <RequirementsSection />
      <FeeStructureSection />
      <FAQSection />
      <CTASection />
    </>
  );
}

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
      <div className="absolute inset-0 bg-[var(--navy)]/80" />

      <div className="relative z-10 text-center px-6">
        <span className="text-label font-display text-[var(--gold)] tracking-widest">
          Join Us
        </span>
        <h1 className="text-hero font-display text-white mt-4">
          Begin Your Journey With Us
        </h1>
        <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border border-[var(--gold)] bg-[rgba(246,206,107,0.1)]">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-[var(--gold)]">Admissions Open 2026-27</span>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="text-title font-display text-[var(--navy)]">Admission Process</h2>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-0 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.num} className="flex flex-col md:flex-row items-center md:items-start">
            {/* Step */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.num === 5
                    ? "bg-[var(--gold)] text-[var(--navy)]"
                    : "bg-[var(--navy)] text-white"
                }`}
              >
                {step.num}
              </div>
              <h3 className="text-subtitle font-display text-[var(--navy)] mt-3">
                {step.title}
              </h3>
              <p className="text-body text-[var(--muted)] mt-1 max-w-[160px]">
                {step.desc}
              </p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block flex-1 h-0 border-t-2 border-dashed border-[var(--gold)] mt-5 min-w-[40px] mx-2" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RequirementsSection() {
  return (
    <section className="py-20 px-6 bg-[var(--cream)]">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="text-title font-display text-[var(--navy)]">Requirements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Documents Required */}
        <div className="bg-white rounded-xl p-8 border-l-4 border-[var(--gold)]">
          <h3 className="text-subtitle font-display text-[var(--navy)] mb-4">
            Documents Required
          </h3>
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li key={doc} className="flex items-start gap-2 text-body text-[var(--muted)]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-white rounded-xl p-8 border-l-4 border-[var(--navy)]">
          <h3 className="text-subtitle font-display text-[var(--navy)] mb-4">
            Eligibility Criteria
          </h3>
          <ul className="space-y-3">
            {eligibility.map((item) => (
              <li key={item} className="flex items-start gap-2 text-body text-[var(--muted)]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--navy)] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeeStructureSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="text-title font-display text-[var(--navy)]">Fee Structure</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {fees.map((fee) => (
          <div
            key={fee.level}
            className="bg-white rounded-xl p-6 border-t-4 border-[var(--gold)] shadow-sm text-center"
          >
            <h3 className="text-subtitle font-display text-[var(--navy)]">
              {fee.level}
            </h3>
            <p className="text-title font-display text-[var(--gold)] my-3">
              {fee.fee}
            </p>
            <span className="text-small text-[var(--muted)]">/year</span>

            <ul className="text-left mt-4 space-y-2">
              {fee.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-small text-[var(--muted)]">
                  <CheckIcon className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-6 bg-[var(--cream)]">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-4" />
        <h2 className="text-title font-display text-[var(--navy)]">Frequently Asked Questions</h2>
      </div>

      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-xl mb-4 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex justify-between items-center text-left"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-subtitle font-display text-[var(--navy)]">
                {faq.q}
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 text-[var(--navy)] shrink-0 ml-4 transform transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`faq-answer-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-6 pb-4 text-body text-[var(--muted)]">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-6 bg-[var(--navy)] text-center">
      <h2 className="text-title font-display text-white mb-4">Have Questions?</h2>
      <p className="text-body text-white/70 max-w-xl mx-auto mb-8">
        Our admissions team is ready to help you through every step of the process.
        Reach out and we will get back to you promptly.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a href="mailto:info@aarambha.school" className="btn-cta">
          Email Us
        </a>
        <a href="tel:+9779823837865" className="btn-secondary">
          Call Us
        </a>
      </div>
    </section>
  );
}
