import { describe, expect, it } from "vitest";
import { tripSchema } from "./travel";

const validTrip = {
  title: "Sample Trip",
  slug: "sample-trip",
  location: "Somewhere",
  startDate: "2026-01-01",
  published: true,
};

describe("tripSchema", () => {
  it("accepts a minimal valid trip", () => {
    expect(tripSchema.safeParse(validTrip).success).toBe(true);
  });

  it("rejects a missing title", () => {
    const result = tripSchema.safeParse({ ...validTrip, title: "" });
    expect(result.success).toBe(false);
  });

  it.each(["Sample Trip", "sample_trip", "sample--trip ", "UPPERCASE", ""])(
    "rejects an invalid slug: %j",
    (slug) => {
      const result = tripSchema.safeParse({ ...validTrip, slug });
      expect(result.success).toBe(false);
    },
  );

  it.each(["sample-trip", "100-day", "a", "trip-2026"])(
    "accepts a valid slug: %j",
    (slug) => {
      const result = tripSchema.safeParse({ ...validTrip, slug });
      expect(result.success).toBe(true);
    },
  );

  it("rejects a missing startDate", () => {
    expect(
      tripSchema.safeParse({
        title: validTrip.title,
        slug: validTrip.slug,
        location: validTrip.location,
        published: validTrip.published,
      }).success,
    ).toBe(false);
  });
});
