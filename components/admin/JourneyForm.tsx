"use client";

import { useActionState } from "react";
import { updateJourney } from "@/lib/actions/fitness";
import type { FitnessJourney } from "@/lib/generated/prisma/client";

export function JourneyForm({ journey }: { journey: FitnessJourney | null }) {
  const [state, formAction, pending] = useActionState(updateJourney, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="startYear" className="text-sm text-muted">
          Start year
        </label>
        <input
          id="startYear"
          name="startYear"
          defaultValue={journey?.startYear}
          required
          pattern="\d{4}"
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
          defaultValue={journey?.story ?? ""}
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
