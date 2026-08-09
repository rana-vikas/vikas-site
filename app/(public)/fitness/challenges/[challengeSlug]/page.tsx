import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/FadeIn";
import { EntryList } from "@/components/fitness/EntryList";
import { Pagination } from "@/components/ui/Pagination";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

const ENTRIES_PER_PAGE = 30;

export default async function ChallengePage(
  props: PageProps<"/fitness/challenges/[challengeSlug]">,
) {
  const { challengeSlug } = await props.params;
  const { page: pageParam } = await props.searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const challenge = await db.fitnessChallenge.findUnique({
    where: { slug: challengeSlug, published: true },
  });

  if (!challenge) {
    notFound();
  }

  const [entries, totalEntries] = await Promise.all([
    db.fitnessEntry.findMany({
      where: { challengeId: challenge.id, published: true },
      orderBy: { dayNumber: "asc" },
      skip: (page - 1) * ENTRIES_PER_PAGE,
      take: ENTRIES_PER_PAGE,
      include: { media: true },
    }),
    db.fitnessEntry.count({
      where: { challengeId: challenge.id, published: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalEntries / ENTRIES_PER_PAGE));

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {challenge.title}
        </h1>
        <p className="mt-4 text-muted">
          {totalEntries} of {challenge.lengthDays} days logged
        </p>
        {challenge.summary && (
          <p className="mt-4 max-w-2xl text-lg text-muted">
            {challenge.summary}
          </p>
        )}
      </FadeIn>
      <div className="mt-10">
        <EntryList entries={entries} />
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        basePath={`/fitness/challenges/${challenge.slug}`}
      />
    </section>
  );
}
