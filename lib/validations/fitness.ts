import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const journeySchema = z.object({
  startYear: z.string().regex(/^\d{4}$/, "Enter a 4-digit year"),
  story: z.string().optional(),
});

export const challengeSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  lengthDays: z.string().regex(/^\d+$/, "Enter a whole number"),
  summary: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  published: z.boolean(),
});

export const entrySchema = z.object({
  challengeId: z.string().min(1),
  dayNumber: z.string().regex(/^\d+$/, "Enter a whole number"),
  date: z.string().optional(),
  title: z.string().optional(),
  notes: z.string().optional(),
  mediaId: z.string().optional(),
});

export const competitionSchema = z.object({
  name: z.string().min(1),
  result: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
});
