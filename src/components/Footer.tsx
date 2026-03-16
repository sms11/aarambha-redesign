import Link from "next/link";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const schoolLinks = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/facilities", label: "Facilities" },
  { href: "/gallery", label: "Gallery" },
];

const admissionsLinks = [
  { href: "/admissions", label: "Apply Now" },
  { href: "/admissions#process", label: "Process" },
  { href: "/admissions#fees", label: "Fees" },
  { href: "/admissions#faq", label: "FAQ" },
];

const connectLinks = [
  { href: "/contact", label: "Contact" },
  { href: "#", label: "Careers" },
  { href: "#", label: "News" },
  { href: "#", label: "Events" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-label text-[var(--gold)] mb-6">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" />
      </svg>
    ),
    facebook: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
    youtube: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Footer() {
  return (
    <footer className="bg-[var(--navy-deep)] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <h2 className="font-display text-2xl tracking-wide text-white">
                AARAMBHA
              </h2>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Nurturing tomorrow&apos;s leaders since 2008.
            </p>
            <div className="flex gap-3">
              {["instagram", "facebook", "youtube", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
                >
                  <SocialIcon name={social} />
                </a>
              ))}
            </div>
          </div>

          {/* School Links */}
          <LinkColumn title="School" links={schoolLinks} />

          {/* Admissions Links */}
          <LinkColumn title="Admissions" links={admissionsLinks} />

          {/* Connect Links */}
          <LinkColumn title="Connect" links={connectLinks} />

          {/* Contact Column */}
          <div>
            <h3 className="text-label text-[var(--gold)] mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPinIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Pipal Bot, Galko Pakha Marga, Kathmandu</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <PhoneIcon className="w-5 h-5 shrink-0" />
                <a
                  href="tel:+9779823837865"
                  className="hover:text-white transition-colors"
                >
                  +977 9823837865
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <EnvelopeIcon className="w-5 h-5 shrink-0" />
                <a
                  href="mailto:info@aarambha.school"
                  className="hover:text-white transition-colors"
                >
                  info@aarambha.school
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <p>&copy; 2026 Aarambha Sanskar Vidyalaya. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
