export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { prisma } from '@/lib/db';

export const metadata: Metadata = {
  title: "News & Events | Aarambha School",
  description: "Latest news, events, and announcements from Aarambha School. Stay updated with school activities and community happenings.",
};
import { serialize } from '@/lib/utils';
import NewsPageClient from '@/components/pages/NewsPageClient';

export default async function NewsPage() {
  const items = await prisma.newsEvent.findMany({
    orderBy: { date: 'desc' },
  });

  const serialized = JSON.parse(JSON.stringify(items));
  return <NewsPageClient items={serialized} />;
}
