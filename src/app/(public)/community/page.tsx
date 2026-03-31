export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Community | Aarambha School",
  description: "Join the Aarambha School community. Parent-teacher involvement, activities, and partnerships that support student success.",
};
import { serialize } from "@/lib/utils";
import AdmissionsPageClient from "@/components/pages/AdmissionsPageClient";

export default async function AdmissionsPage() {
  const [communityItems, testimonials, partners] = await Promise.all([
    prisma.communityInvolvement.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.partner.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  /** Group community involvement items by section */
  const involvementItems = communityItems.filter(
    (item: typeof communityItems[number]) => item.section === "parent_teacher"
  );
  const businessPartnerships = communityItems.filter(
    (item: typeof communityItems[number]) => item.section === "business"
  );
  const educationalPartnerships = communityItems.filter(
    (item: typeof communityItems[number]) => item.section === "educational"
  );

  return (
    <AdmissionsPageClient
      involvementItems={serialize(involvementItems)}
      businessPartnerships={serialize(businessPartnerships)}
      educationalPartnerships={serialize(educationalPartnerships)}
      testimonials={serialize(testimonials)}
      partners={serialize(partners)}
    />
  );
}
