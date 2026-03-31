export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "About Us | Aarambha School",
  description: "Learn about Aarambha School's mission, vision, core values, philosophy, and leadership team. A progressive K-12 institution in Kathmandu.",
};
import { serialize } from "@/lib/utils";
import AboutPageClient from "@/components/pages/AboutPageClient";

export default async function AboutPage() {
  const [teamMembers, coreValues, philosophy, whatWeOffer, newsEvents, settingsRows] =
    await Promise.all([
      prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.coreValue.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.philosophy.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.whatWeOffer.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.newsEvent.findMany({ orderBy: { date: "desc" }, take: 8 }),
      prisma.siteSettings.findMany({
        where: {
          key: {
            in: [
              "mission", "vision", "about_text",
              "principal_message", "principal_name",
              "principal_title", "principal_image",
              "vice_principal_message", "vice_principal_name",
              "vice_principal_title", "vice_principal_image",
              "vice_principal_highlights",
            ],
          },
        },
      }),
    ]);

  const settings = Object.fromEntries(
    settingsRows.map((s: { key: string; value: string }) => [s.key, s.value])
  );

  const mission =
    settings.mission ??
    "Our mission is to blend digital technology with Eastern philosophy, fostering lifelong learners and compassionate leaders through a STEAM-based, balanced curriculum that promotes academic excellence, personal growth, and cultural connection.";

  const vision =
    settings.vision ??
    "To create a transformative educational experience that blends Eastern values and philosophy with 21st-century digital innovation, fostering the holistic development of every student — intellectually, emotionally, ethically, and physically — equipping them to thrive in a rapidly changing world.";

  let aboutText: string[];
  try {
    aboutText = JSON.parse(settings.about_text ?? "[]");
  } catch {
    aboutText = [
      "Aarambha School is a progressive K-12 educational institution strategically located in the heart of the city at Pipal Bot, Galko Pakha Marga, Ward Number 26, Kathmandu.",
      "Aarambha School is a common vision of eminent academicians, successful entrepreneurs, tech-leaders and successful personalities from different walks of life. They joined hands together to provide a student-centered, inquiry-based, and interdisciplinary education that fosters the holistic development of each individual.",
      "As a pioneering institution, the school represents the convergence of Eastern wisdom and modern educational innovation, creating a unique learning environment that prepares students for the challenges and opportunities of the 21st century.",
      "We prioritize hands-on, inquiry-based learning experiences that integrate the core principles of Science, Technology, Engineering, Arts, and Mathematics (STEAM). This approach equips our students with the tools they need to tackle complex real-world challenges with confidence and enthusiasm.",
    ];
  }

  const principalData = {
    message:
      settings.principal_message ??
      "At Aarambha Sanskar Vidyalaya, we blend traditional values with modern learning to nurture curious, creative, and compassionate leaders.",
    name: settings.principal_name ?? "Naresh Prasad Shrestha",
    title: settings.principal_title ?? "Chairman & Principal",
    image: settings.principal_image ?? "/images/principal.webp",
  };

  let vpHighlights: string[] = [];
  try {
    vpHighlights = JSON.parse(settings.vice_principal_highlights ?? "[]");
  } catch {
    vpHighlights = [];
  }

  const vicePrincipalData = settings.vice_principal_name
    ? {
        message: settings.vice_principal_message ?? "",
        name: settings.vice_principal_name,
        title: settings.vice_principal_title ?? "Vice Principal, Aarambha School",
        image: settings.vice_principal_image ?? "",
        highlights: vpHighlights,
      }
    : null;

  return (
    <AboutPageClient
      coreValues={serialize(coreValues)}
      philosophy={serialize(philosophy)}
      teamMembers={serialize(teamMembers)}
      mission={mission}
      vision={vision}
      aboutText={aboutText}
      principalData={principalData}
      vicePrincipalData={vicePrincipalData}
      whatWeOffer={serialize(whatWeOffer)}
      newsEvents={serialize(newsEvents)}
    />
  );
}
