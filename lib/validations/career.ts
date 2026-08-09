import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const experienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
  published: z.boolean(),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(slugPattern, "Use lowercase letters, numbers, and hyphens only"),
  summary: z.string().min(1),
  description: z.string().optional(),
  url: z.string().optional(),
  repoUrl: z.string().optional(),
  coverMediaId: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
});

export const achievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(),
});

export const certificationSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string().optional(),
  url: z.string().optional(),
});
