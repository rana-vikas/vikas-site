import Link from "next/link";
import { db } from "@/lib/db";
import { createCompetition, deleteCompetition } from "@/lib/actions/fitness";
import { JourneyForm } from "@/components/admin/JourneyForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminFitnessPage() {
  const [journey, competitions, challenges] = await Promise.all([
    db.fitnessJourney.findFirst(),
    db.competition.findMany({ orderBy: { order: "asc" } }),
    db.fitnessChallenge.findMany({
      orderBy: { lengthDays: "asc" },
      include: { _count: { select: { entries: true } } },
    }),
  ]);

  return (
    <div className="space-y-16">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Fitness</h1>
        <div className="mt-8">
          <JourneyForm journey={journey} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Competitions</h2>
        <div className="mt-4 space-y-2">
          {competitions.map((competition) => (
            <div
              key={competition.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p className="text-sm text-foreground">{competition.name}</p>
                {competition.location && (
                  <p className="text-xs text-muted">{competition.location}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {competition.result && (
                  <span className="rounded-full border border-cyan/30 px-2 py-1 text-xs text-cyan">
                    {competition.result}
                  </span>
                )}
                <DeleteButton
                  action={deleteCompetition.bind(null, competition.id)}
                  confirmMessage={`Remove ${competition.name}?`}
                />
              </div>
            </div>
          ))}
          {competitions.length === 0 && (
            <p className="text-sm text-muted">No competitions logged yet.</p>
          )}
        </div>
        <form
          action={createCompetition}
          className="mt-4 flex max-w-lg flex-wrap items-end gap-2"
        >
          <input
            name="name"
            placeholder="Competition"
            required
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="result"
            placeholder="Result (optional)"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="location"
            placeholder="Location (optional)"
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="date"
            type="date"
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
          <h2 className="text-lg font-medium text-foreground">Challenges</h2>
          <Link
            href="/admin/fitness/challenges/new"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            New
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {challenges.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/admin/fitness/challenges/${challenge.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {challenge.title}
                </p>
                <p className="text-xs text-muted">
                  {challenge._count.entries} of {challenge.lengthDays} days
                  logged
                </p>
              </div>
              <span
                className={`rounded-full border border-white/10 px-2 py-1 text-xs ${
                  challenge.published ? "text-muted" : "text-muted/60"
                }`}
              >
                {challenge.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))}
          {challenges.length === 0 && (
            <p className="text-sm text-muted">No challenges yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
