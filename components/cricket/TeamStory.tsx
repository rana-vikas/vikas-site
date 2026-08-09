import type { CricketTeam } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";

export function TeamStory({ team }: { team: CricketTeam | null }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {team?.name ?? "Cricket"}
        </h1>
        {team?.tagline && (
          <p className="mt-4 text-lg text-cyan">{team.tagline}</p>
        )}
        <p className="mt-6 max-w-2xl text-lg text-muted">
          {team?.story ??
            (team
              ? `Founded in ${team.foundedYear}.`
              : "The team story is coming soon.")}
        </p>
      </FadeIn>
    </section>
  );
}
