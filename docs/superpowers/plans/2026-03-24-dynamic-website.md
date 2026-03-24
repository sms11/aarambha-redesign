# Dynamic Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded content with PostgreSQL-backed data, add a custom admin panel at `/admin`, and use MinIO for image uploads — with zero visual changes to public pages.

**Architecture:** Next.js 15 App Router with Prisma ORM, Server Actions for mutations, Server Components for data fetching. Public pages split into Server Component wrappers (data fetch) + Client Components (existing animated JSX). Admin panel built with Tailwind CSS.

**Tech Stack:** Next.js 15, Prisma, PostgreSQL, MinIO, jose (JWT), bcryptjs, Zod

**Spec:** `docs/superpowers/specs/2026-03-24-dynamic-website-design.md`

---

## Chunk 1: Foundation

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install production dependencies**

```bash
npm install prisma @prisma/client minio bcryptjs jose zod
```

- [ ] **Step 2: Install dev type definitions**

```bash
npm install -D @types/bcryptjs
```

- [ ] **Step 3: Verify installation**

Run: `npm ls prisma @prisma/client minio bcryptjs jose zod`
Expected: All packages listed without errors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add Prisma, MinIO, auth, and validation dependencies"
```

---

### Task 2: Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and a `.env` file. Move `.env` contents to `.env.local` and ensure `.env*.local` is in `.gitignore`.

- [ ] **Step 2: Write the full Prisma schema**

Write `prisma/schema.prisma` with all 17 models from the spec:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model AdminUser {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model TeamMember {
  id        Int      @id @default(autoincrement())
  name      String
  role      String
  image     String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Testimonial {
  id        Int      @id @default(autoincrement())
  quote     String
  name      String
  role      String
  image     String
  stars     Int      @default(5)
  color     String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Partner {
  id        Int      @id @default(autoincrement())
  name      String
  logo      String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Program {
  id          Int      @id @default(autoincrement())
  name        String
  ages        String
  grades      String
  description String
  highlights  String[]
  teaching    String
  image       String
  color       String
  emoji       String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Stat {
  id        Int      @id @default(autoincrement())
  label     String
  value     String
  suffix    String?
  emoji     String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model HomepageFeature {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  icon        String
  image       String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SchoolLifeItem {
  id        Int      @id @default(autoincrement())
  title     String
  icon      String
  image     String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SpecialFeature {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  icon        String
  color       String
  bg          String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model KeyBenefit {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  emoji       String
  color       String
  bg          String
  border      String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CommunityInvolvement {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  image       String?
  color       String?
  section     String   // "parent_teacher" | "business" | "educational"
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CoreValue {
  id        Int      @id @default(autoincrement())
  title     String
  icon      String
  emoji     String
  color     String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Philosophy {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  emoji       String
  color       String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Activity {
  id          Int      @id @default(autoincrement())
  tag         String
  title       String
  description String
  image       String
  color       String
  section     String
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Facility {
  id          Int      @id @default(autoincrement())
  title       String
  subtitle    String?
  description String
  image       String?
  category    String   // "resource" | "lab" | "digital" | "health" | "convenience"
  icon        String?
  color       String?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GalleryImage {
  id        Int      @id @default(autoincrement())
  src       String
  alt       String
  category  String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactInfo {
  id        Int      @id @default(autoincrement())
  label     String
  value     String
  type      String   // "address" | "phone" | "email" | "hours"
  icon      String
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactSubmission {
  id        Int      @id @default(autoincrement())
  name      String
  phone     String
  purpose   String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model SiteSettings {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}
```

- [ ] **Step 3: Verify schema is valid**

Run: `npx prisma validate`
Expected: "The schema at prisma/schema.prisma is valid"

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Prisma schema with all 17 models"
```

---

### Task 3: Environment Setup

**Files:**
- Create: `.env.local` (not committed)
- Modify: `.gitignore`

- [ ] **Step 1: Add env exclusions to .gitignore**

Append to `.gitignore`:
```
.env*.local
```

- [ ] **Step 2: Create .env.local**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aarambha"

MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="aarambha-uploads"
MINIO_USE_SSL="false"

JWT_SECRET="change-me-to-at-least-32-bytes-of-random-data"
ADMIN_EMAIL="admin@aarambha.school"
ADMIN_PASSWORD="admin123"
```

Note: User must have PostgreSQL running locally with a database named `aarambha`. If not, run: `createdb aarambha`

- [ ] **Step 3: Run initial migration**

```bash
npx prisma migrate dev --name init
```

Expected: Migration created and applied, Prisma Client generated.

- [ ] **Step 4: Commit**

```bash
git add .gitignore prisma/migrations/
git commit -m "feat: add initial Prisma migration and env setup"
```

---

### Task 4: Prisma Client Singleton

**Files:**
- Create: `src/lib/db.ts`

- [ ] **Step 1: Create the Prisma client singleton**

```ts
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No errors (or only pre-existing errors unrelated to db.ts)

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat: add Prisma client singleton"
```

---

### Task 5: MinIO Client

**Files:**
- Create: `src/lib/minio.ts`

- [ ] **Step 1: Create the MinIO client with bucket auto-creation**

```ts
// src/lib/minio.ts
import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const BUCKET_NAME = process.env.MINIO_BUCKET || 'aarambha-uploads';

export async function ensureBucket() {
  const exists = await minioClient.bucketExists(BUCKET_NAME);
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME);
  }
}

export async function uploadFile(
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await ensureBucket();
  await minioClient.putObject(BUCKET_NAME, fileName, buffer, buffer.length, {
    'Content-Type': contentType,
  });
  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
  const port = process.env.MINIO_PORT || '9000';
  const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
  return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${fileName}`;
}

export { minioClient, BUCKET_NAME };
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/minio.ts
git commit -m "feat: add MinIO client with bucket auto-creation"
```

---

### Task 6: Auth Helpers

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Create auth helpers for JWT session management**

```ts
// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production'
);
const COOKIE_NAME = 'admin_session';

export async function createSession(userId: number, email: string) {
  const token = await new SignJWT({ sub: String(userId), email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function verifySession(): Promise<{ userId: number; email: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: Number(payload.sub),
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: add JWT session auth helpers"
```

---

### Task 7: Icon Mapping

**Files:**
- Create: `src/lib/icons.ts`

Before writing this file, read all page files to extract every Heroicon used. The mapping must include every icon referenced in the codebase. Read the following files to find all icon imports:
- `src/app/page.tsx`
- `src/app/about/page.tsx`
- `src/app/programs/page.tsx`
- `src/app/admissions/page.tsx`
- `src/app/facilities/page.tsx`
- `src/app/contact/page.tsx`
- `src/components/Header.tsx`
- `src/components/Footer.tsx`

- [ ] **Step 1: Extract all icon imports from every page file**

Search all `.tsx` files for `@heroicons/react` imports. Collect the complete list.

- [ ] **Step 2: Create the icon mapping file**

Create `src/lib/icons.ts` that maps string names to Heroicon components. Include every icon found in step 1. Example structure:

```ts
// src/lib/icons.ts
import {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  // ... all icons found
} from '@heroicons/react/24/outline';

import {
  StarIcon as StarIconSolid,
  // ... solid icons if used
} from '@heroicons/react/24/solid';

export const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  // ... all icons
};

export function getIcon(name: string) {
  return iconMap[name] ?? null;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/icons.ts
git commit -m "feat: add Heroicon string-to-component mapping"
```

---

### Task 8: Update next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add MinIO and aarambha.school to remote patterns**

Update `next.config.ts` to add MinIO and current image domains:

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
      {
        protocol: 'https',
        hostname: 'aarambha.school',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: add MinIO and aarambha.school to image remote patterns"
```

---

### Task 9: Upload API Route

**Files:**
- Create: `src/app/api/upload/route.ts`

- [ ] **Step 1: Create the auth-protected upload endpoint**

```ts
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { uploadFile } from '@/lib/minio';
import crypto from 'crypto';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Allowed: JPEG, PNG, WebP' },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const url = await uploadFile(fileName, buffer, file.type);

  return NextResponse.json({ url });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/upload/route.ts
git commit -m "feat: add auth-protected MinIO upload endpoint"
```

---

### Task 10: Seed Script

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add prisma seed config)

This is the most critical task. The seed script must extract ALL hardcoded data from every page file and insert it into the database. Read each page file carefully to capture every array and data structure.

- [ ] **Step 1: Read all page files to extract hardcoded data**

Read the following files and extract every data array/constant:
- `src/app/page.tsx` — stats, programs (homepage subset), team, testimonials, partners, features, schoolLifeItems, principalMessage/aboutText
- `src/app/about/page.tsx` — coreValues, philosophy, team (same data), mission, vision, aboutText
- `src/app/programs/page.tsx` — programs (full data), specialFeatures, keyBenefits
- `src/app/admissions/page.tsx` — involvementItems, partnerships, testimonials, partners
- `src/app/facilities/page.tsx` — activities, resources, labs, digitalItems, counselingPoints, conveniences
- `src/app/gallery/page.tsx` — galleryImages
- `src/app/contact/page.tsx` — contactInfo

- [ ] **Step 2: Write the seed script**

Create `prisma/seed.ts` that:
1. Clears all existing data (for idempotent re-seeding)
2. Inserts all hardcoded data with correct sortOrder values
3. Creates all canonical SiteSettings keys
4. Creates the admin user from env vars
5. Deduplicates partners that appear on both Homepage and Admissions pages

The seed script must import `bcryptjs` for password hashing and `@prisma/client` for database access. Use `tsx` to run it.

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear all tables (order matters due to no FK constraints)
  await prisma.$transaction([
    prisma.contactSubmission.deleteMany(),
    prisma.contactInfo.deleteMany(),
    prisma.galleryImage.deleteMany(),
    prisma.facility.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.philosophy.deleteMany(),
    prisma.coreValue.deleteMany(),
    prisma.communityInvolvement.deleteMany(),
    prisma.keyBenefit.deleteMany(),
    prisma.specialFeature.deleteMany(),
    prisma.schoolLifeItem.deleteMany(),
    prisma.homepageFeature.deleteMany(),
    prisma.stat.deleteMany(),
    prisma.program.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.siteSettings.deleteMany(),
    prisma.adminUser.deleteMany(),
  ]);

  // === ADMIN USER ===
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  await prisma.adminUser.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@aarambha.school',
      passwordHash,
    },
  });

  // === ALL DATA ARRAYS GO HERE ===
  // Copy each hardcoded array from the page files,
  // converting to prisma.model.createMany({ data: [...] }) calls.
  // Assign sortOrder based on array index.
  //
  // IMPORTANT: Read each source file and copy data exactly.
  // Do not invent or modify content.

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

The actual data arrays must be extracted from the source files at implementation time. Each array element maps directly to a `createMany` call with the fields from the Prisma schema.

- [ ] **Step 3: Add seed config and tsx dependency**

Install tsx for running the seed script:
```bash
npm install -D tsx
```

Add to `package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

- [ ] **Step 4: Run the seed script**

```bash
npx prisma db seed
```

Expected: "Seed completed successfully." and all data in the database.

- [ ] **Step 5: Verify seed data**

```bash
npx prisma studio
```

Open Prisma Studio in browser and verify:
- All models have data
- Team members, testimonials, programs match the current page content
- SiteSettings has all canonical keys
- AdminUser exists

- [ ] **Step 6: Commit**

```bash
git add prisma/seed.ts package.json package-lock.json
git commit -m "feat: add comprehensive seed script with all hardcoded content"
```

---

## Chunk 2: Layout Refactor & Public Page Migration

### Task 11: Layout Refactor

**Files:**
- Modify: `src/app/layout.tsx` — Strip Header/Footer, keep only HTML shell
- Create: `src/app/(public)/layout.tsx` — Add Header/Footer wrapping (fetches social links from DB for Footer)

- [ ] **Step 1: Create the (public) route group directory**

```bash
mkdir -p src/app/\(public\)
```

- [ ] **Step 2: Create the public layout**

Create `src/app/(public)/layout.tsx`. This layout must be an **async Server Component** because it needs to fetch social link URLs from SiteSettings for the Footer:

```tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [facebookUrl, instagramUrl, tiktokUrl] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: 'facebook_url' } }),
    prisma.siteSettings.findUnique({ where: { key: 'instagram_url' } }),
    prisma.siteSettings.findUnique({ where: { key: 'tiktok_url' } }),
  ]);

  const socialLinks = {
    facebook: facebookUrl?.value ?? '',
    instagram: instagramUrl?.value ?? '',
    tiktok: tiktokUrl?.value ?? '',
  };

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
```

The Footer component must be updated to accept `socialLinks` as a prop instead of using hardcoded URLs. Read the current Footer component, extract the hardcoded social URLs, and replace them with the prop values. Keep all existing JSX and styling identical.

- [ ] **Step 3: Strip Header/Footer from root layout**

Modify `src/app/layout.tsx` to remove Header and Footer imports/usage. Keep only the HTML shell:

```tsx
import type { Metadata } from "next";
import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Move all existing pages into (public) route group**

Move each page file into the `(public)` directory. URLs stay the same because `(public)` is a route group (parenthesized).

```bash
mv src/app/page.tsx src/app/\(public\)/page.tsx
mv src/app/about src/app/\(public\)/about
mv src/app/programs src/app/\(public\)/programs
mv src/app/admissions src/app/\(public\)/admissions
mv src/app/facilities src/app/\(public\)/facilities
mv src/app/gallery src/app/\(public\)/gallery
mv src/app/contact src/app/\(public\)/contact
```

- [ ] **Step 5: Verify the site still works**

Run: `npm run dev`
Navigate to `http://localhost:3000` — the site should look exactly the same. Check all pages.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/\(public\)/ src/components/Footer.tsx
git commit -m "refactor: split layout into root shell + (public) route group"
```

---

### Task 12: Homepage Migration

**Files:**
- Modify: `src/app/(public)/page.tsx` — Replace with Server Component wrapper
- Create: `src/components/pages/HomePageClient.tsx` — Current page content as client component

- [ ] **Step 1: Create the components/pages directory**

```bash
mkdir -p src/components/pages
```

- [ ] **Step 2: Copy current homepage to client component**

Copy the entire content of `src/app/(public)/page.tsx` to `src/components/pages/HomePageClient.tsx`.

Then modify `HomePageClient.tsx`:
1. Keep the `'use client'` directive
2. Remove all hardcoded data arrays (stats, programs, team, testimonials, partners, features, schoolLifeItems, principalMessage, aboutText etc.)
3. Accept all data as props via a typed interface
4. Replace icon component references with the `getIcon()` function from `@/lib/icons` where icons come from database string fields
5. All JSX stays exactly the same — only the data source changes

Define the props interface at the top:
```tsx
interface HomePageClientProps {
  stats: Array<{ id: number; label: string; value: string; suffix: string | null; emoji: string; sortOrder: number }>;
  programs: Array<{ id: number; name: string; ages: string; grades: string; description: string; image: string; color: string; emoji: string; sortOrder: number }>;
  team: Array<{ id: number; name: string; role: string; image: string }>;
  testimonials: Array<{ id: number; quote: string; name: string; role: string; image: string; color: string }>;
  partners: Array<{ id: number; name: string; logo: string }>;
  features: Array<{ id: number; title: string; description: string; icon: string; image: string }>;
  schoolLifeItems: Array<{ id: number; title: string; icon: string; image: string }>;
  principalMessage: string;
  principalName: string;
  principalImage: string;
  aboutText: string[];
}
```

- [ ] **Step 3: Create the Server Component wrapper**

Replace `src/app/(public)/page.tsx` with:

```tsx
import { prisma } from '@/lib/db';
import HomePageClient from '@/components/pages/HomePageClient';

export default async function HomePage() {
  const [stats, programs, team, testimonials, partners, features, schoolLifeItems] = await Promise.all([
    prisma.stat.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.program.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.partner.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.homepageFeature.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.schoolLifeItem.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);

  const [principalMessage, principalName, principalImage, aboutTextSetting] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: 'principal_message' } }),
    prisma.siteSettings.findUnique({ where: { key: 'principal_name' } }),
    prisma.siteSettings.findUnique({ where: { key: 'principal_image' } }),
    prisma.siteSettings.findUnique({ where: { key: 'about_text' } }),
  ]);

  const aboutText = aboutTextSetting?.value ? JSON.parse(aboutTextSetting.value) : [];

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
      principalName={principalName?.value ?? ''}
      principalImage={principalImage?.value ?? ''}
      aboutText={aboutText}
    />
  );
}
```

- [ ] **Step 4: Verify homepage looks identical**

Run: `npm run dev`
Compare homepage visually — must be pixel-identical to the old version.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/page.tsx src/components/pages/HomePageClient.tsx
git commit -m "feat: migrate homepage to database-backed Server Component"
```

---

### Task 13: About Page Migration

**Files:**
- Modify: `src/app/(public)/about/page.tsx` — Server Component wrapper
- Create: `src/components/pages/AboutPageClient.tsx` — Client component

Follow the same pattern as Task 12:

- [ ] **Step 1: Copy current about page to client component**

Copy `src/app/(public)/about/page.tsx` to `src/components/pages/AboutPageClient.tsx`. Remove hardcoded data, accept as props. Keep all JSX and animations identical.

Props needed: `team`, `coreValues`, `philosophy`, `mission`, `vision`, `aboutText`

- [ ] **Step 2: Create Server Component wrapper**

Replace `src/app/(public)/about/page.tsx` with async Server Component that fetches from Prisma and passes to `AboutPageClient`.

- [ ] **Step 3: Verify about page looks identical**

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/about/page.tsx src/components/pages/AboutPageClient.tsx
git commit -m "feat: migrate about page to database-backed Server Component"
```

---

### Task 14: Programs Page Migration

**Files:**
- Modify: `src/app/(public)/programs/page.tsx`
- Create: `src/components/pages/ProgramsPageClient.tsx`

- [ ] **Step 1: Copy current programs page to client component**

Props needed: `programs`, `specialFeatures`, `keyBenefits`

- [ ] **Step 2: Create Server Component wrapper**

- [ ] **Step 3: Verify programs page looks identical**

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/programs/page.tsx src/components/pages/ProgramsPageClient.tsx
git commit -m "feat: migrate programs page to database-backed Server Component"
```

---

### Task 15: Admissions/Community Page Migration

**Files:**
- Modify: `src/app/(public)/admissions/page.tsx`
- Create: `src/components/pages/AdmissionsPageClient.tsx`

- [ ] **Step 1: Copy current admissions page to client component**

Props needed: `communityInvolvements` (grouped by section), `testimonials`, `partners`

- [ ] **Step 2: Create Server Component wrapper**

- [ ] **Step 3: Verify admissions page looks identical**

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/admissions/page.tsx src/components/pages/AdmissionsPageClient.tsx
git commit -m "feat: migrate admissions page to database-backed Server Component"
```

---

### Task 16: Facilities Page Migration

**Files:**
- Modify: `src/app/(public)/facilities/page.tsx`
- Create: `src/components/pages/FacilitiesPageClient.tsx`

- [ ] **Step 1: Copy current facilities page to client component**

Props needed: `activities`, `facilities` (grouped by category), `counselingPoints` (from SiteSettings)

- [ ] **Step 2: Create Server Component wrapper**

- [ ] **Step 3: Verify facilities page looks identical**

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/facilities/page.tsx src/components/pages/FacilitiesPageClient.tsx
git commit -m "feat: migrate facilities page to database-backed Server Component"
```

---

### Task 17: Gallery Page Migration

**Files:**
- Modify: `src/app/(public)/gallery/page.tsx`
- Create: `src/components/pages/GalleryPageClient.tsx`

- [ ] **Step 1: Copy current gallery page to client component**

Props needed: `galleryImages`

- [ ] **Step 2: Create Server Component wrapper**

- [ ] **Step 3: Verify gallery page looks identical**

- [ ] **Step 4: Commit**

```bash
git add src/app/\(public\)/gallery/page.tsx src/components/pages/GalleryPageClient.tsx
git commit -m "feat: migrate gallery page to database-backed Server Component"
```

---

### Task 18: Contact Page Migration

**Files:**
- Modify: `src/app/(public)/contact/page.tsx`
- Create: `src/components/pages/ContactPageClient.tsx`
- Create: `src/lib/actions/contact.ts` — Server Action for form submission

- [ ] **Step 1: Create contact form Server Action**

Create `src/lib/actions/contact.ts` with a `submitContactForm` action that validates with Zod and saves to the `ContactSubmission` table.

```ts
'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function submitContactForm(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    purpose: formData.get('purpose'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return { success: false, error: 'Please fill in all fields.' };
  }

  await prisma.contactSubmission.create({
    data: parsed.data,
  });

  return { success: true };
}
```

- [ ] **Step 2: Copy current contact page to client component**

Props needed: `contactInfo`, `mapEmbedUrl`, `whatsappNumber`, `socialLinks` (facebook, instagram, tiktok URLs)

Modify the form to call the `submitContactForm` Server Action instead of `alert()`.

- [ ] **Step 3: Create Server Component wrapper**

- [ ] **Step 4: Verify contact page looks identical and form submits to database**

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/contact/page.tsx src/components/pages/ContactPageClient.tsx src/lib/actions/contact.ts
git commit -m "feat: migrate contact page with working form submission"
```

---

### Task 19: Build Verification

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: Build succeeds with no errors. All pages compile.

- [ ] **Step 2: Run the production server and check all pages**

```bash
npm run start
```

Navigate to all 7 pages and verify they look identical to the original.

- [ ] **Step 3: Commit any fixes**

If any fixes were needed, commit them.

---

## Chunk 3: Admin Panel — Foundation

### Task 20: Admin Login

**Files:**
- Create: `src/app/admin/(auth)/login/page.tsx` — Login page (in unprotected route group)
- Create: `src/lib/actions/auth.ts` — Login Server Action

**Important:** The login page must be outside the auth-protected admin layout. Use a route group `(auth)` within admin to exclude login from the layout auth check. The admin layout (Task 21) will only wrap `src/app/admin/(dashboard)/` routes.

- [ ] **Step 1: Create the login Server Action**

```ts
// src/lib/actions/auth.ts
'use server';

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: 'Invalid email or password.' };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return { error: 'Invalid email or password.' };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id, user.email);
  redirect('/admin');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}
```

- [ ] **Step 2: Create the login page**

Create `src/app/admin/(auth)/login/page.tsx` — a simple centered card with email and password fields. Use the `login` Server Action. Show error messages. Style with Tailwind.

This page lives in the `(auth)` route group, which does NOT have the admin layout's auth check. The URL remains `/admin/login`.

- [ ] **Step 3: Verify login works**

Run: `npm run dev`, navigate to `/admin/login`, log in with the seeded credentials.
Expected: Redirect to `/admin` on success, error message on failure. No redirect loops.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/\(auth\)/ src/lib/actions/auth.ts
git commit -m "feat: add admin login page with JWT session"
```

---

### Task 21: Admin Layout

**Files:**
- Create: `src/app/admin/(dashboard)/layout.tsx` — Protected admin shell
- Create: `src/app/admin/(dashboard)/page.tsx` — Dashboard
- Create: `src/components/admin/Sidebar.tsx`

The admin uses two route groups under `src/app/admin/`:
- `(auth)/` — Contains login page, no auth check
- `(dashboard)/` — Contains all protected pages, layout checks auth

All subsequent admin pages (Tasks 23-34) go under `src/app/admin/(dashboard)/`.

- [ ] **Step 1: Create the admin sidebar component**

Create `src/components/admin/Sidebar.tsx` with navigation links to all admin sections:
- Dashboard (`/admin`)
- Team (`/admin/team`)
- Testimonials (`/admin/testimonials`)
- Partners (`/admin/partners`)
- Programs (`/admin/programs`)
- Gallery (`/admin/gallery`)
- Facilities (`/admin/facilities`)
- About (`/admin/about`)
- Homepage (`/admin/homepage`)
- Community (`/admin/community`)
- Contact (`/admin/contact`)
- Settings (`/admin/settings`)

Include a "View Site" link (opens `/` in new tab) and a logout button that calls the `logout` Server Action.

Style: Left sidebar, dark background (`bg-gray-900`), white text, active state highlighting.

- [ ] **Step 2: Create the admin dashboard layout**

Create `src/app/admin/(dashboard)/layout.tsx`:
- Verify session with `verifySession()` from `@/lib/auth`
- If not authenticated, redirect to `/admin/login`
- Render sidebar + main content area
- No public Header/Footer

```tsx
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-50">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
```

This layout only wraps `(dashboard)/` routes. The `(auth)/login` page is NOT wrapped by this layout, preventing the infinite redirect loop.

- [ ] **Step 3: Create the dashboard page**

Create `src/app/admin/(dashboard)/page.tsx` — displays quick counts:
- Total team members
- Total gallery images
- Unread contact submissions
- Total programs

Fetch counts with `prisma.model.count()`.

- [ ] **Step 4: Verify admin panel works**

Navigate to `/admin` — should see dashboard with sidebar. Navigate to `/admin/login` when logged out — should see login form. After login, redirect to dashboard.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/\(dashboard\)/ src/components/admin/Sidebar.tsx
git commit -m "feat: add admin layout with sidebar and dashboard"
```

---

### Task 22: Reusable Admin Components

**Files:**
- Create: `src/components/admin/ImageUpload.tsx`
- Create: `src/components/admin/DataTable.tsx`
- Create: `src/components/admin/FormField.tsx`

- [ ] **Step 1: Create ImageUpload component**

A client component that:
- Shows a file input and preview of the current image
- Uploads to `/api/upload` on file selection
- Returns the URL via an `onChange` callback
- Shows loading state during upload

- [ ] **Step 2: Create FormField component**

A component that renders labeled form fields:
- Text input, textarea, select, number input
- Shows validation errors
- Consistent styling

- [ ] **Step 3: Create DataTable component**

A reusable table component that:
- Accepts columns config and data array
- Renders edit/delete action buttons per row
- Shows up/down arrows for reordering
- Accepts callbacks for edit, delete, reorder

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/
git commit -m "feat: add reusable admin components (ImageUpload, DataTable, FormField)"
```

---

## Chunk 4: Admin CRUD Pages (Shared Entities)

### Task 23: Team Members Admin

**Files:**
- Create: `src/lib/validations/team.ts`
- Create: `src/lib/actions/team.ts`
- Create: `src/app/admin/(dashboard)/team/page.tsx`

- [ ] **Step 1: Create Zod validation schema**

```ts
// src/lib/validations/team.ts
import { z } from 'zod';

export const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  image: z.string().url('Valid image URL required'),
});
```

- [ ] **Step 2: Create Server Actions**

Create `src/lib/actions/team.ts` with: `getAll`, `getById`, `create`, `update`, `deleteTeamMember`, `reorder`.

All mutations call `revalidatePath('/')` and `revalidatePath('/about')`.

- [ ] **Step 3: Create admin page**

Create `src/app/admin/team/page.tsx`:
- List view with DataTable showing name, role, image preview
- Create/edit form with ImageUpload for photo
- Delete with confirmation
- Reorder with up/down buttons

- [ ] **Step 4: Verify CRUD works**

Test create, edit, delete, reorder. Verify changes appear on public homepage and about page.

- [ ] **Step 5: Commit**

```bash
git add src/lib/validations/team.ts src/lib/actions/team.ts src/app/admin/team/
git commit -m "feat: add team members admin CRUD"
```

---

### Task 24: Testimonials Admin

**Files:**
- Create: `src/lib/validations/testimonials.ts`
- Create: `src/lib/actions/testimonials.ts`
- Create: `src/app/admin/(dashboard)/testimonials/page.tsx`

Follow same pattern as Task 23. Revalidate paths: `/`, `/admissions`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 25: Partners Admin

**Files:**
- Create: `src/lib/validations/partners.ts`
- Create: `src/lib/actions/partners.ts`
- Create: `src/app/admin/(dashboard)/partners/page.tsx`

Follow same pattern. Revalidate paths: `/`, `/admissions`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 26: Programs Admin

**Files:**
- Create: `src/lib/validations/programs.ts`
- Create: `src/lib/actions/programs.ts`
- Create: `src/app/admin/(dashboard)/programs/page.tsx`

Follow same pattern. Revalidate paths: `/`, `/programs`.

Note: `highlights` is a string array — use a multi-input field (add/remove individual highlights).

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

## Chunk 5: Admin CRUD Pages (Page-Specific Entities)

### Task 27: Homepage Admin

**Files:**
- Create: `src/lib/validations/homepage.ts`
- Create: `src/lib/actions/homepage.ts`
- Create: `src/app/admin/(dashboard)/homepage/page.tsx`

Manages: Stats, HomepageFeatures, SchoolLifeItems, principal message (via SiteSettings).

Revalidate path: `/`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 28: About Admin

**Files:**
- Create: `src/lib/validations/about.ts`
- Create: `src/lib/actions/about.ts`
- Create: `src/app/admin/(dashboard)/about/page.tsx`

Manages: CoreValues, Philosophy, mission/vision text (via SiteSettings).

Revalidate path: `/about`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 29: Gallery Admin

**Files:**
- Create: `src/lib/validations/gallery.ts`
- Create: `src/lib/actions/gallery.ts`
- Create: `src/app/admin/(dashboard)/gallery/page.tsx`

Manages: GalleryImages. Upload multiple images, assign categories, reorder.

Revalidate path: `/gallery`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 30: Facilities Admin

**Files:**
- Create: `src/lib/validations/facilities.ts`
- Create: `src/lib/actions/facilities.ts`
- Create: `src/app/admin/(dashboard)/facilities/page.tsx`

Manages: Activities, Facilities (by category), counseling points (SiteSettings).

Revalidate path: `/facilities`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 31: Community Admin

**Files:**
- Create: `src/lib/validations/community.ts`
- Create: `src/lib/actions/community.ts`
- Create: `src/app/admin/(dashboard)/community/page.tsx`

Manages: CommunityInvolvement items grouped by section.

Revalidate path: `/admissions`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 32: Contact Admin

**Files:**
- Create: `src/lib/validations/contact-info.ts`
- Modify: `src/lib/actions/contact.ts` — Add admin CRUD for ContactInfo
- Create: `src/app/admin/(dashboard)/contact/page.tsx`

Manages: ContactInfo cards (CRUD) + ContactSubmission list (view, mark as read).

Revalidate path: `/contact`.

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 33: Settings Admin

**Files:**
- Create: `src/lib/validations/settings.ts`
- Create: `src/lib/actions/settings.ts`
- Create: `src/app/admin/(dashboard)/settings/page.tsx`

Manages: SiteSettings key-value pairs. Displays a form with labeled fields for each canonical key (social links, map URL, WhatsApp number). Validates that keys are from the canonical list and values are non-empty strings (URLs validated where applicable).

Revalidate paths: Depends on which key is changed (see Entity-to-Path map in spec).

- [ ] **Step 1-5: Implement validation, actions, admin page, verify, commit**

---

### Task 34: Programs Page Extras Admin

**Files:**
- Create: `src/lib/validations/special-features.ts`
- Create: `src/lib/validations/key-benefits.ts`
- Modify: `src/lib/actions/programs.ts` — Add SpecialFeature and KeyBenefit CRUD

Add SpecialFeature and KeyBenefit management to the existing programs actions file and admin page (as sub-sections).

Revalidate path: `/programs`.

- [ ] **Step 1-5: Implement validation, actions, update programs admin page, verify, commit**

---

## Chunk 6: Final Polish

### Task 35: Production Build Verification

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Test all public pages**

Navigate to all 7 public pages. Verify they are visually identical to the original hardcoded versions.

- [ ] **Step 3: Test all admin pages**

Log in to `/admin`. Test CRUD operations on every admin page. Verify changes reflect on public pages.

- [ ] **Step 4: Test contact form submission**

Submit a contact form on the public site. Verify it appears in `/admin/contact` as unread.

- [ ] **Step 5: Test image upload**

Upload an image via any admin form. Verify it saves to MinIO and displays correctly.

- [ ] **Step 6: Fix any issues found and commit**

---

### Task 36: Final Commit

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Fix any lint errors.

- [ ] **Step 2: Final build check**

```bash
npm run build
```

- [ ] **Step 3: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: complete dynamic website with admin panel"
```
