"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import type { NavItem } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { DURATION, EASE } from "@/lib/motion/tokens";

const linkStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};

const linkItem = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE } },
};

const mobileMenu = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast, staggerChildren: 0.05, delayChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

const mobileItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE } },
  exit: { opacity: 0, y: 12 },
};

export function NavChrome({
  mainNav,
  isAdmin,
}: {
  mainNav: NavItem[];
  isAdmin: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 8);
  });

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const items = [...mainNav, ...(isAdmin ? [{ label: "Admin", href: "/admin" }] : [])];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(7,9,13,0.80)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-[18px] sm:px-8 lg:h-20 lg:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.08em] text-foreground"
          >
            {siteConfig.name.toUpperCase()}
          </Link>
        </motion.div>

        <motion.nav
          initial="hidden"
          animate="visible"
          variants={linkStagger}
          className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.12em] text-foreground-secondary md:flex"
          aria-label="Primary"
        >
          {items.map((item) => (
            <motion.div key={item.href} variants={linkItem}>
              <Link
                href={item.href}
                className="relative py-1 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground md:hidden"
        >
          <span className="relative block h-3 w-4">
            <span
              className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[6px] h-px w-4 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 top-[12px] h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenu}
            className="border-t border-border bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <nav
              className="flex flex-col gap-1 px-[18px] py-6 text-base uppercase tracking-[0.1em] text-foreground-secondary"
              aria-label="Mobile"
            >
              {items.map((item) => (
                <motion.div key={item.href} variants={mobileItem}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block min-h-11 py-3 transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
