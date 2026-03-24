# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Architecture

**Framework:** Next.js 15 with App Router, TypeScript, Tailwind CSS v4

**Key Dependencies:**
- `framer-motion` - Page animations and micro-interactions
- `@heroicons/react` - Icon library

**Directory Structure:**
```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Homepage
│   ├── about/page.tsx     # About page
│   ├── programs/page.tsx  # Academic programs
│   ├── admissions/page.tsx # Admissions info
│   ├── facilities/page.tsx # Campus facilities
│   ├── gallery/page.tsx   # Photo gallery
│   ├── contact/page.tsx   # Contact form
│   ├── layout.tsx         # Root layout with Header/Footer
│   └── globals.css        # Design system (CSS variables, animations)
└── components/
    ├── Header.tsx         # Navigation with mobile menu
    └── Footer.tsx         # Site footer
```

**Design System (globals.css):**
- CSS variables for colors: `--orange`, `--teal`, `--purple`, `--yellow`, `--pink`, `--navy`
- Font families: `--font-display` (Baloo 2), `--font-body` (Nunito)
- Animations: `.blob`, `.float`, `.bounce-soft`, `.wiggle`
- Button styles: `.btn-primary`, `.btn-secondary`
- Utility classes: `.text-gradient`, `.glass`, `.pattern-dots`

---

# Project Guidelines

## General Principles

- Think before coding. Understand the problem, clarify ambiguity, then build.
- Prefer the simplest solution that works. Avoid premature abstraction.
- Follow established patterns in the codebase. Don't invent new conventions without reason.
- Write code for humans. Prioritize readability over cleverness.
- Small, focused changes. Each edit should do one thing well.

---

## Code Style

- Use clear, descriptive naming (avoid abbreviations unless universally understood).
- Keep functions short and single-purpose.
- Colocate related code — keep components, styles, and tests near each other.
- Prefer composition over inheritance.
- Handle errors gracefully — never silently swallow exceptions.
- Write self-documenting code; add comments only for _why_, not _what_.

---

## Frontend Architecture

- Component-based architecture with small, focused components.
- Separate UI (presentational) from logic (container/hooks).
- Local state first, global state only when needed.
- Organize files by feature/domain, not by type.
- Mobile-first responsive design.
- Use semantic HTML elements — not `div` for everything.
- All interactive elements must be keyboard-navigable.

---

## Frontend Design Philosophy

Before coding any interface, think through:

1. **Purpose** — What problem does this solve? Who is the user?
2. **Tone** — Commit to a bold, intentional aesthetic direction (e.g., brutally minimal, maximalist, retro-futuristic, organic, luxury, playful, editorial, brutalist, art deco, soft/pastel, industrial). Pick a direction and execute it fully.
3. **Differentiation** — What makes this _memorable_?

### Visual Design Standards

**Typography**

- Choose fonts that are beautiful, unique, and characterful.
- Avoid generic defaults (Inter, Roboto, Arial, system-ui). Pair a distinctive display font with a refined body font.
- Establish a clear type scale and stick to it.

**Color & Theme**

- Commit to a cohesive palette using CSS variables.
- Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- Every project should feel _different_ — vary between light/dark, warm/cool, bold/subtle.

**Motion & Interaction**

- Use animations purposefully for feedback and delight.
- Prioritize CSS-only solutions for HTML; use Framer Motion for React.
- Focus on high-impact moments: staggered page-load reveals, surprising hover states, scroll-triggered animations.

**Spatial Composition**

- Break out of default layouts. Use asymmetry, overlap, diagonal flow, grid-breaking elements.
- Generous negative space OR controlled density — both work when intentional.

**Backgrounds & Atmosphere**

- Create depth rather than defaulting to flat solid colors.
- Consider: gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, grain overlays.

### Anti-Patterns to Avoid

- Generic sans-serif on white background with purple accent (the "AI look").
- Cookie-cutter card layouts with no personality.
- Reusing the same font across every project.
- Timid color choices — if going bold, _go bold_.
- Animations without purpose.

---

## Testing

- Write tests for critical paths and edge cases, not for 100% coverage.
- Unit test pure logic. Integration test API endpoints and user flows.
- Tests should be independent — no shared mutable state.
- Name tests descriptively: `should return 404 when user not found`.

---

## When In Doubt

1. Read the existing code and match its patterns.
2. Prefer boring, proven solutions over novel ones.
3. Ask clarifying questions before making assumptions.
4. Ship something working, then iterate.
