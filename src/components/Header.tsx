"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <Image
            src="/logo.png"
            alt="Aarambha Sanskar Vidyalaya"
            width={140}
            height={50}
            className={`h-10 w-auto transition-all duration-300 ${
              scrolled ? "" : "brightness-0 invert"
            }`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-label font-body transition-colors duration-300 hover:opacity-80 ${
                scrolled ? "text-[var(--charcoal)]" : "text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Apply Now Button (Desktop) */}
        <div className="hidden lg:block">
          <Link
            href="/admissions"
            className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 ${
              scrolled
                ? "btn-primary"
                : "bg-[var(--gold)] text-[var(--navy)] hover:shadow-lg"
            }`}
          >
            Apply Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <motion.span
            animate={
              mobileMenuOpen
                ? { rotate: 45, y: 6, backgroundColor: "var(--charcoal)" }
                : { rotate: 0, y: 0, backgroundColor: scrolled ? "var(--charcoal)" : "#ffffff" }
            }
            transition={{ duration: 0.3 }}
            className="block w-6 h-0.5 origin-center"
          />
          <motion.span
            animate={
              mobileMenuOpen
                ? { opacity: 0 }
                : { opacity: 1, backgroundColor: scrolled ? "var(--charcoal)" : "#ffffff" }
            }
            transition={{ duration: 0.3 }}
            className="block w-6 h-0.5 origin-center"
          />
          <motion.span
            animate={
              mobileMenuOpen
                ? { rotate: -45, y: -6, backgroundColor: "var(--charcoal)" }
                : { rotate: 0, y: 0, backgroundColor: scrolled ? "var(--charcoal)" : "#ffffff" }
            }
            transition={{ duration: 0.3 }}
            className="block w-6 h-0.5 origin-center"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-30 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-40 lg:hidden shadow-2xl"
            >
              <nav className="flex flex-col px-8 pt-24 pb-8 h-full">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 text-[var(--charcoal)] font-display text-lg border-b border-[var(--cream)] transition-colors hover:text-[var(--navy)]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + navLinks.length * 0.05,
                    duration: 0.3,
                  }}
                  className="mt-8"
                >
                  <Link
                    href="/admissions"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary w-full text-center"
                  >
                    Apply Now
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
