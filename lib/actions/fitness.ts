"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  challengeSchema,
  competitionSchema,
  entrySchema,
  journeySchema,
} from "@/lib/validations/fitness";
import type { ActionState } from "@/lib/actions/types";

function revalidateFitness(slug?: string) {
  revalidatePath("/");
  revalidatePath("/fitness");
  revalidatePath("/fitness/challenges");
  if (slug) revalidatePath(`/fitness/challenges/${slug}`);
}

// --- Journey (singleton) ---

export async function updateJourney(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = journeySchema.safeParse({
    startYear: formData.get("startYear"),
    story: formData.get("story") || undefined,
  });
  if (!parsed.success) return { error: "Please check the required fields." };

  const existing = await db.fitnessJourney.findFirst();
  const data = {
    startYear: Number(parsed.data.startYear),
    story: parsed.data.story || null,
  };

  if (existing) {
    await db.fitnessJourney.update({ where: { id: existing.id }, data });
  } else {
    await db.fitnessJourney.create({ data });
  }

  revalidateFitness();
  return { success: true };
}

// --- Challenge ---

function parseChallengeForm(formData: FormData) {
  return challengeSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    lengthDays: formData.get("lengthDays"),
    summary: formData.get("summary") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createChallenge(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseChallengeForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const challenge = await db.fitnessChallenge.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      lengthDays: Number(parsed.data.lengthDays),
      summary: parsed.data.summary || null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      published: parsed.data.published,
    },
  });

  revalidateFitness(challenge.slug);
  redirect(`/admin/fitness/challenges/${challenge.id}`);
}

export async function updateChallenge(
  challengeId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseChallengeForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const challenge = await db.fitnessChallenge.update({
    where: { id: challengeId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      lengthDays: Number(parsed.data.lengthDays),
      summary: parsed.data.summary || null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      published: parsed.data.published,
    },
  });

  revalidateFitness(challenge.slug);
  return { success: true };
}

export async function deleteChallenge(challengeId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  const challenge = await db.fitnessChallenge.delete({ where: { id: challengeId } });
  revalidateFitness(challenge.slug);
  redirect("/admin/fitness");
}

// --- Entry ---

export async function addEntry(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = entrySchema.safeParse({
    challengeId: formData.get("challengeId"),
    dayNumber: formData.get("dayNumber"),
    date: formData.get("date") || undefined,
    title: formData.get("title") || undefined,
    notes: formData.get("notes") || undefined,
    mediaId: formData.get("mediaId") || undefined,
  });
  if (!parsed.success) return;

  const challengeRecord = await db.fitnessChallenge.findUnique({
    where: { id: parsed.data.challengeId },
  });
  if (!challengeRecord) return;

  await db.fitnessEntry.create({
    data: {
      challengeId: parsed.data.challengeId,
      dayNumber: Number(parsed.data.dayNumber),
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      title: parsed.data.title || null,
      notes: parsed.data.notes || null,
      mediaId: parsed.data.mediaId || null,
    },
  });

  revalidateFitness(challengeRecord.slug);
}

export async function deleteEntry(entryId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  const entry = await db.fitnessEntry.delete({
    where: { id: entryId },
    include: { challenge: true },
  });
  revalidateFitness(entry.challenge.slug);
}

// --- Competition ---

export async function createCompetition(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = competitionSchema.safeParse({
    name: formData.get("name"),
    result: formData.get("result") || undefined,
    location: formData.get("location") || undefined,
    date: formData.get("date") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.competition.count();
  await db.competition.create({
    data: {
      name: parsed.data.name,
      result: parsed.data.result || null,
      location: parsed.data.location || null,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      order: count,
    },
  });

  revalidateFitness();
}

export async function deleteCompetition(competitionId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.competition.delete({ where: { id: competitionId } });
  revalidateFitness();
}
