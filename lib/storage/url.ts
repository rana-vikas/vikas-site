import { STORAGE_BUCKET } from "@/lib/storage/client";

export function publicUrl(key: string): string {
  const base = process.env.STORAGE_PUBLIC_URL ?? "";
  return `${base}/${STORAGE_BUCKET}/${key}`;
}
