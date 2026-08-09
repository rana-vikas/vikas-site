import { db } from "@/lib/db";

// Enforces the invariant that at most one TravelTrip has latest = true.
// Called by the Phase 8 admin publish flow whenever a trip is marked latest.
export async function setLatestTrip(tripId: string) {
  await db.$transaction([
    db.travelTrip.updateMany({
      where: { latest: true, NOT: { id: tripId } },
      data: { latest: false },
    }),
    db.travelTrip.update({
      where: { id: tripId },
      data: { latest: true },
    }),
  ]);
}
