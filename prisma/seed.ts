/**
 * Prisma Seed Script
 *
 * Extracts ALL hardcoded data from page files and inserts into the database.
 * Idempotent — clears all tables before seeding.
 *
 * Run: pnpm tsx prisma/seed.ts
 */

import { PrismaClient } from "../src/generated/prisma";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...\n");

  // ──────────────────────────────────────────────
  // Clear all tables (order matters for referential integrity)
  // ──────────────────────────────────────────────
  console.log("Clearing existing data...");
  await prisma.contactSubmission.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.contactInfo.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.facility.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.philosophy.deleteMany();
  await prisma.coreValue.deleteMany();
  await prisma.communityInvolvement.deleteMany();
  await prisma.keyBenefit.deleteMany();
  await prisma.specialFeature.deleteMany();
  await prisma.schoolLifeItem.deleteMany();
  await prisma.homepageFeature.deleteMany();
  await prisma.stat.deleteMany();
  await prisma.program.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.adminUser.deleteMany();
  console.log("All tables cleared.\n");

  // ──────────────────────────────────────────────
  // Admin User
  // ──────────────────────────────────────────────
  console.log("Creating admin user...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@aarambha.school";
  const adminPassword = process.env.ADMIN_PASSWORD || "aarambha2024";
  const passwordHash = await hash(adminPassword, 12);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`Admin user created: ${adminEmail}\n`);

  // ──────────────────────────────────────────────
  // Stats (from src/app/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding stats...");
  const stats = [
    { value: "K-12", label: "Grade Levels", emoji: "\u{1F393}" },
    { value: "15+", label: "Years", emoji: "\u{1F3EB}" },
    { value: "500+", label: "Alumni", emoji: "\u{1F31F}" },
    { value: "50+", label: "Faculty", emoji: "\u{1F468}\u200D\u{1F3EB}" },
  ];
  for (let i = 0; i < stats.length; i++) {
    await prisma.stat.create({
      data: { ...stats[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Team Members (from src/app/page.tsx and src/app/about/page.tsx — same data)
  // ──────────────────────────────────────────────
  console.log("Seeding team members...");
  const teamMembers = [
    { name: "Naresh Prasad Shrestha", role: "Chairman and Principal", image: "/images/team/naresh.webp" },
    { name: "Rossete Dela Rosa Tamang", role: "Vice Principal (Pre-school to Grade 5)", image: "/images/team/rossete.webp" },
    { name: "Dinesh Shrestha", role: "Vice Principal (Grade 6-12)", image: "/images/team/dinesh.webp" },
    { name: "Sunita Maharjan", role: "Coordinator (Pre-school to Grade 5)", image: "/images/team/sunita.webp" },
    { name: "Deepika Shrestha", role: "Coordinator (Grade 6-10)", image: "/images/team/deepika.webp" },
    { name: "Kripa Bajracharya", role: "ECA Coordinator", image: "/images/team/kripa.webp" },
  ];
  for (let i = 0; i < teamMembers.length; i++) {
    await prisma.teamMember.create({
      data: { ...teamMembers[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Testimonials (from src/app/page.tsx and src/app/admissions/page.tsx — deduplicated)
  // Homepage testimonials have no color/stars; admissions page has both.
  // We use the admissions version as it is more complete.
  // ──────────────────────────────────────────────
  console.log("Seeding testimonials...");
  const testimonials = [
    {
      quote: "Aarambha School has truly transformed my daughter\u2019s learning experience. The teachers are not only highly qualified but also genuinely care about each child\u2019s growth. The school\u2019s focus on values and creativity is unmatched!",
      name: "Sita Sharma",
      role: "Parent of Grade 4 Student",
      image: "/images/testimonials/sita.webp",
      stars: 5,
      color: "var(--coral)",
    },
    {
      quote: "I love going to Aarambha School because learning here is fun! My teachers make every subject interesting, and I\u2019ve made lots of new friends. The playground and art classes are my favorite!",
      name: "Ramesh Karki",
      role: "Grade 3 Student",
      image: "/images/testimonials/ramesh.webp",
      stars: 5,
      color: "var(--mint)",
    },
    {
      quote: "Aarambha School laid a strong foundation for my academic journey. The skills and discipline I learned there helped me succeed in higher studies and beyond. I\u2019m proud to be an Aarambha alumnus!",
      name: "Priyanka Adhikari",
      role: "Batch of 2018",
      image: "/images/testimonials/priyanka.webp",
      stars: 5,
      color: "var(--lavender)",
    },
    {
      quote: "As a teacher at Aarambha School, I\u2019ve seen how a nurturing and inclusive environment can inspire students to reach their full potential. The support from the administration and the passion from our students make teaching here incredibly rewarding.",
      name: "Mr. Rajan Shrestha",
      role: "Science Teacher",
      image: "/images/testimonials/rajan.webp",
      stars: 5,
      color: "var(--peach)",
    },
  ];
  for (let i = 0; i < testimonials.length; i++) {
    await prisma.testimonial.create({
      data: { ...testimonials[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Partners (deduplicated from homepage + admissions page)
  // Homepage has slightly different logo paths than admissions; we keep both
  // and deduplicate by name, preferring the admissions page paths.
  // ──────────────────────────────────────────────
  console.log("Seeding partners...");
  const partners = [
    { name: "FranklinCovey Education", logo: "/images/partners/franklincovey.webp" },
    { name: "Kalpavariksha Education Foundation", logo: "/images/partners/kalpavariksha.webp" },
    { name: "NYEF", logo: "/images/partners/nyef.webp" },
    { name: "Programiz", logo: "/images/partners/programiz.webp" },
    { name: "Duke of Edinburgh", logo: "/images/partners/duke.webp" },
    { name: "Digital Nepal", logo: "/images/partners/digitalnepal.webp" },
    { name: "Robotics Association of Nepal", logo: "/images/partners/ran.webp" },
    { name: "NCC Education", logo: "/images/partners/ncc.webp" },
    { name: "DigiSchool", logo: "/images/partners/digischool.webp" },
    { name: "Code Himalaya", logo: "/images/partners/codehimalaya.webp" },
    { name: "Techspire College", logo: "/images/partners/techspire.webp" },
  ];
  for (let i = 0; i < partners.length; i++) {
    await prisma.partner.create({
      data: { ...partners[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Programs (from src/app/programs/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding programs...");
  const programs = [
    {
      name: "Pre-School",
      ages: "Ages 3\u20136",
      grades: "Play Group to UKG",
      description: "In our Pre-School program, we focus on nurturing young minds through a play-based learning approach. Our Montessori-inspired and activity-driven curriculum helps children explore the world around them while building essential foundations for lifelong learning.",
      highlights: [
        "Learning Through Play \u2014 Engaging activities that make learning fun and natural",
        "Holistic Development \u2014 Nurturing physical, emotional, social, and cognitive growth",
        "Creative Activities \u2014 Art, music, and movement to spark imagination",
      ],
      teaching: "Montessori & play-based approach that encourages exploration and discovery",
      image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80",
      color: "var(--coral)",
      emoji: "\u{1F3A8}",
    },
    {
      name: "Primary School",
      ages: "Ages 6\u201311",
      grades: "Grades 1\u20135",
      description: "Our Primary program builds strong academic foundations while fostering a love for learning. Through experiential and student-centered teaching methods, we ensure every child develops core skills in literacy, numeracy, and critical thinking alongside strong values.",
      highlights: [
        "Core Skills \u2014 Building strong foundations in reading, writing, and mathematics",
        "Interactive Learning \u2014 Hands-on projects and group activities that make concepts come alive",
        "Values Education \u2014 Character building and ethical development integrated into daily learning",
      ],
      teaching: "Experiential and student-centered methods that encourage active participation",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80",
      color: "var(--mint)",
      emoji: "\u{1F4DA}",
    },
    {
      name: "Lower Secondary",
      ages: "Ages 11\u201314",
      grades: "Grades 6\u20138",
      description: "Our Lower Secondary program empowers students to become independent thinkers and problem solvers. Through project-based learning and interactive discussions, students develop critical thinking, creativity, and collaboration skills essential for the modern world.",
      highlights: [
        "Project-Based Learning \u2014 Real-world projects that develop research and analytical skills",
        "Skill Development \u2014 Building critical thinking, creativity, and collaborative abilities",
        "Interactive Discussions \u2014 Engaging classroom dialogues that deepen understanding",
      ],
      teaching: "Interactive discussions and project-based approach for deeper engagement",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
      color: "var(--lavender)",
      emoji: "\u{1F52C}",
    },
    {
      name: "Secondary School",
      ages: "Ages 14\u201316",
      grades: "Grades 9\u201310",
      description: "Our Secondary program provides comprehensive preparation for the SEE examinations and beyond. Using advanced multimedia tools and innovative teaching methods, we help students achieve academic excellence while planning for their future careers and higher education.",
      highlights: [
        "SEE Exam Preparation \u2014 Structured preparation and practice for national examinations",
        "Advanced Learning \u2014 In-depth study with multimedia tools and innovative methods",
        "Future Planning \u2014 Career guidance and higher education counseling",
      ],
      teaching: "Multimedia tools and advanced teaching approaches for exam readiness",
      image: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80",
      color: "var(--peach)",
      emoji: "\u{1F393}",
    },
  ];
  for (let i = 0; i < programs.length; i++) {
    await prisma.program.create({
      data: { ...programs[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Homepage Features — "Why We're Different" (from src/app/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding homepage features...");
  const homepageFeatures = [
    {
      title: "STEAM & Experiential Learning",
      description: "A curriculum that integrates science, technology, engineering, arts, and mathematics with hands-on experiential learning and global exposure trips.",
      icon: "BeakerIcon",
      image: "/images/why-different.webp",
    },
    {
      title: "Global Exposure",
      description: "Study tours to USA, UK, China, India and other countries, plus a \u201CKnow Nepal Program\u201D with field visits, trekking, and industrial visits.",
      icon: "GlobeAltIcon",
      image: "/images/partnerships.webp",
    },
    {
      title: "Academic Excellence",
      description: "A rigorous curriculum prescribed by the National Examinations Board with Aarambha Standard of Excellence and personalized attention.",
      icon: "AcademicCapIcon",
      image: "/images/about-2.webp",
    },
  ];
  for (let i = 0; i < homepageFeatures.length; i++) {
    await prisma.homepageFeature.create({
      data: { ...homepageFeatures[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // School Life Items (from src/app/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding school life items...");
  const schoolLifeItems = [
    { title: "Explore Your Interests", icon: "LightBulbIcon", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
    { title: "Get Active and Healthy", icon: "HeartIcon", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80" },
    { title: "Explore the World", icon: "GlobeAltIcon", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" },
    { title: "Express Yourself", icon: "PaintBrushIcon", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
    { title: "Find Your Voice", icon: "ChatBubbleLeftRightIcon", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80" },
    { title: "Join the Club", icon: "UserGroupIcon", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80" },
    { title: "Make Beautiful Music", icon: "MusicalNoteIcon", image: "https://images.unsplash.com/photo-1514119412350-e174d90d585e?w=600&q=80" },
    { title: "Move and Groove", icon: "BeakerIcon", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80" },
  ];
  for (let i = 0; i < schoolLifeItems.length; i++) {
    await prisma.schoolLifeItem.create({
      data: { ...schoolLifeItems[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Special Features (from src/app/programs/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding special features...");
  const specialFeatures = [
    {
      title: "Safe Environment",
      description: "A secure, nurturing space where children feel protected and encouraged to explore and learn without fear.",
      icon: "ShieldCheckIcon",
      color: "var(--coral)",
      bg: "#FF6B6B15",
    },
    {
      title: "Experienced Teachers",
      description: "Dedicated and highly qualified educators who bring passion, creativity, and expertise to every classroom.",
      icon: "UserGroupIcon",
      color: "var(--mint)",
      bg: "#4ECDC415",
    },
    {
      title: "Modern Facilities",
      description: "State-of-the-art classrooms, labs, and learning spaces designed to inspire and support 21st-century education.",
      icon: "AcademicCapIcon",
      color: "var(--lavender)",
      bg: "#A78BFA15",
    },
    {
      title: "STEAM Education",
      description: "Integrated Science, Technology, Engineering, Arts, and Mathematics curriculum that prepares students for the future.",
      icon: "CpuChipIcon",
      color: "var(--peach)",
      bg: "#FBBF7715",
    },
    {
      title: "Student-Centered Learning",
      description: "Every program is tailored to individual needs, ensuring each child receives personalized attention and support.",
      icon: "LightBulbIcon",
      color: "var(--navy-light)",
      bg: "#4EAED815",
    },
  ];
  for (let i = 0; i < specialFeatures.length; i++) {
    await prisma.specialFeature.create({
      data: { ...specialFeatures[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Key Benefits (from src/app/programs/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding key benefits...");
  const keyBenefits = [
    {
      emoji: "\u{1F331}",
      title: "Personal Development Programs",
      description: "Comprehensive programs that build confidence, resilience, leadership skills, and emotional intelligence alongside academic growth.",
      color: "var(--mint)",
      bg: "#4ECDC410",
      border: "#4ECDC430",
    },
    {
      emoji: "\u{1F3C5}",
      title: "Extra-Curricular Activities",
      description: "A rich variety of sports, arts, clubs, and cultural activities that nurture talents, build character, and create lifelong memories.",
      color: "var(--coral)",
      bg: "#FF6B6B10",
      border: "#FF6B6B30",
    },
    {
      emoji: "\u{1F4A1}",
      title: "Modern Teaching Methods",
      description: "Innovative, research-backed teaching approaches including project-based learning, multimedia integration, and experiential education.",
      color: "var(--lavender)",
      bg: "#A78BFA10",
      border: "#A78BFA30",
    },
    {
      emoji: "\u2696\uFE0F",
      title: "Balanced Academics & Life Skills",
      description: "Equal emphasis on academic excellence and essential life skills, ensuring students are prepared for both exams and the real world.",
      color: "var(--peach)",
      bg: "#FBBF7710",
      border: "#FBBF7730",
    },
    {
      emoji: "\u{1F464}",
      title: "Individual Attention",
      description: "Small class sizes and dedicated mentoring ensure every student receives the personalized guidance they need to thrive.",
      color: "var(--navy-light)",
      bg: "#4EAED810",
      border: "#4EAED830",
    },
  ];
  for (let i = 0; i < keyBenefits.length; i++) {
    await prisma.keyBenefit.create({
      data: { ...keyBenefits[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Community Involvement (from src/app/admissions/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding community involvement...");

  // Parent-Teacher section
  const parentTeacherItems = [
    {
      title: "Regular Meetings",
      description: "Creating opportunities for open discussions allows for meaningful collaboration between students, parents, educators, and stakeholders. These discussions focus on evaluating student progress, identifying areas for improvement, and celebrating achievements. Additionally, they provide a platform to discuss and brainstorm new school initiatives that align with the institution\u2019s goals and values. Such transparent communication fosters a sense of community, encourages collective problem-solving, and ensures that everyone is aligned toward enhancing the overall educational experience.",
      image: "/images/community/regular-meetings.webp",
      color: "var(--coral)",
      section: "parent_teacher",
    },
  ];
  for (let i = 0; i < parentTeacherItems.length; i++) {
    await prisma.communityInvolvement.create({
      data: { ...parentTeacherItems[i], sortOrder: i },
    });
  }

  // Business partnerships
  const businessItems = [
    {
      title: "Collaboration on Student Internships and Mentorships",
      description: "Partner with schools to offer internships and mentorship programs, providing students hands-on experience, career guidance, and skill development.",
      color: "var(--mint)",
      section: "business",
    },
    {
      title: "Sponsorship of Events and Facilities",
      description: "Support school events and facilities through sponsorships, enhancing learning opportunities, infrastructure, and community engagement.",
      color: "var(--coral)",
      section: "business",
    },
  ];
  for (let i = 0; i < businessItems.length; i++) {
    await prisma.communityInvolvement.create({
      data: { ...businessItems[i], sortOrder: i },
    });
  }

  // Educational partnerships
  const educationalItems = [
    {
      title: "Workshops and Expert Sessions",
      description: "Partner institutions offer workshops and expert-led sessions to enhance skills and provide real-world insights.",
      color: "var(--lavender)",
      section: "educational",
    },
    {
      title: "Joint Programs and Resources",
      description: "Collaborative programs and shared resources empower students with advanced learning opportunities and specialized knowledge.",
      color: "var(--peach)",
      section: "educational",
    },
  ];
  for (let i = 0; i < educationalItems.length; i++) {
    await prisma.communityInvolvement.create({
      data: { ...educationalItems[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Core Values (from src/app/about/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding core values...");
  const coreValues = [
    { title: "Resilience & Adaptability", icon: "ArrowTrendingUpIcon", emoji: "\u{1F4AA}", color: "var(--navy-light)" },
    { title: "Lifelong Learning", icon: "BookOpenIcon", emoji: "\u{1F4D6}", color: "var(--coral)" },
    { title: "Compassion & Community", icon: "HeartIcon", emoji: "\u{1F49A}", color: "var(--mint)" },
    { title: "Cultural Awareness & Respect", icon: "GlobeAltIcon", emoji: "\u{1F30D}", color: "var(--gold)" },
    { title: "Excellence in Education", icon: "AcademicCapIcon", emoji: "\u{1F393}", color: "var(--lavender)" },
    { title: "Holistic Development", icon: "SparklesIcon", emoji: "\u2728", color: "var(--peach)" },
    { title: "Innovation & Creativity", icon: "PaintBrushIcon", emoji: "\u{1F3A8}", color: "var(--coral)" },
    { title: "Integrity & Ethics", icon: "ShieldCheckIcon", emoji: "\u{1F6E1}\uFE0F", color: "var(--navy-light)" },
  ];
  for (let i = 0; i < coreValues.length; i++) {
    await prisma.coreValue.create({
      data: { ...coreValues[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Philosophy (from src/app/about/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding philosophy...");
  const philosophy = [
    {
      title: "Every Child is Unique",
      description: "Every child is a unique and independent learner, capable of thriving in a nurturing, child-centered environment.",
      emoji: "\u{1F31F}",
      color: "var(--gold)",
    },
    {
      title: "Fostering Autonomy",
      description: "Our progressive approach emphasizes fostering autonomy, responsibility, and a love for learning through project-based experiential education.",
      emoji: "\u{1F680}",
      color: "var(--coral)",
    },
    {
      title: "Real-World Connections",
      description: "By connecting classroom knowledge to real-world experiences, we create meaningful and engaging learning opportunities.",
      emoji: "\u{1F30F}",
      color: "var(--mint)",
    },
    {
      title: "Empowering Teachers",
      description: "We empower our teachers with continuous professional development and authentic resources, enabling them to guide and inspire students effectively.",
      emoji: "\u{1F469}\u200D\u{1F3EB}",
      color: "var(--lavender)",
    },
    {
      title: "Holistic Growth",
      description: "At the heart of our philosophy is the commitment to holistic growth, where each child\u2019s curiosity, creativity, and potential are celebrated and nurtured.",
      emoji: "\u{1F331}",
      color: "var(--peach)",
    },
  ];
  for (let i = 0; i < philosophy.length; i++) {
    await prisma.philosophy.create({
      data: { ...philosophy[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Activities — School Life (from src/app/facilities/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding activities...");
  const activities = [
    {
      tag: "Join the Club",
      title: "Club Activities",
      description: "Join student-run clubs like Science, IT, Sports, or Leo Club to explore your passions, develop new skills, and connect with classmates who share similar interests!",
      image: "/images/facilities/club-activities.webp",
      color: "var(--coral)",
      section: "school_life",
    },
    {
      tag: "Find Your Voice",
      title: "Public Speaking",
      description: "Find your voice! Develop your public speaking skills through debates and elocutions. Learn to confidently express your ideas and become a powerful communicator.",
      image: "/images/facilities/public-speaking.webp",
      color: "var(--mint)",
      section: "school_life",
    },
    {
      tag: "Express Yourself",
      title: "Arts and Dramatics",
      description: "Unleash your creativity! Explore your artistic talents and learn to express yourself through visual arts and drama. Showcase your skills on stage and develop your confidence.",
      image: "/images/facilities/arts-dramatics.webp",
      color: "var(--lavender)",
      section: "school_life",
    },
    {
      tag: "Explore the World Around You",
      title: "Field Trips and Outings",
      description: "Explore beyond the classroom with exciting field trips! Discover nature, visit new places, deepen your understanding, and create lasting memories with classmates!",
      image: "/images/facilities/field-trips.webp",
      color: "var(--peach)",
      section: "school_life",
    },
    {
      tag: "Get Active and Healthy",
      title: "Physical Education",
      description: "Join our fun and engaging PE classes to stay active and build a healthy lifestyle! Enjoy a variety of options like swimming, cricket, basketball, football, yoga, table tennis, karate, and more!",
      image: "/images/facilities/physical-education.webp",
      color: "var(--navy-light)",
      section: "school_life",
    },
    {
      tag: "Explore Your Interest",
      title: "Extra-Curricular Activities (ECA)",
      description: "Discover new passions and talents with activities like sports, music, clubs, and public speaking! Build teamwork, leadership, and communication skills while having fun and exploring what you love.",
      image: "/images/facilities/eca.webp",
      color: "var(--gold)",
      section: "school_life",
    },
  ];
  for (let i = 0; i < activities.length; i++) {
    await prisma.activity.create({
      data: { ...activities[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Facilities (from src/app/facilities/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding facilities...");

  // Resources
  const resources = [
    {
      title: "Auditorium",
      description: "This is an ultra-modern hall for a variety of purposes, such as cultural programs, major competitions, conferences and more.",
      category: "resource",
    },
    {
      title: "Library",
      description: "Our spacious library is filled with books, magazines, and newspapers. It's a haven for bookworms and a great place to find resources for any project.",
      category: "resource",
    },
    {
      title: "Comfortable Classrooms",
      description: "We understand the importance of a positive learning environment. Our classrooms are bright, well-equipped, and age-appropriate.",
      category: "resource",
    },
    {
      title: "Learning Made Fun!",
      description: "Our classrooms use innovative technology to make learning interactive and engaging. Imagine lessons coming to life with visuals, animations, and activities.",
      category: "resource",
    },
  ];
  for (let i = 0; i < resources.length; i++) {
    await prisma.facility.create({
      data: { ...resources[i], sortOrder: i },
    });
  }

  // Labs
  const labs = [
    {
      title: "Science Lab",
      subtitle: "Discover the World Around You",
      description: "In our Science Labs (Physics, Chemistry, and Biology), students get to conduct experiments, explore scientific concepts, and gain a deeper understanding of the world.",
      image: "/images/facilities/science-lab.webp",
      color: "var(--mint)",
      category: "lab",
    },
    {
      title: "Abacus",
      subtitle: "Mental Mathematics Program",
      description: "The Abacus Mental Mathematics Program at Aarambha School enhances students' math skills, memory, focus, and problem-solving abilities through engaging and interactive methods.",
      image: "/images/facilities/abacus.webp",
      color: "var(--coral)",
      category: "lab",
    },
    {
      title: "Math Lab",
      subtitle: "Sharpen Your Skills",
      description: "Our well-equipped Math Lab provides a space for hands-on activities and experimentation, helping students develop strong logical reasoning and problem-solving skills.",
      image: "/images/facilities/math-lab.webp",
      color: "var(--lavender)",
      category: "lab",
    },
  ];
  for (let i = 0; i < labs.length; i++) {
    await prisma.facility.create({
      data: { ...labs[i], sortOrder: i },
    });
  }

  // Digital learning
  const digitalItems = [
    {
      title: "NCC Education \u2014 DigiSchool",
      description: "A UK-based computer curriculum that provides students with a structured and innovative approach to digital learning, equipping them with essential skills in technology to thrive in today\u2019s digital world.",
      image: "/images/facilities/ncc-digischool.webp",
      category: "digital",
    },
    {
      title: "ICT and E-learning",
      description: "We integrate Information and Communication Technology (ICT) into our curriculum. Students learn valuable computer skills and gain access to online resources, preparing them for the digital world. MeroSchool provides digital content to classes 1 through 12, making learning easy.",
      image: "/images/facilities/ict-elearning.webp",
      category: "digital",
    },
  ];
  for (let i = 0; i < digitalItems.length; i++) {
    await prisma.facility.create({
      data: { ...digitalItems[i], sortOrder: i },
    });
  }

  // Health — Medicare
  await prisma.facility.create({
    data: {
      title: "Medicare \u2014 Your Child\u2019s Wellbeing Matters",
      description: "We have a fully-equipped health unit staffed with a qualified nurse available on a full-time basis to ensure the well-being and safety of all students. Our health unit is designed to provide immediate care for minor injuries, illnesses, and emergencies, offering a supportive and caring environment.",
      image: "/images/facilities/medicare.webp",
      category: "health",
      sortOrder: 0,
    },
  });

  // Convenience — Transport & Cafeteria
  const conveniences = [
    {
      title: "Transportation Services: Safe and Secure Journeys",
      description: "We offer safe and reliable transportation services for students on designated routes.",
      category: "convenience",
    },
    {
      title: "Cafeteria: Healthy and Delicious Meals",
      description: "Our modern cafeteria provides nutritious and delicious meals and snacks for students and teachers.",
      category: "convenience",
    },
  ];
  for (let i = 0; i < conveniences.length; i++) {
    await prisma.facility.create({
      data: { ...conveniences[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Gallery Images (from src/app/gallery/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding gallery images...");
  const galleryImages = [
    // School Life
    { src: "/images/facilities/club-activities.webp", alt: "Club Activities \u2014 Science, IT, Sports & Leo Club", category: "School Life" },
    { src: "/images/facilities/public-speaking.webp", alt: "Public Speaking \u2014 Debates & Elocutions", category: "School Life" },
    { src: "/images/facilities/arts-dramatics.webp", alt: "Arts and Dramatics \u2014 Visual Arts & Drama", category: "School Life" },
    { src: "/images/facilities/field-trips.webp", alt: "Field Trips and Outings", category: "School Life" },
    { src: "/images/facilities/physical-education.webp", alt: "Physical Education \u2014 Sports & Fitness", category: "School Life" },
    { src: "/images/facilities/eca.webp", alt: "Extra-Curricular Activities", category: "School Life" },
    // Campus
    { src: "/images/facilities/beyond-classroom.webp", alt: "Learning Beyond the Classroom", category: "Campus" },
    { src: "/images/facilities/convenience-1.webp", alt: "School Campus & Infrastructure", category: "Campus" },
    { src: "/images/facilities/convenience-2.webp", alt: "School Building & Grounds", category: "Campus" },
    { src: "/images/facilities/digital-education.webp", alt: "Digital Education & Smart Classrooms", category: "Campus" },
    { src: "/images/facilities/medicare.webp", alt: "Health Unit & Medicare Facility", category: "Campus" },
    { src: "/images/about-1.webp", alt: "About Aarambha \u2014 Our School", category: "Campus" },
    // Labs
    { src: "/images/facilities/science-lab.webp", alt: "Science Lab \u2014 Physics, Chemistry & Biology", category: "Labs" },
    { src: "/images/facilities/abacus.webp", alt: "Abacus \u2014 Mental Mathematics Program", category: "Labs" },
    { src: "/images/facilities/math-lab.webp", alt: "Math Lab \u2014 Hands-on Learning", category: "Labs" },
    // Community
    { src: "/images/community/regular-meetings.webp", alt: "Parent-Teacher Regular Meetings", category: "Community" },
    { src: "/images/community/partnerships-1.webp", alt: "Community Partnership Events", category: "Community" },
    { src: "/images/community/partnerships-2.webp", alt: "Students in Community Programs", category: "Community" },
    // Team
    { src: "/images/team/naresh.webp", alt: "Naresh Prasad Shrestha \u2014 Chairman & Principal", category: "Team" },
    { src: "/images/team/rossete.webp", alt: "Rossete Dela Rosa Tamang \u2014 VP Pre-school to Grade 5", category: "Team" },
    { src: "/images/team/dinesh.webp", alt: "Dinesh Shrestha \u2014 VP Grade 6-12", category: "Team" },
    { src: "/images/team/sunita.webp", alt: "Sunita Maharjan \u2014 Coordinator Pre-school to Grade 5", category: "Team" },
    { src: "/images/team/deepika.webp", alt: "Deepika Shrestha \u2014 Coordinator Grade 6-10", category: "Team" },
    { src: "/images/team/kripa.webp", alt: "Kripa Bajracharya \u2014 ECA Coordinator", category: "Team" },
  ];
  for (let i = 0; i < galleryImages.length; i++) {
    await prisma.galleryImage.create({
      data: { ...galleryImages[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Contact Info (from src/app/contact/page.tsx)
  // ──────────────────────────────────────────────
  console.log("Seeding contact info...");
  const contactInfo = [
    {
      label: "Address",
      value: "Thamel, Galko Pakha Marga, Kathmandu",
      type: "address",
      icon: "MapPinIcon",
    },
    {
      label: "Phone",
      value: "014547650",
      type: "phone",
      icon: "PhoneIcon",
    },
    {
      label: "Email",
      value: "info@aarambha.school",
      type: "email",
      icon: "EnvelopeIcon",
    },
    {
      label: "Office Hours",
      value: "Sunday - Friday: 7:00 AM - 4:00 PM",
      type: "hours",
      icon: "ClockIcon",
    },
  ];
  for (let i = 0; i < contactInfo.length; i++) {
    await prisma.contactInfo.create({
      data: { ...contactInfo[i], sortOrder: i },
    });
  }

  // ──────────────────────────────────────────────
  // Site Settings
  // ──────────────────────────────────────────────
  console.log("Seeding site settings...");
  const siteSettings: Array<{ key: string; value: string }> = [
    // Principal message (from src/app/page.tsx)
    {
      key: "principal_message",
      value: "At Aarambha Sanskar Vidyalaya, we blend traditional values with modern learning to nurture curious, creative, and compassionate leaders. Our STEAM-rich curriculum and cultural roots prepare students to excel academically and thrive as global citizens. With our dedicated educators and innovative programs, we provide a supportive environment where every child\u2019s potential blossoms.",
    },
    {
      key: "principal_name",
      value: "Naresh Prasad Shrestha",
    },
    {
      key: "principal_image",
      value: "/images/principal.webp",
    },

    // Mission & Vision (from src/app/about/page.tsx)
    {
      key: "mission",
      value: "Our mission is to blend digital technology with Eastern philosophy, fostering lifelong learners and compassionate leaders through a STEAM-based, balanced curriculum that promotes academic excellence, personal growth, and cultural connection.",
    },
    {
      key: "vision",
      value: "To create a transformative educational experience that blends Eastern values and philosophy with 21st-century digital innovation, fostering the holistic development of every student \u2014 intellectually, emotionally, ethically, and physically \u2014 equipping them to thrive in a rapidly changing world.",
    },

    // About text (from src/app/about/page.tsx) — JSON array of paragraphs
    {
      key: "about_text",
      value: JSON.stringify([
        "Aarambha School is a progressive K-12 educational institution strategically located in the heart of the city at Pipal Bot, Galko Pakha Marga, Ward Number 26, Kathmandu.",
        "Aarambha School is a common vision of eminent academicians, successful entrepreneurs, tech-leaders and successful personalities from different walks of life. They joined hands together to provide a student-centered, inquiry-based, and interdisciplinary education that fosters the holistic development of each individual.",
        "As a pioneering institution, the school represents the convergence of Eastern wisdom and modern educational innovation, creating a unique learning environment that prepares students for the challenges and opportunities of the 21st century.",
        "We prioritize hands-on, inquiry-based learning experiences that integrate the core principles of Science, Technology, Engineering, Arts, and Mathematics (STEAM). This approach equips our students with the tools they need to tackle complex real-world challenges with confidence and enthusiasm.",
      ]),
    },

    // Social media URLs (from src/app/contact/page.tsx and src/components/Footer.tsx)
    {
      key: "facebook_url",
      value: "https://www.facebook.com/profile.php?id=61572480778405",
    },
    {
      key: "instagram_url",
      value: "https://www.instagram.com/aarambha_school",
    },
    {
      key: "tiktok_url",
      value: "https://www.tiktok.com/@aarambha.school",
    },

    // WhatsApp number (from src/app/contact/page.tsx WhatsAppCTA component)
    {
      key: "whatsapp_number",
      value: "9779823837865",
    },

    // Google Maps embed URL (from src/app/contact/page.tsx MapSection)
    {
      key: "map_embed_url",
      value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8!2d85.3!3d27.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzAwLjAiTiA4NcKwMTgnMDAuMCJF!5e0!3m2!1sen!2snp!4v1",
    },

    // Counseling points (from src/app/facilities/page.tsx) — JSON array
    {
      key: "counseling_points",
      value: JSON.stringify([
        "Personal counseling services from qualified professionals.",
        "Helping students overcome challenges and emotional hurdles.",
        "Providing guidance to help students thrive academically and personally.",
        "Offering a secure space where students can openly discuss concerns.",
      ]),
    },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSettings.create({
      data: setting,
    });
  }

  console.log("\nSeeding complete!");
  console.log("Summary:");
  console.log(`  - ${stats.length} stats`);
  console.log(`  - ${teamMembers.length} team members`);
  console.log(`  - ${testimonials.length} testimonials`);
  console.log(`  - ${partners.length} partners`);
  console.log(`  - ${programs.length} programs`);
  console.log(`  - ${homepageFeatures.length} homepage features`);
  console.log(`  - ${schoolLifeItems.length} school life items`);
  console.log(`  - ${specialFeatures.length} special features`);
  console.log(`  - ${keyBenefits.length} key benefits`);
  console.log(`  - ${parentTeacherItems.length + businessItems.length + educationalItems.length} community involvement items`);
  console.log(`  - ${coreValues.length} core values`);
  console.log(`  - ${philosophy.length} philosophy items`);
  console.log(`  - ${activities.length} activities`);
  console.log(`  - ${resources.length + labs.length + digitalItems.length + conveniences.length + 1} facilities`);
  console.log(`  - ${galleryImages.length} gallery images`);
  console.log(`  - ${contactInfo.length} contact info entries`);
  console.log(`  - ${siteSettings.length} site settings`);
  console.log(`  - 1 admin user`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
