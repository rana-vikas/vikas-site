import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { storageClient, STORAGE_BUCKET } from "@/lib/storage/client";
import { ALLOWED_IMAGE_TYPES, uploadSchema } from "@/lib/validations/media";

const MAX_DIMENSION = 2400;

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const parsed = uploadSchema.safeParse({
    file: formData.get("file"),
    alt: formData.get("alt") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid upload" },
      { status: 400 },
    );
  }

  const { file, alt } = parsed.data;
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let key: string;
  let type: string;
  let width: number | null = null;
  let height: number | null = null;

  if (isImage) {
    // Server-side resize/optimize before the file ever reaches storage.
    const processed = sharp(inputBuffer)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 });

    const [outputBuffer, metadata] = await Promise.all([
      processed.toBuffer(),
      processed.metadata(),
    ]);

    key = `uploads/${randomUUID()}.jpg`;
    type = "image";
    width = metadata.width ?? null;
    height = metadata.height ?? null;

    await storageClient.send(
      new PutObjectCommand({
        Bucket: STORAGE_BUCKET,
        Key: key,
        Body: outputBuffer,
        ContentType: "image/jpeg",
      }),
    );
  } else {
    // PDFs (resumes) pass through untouched — sharp only handles images.
    key = `uploads/${randomUUID()}.pdf`;
    type = "document";

    await storageClient.send(
      new PutObjectCommand({
        Bucket: STORAGE_BUCKET,
        Key: key,
        Body: inputBuffer,
        ContentType: "application/pdf",
      }),
    );
  }

  const media = await db.media.create({
    data: { key, type, width, height, alt: alt ?? null },
  });

  return NextResponse.json(media);
}
