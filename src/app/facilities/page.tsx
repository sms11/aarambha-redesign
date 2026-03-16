"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ComputerDesktopIcon,
  CpuChipIcon,
  BeakerIcon,
  BookOpenIcon,
  MusicalNoteIcon,
  TrophyIcon,
  CakeIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const facilities = [
  {
    name: "Smart Classrooms",
    desc: "Interactive whiteboards and digital learning tools in every classroom.",
    icon: ComputerDesktopIcon,
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
  },
  {
    name: "Innovation Lab",
    desc: "Dedicated STEAM space for robotics, coding, and hands-on projects.",
    icon: CpuChipIcon,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80",
  },
  {
    name: "Science Labs",
    desc: "Fully equipped physics, chemistry, and biology laboratories.",
    icon: BeakerIcon,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
  },
  {
    name: "Library",
    desc: "Over 10,000 books with a dedicated digital resource center.",
    icon: BookOpenIcon,
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
  },
  {
    name: "Computer Lab",
    desc: "Modern workstations with high-speed internet and latest software.",
    icon: ComputerDesktopIcon,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
  },
  {
    name: "Art & Music Studio",
    desc: "Creative spaces for visual arts, music practice, and performances.",
    icon: MusicalNoteIcon,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
  },
  {
    name: "Sports Complex",
    desc: "Multi-sport facilities including basketball, football, and athletics.",
    icon: TrophyIcon,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
  },
  {
    name: "Cafeteria",
    desc: "Nutritious meals prepared in a hygienic, spacious dining area.",
    icon: CakeIcon,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&q=80",
  },
  {
    name: "Auditorium",
    desc: "300-seat hall for assemblies, performances, and special events.",
    icon: BuildingLibraryIcon,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
];

const campusStats = [
  { value: "2", label: "Acres" },
  { value: "50+", label: "Classrooms" },
  { value: "5", label: "Laboratories" },
  { value: "1000+", label: "Capacity" },
];

const safetyItems = [
  "CCTV Surveillance",
  "Trained Security Personnel",
  "Fire Safety Systems",
  "First Aid Stations",
  "Child-Safe Infrastructure",
  "Evacuation Plans",
  "Secure Entry Points",
  "Regular Safety Drills",
];

export default function FacilitiesPage() {
  return (
    <>
      <HeroSection />
      <FacilitiesGrid />
      <CampusOverview />
      <SafetySection />
      <CTASection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80"
        alt="School campus facilities"
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
        <span className="text-label text-[var(--gold)] block mb-4">Campus</span>
        <h1 className="text-hero font-display text-white">
          A Space Designed for Discovery
        </h1>
      </motion.div>
    </section>
  );
}

function FacilitiesGrid() {
  return (
    <section className="py-20 px-6 bg-[var(--cream)]">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-6" />
        <h2 className="text-title font-display text-[var(--navy)]">Our Facilities</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {facilities.map((facility, index) => (
          <motion.div
            key={facility.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            <div className="relative h-48">
              <Image
                src={facility.image}
                alt={facility.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <h3 className="text-subtitle font-display text-[var(--navy)] mb-2">
                {facility.name}
              </h3>
              <p className="text-small text-[var(--muted)]">{facility.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CampusOverview() {
  return (
    <section className="py-20 px-6 bg-[var(--navy)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <div>
          <h2 className="text-title font-display text-white mb-8">Our Campus</h2>
          <div className="grid grid-cols-2 gap-6">
            {campusStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-title font-display text-[var(--gold)]">
                  {stat.value}
                </div>
                <div className="text-label text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-body text-white/80 leading-relaxed">
            Our sprawling 2-acre campus in Kathmandu provides a safe, green, and
            stimulating environment for learning. From modern classrooms to expansive
            sports grounds, every space is designed to inspire curiosity and foster
            growth.
          </p>
        </div>
      </div>
    </section>
  );
}

function SafetySection() {
  return (
    <section className="py-20 px-6 bg-[var(--cream)]">
      <div className="text-center mb-12">
        <div className="gold-line mx-auto mb-6" />
        <h2 className="text-title font-display text-[var(--navy)]">Safety &amp; Security</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {safetyItems.map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl p-4 text-center"
          >
            <CheckBadgeIcon className="w-8 h-8 mx-auto mb-3 text-[var(--gold)]" />
            <p className="text-small font-display text-[var(--navy)]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-6 text-center">
      <h2 className="text-title font-display text-[var(--navy)] mb-4">
        See It for Yourself
      </h2>
      <p className="text-body text-[var(--muted)] max-w-xl mx-auto mb-8">
        Photos can only show so much. Schedule a campus tour and experience our
        facilities firsthand.
      </p>
      <Link href="/contact" className="btn-cta">
        Schedule a Campus Tour
      </Link>
    </section>
  );
}
