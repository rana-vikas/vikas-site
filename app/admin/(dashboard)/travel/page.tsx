import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminTravelListPage() {
  const trips = await db.travelTrip.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Travel</h1>
        <Link
          href="/admin/travel/new"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          New trip
        </Link>
      </div>
      <div className="mt-8 space-y-2">
        {trips.map((trip) => (
          <Link
            key={trip.id}
            href={`/admin/travel/${trip.id}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-cyan/40"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {trip.title}
              </p>
              <p className="text-xs text-muted">{trip.location}</p>
            </div>
            <div className="flex gap-2 text-xs">
              {trip.latest && (
                <span className="rounded-full border border-cyan/30 px-2 py-1 text-cyan">
                  Latest
                </span>
              )}
              <span
                className={`rounded-full border px-2 py-1 ${
                  trip.published
                    ? "border-white/10 text-muted"
                    : "border-white/10 text-muted/60"
                }`}
              >
                {trip.published ? "Published" : "Draft"}
              </span>
            </div>
          </Link>
        ))}
        {trips.length === 0 && (
          <p className="text-sm text-muted">No trips yet.</p>
        )}
      </div>
    </div>
  );
}
