import { db } from "@/lib/db";

// Renders at request time — content is Prisma-backed and will change via the
// Phase 8 admin, so a database connection isn't available (or meaningful) to
// statically prerender this page at build time.
export const dynamic = "force-dynamic";
import { Hero } from "@/components/hero/Hero";
import { WorldsGrid } from "@/components/cards/WorldsGrid";
import { LatestTravelSection } from "@/components/travel/LatestTravelSection";
import { PhotographyTeaser } from "@/components/photography/PhotographyTeaser";
import { RecruiterPanel } from "@/components/career/RecruiterPanel";

export default async function Home() {
  const [profile, latestTrip, featuredPhotos] = await Promise.all([
    db.profile.findFirst(),
    db.travelTrip.findFirst({
      where: { latest: true, published: true },
      include: { coverMedia: true },
    }),
    db.photo.findMany({
      where: { featured: true, published: true },
      orderBy: { order: "asc" },
      take: 4,
      include: { media: true },
    }),
  ]);

  return (
    <>
      <Hero
        headline={profile?.headline ?? "Vikas Rana"}
        tagline={profile?.tagline ?? "Different Worlds. One Person."}
      />
      <WorldsGrid />
      <LatestTravelSection trip={latestTrip} />
      <PhotographyTeaser photos={featuredPhotos} />
      <RecruiterPanel />
    </>
  );
}
