"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeIn } from "@/lib/motion/variants";

export function PhotoTile({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={fadeIn}
      transition={{ delay }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
