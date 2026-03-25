export const dynamic = 'force-dynamic';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/db";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [facebookUrl, instagramUrl, tiktokUrl] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { key: "facebook_url" } }),
    prisma.siteSettings.findUnique({ where: { key: "instagram_url" } }),
    prisma.siteSettings.findUnique({ where: { key: "tiktok_url" } }),
  ]);

  const socialLinks = {
    facebook: facebookUrl?.value ?? "",
    instagram: instagramUrl?.value ?? "",
    tiktok: tiktokUrl?.value ?? "",
  };

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer socialLinks={socialLinks} />
    </>
  );
}
