import Image from "next/image";
import Link from "next/link";
import type { Media, Photo } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { PhotoTile } from "@/components/photography/PhotoTile";

type FeaturedPhoto = Photo & { media: Media };

// Asymmetric spans so the first photo reads as a lead image rather than a
// uniform grid — cycles if there are more than 4 photos.
const SPAN_PATTERN = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1 sm:row-span-1",
  "sm:col-span-1 sm:row-span-1",
  "sm:col-span-2 sm:row-span-1",
];

export function PhotographyTeaser({ photos }: { photos: FeaturedPhoto[] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-[18px] py-24 sm:px-8 lg:px-12 lg:py-32">
      <FadeIn>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-semibold leading-[0.95] tracking-[-0.045em] text-foreground text-[clamp(32px,5vw,60px)]">
            See the world
            <br />
            through my lens.
          </h2>
          <Link
            href="/photography"
            className="hidden shrink-0 text-sm font-medium text-cyan transition-colors hover:text-foreground sm:block"
          >
            View all →
          </Link>
        </div>
      </FadeIn>

      {photos.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-4 lg:auto-rows-[220px] lg:gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative aspect-square overflow-hidden rounded-2xl border border-border bg-panel sm:aspect-auto ${SPAN_PATTERN[index % SPAN_PATTERN.length]}`}
            >
              <PhotoTile delay={index * 0.08}>
                <Link href="/photography" className="group relative block h-full w-full">
                  <Image
                    src={publicUrl(photo.media.key)}
                    alt={photo.media.alt ?? photo.caption ?? "Photo"}
                    fill
                    loading="lazy"
                    unoptimized
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                  {(photo.caption || photo.media.alt) && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                          {photo.caption ?? photo.media.alt}
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              </PhotoTile>
            </div>
          ))}
        </div>
      ) : (
        <FadeIn delay={0.1}>
          <p className="mt-8 text-sm text-muted">No photos published yet.</p>
        </FadeIn>
      )}

      <Link
        href="/photography"
        className="mt-8 block text-sm font-medium text-cyan transition-colors hover:text-foreground sm:hidden"
      >
        View all →
      </Link>
    </section>
  );
}
