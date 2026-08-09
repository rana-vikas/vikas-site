"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/types";
import type { PhotoAlbum } from "@/lib/generated/prisma/client";

export function AlbumForm({
  album,
  action,
}: {
  album?: PhotoAlbum;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div>
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={album?.title}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="slug" className="text-sm text-muted">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={album?.slug}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={album?.published}
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
