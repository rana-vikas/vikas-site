import { FadeIn } from "@/components/animations/FadeIn";
import { StatsGrid, type Stat } from "@/components/ui/StatsGrid";

export function RecruiterSection({
  stats,
  resumeUrl,
}: {
  stats: Stat[];
  resumeUrl: string | null;
}) {
  return (
    <section id="recruiter" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-sm uppercase tracking-widest text-muted">
          For Recruiters
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="mt-8 flex flex-col gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center sm:justify-between">
          {stats.length > 0 ? (
            <StatsGrid stats={stats} className="flex-1" />
          ) : (
            <p className="flex-1 text-sm text-muted">
              Stats will appear once experience and projects are added.
            </p>
          )}
          {resumeUrl ? (
            <a
              href={resumeUrl}
              download
              className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-center text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Download Resume
            </a>
          ) : (
            <p className="shrink-0 text-sm text-muted">Resume coming soon.</p>
          )}
        </div>
      </FadeIn>
    </section>
  );
}
