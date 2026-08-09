"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  matchSchema,
  memorySchema,
  playerSchema,
  teamSchema,
  tournamentSchema,
} from "@/lib/validations/cricket";
import type { ActionState } from "@/lib/actions/types";

function revalidateCricket() {
  revalidatePath("/");
  revalidatePath("/cricket");
}

// --- Team (singleton) ---

export async function updateTeam(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = teamSchema.safeParse({
    name: formData.get("name"),
    foundedYear: formData.get("foundedYear"),
    tagline: formData.get("tagline") || undefined,
    story: formData.get("story") || undefined,
  });
  if (!parsed.success) return { error: "Please check the required fields." };

  const existing = await db.cricketTeam.findFirst();
  const data = {
    name: parsed.data.name,
    foundedYear: Number(parsed.data.foundedYear),
    tagline: parsed.data.tagline || null,
    story: parsed.data.story || null,
  };

  if (existing) {
    await db.cricketTeam.update({ where: { id: existing.id }, data });
  } else {
    await db.cricketTeam.create({ data });
  }

  revalidateCricket();
  return { success: true };
}

// --- Player ---

function parsePlayerForm(formData: FormData) {
  return playerSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role") || undefined,
    bio: formData.get("bio") || undefined,
    photoMediaId: formData.get("photoMediaId") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createPlayer(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parsePlayerForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const count = await db.cricketPlayer.count();
  const player = await db.cricketPlayer.create({
    data: {
      name: parsed.data.name,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      photoMediaId: parsed.data.photoMediaId || null,
      published: parsed.data.published,
      order: count,
    },
  });

  revalidateCricket();
  redirect(`/admin/cricket/players/${player.id}`);
}

export async function updatePlayer(
  playerId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parsePlayerForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  await db.cricketPlayer.update({
    where: { id: playerId },
    data: {
      name: parsed.data.name,
      role: parsed.data.role || null,
      bio: parsed.data.bio || null,
      photoMediaId: parsed.data.photoMediaId || null,
      published: parsed.data.published,
    },
  });

  revalidateCricket();
  return { success: true };
}

export async function deletePlayer(playerId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.cricketPlayer.delete({ where: { id: playerId } });
  revalidateCricket();
  redirect("/admin/cricket");
}

// --- Tournament ---

export async function createTournament(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = tournamentSchema.safeParse({
    name: formData.get("name"),
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
    result: formData.get("result") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.tournament.count();
  await db.tournament.create({
    data: {
      name: parsed.data.name,
      location: parsed.data.location || null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      result: parsed.data.result || null,
      order: count,
    },
  });

  revalidateCricket();
}

export async function deleteTournament(tournamentId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.tournament.delete({ where: { id: tournamentId } });
  revalidateCricket();
}

// --- Match ---

function parseMatchForm(formData: FormData) {
  return matchSchema.safeParse({
    opponent: formData.get("opponent"),
    matchDate: formData.get("matchDate"),
    result: formData.get("result") || undefined,
    summary: formData.get("summary") || undefined,
    tournamentId: formData.get("tournamentId") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createMatch(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseMatchForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const match = await db.cricketMatch.create({
    data: {
      opponent: parsed.data.opponent,
      matchDate: new Date(parsed.data.matchDate),
      result: parsed.data.result || null,
      summary: parsed.data.summary || null,
      tournamentId: parsed.data.tournamentId || null,
      published: parsed.data.published,
    },
  });

  revalidateCricket();
  redirect(`/admin/cricket/matches/${match.id}`);
}

export async function updateMatch(
  matchId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseMatchForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  await db.cricketMatch.update({
    where: { id: matchId },
    data: {
      opponent: parsed.data.opponent,
      matchDate: new Date(parsed.data.matchDate),
      result: parsed.data.result || null,
      summary: parsed.data.summary || null,
      tournamentId: parsed.data.tournamentId || null,
      published: parsed.data.published,
    },
  });

  revalidateCricket();
  return { success: true };
}

export async function deleteMatch(matchId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.cricketMatch.delete({ where: { id: matchId } });
  revalidateCricket();
  redirect("/admin/cricket");
}

// --- Memory ---

export async function addMemory(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = memorySchema.safeParse({
    title: formData.get("title"),
    caption: formData.get("caption") || undefined,
    mediaId: formData.get("mediaId") || undefined,
    date: formData.get("date") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.cricketMemory.count();
  await db.cricketMemory.create({
    data: {
      title: parsed.data.title,
      caption: parsed.data.caption || null,
      mediaId: parsed.data.mediaId || null,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      order: count,
    },
  });

  revalidateCricket();
}

export async function deleteMemory(memoryId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.cricketMemory.delete({ where: { id: memoryId } });
  revalidateCricket();
}
