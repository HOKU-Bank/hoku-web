"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { ReactNode } from "react";

// A rendered phone frame; the screen content is passed in as children.
export function Phone({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[9/19.2] w-[300px] rounded-[52px] bg-gradient-to-b from-[#3a3f55] via-[#1b1e2c] to-[#2b2f42] p-[10px] shadow-[0_60px_120px_-30px_rgba(30,20,90,0.9),0_0_0_1px_rgba(255,255,255,0.12)_inset] ${className}`}
    >
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[120px] h-14 w-[3px] rounded-l bg-[#2b2f42]" />
      <span className="absolute -left-[3px] top-[190px] h-14 w-[3px] rounded-l bg-[#2b2f42]" />
      <span className="absolute -right-[3px] top-[160px] h-20 w-[3px] rounded-r bg-[#2b2f42]" />

      <div className="relative h-full w-full overflow-hidden rounded-[43px] bg-[#070a1c]">
        {/* screen glow */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(91,84,220,0.35),transparent_60%)]" />

        {/* status bar */}
        <div className="relative z-20 flex items-center justify-between px-7 pt-3.5 text-[11px] font-semibold text-white">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
              <rect x="0" y="6" width="3" height="4" rx="1" />
              <rect x="4.5" y="4" width="3" height="6" rx="1" />
              <rect x="9" y="2" width="3" height="8" rx="1" />
              <rect x="13" y="0" width="3" height="10" rx="1" />
            </svg>
            <span className="ml-0.5 inline-block h-[10px] w-[20px] rounded-[3px] border border-white/60 p-[1px]">
              <span className="block h-full w-[75%] rounded-[1px] bg-white" />
            </span>
          </span>
        </div>

        {/* dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-30 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

        <div className="relative z-10 h-[calc(100%-28px)]">{children}</div>

        {/* home indicator */}
        <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-[110px] -translate-x-1/2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

// The back of the phone, shown mid-turn while the screen swaps.
export function PhoneBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19.2] w-[300px] overflow-hidden rounded-[52px] bg-gradient-to-br from-[#2a2f52] via-[#141831] to-[#3a2350] shadow-[0_60px_120px_-30px_rgba(30,20,90,0.9),0_0_0_1px_rgba(255,255,255,0.14)_inset] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_50%_at_30%_20%,rgba(142,197,255,0.25),transparent_60%),radial-gradient(70%_50%_at_80%_90%,rgba(224,91,168,0.3),transparent_60%)]" />
      {/* camera module */}
      <div className="absolute left-5 top-5 grid h-[112px] w-[112px] grid-cols-2 gap-2 rounded-[30px] bg-white/[0.07] p-3 ring-1 ring-white/10 backdrop-blur">
        {[0, 1, 2].map((i) => (
          <span key={i} className="rounded-full bg-[radial-gradient(circle_at_35%_35%,#4a5280,#05060f_60%)] ring-2 ring-black/60" />
        ))}
        <span className="m-auto h-3 w-3 rounded-full bg-amber-100/70" />
      </div>
      <img
        src="/horaizon-mark.png"
        alt=""
        className="absolute left-1/2 top-1/2 h-10 w-auto -translate-x-1/2 -translate-y-1/2 opacity-90"
      />
    </div>
  );
}

const DEPTH = 26;
const LAYERS = 22;

// A solid phone: front screen, metallic extruded edge and back plate, all in
// one 3D space. Rotate any ancestor with preserve-3d and it reads as an object.
// `angle` (degrees of Y rotation) drives a moving specular glare on the glass.
export function Phone3D({
  children,
  angle,
}: {
  children: ReactNode;
  angle?: MotionValue<number>;
}) {
  return (
    <div className="relative" style={{ transformStyle: "preserve-3d" }}>
      {/* extruded edge */}
      {Array.from({ length: LAYERS }, (_, i) => {
        const z = -DEPTH / 2 + ((i + 0.5) * DEPTH) / LAYERS;
        // brighter toward the middle of the band, like a rounded metal rim
        const t = 1 - Math.abs((i + 0.5) / LAYERS - 0.5) * 2;
        const l = Math.round(28 + t * 46);
        return (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-[52px]"
            style={{
              transform: `translateZ(${z}px)`,
              background: `hsl(232 18% ${l}%)`,
            }}
          />
        );
      })}

      {/* back plate */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateZ(${-DEPTH / 2}px) rotateY(180deg)`, backfaceVisibility: "hidden" }}
      >
        <PhoneBack />
      </div>

      {/* front */}
      <div
        className="relative"
        style={{ transform: `translateZ(${DEPTH / 2}px)`, backfaceVisibility: "hidden" }}
      >
        <Phone>{children}</Phone>
        {angle && <Glare angle={angle} />}
      </div>
    </div>
  );
}

function Glare({ angle }: { angle: MotionValue<number> }) {
  const background = useTransform(angle, (a) => {
    const pos = 50 + Math.sin((a * Math.PI) / 180) * 120;
    return `linear-gradient(115deg, transparent ${pos - 30}%, rgba(255,255,255,0.13) ${pos}%, transparent ${pos + 22}%)`;
  });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-[10px] z-40 rounded-[43px] mix-blend-screen"
      style={{ background }}
    />
  );
}
