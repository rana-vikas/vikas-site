import { FadeIn } from "@/components/animations/FadeIn";

export function ReachOutCta({ email }: { email: string | null }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan/10 to-purple/10 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground">
              Curious about the journey?
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted">
              I&apos;m not a coach, trainer, or medical professional — just
              documenting my own experience. Happy to swap notes if you&apos;re
              on a similar path.
            </p>
          </div>
          {email ? (
            <a
              href={`mailto:${email}`}
              className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Say Hello
            </a>
          ) : null}
        </div>
      </FadeIn>
    </section>
  );
}
