import { describe, expect, it } from "vitest";
import { contactSchema } from "./contact";

const validSubmission = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello there.",
};

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    expect(contactSchema.safeParse(validSubmission).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...validSubmission, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty message", () => {
    const result = contactSchema.safeParse({ ...validSubmission, message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an overlong message", () => {
    const result = contactSchema.safeParse({
      ...validSubmission,
      message: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("still parses successfully when the honeypot field is filled", () => {
    // The route handler decides what to do with a filled honeypot (fake
    // success, no DB write) — the schema itself must not reject it, or a
    // bot gets a different response than a real user, defeating the trick.
    const result = contactSchema.safeParse({ ...validSubmission, company: "I am a bot" });
    expect(result.success).toBe(true);
  });

  it("accepts a submission with no honeypot value (the real-user case)", () => {
    expect(contactSchema.safeParse(validSubmission).success).toBe(true);
  });
});
