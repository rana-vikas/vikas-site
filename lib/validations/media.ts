import { z } from "zod";

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const ALLOWED_DOCUMENT_TYPES = new Set(["application/pdf"]);

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is empty")
    .refine((file) => file.size <= MAX_FILE_SIZE, "File exceeds the 20MB limit")
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.has(file.type) || ALLOWED_DOCUMENT_TYPES.has(file.type),
      "Only JPEG, PNG, WebP images or PDF documents are supported",
    ),
  alt: z.string().max(500).optional(),
});
