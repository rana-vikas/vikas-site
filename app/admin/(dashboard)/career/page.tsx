import Link from "next/link";
import { db } from "@/lib/db";
import {
  createAchievement,
  createCertification,
  createSkill,
  deleteAchievement,
  deleteCertification,
  deleteSkill,
} from "@/lib/actions/career";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCareerPage() {
  const [experiences, projects, skills, achievements, certifications] =
    await Promise.all([
      db.experience.findMany({ orderBy: { startDate: "desc" } }),
      db.project.findMany({ orderBy: { createdAt: "desc" } }),
      db.skill.findMany({ orderBy: { order: "asc" } }),
      db.achievement.findMany({ orderBy: { order: "asc" } }),
      db.certification.findMany({ orderBy: { order: "asc" } }),
    ]);

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Career</h1>
        <p className="mt-2 text-sm text-muted">
          Profile summary and resume live under{" "}
          <Link href="/admin/settings" className="text-cyan hover:underline">
            Settings
          </Link>
          .
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Experience</h2>
          <Link
            href="/admin/career/experience/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            New
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {experiences.map((experience) => (
            <Link
              key={experience.id}
              href={`/admin/career/experience/${experience.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {experience.title}
                </p>
                <p className="text-xs text-muted">{experience.company}</p>
              </div>
              <span
                className={`rounded-full border border-white/10 px-2 py-1 text-xs ${
                  experience.published ? "text-muted" : "text-muted/60"
                }`}
              >
                {experience.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {experiences.length === 0 && (
            <p className="text-sm text-muted">No experience entries yet.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Projects</h2>
          <Link
            href="/admin/career/projects/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            New
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/admin/career/projects/${project.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {project.title}
                </p>
                <p className="text-xs text-muted">{project.summary}</p>
              </div>
              <span
                className={`rounded-full border border-white/10 px-2 py-1 text-xs ${
                  project.published ? "text-muted" : "text-muted/60"
                }`}
              >
                {project.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {projects.length === 0 && (
            <p className="text-sm text-muted">No projects yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-foreground"
            >
              {skill.name}{" "}
              <span className="text-xs text-muted">({skill.category})</span>
              <DeleteButton
                action={deleteSkill.bind(null, skill.id)}
                confirmMessage={`Remove ${skill.name}?`}
                label="✕"
              />
            </div>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-muted">No skills listed yet.</p>
          )}
        </div>
        <form
          action={createSkill}
          className="mt-4 flex max-w-lg flex-wrap items-end gap-2"
        >
          <input
            name="name"
            placeholder="Skill"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="category"
            placeholder="Category (e.g. Language)"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Achievements</h2>
        <div className="mt-4 space-y-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <p className="text-sm text-foreground">{achievement.title}</p>
              <DeleteButton
                action={deleteAchievement.bind(null, achievement.id)}
                confirmMessage={`Remove ${achievement.title}?`}
              />
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-sm text-muted">No achievements yet.</p>
          )}
        </div>
        <form
          action={createAchievement}
          className="mt-4 flex max-w-lg flex-wrap items-end gap-2"
        >
          <input
            name="title"
            placeholder="Achievement"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="date"
            type="date"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">
          Certifications
        </h2>
        <div className="mt-4 space-y-2">
          {certifications.map((certification) => (
            <div
              key={certification.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p className="text-sm text-foreground">
                  {certification.title}
                </p>
                <p className="text-xs text-muted">{certification.issuer}</p>
              </div>
              <DeleteButton
                action={deleteCertification.bind(null, certification.id)}
                confirmMessage={`Remove ${certification.title}?`}
              />
            </div>
          ))}
          {certifications.length === 0 && (
            <p className="text-sm text-muted">No certifications yet.</p>
          )}
        </div>
        <form
          action={createCertification}
          className="mt-4 flex max-w-lg flex-wrap items-end gap-2"
        >
          <input
            name="title"
            placeholder="Certification"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="issuer"
            placeholder="Issuer"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="date"
            type="date"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="url"
            placeholder="URL (optional)"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
