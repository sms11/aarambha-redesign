"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { submitEnquiry } from "@/lib/actions/admission";

const GRADE_OPTIONS = [
  "Nursery", "LKG", "UKG",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
];

function FloatingShape({ color, size, top, left, shape, delay }: {
  color: string; size: number; top: string; left: string; shape: string; delay: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top, left, width: size, height: size }}
      animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {shape === "circle" && (
        <div className="w-full h-full rounded-full opacity-10" style={{ backgroundColor: color }} />
      )}
      {shape === "triangle" && (
        <div className="w-full h-full opacity-10" style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", backgroundColor: color,
        }} />
      )}
      {shape === "star" && (
        <div className="w-full h-full opacity-10" style={{
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          backgroundColor: color,
        }} />
      )}
      {shape === "square" && (
        <div className="w-full h-full rounded-lg opacity-10" style={{ backgroundColor: color, transform: "rotate(15deg)" }} />
      )}
    </motion.div>
  );
}

export default function AdmissionFormClient() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [relation, setRelation] = useState("");
  const [customRelation, setCustomRelation] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const finalRelation = relation === "Other" ? customRelation : relation;
    formData.set("relation", finalRelation);

    const result = await submitEnquiry(formData);

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[var(--navy)] to-[#1a2d4d] pt-32 pb-16 px-6 overflow-hidden">
        <FloatingShape color="#F5A623" size={120} top="10%" left="5%" shape="circle" delay={0} />
        <FloatingShape color="#4ECDC4" size={80} top="60%" left="88%" shape="triangle" delay={1} />
        <FloatingShape color="#A78BFA" size={50} top="20%" left="92%" shape="star" delay={0.5} />
        <FloatingShape color="#FF6B6B" size={70} top="70%" left="8%" shape="square" delay={1.5} />

        <motion.div
          className="max-w-3xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-5xl mb-4">🎓</span>
          <h1 className="text-title font-display text-white">
            Student Enquiry Form
          </h1>
          <p className="text-body text-white/70 mt-3 max-w-xl mx-auto">
            Interested in joining Aarambha? Fill out the form below and
            we&apos;ll get back to you!
          </p>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="relative bg-gradient-to-b from-[#1a2d4d] to-[var(--navy)] py-16 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          {status === "success" ? (
            <motion.div
              className="bg-white rounded-3xl p-12 shadow-2xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CheckCircleIcon className="w-20 h-20 text-[var(--mint)] mx-auto mb-6" />
              <h3 className="text-subtitle font-display text-[var(--navy)] mb-3">
                Thank You!
              </h3>
              <p className="text-body text-[var(--muted)] mb-8">
                Your enquiry has been submitted successfully. We will get back to you soon.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/" className="btn-secondary">
                  Back to Home
                </Link>
                <Link href="/community" className="btn-cta">
                  Explore Admissions
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                style={{ background: "linear-gradient(90deg, var(--gold), var(--coral), var(--mint))" }}
              />

              {status === "error" && (
                <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Student Name */}
                <div>
                  <label htmlFor="studentName" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                    Student&apos;s Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    required
                    placeholder="Enter student's full name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                  />
                </div>

                {/* Age | Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="age" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="age"
                      name="age"
                      required
                      placeholder="e.g. 5 years"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      defaultValue=""
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none appearance-none bg-white"
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Grade Applied | Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="gradeApplied" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                      Grade Applied For <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gradeApplied"
                      name="gradeApplied"
                      required
                      defaultValue=""
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none appearance-none bg-white"
                    >
                      <option value="" disabled>Select grade</option>
                      {GRADE_OPTIONS.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      placeholder="Home address"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Previous School */}
                <div>
                  <label htmlFor="previousSchool" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                    Previous School Name <span className="text-xs font-normal text-gray-400">(if attended)</span>
                  </label>
                  <input
                    type="text"
                    id="previousSchool"
                    name="previousSchool"
                    placeholder="Leave blank if not applicable"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                  />
                </div>

                {/* Guardian Name | Relation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="guardianName" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                      Guardian&apos;s Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="guardianName"
                      name="guardianName"
                      required
                      placeholder="Parent or guardian name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--navy)] mb-2">
                      Relation <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {["Mother", "Father", "Other"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setRelation(opt);
                            if (opt !== "Other") setCustomRelation("");
                          }}
                          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                            relation === opt
                              ? "bg-[var(--gold)] text-white shadow-md"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {relation === "Other" && (
                      <input
                        type="text"
                        value={customRelation}
                        onChange={(e) => setCustomRelation(e.target.value)}
                        placeholder="Please specify"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                      />
                    )}
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-semibold text-[var(--navy)] mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    required
                    placeholder="e.g. 98XXXXXXXX"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/20 focus:outline-none"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full sm:w-auto btn-cta px-10 py-3.5 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    {status === "submitting" ? "Submitting..." : "Submit Enquiry"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
