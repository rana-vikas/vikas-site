import Link from "next/link";
import { db } from "@/lib/db";
import {
  addMemory,
  createTournament,
  deleteMemory,
  deleteTournament,
} from "@/lib/actions/cricket";
import { TeamForm } from "@/components/admin/TeamForm";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCricketPage() {
  const [team, players, tournaments, matches, memories] = await Promise.all([
    db.cricketTeam.findFirst(),
    db.cricketPlayer.findMany({ orderBy: { order: "asc" } }),
    db.tournament.findMany({ orderBy: { order: "asc" } }),
    db.cricketMatch.findMany({
      orderBy: { matchDate: "desc" },
      include: { tournament: true },
    }),
    db.cricketMemory.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Cricket</h1>
        <div className="mt-8">
          <TeamForm team={team} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Players</h2>
          <Link
            href="/admin/cricket/players/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            New
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {players.map((player) => (
            <Link
              key={player.id}
              href={`/admin/cricket/players/${player.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {player.name}
                </p>
                {player.role && (
                  <p className="text-xs text-muted">{player.role}</p>
                )}
              </div>
              <span
                className={`rounded-full border border-white/10 px-2 py-1 text-xs ${
                  player.published ? "text-muted" : "text-muted/60"
                }`}
              >
                {player.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {players.length === 0 && (
            <p className="text-sm text-muted">No players yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Tournaments</h2>
        <div className="mt-4 space-y-2">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p className="text-sm text-foreground">{tournament.name}</p>
                {tournament.location && (
                  <p className="text-xs text-muted">{tournament.location}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {tournament.result && (
                  <span className="rounded-full border border-cyan/30 px-2 py-1 text-xs text-cyan">
                    {tournament.result}
                  </span>
                )}
                <DeleteButton
                  action={deleteTournament.bind(null, tournament.id)}
                  confirmMessage={`Remove ${tournament.name}?`}
                />
              </div>
            </div>
          ))}
          {tournaments.length === 0 && (
            <p className="text-sm text-muted">No tournaments yet.</p>
          )}
        </div>
        <form
          action={createTournament}
          className="mt-4 flex max-w-lg flex-wrap items-end gap-2"
        >
          <input
            name="name"
            placeholder="Tournament"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="location"
            placeholder="Location (optional)"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="result"
            placeholder="Result (optional)"
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Matches</h2>
          <Link
            href="/admin/cricket/matches/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            New
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {matches.map((match) => (
            <Link
              key={match.id}
              href={`/admin/cricket/matches/${match.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  vs {match.opponent}
                </p>
                <p className="text-xs text-muted">
                  {match.tournament?.name ?? "No tournament"}
                </p>
              </div>
              <span
                className={`rounded-full border border-white/10 px-2 py-1 text-xs ${
                  match.published ? "text-muted" : "text-muted/60"
                }`}
              >
                {match.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {matches.length === 0 && (
            <p className="text-sm text-muted">No matches yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Memories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <p className="text-sm text-foreground">{memory.title}</p>
              <div className="mt-2">
                <DeleteButton
                  action={deleteMemory.bind(null, memory.id)}
                  confirmMessage={`Remove ${memory.title}?`}
                />
              </div>
            </div>
          ))}
          {memories.length === 0 && (
            <p className="text-sm text-muted">No memories yet.</p>
          )}
        </div>
        <form
          action={addMemory}
          className="mt-4 max-w-md space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <input
            name="title"
            placeholder="Memory title"
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <MediaUploadField name="mediaId" label="Photo (optional)" />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add memory
          </button>
        </form>
      </div>
    </div>
  );
}
