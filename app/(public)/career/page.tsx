import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage/url";
import { ProfessionalSummary } from "@/components/career/ProfessionalSummary";
import { ExperienceTimeline } from "@/components/career/ExperienceTimeline";
import { SkillsSection } from "@/components/career/SkillsSection";
import { ProjectsGrid } from "@/components/career/ProjectsGrid";
import { CredentialsSection } from "@/components/career/CredentialsSection";
import { RecruiterSection } from "@/components/career/RecruiterSection";
import { FadeIn } from "@/components/animations/FadeIn";
import type { Stat } from "@/components/ui/StatsGrid";
import { pageMetadata } from "@/lib/seo/metadata";

/* eslint-disable react-hooks/purity -- Server Component: this whole module
   runs once per request, not subject to client re-render replay, so the
   Date.now() call below computing years-of-experience is safe. */

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Career",
  description: "Professional summary, experience, projects, and a recruiter view.",
  path: "/career",
});

const YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export default async function CareerPage() {
  const [profile, experiences, skills, projects, achievements, certifications] =
    await Promise.all([
      db.profile.findFirst({ include: { resumeMedia: true } }),
      db.experience.findMany({
        where: { published: true },
        orderBy: { startDate: "desc" },
      }),
      db.skill.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      db.project.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
        include: { coverMedia: true },
      }),
      db.achievement.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      db.certification.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    ]);

  const earliestStart = experiences.length
    ? Math.min(...experiences.map((experience) => experience.startDate.getTime()))
    : null;
  const yearsExperience = earliestStart
    ? Math.max(1, Math.round((Date.now() - earliestStart) / YEAR_MS))
    : null;

  const stats: Stat[] = [];
  if (yearsExperience) {
    stats.push({ label: "Years Experience", value: `${yearsExperience}+` });
  }
  if (projects.length > 0) {
    stats.push({ label: "Projects", value: `${projects.length}` });
  }
  if (certifications.length > 0) {
    stats.push({ label: "Certifications", value: `${certifications.length}` });
  }
  if (skills.length > 0) {
    stats.push({ label: "Skills", value: `${skills.length}` });
  }

  const resumeUrl = profile?.resumeMedia ? publicUrl(profile.resumeMedia.key) : null;

  return (
    <>
      <ProfessionalSummary summary={profile?.summary ?? null} />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Experience
          </h2>
        </FadeIn>
        <div className="mt-8">
          <ExperienceTimeline experiences={experiences} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Skills
          </h2>
        </FadeIn>
        <div className="mt-8">
          <SkillsSection skills={skills} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Projects
          </h2>
        </FadeIn>
        <div className="mt-8">
          <ProjectsGrid projects={projects} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <CredentialsSection achievements={achievements} certifications={certifications} />
      </section>

      <RecruiterSection stats={stats} resumeUrl={resumeUrl} />
    </>
  );
}
