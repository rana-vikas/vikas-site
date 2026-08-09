"use client";

import { useActionState } from "react";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import type { ActionState } from "@/lib/actions/types";
import type { CricketPlayer, Media } from "@/lib/generated/prisma/client";

type PlayerWithPhoto = CricketPlayer & { photoMedia: Media | null };

export function PlayerForm({
  player,
  action,
}: {
  player?: PlayerWithPhoto;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="text-sm text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={player?.name}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="role" className="text-sm text-muted">
          Role
        </label>
        <input
          id="role"
          name="role"
          defaultValue={player?.role ?? ""}
          placeholder="e.g. Batsman, Bowler, Captain"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="bio" className="text-sm text-muted">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={player?.bio ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <MediaUploadField
        name="photoMediaId"
        label="Photo"
        defaultMedia={player?.photoMedia}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={player?.published}
          className="h-4 w-4 rounded border-white/10 bg-white/[0.03]"
        />
        Published
      </label>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-cyan">Saved.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
