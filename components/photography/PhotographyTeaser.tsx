import Image from "next/image";
import Link from "next/link";
import type { Media, Photo } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

type FeaturedPhoto = Photo & { media: Media };

export function PhotographyTeaser({ photos }: { photos: FeaturedPhoto[] }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Photography
          </h2>
          <Link
            href="/photography"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>
      </FadeIn>
      {photos.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {photos.map((photo, index) => (
            <FadeIn key={photo.id} delay={index * 0.08}>
              <HoverLift>
                <Link
                  href="/photography"
                  className="relative block aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={publicUrl(photo.media.key)}
                    alt={photo.media.alt ?? photo.caption ?? "Photo"}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(min-width: 640px) 25vw, 50vw"
                  />
                </Link>
              </HoverLift>
            </FadeIn>
          ))}
        </div>
      ) : (
        <FadeIn delay={0.1}>
          <p className="mt-8 text-sm text-muted">No photos published yet.</p>
        </FadeIn>
      )}
    </section>
  );
}
