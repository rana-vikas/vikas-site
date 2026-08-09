"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import { publicUrl } from "@/lib/storage/url";

export function MediaUploadField({
  name,
  label,
  defaultMedia,
  accept = "image/jpeg,image/png,image/webp",
}: {
  name: string;
  label: string;
  defaultMedia?: { id: string; key: string; type: string } | null;
  accept?: string;
}) {
  const [mediaId, setMediaId] = useState<string | null>(defaultMedia?.id ?? null);
  const [preview, setPreview] = useState<{ key: string; type: string } | null>(
    defaultMedia ? { key: defaultMedia.key, type: defaultMedia.type } : null,
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Upload failed");
      }
      const media = await response.json();
      setMediaId(media.id);
      setPreview({ key: media.key, type: media.type });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm text-muted">{label}</label>
      <input type="hidden" name={name} value={mediaId ?? ""} />
      {preview &&
        (preview.type === "image" ? (
          <div className="relative mt-2 aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-white/10">
            <Image
              src={publicUrl(preview.key)}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <a
            href={publicUrl(preview.key)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-cyan hover:underline"
          >
            View current file
          </a>
        ))}
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="mt-2 block text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-white/[0.06] file:px-3 file:py-1.5 file:text-xs file:text-foreground"
      />
      {uploading && <p className="mt-1 text-xs text-muted">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
