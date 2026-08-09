import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { db } from "../lib/db";
import { storageClient, STORAGE_BUCKET } from "../lib/storage/client";

const PLACEHOLDER_WIDTH = 1600;
const PLACEHOLDER_HEIGHT = 1000;

async function uploadPlaceholderImage(
  key: string,
  color: { r: number; g: number; b: number },
) {
  const buffer = await sharp({
    create: {
      width: PLACEHOLDER_WIDTH,
      height: PLACEHOLDER_HEIGHT,
      channels: 3,
      background: color,
    },
  })
    .jpeg({ quality: 70 })
    .toBuffer();

  await storageClient.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    }),
  );
}

async function seedMedia(key: string, color: { r: number; g: number; b: number }, alt: string) {
  await uploadPlaceholderImage(key, color);
  return db.media.upsert({
    where: { key },
    update: {},
    create: {
      key,
      type: "image",
      width: PLACEHOLDER_WIDTH,
      height: PLACEHOLDER_HEIGHT,
      alt,
    },
  });
}

async function main() {
  const existingProfile = await db.profile.findFirst();
  if (!existingProfile) {
    await db.profile.create({
      data: {
        name: "Vikas Rana",
        headline: "Vikas Rana",
        tagline: "Different Worlds. One Person.",
        summary: "Placeholder profile summary — replace via the Phase 8 admin.",
      },
    });
  }

  const travelCover = await seedMedia(
    "seed/travel-cover.jpg",
    { r: 105, g: 221, b: 255 },
    "Seed placeholder — latest travel cover",
  );

  await db.travelTrip.upsert({
    where: { slug: "sample-trip" },
    update: {},
    create: {
      slug: "sample-trip",
      title: "Sample Trip (seed placeholder)",
      location: "Somewhere",
      summary: "Placeholder trip — replace via the Phase 8 admin.",
      startDate: new Date(),
      published: true,
      latest: true,
      coverMediaId: travelCover.id,
    },
  });

  const album = await db.photoAlbum.upsert({
    where: { slug: "featured" },
    update: {},
    create: { slug: "featured", title: "Featured", published: true },
  });

  const photoColors = [
    { r: 7, g: 9, b: 13 },
    { r: 155, g: 131, b: 255 },
    { r: 153, g: 164, b: 181 },
    { r: 105, g: 221, b: 255 },
  ];

  // Demo EXIF values so the lightbox metadata panel has something to render
  // against these seed placeholder images — not real gear, just fixtures.
  const demoExif = [
    { camera: "Demo Camera X100", lens: "35mm f/1.4", aperture: "f/1.4", shutterSpeed: "1/250", iso: 100, focalLength: "35mm" },
    { camera: "Demo Camera X100", lens: "50mm f/1.8", aperture: "f/2.8", shutterSpeed: "1/500", iso: 200, focalLength: "50mm" },
    { camera: "Demo Camera X100", lens: "24-70mm f/2.8", aperture: "f/5.6", shutterSpeed: "1/125", iso: 400, focalLength: "70mm" },
    { camera: "Demo Camera X100", lens: "85mm f/1.8", aperture: "f/1.8", shutterSpeed: "1/1000", iso: 100, focalLength: "85mm" },
  ];

  for (const [index, color] of photoColors.entries()) {
    const media = await seedMedia(
      `seed/photo-${index + 1}.jpg`,
      color,
      `Seed placeholder photo ${index + 1}`,
    );

    const existingPhoto = await db.photo.findFirst({
      where: { albumId: album.id, mediaId: media.id },
    });
    const photoData = {
      caption: `Placeholder photo ${index + 1} — replace via the Phase 8 admin.`,
      featured: true,
      order: index,
      published: true,
      ...demoExif[index],
    };
    if (existingPhoto) {
      await db.photo.update({ where: { id: existingPhoto.id }, data: photoData });
    } else {
      await db.photo.create({
        data: { albumId: album.id, mediaId: media.id, ...photoData },
      });
    }
  }

  // Real facts from PLAN.md §6 — not placeholder content. Narrative, exact
  // dates, and day-by-day entries are left for the Phase 8 admin since only
  // these bare facts were provided.
  const existingJourney = await db.fitnessJourney.findFirst();
  if (!existingJourney) {
    await db.fitnessJourney.create({ data: { startYear: 2021 } });
  }

  await db.competition.upsert({
    where: { id: "seed-icn-goa-2024" },
    update: {},
    create: {
      id: "seed-icn-goa-2024",
      name: "ICN Goa 2024",
      result: "Bronze",
      published: true,
    },
  });

  await db.fitnessChallenge.upsert({
    where: { slug: "100-day" },
    update: {},
    create: {
      slug: "100-day",
      title: "100-Day Challenge",
      lengthDays: 100,
      published: true,
    },
  });

  await db.fitnessChallenge.upsert({
    where: { slug: "365-day" },
    update: {},
    create: {
      slug: "365-day",
      title: "365-Day Challenge",
      lengthDays: 365,
      published: true,
    },
  });

  // Real facts from PLAN.md §6 — not placeholder content. The story paragraph
  // is assembled only from facts stated there (2015 founding, US origin,
  // Gurgaon weekend cricket, "friends became family"); no players, matches,
  // tournaments, or memories are invented since none were given.
  const existingTeam = await db.cricketTeam.findFirst();
  if (!existingTeam) {
    await db.cricketTeam.create({
      data: {
        name: "Indus Knights",
        foundedYear: 2015,
        tagline: "Friends became family.",
        story:
          "Indus Knights got its start in 2015, born out of a group of friends with roots in the US. What began as casual weekend cricket in Gurgaon turned into something bigger — friends became family.",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
