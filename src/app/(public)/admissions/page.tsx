import { prisma } from "@/lib/db";
import AdmissionsPageClient from "@/components/pages/AdmissionsPageClient";

export default async function AdmissionsPage() {
  const [communityItems, testimonials, partners] = await Promise.all([
    prisma.communityInvolvement.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.partner.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  /** Group community involvement items by section */
  const involvementItems = communityItems.filter(
    (item: typeof communityItems[number]) => item.section === "involvement"
  );
  const businessPartnerships = communityItems.filter(
    (item: typeof communityItems[number]) => item.section === "business"
  );
  const educationalPartnerships = communityItems.filter(
    (item: typeof communityItems[number]) => item.section === "educational"
  );

  /** Serialize Prisma DateTime fields to plain objects for client component */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialize = <T,>(items: T[]): T[] =>
    JSON.parse(JSON.stringify(items));

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
