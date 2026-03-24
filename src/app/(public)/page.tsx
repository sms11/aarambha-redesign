import { prisma } from "@/lib/db";
import { serialize } from "@/lib/utils";
import HomePageClient from "@/components/pages/HomePageClient";

export default async function HomePage() {
  const [
    stats,
    programs,
    teamMembers,
    testimonials,
    partners,
    features,
    schoolLifeItems,
    settingsRows,
  ] = await Promise.all([
    prisma.stat.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.program.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.partner.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.homepageFeature.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.schoolLifeItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findMany({
      where: {
        key: {
          in: [
            "principal_message",
            "principal_name",
            "principal_image",
            "about_text",
          ],
        },
      },
    }),
  ]);

  const settings = Object.fromEntries(
    settingsRows.map((s: { key: string; value: string }) => [s.key, s.value])
  );

  const principalData = {
    message:
      settings.principal_message ??
      "At Aarambha Sanskar Vidyalaya, we blend traditional values with modern learning to nurture curious, creative, and compassionate leaders.",
    name: settings.principal_name ?? "Naresh Prasad Shrestha",
    image: settings.principal_image ?? "/images/principal.webp",
  };

  let aboutText: string[];
  try {
    aboutText = JSON.parse(settings.about_text ?? "[]");
  } catch {
    aboutText = [
      "Welcome to Aarambha School, a progressive K-12 educational institution strategically located in the heart of Kathmandu at Pipal Bot, Galko Pakha Marga, Ward Number 26.",
    ];
  }

  return (
    <HomePageClient
      stats={serialize(stats)}
      programs={serialize(programs)}
      schoolLifeItems={serialize(schoolLifeItems)}
      teamMembers={serialize(teamMembers)}
      testimonials={serialize(testimonials)}
      partners={serialize(partners)}
      features={serialize(features)}
      principalData={principalData}
      aboutText={aboutText}
    />
  );
}
