/**
 * Image Migration Script v2
 *
 * Finds all images in the database that are NOT yet on MinIO, then tries
 * multiple URL strategies to locate the actual files on aarambha.school:
 *   1. Direct URL: https://aarambha.school/images/...
 *   2. www subdomain: https://www.aarambha.school/images/...
 *   3. Next.js image optimizer: /_next/image?url=...&w=640&q=75
 *   4. Crawl HTML pages to discover real image URLs
 *
 * Successfully downloaded images are uploaded to MinIO and the database
 * records are updated.
 *
 * Run: npx tsx scripts/migrate-images-v2.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as Minio from "minio";
import "dotenv/config";
import crypto from "crypto";
import path from "path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const DATABASE_URL =
  process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/aarambha";
const MINIO_ENDPOINT = "localhost";
const MINIO_PORT = 9000;
const MINIO_BUCKET = "aarambha-uploads";
const MINIO_ACCESS_KEY = "minioadmin";
const MINIO_SECRET_KEY = "minioadmin";

const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const DOMAINS = ["https://aarambha.school", "https://www.aarambha.school"];

/** Pages to crawl for discovering image URLs */
const CRAWL_PAGES = [
  "/",
  "/about",
  "/programs",
  "/admissions",
  "/facilities",
  "/gallery",
  "/contact",
  "/community",
];

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------

interface MigrationResult {
  table: string;
  field: string;
  recordId: number;
  originalUrl: string;
  resolvedUrl: string;
  newUrl: string;
}

interface FailureResult {
  table: string;
  field: string;
  recordId: number;
  originalUrl: string;
  triedUrls: string[];
}

const successes: MigrationResult[] = [];
const failures: FailureResult[] = [];

/** Cache: originalUrl -> working download URL (or null if all attempts failed) */
const urlResolutionCache = new Map<string, string | null>();

/** Cache: crawled image URLs discovered from HTML pages */
let crawledImageUrls: string[] = [];
let hasCrawled = false;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMinioUrl(url: string): boolean {
  return url.includes("localhost:9000");
}

function shouldMigrate(url: string): boolean {
  if (!url || isMinioUrl(url)) return false;
  return true;
}

/** Fetch with timeout and redirect-following */
async function fetchWithTimeout(
  url: string,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: controller.signal,
    });
    return response;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Try to fetch a URL and return it only if the response is 200 and looks like an image */
async function tryUrl(url: string): Promise<{ url: string; response: Response } | null> {
  const response = await fetchWithTimeout(url);
  if (!response || !response.ok) return null;

  const contentType = response.headers.get("content-type") ?? "";
  // Accept image content types, or octet-stream (some servers don't set the right type)
  if (
    contentType.startsWith("image/") ||
    contentType.includes("octet-stream") ||
    contentType.includes("webp") ||
    contentType.includes("avif")
  ) {
    return { url, response };
  }

  // If content-type is not clearly an image, check if the URL looks like an image file
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif", ".ico"];
  const lowerUrl = url.toLowerCase();
  if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
    return { url, response };
  }

  return null;
}

/** Guess the file extension from the URL or content-type header */
function getExtension(url: string, contentType?: string | null): string {
  // Try to extract from URL path (handle query params)
  try {
    const urlObj = new URL(url);
    // For Next.js image URLs, extract from the `url` query param
    const innerUrl = urlObj.searchParams.get("url");
    if (innerUrl) {
      const ext = path.extname(innerUrl);
      if (ext && ext.length <= 6) return ext;
    }
    const ext = path.extname(urlObj.pathname);
    if (ext && ext.length <= 6) return ext;
  } catch {
    // URL parsing failed, continue to content-type
  }

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
    for (const [mime, ext] of Object.entries(mimeMap)) {
      if (contentType.includes(mime)) return ext;
    }
  }

  return ".jpg";
}

// ---------------------------------------------------------------------------
// URL Resolution Strategies
// ---------------------------------------------------------------------------

/**
 * Build all candidate URLs to try for a given database path.
 * Ordered from most likely to least likely.
 */
function buildCandidateUrls(originalUrl: string): string[] {
  const candidates: string[] = [];

  if (originalUrl.startsWith("http://") || originalUrl.startsWith("https://")) {
    // It's already a full URL - try it directly, and with both domains
    candidates.push(originalUrl);
    for (const domain of DOMAINS) {
      try {
        const urlObj = new URL(originalUrl);
        const domainObj = new URL(domain);
        urlObj.hostname = domainObj.hostname;
        urlObj.protocol = domainObj.protocol;
        const rebuilt = urlObj.toString();
        if (rebuilt !== originalUrl) {
          candidates.push(rebuilt);
        }
      } catch {
        // skip
      }
    }
  } else if (originalUrl.startsWith("/")) {
    // Relative path - try with both domains, both direct and via Next.js image optimizer
    for (const domain of DOMAINS) {
      // Direct URL
      candidates.push(`${domain}${originalUrl}`);
    }
    for (const domain of DOMAINS) {
      // Next.js image optimizer with various widths
      const encodedPath = encodeURIComponent(originalUrl);
      candidates.push(`${domain}/_next/image?url=${encodedPath}&w=640&q=75`);
      candidates.push(`${domain}/_next/image?url=${encodedPath}&w=1080&q=75`);
      candidates.push(`${domain}/_next/image?url=${encodedPath}&w=384&q=75`);
    }
  } else {
    // Bare filename or unknown format - try relative with /images/ prefix
    for (const domain of DOMAINS) {
      candidates.push(`${domain}/${originalUrl}`);
      candidates.push(`${domain}/images/${originalUrl}`);
    }
  }

  return candidates;
}

/**
 * Extract the "key part" of a URL for fuzzy matching against crawled URLs.
 * e.g. "/images/team/naresh.webp" -> "naresh"
 */
function extractImageKey(urlOrPath: string): string {
  try {
    // Get just the filename without extension
    let pathname = urlOrPath;
    try {
      pathname = new URL(urlOrPath).pathname;
    } catch {
      // Already a path
    }
    const basename = path.basename(pathname);
    const nameWithoutExt = basename.replace(/\.[^.]+$/, "");
    return nameWithoutExt.toLowerCase();
  } catch {
    return urlOrPath.toLowerCase();
  }
}

// ---------------------------------------------------------------------------
// HTML Crawling
// ---------------------------------------------------------------------------

/**
 * Crawl the aarambha.school pages to discover actual image URLs used in the site.
 */
async function crawlForImageUrls(): Promise<void> {
  if (hasCrawled) return;
  hasCrawled = true;

  console.log("\n=== Crawling aarambha.school pages for image URLs ===\n");

  const allUrls = new Set<string>();

  for (const pagePath of CRAWL_PAGES) {
    for (const domain of DOMAINS) {
      const pageUrl = `${domain}${pagePath}`;
      console.log(`  Crawling: ${pageUrl}`);

      const response = await fetchWithTimeout(pageUrl);
      if (!response || !response.ok) {
        console.log(`    [SKIP] HTTP ${response?.status ?? "timeout"}`);
        continue;
      }

      const html = await response.text();

      // Extract image URLs using multiple regex patterns

      // 1. <img src="..." /> and <img srcSet="..." />
      const imgSrcRegex = /(?:src|srcSet|data-src|data-srcset)\s*=\s*["']([^"']+)["']/gi;
      let match;
      while ((match = imgSrcRegex.exec(html)) !== null) {
        const src = match[1];
        if (isImageUrl(src)) {
          allUrls.add(resolveToAbsolute(src, domain));
        }
        // srcSet can contain multiple URLs separated by commas
        if (src.includes(",")) {
          for (const part of src.split(",")) {
            const trimmed = part.trim().split(/\s+/)[0];
            if (isImageUrl(trimmed)) {
              allUrls.add(resolveToAbsolute(trimmed, domain));
            }
          }
        }
      }

      // 2. background-image: url(...)
      const bgRegex = /background-image\s*:\s*url\(\s*["']?([^"')]+)["']?\s*\)/gi;
      while ((match = bgRegex.exec(html)) !== null) {
        if (isImageUrl(match[1])) {
          allUrls.add(resolveToAbsolute(match[1], domain));
        }
      }

      // 3. Next.js JSON data (in __NEXT_DATA__ or RSC payloads)
      const nextImageRegex = /\/_next\/(?:image|static)[^"'\s)]+/g;
      while ((match = nextImageRegex.exec(html)) !== null) {
        allUrls.add(resolveToAbsolute(match[0], domain));
      }

      // 4. Any URL that looks like an image path
      const genericImageRegex = /["'(](\/[^"'\s)]*\.(?:jpg|jpeg|png|webp|gif|svg|avif))["'\s)]/gi;
      while ((match = genericImageRegex.exec(html)) !== null) {
        allUrls.add(resolveToAbsolute(match[1], domain));
      }

      // Only need to successfully crawl one domain variant per page
      break;
    }
  }

  crawledImageUrls = Array.from(allUrls);
  console.log(`\n  Discovered ${crawledImageUrls.length} image URLs from crawling\n`);
}

function isImageUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];
  const hasImageExt = imageExtensions.some((ext) => lower.includes(ext));
  const isNextImage = lower.includes("/_next/image");
  return hasImageExt || isNextImage;
}

function resolveToAbsolute(url: string, domain: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${domain}${url}`;
  return `${domain}/${url}`;
}

/**
 * Find crawled URLs that might match the given database path using fuzzy matching.
 */
function findCrawledMatches(originalUrl: string): string[] {
  const key = extractImageKey(originalUrl);
  if (!key || key.length < 3) return [];

  return crawledImageUrls.filter((crawledUrl) => {
    const crawledKey = extractImageKey(crawledUrl);
    return crawledKey.includes(key) || key.includes(crawledKey);
  });
}

// ---------------------------------------------------------------------------
// Image Download & Upload
// ---------------------------------------------------------------------------

/**
 * Try all strategies to find and download an image, then upload to MinIO.
 * Returns the new MinIO URL on success, or null on failure.
 */
async function resolveAndMigrateImage(
  originalUrl: string,
  table: string,
  field: string,
  recordId: number
): Promise<string | null> {
  // Check cache first
  if (urlResolutionCache.has(originalUrl)) {
    const cachedResult = urlResolutionCache.get(originalUrl);
    if (cachedResult === null) {
      failures.push({
        table,
        field,
        recordId,
        originalUrl,
        triedUrls: ["(cached failure)"],
      });
      return null;
    }
    // Re-download from cached working URL
    return await downloadAndUpload(cachedResult, originalUrl, table, field, recordId);
  }

  const triedUrls: string[] = [];

  // Strategy 1 & 2 & 3: Try built candidate URLs (direct, www, Next.js optimizer)
  const candidates = buildCandidateUrls(originalUrl);
  for (const candidate of candidates) {
    triedUrls.push(candidate);
    const result = await tryUrl(candidate);
    if (result) {
      urlResolutionCache.set(originalUrl, candidate);
      return await uploadFromResponse(
        result.response,
        result.url,
        originalUrl,
        table,
        field,
        recordId
      );
    }
  }

  // Strategy 4: Try fuzzy-matched crawled URLs
  await crawlForImageUrls();
  const crawledMatches = findCrawledMatches(originalUrl);
  for (const crawledUrl of crawledMatches) {
    if (triedUrls.includes(crawledUrl)) continue;
    triedUrls.push(crawledUrl);
    const result = await tryUrl(crawledUrl);
    if (result) {
      urlResolutionCache.set(originalUrl, crawledUrl);
      return await uploadFromResponse(
        result.response,
        result.url,
        originalUrl,
        table,
        field,
        recordId
      );
    }
  }

  // All strategies failed
  urlResolutionCache.set(originalUrl, null);
  console.error(`  [FAIL] Could not resolve: ${originalUrl}`);
  failures.push({ table, field, recordId, originalUrl, triedUrls });
  return null;
}

async function downloadAndUpload(
  url: string,
  originalUrl: string,
  table: string,
  field: string,
  recordId: number
): Promise<string | null> {
  const result = await tryUrl(url);
  if (!result) {
    failures.push({ table, field, recordId, originalUrl, triedUrls: [url] });
    return null;
  }
  return await uploadFromResponse(result.response, result.url, originalUrl, table, field, recordId);
}

async function uploadFromResponse(
  response: Response,
  resolvedUrl: string,
  originalUrl: string,
  table: string,
  field: string,
  recordId: number
): Promise<string | null> {
  try {
    const contentType = response.headers.get("content-type");
    const ext = getExtension(resolvedUrl, contentType);
    const uuid = crypto.randomUUID();
    const filename = `${uuid}${ext}`;

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length < 100) {
      console.error(`  [SKIP] Suspiciously small file (${buffer.length} bytes): ${resolvedUrl}`);
      failures.push({ table, field, recordId, originalUrl, triedUrls: [resolvedUrl] });
      return null;
    }

    await minioClient.putObject(MINIO_BUCKET, filename, buffer, buffer.length, {
      "Content-Type": contentType ?? "application/octet-stream",
    });

    const newUrl = `http://${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}/${filename}`;
    console.log(
      `  [OK] ${originalUrl} -> ${newUrl} (${buffer.length} bytes, via ${resolvedUrl})`
    );

    successes.push({ table, field, recordId, originalUrl, resolvedUrl, newUrl });
    return newUrl;
  } catch (err) {
    console.error(`  [ERROR] Upload failed for ${resolvedUrl}:`, (err as Error).message);
    failures.push({ table, field, recordId, originalUrl, triedUrls: [resolvedUrl] });
    return null;
  }
}

// ---------------------------------------------------------------------------
// Table Migration
// ---------------------------------------------------------------------------

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

    const newUrl = await resolveAndMigrateImage(currentUrl, tableName, fieldName, row.id);
    if (newUrl) {
      await update(row.id, newUrl);
      migrated++;
    }
  }

  console.log(`  Migrated ${migrated}/${rows.length} rows in ${tableName}.${fieldName}`);
  return migrated;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Image Migration v2 (Multi-Strategy) ===\n");
  console.log(`Database: ${DATABASE_URL}`);
  console.log(`MinIO: ${MINIO_ENDPOINT}:${MINIO_PORT}/${MINIO_BUCKET}`);
  console.log(`Strategies: Direct URL, www subdomain, Next.js optimizer, HTML crawling\n`);

  // Ensure MinIO bucket exists
  const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
  if (!bucketExists) {
    await minioClient.makeBucket(MINIO_BUCKET);
    console.log(`Created MinIO bucket: ${MINIO_BUCKET}`);
  }

  // Pre-crawl pages to build the image URL cache
  await crawlForImageUrls();

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
    () =>
      prisma.homepageFeature.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.homepageFeature.update({ where: { id }, data: { image: newUrl } })
  );

  // SchoolLifeItem.image
  totalMigrated += await migrateTableField(
    "SchoolLifeItem",
    "image",
    () =>
      prisma.schoolLifeItem.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.schoolLifeItem.update({ where: { id }, data: { image: newUrl } })
  );

  // Activity.image
  totalMigrated += await migrateTableField(
    "Activity",
    "image",
    () => prisma.activity.findMany() as Promise<Array<{ id: number; [key: string]: unknown }>>,
    (id, newUrl) => prisma.activity.update({ where: { id }, data: { image: newUrl } })
  );

  // Facility.image
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

  // CommunityInvolvement.image
  totalMigrated += await migrateTableField(
    "CommunityInvolvement",
    "image",
    () =>
      prisma.communityInvolvement.findMany() as Promise<
        Array<{ id: number; [key: string]: unknown }>
      >,
    (id, newUrl) => prisma.communityInvolvement.update({ where: { id }, data: { image: newUrl } })
  );

  // SiteSettings where key contains 'image'
  console.log("\n--- SiteSettings (image keys) ---");
  const imageSettings = await prisma.siteSettings.findMany();
  for (const setting of imageSettings) {
    const isImageKey =
      setting.key.toLowerCase().includes("image") ||
      setting.key.toLowerCase().includes("logo") ||
      setting.key.toLowerCase().includes("photo");

    if (!isImageKey) continue;

    if (!shouldMigrate(setting.value)) {
      if (isMinioUrl(setting.value)) {
        console.log(`  [SKIP] ${setting.key} already on MinIO`);
      }
      continue;
    }

    const newUrl = await resolveAndMigrateImage(
      setting.value,
      "SiteSettings",
      setting.key,
      setting.id
    );
    if (newUrl) {
      await prisma.siteSettings.update({
        where: { key: setting.key },
        data: { value: newUrl },
      });
      totalMigrated++;
    }
  }

  // ---------------------------------------------------------------------------
  // Summary Report
  // ---------------------------------------------------------------------------

  console.log("\n" + "=".repeat(70));
  console.log("=== MIGRATION SUMMARY ===");
  console.log("=".repeat(70));

  console.log(`\nTotal images successfully migrated: ${successes.length}`);
  console.log(`Total images that failed: ${failures.length}`);

  if (successes.length > 0) {
    console.log("\n--- Successfully Migrated ---");
    for (const s of successes) {
      console.log(`  [OK] ${s.table}.${s.field} (id=${s.recordId})`);
      console.log(`       ${s.originalUrl}`);
      console.log(`    -> ${s.newUrl}`);
    }
  }

  if (failures.length > 0) {
    console.log("\n--- Failed (could not find working URL) ---");
    for (const f of failures) {
      console.log(`  [FAIL] ${f.table}.${f.field} (id=${f.recordId})`);
      console.log(`         Original: ${f.originalUrl}`);
      console.log(`         Tried: ${f.triedUrls.length} URL(s)`);
      for (const url of f.triedUrls.slice(0, 5)) {
        console.log(`           - ${url}`);
      }
      if (f.triedUrls.length > 5) {
        console.log(`           ... and ${f.triedUrls.length - 5} more`);
      }
    }
  }

  console.log("\n--- Database Records Updated ---");
  const updatedByTable = new Map<string, number>();
  for (const s of successes) {
    const key = `${s.table}.${s.field}`;
    updatedByTable.set(key, (updatedByTable.get(key) ?? 0) + 1);
  }
  for (const [key, count] of updatedByTable.entries()) {
    console.log(`  ${key}: ${count} record(s) updated`);
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
