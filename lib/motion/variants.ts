import type { Variants } from "framer-motion";
import { DURATION, EASE } from "./tokens";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};

// For a background image that should reveal from a slightly zoomed,
// slightly hidden state into full clarity (hero load, travel image reveal).
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.12 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

// Each line starts fully clipped below its own baseline and rises into
// place — used with a parent `overflow-hidden` wrapper per line.
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.8, ease: EASE },
  },
};

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE },
  },
};
