import Image from "next/image";
import type { FitnessEntry, Media } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";

type EntryWithMedia = FitnessEntry & { media: Media | null };

export function EntryList({ entries }: { entries: EntryWithMedia[] }) {
  if (entries.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">
          No entries logged yet for this challenge.
        </p>
      </FadeIn>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {entries.map((entry, index) => (
        <FadeIn
          key={entry.id}
          delay={(index % 10) * 0.03}
          className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
        >
          {entry.media && (
            <div className="relative aspect-video">
              <Image
                src={publicUrl(entry.media.key)}
                alt={entry.media.alt ?? `Day ${entry.dayNumber}`}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <p className="text-xs uppercase tracking-widest text-muted">
              Day {entry.dayNumber}
            </p>
            {entry.title && (
              <h3 className="mt-1 text-sm font-medium text-foreground">
                {entry.title}
              </h3>
            )}
            {entry.notes && (
              <p className="mt-1 text-sm text-muted">{entry.notes}</p>
            )}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
