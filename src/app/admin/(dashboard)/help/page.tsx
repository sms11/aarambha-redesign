'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface KnowledgeSection {
  id: string;
  emoji: string;
  title: string;
  description: string;
  accentColor: string;
  content: ContentBlock[];
}

interface ContentBlock {
  type: 'steps' | 'tip' | 'text';
  heading?: string;
  items?: string[];
  text?: string;
}

/* ------------------------------------------------------------------ */
/*  Knowledge Base Data                                                */
/* ------------------------------------------------------------------ */

const sections: KnowledgeSection[] = [
  {
    id: 'dashboard',
    emoji: '\u{1F3E0}',
    title: 'Dashboard',
    description: 'Your overview of everything happening on the website',
    accentColor: '#FF6B35',
    content: [
      {
        type: 'text',
        heading: 'What it shows',
        text: 'The Dashboard is your home screen. It gives you a quick snapshot of your website content: how many team members, testimonials, partners, programs, gallery photos, and unread messages you have. Each card links directly to its section so you can jump in and make changes.',
      },
      {
        type: 'steps',
        heading: 'How to navigate',
        items: [
          'Use the **sidebar on the left** to jump to any section.',
          'Click the **numbers on dashboard cards** to go directly to that module.',
          'The **Contact** and **Admissions** links show a badge when you have unread messages.',
        ],
      },
      {
        type: 'tip',
        text: 'The dashboard updates automatically. If you just added a team member or photo, the count will reflect immediately when you return here.',
      },
    ],
  },
  {
    id: 'team',
    emoji: '\u{1F465}',
    title: 'Team Members',
    description: 'Manage the staff and faculty shown on the website',
    accentColor: '#14B8A6',
    content: [
      {
        type: 'steps',
        heading: 'How to add a new team member',
        items: [
          'Click the **"Add Member"** button at the top of the page.',
          'Fill in the **name** and **role/designation** fields.',
          'Click **"Upload Photo"** to add their picture.',
          'Click **"Save"** to publish them to the website.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to edit an existing member',
        items: [
          'Find the member card you want to change.',
          'Click the **pencil icon** on the card.',
          'Update any fields (name, role, or photo).',
          'Click **"Save"** to apply your changes.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to reorder members',
        items: [
          'Use the **up/down arrow buttons** on each card to change the display order.',
          'The order you see in the admin panel is the order visitors will see on the website.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to delete a member',
        items: [
          'Click the **trash icon** on the member card.',
          'A confirmation dialog will appear \u2014 click **"Delete"** to confirm.',
          'This action cannot be undone.',
        ],
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'Team members are displayed on the **Homepage** (featured section) and on the **About page** (full team listing).',
      },
      {
        type: 'tip',
        text: 'Upload clear, professional photos with a consistent background for the best results. Square photos (1:1 ratio) work best.',
      },
    ],
  },
  {
    id: 'testimonials',
    emoji: '\u{1F4AC}',
    title: 'Testimonials',
    description: 'Manage parent and student quotes',
    accentColor: '#A855F7',
    content: [
      {
        type: 'steps',
        heading: 'How to add a testimonial',
        items: [
          'Click the **"Add Testimonial"** button.',
          'Enter the **quote text** \u2014 what the person said.',
          'Fill in the **name** and **role** (e.g., "Parent of Grade 3 student").',
          'Select a **star rating** by clicking the stars.',
          'Choose a **card color** from the color picker.',
          'Click **"Save"** to publish.',
        ],
      },
      {
        type: 'text',
        heading: 'Using the star rating picker',
        text: 'Click on any star from 1 to 5 to set the rating. The filled stars represent the rating value. Most testimonials use 4 or 5 stars.',
      },
      {
        type: 'text',
        heading: 'Using the color picker',
        text: 'Each testimonial card has a background accent color. Click the color circles to choose one that looks good. Varying colors across testimonials makes the section more visually appealing.',
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'Testimonials are shown on the **Homepage** and the **Community page** in a carousel or grid layout.',
      },
      {
        type: 'tip',
        text: 'Keep quotes concise \u2014 2-3 sentences work best. Long quotes get truncated on mobile devices.',
      },
    ],
  },
  {
    id: 'partners',
    emoji: '\u{1F91D}',
    title: 'Partners',
    description: 'Manage partner and collaborator logos',
    accentColor: '#3B82F6',
    content: [
      {
        type: 'steps',
        heading: 'How to add/edit partner logos',
        items: [
          'Click **"Add Partner"** to create a new entry.',
          'Enter the **partner name** for accessibility.',
          'Upload the **logo image** \u2014 PNG or WebP with a transparent background works best.',
          'Click **"Save"** to publish.',
        ],
      },
      {
        type: 'text',
        heading: 'Recommended logo format',
        text: 'Use **PNG or WebP** files with a **transparent background**. Logos should be horizontal/landscape oriented for the best appearance in the marquee. Aim for at least 200px wide.',
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'Partner logos scroll in a **marquee banner** on the **Homepage** and the **Community page**.',
      },
      {
        type: 'tip',
        text: 'If a logo has a white background, ask the partner for a version with a transparent background, or use a free tool to remove it before uploading.',
      },
    ],
  },
  {
    id: 'programs',
    emoji: '\u{1F393}',
    title: 'Programs',
    description: 'Manage academic programs, special features, and key benefits',
    accentColor: '#A855F7',
    content: [
      {
        type: 'text',
        heading: 'Three tabs',
        text: 'The Programs page has three tabs: **Programs** (academic levels like Nursery, Primary, etc.), **Special Features** (unique aspects of your school), and **Key Benefits** (advantages for students and parents).',
      },
      {
        type: 'steps',
        heading: 'How to add a program',
        items: [
          'Go to the **Programs** tab.',
          'Click **"Add Program"**.',
          'Enter the **name** (e.g., "Early Childhood"), **age range**, **grades**, and **highlights**.',
          'Describe the **teaching approach** for this level.',
          'Use the **emoji picker** to select a representative emoji.',
          'Click **"Save"**.',
        ],
      },
      {
        type: 'text',
        heading: 'Using the emoji picker',
        text: 'Click the emoji button next to the program name. A picker will appear where you can search for or browse emojis. Pick one that represents the program level \u2014 for example, a baby emoji for nursery or a book for primary.',
      },
      {
        type: 'text',
        heading: 'Special Features & Key Benefits',
        text: 'Special Features use an **icon picker** (choose from a library of icons). Key Benefits use **color and background pickers** to make each benefit card visually distinct.',
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'Programs show as **cards on the Homepage** and as **detailed sections on the Programs page**.',
      },
    ],
  },
  {
    id: 'homepage',
    emoji: '\u{1F3E0}',
    title: 'Homepage',
    description: 'Manage stats, features, school life items, and principal message',
    accentColor: '#FF6B35',
    content: [
      {
        type: 'text',
        heading: 'Four tabs',
        text: 'The Homepage editor has four tabs: **Stats** (school statistics), **Features** ("Why We\'re Different" section), **School Life** (activity highlights), and **Principal Message** (welcome message with photo).',
      },
      {
        type: 'steps',
        heading: 'How to edit school statistics',
        items: [
          'Go to the **Stats** tab.',
          'Edit the **label** (e.g., "Students") and **value** (e.g., "500+").',
          'Keep values short \u2014 they display on the navy banner.',
          'Click **"Save"** when done.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to manage "Why We\'re Different" features',
        items: [
          'Go to the **Features** tab.',
          'Each feature has a **title**, **description**, and **icon**.',
          'Click the **icon picker** to choose a suitable icon.',
          'Add or remove features as needed.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to manage School Life items',
        items: [
          'Go to the **School Life** tab.',
          'Each item represents an activity or aspect of school life.',
          'Upload a **photo** and add a **title** and **description**.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to update the Principal\'s Message',
        items: [
          'Go to the **Principal Message** tab.',
          'Edit the **welcome message** text.',
          'Upload or change the **principal\'s photo**.',
          'Update the **name** and **title** if needed.',
        ],
      },
      {
        type: 'tip',
        text: 'Stats show on the navy banner \u2014 keep values short (e.g., "500+", "25+", "15"). Long numbers or text will break the layout on mobile.',
      },
    ],
  },
  {
    id: 'about',
    emoji: '\u{2139}\u{FE0F}',
    title: 'About Page',
    description: 'Manage core values, philosophy, and mission & vision',
    accentColor: '#14B8A6',
    content: [
      {
        type: 'text',
        heading: 'Three tabs',
        text: 'The About page editor has three tabs: **Core Values** (what your school stands for), **Philosophy** (your educational approach), and **Mission & Vision** (purpose and goals).',
      },
      {
        type: 'text',
        heading: 'Limits',
        text: 'You can add up to **10 core values**, **5 philosophy items**, and the mission and vision text fields have a **500 character limit** each.',
      },
      {
        type: 'steps',
        heading: 'Using the icon picker for core values',
        items: [
          'Each core value has an **icon** to visually represent it.',
          'Click the **icon picker button** next to the value.',
          'Browse or search the icon library.',
          'Click an icon to select it.',
        ],
      },
      {
        type: 'text',
        heading: 'Where it appears',
        text: 'All content from this section displays on the **About page** of the website.',
      },
    ],
  },
  {
    id: 'facilities',
    emoji: '\u{1F3EB}',
    title: 'Facilities',
    description: 'Manage activities, campus facilities, and counseling points',
    accentColor: '#F59E0B',
    content: [
      {
        type: 'text',
        heading: 'Three tabs',
        text: 'The Facilities editor has three tabs: **Activities** (extra-curricular offerings), **Facilities** (campus infrastructure), and **Counseling Points** (guidance services).',
      },
      {
        type: 'text',
        heading: 'Per-category limits',
        text: 'Facilities are organized by category with these limits: **Resources: 4**, **Labs: 3**, **Digital: 2**, **Health: 1**, **Convenience: 2**. These limits ensure the page layout stays balanced.',
      },
      {
        type: 'steps',
        heading: 'How to manage counseling points',
        items: [
          'Go to the **Counseling Points** tab.',
          'Add or edit each point with a **title** and **description**.',
          'These describe your school\'s counseling and guidance services.',
        ],
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'All content from this section displays on the **Facilities page** of the website.',
      },
      {
        type: 'tip',
        text: 'Respect the category limits. If you try to add more items than allowed, the system will show an error. Remove an existing item first if you need to add a new one.',
      },
    ],
  },
  {
    id: 'gallery',
    emoji: '\u{1F4F8}',
    title: 'Gallery',
    description: 'Upload and manage school photos',
    accentColor: '#EC4899',
    content: [
      {
        type: 'steps',
        heading: 'How to upload photos',
        items: [
          'Click the **"Add Photo"** button.',
          'Select an **image file** from your computer (JPEG, PNG, or WebP).',
          'Add **alt text** \u2014 a short description of what\'s in the photo.',
          'Pick a **category** from the dropdown.',
          'Click **"Save"** to upload.',
        ],
      },
      {
        type: 'text',
        heading: 'Available categories',
        text: 'Photos can be categorized as: **School Life**, **Campus**, **Labs**, **Community**, or **Team**. Visitors can filter by these categories on the public gallery page.',
      },
      {
        type: 'text',
        heading: 'Photo limit',
        text: 'You can upload up to **30 photos** total across all categories. To add more, you\'ll need to delete existing ones first.',
      },
      {
        type: 'steps',
        heading: 'How to filter in the admin view',
        items: [
          'Use the **category filter** at the top of the gallery admin page.',
          'Click a category name to show only photos in that category.',
          'Click **"All"** to see every photo.',
        ],
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'Photos display on the **Gallery page** with a category filter that lets visitors browse by topic.',
      },
      {
        type: 'tip',
        text: 'Use descriptive alt text for accessibility (e.g., "Students performing in annual cultural program" rather than "IMG_1234"). This helps visually impaired visitors and improves search engine ranking.',
      },
    ],
  },
  {
    id: 'community',
    emoji: '\u{1F91D}',
    title: 'Community',
    description: 'Manage community partnership sections',
    accentColor: '#10B981',
    content: [
      {
        type: 'text',
        heading: 'Three sections',
        text: 'The Community page has three partnership sections: **Parent-Teacher** (PTA activities), **Business** (business partnerships), and **Educational** (academic collaborations).',
      },
      {
        type: 'text',
        heading: 'Item limits',
        text: 'Each section supports up to **3 items**. This keeps the page clean and focused.',
      },
      {
        type: 'steps',
        heading: 'How to manage community items',
        items: [
          'Select the **section tab** you want to edit.',
          'Click **"Add Item"** to create a new entry.',
          'Fill in the **title** and **description**.',
          'Click **"Save"** to publish.',
        ],
      },
      {
        type: 'text',
        heading: 'Where they appear',
        text: 'Community items are displayed on the **Community page** of the website.',
      },
    ],
  },
  {
    id: 'contact',
    emoji: '\u{2709}\u{FE0F}',
    title: 'Contact',
    description: 'Manage contact information and view form submissions',
    accentColor: '#3B82F6',
    content: [
      {
        type: 'text',
        heading: 'Two tabs',
        text: 'The Contact editor has two tabs: **Contact Info** (your school\'s address, phone, email, and hours) and **Messages** (form submissions from visitors).',
      },
      {
        type: 'steps',
        heading: 'How to manage contact cards',
        items: [
          'Go to the **Contact Info** tab.',
          'You can have up to **4 contact info cards** \u2014 one each for address, phone, email, and office hours.',
          'Click on a card to edit its details.',
          'Click **"Save"** to update.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to view and manage messages',
        items: [
          'Go to the **Messages** tab.',
          'You\'ll see a list of all form submissions from the Contact page.',
          'Click on a message to read the full content.',
          'Click **"Mark as Read"** to clear the unread indicator.',
        ],
      },
      {
        type: 'text',
        heading: 'Unread badge',
        text: 'The **Contact** link in the sidebar shows a badge with the number of unread messages. This helps you know when visitors have reached out.',
      },
      {
        type: 'tip',
        text: 'Check your messages regularly! Visitors expect a response within 1-2 business days.',
      },
    ],
  },
  {
    id: 'settings',
    emoji: '\u{2699}\u{FE0F}',
    title: 'Settings',
    description: 'Manage social media links and site configuration',
    accentColor: '#6B7280',
    content: [
      {
        type: 'steps',
        heading: 'Social media links',
        items: [
          'Enter the full URL for your **Facebook**, **Instagram**, and **TikTok** pages.',
          'These links appear in the website footer and are used by social media icons.',
          'Leave a field empty if you don\'t have that social media account.',
        ],
      },
      {
        type: 'steps',
        heading: 'WhatsApp number',
        items: [
          'Enter your school\'s WhatsApp number including the country code (e.g., **+977-9812345678**).',
          'This powers the **floating WhatsApp button** that visitors see on every page.',
          'Make sure the number is active and monitored.',
        ],
      },
      {
        type: 'steps',
        heading: 'Google Maps embed URL',
        items: [
          'Go to **Google Maps** and search for your school.',
          'Click **"Share"** and then the **"Embed a map"** tab.',
          'Copy the URL from the **src="..."** part of the embed code.',
          'Paste it into the **Map Embed URL** field.',
        ],
      },
      {
        type: 'tip',
        text: 'Test your social media links after saving. Click "View Site" in the sidebar to check that the links in the footer work correctly.',
      },
    ],
  },
  {
    id: 'admissions',
    emoji: '\u{1F393}',
    title: 'Admissions',
    description: 'View and manage student enquiry submissions',
    accentColor: '#FF6B35',
    content: [
      {
        type: 'steps',
        heading: 'How to view enquiry submissions',
        items: [
          'Go to the **Admissions** page from the sidebar.',
          'You\'ll see a table of all student enquiry submissions.',
          'Click on any row to see the **full details** of the enquiry.',
        ],
      },
      {
        type: 'steps',
        heading: 'Search and filter',
        items: [
          'Use the **search bar** at the top to find specific enquiries by name, email, or phone.',
          'Use the **filter options** to narrow results by status or date.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to export data as CSV',
        items: [
          'Click the **"Export CSV"** button at the top of the page.',
          'A file will download containing all enquiry data.',
          'You can open this file in **Excel** or **Google Sheets** for further analysis.',
        ],
      },
      {
        type: 'steps',
        heading: 'How to mark enquiries as read',
        items: [
          'Click on an unread enquiry (shown with a **bold/highlighted** style).',
          'Click **"Mark as Read"** to clear the unread indicator.',
          'The sidebar badge count will update automatically.',
        ],
      },
      {
        type: 'tip',
        text: 'Export your enquiry data regularly to keep a backup. The CSV file is useful for sharing with the admissions committee.',
      },
    ],
  },
  {
    id: 'image-tips',
    emoji: '\u{1F4F8}',
    title: 'Image Upload Tips',
    description: 'General guidelines for uploading images across the admin panel',
    accentColor: '#8B5CF6',
    content: [
      {
        type: 'text',
        heading: 'Supported formats',
        text: 'You can upload images in **JPEG**, **PNG**, and **WebP** formats. WebP is recommended for the smallest file size with good quality.',
      },
      {
        type: 'text',
        heading: 'Maximum file size',
        text: 'Each image can be up to **10MB** in size. If your image is larger, resize it before uploading or use an image compression tool.',
      },
      {
        type: 'text',
        heading: 'Recommended dimensions',
        text: 'For **team photos**: 400x400px (square). For **gallery photos**: 1200x800px (landscape). For **partner logos**: 300x150px (horizontal). For **principal photo**: 600x800px (portrait). These are recommendations \u2014 images will be resized automatically, but starting with the right size gives the best quality.',
      },
      {
        type: 'text',
        heading: 'Image storage',
        text: 'All uploaded images are stored in **MinIO**, your dedicated image server. They are served through a CDN for fast loading times.',
      },
      {
        type: 'tip',
        text: 'Compress images before uploading using free tools like TinyPNG (tinypng.com) or Squoosh (squoosh.app). Smaller files mean faster page loads for your visitors.',
      },
    ],
  },
  {
    id: 'security',
    emoji: '\u{1F510}',
    title: 'Security',
    description: 'Login, sessions, and account security',
    accentColor: '#EF4444',
    content: [
      {
        type: 'steps',
        heading: 'How to log in',
        items: [
          'Go to **/admin/login** in your browser.',
          'Enter your **username** and **password**.',
          'Click **"Login"** to access the admin panel.',
        ],
      },
      {
        type: 'text',
        heading: 'Session duration',
        text: 'Your login session lasts for **24 hours**. After that, you\'ll be automatically logged out and need to sign in again. This is a security measure to protect your account.',
      },
      {
        type: 'steps',
        heading: 'How to log out',
        items: [
          'Click the **"Logout"** button at the bottom of the sidebar.',
          'You\'ll be redirected to the login page.',
          'Always log out when using a shared or public computer.',
        ],
      },
      {
        type: 'text',
        heading: 'Admin account',
        text: 'There is **only one admin account** for the system. This account has full access to all features and settings.',
      },
      {
        type: 'tip',
        text: 'Need to change your password? Contact the developer who set up the system. Do not share your login credentials with anyone.',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Section → Admin route mapping                                      */
/* ------------------------------------------------------------------ */

const sectionRoutes: Record<string, string> = {
  dashboard: '/admin',
  team: '/admin/team',
  testimonials: '/admin/testimonials',
  partners: '/admin/partners',
  programs: '/admin/programs',
  homepage: '/admin/homepage',
  about: '/admin/about',
  facilities: '/admin/facilities',
  gallery: '/admin/gallery',
  community: '/admin/community',
  contact: '/admin/contact',
  settings: '/admin/settings',
  admissions: '/admin/admissions',
  'image-tips': '',
  security: '',
};

/* ------------------------------------------------------------------ */
/*  Quick-link accent tints (bg color for each module pill)             */
/* ------------------------------------------------------------------ */

const quickLinkTints: Record<string, string> = {
  dashboard: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
  team: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
  testimonials: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  partners: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  programs: 'bg-violet-50 text-violet-700 hover:bg-violet-100',
  homepage: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
  about: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
  facilities: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
  gallery: 'bg-pink-50 text-pink-700 hover:bg-pink-100',
  community: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  contact: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  settings: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  admissions: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
  'image-tips': 'bg-violet-50 text-violet-700 hover:bg-violet-100',
  security: 'bg-red-50 text-red-700 hover:bg-red-100',
};

/* ------------------------------------------------------------------ */
/*  Suggested search terms                                             */
/* ------------------------------------------------------------------ */

const suggestedSearchTerms = [
  'upload photo',
  'testimonial',
  'settings',
  'gallery',
  'team member',
  'programs',
  'contact',
  'admissions',
];

/* ------------------------------------------------------------------ */
/*  Helper: render markdown-style bold (**text**)                      */
/* ------------------------------------------------------------------ */

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function ChevronIcon({ className, open }: { className?: string; open: boolean }) {
  return (
    <svg
      className={`${className} transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function HelpPage() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  /** Toggle a section open/closed */
  function toggleSection(id: string) {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  /** Expand all / collapse all */
  const allExpanded = useMemo(() => {
    return sections.every((s) => openSections.includes(s.id));
  }, [openSections]);

  function toggleAll() {
    if (allExpanded) {
      setOpenSections([]);
    } else {
      setOpenSections(sections.map((s) => s.id));
    }
  }

  /** Filter sections based on search query */
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;

    const query = searchQuery.toLowerCase();
    return sections.filter((section) => {
      const titleMatch = section.title.toLowerCase().includes(query);
      const descMatch = section.description.toLowerCase().includes(query);
      const contentMatch = section.content.some((block) => {
        if (block.heading?.toLowerCase().includes(query)) return true;
        if (block.text?.toLowerCase().includes(query)) return true;
        if (block.items?.some((item) => item.toLowerCase().includes(query))) return true;
        return false;
      });
      return titleMatch || descMatch || contentMatch;
    });
  }, [searchQuery]);

  /** Auto-open sections that match search */
  const effectiveOpenSections = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredSections.map((s) => s.id);
    }
    return openSections;
  }, [searchQuery, filteredSections, openSections]);

  /** Scroll to a section */
  function scrollToSection(id: string) {
    if (!openSections.includes(id)) {
      setOpenSections((prev) => [...prev, id]);
    }
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    <div className="mx-auto max-w-4xl pb-8">
      {/* ============================================================ */}
      {/*  Hero Header                                                  */}
      {/* ============================================================ */}
      <div
        className="relative mb-12 rounded-2xl px-6 pb-10 pt-8 shadow-lg sm:px-10 sm:pt-10"
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #223255 60%, #2a3f6b 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />

        <h1
          className="relative text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {'\u{1F4D6}'} Knowledge Base
        </h1>
        <p className="relative mt-2 text-base text-white/70">
          Everything you need to know to manage your school website
        </p>

        {/* Stat pills */}
        <div className="relative mt-5 flex flex-wrap gap-2.5">
          {[
            { label: `${sections.length} Guides`, icon: '\u{1F4DA}' },
            { label: 'Step-by-step', icon: '\u{1F463}' },
            { label: 'Always up to date', icon: '\u{2705}' },
          ].map((pill) => (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm"
            >
              <span>{pill.icon}</span>
              {pill.label}
            </span>
          ))}
        </div>

        {/* Search bar — overlaps bottom edge */}
        <div className="relative mt-8 -mb-14">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search for help topics... (e.g., "upload photo", "testimonial", "settings")'
              className="w-full rounded-xl border-2 border-transparent bg-white py-4 pl-12 pr-12 text-sm text-gray-900 shadow-xl placeholder:text-gray-400 focus:border-[#FF6B35] focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Quick Links Grid                                             */}
      {/* ============================================================ */}
      {!searchQuery.trim() && (
        <nav className="mb-8" aria-label="Quick navigation to guide sections">
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium transition-colors duration-150 ${quickLinkTints[section.id] || 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="text-base leading-none" role="img" aria-hidden="true">
                  {section.emoji}
                </span>
                <span className="truncate">{section.title}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ============================================================ */}
      {/*  Results count + Expand/Collapse toggle                       */}
      {/* ============================================================ */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {searchQuery.trim()
            ? filteredSections.length === 0
              ? 'No results found'
              : `Found ${filteredSections.length} section${filteredSections.length === 1 ? '' : 's'} matching "${searchQuery}"`
            : `${sections.length} guide sections`}
        </div>
        {!searchQuery.trim() && (
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-800"
          >
            {allExpanded ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
                Collapse All
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Expand All
              </>
            )}
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/*  No results state                                             */}
      {/* ============================================================ */}
      {searchQuery.trim() && filteredSections.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-2 text-7xl">{'\u{1F914}'}</div>
          <h3 className="mt-2 text-xl font-bold text-gray-900">
            No articles found
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            We could not find anything matching your search. Try one of these common topics:
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {suggestedSearchTerms.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setSearchQuery(term)}
                className="rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]"
              >
                {term}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FF6B35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#e55a2a] transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Accordion Sections                                           */}
      {/* ============================================================ */}
      <div className="space-y-3">
        {filteredSections.map((section) => {
          const isOpen = effectiveOpenSections.includes(section.id);
          const route = sectionRoutes[section.id];
          return (
            <div
              key={section.id}
              id={section.id}
              className="scroll-mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
              style={{
                borderLeftWidth: isOpen ? '4px' : '1px',
                borderLeftColor: isOpen ? section.accentColor : undefined,
              }}
            >
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors duration-150 hover:bg-gray-50"
                aria-expanded={isOpen}
              >
                <span className="text-3xl leading-none" role="img" aria-hidden="true">
                  {section.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-bold text-gray-900">
                    {section.title}
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">
                    {section.description}
                  </div>
                </div>
                <ChevronIcon className="h-5 w-5 shrink-0 text-gray-400" open={isOpen} />
              </button>

              {/* Section Content */}
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                }}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-gray-100">
                    {/* Section splash banner */}
                    <div
                      className="flex items-center gap-3 px-5 py-3"
                      style={{ backgroundColor: `${section.accentColor}08` }}
                    >
                      <span className="text-2xl leading-none opacity-60">{section.emoji}</span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: section.accentColor }}
                      >
                        {section.title} Guide
                      </span>
                    </div>

                    <div className="px-5 pb-5 pt-3 space-y-5">
                      {section.content.map((block, blockIdx) => (
                        <div key={blockIdx}>
                          {/* Block heading */}
                          {block.heading && (
                            <h3 className="mb-2.5 text-sm font-bold text-gray-800">
                              {block.heading}
                            </h3>
                          )}

                          {/* Text block */}
                          {block.type === 'text' && block.text && (
                            <p className="text-sm leading-relaxed text-gray-600" style={{ lineHeight: '1.7' }}>
                              {renderBoldText(block.text)}
                            </p>
                          )}

                          {/* Steps block */}
                          {block.type === 'steps' && block.items && (
                            <ol className="space-y-2 pl-1">
                              {block.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex gap-3 text-sm text-gray-600" style={{ lineHeight: '1.7' }}>
                                  <span
                                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white mt-0.5"
                                    style={{ backgroundColor: section.accentColor }}
                                  >
                                    {itemIdx + 1}
                                  </span>
                                  <span>{renderBoldText(item)}</span>
                                </li>
                              ))}
                            </ol>
                          )}

                          {/* Tip block */}
                          {block.type === 'tip' && block.text && (
                            <div
                              className="flex gap-3 rounded-lg border-l-4 p-4 text-sm"
                              style={{
                                backgroundColor: `${section.accentColor}08`,
                                borderLeftColor: section.accentColor,
                                color: section.accentColor,
                                lineHeight: '1.7',
                              }}
                            >
                              <span className="shrink-0 text-lg leading-none">{'\u{1F4A1}'}</span>
                              <span>{renderBoldText(block.text)}</span>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* "Go to Module" button */}
                      {route && (
                        <div className="pt-2">
                          <Link
                            href={route}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:opacity-90"
                            style={{ backgroundColor: section.accentColor }}
                          >
                            Go to {section.title}
                            <ArrowRightIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/*  Footer                                                       */}
      {/* ============================================================ */}
      <div
        className="mt-10 mb-6 overflow-hidden rounded-2xl px-6 py-8 text-center shadow-lg sm:px-10"
        style={{
          background: 'linear-gradient(135deg, #1B2A4A 0%, #223255 60%, #2a3f6b 100%)',
        }}
      >
        <div className="text-3xl mb-3">{'\u{1F64B}'}</div>
        <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Still have questions?
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
          We are here to help! Reach out to your developer or system administrator and they will get you sorted out.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
