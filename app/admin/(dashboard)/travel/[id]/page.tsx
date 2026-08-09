import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  addLocation,
  addMemory,
  deleteLocation,
  deleteMemory,
  deleteTrip,
  markTripLatest,
  updateTrip,
} from "@/lib/actions/travel";
import { TripForm } from "@/components/admin/TripForm";
import { MediaUploadField } from "@/components/admin/MediaUploadField";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditTripPage(
  props: PageProps<"/admin/travel/[id]">,
) {
  const { id } = await props.params;

  const trip = await db.travelTrip.findUnique({
    where: { id },
    include: {
      coverMedia: true,
      locations: { orderBy: { order: "asc" } },
      memories: { orderBy: { order: "asc" }, include: { media: true } },
    },
  });

  if (!trip) {
    notFound();
  }

  const boundUpdate = updateTrip.bind(null, trip.id);
  const boundDelete = deleteTrip.bind(null, trip.id);
  const boundMarkLatest = markTripLatest.bind(null, trip.id);

  return (
    <div className="space-y-16">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Edit Trip
          </h1>
          <div className="flex items-center gap-3">
            {!trip.latest && (
              <form action={boundMarkLatest}>
                <button
                  type="submit"
                  className="rounded-full border border-cyan/30 px-4 py-2 text-sm text-cyan hover:bg-cyan/10"
                >
                  Mark as latest
                </button>
              </form>
            )}
            <DeleteButton action={boundDelete} confirmMessage="Delete this trip?" />
          </div>
        </div>
        <div className="mt-8">
          <TripForm trip={trip} action={boundUpdate} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Itinerary</h2>
        <div className="mt-4 space-y-2">
          {trip.locations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div>
                <p className="text-sm text-foreground">{location.name}</p>
                {location.description && (
                  <p className="text-xs text-muted">{location.description}</p>
                )}
              </div>
              <DeleteButton
                action={deleteLocation.bind(null, location.id)}
                confirmMessage="Remove this stop?"
              />
            </div>
          ))}
          {trip.locations.length === 0 && (
            <p className="text-sm text-muted">No stops yet.</p>
          )}
        </div>
        <form
          action={addLocation}
          className="mt-4 max-w-md space-y-2 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <input type="hidden" name="tripId" value={trip.id} />
          <input
            name="name"
            placeholder="Stop name"
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <div className="flex gap-2">
            <input
              name="latitude"
              placeholder="Latitude (optional)"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
            <input
              name="longitude"
              placeholder="Longitude (optional)"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add stop
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground">Memories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {trip.memories.map((memory) => (
            <div
              key={memory.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <p className="text-xs text-foreground">{memory.title}</p>
              <div className="mt-2">
                <DeleteButton
                  action={deleteMemory.bind(null, memory.id)}
                  confirmMessage="Remove this memory?"
                />
              </div>
            </div>
          ))}
          {trip.memories.length === 0 && (
            <p className="text-sm text-muted">No memories yet.</p>
          )}
        </div>
        <form
          action={addMemory}
          className="mt-4 max-w-md space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4"
        >
          <input type="hidden" name="tripId" value={trip.id} />
          <input
            name="title"
            placeholder="Memory title"
            required
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <input
            name="caption"
            placeholder="Caption (optional)"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-cyan/40"
          />
          <MediaUploadField name="mediaId" label="Photo" />
          <button
            type="submit"
            className="rounded-full bg-white/[0.06] px-4 py-2 text-xs text-foreground hover:bg-white/[0.1]"
          >
            Add memory
          </button>
        </form>
      </div>
    </div>
  );
}
