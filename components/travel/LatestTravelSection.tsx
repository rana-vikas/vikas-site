import Image from "next/image";
import Link from "next/link";
import type { Media, TravelTrip } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { RevealImage } from "@/components/travel/RevealImage";

type LatestTrip = TravelTrip & { coverMedia: Media | null };

export function LatestTravelSection({ trip }: { trip: LatestTrip | null }) {
  return (
    <section className="mx-auto max-w-[1200px] px-[18px] py-24 sm:px-8 lg:px-12 lg:py-32">
      <FadeIn>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-secondary">
          Latest Journey
        </p>
      </FadeIn>

      {trip ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[58%_1fr] lg:items-center lg:gap-12">
          <RevealImage>
            {trip.coverMedia && (
              <Link
                href={`/travel/${trip.slug}`}
                className="relative block aspect-[4/3] overflow-hidden rounded-[28px] border border-border bg-panel lg:aspect-[16/11]"
              >
                <Image
                  src={publicUrl(trip.coverMedia.key)}
                  alt={trip.coverMedia.alt ?? trip.title}
                  fill
                  unoptimized
                  loading="lazy"
                  className="object-cover"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
              </Link>
            )}
          </RevealImage>

          <FadeIn delay={0.15}>
            <h2 className="font-semibold leading-[0.95] tracking-[-0.045em] text-foreground text-[clamp(32px,4vw,52px)]">
              {trip.title}
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.1em] text-muted">
              {trip.location} · {trip.startDate.getFullYear()}
            </p>
            {trip.summary && (
              <p className="mt-6 max-w-[560px] text-base leading-relaxed text-foreground-secondary">
                {trip.summary}
              </p>
            )}
            <Link
              href="/travel"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan transition-colors hover:text-foreground"
            >
              Explore all travel stories →
            </Link>
          </FadeIn>
        </div>
      ) : (
        <FadeIn delay={0.1}>
          <p className="mt-8 text-sm text-muted">No trips published yet.</p>
        </FadeIn>
      )}
    </section>
  );
}
