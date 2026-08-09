"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { profileSchema } from "@/lib/validations/settings";
import type { ActionState } from "@/lib/actions/types";

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    headline: formData.get("headline"),
    tagline: formData.get("tagline"),
    summary: formData.get("summary") || undefined,
    resumeMediaId: formData.get("resumeMediaId") || undefined,
  });

  if (!parsed.success) {
    return { error: "Please fill in all required fields." };
  }

  const existing = await db.profile.findFirst();
  const data = {
    name: parsed.data.name,
    headline: parsed.data.headline,
    tagline: parsed.data.tagline,
    summary: parsed.data.summary || null,
    resumeMediaId: parsed.data.resumeMediaId || null,
  };

  if (existing) {
    await db.profile.update({ where: { id: existing.id }, data });
  } else {
    await db.profile.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/career");
  revalidatePath("/admin/settings");

  return { success: true };
}
