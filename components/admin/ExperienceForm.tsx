"use client";

import { useActionState } from "react";
import type { ActionState } from "@/lib/actions/types";
import type { Experience } from "@/lib/generated/prisma/client";

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function ExperienceForm({
  experience,
  action,
}: {
  experience?: Experience;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="company" className="text-sm text-muted">
          Company
        </label>
        <input
          id="company"
          name="company"
          defaultValue={experience?.company}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={experience?.title}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="location" className="text-sm text-muted">
          Location
        </label>
        <input
          id="location"
          name="location"
          defaultValue={experience?.location ?? ""}
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
            defaultValue={toDateInputValue(experience?.startDate)}
            required
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
            defaultValue={toDateInputValue(experience?.endDate)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="text-sm text-muted">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={experience?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="current"
          defaultChecked={experience?.current}
          className="h-4 w-4 rounded border-white/10 bg-white/[0.03]"
        />
        Current role
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={experience?.published}
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
