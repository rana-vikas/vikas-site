import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  addEntry,
  deleteChallenge,
  deleteEntry,
  updateChallenge,
} from "@/lib/actions/fitness";
import { ChallengeForm } from "@/components/admin/ChallengeForm";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Pagination } from "@/components/ui/Pagination";

export const dynamic = "force-dynamic";

const ENTRIES_PER_PAGE = 30;

export default async function EditChallengePage(
  props: PageProps<"/admin/fitness/challenges/[id]">,
) {
  const { id } = await props.params;
  const { page: pageParam } = await props.searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const challenge = await db.fitnessChallenge.findUnique({ where: { id } });

  if (!challenge) {
    notFound();
  }

  const [entries, totalEntries] = await Promise.all([
    db.fitnessEntry.findMany({
      where: { challengeId: challenge.id },
      orderBy: { dayNumber: "asc" },
      skip: (page - 1) * ENTRIES_PER_PAGE,
      take: ENTRIES_PER_PAGE,
      include: { media: true },
    }),
    db.fitnessEntry.count({ where: { challengeId: challenge.id } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalEntries / ENTRIES_PER_PAGE));
  const nextDayNumber = totalEntries + 1;

  const boundUpdate = updateChallenge.bind(null, challenge.id);
  const boundDelete = deleteChallenge.bind(null, challenge.id);

  return (
    <div className="space-y-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Challenge
          </h1>
          <DeleteButton
            action={boundDelete}
            confirmMessage="Delete this challenge and all its entries?"
          />
        </div>
        <div className="mt-8">
          <ChallengeForm challenge={challenge} action={boundUpdate} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">
          Entries ({totalEntries} of {challenge.lengthDays})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <p className="text-xs uppercase tracking-widest text-muted">
                Day {entry.dayNumber}
              </p>
              {entry.title && (
                <p className="mt-1 text-sm text-foreground">{entry.title}</p>
              )}
              <div className="mt-2">
                <DeleteButton
                  action={deleteEntry.bind(null, entry.id)}
                  confirmMessage={`Remove day ${entry.dayNumber}?`}
                />
              </div>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-sm text-muted">No entries yet.</p>
          )}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          basePath={`/admin/fitness/challenges/${challenge.id}`}
        />

        <form
          action={addEntry}
          className="mt-6 max-w-md space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <input type="hidden" name="challengeId" value={challenge.id} />
          <div>
            <label htmlFor="dayNumber" className="text-sm text-muted">
              Day number
            </label>
            <input
              id="dayNumber"
              name="dayNumber"
              defaultValue={nextDayNumber}
              required
              pattern="\d+"
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
          </div>
          <input
            name="title"
            placeholder="Title (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <textarea
            name="notes"
            placeholder="Notes (optional)"
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <MediaUploadField name="mediaId" label="Photo (optional)" />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add entry
          </button>
        </form>
      </div>
    </div>
  );
}
