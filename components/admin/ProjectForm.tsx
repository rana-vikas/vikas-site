"use client";

import { useActionState, useRef, useState } from "react";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import type { ActionState } from "@/lib/actions/types";
import type { Media, Project } from "@/lib/generated/prisma/client";
import { slugify } from "@/lib/utils/slug";

type ProjectWithCover = Project & { coverMedia: Media | null };

export function ProjectForm({
  project,
  action,
}: {
  project?: ProjectWithCover;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [slug, setSlug] = useState(project?.slug ?? "");
  const slugTouched = useRef(Boolean(project?.slug));

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="title" className="text-sm text-muted">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={project?.title}
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
        <label htmlFor="summary" className="text-sm text-muted">
          Summary
        </label>
        <input
          id="summary"
          name="summary"
          defaultValue={project?.summary}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="description" className="text-sm text-muted">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="url" className="text-sm text-muted">
            Live URL
          </label>
          <input
            id="url"
            name="url"
            defaultValue={project?.url ?? ""}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="repoUrl" className="text-sm text-muted">
            Repo URL
          </label>
          <input
            id="repoUrl"
            name="repoUrl"
            defaultValue={project?.repoUrl ?? ""}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
        </div>
      </div>
      <MediaUploadField
        name="coverMediaId"
        label="Cover image"
        defaultMedia={project?.coverMedia}
      />
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured}
          className="h-4 w-4 rounded border-white/10 bg-white/[0.03]"
        />
        Featured
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published}
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
