import { prisma } from '@/lib/db';
import Link from 'next/link';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  return 'Good evening!';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const statsConfig = [
  { key: 'teamCount' as const, label: 'Team Members', color: '#14B8A6', emoji: '👥' },
  { key: 'programCount' as const, label: 'Programs', color: '#8B5CF6', emoji: '🎓' },
  { key: 'galleryCount' as const, label: 'Gallery Images', color: '#EC4899', emoji: '📸' },
  { key: 'unreadCount' as const, label: 'Unread Messages', color: '#FF6B35', emoji: '✉️' },
  { key: 'enquiryCount' as const, label: 'Unread Enquiries', color: '#F59E0B', emoji: '🎓' },
];

const quickActions = [
  {
    href: '/admin/team',
    label: 'Team',
    color: '#14B8A6',
    emoji: '👥',
    helper: 'Manage team member photos and roles',
  },
  {
    href: '/admin/programs',
    label: 'Programs',
    color: '#8B5CF6',
    emoji: '🎓',
    helper: 'Edit academic programs and details',
  },
  {
    href: '/admin/gallery',
    label: 'Gallery',
    color: '#EC4899',
    emoji: '📸',
    helper: 'Upload and organize photo gallery',
  },
  {
    href: '/admin/facilities',
    label: 'Facilities',
    color: '#F59E0B',
    emoji: '🏫',
    helper: 'Update campus facilities and activities',
  },
  {
    href: '/admin/about',
    label: 'About',
    color: '#3B82F6',
    emoji: 'ℹ️',
    helper: 'Edit school values and philosophy',
  },
  {
    href: '/admin/contact',
    label: 'Contact',
    color: '#FF6B35',
    emoji: '✉️',
    helper: 'View messages and update contact info',
  },
  {
    href: '/admin/admissions',
    label: 'Admissions',
    color: '#F59E0B',
    emoji: '🎓',
    helper: 'View student enquiry submissions',
  },
];

export default async function AdminDashboardPage() {
  const [teamCount, programCount, galleryCount, unreadCount, enquiryCount] = await Promise.all([
    prisma.teamMember.count(),
    prisma.program.count(),
    prisma.galleryImage.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.admissionEnquiry.count({ where: { read: false } }),
  ]);

  const counts = { teamCount, programCount, galleryCount, unreadCount, enquiryCount };
  const greeting = getGreeting();
  const formattedDate = getFormattedDate();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold font-[family-name:var(--font-display)]"
          style={{ color: '#1B2A4A' }}
        >
          {greeting}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {statsConfig.map((stat) => (
          <div
            key={stat.key}
            className="relative bg-white rounded-2xl p-6 shadow-md shadow-black/5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 overflow-hidden"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <span className="absolute top-3 right-3 text-3xl opacity-30 select-none" aria-hidden="true">
              {stat.emoji}
            </span>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {counts[stat.key]}
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2
          className="text-xl font-bold font-[family-name:var(--font-display)]"
          style={{ color: '#1B2A4A' }}
        >
          Quick Actions
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Jump to any section to manage your content
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group bg-white rounded-2xl p-6 shadow-md shadow-black/5 border-2 border-transparent hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-xl mb-4"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <span role="img" aria-hidden="true">{action.emoji}</span>
            </div>
            <p className="font-bold text-gray-900 group-hover:text-gray-700">
              {action.label}
            </p>
            <p className="text-sm text-gray-500 mt-1">{action.helper}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
