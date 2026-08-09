import Image from "next/image";
import type { CricketMemory, Media } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

type MemoryWithMedia = CricketMemory & { media: Media | null };

export function MemoriesGallery({ memories }: { memories: MemoryWithMedia[] }) {
  if (memories.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">No memories shared yet.</p>
      </FadeIn>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {memories.map((memory, index) => (
        <FadeIn key={memory.id} delay={index * 0.06}>
          <HoverLift>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              {memory.media && (
                <div className="relative aspect-square">
                  <Image
                    src={publicUrl(memory.media.key)}
                    alt={memory.media.alt ?? memory.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <p className="text-xs font-medium text-foreground">
                  {memory.title}
                </p>
              </div>
            </div>
          </HoverLift>
        </FadeIn>
      ))}
    </div>
  );
}
