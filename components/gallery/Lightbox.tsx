"use client";

import { useCallback, useEffect, useRef, type TouchEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Media } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { formatMonthYear } from "@/lib/utils/date";

const SWIPE_THRESHOLD = 50;

// Minimal shape the lightbox needs — decoupled from the Photo model so
// other domains (e.g. Travel memories) can reuse it without EXIF fields.
export type GalleryImage = {
  id: string;
  media: Media;
  caption?: string | null;
  camera?: string | null;
  lens?: string | null;
  aperture?: string | null;
  shutterSpeed?: string | null;
  iso?: number | null;
  focalLength?: string | null;
  takenAt?: Date | null;
};

export function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: GalleryImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const photo = photos[index];
  const touchStartX = useRef<number | null>(null);

  const goPrev = useCallback(
    () => onIndexChange((index - 1 + photos.length) % photos.length),
    [index, photos.length, onIndexChange],
  );
  const goNext = useCallback(
    () => onIndexChange((index + 1) % photos.length),
    [index, photos.length, onIndexChange],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") goPrev();
      else if (event.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
    touchStartX.current = null;
  }

  const exifItems = [
    photo.camera && { label: "Camera", value: photo.camera },
    photo.lens && { label: "Lens", value: photo.lens },
    photo.focalLength && { label: "Focal Length", value: photo.focalLength },
    photo.aperture && { label: "Aperture", value: photo.aperture },
    photo.shutterSpeed && { label: "Shutter Speed", value: photo.shutterSpeed },
    photo.iso && { label: "ISO", value: `${photo.iso}` },
    photo.takenAt && { label: "Taken", value: formatMonthYear(photo.takenAt) },
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur"
      role="dialog"
      aria-modal="true"
      aria-label={photo.media.alt ?? photo.caption ?? "Photo viewer"}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/[0.03] p-2 text-foreground hover:border-cyan/40"
        aria-label="Close"
      >
        ✕
      </button>

      <div className="relative flex flex-1 items-center justify-center px-4 py-16 sm:px-16">
        {photos.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 z-10 rounded-full border border-white/10 bg-white/[0.03] p-2 text-foreground hover:border-cyan/40 sm:left-6"
            aria-label="Previous photo"
          >
            ←
          </button>
        )}
        <motion.div
          key={photo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative h-full w-full max-w-4xl"
        >
          <Image
            src={publicUrl(photo.media.key)}
            alt={photo.media.alt ?? photo.caption ?? "Photo"}
            fill
            unoptimized
            className="object-contain"
            sizes="100vw"
            priority
          />
        </motion.div>
        {photos.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 z-10 rounded-full border border-white/10 bg-white/[0.03] p-2 text-foreground hover:border-cyan/40 sm:right-6"
            aria-label="Next photo"
          >
            →
          </button>
        )}
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        {photo.caption && (
          <p className="text-sm text-foreground">{photo.caption}</p>
        )}
        {exifItems.length > 0 && (
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted">
            {exifItems.map((item) => (
              <div key={item.label} className="flex gap-1">
                <dt className="uppercase tracking-widest">{item.label}:</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </motion.div>
  );
}
