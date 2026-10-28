"use client";

import { motion } from "motion/react";
import { useSyncExternalStore } from "react";

export const THEMES = [
  { id: "dark", label: "Dark", swatch: "linear-gradient(135deg,#2c2f5a,#06060b 60%)" },
  { id: "light", label: "Light", swatch: "linear-gradient(135deg,#fffaf2,#ecd3b8)" },
  { id: "aurora", label: "Aurora", swatch: "linear-gradient(135deg,#3d55e0,#8a5cf0 55%,#d45aa8)" },
  { id: "deck", label: "Deck", swatch: "linear-gradient(135deg,#375b67,#0d2d51 50%,#8ad1c9)" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

// Runs before first paint (inlined in <head>) so the page never flashes the
// wrong theme. ?theme=light in the URL wins over the remembered choice.
export const themeBootScript = `(function(){try{var ok=${JSON.stringify(
  THEMES.map((t) => t.id),
)};var q=new URLSearchParams(location.search).get('theme');var s=null;try{s=localStorage.getItem('horaizon-theme')}catch(e){}var t=ok.indexOf(q)>-1?q:ok.indexOf(s)>-1?s:'dark';document.documentElement.dataset.theme=t;}catch(e){}})();`;

// The theme lives on <html data-theme>; watch it so the pill stays in sync.
function subscribe(onChange: () => void) {
  const obs = new MutationObserver(onChange);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}
const readTheme = () => (document.documentElement.getAttribute("data-theme") ?? "dark") as ThemeId;

// Floating pill for flipping between colour directions while we decide.
export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as ThemeId);

  function choose(id: ThemeId) {
    document.documentElement.setAttribute("data-theme", id);
    try {
      localStorage.setItem("horaizon-theme", id);
    } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("theme", id);
    window.history.replaceState(null, "", url);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="glass fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full p-1 text-xs sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      role="radiogroup"
      aria-label="Colour theme"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          role="radio"
          aria-checked={theme === t.id}
          onClick={() => choose(t.id)}
          className={`relative flex h-8 items-center gap-2 rounded-full px-3 font-medium transition ${
            theme === t.id ? "text-black" : "text-white/70 hover:text-white"
          }`}
        >
          {theme === t.id && (
            <motion.span
              layoutId="theme-pill"
              className="absolute inset-0 rounded-full bg-white"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: t.swatch }} />
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </motion.div>
  );
}
