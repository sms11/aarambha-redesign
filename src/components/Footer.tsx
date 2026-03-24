import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const schoolLinks = [
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Academic Excellence" },
  { href: "/facilities", label: "Facilities & Environment" },
  { href: "/gallery", label: "Gallery" },
];

const communityLinks = [
  { href: "/community", label: "Community" },
  { href: "/community/form", label: "Admissions Form" },
  { href: "/about#team", label: "Team Aarambha" },
  { href: "/contact", label: "Contact" },
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
    tiktok: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.6 5.82C15.9166 5.03953 15.5399 4.0374 15.54 3H12.45V15.4C12.4267 16.0712 12.1435 16.7071 11.6603 17.1735C11.1771 17.6399 10.5316 17.9004 9.86 17.9C8.44 17.9 7.26 16.74 7.26 15.3C7.26 13.58 8.92 12.29 10.63 12.82V9.66C7.18 9.2 4.16 11.88 4.16 15.3C4.16 18.63 6.92 21 9.85 21C12.99 21 15.54 18.45 15.54 15.3V9.01C16.793 9.90985 18.2974 10.3926 19.84 10.39V7.3C19.84 7.3 17.96 7.39 16.6 5.82Z" />
      </svg>
    ),
  };
  return icons[name] || null;
}

interface FooterProps {
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

export default function Footer({ socialLinks }: FooterProps) {
  const socials = [
    { name: "facebook" as const, href: socialLinks.facebook },
    { name: "instagram" as const, href: socialLinks.instagram },
    { name: "tiktok" as const, href: socialLinks.tiktok },
  ].filter((s) => s.href);
  return (
    <footer className="bg-[var(--navy-deep)] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="Aarambha Sanskar Vidyalaya"
                width={72}
                height={72}
                className="h-18 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Where Eastern Values Meet 21st-Century Innovation to Shape Future-Ready Leaders.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          </div>

          {/* School Links */}
          <LinkColumn title="School" links={schoolLinks} />

          {/* Community Links */}
          <LinkColumn title="Community" links={communityLinks} />

          {/* Contact Column */}
          <div>
            <h3 className="text-label text-[var(--gold)] mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 text-sm">
                <MapPinIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Thamel, Galko Pakha Marga, Kathmandu</span>
              </li>
              <li className="flex items-center gap-3 text-white/70 text-sm">
                <PhoneIcon className="w-5 h-5 shrink-0" />
                <a
                  href="tel:+977014547650"
                  className="hover:text-white transition-colors"
                >
                  014547650
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
          <p>&copy; {new Date().getFullYear()} Aarambha Sanskar Vidyalaya. All rights reserved.</p>
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
