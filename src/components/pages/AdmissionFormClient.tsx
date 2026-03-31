"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import ReCaptchaWidget from "@/components/ReCaptcha";
import { submitEnquiry } from "@/lib/actions/admission";

const GRADE_OPTIONS = [
  "Nursery", "LKG", "UKG",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
];

const inputClass =
  "w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-[#1B2A4A] placeholder:text-gray-400 outline-none transition-all focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/15";

const labelClass = "block text-sm font-semibold text-[#1B2A4A] mb-1.5";

export default function AdmissionFormClient() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [gradeApplied, setGradeApplied] = useState("");
  const [address, setAddress] = useState("");
  const [previousSchool, setPreviousSchool] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [relation, setRelation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA>(null);

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
    formData.set("relation", relation);
    formData.set("contactNumber", contactNumber);
    formData.set("recaptchaToken", captchaToken || "");

    const result = await submitEnquiry(formData);

    if (result.success) {
      setStatus("success");
      captchaRef.current?.reset();
      setCaptchaToken(null);
    } else {
      setStatus("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
      captchaRef.current?.reset();
      setCaptchaToken(null);
    }
  }

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
            Begin Your Journey
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-white mb-6">
            Admission Enquiry
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Take the first step towards a brighter future. Fill out the form below and our team will get in touch.
          </p>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="bg-[#f9f8f6] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {status === "success" ? (
            <motion.div
              className="max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 md:p-16">
                <div className="w-20 h-20 rounded-full bg-[#e8f5e9] mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#2e7d32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1B2A4A] mb-3">
                  Enquiry Submitted Successfully
                </h2>
                <p className="text-[#5a5a5a] mb-2">
                  We have received your admission enquiry for <strong className="text-[#1B2A4A]">{studentName}</strong>.
                </p>
                <p className="text-sm text-[#5a5a5a] mb-10">
                  Our admissions team will contact you at <strong className="text-[#1B2A4A]">{contactNumber}</strong> within 24-48 hours.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[#1B2A4A] px-7 py-3 text-sm font-semibold text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white transition-colors"
                  >
                    Back to Home
                  </Link>
                  <Link
                    href="/programs"
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF6B35] px-7 py-3 text-sm font-semibold text-white hover:bg-[#e55a2b] transition-colors shadow-md"
                  >
                    Explore Programs
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#FF6B35] via-[#14B8A6] to-[#1B2A4A]" />

                  <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                    <h2 className="text-xl font-display font-bold text-[#1B2A4A] mb-1">
                      Student Enquiry Form
                    </h2>
                    <p className="text-sm text-[#5a5a5a] mb-8">
                      Fields marked with <span className="text-red-500">*</span> are required.
                    </p>

                    {status === "error" && (
                      <motion.div
                        className="mb-6 rounded-xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errorMessage}
                      </motion.div>
                    )}

                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                      {/* Section: Student Information */}
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                          </div>
                          <h3 className="text-base font-bold text-[#1B2A4A]">Student Information</h3>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="sm:col-span-2">
                            <label className={labelClass}>
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              required
                              placeholder="Student's full name"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Age <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              required
                              placeholder="e.g. 5 years"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Gender <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                              {["Male", "Female", "Other"].map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setGender(g)}
                                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                                    gender === g
                                      ? "border-[#FF6B35] bg-[#FF6B35]/5 text-[#FF6B35]"
                                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                                  }`}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100" />

                      {/* Section: Academic Details */}
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#14B8A6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                            </svg>
                          </div>
                          <h3 className="text-base font-bold text-[#1B2A4A]">Academic Details</h3>
                        </div>

                        <div className="grid gap-5">
                          <div>
                            <label className={labelClass}>
                              Grade Applied For <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={gradeApplied}
                              onChange={(e) => setGradeApplied(e.target.value)}
                              required
                              className={inputClass + " appearance-none"}
                            >
                              <option value="">Select a grade</option>
                              {GRADE_OPTIONS.map((g) => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelClass}>
                              Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required
                              placeholder="Home address"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Previous School <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <input
                              type="text"
                              value={previousSchool}
                              onChange={(e) => setPreviousSchool(e.target.value)}
                              placeholder="Name of previous school, if any"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100" />

                      {/* Section: Guardian Information */}
                      <div>
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-8 h-8 rounded-lg bg-[#1B2A4A]/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#1B2A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                            </svg>
                          </div>
                          <h3 className="text-base font-bold text-[#1B2A4A]">Guardian Information</h3>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className={labelClass}>
                              Guardian Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={guardianName}
                              onChange={(e) => setGuardianName(e.target.value)}
                              required
                              placeholder="Parent or guardian name"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>
                              Relation <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={relation}
                              onChange={(e) => setRelation(e.target.value)}
                              required
                              className={inputClass + " appearance-none"}
                            >
                              <option value="">Select relation</option>
                              <option value="Mother">Mother</option>
                              <option value="Father">Father</option>
                              <option value="Guardian">Guardian</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelClass}>
                              Contact Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={contactNumber}
                              onChange={(e) => setContactNumber(e.target.value)}
                              required
                              placeholder="Your phone number"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      {/* reCAPTCHA */}
                      <div className="flex justify-center pt-2">
                        <ReCaptchaWidget
                          ref={captchaRef}
                          onChange={(token) => setCaptchaToken(token)}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={status === "submitting" || !captchaToken}
                        className="w-full rounded-xl bg-[#FF6B35] px-8 py-4 text-base font-bold text-white shadow-md hover:bg-[#e55a2b] hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {status === "submitting" ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          "Submit Enquiry"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                className="hidden lg:block space-y-6 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Why Aarambha */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h3 className="text-base font-bold text-[#1B2A4A] mb-4">Why Choose Aarambha?</h3>
                  <div className="space-y-4">
                    {[
                      { icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342", title: "STEAM-Based Curriculum", desc: "Hands-on learning through Science, Technology, Engineering, Arts & Mathematics" },
                      { icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z", title: "Expert Faculty", desc: "Experienced educators committed to nurturing every student" },
                      { icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21", title: "Modern Facilities", desc: "Smart classrooms, labs, library, and sports facilities" },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4.5 h-4.5 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1B2A4A]">{item.title}</p>
                          <p className="text-xs text-[#5a5a5a] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-[#1B2A4A] rounded-2xl p-7 text-white">
                  <h3 className="text-base font-bold mb-4">Admission Process</h3>
                  <div className="space-y-3">
                    {[
                      { step: "1", text: "Submit this enquiry form" },
                      { step: "2", text: "Our team will contact you" },
                      { step: "3", text: "Schedule a campus visit" },
                      { step: "4", text: "Complete the admission" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#FF6B35]">
                          {item.step}
                        </div>
                        <p className="text-sm text-white/80">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                  <h3 className="text-base font-bold text-[#1B2A4A] mb-3">Need Help?</h3>
                  <p className="text-sm text-[#5a5a5a] mb-4">
                    Contact our admissions office for any questions.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B35] hover:underline"
                  >
                    Contact Us
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
