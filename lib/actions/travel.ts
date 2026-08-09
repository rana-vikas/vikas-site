"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { setLatestTrip } from "@/lib/travel/setLatestTrip";
import { locationSchema, memorySchema, tripSchema } from "@/lib/validations/travel";
import type { ActionState } from "@/lib/actions/types";

function revalidateTravel(slug?: string) {
  revalidatePath("/");
  revalidatePath("/travel");
  if (slug) revalidatePath(`/travel/${slug}`);
}

function parseTripForm(formData: FormData) {
  return tripSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    location: formData.get("location"),
    summary: formData.get("summary") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    coverMediaId: formData.get("coverMediaId") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createTrip(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    return { error: "Please check the required fields." };
  }

  const trip = await db.travelTrip.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      location: parsed.data.location,
      summary: parsed.data.summary || null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      coverMediaId: parsed.data.coverMediaId || null,
      published: parsed.data.published,
    },
  });

  revalidateTravel(trip.slug);
  redirect(`/admin/travel/${trip.id}`);
}

export async function updateTrip(
  tripId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseTripForm(formData);
  if (!parsed.success) {
    return { error: "Please check the required fields." };
  }

  const trip = await db.travelTrip.update({
    where: { id: tripId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      location: parsed.data.location,
      summary: parsed.data.summary || null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      coverMediaId: parsed.data.coverMediaId || null,
      published: parsed.data.published,
    },
  });

  revalidateTravel(trip.slug);
  return { success: true };
}

export async function deleteTrip(tripId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  const trip = await db.travelTrip.delete({ where: { id: tripId } });
  revalidateTravel(trip.slug);
  redirect("/admin/travel");
}

export async function markTripLatest(tripId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await setLatestTrip(tripId);
  revalidateTravel();
}

export async function addLocation(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = locationSchema.safeParse({
    tripId: formData.get("tripId"),
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    latitude: formData.get("latitude") || undefined,
    longitude: formData.get("longitude") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.travelLocation.count({
    where: { tripId: parsed.data.tripId },
  });

  const trip = await db.travelLocation.create({
    data: {
      tripId: parsed.data.tripId,
      name: parsed.data.name,
      description: parsed.data.description || null,
      latitude: parsed.data.latitude ? Number(parsed.data.latitude) : null,
      longitude: parsed.data.longitude ? Number(parsed.data.longitude) : null,
      order: count,
    },
    include: { trip: true },
  });

  revalidateTravel(trip.trip.slug);
}

export async function deleteLocation(locationId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  const location = await db.travelLocation.delete({
    where: { id: locationId },
    include: { trip: true },
  });
  revalidateTravel(location.trip.slug);
}

export async function addMemory(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = memorySchema.safeParse({
    tripId: formData.get("tripId"),
    title: formData.get("title"),
    caption: formData.get("caption") || undefined,
    mediaId: formData.get("mediaId") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.travelMemory.count({
    where: { tripId: parsed.data.tripId },
  });

  const memory = await db.travelMemory.create({
    data: {
      tripId: parsed.data.tripId,
      title: parsed.data.title,
      caption: parsed.data.caption || null,
      mediaId: parsed.data.mediaId || null,
      order: count,
    },
    include: { trip: true },
  });

  revalidateTravel(memory.trip.slug);
}

export async function deleteMemory(memoryId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  const memory = await db.travelMemory.delete({
    where: { id: memoryId },
    include: { trip: true },
  });
  revalidateTravel(memory.trip.slug);
}
