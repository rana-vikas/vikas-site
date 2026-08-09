"use client";

import { useActionState } from "react";
import { updateTeam } from "@/lib/actions/cricket";
import type { CricketTeam } from "@/lib/generated/prisma/client";

export function TeamForm({ team }: { team: CricketTeam | null }) {
  const [state, formAction, pending] = useActionState(updateTeam, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="text-sm text-muted">
          Team name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={team?.name}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="foundedYear" className="text-sm text-muted">
          Founded year
        </label>
        <input
          id="foundedYear"
          name="foundedYear"
          defaultValue={team?.foundedYear}
          required
          pattern="\d{4}"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="tagline" className="text-sm text-muted">
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          defaultValue={team?.tagline ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="story" className="text-sm text-muted">
          Story
        </label>
        <textarea
          id="story"
          name="story"
          rows={5}
          defaultValue={team?.story ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
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
