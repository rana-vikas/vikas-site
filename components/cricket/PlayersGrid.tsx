import Image from "next/image";
import type { CricketPlayer, Media } from "@/lib/generated/prisma/client";
import { publicUrl } from "@/lib/storage/url";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

type PlayerWithPhoto = CricketPlayer & { photoMedia: Media | null };

export function PlayersGrid({ players }: { players: PlayerWithPhoto[] }) {
  if (players.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Players coming soon.</p>
      </FadeIn>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {players.map((player, index) => (
        <FadeIn key={player.id} delay={index * 0.06}>
          <HoverLift>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {player.photoMedia && (
                <div className="relative aspect-square">
                  <Image
                    src={publicUrl(player.photoMedia.key)}
                    alt={player.photoMedia.alt ?? player.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-sm font-medium text-foreground">
                  {player.name}
                </h3>
                {player.role && (
                  <p className="text-xs text-muted">{player.role}</p>
                )}
              </div>
            </div>
          </HoverLift>
        </FadeIn>
      ))}
    </div>
  );
}
