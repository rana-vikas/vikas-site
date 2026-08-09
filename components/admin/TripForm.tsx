"use client";

import { useActionState } from "react";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { ActionState } from "@/lib/actions/types";
import type { Media, TravelTrip } from "@/lib/generated/prisma/client";

type TripWithCover = TravelTrip & { coverMedia: Media | null };

function toDateInputValue(date: Date | null | undefined) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function TripForm({
  trip,
  action,
}: {
  trip?: TripWithCover;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={trip?.title}
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
          defaultValue={trip?.slug}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
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
          defaultValue={trip?.location}
          required
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
            defaultValue={toDateInputValue(trip?.startDate)}
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
            defaultValue={toDateInputValue(trip?.endDate)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
        </div>
      </div>
      <div>
        <label className="text-sm text-muted">Summary</label>
        <div className="mt-1">
          <RichTextEditor name="summary" defaultValue={trip?.summary ?? ""} />
        </div>
      </div>
      <MediaUploadField
        name="coverMediaId"
        label="Cover image"
        defaultMedia={trip?.coverMedia}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={trip?.published}
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
