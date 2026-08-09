import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { HoverLift } from "@/components/animations/HoverLift";

const pillars = [
  {
    label: "Career",
    href: "/career",
    description: "Professional summary, experience, and projects.",
  },
  {
    label: "Fitness",
    href: "/fitness",
    description: "The journey since 2021 — challenges, races, and progress.",
  },
  {
    label: "Indus Knights",
    href: "/cricket",
    description: "Weekend cricket that turned into a second family.",
  },
];

export function WorldsGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-sm uppercase tracking-widest text-muted">
          Different Worlds. One Person.
        </h2>
      </FadeIn>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {pillars.map((pillar, index) => (
          <FadeIn key={pillar.href} delay={index * 0.1}>
            <HoverLift className="h-full">
              <Link
                href={pillar.href}
                className="block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan/40"
              >
                <h3 className="text-xl font-medium text-foreground">
                  {pillar.label}
                </h3>
                <p className="mt-2 text-sm text-muted">{pillar.description}</p>
              </Link>
            </HoverLift>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
