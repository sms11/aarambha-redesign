export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/db";
import { serialize } from "@/lib/utils";
import ProgramsPageClient from "@/components/pages/ProgramsPageClient";

export default async function ProgramsPage() {
  const [programs, specialFeatures, keyBenefits] = await Promise.all([
    prisma.program.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.specialFeature.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.keyBenefit.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <ProgramsPageClient
      programs={serialize(programs)}
      specialFeatures={serialize(specialFeatures)}
      keyBenefits={serialize(keyBenefits)}
    />
  );
}
