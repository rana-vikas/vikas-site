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
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Grain } from "@/components/effects/Grain";
import { pageMetadata } from "@/lib/seo/metadata";

const HOME_TITLE = "Vikas Rana — Engineer, Creator, Cricketer & Fitness Enthusiast";

export const metadata = {
  ...pageMetadata({
    title: HOME_TITLE,
    description:
      "Career, fitness, cricket, photography, and travel — the different worlds of one person.",
    path: "/",
  }),
  // Bypass the root layout's `%s | Vikas Rana` template — this title is
  // already fully branded, so applying the template would stutter into
  // "...Fitness Enthusiast | Vikas Rana".
  title: { absolute: HOME_TITLE },
};

export default async function Home() {
  const [latestTrip, featuredPhotos] = await Promise.all([
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
      <ScrollProgress />
      <Grain />
      <Hero />
      <WorldsGrid />
      <LatestTravelSection trip={latestTrip} />
      <PhotographyTeaser photos={featuredPhotos} />
      <RecruiterPanel />
    </>
  );
}
