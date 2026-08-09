import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";

// Renders at request time — see app/(public)/page.tsx for why.
export const dynamic = "force-dynamic";

const staticRoutes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "monthly", priority: 1 },
  { path: "/career", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fitness", changeFrequency: "monthly", priority: 0.8 },
  { path: "/fitness/challenges", changeFrequency: "monthly", priority: 0.6 },
  { path: "/cricket", changeFrequency: "monthly", priority: 0.7 },
  { path: "/photography", changeFrequency: "monthly", priority: 0.7 },
  { path: "/travel", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [trips, challenges] = await Promise.all([
    db.travelTrip.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    db.fitnessChallenge.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const tripEntries: MetadataRoute.Sitemap = trips.map((trip) => ({
    url: `${siteConfig.url}/travel/${trip.slug}`,
    lastModified: trip.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const challengeEntries: MetadataRoute.Sitemap = challenges.map((challenge) => ({
    url: `${siteConfig.url}/fitness/challenges/${challenge.slug}`,
    lastModified: challenge.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticEntries, ...tripEntries, ...challengeEntries];
}
