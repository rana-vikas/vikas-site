"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { homepageImages } from "@/config/homepageImages";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion/variants";
import { EASE } from "@/lib/motion/tokens";

const pillars = [
  {
    index: "01",
    kind: "Professional",
    label: "Career",
    href: "/career",
    description: "The work, ideas and engineering journey.",
    cta: "Explore Career",
    image: homepageImages.career,
  },
  {
    index: "02",
    kind: "Discipline",
    label: "Fitness",
    href: "/fitness",
    description: "The journey since 2021 — challenges, races and progress.",
    cta: "Explore Fitness",
    image: homepageImages.fitness,
  },
  {
    index: "03",
    kind: "Family",
    label: "Indus Knights",
    href: "/cricket",
    description: "Weekend cricket that turned into a second family.",
    cta: "Explore Cricket",
    image: homepageImages.cricket,
  },
];

export function WorldsGrid() {
  return (
    <section id="worlds" className="mx-auto max-w-[1200px] px-[18px] py-24 sm:px-8 lg:px-12 lg:py-32">
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-secondary"
      >
        Explore
      </motion.p>
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="mt-4 font-semibold leading-[0.95] tracking-[-0.045em] text-foreground text-[clamp(40px,6vw,82px)]"
      >
        Different worlds.
        <br />
        One person.
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.1)}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      >
        {pillars.map((pillar) => (
          <motion.div key={pillar.href} variants={staggerItem}>
            <WorldCard {...pillar} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

const MotionLink = motion.create(Link);

// Shared hover-state variants — living on the outer `MotionLink`'s
// `whileHover` and propagated to every nested `motion` descendant, so the
// image zoom, content lift, and arrow shift all animate together no matter
// where the pointer sits inside the card.
const imageHover = { rest: { scale: 1 }, hover: { scale: 1.06 } };
const contentHover = { rest: { y: 0 }, hover: { y: -6 } };
const arrowHover = { rest: { x: 0 }, hover: { x: 5 } };

function WorldCard({
  index,
  kind,
  label,
  href,
  description,
  cta,
  image,
}: (typeof pillars)[number]) {
  return (
    <MotionLink
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="group relative block h-[380px] overflow-hidden rounded-[28px] border border-border transition-colors duration-500 hover:border-border-hover sm:h-[420px] lg:h-[500px]"
    >
      <motion.div
        className="absolute inset-0"
        variants={imageHover}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent transition-opacity duration-500 group-hover:from-background/95" />

      <motion.div
        className="absolute inset-x-0 bottom-0 p-7 lg:p-8"
        variants={contentHover}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground-secondary">
          {index} · {kind}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
          {label}
        </h3>
        <p className="mt-2 max-w-[32ch] text-sm text-foreground-secondary">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan">
          {cta}
          <motion.span variants={arrowHover} transition={{ duration: 0.25, ease: EASE }}>
            →
          </motion.span>
        </span>
      </motion.div>
    </MotionLink>
  );
}
