import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp } from "@/lib/net";
import { rateLimit } from "@/lib/rateLimit";
import { contactSchema } from "@/lib/validations/contact";

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`contact:${ip}`, LIMIT, WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again later." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  // Honeypot tripped — pretend success so the bot doesn't learn anything.
  if (parsed.data.company) {
    return NextResponse.json({ success: true });
  }

  await db.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    },
  });

  return NextResponse.json({ success: true });
}
