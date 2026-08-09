import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const tripSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  location: z.string().min(1),
  summary: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  coverMediaId: z.string().optional(),
  published: z.boolean(),
});

export const locationSchema = z.object({
  tripId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const memorySchema = z.object({
  tripId: z.string().min(1),
  title: z.string().min(1),
  caption: z.string().optional(),
  mediaId: z.string().optional(),
});
