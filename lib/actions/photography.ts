"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { albumSchema, equipmentSchema, photoSchema } from "@/lib/validations/photography";
import type { ActionState } from "@/lib/actions/types";

function revalidatePhotography() {
  revalidatePath("/");
  revalidatePath("/photography");
}

function parseAlbumForm(formData: FormData) {
  return albumSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    published: formData.get("published") === "on",
  });
}

export async function createAlbum(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseAlbumForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  const album = await db.photoAlbum.create({ data: parsed.data });
  revalidatePhotography();
  redirect(`/admin/photography/${album.id}`);
}

export async function updateAlbum(
  albumId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = parseAlbumForm(formData);
  if (!parsed.success) return { error: "Please check the required fields." };

  await db.photoAlbum.update({ where: { id: albumId }, data: parsed.data });
  revalidatePhotography();
  return { success: true };
}

export async function deleteAlbum(albumId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.photoAlbum.delete({ where: { id: albumId } });
  revalidatePhotography();
  redirect("/admin/photography");
}

export async function addPhoto(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = photoSchema.safeParse({
    albumId: formData.get("albumId"),
    mediaId: formData.get("mediaId"),
    caption: formData.get("caption") || undefined,
    featured: formData.get("featured") === "on",
    camera: formData.get("camera") || undefined,
    lens: formData.get("lens") || undefined,
    aperture: formData.get("aperture") || undefined,
    shutterSpeed: formData.get("shutterSpeed") || undefined,
    iso: formData.get("iso") || undefined,
    focalLength: formData.get("focalLength") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.photo.count({ where: { albumId: parsed.data.albumId } });

  await db.photo.create({
    data: {
      albumId: parsed.data.albumId,
      mediaId: parsed.data.mediaId,
      caption: parsed.data.caption || null,
      featured: parsed.data.featured,
      order: count,
      camera: parsed.data.camera || null,
      lens: parsed.data.lens || null,
      aperture: parsed.data.aperture || null,
      shutterSpeed: parsed.data.shutterSpeed || null,
      iso: parsed.data.iso ? Number(parsed.data.iso) : null,
      focalLength: parsed.data.focalLength || null,
    },
  });

  revalidatePhotography();
}

export async function deletePhoto(photoId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.photo.delete({ where: { id: photoId } });
  revalidatePhotography();
}

export async function createEquipment(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) return;

  const parsed = equipmentSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category") || undefined,
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return;

  const count = await db.equipment.count();

  await db.equipment.create({
    data: {
      name: parsed.data.name,
      category: parsed.data.category || null,
      description: parsed.data.description || null,
      order: count,
    },
  });

  revalidatePhotography();
}

export async function deleteEquipment(equipmentId: string) {
  const session = await requireAdminSession();
  if (!session) return;

  await db.equipment.delete({ where: { id: equipmentId } });
  revalidatePhotography();
}
