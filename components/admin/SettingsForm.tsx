"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/settings";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import type { Media, Profile } from "@/lib/generated/prisma/client";

type ProfileWithResume = Profile & { resumeMedia: Media | null };

export function SettingsForm({ profile }: { profile: ProfileWithResume | null }) {
  const [state, formAction, pending] = useActionState(updateProfile, {});

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-4">
      <div>
        <label htmlFor="name" className="text-sm text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={profile?.name}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="headline" className="text-sm text-muted">
          Hero headline
        </label>
        <input
          id="headline"
          name="headline"
          defaultValue={profile?.headline}
          required
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
          defaultValue={profile?.tagline}
          required
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <div>
        <label htmlFor="summary" className="text-sm text-muted">
          Professional summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={5}
          defaultValue={profile?.summary ?? ""}
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
        />
      </div>
      <MediaUploadField
        name="resumeMediaId"
        label="Resume (PDF)"
        accept="application/pdf"
        defaultMedia={profile?.resumeMedia}
      />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-cyan">Saved.</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
