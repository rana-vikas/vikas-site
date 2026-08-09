import Image from "next/image";
import Link from "next/link";
import type { Media, TravelTrip } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";

type LatestTrip = TravelTrip & { coverMedia: Media | null };

export function LatestTravelSection({ trip }: { trip: LatestTrip | null }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-sm uppercase tracking-widest text-muted">
          Latest Travel
        </h2>
      </FadeIn>
      {trip ? (
        <FadeIn delay={0.1}>
          <Link
            href={`/travel/${trip.slug}`}
            className="group mt-8 grid gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-2"
          >
            {trip.coverMedia && (
              <div className="relative aspect-video sm:aspect-auto">
                <Image
                  src={publicUrl(trip.coverMedia.key)}
                  alt={trip.coverMedia.alt ?? trip.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(min-width: 640px) 50vw, 100vw"
                />
              </div>
            )}
            <div className="flex flex-col justify-center p-6">
              <h3 className="text-2xl font-medium text-foreground">
                {trip.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{trip.location}</p>
              {trip.summary && (
                <p className="mt-4 text-sm text-muted">{trip.summary}</p>
              )}
            </div>
          </Link>
        </FadeIn>
      ) : (
        <FadeIn delay={0.1}>
          <p className="mt-8 text-sm text-muted">No trips published yet.</p>
        </FadeIn>
      )}
    </section>
  );
}
