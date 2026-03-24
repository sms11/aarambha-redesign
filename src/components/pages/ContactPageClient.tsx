"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { getIcon } from "@/lib/icons";
import { submitContactForm } from "@/lib/actions/contact";

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

interface ContactInfoItem {
  id: number;
  label: string;
  value: string;
  icon: string;
}

interface SocialLink {
  name: string;
  href: string;
  color: string;
}

export interface ContactPageClientProps {
  contactItems: ContactInfoItem[];
  mapEmbedUrl: string;
  whatsappNumber: string;
  socialLinks: SocialLink[];
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

export default function ContactPageClient({
  contactItems,
  mapEmbedUrl,
  whatsappNumber,
  socialLinks,
}: ContactPageClientProps) {
  return (
    <>
      <HeroSection />
      <WaveDivider color="var(--white)" />
      <FormAndInfoSection contactItems={contactItems} />
      <WaveDivider color="var(--cream)" />
      <MapSection mapEmbedUrl={mapEmbedUrl} />
      <WaveDivider color="var(--navy)" />
      <SocialLinksSection socialLinks={socialLinks} />
      <WaveDivider flip color="var(--navy)" />
      <WhatsAppCTA whatsappNumber={whatsappNumber} />
    </>
  );
}

/* ──────────────────────────────────────────────
   Hero Banner
   ────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center">
      <Image
        src="/images/facilities/beyond-classroom.webp"
        alt="Aarambha School campus"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(19,47,80,0.88)] via-[rgba(30,74,122,0.78)] to-[rgba(19,47,80,0.92)]" />

      {/* Floating decorative shapes */}
      <FloatingShape color="#F5A623" size={90} top="8%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={55} top="18%" left="88%" shape="triangle" delay={1} />
      <FloatingShape color="#FF6B6B" size={40} top="72%" left="8%" shape="star" delay={2} />
      <FloatingShape color="#A78BFA" size={65} top="62%" left="82%" shape="square" delay={0.5} />
      <FloatingShape color="#4EAED8" size={35} top="38%" left="93%" shape="circle" delay={1.5} />
      <FloatingShape color="#FBBF77" size={50} top="75%" left="70%" shape="circle" delay={0.8} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        <motion.span
          className="text-label text-[var(--gold)] inline-flex items-center gap-2 tracking-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SparklesIcon className="w-4 h-4" />
          Reach Out
          <SparklesIcon className="w-4 h-4" />
        </motion.span>

        <motion.h1
          className="text-hero font-display text-white mt-6 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Get in{" "}
          <span className="text-[var(--gold)]">Touch</span>
        </motion.h1>

        <motion.p
          className="text-body text-white/75 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Stay Connected, We&apos;re Here to Help! Whether you have a question
          about admissions, programs, or anything else, our team is ready to help.
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Two-Column: Contact Form + Info Cards
   ────────────────────────────────────────────── */

function FormAndInfoSection({ contactItems }: { contactItems: ContactInfoItem[] }) {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const inputClassName =
    "w-full bg-[var(--cream)] border border-transparent rounded-xl px-5 py-3.5 text-sm text-[var(--charcoal)] placeholder:text-[var(--muted)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all duration-200";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await submitContactForm(formData);

    if (result.success) {
      setFormStatus("success");
      form.reset();
    } else {
      setFormStatus("error");
      setErrorMessage(result.error ?? "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="bg-white py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="5%" left="90%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={45} top="80%" left="3%" shape="triangle" delay={1} />
      <FloatingShape color="#A78BFA" size={35} top="50%" left="95%" shape="star" delay={0.5} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Contact Us</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-2xl mx-auto">
            Fill out the form below and we will get back to you as soon as
            possible, or use our contact details to reach us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left -- Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-[var(--cream)]"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center">
                <PaperAirplaneIcon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-subtitle font-display text-[var(--navy)]">
                Send Us a Message
              </h3>
            </div>

            {formStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <span className="text-5xl block mb-4">🎉</span>
                <h4 className="text-subtitle font-display text-[var(--navy)] mb-2">
                  Thank You!
                </h4>
                <p className="text-body text-[var(--muted)]">
                  We&apos;ve received your message and will get back to you soon.
                </p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="mt-6 text-sm font-semibold text-[var(--gold)] underline underline-offset-2 cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-[var(--charcoal)] mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Your full name"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-[var(--charcoal)] mb-1.5"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    placeholder="+977 ..."
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="purpose"
                    className="block text-sm font-semibold text-[var(--charcoal)] mb-1.5"
                  >
                    Purpose
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    id="purpose"
                    required
                    placeholder="e.g. Admissions, General Inquiry"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-[var(--charcoal)] mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    required
                    placeholder="Your message..."
                    className={inputClassName}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 rounded border-gray-300 accent-[var(--gold)]"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-[var(--muted)]"
                  >
                    I accept the Terms
                  </label>
                </div>

                {formStatus === "error" && (
                  <p className="text-sm text-red-500">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  className="btn-cta w-full mt-2 gap-2 disabled:opacity-60"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                  {formStatus === "submitting" ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right -- Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            {contactItems.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.div
                  key={item.label}
                  className="bg-white rounded-2xl p-6 flex items-start gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[var(--cream)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--gold)", opacity: 0.9 }}
                  >
                    {Icon ? (
                      <Icon className="w-5 h-5 text-white" />
                    ) : (
                      <MapPinIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-display text-[var(--navy)] font-semibold text-lg">
                      {item.label}
                    </p>
                    <p className="text-small text-[var(--muted)] mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Quick contact CTA */}
            <motion.div
              className="bg-gradient-to-br from-[var(--navy)] to-[var(--navy-deep)] rounded-2xl p-6 mt-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h3 className="font-display text-white font-semibold text-lg mb-2">
                Prefer to Talk?
              </h3>
              <p className="text-small text-white/70 mb-4">
                Give us a call or send us a WhatsApp message for a quick response.
              </p>
              <a
                href="tel:+977014547650"
                className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--navy)] px-5 py-2.5 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
              >
                <PhoneIcon className="w-4 h-4" />
                Call Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Google Maps Section
   ────────────────────────────────────────────── */

function MapSection({ mapEmbedUrl }: { mapEmbedUrl: string }) {
  return (
    <section className="bg-[var(--cream)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#FF6B6B" size={50} top="10%" left="5%" shape="triangle" delay={0.5} />
      <FloatingShape color="#4EAED8" size={40} top="80%" left="92%" shape="circle" delay={1} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <SectionLabel>Find Us</SectionLabel>
          <h2 className="text-title font-display text-[var(--navy)]">
            Visit Our Campus
          </h2>
          <p className="text-body text-[var(--muted)] mt-4 max-w-xl mx-auto">
            Located in the heart of Kathmandu, our campus is easily accessible.
            We welcome you to visit and experience the Aarambha difference.
          </p>
        </div>

        <motion.div
          className="rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.1)] border border-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Aarambha location"
          />
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-2 mt-6 text-[var(--muted)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <MapPinIcon className="w-4 h-4 text-[var(--coral)]" />
          <span className="text-small">
            Thamel, Galko Pakha Marga, Kathmandu
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Social Links
   ────────────────────────────────────────────── */

function SocialLinksSection({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <section className="bg-[var(--navy)] py-24 px-6 relative overflow-hidden">
      <FloatingShape color="#F5A623" size={70} top="10%" left="5%" shape="circle" delay={0} />
      <FloatingShape color="#4ECDC4" size={50} top="65%" left="90%" shape="star" delay={1} />
      <FloatingShape color="#A78BFA" size={40} top="80%" left="15%" shape="square" delay={0.5} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <SectionLabel>Stay Connected</SectionLabel>
        <h2 className="text-title font-display text-white mb-4">
          Follow Us Online
        </h2>
        <p className="text-body text-white/60 mb-12 max-w-lg mx-auto">
          Stay updated with the latest news, events, and stories from the
          Aarambha community.
        </p>

        <div className="flex flex-wrap justify-center gap-5">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white/10 backdrop-blur-sm border border-white/10 px-8 py-4 rounded-full text-sm font-semibold text-white hover:text-white transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.06, y: -2 }}
            >
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ backgroundColor: social.color }}
              />
              <span className="relative z-10">{social.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   WhatsApp Floating CTA
   ────────────────────────────────────────────── */

function WhatsAppCTA({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
      <svg
        className="w-7 h-7 text-white relative z-10"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
