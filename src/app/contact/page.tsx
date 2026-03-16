"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const contactInfo = [
  {
    icon: MapPinIcon,
    label: "Address",
    value: "Pipal Bot, Galko Pakha Marga, Kathmandu, Nepal",
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: "+977 9823837865",
  },
  {
    icon: EnvelopeIcon,
    label: "Email",
    value: "info@aarambha.school",
  },
  {
    icon: ClockIcon,
    label: "Office Hours",
    value: "Sunday - Friday: 7:00 AM - 4:00 PM",
  },
];

const socialLinks = [
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "YouTube", href: "#" },
  { name: "LinkedIn", href: "#" },
];

export default function ContactPage() {
  return (
    <>
      <HeroSection />
      <FormAndInfoSection />
      <SocialLinksSection />
      <WhatsAppCTA />
    </>
  );
}

/* ------------------------------------------------
   Hero Banner
   ------------------------------------------------ */
function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=80"
        alt="Person working on laptop"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-[var(--navy)]/80" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center px-6"
      >
        <span className="text-label font-semibold text-[var(--gold)] tracking-widest mb-4 block">
          Reach Out
        </span>
        <h1 className="text-hero font-display text-white">Get in Touch</h1>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------
   Two-Column: Contact Form + Info Cards / Map
   ------------------------------------------------ */
function FormAndInfoSection() {
  const inputClassName =
    "w-full bg-[var(--cream)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]";

  return (
    <section className="py-20 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left -- Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl p-8"
        >
          <h2 className="text-subtitle font-display text-[var(--navy)] mb-6">
            Send Us a Message
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! We'll get back to you soon.");
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[var(--charcoal)] mb-1"
              >
                Full Name
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
                htmlFor="email"
                className="block text-sm font-semibold text-[var(--charcoal)] mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="your@email.com"
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-[var(--charcoal)] mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="+977 ..."
                className={inputClassName}
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-[var(--charcoal)] mb-1"
              >
                Subject
              </label>
              <select
                name="subject"
                id="subject"
                className={inputClassName}
              >
                <option value="">Select a subject</option>
                <option>General Inquiry</option>
                <option>Admissions</option>
                <option>Programs</option>
                <option>Campus Tour</option>
                <option>Fee Information</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-[var(--charcoal)] mb-1"
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

            <button type="submit" className="btn-primary w-full mt-2">
              Send Message
            </button>
          </form>
        </motion.div>

        {/* Right -- Info Cards + Map */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="bg-white rounded-xl p-5 flex items-start gap-4"
                >
                  <Icon className="w-6 h-6 text-[var(--gold)] flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-display text-[var(--navy)] font-semibold">
                      {item.label}
                    </p>
                    <p className="text-small text-[var(--muted)]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8!2d85.3!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAwLjAiTiA4NcKwMTgnMDAuMCJF!5e0!3m2!1sen!2snp!4v1"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: "12px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Aarambha location"
            className="mt-6"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------
   Social Links
   ------------------------------------------------ */
function SocialLinksSection() {
  return (
    <section className="py-12 px-6 text-center">
      <h2 className="text-subtitle font-display text-[var(--navy)] mb-6">
        Follow Us
      </h2>
      <div className="flex justify-center gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            className="bg-white px-5 py-3 rounded-full text-sm font-semibold text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white transition-all"
          >
            {social.name}
          </a>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------
   WhatsApp Floating CTA
   ------------------------------------------------ */
function WhatsAppCTA() {
  return (
    <a
      href="https://wa.me/9779823837865"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative"
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
