"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero({ headline, tagline }: { headline: string; tagline: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-cyan/20 blur-[120px]"
      />
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute -bottom-1/3 left-1/4 h-[50vh] w-[50vh] rounded-full bg-purple/20 blur-[120px]"
      />
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative mx-auto max-w-5xl px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-6xl font-semibold tracking-tight text-transparent sm:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{tagline}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
