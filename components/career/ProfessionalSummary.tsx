import { FadeIn } from "@/components/animations/FadeIn";

export function ProfessionalSummary({
  name,
  title,
  location,
  summary,
}: {
  name: string | null;
  title: string | null;
  location: string | null;
  summary: string | null;
}) {
  const paragraphs = summary
    ? summary.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
    : [];

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-32">
      <FadeIn>
        <h2 className="text-sm uppercase tracking-widest text-muted">Career</h2>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {name ?? "Career"}
        </h1>
        {(title || location) && (
          <p className="mt-2 text-lg text-muted">
            {[title, location].filter(Boolean).join(" · ")}
          </p>
        )}
        {paragraphs.length > 0 ? (
          <div className="mt-6 max-w-2xl space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "text-lg text-foreground"
                    : "text-base text-muted"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Professional summary coming soon.
          </p>
        )}
      </FadeIn>
    </section>
  );
}
