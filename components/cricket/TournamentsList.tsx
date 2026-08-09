import type { Tournament } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";

export function TournamentsList({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  if (tournaments.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">No tournaments logged yet.</p>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-4">
      {tournaments.map((tournament, index) => (
        <FadeIn
          key={tournament.id}
          delay={index * 0.05}
          className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              {tournament.name}
            </p>
            {tournament.location && (
              <p className="text-xs text-muted">{tournament.location}</p>
            )}
          </div>
          {tournament.result && (
            <span className="shrink-0 rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan">
              {tournament.result}
            </span>
          )}
        </FadeIn>
      ))}
    </div>
  );
}
