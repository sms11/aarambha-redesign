import { prisma } from "@/lib/db";
import { serialize } from "@/lib/utils";
import FacilitiesPageClient from "@/components/pages/FacilitiesPageClient";

export default async function FacilitiesPage() {
  const [activities, facilities, settingsRows] = await Promise.all([
    prisma.activity.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.facility.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findMany({
      where: {
        key: { in: ["counseling_points"] },
      },
    }),
  ]);

  const settings = Object.fromEntries(
    settingsRows.map((s: { key: string; value: string }) => [s.key, s.value])
  );

  let counselingPoints: string[];
  try {
    counselingPoints = JSON.parse(settings.counseling_points ?? "[]");
  } catch {
    counselingPoints = [
      "Personal counseling services from qualified professionals.",
      "Helping students overcome challenges and emotional hurdles.",
      "Providing guidance to help students thrive academically and personally.",
      "Offering a secure space where students can openly discuss concerns.",
    ];
  }

  /** Group facilities by category */
  type FacilityRow = typeof facilities[number];
  const resources = facilities.filter((f: FacilityRow) => f.category === "resource");
  const labs = facilities.filter((f: FacilityRow) => f.category === "lab");
  const digitalItems = facilities.filter((f: FacilityRow) => f.category === "digital");
  const healthItems = facilities.filter((f: FacilityRow) => f.category === "health");
  const conveniences = facilities.filter((f: FacilityRow) => f.category === "convenience");

  return (
    <FacilitiesPageClient
      activities={serialize(activities)}
      resources={serialize(resources)}
      labs={serialize(labs)}
      digitalItems={serialize(digitalItems)}
      healthItems={serialize(healthItems)}
      conveniences={serialize(conveniences)}
      counselingPoints={counselingPoints}
    />
  );
}
