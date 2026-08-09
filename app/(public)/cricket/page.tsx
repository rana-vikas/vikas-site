import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/FadeIn";
import { TeamStory } from "@/components/cricket/TeamStory";
import { PlayersGrid } from "@/components/cricket/PlayersGrid";
import { MatchesTimeline } from "@/components/cricket/MatchesTimeline";
import { TournamentsList } from "@/components/cricket/TournamentsList";
import { MemoriesGallery } from "@/components/cricket/MemoriesGallery";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function CricketPage() {
  const [team, players, matches, tournaments, memories] = await Promise.all([
    db.cricketTeam.findFirst(),
    db.cricketPlayer.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { photoMedia: true },
    }),
    db.cricketMatch.findMany({
      where: { published: true },
      orderBy: { matchDate: "desc" },
      include: { tournament: true },
    }),
    db.tournament.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    db.cricketMemory.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      include: { media: true },
    }),
  ]);

  return (
    <>
      <TeamStory team={team} />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Players
          </h2>
        </FadeIn>
        <div className="mt-8">
          <PlayersGrid players={players} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Matches
          </h2>
        </FadeIn>
        <div className="mt-8">
          <MatchesTimeline matches={matches} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Tournaments
          </h2>
        </FadeIn>
        <div className="mt-8">
          <TournamentsList tournaments={tournaments} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Memories
          </h2>
        </FadeIn>
        <div className="mt-8">
          <MemoriesGallery memories={memories} />
        </div>
      </section>
    </>
  );
}
