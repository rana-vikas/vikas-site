import type { Experience } from "@/lib/generated/prisma/client";
import { formatMonthYear } from "@/lib/utils/date";
import { FadeIn } from "@/components/animations/FadeIn";
import { Timeline } from "@/components/timeline/Timeline";

export function ExperienceTimeline({
  experiences,
}: {
  experiences: Experience[];
}) {
  if (experiences.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Experience coming soon.</p>
      </FadeIn>
    );
  }

  return (
    <Timeline
      items={experiences.map((experience) => ({
        id: experience.id,
        title: experience.title,
        subtitle: experience.location
          ? `${experience.company} · ${experience.location}`
          : experience.company,
        period: `${formatMonthYear(experience.startDate)} – ${
          experience.current || !experience.endDate
            ? "Present"
            : formatMonthYear(experience.endDate)
        }`,
        description: experience.description,
      }))}
    />
  );
}
