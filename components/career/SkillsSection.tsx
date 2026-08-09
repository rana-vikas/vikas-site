import type { Skill } from "@/lib/generated/prisma/client";
import { FadeIn } from "@/components/animations/FadeIn";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return (
      <FadeIn>
        <p className="text-sm text-muted">Skills coming soon.</p>
      </FadeIn>
    );
  }

  const categories = new Map<string, Skill[]>();
  for (const skill of skills) {
    const group = categories.get(skill.category) ?? [];
    group.push(skill);
    categories.set(skill.category, group);
  }

  return (
    <div className="space-y-6">
      {[...categories.entries()].map(([category, categorySkills], index) => (
        <FadeIn key={category} delay={index * 0.05}>
          <h3 className="text-xs uppercase tracking-widest text-muted">
            {category}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-sm text-foreground"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
