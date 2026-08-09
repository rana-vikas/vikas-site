import { S3Client } from "@aws-sdk/client-s3";

export const storageClient = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT,
  region: "us-east-1",
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY ?? "",
    secretAccessKey: process.env.STORAGE_SECRET_KEY ?? "",
  },
});

export const STORAGE_BUCKET = process.env.STORAGE_BUCKET ?? "vikas-media";
