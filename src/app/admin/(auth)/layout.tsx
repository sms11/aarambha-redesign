import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (session) {
    redirect('/admin');
  }

  return <>{children}</>;
}
