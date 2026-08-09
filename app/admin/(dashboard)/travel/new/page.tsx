import { createTrip } from "@/lib/actions/travel";
import { TripForm } from "@/components/admin/TripForm";

export default function NewTripPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">New Trip</h1>
      <div className="mt-8">
        <TripForm action={createTrip} />
      </div>
    </div>
  );
}
