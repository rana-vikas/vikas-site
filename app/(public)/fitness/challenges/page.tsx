import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/FadeIn";
import { ChallengeCard } from "@/components/fitness/ChallengeCard";
import { pageMetadata } from "@/lib/seo/metadata";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Challenges",
  description: "100-day and 365-day fitness challenges, logged day by day.",
  path: "/fitness/challenges",
});

export default async function FitnessChallengesPage() {
  const challenges = await db.fitnessChallenge.findMany({
    where: { published: true },
    orderBy: { lengthDays: "asc" },
    include: { _count: { select: { entries: true } } },
  });

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Challenges
        </h1>
      </FadeIn>
      {challenges.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
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
          <p className="mt-10 text-sm text-muted">Challenges coming soon.</p>
        </FadeIn>
      )}
    </section>
  );
}
