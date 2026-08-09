import type { Competition } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";

export function CompetitionsList({
  competitions,
}: {
  competitions: Competition[];
}) {
  if (competitions.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">No competitions logged yet.</p>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-4">
      {competitions.map((competition, index) => (
        <FadeIn
          key={competition.id}
          delay={index * 0.05}
          className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              {competition.name}
            </p>
            {competition.location && (
              <p className="text-xs text-muted">{competition.location}</p>
            )}
          </div>
          {competition.result && (
            <span className="shrink-0 rounded-full border border-cyan/30 px-3 py-1 text-xs text-cyan">
              {competition.result}
            </span>
          )}
        </FadeIn>
      ))}
    </div>
  );
}
