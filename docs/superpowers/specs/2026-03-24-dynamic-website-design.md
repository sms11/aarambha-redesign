# Dynamic Website — Design Spec

> Make the Aarambha School website dynamic with a custom admin panel, local PostgreSQL database, and MinIO for image storage. Zero visual changes to public pages.

## Goals

1. Replace all hardcoded content with database-backed data
2. Build an admin panel at `/admin` for a single admin user to manage all content
3. Use MinIO for image uploads (S3-compatible, self-hosted)
4. Preserve every existing page design, animation, and URL exactly as-is
5. Seed the database with all current hardcoded content so nothing is lost

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router (existing) |
| ORM | Prisma |
| Database | Local PostgreSQL |
| File Storage | MinIO (S3-compatible) |
| Auth | Cookie-based JWT (jose) + bcrypt |
| Admin UI | Tailwind CSS (existing, no new UI library) |
| Mutations | Next.js Server Actions |
| Reads | Direct Prisma queries in Server Components |
| Image Upload | `/api/upload` route streaming to MinIO |
| Validation | Zod (input validation on all Server Actions) |

### New Dependencies

- `prisma` + `@prisma/client` — ORM and client
- `minio` — MinIO JavaScript client
- `bcryptjs` — Password hashing
- `jose` — Lightweight JWT for session cookies
- `zod` — Input validation for Server Actions

## Database Schema

### Shared Entities (appear on multiple pages)

**TeamMember**
- `id` (Int, auto-increment, PK)
- `name` (String)
- `role` (String)
- `image` (String — URL)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage, About

**Testimonial**
- `id` (Int, auto-increment, PK)
- `quote` (String — text)
- `name` (String)
- `role` (String)
- `image` (String — URL)
- `stars` (Int, default 5, optional — not all pages render stars)
- `color` (String — hex/CSS color)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage, Admissions

**Partner**
- `id` (Int, auto-increment, PK)
- `name` (String)
- `logo` (String — URL)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage, Admissions
- Note: Deduplicate partners that appear on both pages with different filenames during seed

**Program**
- `id` (Int, auto-increment, PK)
- `name` (String)
- `ages` (String — e.g., "3-5 years")
- `grades` (String — e.g., "Nursery - KG")
- `description` (String — text)
- `highlights` (String[] — array of strings)
- `teaching` (String — text)
- `image` (String — URL)
- `color` (String — hex/CSS color)
- `emoji` (String)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage, Programs

### Homepage-Specific Entities

**Stat**
- `id` (Int, auto-increment, PK)
- `label` (String — e.g., "Years of Excellence")
- `value` (String — e.g., "15+")
- `suffix` (String, optional — e.g., "+")
- `emoji` (String — e.g., "🎓")
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage

**HomepageFeature**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `description` (String — text)
- `icon` (String — icon identifier, e.g., "AcademicCapIcon")
- `image` (String — URL)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage ("Why We're Different" section)

**SchoolLifeItem**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `icon` (String — icon identifier)
- `image` (String — URL)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Homepage ("School Life" section)

### Programs-Specific Entities

**SpecialFeature**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `description` (String — text)
- `icon` (String — icon identifier)
- `color` (String)
- `bg` (String — background color/class)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Programs page

**KeyBenefit**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `description` (String — text)
- `emoji` (String)
- `color` (String)
- `bg` (String — background color/class)
- `border` (String — border color/class)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Programs page

### Admissions/Community-Specific Entities

**CommunityInvolvement**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `description` (String — text)
- `image` (String — URL, optional)
- `color` (String, optional)
- `section` (String — "parent_teacher" | "business" | "educational")
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Admissions/Community page

### About-Specific Entities

**CoreValue**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `icon` (String — icon identifier, e.g., "ArrowTrendingUpIcon")
- `emoji` (String)
- `color` (String)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: About

**Philosophy**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `description` (String — text)
- `emoji` (String)
- `color` (String)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: About

### Facilities-Specific Entities

**Activity**
- `id` (Int, auto-increment, PK)
- `tag` (String)
- `title` (String)
- `description` (String — text)
- `image` (String — URL)
- `color` (String)
- `section` (String — groups activities by section on Facilities page)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Facilities

**Facility**
- `id` (Int, auto-increment, PK)
- `title` (String)
- `subtitle` (String, optional — used by labs)
- `description` (String — text)
- `image` (String — URL, optional)
- `category` (String — "resource" | "lab" | "digital" | "health" | "convenience")
- `icon` (String, optional — icon identifier)
- `color` (String, optional)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Facilities
- Note: `counselingPoints` (simple string list) stored as a SiteSettings JSON value

### Contact-Specific Entities

**ContactInfo**
- `id` (Int, auto-increment, PK)
- `label` (String — e.g., "Phone")
- `value` (String — e.g., "+977-01-1234567")
- `type` (String — "address" | "phone" | "email" | "hours")
- `icon` (String — icon identifier, mapped to Heroicon components in client code)
- `sortOrder` (Int, default 0)
- `createdAt` / `updatedAt` (DateTime)
- Used on: Contact

**ContactSubmission**
- `id` (Int, auto-increment, PK)
- `name` (String)
- `phone` (String)
- `purpose` (String)
- `message` (String — text)
- `read` (Boolean, default false)
- `createdAt` (DateTime)
- Used on: Contact (form submissions from visitors)

### System Entities

**SiteSettings**
- `id` (Int, auto-increment, PK)
- `key` (String, unique)
- `value` (String — text)
- `updatedAt` (DateTime)
- Used on: Multiple pages

Canonical keys (all created by seed script):
| Key | Used On | Description |
|-----|---------|-------------|
| `principal_message` | Homepage | Principal's welcome message |
| `principal_name` | Homepage | Principal's name |
| `principal_image` | Homepage | Principal's photo URL |
| `mission` | About | Mission statement |
| `vision` | About | Vision statement |
| `about_text` | About, Homepage | About school paragraphs (JSON array of strings) |
| `facebook_url` | Footer, Contact | Facebook page URL |
| `instagram_url` | Footer, Contact | Instagram page URL |
| `tiktok_url` | Footer, Contact | TikTok page URL |
| `whatsapp_number` | Contact | WhatsApp number for CTA |
| `map_embed_url` | Contact | Google Maps embed URL |
| `counseling_points` | Facilities | JSON array of counseling bullet points |

**AdminUser**
- `id` (Int, auto-increment, PK)
- `email` (String, unique)
- `passwordHash` (String)
- `createdAt` (DateTime)

## Architecture

### Layout Hierarchy

```
app/layout.tsx                    # HTML shell, fonts, global styles only
├── app/(public)/layout.tsx       # Header + Footer wrapping
│   ├── page.tsx                  # Homepage
│   ├── about/page.tsx
│   ├── programs/page.tsx
│   ├── admissions/page.tsx
│   ├── facilities/page.tsx
│   ├── gallery/page.tsx
│   └── contact/page.tsx
├── app/admin/layout.tsx          # Admin sidebar + top bar (NO Header/Footer)
│   ├── page.tsx                  # Dashboard
│   ├── team/page.tsx
│   └── ...
└── app/admin/login/page.tsx      # Login (outside admin layout, minimal chrome)
```

The root `layout.tsx` contains only the `<html>`, `<body>`, font loading, and global CSS. The `(public)` route group layout adds Header/Footer. The `admin` layout adds the admin shell. This prevents double-wrapping.

### File Structure

```
src/
├── app/
│   ├── layout.tsx               # HTML shell, fonts only
│   ├── (public)/
│   │   ├── layout.tsx           # Header + Footer
│   │   ├── page.tsx             # Homepage — Server Component wrapper
│   │   ├── about/page.tsx
│   │   ├── programs/page.tsx
│   │   ├── admissions/page.tsx
│   │   ├── facilities/page.tsx
│   │   ├── gallery/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── layout.tsx           # Admin shell (sidebar, auth check)
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── login/page.tsx       # Login page (no admin layout)
│   │   ├── team/page.tsx
│   │   ├── testimonials/page.tsx
│   │   ├── partners/page.tsx
│   │   ├── programs/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── facilities/page.tsx
│   │   ├── about/page.tsx       # Core values, philosophy, mission/vision
│   │   ├── contact/page.tsx     # Contact info + view submissions
│   │   ├── homepage/page.tsx    # Stats, principal message, features, school life
│   │   ├── community/page.tsx   # Community involvement items
│   │   └── settings/page.tsx    # Social links, map URL, general config
│   ├── api/
│   │   └── upload/route.ts      # MinIO file upload (auth-protected)
│   └── globals.css
├── components/
│   ├── Header.tsx               # Unchanged
│   ├── Footer.tsx               # Unchanged
│   ├── pages/                   # Client components extracted from pages
│   │   ├── HomePageClient.tsx
│   │   ├── AboutPageClient.tsx
│   │   ├── ProgramsPageClient.tsx
│   │   ├── AdmissionsPageClient.tsx
│   │   ├── FacilitiesPageClient.tsx
│   │   ├── GalleryPageClient.tsx
│   │   └── ContactPageClient.tsx
│   └── admin/                   # Admin-specific components
│       ├── Sidebar.tsx
│       ├── ImageUpload.tsx      # MinIO upload widget
│       ├── DataTable.tsx        # Reusable CRUD table
│       └── FormField.tsx        # Reusable form inputs
├── lib/
│   ├── db.ts                    # Prisma client singleton
│   ├── minio.ts                 # MinIO client config + bucket auto-creation
│   ├── auth.ts                  # Session helpers (cookie-based JWT)
│   ├── icons.ts                 # String → Heroicon component mapping
│   ├── validations/             # Zod schemas for each entity
│   │   ├── team.ts
│   │   ├── testimonials.ts
│   │   ├── programs.ts
│   │   └── ...
│   └── actions/                 # Server Actions grouped by entity
│       ├── team.ts
│       ├── testimonials.ts
│       ├── partners.ts
│       ├── programs.ts
│       ├── gallery.ts
│       ├── facilities.ts
│       ├── about.ts
│       ├── homepage.ts
│       ├── community.ts
│       ├── settings.ts
│       └── contact.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                  # Seeds DB with current hardcoded data
└── next.config.ts               # Updated with MinIO remotePatterns
```

### Data Flow

**Public pages (reading):**
```
Browser request
  → Next.js Server Component (e.g., app/(public)/page.tsx)
  → Prisma query (e.g., prisma.teamMember.findMany())
  → PostgreSQL returns data
  → Pass data as props to Client Component (e.g., HomePageClient)
  → Client Component renders with Framer Motion animations
  → HTML response to browser
```

**Admin mutations (writing):**
```
Admin fills form → Submit
  → Server Action (e.g., createTeamMember())
  → Zod validates input
  → Prisma mutation (prisma.teamMember.create())
  → PostgreSQL writes data
  → revalidatePath() to refresh affected public pages
  → Admin UI updates
```

**Image uploads:**
```
Admin selects file
  → Client-side fetch POST to /api/upload (with auth cookie)
  → Route handler verifies JWT cookie
  → Validates file size (max 10MB) and MIME type (image/jpeg, image/png, image/webp)
  → Streams file to MinIO
  → MinIO stores file, returns object key
  → Route handler returns full URL
  → URL inserted into form field
  → Server Action saves URL to database
```

**Auth:**
```
Login: POST email + password
  → Server Action → Zod validates input → bcrypt.compare(password, hash)
  → If valid: sign JWT with jose (includes exp claim, 24h expiry)
  → Set HTTP-only secure cookie
  → Redirect to /admin

Protected pages: admin/layout.tsx
  → Read cookie → Verify JWT with jose (checks exp)
  → If invalid/missing/expired: redirect to /admin/login

JWT claims: { sub: adminId, email: adminEmail, exp: 24h }
JWT_SECRET must be at least 32 bytes of random data.
```

### Entity-to-Path Revalidation Map

When a mutation occurs, these paths must be revalidated:

| Entity | Revalidate Paths |
|--------|-----------------|
| TeamMember | `/`, `/about` |
| Testimonial | `/`, `/admissions` |
| Partner | `/`, `/admissions` |
| Program | `/`, `/programs` |
| Stat | `/` |
| HomepageFeature | `/` |
| SchoolLifeItem | `/` |
| SpecialFeature | `/programs` |
| KeyBenefit | `/programs` |
| CommunityInvolvement | `/admissions` |
| CoreValue | `/about` |
| Philosophy | `/about` |
| Activity | `/facilities` |
| Facility | `/facilities` |
| GalleryImage | `/gallery` |
| ContactInfo | `/contact` |
| SiteSettings | Depends on key — `/`, `/about`, `/contact`, `/facilities` |

### Page Refactoring Pattern

Each public page gets split into two files:

1. **Server Component wrapper** (`app/(public)/page.tsx`):
   - Fetches all data for the page via Prisma
   - Passes data as props to the client component
   - No `'use client'` directive

2. **Client Component** (`components/pages/XPageClient.tsx`):
   - Receives data as props (typed interfaces)
   - Contains all existing JSX, Framer Motion animations, useState, etc.
   - Keeps `'use client'` directive
   - The JSX template is identical to the current page — only the data source changes

Example:
```tsx
// app/(public)/page.tsx (Server Component)
import { prisma } from '@/lib/db';
import HomePageClient from '@/components/pages/HomePageClient';

export default async function HomePage() {
  const stats = await prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } });
  const programs = await prisma.program.findMany({ orderBy: { sortOrder: 'asc' } });
  const team = await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } });
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } });
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } });
  const features = await prisma.homepageFeature.findMany({ orderBy: { sortOrder: 'asc' } });
  const schoolLifeItems = await prisma.schoolLifeItem.findMany({ orderBy: { sortOrder: 'asc' } });
  const principalMessage = await prisma.siteSettings.findUnique({ where: { key: 'principal_message' } });

  return (
    <HomePageClient
      stats={stats}
      programs={programs}
      team={team}
      testimonials={testimonials}
      partners={partners}
      features={features}
      schoolLifeItems={schoolLifeItems}
      principalMessage={principalMessage?.value ?? ''}
    />
  );
}
```

```tsx
// components/pages/HomePageClient.tsx ('use client')
// This is the current page.tsx content, unchanged,
// except data comes from props instead of const arrays.
```

### Icon Mapping

Pages use Heroicon components (e.g., `AcademicCapIcon`). Since icons are stored as strings in the database, the client components need a mapping function:

```tsx
// lib/icons.ts
import { AcademicCapIcon, ArrowTrendingUpIcon, ... } from '@heroicons/react/24/outline';

export const iconMap: Record<string, React.ComponentType<any>> = {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  // ... all icons used in the codebase
};

export function getIcon(name: string) {
  return iconMap[name] ?? null;
}
```

### Next.js Config Update

Add MinIO domain to `remotePatterns` in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    // Existing patterns (keep until all images migrated)
    { hostname: 'images.unsplash.com' },
    { hostname: 'aarambha.school' },
    // MinIO
    { hostname: 'localhost', port: '9000', protocol: 'http' },
  ],
},
```

### MinIO Bucket Auto-Creation

The MinIO client initialization checks if the configured bucket exists and creates it if missing:

```ts
// lib/minio.ts
const minioClient = new Minio.Client({ ... });

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
  }
}
```

Called once during the upload route handler or during seed.

## Admin Panel

### Design

- Clean, minimal UI built with existing Tailwind classes
- Left sidebar navigation
- Top bar with "View Site" link and logout
- No new UI library — keeps bundle small

### Admin Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard — quick counts (team, gallery, unread submissions) |
| `/admin/login` | Email/password login form (outside admin layout) |
| `/admin/team` | CRUD for team members with photo upload |
| `/admin/testimonials` | CRUD for testimonials |
| `/admin/partners` | CRUD for partner logos |
| `/admin/programs` | CRUD for programs (highlights as multi-input) |
| `/admin/gallery` | Upload/remove/categorize gallery photos |
| `/admin/facilities` | CRUD for activities and facilities by category |
| `/admin/about` | Edit core values, philosophy items, mission/vision |
| `/admin/homepage` | Edit stats, principal's message, features, school life items |
| `/admin/community` | CRUD for community involvement items by section |
| `/admin/contact` | Edit contact info cards, view/mark-read form submissions |
| `/admin/settings` | Social links, map embed URL, WhatsApp number |

### CRUD Pattern

Each admin page follows the same pattern:
1. **List view** — Table with columns, edit/delete buttons, up/down arrows for reordering
2. **Create** — Form in a modal or below the table
3. **Edit** — Same form, pre-filled with existing data
4. **Delete** — Confirmation prompt before deletion ("Are you sure?")
5. **Image fields** — Upload widget showing preview, uploads to MinIO

### Server Actions

Each entity gets a file in `src/lib/actions/` with:
- `getAll()` — List all items ordered by sortOrder
- `getById(id)` — Single item for edit forms
- `create(formData)` — Zod-validate, then create
- `update(id, formData)` — Zod-validate, then update
- `delete(id)` — Delete item (with confirmation on client side)
- `reorder(id, direction)` — Move item up/down in sort order

All mutations call `revalidatePath()` for affected public pages (see Entity-to-Path map above).

## Security

- All Server Actions validate input with Zod before any database operation
- `/api/upload` route verifies JWT cookie before accepting files
- File uploads limited to 10MB max, allowed types: `image/jpeg`, `image/png`, `image/webp`
- JWT tokens include `exp` claim (24-hour expiry)
- `JWT_SECRET` must be at least 32 bytes of cryptographically random data
- Passwords hashed with bcrypt (cost factor 12)
- Session cookie: HTTP-only, Secure, SameSite=Lax
- Admin layout redirects to login on invalid/missing/expired tokens

## Migration Strategy

### Seed Script (`prisma/seed.ts`)

The seed script extracts every hardcoded array from the current page files and inserts them into the database. This ensures:
- Zero content loss during migration
- The site looks identical before and after
- All images (currently external URLs) are preserved as-is
- Duplicate partners across pages are deduplicated

The seed script also:
- Creates all canonical SiteSettings keys
- Creates the initial admin user with a configurable password from `ADMIN_PASSWORD` env var

### Rollout Order

1. **Foundation** — Prisma schema, MinIO client (with bucket auto-creation), auth helpers, Prisma client singleton, Zod schemas, icon mapping
2. **Seed** — Seed script with all current hardcoded data
3. **Layout refactor** — Split root layout into `(public)/layout.tsx` (Header/Footer) and keep root layout as HTML shell only
4. **Shared entities** — TeamMember, Testimonial, Partner, Program (used on multiple pages)
5. **Page-specific entities** — All remaining entities
6. **Public pages** — Refactor one page at a time: extract client component, add server component wrapper
7. **Admin panel** — Build admin pages for each entity
8. **Contact form** — Wire up form submission to database
9. **Polish** — Dashboard counts, submission management, final testing

## Environment Variables

```env
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/aarambha"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="aarambha-uploads"
MINIO_USE_SSL="false"

# Auth
JWT_SECRET="<min-32-bytes-random>"
ADMIN_EMAIL="admin@aarambha.school"
ADMIN_PASSWORD="<initial-password>"  # Used only during seed
```

Add `.env*.local` to `.gitignore`.

## Constraints

- **Zero visual changes** to any public page
- **All existing URLs preserved** — no route changes
- **All existing animations preserved** — Framer Motion usage stays identical
- **All hardcoded content migrated** — seed script copies everything, including homepage features, school life items, special features, key benefits, community involvement items, and all entity fields (icons, emojis, colors)
- **No new UI library** for admin — built with Tailwind
- **Single admin user** — no role-based access
- **sortOrder with up/down buttons** — no drag-and-drop library
