import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";

export function RecruiterPanel() {
  return (
    <section className="mx-auto max-w-[1200px] px-[18px] py-24 sm:px-8 lg:px-12 lg:py-32">
      <FadeIn>
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-panel px-8 py-14 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan/10 to-purple/10 blur-[100px]"
          />
          <p className="relative font-semibold leading-[0.95] tracking-[-0.03em] text-foreground text-[clamp(28px,4vw,44px)]">
            Looking for the
            <br />
            professional story?
          </p>
          <Link
            href="/career#recruiter"
            className="relative mt-8 inline-flex h-[46px] items-center rounded-full border border-white/[.12] bg-white/[.04] px-6 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover hover:bg-white/[.07] hover:shadow-[0_0_24px_rgba(105,221,255,0.25)]"
          >
            View Recruiter Profile →
          </Link>
        </div>
      </FadeIn>
    </section>
  );
}
