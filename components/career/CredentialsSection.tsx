import type { Achievement, Certification } from "@/lib/generated/prisma/client";
import { formatMonthYear } from "@/lib/utils/date";
import { FadeIn } from "@/components/animations/FadeIn";

export function CredentialsSection({
  achievements,
  certifications,
}: {
  achievements: Achievement[];
  certifications: Certification[];
}) {
  if (achievements.length === 0 && certifications.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">
          Achievements and certifications coming soon.
        </p>
      </FadeIn>
    );
  }

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted">
          Achievements
        </h3>
        {achievements.length === 0 ? (
          <p className="mt-3 text-sm text-muted">None yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {achievements.map((achievement, index) => (
              <FadeIn key={achievement.id} delay={index * 0.05}>
                <p className="text-sm font-medium text-foreground">
                  {achievement.title}
                </p>
                {achievement.date && (
                  <p className="text-xs text-muted">
                    {formatMonthYear(achievement.date)}
                  </p>
                )}
              </FadeIn>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted">
          Certifications
        </h3>
        {certifications.length === 0 ? (
          <p className="mt-3 text-sm text-muted">None yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {certifications.map((certification, index) => (
              <FadeIn key={certification.id} delay={index * 0.05}>
                <p className="text-sm font-medium text-foreground">
                  {certification.url ? (
                    <a
                      href={certification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan"
                    >
                      {certification.title}
                    </a>
                  ) : (
                    certification.title
                  )}
                </p>
                <p className="text-xs text-muted">
                  {certification.issuer}
                  {certification.date &&
                    ` · ${formatMonthYear(certification.date)}`}
                </p>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
