import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdminSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { storageClient, STORAGE_BUCKET } from "@/lib/storage/client";

const MAX_DIMENSION = 2400;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_DOCUMENT_TYPES = new Set(["application/pdf"]);

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const alt = formData.get("alt");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);
  const isDocument = ALLOWED_DOCUMENT_TYPES.has(file.type);

  if (!isImage && !isDocument) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP images or PDF documents are supported" },
      { status: 400 },
    );
  }

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
    data: {
      key,
      type,
      width,
      height,
      alt: typeof alt === "string" && alt.length > 0 ? alt : null,
    },
  });

  return NextResponse.json(media);
}
