import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(1),
  foundedYear: z.string().regex(/^\d{4}$/, "Enter a 4-digit year"),
  tagline: z.string().optional(),
  story: z.string().optional(),
});

export const playerSchema = z.object({
  name: z.string().min(1),
  role: z.string().optional(),
  bio: z.string().optional(),
  photoMediaId: z.string().optional(),
  published: z.boolean(),
});

export const tournamentSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  result: z.string().optional(),
});

export const matchSchema = z.object({
  opponent: z.string().min(1),
  matchDate: z.string().min(1),
  result: z.string().optional(),
  summary: z.string().optional(),
  tournamentId: z.string().optional(),
  published: z.boolean(),
});

export const memorySchema = z.object({
  title: z.string().min(1),
  caption: z.string().optional(),
  mediaId: z.string().optional(),
  date: z.string().optional(),
});
