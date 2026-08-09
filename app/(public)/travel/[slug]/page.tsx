import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { Itinerary } from "@/components/travel/Itinerary";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";
import { pageMetadata, stripHtml } from "@/lib/seo/metadata";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

const getTrip = cache((slug: string) =>
  db.travelTrip.findUnique({
    where: { slug, published: true },
    include: {
      coverMedia: true,
      locations: { orderBy: { order: "asc" } },
      memories: {
        where: { published: true },
        orderBy: { order: "asc" },
        include: { media: true },
      },
    },
  }),
);

export async function generateMetadata(props: PageProps<"/travel/[slug]">) {
  const { slug } = await props.params;
  const trip = await getTrip(slug);
  if (!trip) return {};

  return pageMetadata({
    title: trip.title,
    description: trip.summary ? stripHtml(trip.summary) : `${trip.location} — travel trip`,
    path: `/travel/${trip.slug}`,
    image: trip.coverMedia ? publicUrl(trip.coverMedia.key) : undefined,
  });
}

export default async function TripPage(
  props: PageProps<"/travel/[slug]">,
) {
  const { slug } = await props.params;

  const trip = await getTrip(slug);

  if (!trip) {
    notFound();
  }

  const galleryPhotos = trip.memories.filter(
    (memory): memory is typeof memory & { media: NonNullable<typeof memory.media> } =>
      memory.media !== null,
  );

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
        <FadeIn>
          {trip.coverMedia && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src={publicUrl(trip.coverMedia.key)}
                alt={trip.coverMedia.alt ?? trip.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {trip.title}
          </h1>
          <p className="mt-2 text-muted">{trip.location}</p>
          {trip.summary && (
            // Admin-authored (Tiptap) HTML — trusted content, not user input.
            <div
              className="mt-6 max-w-2xl text-lg text-muted [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-foreground"
              dangerouslySetInnerHTML={{ __html: trip.summary }}
            />
          )}
        </FadeIn>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Itinerary
          </h2>
        </FadeIn>
        <div className="mt-8">
          <Itinerary locations={trip.locations} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Gallery
          </h2>
        </FadeIn>
        <div className="mt-8">
          <PhotoGallery photos={galleryPhotos} />
        </div>
      </section>
    </>
  );
}
