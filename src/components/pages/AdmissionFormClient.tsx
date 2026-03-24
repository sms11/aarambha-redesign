"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { submitEnquiry } from "@/lib/actions/admission";

const GRADE_OPTIONS = [
  { value: "Nursery", emoji: "🌱", label: "Nursery" },
  { value: "LKG", emoji: "🌼", label: "LKG" },
  { value: "UKG", emoji: "🌻", label: "UKG" },
  { value: "Grade 1", emoji: "1️⃣", label: "Grade 1" },
  { value: "Grade 2", emoji: "2️⃣", label: "Grade 2" },
  { value: "Grade 3", emoji: "3️⃣", label: "Grade 3" },
  { value: "Grade 4", emoji: "4️⃣", label: "Grade 4" },
  { value: "Grade 5", emoji: "5️⃣", label: "Grade 5" },
  { value: "Grade 6", emoji: "6️⃣", label: "Grade 6" },
  { value: "Grade 7", emoji: "7️⃣", label: "Grade 7" },
  { value: "Grade 8", emoji: "8️⃣", label: "Grade 8" },
  { value: "Grade 9", emoji: "9️⃣", label: "Grade 9" },
  { value: "Grade 10", emoji: "🔟", label: "Grade 10" },
];

const GENDER_OPTIONS = [
  { value: "Male", emoji: "👦", label: "Boy" },
  { value: "Female", emoji: "👧", label: "Girl" },
  { value: "Other", emoji: "🧒", label: "Other" },
];

const RELATION_OPTIONS = [
  { value: "Mother", emoji: "👩", label: "Mother" },
  { value: "Father", emoji: "👨", label: "Father" },
  { value: "Other", emoji: "👤", label: "Other" },
];

function FloatingEmoji({ emoji, size, top, left, delay }: {
  emoji: string; size: number; top: string; left: string; delay: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ top, left, fontSize: size }}
      animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
      transition={{ duration: 5 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="opacity-20">{emoji}</span>
    </motion.div>
  );
}

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <motion.div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i < step ? "bg-[var(--gold)]" : i === step ? "bg-[var(--coral)] w-8" : "bg-gray-200"
          }`}
          style={{ width: i === step ? 32 : i < step ? 24 : 16 }}
          initial={false}
          animate={{ scale: i === step ? 1.1 : 1 }}
        />
      ))}
    </div>
  );
}

export default function AdmissionFormClient() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(0);

  // Form state
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [gradeApplied, setGradeApplied] = useState("");
  const [address, setAddress] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [relation, setRelation] = useState("");
  const [customRelation, setCustomRelation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const STEPS = [
    { title: "About the Student", emoji: "🧒", subtitle: "Tell us about the little learner" },
    { title: "School Details", emoji: "🏫", subtitle: "Which grade are they joining?" },
    { title: "Guardian Info", emoji: "👨‍👩‍👧", subtitle: "How can we reach you?" },
  ];

  function canGoNext(): boolean {
    if (step === 0) return studentName.trim() !== "" && age.trim() !== "" && gender !== "";
    if (step === 1) return gradeApplied !== "" && address.trim() !== "";
    if (step === 2) {
      const hasRelation = relation === "Other" ? customRelation.trim() !== "" : relation !== "";
      return guardianName.trim() !== "" && hasRelation && contactNumber.trim() !== "";
    }
    return false;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData();
    formData.set("studentName", studentName);
    formData.set("age", age);
    formData.set("gender", gender);
    formData.set("gradeApplied", gradeApplied);
    formData.set("address", address);
    formData.set("previousSchool", previousSchool);
    formData.set("guardianName", guardianName);
    formData.set("relation", relation === "Other" ? customRelation : relation);
    formData.set("contactNumber", contactNumber);

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
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[var(--navy)] via-[#1a2d4d] to-[#162340] pt-32 pb-20 px-6 overflow-hidden">
        <FloatingEmoji emoji="📚" size={40} top="10%" left="5%" delay={0} />
        <FloatingEmoji emoji="✏️" size={35} top="20%" left="90%" delay={0.5} />
        <FloatingEmoji emoji="🎨" size={45} top="60%" left="8%" delay={1} />
        <FloatingEmoji emoji="⭐" size={30} top="15%" left="75%" delay={1.5} />
        <FloatingEmoji emoji="🌈" size={38} top="70%" left="88%" delay={2} />
        <FloatingEmoji emoji="🎓" size={42} top="50%" left="3%" delay={0.8} />
        <FloatingEmoji emoji="🔬" size={32} top="80%" left="70%" delay={1.2} />
        <FloatingEmoji emoji="🎵" size={28} top="35%" left="95%" delay={0.3} />

        <motion.div
          className="max-w-2xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-6xl mb-5"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            👋
          </motion.span>
          <h1 className="text-title font-display text-white">
            Join the Aarambha Family!
          </h1>
          <p className="text-lg text-white/60 mt-4 max-w-lg mx-auto leading-relaxed">
            Every great journey starts with a single step. Fill out this quick form
            and we&apos;ll help you take the next one!
          </p>

          {/* Fun stats */}
          <div className="flex justify-center gap-8 mt-8">
            {[
              { emoji: "🎒", label: "3 easy steps" },
              { emoji: "⏱️", label: "Takes 2 minutes" },
              { emoji: "💚", label: "We respond fast" },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-xs text-white/50 mt-1">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="relative bg-gradient-to-b from-[#162340] to-[var(--navy)] py-12 px-6 overflow-hidden -mt-1">
        <div className="max-w-2xl mx-auto relative z-10">
          {status === "success" ? (
            <motion.div
              className="rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="bg-gradient-to-br from-[var(--mint)] to-emerald-400 p-1">
                <div className="bg-white rounded-[22px] p-10 md:p-14 text-center">
                  <motion.div
                    className="text-7xl mb-6"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    🎉
                  </motion.div>
                  <h3 className="text-subtitle font-display text-[var(--navy)] mb-3">
                    You&apos;re All Set!
                  </h3>
                  <p className="text-body text-[var(--muted)] mb-2">
                    We&apos;ve received your enquiry for <strong>{studentName}</strong>.
                  </p>
                  <p className="text-sm text-[var(--muted)] mb-10">
                    Our team will reach out to you at <strong>{contactNumber}</strong> shortly.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--navy)] px-8 py-3 text-sm font-bold text-[var(--navy)] transition-all hover:bg-[var(--navy)] hover:text-white"
                    >
                      ← Back to Home
                    </Link>
                    <Link
                      href="/community"
                      className="inline-flex items-center gap-2 rounded-2xl bg-[var(--gold)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--gold)]/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Explore Our School →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Colorful top bar */}
              <div className="h-2 bg-gradient-to-r from-[var(--gold)] via-[var(--coral)] via-[var(--mint)] to-[var(--lavender)]" />

              <div className="bg-white p-8 md:p-10">
                {/* Step header */}
                <div className="text-center mb-2">
                  <motion.span
                    key={step}
                    className="inline-block text-4xl mb-2"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {STEPS[step].emoji}
                  </motion.span>
                  <h2 className="text-xl font-display font-bold text-[var(--navy)]">
                    {STEPS[step].title}
                  </h2>
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {STEPS[step].subtitle}
                  </p>
                </div>

                <StepIndicator step={step} total={3} />

                {status === "error" && (
                  <motion.div
                    className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>😟</span> {errorMessage}
                  </motion.div>
                )}

                <form ref={formRef} onSubmit={handleSubmit}>
                  {/* Step 1: Student Info */}
                  {step === 0 && (
                    <motion.div
                      key="step0"
                      className="space-y-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Student Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-2">
                          <span>👤</span> Student&apos;s Full Name
                        </label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          required
                          placeholder="What's the student's name?"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10 focus:outline-none"
                        />
                      </div>

                      {/* Age */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-2">
                          <span>🎂</span> Age
                        </label>
                        <input
                          type="text"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                          placeholder="How old are they?"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10 focus:outline-none"
                        />
                      </div>

                      {/* Gender - fun button picker */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-3">
                          <span>✨</span> Gender
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {GENDER_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setGender(opt.value)}
                              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 py-4 px-3 transition-all ${
                                gender === opt.value
                                  ? "border-[var(--gold)] bg-[var(--gold)]/5 shadow-md shadow-[var(--gold)]/10 scale-[1.02]"
                                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                              }`}
                            >
                              <span className="text-2xl">{opt.emoji}</span>
                              <span className={`text-xs font-semibold ${gender === opt.value ? "text-[var(--gold)]" : "text-gray-500"}`}>
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: School Details */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      className="space-y-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Grade - visual grid */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-3">
                          <span>🎓</span> Grade Applied For
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {GRADE_OPTIONS.map((grade) => (
                            <button
                              key={grade.value}
                              type="button"
                              onClick={() => setGradeApplied(grade.value)}
                              className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 px-2 transition-all ${
                                gradeApplied === grade.value
                                  ? "border-[var(--coral)] bg-[var(--coral)]/5 shadow-md shadow-[var(--coral)]/10 scale-[1.03]"
                                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                              }`}
                            >
                              <span className="text-lg">{grade.emoji}</span>
                              <span className={`text-[10px] font-bold ${gradeApplied === grade.value ? "text-[var(--coral)]" : "text-gray-500"}`}>
                                {grade.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-2">
                          <span>🏠</span> Home Address
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          placeholder="Where does the family live?"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10 focus:outline-none"
                        />
                      </div>

                      {/* Previous School */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-2">
                          <span>🏫</span> Previous School
                          <span className="text-xs font-normal text-gray-400 ml-1">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={previousSchool}
                          onChange={(e) => setPreviousSchool(e.target.value)}
                          placeholder="Skip if this is their first school"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10 focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Guardian Info */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      className="space-y-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      {/* Guardian Name */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-2">
                          <span>👨‍👩‍👧</span> Guardian&apos;s Name
                        </label>
                        <input
                          type="text"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          required
                          placeholder="Parent or guardian's full name"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10 focus:outline-none"
                        />
                      </div>

                      {/* Relation - fun button picker */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-3">
                          <span>💛</span> Relation to Student
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {RELATION_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => {
                                setRelation(opt.value);
                                if (opt.value !== "Other") setCustomRelation("");
                              }}
                              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 py-4 px-3 transition-all ${
                                relation === opt.value
                                  ? "border-[var(--mint)] bg-[var(--mint)]/5 shadow-md shadow-[var(--mint)]/10 scale-[1.02]"
                                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-white"
                              }`}
                            >
                              <span className="text-2xl">{opt.emoji}</span>
                              <span className={`text-xs font-semibold ${relation === opt.value ? "text-[var(--mint)]" : "text-gray-500"}`}>
                                {opt.label}
                              </span>
                            </button>
                          ))}
                        </div>
                        {relation === "Other" && (
                          <motion.input
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            type="text"
                            value={customRelation}
                            onChange={(e) => setCustomRelation(e.target.value)}
                            placeholder="Please specify the relation"
                            className="mt-3 w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--mint)] focus:bg-white focus:ring-4 focus:ring-[var(--mint)]/10 focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Contact Number */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--navy)] mb-2">
                          <span>📱</span> Contact Number
                        </label>
                        <input
                          type="tel"
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          required
                          placeholder="Your phone number"
                          className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[var(--navy)] placeholder:text-gray-400 transition-all focus:border-[var(--gold)] focus:bg-white focus:ring-4 focus:ring-[var(--gold)]/10 focus:outline-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 hover:text-[var(--navy)]"
                      >
                        ← Back
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 2 ? (
                      <button
                        type="button"
                        onClick={() => canGoNext() && setStep(step + 1)}
                        disabled={!canGoNext()}
                        className="flex items-center gap-2 rounded-2xl bg-[var(--gold)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--gold)]/25 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
                      >
                        Next Step →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!canGoNext() || status === "submitting"}
                        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--coral)] to-[var(--gold)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--coral)]/25 transition-all hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
                      >
                        {status === "submitting" ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⏳
                            </motion.span>
                            Submitting...
                          </>
                        ) : (
                          <>Submit Enquiry 🚀</>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
