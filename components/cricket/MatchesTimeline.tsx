import type { CricketMatch, Tournament } from "@/lib/generated/prisma/client";
import { formatMonthYear } from "@/lib/utils/date";
import { FadeIn } from "@/components/animations/FadeIn";
import { Timeline } from "@/components/timeline/Timeline";

type MatchWithTournament = CricketMatch & { tournament: Tournament | null };

export function MatchesTimeline({
  matches,
}: {
  matches: MatchWithTournament[];
}) {
  if (matches.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Matches coming soon.</p>
      </FadeIn>
    );
  }

  return (
    <Timeline
      items={matches.map((match) => ({
        id: match.id,
        title: `vs ${match.opponent}`,
        subtitle: match.tournament?.name,
        period: formatMonthYear(match.matchDate),
        description: [match.result, match.summary].filter(Boolean).join(" — ") || null,
      }))}
    />
  );
}
