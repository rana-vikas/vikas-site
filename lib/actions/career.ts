"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  achievementSchema,
  certificationSchema,
  experienceSchema,
  projectSchema,
  skillSchema,
} from "@/lib/validations/career";
import type { ActionState } from "@/lib/actions/types";

function revalidateCareer() {
  revalidatePath("/");
  revalidatePath("/career");
}

// --- Experience ---

function parseExperienceForm(formData: FormData) {
  return experienceSchema.safeParse({
    company: formData.get("company"),
    title: formData.get("title"),
    location: formData.get("location") || undefined,
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    current: formData.get("current") === "on",
    description: formData.get("description") || undefined,
    published: formData.get("published") === "on",
  });
}

export async function createExperience(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseExperienceForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const count = await db.experience.count();
  const experience = await db.experience.create({
    data: {
      company: parsed.data.company,
      title: parsed.data.title,
      location: parsed.data.location || null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      current: parsed.data.current,
      description: parsed.data.description || null,
      published: parsed.data.published,
      order: count,
    },
  });

  revalidateCareer();
  redirect(`/admin/career/experience/${experience.id}`);
}

export async function updateExperience(
  experienceId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseExperienceForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  await db.experience.update({
    where: { id: experienceId },
    data: {
      company: parsed.data.company,
      title: parsed.data.title,
      location: parsed.data.location || null,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      current: parsed.data.current,
      description: parsed.data.description || null,
      published: parsed.data.published,
    },
  });

  revalidateCareer();
  return { success: true };
}

export async function deleteExperience(experienceId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.experience.delete({ where: { id: experienceId } });
  revalidateCareer();
  redirect("/admin/career");
}

// --- Project ---

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description") || undefined,
    url: formData.get("url") || undefined,
    repoUrl: formData.get("repoUrl") || undefined,
    coverMediaId: formData.get("coverMediaId") || undefined,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
}

export async function createProject(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseProjectForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const count = await db.project.count();
  const project = await db.project.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      description: parsed.data.description || null,
      url: parsed.data.url || null,
      repoUrl: parsed.data.repoUrl || null,
      coverMediaId: parsed.data.coverMediaId || null,
      featured: parsed.data.featured,
      published: parsed.data.published,
      order: count,
    },
  });

  revalidateCareer();
  redirect(`/admin/career/projects/${project.id}`);
}

export async function updateProject(
  projectId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseProjectForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  await db.project.update({
    where: { id: projectId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      description: parsed.data.description || null,
      url: parsed.data.url || null,
      repoUrl: parsed.data.repoUrl || null,
      coverMediaId: parsed.data.coverMediaId || null,
      featured: parsed.data.featured,
      published: parsed.data.published,
    },
  });

  revalidateCareer();
  return { success: true };
}

export async function deleteProject(projectId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.project.delete({ where: { id: projectId } });
  revalidateCareer();
  redirect("/admin/career");
}

// --- Skill ---

export async function createSkill(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
  });
  if (!parsed.success) return;

  const count = await db.skill.count();
  await db.skill.create({ data: { ...parsed.data, order: count } });
  revalidateCareer();
}

export async function deleteSkill(skillId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.skill.delete({ where: { id: skillId } });
  revalidateCareer();
}

// --- Achievement ---

export async function createAchievement(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = achievementSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    date: formData.get("date") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.achievement.count();
  await db.achievement.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      order: count,
    },
  });
  revalidateCareer();
}

export async function deleteAchievement(achievementId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.achievement.delete({ where: { id: achievementId } });
  revalidateCareer();
}

// --- Certification ---

export async function createCertification(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = certificationSchema.safeParse({
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    date: formData.get("date") || undefined,
    url: formData.get("url") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.certification.count();
  await db.certification.create({
    data: {
      title: parsed.data.title,
      issuer: parsed.data.issuer,
      date: parsed.data.date ? new Date(parsed.data.date) : null,
      url: parsed.data.url || null,
      order: count,
    },
  });
  revalidateCareer();
}

export async function deleteCertification(certificationId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.certification.delete({ where: { id: certificationId } });
  revalidateCareer();
}
