export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Facilities & Environment | Aarambha School",
  description: "Discover our learning resources, extra-curricular activities, smart classrooms, labs, library, and sports facilities.",
};
import { serialize } from "@/lib/utils";
import FacilitiesPageClient from "@/components/pages/FacilitiesPageClient";

export default async function FacilitiesPage() {
  const facilities = await prisma.facility.findMany({ orderBy: { sortOrder: "asc" } });

  type FacilityRow = typeof facilities[number];
  const beyondTextbooks = facilities.filter((f: FacilityRow) => f.category === "beyond_textbooks");
  const eca = facilities.filter((f: FacilityRow) => f.category === "eca");
  const resources = facilities.filter((f: FacilityRow) => f.category === "resources");

  return (
    <FacilitiesPageClient
      beyondTextbooks={serialize(beyondTextbooks)}
      eca={serialize(eca)}
      resources={serialize(resources)}
    />
  );
}
