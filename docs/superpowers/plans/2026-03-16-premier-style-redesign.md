# Premier-Style Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full rewrite of Aarambha school website to match Premier International School's visual aesthetic — navy+gold palette, serif headlines, editorial layouts, refined animations.

**Architecture:** Rewrite all 12 source files (globals.css, layout.tsx, 2 components, 7 pages, next.config.ts). Each page is a standalone `"use client"` component using Framer Motion. Shared design system via CSS variables in globals.css, fonts via `next/font/google` in layout.tsx. Unsplash stock images via next/image.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, @heroicons/react, next/font/google, next/image

**Spec:** `docs/superpowers/specs/2026-03-16-premier-style-redesign-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `next.config.ts` | Modify | Add Unsplash remote image pattern |
| `src/app/globals.css` | Rewrite | New design system — colors, typography, buttons, cards, animations |
| `src/app/layout.tsx` | Rewrite | Font loading via next/font/google, metadata, Header/Footer |
| `src/components/Header.tsx` | Rewrite | Nav with transparent→solid scroll, mobile menu |
| `src/components/Footer.tsx` | Rewrite | 5-column navy footer |
| `src/app/page.tsx` | Rewrite | Homepage — 8 sections |
| `src/app/about/page.tsx` | Rewrite | About — hero, mission/vision, values, timeline, leadership |
| `src/app/programs/page.tsx` | Rewrite | Programs — tabs, curriculum, extracurriculars |
| `src/app/admissions/page.tsx` | Rewrite | Admissions — process, requirements, fees, FAQ accordion |
| `src/app/facilities/page.tsx` | Rewrite | Facilities — grid, campus overview, safety |
| `src/app/gallery/page.tsx` | Rewrite | Gallery — filters, CSS columns grid, video section |
| `src/app/contact/page.tsx` | Rewrite | Contact — form, info cards, map embed |

---

## Chunk 1: Foundation (Config, Design System, Layout, Shared Components)

### Task 1: Update next.config.ts for Unsplash images

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Read current next.config.ts**

Read `next.config.ts` to understand current configuration.

- [ ] **Step 2: Add images.remotePatterns for Unsplash**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "feat: add Unsplash remote image pattern to next.config"
```

---

### Task 2: Rewrite globals.css — New Design System

**Files:**
- Rewrite: `src/app/globals.css`

- [ ] **Step 1: Rewrite globals.css with new design tokens**

Delete all existing content. Write new file with:

```css
@import "tailwindcss";

/* ============================================
   Aarambha Design System — Premier Style
   ============================================ */

:root {
  /* Colors */
  --navy: #003E67;
  --navy-deep: #153658;
  --navy-light: #2D6A9F;
  --gold: #F6CE6B;
  --gold-light: #F9DC96;
  --cream: #FEF7E6;
  --white: #FFFFFF;
  --charcoal: #2C2C2C;
  --muted: #666666;

}

/* Base */
body {
  font-family: var(--font-display), Georgia, serif; /* fallback until next/font injects --font-body */
  color: var(--charcoal);
  background-color: var(--cream);
}

/* Font classes — --font-display and --font-body are injected by next/font/google in layout.tsx */

/* Type Scale */
.text-hero { font-size: 3rem; line-height: 1.1; }
.text-title { font-size: 2.25rem; line-height: 1.2; }
.text-subtitle { font-size: 1.25rem; line-height: 1.3; }
.text-body { font-size: 1rem; line-height: 1.7; }
.text-small { font-size: 0.875rem; line-height: 1.6; }
.text-label { font-size: 0.75rem; line-height: 1.4; text-transform: uppercase; letter-spacing: 2px; }
.text-tiny { font-size: 0.6875rem; line-height: 1.4; }

.font-display { font-family: var(--font-display), Georgia, serif; }
.font-body { font-family: var(--font-body), system-ui, sans-serif; }

/* NOTE: All existing CSS variables (--orange, --teal, --purple, --primary-blue, etc.)
   and utility classes (.blob, .wiggle, .bounce-soft, @theme inline block) are removed.
   Bare Tailwind color utilities like bg-navy will NOT work.
   Always use arbitrary value syntax: bg-[var(--navy)], text-[var(--gold)], etc. */

/* Buttons */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background-color: var(--navy);
  color: var(--white);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.btn-primary:hover {
  transform: scale(1.06);
  box-shadow: 0 4px 12px rgba(0, 62, 103, 0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
  background-color: transparent;
  border: 2px solid var(--gold);
  color: var(--white);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
}
.btn-secondary:hover {
  transform: scale(1.06);
  background-color: rgba(246, 206, 107, 0.1);
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background-color: var(--gold);
  color: var(--navy);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.btn-cta:hover {
  transform: scale(1.06);
  box-shadow: 0 4px 12px rgba(246, 206, 107, 0.4);
}

/* Cards */
.card {
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Decorative */
.gold-line {
  width: 40px;
  height: 3px;
  background-color: var(--gold);
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--navy-light); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--navy); }

/* Selection */
::selection {
  background-color: var(--gold-light);
  color: var(--navy);
}
```

- [ ] **Step 2: Do NOT commit yet** — globals.css depends on font variables from layout.tsx. Proceed to layout.tsx rewrite next.

---

### Task 3: Rewrite layout.tsx — Font Loading and Metadata (commit together with Task 2)

**Files:**
- Rewrite: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite layout.tsx**

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aarambha Sanskar Vidyalaya — Nurturing Tomorrow's Leaders",
  description:
    "A premier K-12 school in Kathmandu, Nepal. Excellence in education since 2008.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${plusJakarta.variable}`}>
      <body className="font-body antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify fonts load in browser**

Run: `npm run dev` — open http://localhost:3000, check in DevTools that `--font-display` and `--font-body` CSS variables are set on `<html>`.

- [ ] **Step 3: Commit globals.css + layout.tsx together**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: rewrite design system and layout with Premier-style tokens and fonts"
```

---

### Task 4: Rewrite Header Component

**Files:**
- Rewrite: `src/components/Header.tsx`

- [ ] **Step 1: Rewrite Header.tsx**

Full rewrite with:
- `"use client"` directive
- Scroll detection: transparent (white text) at top → solid white (navy text) after 50px scroll
- Desktop: logo left, nav links center, "Apply Now" pill right
- Mobile: hamburger icon, slide-in panel with Framer Motion `AnimatePresence`
- `aria-expanded` on hamburger, body scroll lock when menu open
- Nav links: About, Programs, Admissions, Facilities, Gallery, Contact
- All links use `next/link` with `href`
- Font classes: `font-display` for logo, `text-label` for nav links

Key implementation details:
- `useState` for `scrolled` (boolean) and `mobileMenuOpen` (boolean)
- `useEffect` with scroll listener, threshold 50px
- Conditional classes: when `scrolled` → `bg-white shadow-sm`, text → `text-[var(--charcoal)]`; when not scrolled → `bg-transparent`, text → `text-white`
- Mobile menu: fixed overlay with `bg-white` panel, staggered link animations
- Logo text: "AARAMBHA" in `font-display` with `text-xl font-bold`
- Apply button: `btn-primary` class (navy in scrolled state), gold fill when transparent

- [ ] **Step 2: Verify header renders on homepage**

Open http://localhost:3000. Confirm:
- Header is transparent with white text at top
- Scrolling turns it white with navy text
- Mobile menu opens/closes (resize browser to <1024px)

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: rewrite Header with scroll-aware transparency and mobile menu"
```

---

### Task 5: Rewrite Footer Component

**Files:**
- Rewrite: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer.tsx**

Full rewrite with:
- `"use client"` directive (for Framer Motion if needed, otherwise can be server component)
- Deep navy background (`bg-[var(--navy-deep)]`)
- 5-column grid on desktop: Brand | School | Admissions | Connect | Contact
- Brand column: "AARAMBHA" logo text, tagline, 4 social icons (placeholder `#` links)
- Link columns: gold uppercase label header, white link list
- Contact column: address, phone, email with Heroicons
- Bottom bar: copyright 2026, Privacy Policy, Terms of Service
- Responsive: md → 2 columns, sm → single column stacked

- [ ] **Step 2: Verify footer renders**

Open http://localhost:3000. Scroll to bottom. Confirm 5-column layout on desktop, proper stacking on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: rewrite Footer with 5-column navy layout"
```

---

## Chunk 2: Homepage

### Task 6: Rewrite Homepage

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx with all 8 sections**

`"use client"` component with these sections (each as a `<section>` element):

**Section 1 — Hero:**
- Full viewport height, Unsplash background image via `next/image` with `fill` and `objectFit="cover"`
- Navy overlay via absolute div with `bg-[rgba(0,62,103,0.7)]`
- Centered content: gold label "Since 2008", serif headline "Nurturing Tomorrow's Leaders", subtitle paragraph, two buttons (btn-cta "Apply Now" + btn-secondary "Discover More")
- Responsive height: `min-h-[70vh] md:min-h-[80vh] lg:min-h-screen`
- Scroll indicator at bottom: animated down-chevron (ChevronDownIcon) with Framer Motion bounce
- Framer Motion fade-in on load (initial opacity 0, animate opacity 1, duration 0.8s)
- Unsplash image: `https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&q=80` (school building)

**Section 2 — Intro "A Place to Belong":**
- Cream background, centered, max-w-3xl
- Gold line divider (centered), serif title, body paragraph
- Framer Motion `whileInView` fade-up

**Section 3 — Two-Column Image + Text:**
- CSS grid 2 columns (stacked on mobile)
- Left: Unsplash image via next/image (`https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80` — students learning)
- Right: gold label "Our Approach", serif heading, body text, "Learn More →" link (navy color)
- Framer Motion staggered fade-up

**Section 4 — Stats Bar:**
- Navy background, 4-column grid (2x2 on mobile)
- Stats data array: `[{value: "K-12", label: "Grade Levels"}, {value: "15+", label: "Years"}, {value: "500+", label: "Alumni"}, {value: "50+", label: "Faculty"}]`
- Gold serif numbers, white uppercase labels

**Section 5 — Programs "Our Programs":**
- Cream background, gold line + serif title
- 4 program cards from data array with Unsplash images:
  - Early Years: `https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&q=80`
  - Primary: `https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80`
  - Middle School: `https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80`
  - High School: `https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80`
- Each card uses `.card` class, image area with next/image, "PROGRAM" label, serif title, description
- 4 columns on lg, 2 on md, 1 on sm
- Framer Motion staggered reveal (0.1s delay between cards)

**Section 6 — Why Aarambha:**
- White background, gold line + serif title
- 3 feature blocks from data array, each with:
  - Heroicon in cream circle (BeakerIcon, GlobeAltIcon, AcademicCapIcon)
  - Serif title, body description
- 3 columns on md+, 1 on sm

**Section 7 — Testimonial:**
- Navy background, centered
- `useState` for active testimonial index
- 3 testimonials in data array (quote, name, role)
- Large gold `"` character, italic serif quote, gold attribution
- Dot navigation: 3 dots, active = gold filled, inactive = white/30%
- Framer Motion `AnimatePresence` with fade on index change

**Section 8 — CTA:**
- Cream background, centered
- Serif headline "Ready to Begin Your Child's Journey?"
- Body text, btn-cta "Inquire Now" linking to /contact

- [ ] **Step 2: Verify homepage renders all 8 sections**

Open http://localhost:3000. Scroll through all sections. Confirm:
- Hero image loads from Unsplash
- Stats bar is navy with gold numbers
- Program cards display in grid
- Testimonial dots switch content
- All text uses correct fonts (serif headlines, sans-serif body)

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite homepage with Premier-style 8-section layout"
```

---

## Chunk 3: Inner Pages (About, Programs, Admissions)

### Task 7: Rewrite About Page

**Files:**
- Rewrite: `src/app/about/page.tsx`

- [ ] **Step 1: Rewrite about/page.tsx**

`"use client"` component with sections:

**Hero Banner:**
- Unsplash image: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&q=80`
- Navy overlay, gold label "Our Story", serif title "Where Tradition Meets Innovation"
- Height: `h-[70vh] lg:h-[80vh]`

**Mission & Vision:**
- Two side-by-side cards (grid-cols-2 on md+, stacked on sm)
- Mission card: gold left border (border-l-4 border-[var(--gold)]), serif title, body text
- Vision card: navy left border, serif title, body text

**Core Values:**
- Gold line + serif title centered
- 6 cards in 3x2 grid (2 cols on sm): Curiosity, Integrity, Growth, Respect, Creativity, Resilience
- Each card: white bg, icon (Heroicon), serif title, short description
- Framer Motion staggered reveal

**History Timeline:**
- Gold line + serif title centered
- Desktop: horizontal layout with gold year circles connected by a line
- Mobile: vertical stack
- 6 milestones: 2008 (Founded), 2012 (Expanded to K-8), 2015 (STEAM Program), 2018 (Full K-12), 2021 (New Labs), 2023 (Campus Expansion)
- Each: gold year number, serif event title, body description

**Leadership Team:**
- 3 cards with Unsplash headshot placeholders, serif name, role, short bio
- Grid-cols-3 on lg, 1 on sm

**CTA:**
- "Experience Our Campus", btn-cta "Schedule a Visit" linking to /contact

- [ ] **Step 2: Verify about page**

Open http://localhost:3000/about. Check all sections render with correct layout and fonts.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: rewrite About page with Premier-style layout"
```

---

### Task 8: Rewrite Programs Page

**Files:**
- Rewrite: `src/app/programs/page.tsx`

- [ ] **Step 1: Rewrite programs/page.tsx**

`"use client"` component with sections:

**Hero Banner:**
- Unsplash image: `https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80`
- Gold label "Academics", serif title "Learning Journeys for Every Stage"

**Program Tabs:**
- `useState` for `activeTab` (default: 0)
- Tab buttons in a flex row with pill shape: active = navy bg + white text, inactive = white bg + gray text + border
- `role="tablist"` on container, `role="tab"` on each button, `aria-selected` matches active state
- Keyboard navigation: left/right arrow keys cycle tabs
- Data array for 4 programs, each with: id, name, description, highlights (6 items), Unsplash image URL

**Active Program Detail:**
- `role="tabpanel"` with `aria-labelledby` matching active tab id
- Two-column: image left (next/image), details right (serif title, body description, 6 highlight bullets with gold checkmarks)
- Framer Motion fade on tab change (AnimatePresence, key = activeTab)

**Curriculum Subjects:**
- Gold line + serif title
- 8 cards in 4-col grid (2 on sm): Mathematics, Science, English, Nepali, Social Studies, Computer Science, Arts & Music, Physical Education
- Each card: white bg, Heroicon, serif subject name

**Extracurricular Activities:**
- 4 categories in 2x2 grid: Sports, Arts, Clubs, Programs
- Each category: serif title, list of 4-5 activities

**CTA:**
- "Start Your Application", btn-cta "Apply Now" → /admissions

- [ ] **Step 2: Verify programs page**

Open http://localhost:3000/programs. Check:
- Tab switching works with click and arrow keys
- Content area updates with animation
- Responsive layout collapses correctly

- [ ] **Step 3: Commit**

```bash
git add src/app/programs/page.tsx
git commit -m "feat: rewrite Programs page with accessible tabs and curriculum grid"
```

---

### Task 9: Rewrite Admissions Page

**Files:**
- Rewrite: `src/app/admissions/page.tsx`

- [ ] **Step 1: Rewrite admissions/page.tsx**

`"use client"` component with sections:

**Hero Banner:**
- Unsplash image: `https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80`
- Gold label "Join Us", serif title "Begin Your Journey With Us"
- Status badge: pill with gold border + text "Admissions Open 2026-27" with pulsing green dot

**Admission Process:**
- 5 steps in horizontal flex (vertical on mobile)
- Each step: numbered circle (navy bg, white text; last one gold bg), serif label, body description
- Connecting lines between circles on desktop (gold hr or border)

**Requirements:**
- Two cards side-by-side (stacked on mobile)
- Card 1 "Documents Required": bulleted list (birth certificate, previous report cards, passport photos, transfer certificate)
- Card 2 "Eligibility": bulleted list (age criteria per grade, entrance assessment, parent interview)
- Gold left border on each card

**Fee Structure:**
- 4 cards with gold top border (border-t-4)
- Grid-cols-4 on lg, 2 on md, 1 on sm
- Each card: serif grade level, gold price (NPR 1,20,000 / 1,50,000 / 1,80,000 / 2,20,000), "/year", included items list (tuition, books, activities, lab access, library)

**FAQ Accordion:**
- Gold line + serif title "Frequently Asked Questions"
- `useState` for `openIndex` (number | null)
- 5 questions with `<button>` triggers
- `aria-expanded`, `aria-controls` on button; `id` on answer panel
- Framer Motion `AnimatePresence` for expand/collapse (height animation)
- ChevronDownIcon rotates 180deg when open
- Questions: academic year dates, transportation, student-teacher ratio, scholarships, admission timeline

**CTA:**
- Navy background, serif title "Have Questions?", body text, two buttons: btn-cta "Email Us" (mailto:) + btn-secondary "Call Us" (tel:)

- [ ] **Step 2: Verify admissions page**

Open http://localhost:3000/admissions. Check:
- FAQ accordion opens/closes with animation
- Process steps display correctly
- Fee cards show proper formatting

- [ ] **Step 3: Commit**

```bash
git add src/app/admissions/page.tsx
git commit -m "feat: rewrite Admissions page with process steps and FAQ accordion"
```

---

## Chunk 4: Inner Pages (Facilities, Gallery, Contact) + Build Verification

### Task 10: Rewrite Facilities Page

**Files:**
- Rewrite: `src/app/facilities/page.tsx`

- [ ] **Step 1: Rewrite facilities/page.tsx**

`"use client"` component with sections:

**Hero Banner:**
- Unsplash image: `https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=80`
- Gold label "Campus", serif title "A Space Designed for Discovery"

**Facilities Grid:**
- 9 facility cards in 3x3 grid (2 on md, 1 on sm)
- Data array with: name, description, Heroicon, Unsplash image URL
- Facilities: Smart Classrooms, Innovation Lab, Science Labs, Library, Computer Lab, Art & Music Studio, Sports Complex, Cafeteria, Auditorium
- Each card: `.card` class, image area with next/image, serif title, body description
- Framer Motion staggered reveal

**Campus Overview:**
- Navy background, two-column (stacked on mobile)
- Left: serif title "Our Campus", 4 stat blocks in 2x2 grid (2 Acres, 50+ Classrooms, 5 Labs, 1000+ Capacity) — gold numbers, white labels
- Right: body description of campus

**Safety & Security:**
- Cream background, gold line + serif title
- 8 items in 4x2 grid (2 cols on sm): CCTV Surveillance, Trained Security Personnel, Fire Safety Systems, First Aid Stations, Child-Safe Infrastructure, Evacuation Plans, Secure Entry Points, Regular Safety Drills
- Each: CheckBadgeIcon in gold, serif item name

**CTA:**
- "See It for Yourself", btn-cta "Schedule a Campus Tour" → /contact

- [ ] **Step 2: Verify facilities page**

Open http://localhost:3000/facilities. Check 9 facility cards, navy stats section, safety grid.

- [ ] **Step 3: Commit**

```bash
git add src/app/facilities/page.tsx
git commit -m "feat: rewrite Facilities page with grid and campus overview"
```

---

### Task 11: Rewrite Gallery Page

**Files:**
- Rewrite: `src/app/gallery/page.tsx`

- [ ] **Step 1: Rewrite gallery/page.tsx**

`"use client"` component with sections:

**Hero Banner:**
- Unsplash image: `https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1920&q=80`
- Gold label "Life at Aarambha", serif title "Gallery"

**Category Filters:**
- `useState` for `activeFilter` (default: "All")
- Pill buttons: All, Campus, Classrooms, Events, Sports, Labs
- Active = navy bg + white text, inactive = white bg + muted text + border
- `aria-pressed` on each button

**Photo Grid:**
- Data array of 12 gallery items, each with: src (Unsplash URL), alt, category
- Filter logic: show all when "All", else filter by category
- CSS columns layout: `columns-1 sm:columns-2 lg:columns-3 gap-4`
- Each item: `break-inside-avoid mb-4`, next/image with rounded corners
- Hover overlay: absolute div with navy bg at 60% opacity, category label in gold
- Framer Motion `AnimatePresence` + `layout` for smooth filter transitions

Unsplash images (use education/school themed):
- Campus: 3 images (buildings, grounds, entrance)
- Classrooms: 2 images (students in class)
- Events: 3 images (ceremonies, celebrations)
- Sports: 2 images (playground, sports)
- Labs: 2 images (science lab, computer lab)

**Video Section:**
- Navy background, serif title "Video Gallery"
- 3 cards: Campus Tour, A Day at Aarambha, Student Testimonials
- Each card: dark bg with play button icon (PlayCircleIcon), serif title below
- Cards are non-functional placeholders (no actual video embed)

**CTA:**
- "Want to See More?", btn-cta "Schedule a Visit" → /contact, btn-secondary "Apply Now" → /admissions

- [ ] **Step 2: Verify gallery page**

Open http://localhost:3000/gallery. Check:
- Filter pills toggle and re-filter the grid
- CSS columns layout works (no masonry JS needed)
- Hover overlay appears on images

- [ ] **Step 3: Commit**

```bash
git add src/app/gallery/page.tsx
git commit -m "feat: rewrite Gallery page with filterable CSS columns grid"
```

---

### Task 12: Rewrite Contact Page

**Files:**
- Rewrite: `src/app/contact/page.tsx`

- [ ] **Step 1: Rewrite contact/page.tsx**

`"use client"` component with sections:

**Hero Banner:**
- Unsplash image: `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1920&q=80`
- Gold label "Reach Out", serif title "Get in Touch"

**Two-Column Layout (stacked on mobile):**

Left — Contact Form:
- White card with padding
- Serif title "Send Us a Message"
- Fields: Full Name (text), Email (email), Phone (tel), Subject (select: General Inquiry, Admissions, Programs, Campus Tour, Fee Information, Other), Message (textarea)
- Each input: cream bg, rounded-lg, proper `name`, `id`, `label` elements
- Submit: btn-primary "Send Message"
- `onSubmit` handler: `e.preventDefault()`, alert("Thank you! We'll get back to you soon.")

Right — Info + Map:
- 4 info cards stacked: Address (MapPinIcon), Phone (PhoneIcon), Email (EnvelopeIcon), Office Hours (ClockIcon)
- Each card: white bg, Heroicon in gold, serif label, body value
- Google Maps iframe embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8!2d85.3!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAwLjAiTiA4NcKwMTgnMDAuMCJF!5e0!3m2!1sen!2snp!4v1" width="100%" height="250" style="border:0; border-radius: 12px;" allowfullscreen loading="lazy">`

**Social Links:**
- Centered row of 4 pill buttons: Facebook, Instagram, YouTube, LinkedIn
- Each: icon + text, white bg, navy text, hover scale

**WhatsApp CTA:**
- Fixed bottom-right button (green bg, WhatsApp icon placeholder, pulsing ring animation)
- Links to `https://wa.me/9779823837865`

- [ ] **Step 2: Verify contact page**

Open http://localhost:3000/contact. Check form renders, info cards display, map loads.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: rewrite Contact page with form, info cards, and map embed"
```

---

### Task 13: Build Verification and Final Commit

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors. Warnings about missing images are acceptable.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No errors. Fix any issues found.

- [ ] **Step 3: Visual verification**

Run: `npm run dev`
Open http://localhost:3000 and manually navigate every page:
- / (homepage) — all 8 sections
- /about — hero, mission/vision, values, timeline, leadership
- /programs — tabs switch content, curriculum grid
- /admissions — process steps, fee cards, FAQ accordion
- /facilities — 9 facility cards, stats, safety
- /gallery — filters work, columns layout
- /contact — form, info cards, map

Confirm:
- Navy + gold color scheme throughout
- DM Serif Display for all headlines
- Plus Jakarta Sans for body text
- Responsive: resize to mobile width, check all pages stack correctly
- Header: transparent → white on scroll on every page
- Footer: 5-column layout visible on every page

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address build and lint issues from Premier-style redesign"
```
