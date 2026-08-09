import Link from "next/link";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/FadeIn";
import { StatsGrid, type Stat } from "@/components/ui/StatsGrid";
import { CompetitionsList } from "@/components/fitness/CompetitionsList";
import { ChallengeCard } from "@/components/fitness/ChallengeCard";
import { ReachOutCta } from "@/components/fitness/ReachOutCta";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function FitnessPage() {
  const [journey, competitions, challenges] = await Promise.all([
    db.fitnessJourney.findFirst(),
    db.competition.findMany({
      where: { published: true },
      orderBy: [{ date: "desc" }, { order: "asc" }],
    }),
    db.fitnessChallenge.findMany({
      where: { published: true },
      orderBy: { lengthDays: "asc" },
      include: { _count: { select: { entries: true } } },
    }),
  ]);

  const yearsActive = journey
    ? Math.max(1, new Date().getFullYear() - journey.startYear)
    : null;

  const stats: Stat[] = [];
  if (journey) {
    stats.push({ label: "Years Active", value: `${yearsActive}+` });
  }
  if (competitions.length > 0) {
    stats.push({ label: "Competitions", value: `${competitions.length}` });
  }
  if (challenges.length > 0) {
    stats.push({ label: "Challenges", value: `${challenges.length}` });
  }

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
        <FadeIn>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Fitness
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            {journey?.story ??
              (journey
                ? `On a fitness journey since ${journey.startYear}.`
                : "The journey story is coming soon.")}
          </p>
        </FadeIn>
        <StatsGrid stats={stats} className="mt-10" />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Competitions
          </h2>
        </FadeIn>
        <div className="mt-8">
          <CompetitionsList competitions={competitions} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm uppercase tracking-widest text-muted">
              Challenges
            </h2>
            <Link
              href="/fitness/challenges"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
        </FadeIn>
        {challenges.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                entryCount={challenge._count.entries}
                delay={index * 0.08}
              />
            ))}
          </div>
        ) : (
          <FadeIn delay={0.1}>
            <p className="mt-8 text-sm text-muted">
              Challenges coming soon.
            </p>
          </FadeIn>
        )}
      </section>

      <ReachOutCta email={process.env.ADMIN_EMAIL ?? null} />
    </>
  );
}
