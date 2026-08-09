import { createPlayer } from "@/lib/actions/cricket";
import { PlayerForm } from "@/components/admin/PlayerForm";

export default function NewPlayerPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Player</h1>
      <div className="mt-8">
        <PlayerForm action={createPlayer} />
      </div>
    </div>
  );
}
