# Aarambha Website Redesign — Premier-Style

**Date:** 2026-03-16
**Approach:** Full rewrite of all pages and design system to match Premier International School's visual aesthetic, adapted for Aarambha's content.

---

## Design Decisions

- **Near-clone** of Premier's design language (navy + gold, serif headlines, editorial feel)
- **Adapted sections** — Premier's visual style with Aarambha's content structure
- **All 7 pages** redesigned (Homepage + 6 inner pages)
- **Unsplash stock photos** for imagery placeholders
- **Full rewrite** — clean slate, no incremental patching

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--navy` | `#003E67` | Primary — headers, buttons, nav, hero overlays |
| `--navy-deep` | `#153658` | Footer background, darker accents |
| `--navy-light` | `#2D6A9F` | Gradients, secondary elements |
| `--gold` | `#F6CE6B` | Primary accent — labels, decorative lines, CTAs |
| `--gold-light` | `#F9DC96` | Soft accent, hover states |
| `--cream` | `#FEF7E6` | Page background |
| `--white` | `#FFFFFF` | Cards, content sections |
| `--charcoal` | `#2C2C2C` | Body text |
| `--muted` | `#666666` | Secondary text, descriptions |

> **Full replacement:** `globals.css` must be fully rewritten. All existing CSS variables (`--orange`, `--teal`, `--purple`, `--primary-blue`, etc.) and utility classes (`.blob`, `.wiggle`, `.bounce-soft`) are deleted. The new file contains only the tokens above.

### Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display/Headlines | DM Serif Display (Google Fonts) | 400 | Page titles, section headings, hero text |
| Body | Plus Jakarta Sans (Google Fonts) | 300-600 | Body text, labels, buttons, navigation |
| Labels | Plus Jakarta Sans | 400-600 | Uppercase, letter-spacing: 2-3px |

**Font loading:** Use `next/font/google` in `layout.tsx` (not CSS `@import`):
```tsx
import { DM_Serif_Display, Plus_Jakarta_Sans } from 'next/font/google';
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-body' });
```

**Type scale:**

| Element | Size | Line-height |
|---------|------|-------------|
| Hero headline | 48px (3rem) | 1.1 |
| Page/section title (h2) | 36px (2.25rem) | 1.2 |
| Card/subsection title (h3) | 20px (1.25rem) | 1.3 |
| Body text | 16px (1rem) | 1.7 |
| Small body / descriptions | 14px (0.875rem) | 1.6 |
| Labels (uppercase) | 12px (0.75rem) | 1.4 |
| Tiny labels | 11px (0.6875rem) | 1.4 |

### Buttons

- **Primary:** Navy background, white text, pill shape (border-radius: 9999px), padding: 14px 32px
- **Secondary:** Transparent, gold border (2px), white/navy text, pill shape
- **CTA:** Gold background, navy text, pill shape
- **Hover:** Scale 1.06, transition 0.2s ease-in-out

### Cards

- White background, border-radius: 12px
- Image area at top (Unsplash photo or gradient placeholder)
- Small uppercase label (letter-spacing: 2px, gray)
- Serif title (DM Serif Display)
- Body text in Plus Jakarta Sans
- Subtle shadow on hover, slight lift (translateY -2px)

### Animations

- **Fade-up on scroll:** Subtle, 0.6-0.8s, triggered by viewport intersection
- **Staggered reveals:** Cards appear with 0.1s delay between each
- **Hover transitions:** Scale 1.02-1.06, 0.3s ease
- **No bouncing, wiggling, or emoji icons** — refined, restrained motion
- **Logo carousel:** Seamless infinite horizontal scroll (if applicable)
- **Testimonial carousel:** Framer Motion `AnimatePresence` with fade transition. Manual dot navigation (no auto-advance). State-managed active index.

### Decorative Elements

- Gold line divider: 40-60px width, 3px height, `--gold`
- Uppercase labels above section titles
- No emoji icons — use Heroicons (outline style) or simple SVGs

---

## Header Component

- **Top:** Clean white bar, logo left, nav center/right, "Apply Now" pill button right
- **Navigation links:** About, Programs, Admissions, Facilities, Gallery, Contact
- **Style:** Uppercase, letter-spacing 1-2px, font-size 13px
- **Scroll behavior:** Transparent on hero → solid white with subtle shadow on scroll
- **Transparent state on dark heroes:** White logo, white nav links, white hamburger icon. Transitions to navy logo, charcoal links on solid white background after scrolling past hero.
- **Mobile:** Hamburger menu, slide-in panel with staggered link animations, `aria-expanded` on hamburger button
- **Sticky:** Fixed to top on scroll

## Footer Component

- **Background:** Deep navy (`#153658`)
- **Layout:** 5-column grid — Brand, School links, Admissions links, Connect links, Contact info
- **Brand column:** Logo, tagline, social icons (Instagram, Facebook, YouTube, LinkedIn)
- **Link columns:** Gold uppercase label headers, white links
- **Bottom bar:** Copyright, Privacy Policy, Terms — centered, border-top separator

---

## Page Specifications

### Homepage (/)

**9 sections in order:**

1. **Hero Banner**
   - Full-width, background image with navy overlay (rgba(0,62,103,0.7))
   - Gold uppercase label: "Since 2008"
   - Serif headline: "Nurturing Tomorrow's Leaders" (DM Serif Display, ~48px)
   - Subtitle paragraph (16px, white/80% opacity)
   - Two pill buttons: "Apply Now" (gold fill) + "Discover More" (gold border)
   - Scroll indicator at bottom

2. **Intro — "A Place to Belong"**
   - Cream background, centered text
   - Gold decorative line above title
   - Serif section title
   - 2-3 sentence description paragraph

3. **Two-Column: Image + Text**
   - Left: Full-height Unsplash image (students/classroom)
   - Right: Gold label "Our Approach", serif heading "A Nurturing Space for Young Learners", body text, "Learn More →" link
   - White background

4. **Stats Bar**
   - Navy background, 4-column grid
   - Each stat: large serif number in gold + uppercase label in white
   - Stats: K-12 Grade Levels, 15+ Years, 500+ Alumni, 50+ Faculty

5. **Programs Grid — "Our Programs"**
   - Cream background, gold line + serif title centered
   - 4 cards: Early Years, Primary, Middle, High School
   - Each card: image area, "PROGRAM" label, serif title, short description

6. **Why Aarambha**
   - White background, gold line + serif title centered
   - 3 feature blocks: icon in cream circle, serif title, description
   - Features: STEAM Education, Global Exposure, Expert Faculty (use Heroicons)

7. **Testimonial**
   - Navy background, centered
   - Large gold quotation mark
   - Italic serif quote text in white
   - Gold attribution name
   - Dot indicators for carousel

8. **CTA — "Ready to Begin Your Child's Journey?"**
   - Cream background, centered
   - Serif headline, body text, "Inquire Now" gold pill button

9. **Footer** (shared component)

### About Page (/about)

1. **Hero Banner** — Navy overlay, gold label "Our Story", serif title "Where Tradition Meets Innovation"
2. **Mission & Vision** — Two side-by-side cards with gold/navy left borders
3. **Core Values** — 6 values in a 3x2 grid (Curiosity, Integrity, Growth, Respect, Creativity, Resilience), white cards
4. **History Timeline** — Horizontal timeline with year markers (2008, 2012, 2015, 2018, 2021, 2023), gold year numbers, short descriptions
5. **Leadership Team** — 3 cards with photo area, name, role
6. **CTA** — Schedule campus visit

### Programs Page (/programs)

1. **Hero Banner** — Gold label "Academics", title "Learning Journeys for Every Stage"
2. **Program Tabs** — Pill-shaped tab switcher (Pre-School, Primary, Middle, High School). Default active: Pre-School. Uses `role="tablist"` / `role="tab"` / `aria-selected` with keyboard arrow-key navigation. Content swap uses Framer Motion fade (0.3s).
3. **Active Program Detail** — Two-column: image left, details right (title, description, 6 highlight bullets). `role="tabpanel"` with `aria-labelledby`.
4. **Curriculum Subjects** — Grid of 8 subject cards (Math, Science, English, Nepali, Social Studies, CS, Arts & Music, PE)
5. **Extracurricular Activities** — 4 category sections (Sports, Arts, Clubs, Programs)
6. **CTA** — Apply now

### Admissions Page (/admissions)

1. **Hero Banner** — Gold label "Join Us", title "Begin Your Journey With Us", live status badge "Admissions Open 2026-27"
2. **Admission Process** — 5 horizontal steps with numbered circles (Apply → Assess → Interview → Decision → Enroll)
3. **Requirements** — Two cards side-by-side: documents needed + eligibility criteria
4. **Fee Structure** — 4 cards with gold top border: Pre-School (NPR 1.2L), Primary (1.5L), Middle (1.8L), High (2.2L), each with included items
5. **FAQ** — Expandable accordion using `<button>` triggers with `aria-expanded` and `aria-controls`. Framer Motion `AnimatePresence` for expand/collapse. 4-6 questions.
6. **CTA** — Contact for admissions inquiry

### Facilities Page (/facilities)

1. **Hero Banner** — Gold label "Campus", title "A Space Designed for Discovery"
2. **Facilities Grid** — 3x3 grid of 9 facility cards (Smart Classrooms, Innovation Lab, Science Labs, Library, Computer Lab, Art & Music, Sports Complex, Cafeteria, Auditorium)
3. **Campus Overview** — Navy background, two-column: stats left (2 acres, 50+ classrooms, 5 labs, 1000+ capacity) + description right
4. **Safety & Security** — Grid of 8 safety measures with checkmark icons
5. **CTA** — Schedule campus tour

### Gallery Page (/gallery)

1. **Hero Banner** — Gold label "Life at Aarambha", title "Gallery"
2. **Category Filters** — Pill buttons: All, Campus, Classrooms, Events, Sports, Labs
3. **Photo Grid** — CSS `columns-3` (md: columns-2, sm: columns-1) layout with Unsplash stock photos, hover overlay with category tag. Not true masonry — use CSS columns for simplicity.
4. **Video Section** — Navy background, 3 video placeholder cards with play button overlay (Campus Tour, A Day at Aarambha, Student Testimonials)
5. **CTA** — Visit us / Apply

### Contact Page (/contact)

1. **Hero Banner** — Gold label "Reach Out", title "Get in Touch"
2. **Two-Column Layout:**
   - Left: Contact form (name, email, phone, subject dropdown, message textarea, submit button)
   - Right: 4 info cards (Address, Phone, Email, Office Hours) + Google Maps embed
3. **Social Links** — Row of social media buttons
4. **CTA** — WhatsApp quick contact option

---

## Responsive Behavior

| Section | Desktop (lg) | Tablet (md) | Mobile (sm) |
|---------|-------------|-------------|-------------|
| Header nav | Horizontal links | Horizontal links | Hamburger menu |
| Hero | Full-width, 100vh | Full-width, 80vh | Full-width, 70vh, smaller text |
| Two-column (Image+Text) | Side-by-side | Side-by-side | Stacked (image top) |
| Stats bar | 4 columns | 2x2 grid | 2x2 grid |
| Program cards | 4 columns | 2 columns | 1 column |
| Why Aarambha features | 3 columns | 3 columns | 1 column |
| Facilities grid | 3 columns | 2 columns | 1 column |
| Admissions steps | 5 horizontal | 5 horizontal | Vertical stack |
| Footer | 5 columns | 2 columns + full-width brand | Single column stacked |
| Gallery grid | 3 CSS columns | 2 CSS columns | 1 CSS column |
| Contact layout | 2 columns | 2 columns | Stacked (form top) |
| Timeline | Horizontal | Horizontal scroll | Vertical stack |

---

## Technical Notes

- **Framework:** Next.js 15, App Router, TypeScript
- **Styling:** Tailwind CSS v4 with CSS variables in globals.css
- **Animation:** Framer Motion for scroll-triggered animations, hover states, page transitions
- **Icons:** @heroicons/react (outline style)
- **Images:** Unsplash stock photos via next/image. Add to `next.config.ts`:
  ```ts
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  ```
- **Fonts:** `next/font/google` — DM Serif Display + Plus Jakarta Sans (loaded in layout.tsx via font variables)
- **Responsive:** Mobile-first, breakpoints at sm (640px), md (768px), lg (1024px)
- **Components:** Header.tsx and Footer.tsx as shared components
- **Google Maps:** Use `<iframe>` embed (no API key needed) for contact page
- **Accessibility:** All interactive components follow WAI-ARIA authoring practices. Keyboard navigable tabs, accordions, and carousels.
