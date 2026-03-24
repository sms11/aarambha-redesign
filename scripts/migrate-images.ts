/**
 * Image Migration Script
 *
 * Downloads all images referenced in the database (relative paths, aarambha.school URLs,
 * and unsplash URLs) and uploads them to MinIO, then updates the database records.
 *
 * Run: npx tsx scripts/migrate-images.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as Minio from "minio";
import "dotenv/config";
import crypto from "crypto";
import path from "path";

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/aarambha";
const MINIO_ENDPOINT = "localhost";
const MINIO_PORT = 9000;
const MINIO_BUCKET = "aarambha-uploads";
const MINIO_ACCESS_KEY = "minioadmin";
const MINIO_SECRET_KEY = "minioadmin";
const SOURCE_DOMAIN = "https://aarambha.school";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

/** Check whether a URL should be skipped (already on MinIO). */
function isMinioUrl(url: string): boolean {
  return url.includes("localhost:9000");
}

/** Check whether a URL is a candidate for migration. */
function shouldMigrate(url: string): boolean {
  if (!url || isMinioUrl(url)) return false;

  const isRelative = url.startsWith("/");
  const isAarambha = url.includes("aarambha.school");
  const isUnsplash = url.includes("unsplash.com") || url.includes("unsplash.it");

  return isRelative || isAarambha || isUnsplash;
}

/** Resolve a URL to a fully qualified download URL. */
function resolveUrl(url: string): string {
  if (url.startsWith("/")) {
    return `${SOURCE_DOMAIN}${url}`;
  }
  return url;
}

/** Guess the file extension from the URL or content-type header. */
function getExtension(url: string, contentType?: string | null): string {
  // Try to extract from URL path
  const urlPath = new URL(url).pathname;
  const ext = path.extname(urlPath);
  if (ext && ext.length <= 6) return ext;

  // Fall back to content-type
  if (contentType) {
    const mimeMap: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/gif": ".gif",
      "image/svg+xml": ".svg",
      "image/avif": ".avif",
    };
    return mimeMap[contentType] ?? ".jpg";
  }

  return ".jpg";
}

/** Download an image, upload to MinIO, and return the new URL. */
async function migrateImage(originalUrl: string): Promise<string | null> {
  const downloadUrl = resolveUrl(originalUrl);

  try {
    const response = await fetch(downloadUrl, {
      headers: { "User-Agent": "AarambhaImageMigrator/1.0" },
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(`  [SKIP] HTTP ${response.status} for ${downloadUrl}`);
      return null;
    }

    const contentType = response.headers.get("content-type");
    const ext = getExtension(downloadUrl, contentType);
    const uuid = crypto.randomUUID();
    const filename = `${uuid}${ext}`;

    const buffer = Buffer.from(await response.arrayBuffer());

    await minioClient.putObject(MINIO_BUCKET, filename, buffer, buffer.length, {
      "Content-Type": contentType ?? "application/octet-stream",
    });

    const newUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}/${filename}`;
    console.log(`  [OK] ${originalUrl} -> ${newUrl} (${buffer.length} bytes)`);
    return newUrl;
  } catch (err) {
    console.error(`  [ERROR] Failed to migrate ${downloadUrl}:`, (err as Error).message);
    return null;
  }
}

/**
 * Generic helper: query all rows from a table, migrate images in the specified field,
 * and update each row.
 */
async function migrateTableField(
  tableName: string,
  fieldName: string,
  findMany: () => Promise<Array<{ id: number; [key: string]: unknown }>>,
  update: (id: number, newUrl: string) => Promise<unknown>
): Promise<number> {
  console.log(`\n--- ${tableName}.${fieldName} ---`);
  const rows = await findMany();
  let migrated = 0;

  for (const row of rows) {
    const currentUrl = row[fieldName] as string | null;
    if (!currentUrl || !shouldMigrate(currentUrl)) {
      if (currentUrl && isMinioUrl(currentUrl)) {
        console.log(`  [SKIP] id=${row.id} already on MinIO`);
      }
      continue;
    }

    const newUrl = await migrateImage(currentUrl);
    if (newUrl) {
      await update(row.id, newUrl);
      migrated++;
    }
  }

  console.log(`  Migrated ${migrated}/${rows.length} rows`);
  return migrated;
}

async function main() {
  console.log("=== Image Migration to MinIO ===\n");
  console.log(`Database: ${DATABASE_URL}`);
  console.log(`MinIO: ${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}\n`);

  let totalMigrated = 0;

  // TeamMember.image
  totalMigrated += await migrateTableField(
    "TeamMember",
    "image",
    () => prisma.teamMember.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.teamMember.update({ where: { id }, data: { image: newUrl } })
  );

  // Testimonial.image
  totalMigrated += await migrateTableField(
    "Testimonial",
    "image",
    () => prisma.testimonial.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.testimonial.update({ where: { id }, data: { image: newUrl } })
  );

  // Partner.logo
  totalMigrated += await migrateTableField(
    "Partner",
    "logo",
    () => prisma.partner.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.partner.update({ where: { id }, data: { logo: newUrl } })
  );

  // Program.image
  totalMigrated += await migrateTableField(
    "Program",
    "image",
    () => prisma.program.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.program.update({ where: { id }, data: { image: newUrl } })
  );

  // HomepageFeature.image
  totalMigrated += await migrateTableField(
    "HomepageFeature",
    "image",
    () => prisma.homepageFeature.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.homepageFeature.update({ where: { id }, data: { image: newUrl } })
  );

  // SchoolLifeItem.image
  totalMigrated += await migrateTableField(
    "SchoolLifeItem",
    "image",
    () => prisma.schoolLifeItem.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.schoolLifeItem.update({ where: { id }, data: { image: newUrl } })
  );

  // Activity.image
  totalMigrated += await migrateTableField(
    "Activity",
    "image",
    () => prisma.activity.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.activity.update({ where: { id }, data: { image: newUrl } })
  );

  // Facility.image (nullable)
  totalMigrated += await migrateTableField(
    "Facility",
    "image",
    () => prisma.facility.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.facility.update({ where: { id }, data: { image: newUrl } })
  );

  // GalleryImage.src
  totalMigrated += await migrateTableField(
    "GalleryImage",
    "src",
    () => prisma.galleryImage.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.galleryImage.update({ where: { id }, data: { src: newUrl } })
  );

  // CommunityInvolvement.image (nullable)
  totalMigrated += await migrateTableField(
    "CommunityInvolvement",
    "image",
    () => prisma.communityInvolvement.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.communityInvolvement.update({ where: { id }, data: { image: newUrl } })
  );

  // SiteSettings where key = 'principal_image'
  console.log("\n--- SiteSettings (principal_image) ---");
  const principalSetting = await prisma.siteSettings.findUnique({
    where: { key: "principal_image" },
  });

  if (principalSetting && shouldMigrate(principalSetting.value)) {
    const newUrl = await migrateImage(principalSetting.value);
    if (newUrl) {
      await prisma.siteSettings.update({
        where: { key: "principal_image" },
        data: { value: newUrl },
      });
      totalMigrated++;
      console.log(`  Migrated 1 setting`);
    }
  } else if (principalSetting && isMinioUrl(principalSetting.value)) {
    console.log(`  [SKIP] principal_image already on MinIO`);
  } else if (!principalSetting) {
    console.log(`  [SKIP] principal_image setting not found`);
  }

  console.log(`\n=== Migration Complete: ${totalMigrated} images migrated ===`);
}

main()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
