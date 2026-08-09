import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    experienceCount,
    projectCount,
    fitnessChallengeCount,
    competitionCount,
    cricketPlayerCount,
    cricketMatchCount,
    equipmentCount,
    photoCount,
    tripCount,
    mediaCount,
  ] = await Promise.all([
    db.experience.count(),
    db.project.count(),
    db.fitnessChallenge.count(),
    db.competition.count(),
    db.cricketPlayer.count(),
    db.cricketMatch.count(),
    db.equipment.count(),
    db.photo.count(),
    db.travelTrip.count(),
    db.media.count(),
  ]);

  const cards: {
    label: string;
    count: number;
    href?: string;
  }[] = [
    { label: "Trips", count: tripCount, href: "/admin/travel" },
    { label: "Photos", count: photoCount, href: "/admin/photography" },
    { label: "Equipment", count: equipmentCount, href: "/admin/photography" },
    { label: "Media files", count: mediaCount, href: "/admin/media" },
    { label: "Experience entries", count: experienceCount },
    { label: "Projects", count: projectCount },
    { label: "Fitness challenges", count: fitnessChallengeCount },
    { label: "Competitions", count: competitionCount },
    { label: "Cricket players", count: cricketPlayerCount },
    { label: "Cricket matches", count: cricketMatchCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => {
          const content = (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-2xl font-semibold text-foreground">
                {card.count}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                {card.label}
              </p>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>
      <p className="mt-8 text-sm text-muted">
        Career, Fitness, and Cricket CRUD screens aren&apos;t built yet —
        counts are shown for visibility. Travel, Photography, Media, and
        Settings are manageable now.
      </p>
    </div>
  );
}
