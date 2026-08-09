import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deleteMatch, updateMatch } from "@/lib/actions/cricket";
import { MatchForm } from "@/components/admin/MatchForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditMatchPage(
  props: PageProps<"/admin/cricket/matches/[id]">,
) {
  const { id } = await props.params;

  const [match, tournaments] = await Promise.all([
    db.cricketMatch.findUnique({ where: { id } }),
    db.tournament.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!match) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Edit Match
        </h1>
        <DeleteButton
          action={deleteMatch.bind(null, match.id)}
          confirmMessage="Delete this match?"
        />
      </div>
      <div className="mt-8">
        <MatchForm
          match={match}
          tournaments={tournaments}
          action={updateMatch.bind(null, match.id)}
        />
      </div>
    </div>
  );
}
