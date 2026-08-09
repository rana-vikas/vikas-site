"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import type { Media, Photo } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { Lightbox } from "@/components/gallery/Lightbox";

export type GalleryPhoto = Photo & { media: Media };

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return <p className="text-sm text-muted">No photos published yet.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={publicUrl(photo.media.key)}
              alt={photo.media.alt ?? photo.caption ?? "Photo"}
              fill
              unoptimized
              className="object-cover transition-transform duration-200 hover:scale-105"
            />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            key="lightbox"
            photos={photos}
            index={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onIndexChange={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}
