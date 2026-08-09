import Image from "next/image";
import Link from "next/link";
import type { Media, TravelTrip } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

type TripWithCover = TravelTrip & { coverMedia: Media | null };

export function TripCard({
  trip,
  delay = 0,
}: {
  trip: TripWithCover;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <HoverLift className="h-full">
        <Link
          href={`/travel/${trip.slug}`}
          className="block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          {trip.coverMedia && (
            <div className="relative aspect-video">
              <Image
                src={publicUrl(trip.coverMedia.key)}
                alt={trip.coverMedia.alt ?? trip.title}
                fill
                unoptimized
                className="object-cover"
              />
              {trip.latest && (
                <span className="absolute left-3 top-3 rounded-full border border-cyan/30 bg-background/80 px-3 py-1 text-xs text-cyan">
                  Latest
                </span>
              )}
            </div>
          )}
          <div className="p-6">
            <h3 className="text-lg font-medium text-foreground">
              {trip.title}
            </h3>
            <p className="mt-1 text-sm text-muted">{trip.location}</p>
          </div>
        </Link>
      </HoverLift>
    </FadeIn>
  );
}
