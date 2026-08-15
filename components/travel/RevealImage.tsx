"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { imageReveal } from "@/lib/motion/variants";

// Scroll-triggered scale+fade reveal (1.12 → 1.0) for a hero-style image,
// isolated as its own client component so the parent section can stay a
// Server Component.
export function RevealImage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={imageReveal}
    >
      {children}
    </motion.div>
  );
}
