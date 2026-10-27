"use client";

import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled ? "glass" : "border border-transparent"
        }`}
      >
        <a href="#" aria-label="Horaizon home">
          <img src="/horaizon-logo.png" alt="Horaizon" className="h-[18px] w-auto" />
        </a>
        <div className="hidden items-center gap-8 text-sm text-white/65 md:flex">
          <a href="#autopilot" className="transition hover:text-white">Autopilot</a>
          <a href="#platform" className="transition hover:text-white">Platform</a>
          <a href="#team" className="transition hover:text-white">Team</a>
        </div>
        <a
          href="#access"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0a1030] transition hover:bg-white/90"
        >
          Early access
        </a>
      </nav>
    </motion.header>
  );
}
