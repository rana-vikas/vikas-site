import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";

export function RecruiterPanel() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan/10 to-purple/10 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-medium text-foreground">
              Hiring? Start here.
            </h2>
            <p className="mt-1 text-sm text-muted">
              A recruiter-focused view with stats, timeline, and a resume
              download.
            </p>
          </div>
          <Link
            href="/career#recruiter"
            className="shrink-0 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Recruiter view
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
