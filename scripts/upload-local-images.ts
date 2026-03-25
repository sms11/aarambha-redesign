/**
 * Upload all local images from public/images/ to MinIO
 * and update database records to use MinIO URLs.
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as Minio from "minio";
import "dotenv/config";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }),
});

const minio = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const BUCKET = process.env.MINIO_BUCKET || "aarambha-uploads";
const MINIO_BASE = process.env.MINIO_PUBLIC_URL
  ? `${process.env.MINIO_PUBLIC_URL}/${BUCKET}`
  : `http://localhost:9000/${BUCKET}`;

// Map: relative path -> MinIO URL
const urlMap: Record<string, string> = {};

async function uploadAllLocalImages() {
  const publicDir = path.join(process.cwd(), "public", "images");
  const files = getAllFiles(publicDir);

  console.log(`Found ${files.length} local images\n`);

  for (const filePath of files) {
    const relativePath = "/" + path.relative(path.join(process.cwd(), "public"), filePath);
    const ext = path.extname(filePath);
    const fileName = `${crypto.randomUUID()}${ext}`;

    const contentType =
      ext === ".webp" ? "image/webp" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      ext === ".png" ? "image/png" : "application/octet-stream";

    const buffer = fs.readFileSync(filePath);

    await minio.putObject(BUCKET, fileName, buffer, buffer.length, {
      "Content-Type": contentType,
    });

    const minioUrl = `${MINIO_BASE}/${fileName}`;
    urlMap[relativePath] = minioUrl;
    console.log(`  ✓ ${relativePath} → ${fileName}`);
  }

  console.log(`\nUploaded ${Object.keys(urlMap).length} images to MinIO\n`);
}

function getAllFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath));
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function updateDatabase() {
  let updated = 0;

  // Helper to update image fields
  async function updateTable(
    tableName: string,
    field: string,
    findMany: () => Promise<{ id: number; [key: string]: unknown }[]>,
    update: (id: number, url: string) => Promise<unknown>
  ) {
    const rows = await findMany();
    for (const row of rows) {
      const currentUrl = row[field] as string;
      if (!currentUrl || currentUrl.includes("localhost:9000")) continue;

      const minioUrl = urlMap[currentUrl];
      if (minioUrl) {
        await update(row.id, minioUrl);
        console.log(`  ✓ ${tableName}[${row.id}].${field}: ${currentUrl} → updated`);
        updated++;
      }
    }
  }

  console.log("Updating database records...\n");

  // TeamMember.image
  await updateTable("TeamMember", "image",
    () => prisma.teamMember.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.teamMember.update({ where: { id }, data: { image: url } })
  );

  // Testimonial.image
  await updateTable("Testimonial", "image",
    () => prisma.testimonial.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.testimonial.update({ where: { id }, data: { image: url } })
  );

  // Partner.logo
  await updateTable("Partner", "logo",
    () => prisma.partner.findMany() as Promise<{ id: number; logo: string }[]>,
    (id, url) => prisma.partner.update({ where: { id }, data: { logo: url } })
  );

  // Program.image
  await updateTable("Program", "image",
    () => prisma.program.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.program.update({ where: { id }, data: { image: url } })
  );

  // HomepageFeature.image
  await updateTable("HomepageFeature", "image",
    () => prisma.homepageFeature.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.homepageFeature.update({ where: { id }, data: { image: url } })
  );

  // SchoolLifeItem.image
  await updateTable("SchoolLifeItem", "image",
    () => prisma.schoolLifeItem.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.schoolLifeItem.update({ where: { id }, data: { image: url } })
  );

  // Activity.image
  await updateTable("Activity", "image",
    () => prisma.activity.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.activity.update({ where: { id }, data: { image: url } })
  );

  // Facility.image
  await updateTable("Facility", "image",
    () => prisma.facility.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.facility.update({ where: { id }, data: { image: url } })
  );

  // GalleryImage.src
  await updateTable("GalleryImage", "src",
    () => prisma.galleryImage.findMany() as Promise<{ id: number; src: string }[]>,
    (id, url) => prisma.galleryImage.update({ where: { id }, data: { src: url } })
  );

  // CommunityInvolvement.image
  await updateTable("CommunityInvolvement", "image",
    () => prisma.communityInvolvement.findMany() as Promise<{ id: number; image: string }[]>,
    (id, url) => prisma.communityInvolvement.update({ where: { id }, data: { image: url } })
  );

  // SiteSettings with image values
  const settings = await prisma.siteSettings.findMany();
  for (const s of settings) {
    if (s.value && !s.value.includes("localhost:9000") && urlMap[s.value]) {
      await prisma.siteSettings.update({ where: { id: s.id }, data: { value: urlMap[s.value] } });
      console.log(`  ✓ SiteSettings[${s.key}]: updated`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} database records\n`);
}

async function main() {
  try {
    await uploadAllLocalImages();
    await updateDatabase();
    console.log("Done!");
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
