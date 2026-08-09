import { db } from "@/lib/db";
import { FadeIn } from "@/components/animations/FadeIn";
import { TripCard } from "@/components/travel/TripCard";
import { pageMetadata } from "@/lib/seo/metadata";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Travel",
  description: "Trip archive — itineraries, galleries, and maps.",
  path: "/travel",
});

export default async function TravelPage() {
  const trips = await db.travelTrip.findMany({
    where: { published: true },
    orderBy: { startDate: "desc" },
    include: { coverMedia: true },
  });

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-32">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Travel
        </h1>
      </FadeIn>
      {trips.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {trips.map((trip, index) => (
            <TripCard key={trip.id} trip={trip} delay={index * 0.08} />
          ))}
        </div>
      ) : (
        <FadeIn delay={0.1}>
          <p className="mt-10 text-sm text-muted">No trips published yet.</p>
        </FadeIn>
      )}
    </section>
  );
}
