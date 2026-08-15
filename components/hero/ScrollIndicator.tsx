"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScrollIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.6 }}
      className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-foreground-secondary"
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.2em]">
        Scroll to explore
      </span>
      <span className="relative h-8 w-px overflow-hidden bg-white/10">
        <motion.span
          className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-cyan to-transparent"
          animate={
            reduceMotion
              ? { opacity: 0.5 }
              : { y: ["-100%", "100%"], opacity: [0, 1, 0] }
          }
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </span>
    </motion.div>
  );
}
