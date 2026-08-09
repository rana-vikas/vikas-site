import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/FadeIn";
import { EquipmentList } from "@/components/photography/EquipmentList";
import { PhotoGallery } from "@/components/gallery/PhotoGallery";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export default async function PhotographyPage() {
  const [equipment, albums] = await Promise.all([
    db.equipment.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    db.photoAlbum.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: {
        photos: {
          where: { published: true },
          orderBy: { order: "asc" },
          include: { media: true },
        },
      },
    }),
  ]);

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
        <FadeIn>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Photography
          </h1>
        </FadeIn>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <FadeIn>
          <h2 className="text-sm uppercase tracking-widest text-muted">
            Equipment
          </h2>
        </FadeIn>
        <div className="mt-8">
          <EquipmentList equipment={equipment} />
        </div>
      </section>

      {albums.length > 0 ? (
        albums.map((album) => (
          <section key={album.id} className="mx-auto max-w-5xl px-6 py-16">
            <FadeIn>
              <h2 className="text-sm uppercase tracking-widest text-muted">
                {album.title}
              </h2>
            </FadeIn>
            <div className="mt-8">
              <PhotoGallery photos={album.photos} />
            </div>
          </section>
        ))
      ) : (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <FadeIn>
            <p className="text-sm text-muted">No albums published yet.</p>
          </FadeIn>
        </section>
      )}
    </>
  );
}
