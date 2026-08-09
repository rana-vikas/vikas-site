import { FadeIn } from "@/components/animations/FadeIn";

export function ProfessionalSummary({ summary }: { summary: string | null }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
      <FadeIn>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Career
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          {summary ?? "Professional summary coming soon."}
        </p>
      </FadeIn>
    </section>
  );
}
