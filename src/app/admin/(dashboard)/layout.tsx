import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) {
    redirect('/admin/login');
  }

  const unreadCount = await prisma.contactSubmission.count({ where: { read: false } });

  return (
    <div className="flex min-h-screen">
      <Sidebar unreadCount={unreadCount} />
      <div className="flex-1 bg-[#FFF9F5] overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
}
