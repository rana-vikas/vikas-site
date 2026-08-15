import { PutObjectCommand } from "@aws-sdk/client-s3";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { db } from "../lib/db";
import { storageClient, STORAGE_BUCKET } from "../lib/storage/client";

const PLACEHOLDER_WIDTH = 1600;
const PLACEHOLDER_HEIGHT = 1000;

async function uploadPlaceholderImage(
  key: string,
  color: { r: number; g: number; b: number },
) {
  const buffer = await sharp({
    create: {
      width: PLACEHOLDER_WIDTH,
      height: PLACEHOLDER_HEIGHT,
      channels: 3,
      background: color,
    },
  })
    .jpeg({ quality: 70 })
    .toBuffer();

  await storageClient.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    }),
  );
}

async function seedMedia(key: string, color: { r: number; g: number; b: number }, alt: string) {
  await uploadPlaceholderImage(key, color);
  return db.media.upsert({
    where: { key },
    update: {},
    create: {
      key,
      type: "image",
      width: PLACEHOLDER_WIDTH,
      height: PLACEHOLDER_HEIGHT,
      alt,
    },
  });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.user.upsert({
      where: { email: adminEmail },
      update: { password: passwordHash },
      create: {
        email: adminEmail,
        password: passwordHash,
        name: "Vikas Rana",
        role: "admin",
      },
    });
  } else {
    console.warn(
      "Skipping admin user: ADMIN_EMAIL and/or ADMIN_PASSWORD not set.",
    );
  }

  const existingProfile = await db.profile.findFirst();
  if (!existingProfile) {
    await db.profile.create({
      data: {
        name: "Vikas Rana",
        headline: "Vikas Rana",
        tagline: "Different Worlds. One Person.",
        summary: "Placeholder profile summary — replace via the Phase 8 admin.",
      },
    });
  }

  // Real career content, sourced verbatim from Website_Career_Content.md
  // (the user's own pre-filtered, public-safe career record). Unlike the
  // placeholders above, this is real biographical content the user supplied
  // — see vikas-site-content-policy memory for why placeholder facts are
  // never invented but real supplied facts are seeded directly.
  const CAREER_SUMMARY = [
    "19+ years in technology, 18 of them in healthcare-tech — building reliable systems and leading AI-enabled automation for enterprise-scale operations.",
    'Senior technology professional with 19+ years of experience spanning software engineering, production operations, Site Reliability Engineering (SRE), automation, and enterprise platform delivery. Currently leads AI-enabled operational transformation for a large healthcare technology organization — driving application stability and resiliency programs, change-governance automation, incident intelligence, and GenAI-powered operational tooling.',
    'Career path has moved from hands-on mainframe development, through technical/project leadership and service ownership, into SRE and automation leadership — with a consistent thread of taking systems from "working" to "reliable, observable, and self-improving." Recognized in 2025 with an organization-wide Impact Award for leading AI-led transformation initiatives.',
  ].join("\n\n");

  const placeholderSummary = "Placeholder profile summary — replace via the Phase 8 admin.";
  const profileForSummary = existingProfile ?? (await db.profile.findFirst());
  if (profileForSummary && (profileForSummary.summary === placeholderSummary || !profileForSummary.summary)) {
    await db.profile.update({
      where: { id: profileForSummary.id },
      data: { summary: CAREER_SUMMARY },
    });
  }

  const careerExperiences = [
    {
      company: "Optum / UnitedHealth Group",
      title: "Senior Software Engineer II | SRE & Automation Lead",
      location: "Gurugram, India",
      startDate: "2022-12-01",
      endDate: null as string | null,
      current: true,
      description: [
        "Application stability, availability, and resiliency programs, including peak-season and disaster-recovery readiness",
        "End-to-end high-priority incident coordination and problem-management follow-through",
        "Production change governance, including AI-assisted change-risk review",
        "Design and delivery of enterprise GenAI-enabled tooling for change risk, incident intelligence/reporting, and operational assistance",
        "Ownership of an enterprise endpoint performance-monitoring application",
        "Automation-first delivery using Python and Microsoft Power Automate",
        "Impact Award winner (2025) for leading AI-driven transformation of technology operations",
      ].join("\n"),
    },
    {
      company: "Optum / UnitedHealth Group",
      title: "Service Level Owner — Public-Health Reporting Platform",
      location: "Gurugram, India",
      startDate: "2022-02-01",
      endDate: "2022-11-01",
      current: false,
      description:
        "Owned reliability and 24x7 production support for a state public-health COVID-19 data reporting and analytics platform.",
    },
    {
      company: "Optum / UnitedHealth Group",
      title: "Technical Lead — Provider & Network Data Platform",
      location: "Gurugram, India",
      startDate: "2019-04-01",
      endDate: "2022-02-01",
      current: false,
      description:
        "Led delivery of a provider-information and network-management system (credentialing, contracts, fee schedules), owning release delivery, sprint planning, and production support.",
    },
    {
      company: "Optum / UnitedHealth Group",
      title: "Technical Lead / Scrum Master — Policy Administration Platform",
      location: "Gurugram, India",
      startDate: "2017-12-01",
      endDate: "2019-04-01",
      current: false,
      description:
        "Led an offshore delivery team building policy-management functionality; ran Scrum ceremonies and production-change/RCA processes.",
    },
    {
      company: "Optum / UnitedHealth Group",
      title: "Project Lead — Claims Payment & Member Billing Systems",
      location: "Gurugram, India",
      startDate: "2008-08-01",
      endDate: "2017-12-01",
      current: false,
      description:
        "Progressed from Onsite Service Coordinator to Project Lead across claims-payment processing, provider payment/remittance, and member billing systems.",
    },
    {
      company: "NIIT Technologies (now Coforge)",
      title: "Developer",
      location: null as string | null,
      startDate: "2007-01-01",
      endDate: "2008-08-01",
      current: false,
      description:
        "Delivered mainframe applications for U.S. insurance and banking clients, including loan-processing and insurance policy-administration platforms.",
    },
  ];

  for (const [index, experience] of careerExperiences.entries()) {
    const existing = await db.experience.findFirst({
      where: { company: experience.company, title: experience.title },
    });
    const data = {
      company: experience.company,
      title: experience.title,
      location: experience.location,
      startDate: new Date(experience.startDate),
      endDate: experience.endDate ? new Date(experience.endDate) : null,
      current: experience.current,
      description: experience.description,
      published: true,
      order: index,
    };
    if (existing) {
      await db.experience.update({ where: { id: existing.id }, data });
    } else {
      await db.experience.create({ data });
    }
  }

  const careerSkills: { category: string; name: string }[] = [
    { category: "Reliability & Operations", name: "Site Reliability Engineering" },
    { category: "Reliability & Operations", name: "Incident/problem/change management" },
    { category: "Reliability & Operations", name: "Root-cause analysis" },
    { category: "Reliability & Operations", name: "Disaster-recovery readiness" },
    { category: "Reliability & Operations", name: "Monitoring & observability" },
    { category: "Reliability & Operations", name: "24x7 production support" },
    { category: "AI & Automation", name: "GenAI-assisted tooling" },
    { category: "AI & Automation", name: "LLM prompting" },
    { category: "AI & Automation", name: "Intelligent workflow automation" },
    { category: "AI & Automation", name: "Microsoft Power Automate" },
    { category: "AI & Automation", name: "Python automation" },
    { category: "Engineering", name: "Python (FastAPI)" },
    { category: "Engineering", name: "React" },
    { category: "Engineering", name: "Docker" },
    { category: "Engineering", name: "Linux/RHEL" },
    { category: "Engineering", name: "SQL" },
    { category: "Engineering", name: "Mainframe (COBOL, JCL, DB2, VSAM, CICS, IMS)" },
    { category: "Leadership", name: "Technical/project leadership" },
    { category: "Leadership", name: "Scrum Master" },
    { category: "Leadership", name: "Service ownership" },
    { category: "Leadership", name: "Cross-functional coordination" },
    { category: "Domains", name: "Healthcare claims & payments" },
    { category: "Domains", name: "Provider & policy administration" },
    { category: "Domains", name: "Public-health reporting" },
    { category: "Domains", name: "Insurance/banking systems" },
  ];

  for (const [index, skill] of careerSkills.entries()) {
    const existing = await db.skill.findFirst({
      where: { name: skill.name, category: skill.category },
    });
    if (existing) {
      await db.skill.update({ where: { id: existing.id }, data: { order: index, published: true } });
    } else {
      await db.skill.create({ data: { ...skill, order: index, published: true } });
    }
  }

  const featuredWork = [
    {
      slug: "ai-assisted-change-governance",
      title: "AI-Assisted Change Governance",
      summary:
        "An enterprise platform that reviews production change requests for approval-readiness and risk, using GenAI to summarize risk factors and flag quality gaps before human review.",
    },
    {
      slug: "incident-intelligence-reporting",
      title: "Incident Intelligence & Reporting",
      summary:
        'A GenAI-powered platform that summarizes and reports on high-priority incident "war rooms" in real time, cutting down manual reporting effort during live incidents.',
    },
    {
      slug: "operational-genai-assistant",
      title: "Operational GenAI Assistant",
      summary:
        "A chatbot-style assistant that lets operations teams query incident and change data conversationally instead of digging through dashboards.",
    },
    {
      slug: "application-stability-resiliency-program",
      title: "Application Stability & Resiliency Program",
      summary:
        "An enterprise-wide assessment program that evaluates applications for operational readiness — monitoring, disaster-recovery, and reliability gaps — across a large application portfolio.",
    },
    {
      slug: "ai-driven-war-room-reliability-intelligence",
      title: "AI-Driven War Room & Reliability Intelligence",
      summary:
        "An integrated initiative connecting incident, chat, and change data into a single reliability picture for leadership visibility.",
    },
    {
      slug: "endpoint-performance-monitoring",
      title: "Endpoint Performance Monitoring",
      summary:
        "An application that continuously checks the health and performance of a large fleet of user-facing machines and alerts when something needs attention.",
    },
  ];

  for (const [index, project] of featuredWork.entries()) {
    await db.project.upsert({
      where: { slug: project.slug },
      update: { title: project.title, summary: project.summary, featured: true, published: true },
      create: {
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        featured: true,
        published: true,
        order: index,
      },
    });
  }

  const existingAchievement = await db.achievement.findFirst({
    where: { title: "Impact Award — Winner (2025)" },
  });
  if (!existingAchievement) {
    await db.achievement.create({
      data: {
        title: "Impact Award — Winner (2025)",
        description:
          "Individual, business-line-level recognition for leading AI-driven transformation of technology operations.",
        order: 0,
        published: true,
      },
    });
  }

  const educationAndCertifications = [
    {
      title: "Master of Computer Applications (MCA)",
      issuer: "Guru Jambheshwar University of Science & Technology, Hisar",
    },
    { title: "Bachelor of Computer Applications (BCA)", issuer: "Kurukshetra University, Kurukshetra" },
    { title: "Microsoft Certified: Azure Fundamentals (AZ-900)", issuer: "Microsoft" },
    { title: "ITIL v3 Foundation", issuer: "Certification" },
    { title: "AHM-250 — Healthcare Management", issuer: "Certification" },
    { title: "Claims SME — Level 2", issuer: "Optum / UnitedHealth Group" },
    {
      title: "Generative AI / Machine Learning / Advanced AI Topics — internal AI enablement program",
      issuer: "Optum / UnitedHealth Group",
    },
  ];

  for (const [index, entry] of educationAndCertifications.entries()) {
    const existing = await db.certification.findFirst({ where: { title: entry.title } });
    if (existing) {
      await db.certification.update({
        where: { id: existing.id },
        data: { issuer: entry.issuer, order: index, published: true },
      });
    } else {
      await db.certification.create({
        data: { title: entry.title, issuer: entry.issuer, order: index, published: true },
      });
    }
  }

  const travelCover = await seedMedia(
    "seed/travel-cover.jpg",
    { r: 105, g: 221, b: 255 },
    "Seed placeholder — latest travel cover",
  );

  await db.travelTrip.upsert({
    where: { slug: "sample-trip" },
    update: {},
    create: {
      slug: "sample-trip",
      title: "Sample Trip (seed placeholder)",
      location: "Somewhere",
      summary: "Placeholder trip — replace via the Phase 8 admin.",
      startDate: new Date(),
      published: true,
      latest: true,
      coverMediaId: travelCover.id,
    },
  });

  const album = await db.photoAlbum.upsert({
    where: { slug: "featured" },
    update: {},
    create: { slug: "featured", title: "Featured", published: true },
  });

  const photoColors = [
    { r: 7, g: 9, b: 13 },
    { r: 155, g: 131, b: 255 },
    { r: 153, g: 164, b: 181 },
    { r: 105, g: 221, b: 255 },
  ];

  // Demo EXIF values so the lightbox metadata panel has something to render
  // against these seed placeholder images — not real gear, just fixtures.
  const demoExif = [
    { camera: "Demo Camera X100", lens: "35mm f/1.4", aperture: "f/1.4", shutterSpeed: "1/250", iso: 100, focalLength: "35mm" },
    { camera: "Demo Camera X100", lens: "50mm f/1.8", aperture: "f/2.8", shutterSpeed: "1/500", iso: 200, focalLength: "50mm" },
    { camera: "Demo Camera X100", lens: "24-70mm f/2.8", aperture: "f/5.6", shutterSpeed: "1/125", iso: 400, focalLength: "70mm" },
    { camera: "Demo Camera X100", lens: "85mm f/1.8", aperture: "f/1.8", shutterSpeed: "1/1000", iso: 100, focalLength: "85mm" },
  ];

  for (const [index, color] of photoColors.entries()) {
    const media = await seedMedia(
      `seed/photo-${index + 1}.jpg`,
      color,
      `Seed placeholder photo ${index + 1}`,
    );

    const existingPhoto = await db.photo.findFirst({
      where: { albumId: album.id, mediaId: media.id },
    });
    const photoData = {
      caption: `Placeholder photo ${index + 1} — replace via the Phase 8 admin.`,
      featured: true,
      order: index,
      published: true,
      ...demoExif[index],
    };
    if (existingPhoto) {
      await db.photo.update({ where: { id: existingPhoto.id }, data: photoData });
    } else {
      await db.photo.create({
        data: { albumId: album.id, mediaId: media.id, ...photoData },
      });
    }
  }

  // Real facts from PLAN.md §6 — not placeholder content. Narrative, exact
  // dates, and day-by-day entries are left for the Phase 8 admin since only
  // these bare facts were provided.
  const existingJourney = await db.fitnessJourney.findFirst();
  if (!existingJourney) {
    await db.fitnessJourney.create({ data: { startYear: 2021 } });
  }

  await db.competition.upsert({
    where: { id: "seed-icn-goa-2024" },
    update: {},
    create: {
      id: "seed-icn-goa-2024",
      name: "ICN Goa 2024",
      result: "Bronze",
      published: true,
    },
  });

  await db.fitnessChallenge.upsert({
    where: { slug: "100-day" },
    update: {},
    create: {
      slug: "100-day",
      title: "100-Day Challenge",
      lengthDays: 100,
      published: true,
    },
  });

  await db.fitnessChallenge.upsert({
    where: { slug: "365-day" },
    update: {},
    create: {
      slug: "365-day",
      title: "365-Day Challenge",
      lengthDays: 365,
      published: true,
    },
  });

  // Real facts from PLAN.md §6 — not placeholder content. The story paragraph
  // is assembled only from facts stated there (2015 founding, US origin,
  // Gurgaon weekend cricket, "friends became family"); no players, matches,
  // tournaments, or memories are invented since none were given.
  const existingTeam = await db.cricketTeam.findFirst();
  if (!existingTeam) {
    await db.cricketTeam.create({
      data: {
        name: "Indus Knights",
        foundedYear: 2015,
        tagline: "Friends became family.",
        story:
          "Indus Knights got its start in 2015, born out of a group of friends with roots in the US. What began as casual weekend cricket in Gurgaon turned into something bigger — friends became family.",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
