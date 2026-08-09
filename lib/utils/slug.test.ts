import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(slugify("Sample Trip")).toBe("sample-trip");
  });

  it("strips punctuation", () => {
    expect(slugify("Let's Go: Paris!")).toBe("let-s-go-paris");
  });

  it("collapses repeated separators", () => {
    expect(slugify("Too   Many    Spaces")).toBe("too-many-spaces");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  -Trailing Dash-  ")).toBe("trailing-dash");
  });

  it("strips accents", () => {
    expect(slugify("Café Résumé")).toBe("cafe-resume");
  });

  it("handles an already-clean slug unchanged", () => {
    expect(slugify("100-day")).toBe("100-day");
  });

  it("handles empty input", () => {
    expect(slugify("")).toBe("");
  });
});
