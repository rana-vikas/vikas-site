import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
  // Honeypot — real users never fill this (hidden via CSS); bots that
  // auto-fill every field do. No length constraint here: the route handler
  // checks this *after* parsing and returns a fake success, so a filled-in
  // value must still parse successfully rather than fail validation (which
  // would leak the honeypot via a different response).
  company: z.string().max(500).optional(),
});
