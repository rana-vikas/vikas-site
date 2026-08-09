import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { deletePlayer, updatePlayer } from "@/lib/actions/cricket";
import { PlayerForm } from "@/components/admin/PlayerForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditPlayerPage(
  props: PageProps<"/admin/cricket/players/[id]">,
) {
  const { id } = await props.params;

  const player = await db.cricketPlayer.findUnique({
    where: { id },
    include: { photoMedia: true },
  });

  if (!player) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Edit Player
        </h1>
        <DeleteButton
          action={deletePlayer.bind(null, player.id)}
          confirmMessage="Delete this player?"
        />
      </div>
      <div className="mt-8">
        <PlayerForm
          player={player}
          action={updatePlayer.bind(null, player.id)}
        />
      </div>
    </div>
  );
}
