import { describe, expect, it } from "vitest";
import { credentialsSchema } from "./auth";

describe("credentialsSchema", () => {
  it("accepts a valid email and non-empty password", () => {
    const result = credentialsSchema.safeParse({
      email: "admin@example.com",
      password: "hunter2",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = credentialsSchema.safeParse({
      email: "not-an-email",
      password: "hunter2",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty password", () => {
    const result = credentialsSchema.safeParse({
      email: "admin@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(credentialsSchema.safeParse({}).success).toBe(false);
  });
});
