import { prisma } from "@/lib/db";
import ProgramsPageClient from "@/components/pages/ProgramsPageClient";

export default async function ProgramsPage() {
  const [programs, specialFeatures, keyBenefits] = await Promise.all([
    prisma.program.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.specialFeature.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.keyBenefit.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  /** Serialize Prisma DateTime fields to plain objects for client component */
  const serialize = <T extends Record<string, unknown>>(items: T[]) =>
    JSON.parse(JSON.stringify(items)) as T[];

  return (
    <ProgramsPageClient
      programs={serialize(programs)}
      specialFeatures={serialize(specialFeatures)}
      keyBenefits={serialize(keyBenefits)}
    />
  );
}
