import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const albumSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  published: z.boolean(),
});

export const photoSchema = z.object({
  albumId: z.string().min(1),
  mediaId: z.string().min(1),
  caption: z.string().optional(),
  featured: z.boolean(),
  camera: z.string().optional(),
  lens: z.string().optional(),
  aperture: z.string().optional(),
  shutterSpeed: z.string().optional(),
  iso: z.string().optional(),
  focalLength: z.string().optional(),
});

export const equipmentSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  description: z.string().optional(),
});
