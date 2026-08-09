import { db } from "@/lib/db";
import { createMatch } from "@/lib/actions/cricket";
import { MatchForm } from "@/components/admin/MatchForm";

export const dynamic = "force-dynamic";

export default async function NewMatchPage() {
  const tournaments = await db.tournament.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Match</h1>
      <div className="mt-8">
        <MatchForm tournaments={tournaments} action={createMatch} />
      </div>
    </div>
  );
}
