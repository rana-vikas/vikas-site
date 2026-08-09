import type { TravelLocation } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";

// No mapping API key is configured (self-hosted, no new external
// dependency) — OpenStreetMap's embed iframe needs none.
function LocationMap({
  latitude,
  longitude,
  name,
}: {
  latitude: number;
  longitude: number;
  name: string;
}) {
  const delta = 0.05;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${latitude},${longitude}&layer=mapnik`;

  return (
    <iframe
      title={`Map of ${name}`}
      src={src}
      loading="lazy"
      className="h-48 w-full rounded-xl border border-white/10"
    />
  );
}

export function Itinerary({ locations }: { locations: TravelLocation[] }) {
  if (locations.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Itinerary coming soon.</p>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-8">
      {locations.map((location, index) => (
        <FadeIn key={location.id} delay={index * 0.06}>
          <h3 className="text-lg font-medium text-foreground">
            {location.name}
          </h3>
          {location.description && (
            <p className="mt-1 text-sm text-muted">{location.description}</p>
          )}
          {location.latitude != null && location.longitude != null && (
            <div className="mt-3">
              <LocationMap
                latitude={location.latitude}
                longitude={location.longitude}
                name={location.name}
              />
            </div>
          )}
        </FadeIn>
      ))}
    </div>
  );
}
