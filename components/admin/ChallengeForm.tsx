"use client";

import { useActionState, useRef, useState } from "react";
import type { ActionState } from "@/lib/actions/types";
import type { FitnessChallenge } from "@/lib/generated/prisma/client";
import { slugify } from "@/lib/utils/slug";

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function ChallengeForm({
  challenge,
  action,
}: {
  challenge?: FitnessChallenge;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [slug, setSlug] = useState(challenge?.slug ?? "");
  const slugTouched = useRef(Boolean(challenge?.slug));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={challenge?.title}
          required
          onChange={(event) => {
            if (!slugTouched.current) setSlug(slugify(event.target.value));
          }}
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
          value={slug}
          onChange={(event) => {
            slugTouched.current = true;
            setSlug(event.target.value);
          }}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="lengthDays" className="text-sm text-muted">
          Length (days)
        </label>
        <input
          id="lengthDays"
          name="lengthDays"
          defaultValue={challenge?.lengthDays}
          required
          pattern="\d+"
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="summary" className="text-sm text-muted">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={3}
          defaultValue={challenge?.summary ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="text-sm text-muted">
            Start date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={toDateInputValue(challenge?.startDate)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="text-sm text-muted">
            End date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={toDateInputValue(challenge?.endDate)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={challenge?.published}
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
