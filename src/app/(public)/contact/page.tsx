import { prisma } from "@/lib/db";
import ContactPageClient from "@/components/pages/ContactPageClient";

export default async function ContactPage() {
  const [contactItems, settingsRows] = await Promise.all([
    prisma.contactInfo.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findMany({
      where: {
        key: {
          in: [
            "map_embed_url",
            "whatsapp_number",
            "facebook_url",
            "instagram_url",
            "tiktok_url",
          ],
        },
      },
    }),
  ]);

  const settings = Object.fromEntries(
    settingsRows.map((s: { key: string; value: string }) => [s.key, s.value])
  );

  const mapEmbedUrl =
    settings.map_embed_url ??
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8!2d85.3!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAwLjAiTiA4NcKwMTgnMDAuMCJF!5e0!3m2!1sen!2snp!4v1";

  const whatsappNumber = settings.whatsapp_number ?? "9779823837865";

  const socialLinks = [
    {
      name: "Facebook",
      href:
        settings.facebook_url ??
        "https://www.facebook.com/profile.php?id=61572480778405",
      color: "#1877F2",
    },
    {
      name: "Instagram",
      href:
        settings.instagram_url ??
        "https://www.instagram.com/aarambha_school",
      color: "#E4405F",
    },
    {
      name: "TikTok",
      href:
        settings.tiktok_url ??
        "https://www.tiktok.com/@aarambha.school",
      color: "#000000",
    },
  ];

  /** Serialize Prisma DateTime fields to plain objects for client component */
  const serialized = JSON.parse(JSON.stringify(contactItems)) as typeof contactItems;

  return (
    <ContactPageClient
      contactItems={serialized}
      mapEmbedUrl={mapEmbedUrl}
      whatsappNumber={whatsappNumber}
      socialLinks={socialLinks}
    />
  );
}
