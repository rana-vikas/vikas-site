"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { homepageImages } from "@/config/homepageImages";
import { EASE } from "@/lib/motion/tokens";
import { ScrollIndicator } from "@/components/hero/ScrollIndicator";

// Fixed brand copy for the hero's identity statement — this is the site's
// core "trailer" line, not a per-field CMS value (the homepage's data-driven
// content is the latest-travel/featured-photography sections below, which
// pull from Prisma; see app/(public)/page.tsx).
const EYEBROW = "ENGINEER · CREATOR · CRICKETER · FITNESS · PHOTOGRAPHER · TRAVELLER";
const SUPPORTING_TEXT =
  "A technology professional, creator, cricketer, fitness enthusiast, photographer and traveller — documenting the things that make life interesting.";

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [parallaxEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imageParallaxX = useTransform(mouseX, [-1, 1], [-12, 12]);
  const imageParallaxY = useTransform(mouseY, [-1, 1], [-12, 12]);
  const textParallaxX = useTransform(mouseX, [-1, 1], [4, -4]);

  const enableParallax = parallaxEnabled && !reduceMotion;

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!enableParallax) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[720px] h-[92vh] items-center overflow-hidden bg-background sm:h-[95vh] lg:h-screen"
    >
      <motion.div
        aria-hidden
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <motion.div
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          style={
            enableParallax
              ? { x: imageParallaxX, y: imageParallaxY }
              : undefined
          }
          className="absolute inset-[-2%]"
        >
          <Image
            src={homepageImages.hero.src}
            alt={homepageImages.hero.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      {/* Layered overlay: dark left, semi-transparent center, image visible on the right */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"
      />
      {/* Bottom fade for a seamless blend into the next section */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent"
      />

      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
          x: enableParallax ? textParallaxX : undefined,
        }}
        className="relative z-10 mx-auto w-full max-w-[1200px] px-[18px] sm:px-8 lg:px-12"
      >
        <div className="max-w-[800px] pt-[8vh]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground-secondary sm:text-xs"
          >
            {EYEBROW}
          </motion.p>

          <h1 className="mt-5 font-semibold leading-[0.86] tracking-[-0.06em] text-foreground text-[clamp(48px,15vw,138px)] sm:text-[clamp(64px,9vw,138px)]">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
                className="block"
              >
                THIS IS
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.85, duration: 0.8, ease: EASE }}
                className="block bg-gradient-to-r from-white via-cyan to-purple bg-clip-text text-transparent"
              >
                MY WORLD.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6, ease: EASE }}
            className="mt-8 max-w-[620px] text-base text-foreground-secondary sm:text-lg"
          >
            {SUPPORTING_TEXT}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="#worlds"
              className="inline-flex h-[46px] items-center rounded-full border border-white/[.12] bg-white/[.04] px-6 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover hover:bg-white/[.07] hover:shadow-[0_0_24px_rgba(105,221,255,0.25)]"
            >
              Explore My Story →
            </Link>
            <Link
              href="/career#recruiter"
              className="inline-flex h-[46px] items-center rounded-full border border-white/[.12] bg-white/[.04] px-6 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover hover:bg-white/[.07] hover:shadow-[0_0_24px_rgba(105,221,255,0.25)]"
            >
              Recruiter View →
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
