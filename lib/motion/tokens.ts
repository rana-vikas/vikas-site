// Shared timing/easing for the homepage's Framer Motion animations, so
// duration/easing values live in one place instead of being repeated inline
// across components.

export const DURATION = {
  fast: 0.25,
  normal: 0.5,
  slow: 1,
} as const;

// Premium "ease out, no overshoot" curve used throughout the homepage.
export const EASE = [0.22, 1, 0.36, 1] as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
