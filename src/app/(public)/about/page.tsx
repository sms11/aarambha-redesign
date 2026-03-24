import { prisma } from "@/lib/db";
import { serialize } from "@/lib/utils";
import AboutPageClient from "@/components/pages/AboutPageClient";

export default async function AboutPage() {
  const [teamMembers, coreValues, philosophy, settingsRows] =
    await Promise.all([
      prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.coreValue.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.philosophy.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.siteSettings.findMany({
        where: {
          key: { in: ["mission", "vision", "about_text"] },
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

  return (
    <AboutPageClient
      coreValues={serialize(coreValues)}
      philosophy={serialize(philosophy)}
      teamMembers={serialize(teamMembers)}
      mission={mission}
      vision={vision}
      aboutText={aboutText}
    />
  );
}
