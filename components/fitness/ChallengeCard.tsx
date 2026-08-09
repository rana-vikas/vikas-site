import Link from "next/link";
import type { FitnessChallenge } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

export function ChallengeCard({
  challenge,
  entryCount,
  delay = 0,
}: {
  challenge: FitnessChallenge;
  entryCount: number;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <HoverLift className="h-full">
        <Link
          href={`/fitness/challenges/${challenge.slug}`}
          className="block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan/40"
        >
          <h3 className="text-lg font-medium text-foreground">
            {challenge.title}
          </h3>
          <p className="mt-2 text-sm text-muted">
            {entryCount} of {challenge.lengthDays} days logged
          </p>
          {challenge.summary && (
            <p className="mt-2 text-sm text-muted">{challenge.summary}</p>
          )}
        </Link>
      </HoverLift>
    </FadeIn>
  );
}
