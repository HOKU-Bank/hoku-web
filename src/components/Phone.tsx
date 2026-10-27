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
      className={`relative aspect-[9/19.2] w-[300px] rounded-[52px] bg-[linear-gradient(145deg,#9aa0b8_0%,#4b5068_18%,#2d3145_50%,#4b5068_82%,#9aa0b8_100%)] p-[3px] shadow-[0_60px_120px_-30px_rgba(30,20,90,0.9)] ${className}`}
    >
      {/* black glass border around the display */}
      <div className="h-full w-full rounded-[49px] bg-black p-[7px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="relative h-full w-full overflow-hidden rounded-[42px] bg-[#070a1c]">
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
    </div>
  );
}

// One camera lens: brushed-metal ring around dark, reflective glass.
function Lens({ x, y }: { x: number; y: number }) {
  return (
    <span
      className="absolute h-[58px] w-[58px] rounded-full p-[4px] shadow-[0_6px_14px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]"
      style={{
        left: x,
        top: y,
        background: "conic-gradient(from 210deg, #8d93ab, #3a3f52, #c9cde0, #4a4f63, #8d93ab)",
      }}
    >
      <span className="relative block h-full w-full rounded-full bg-[#05060c] p-[6px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
        <span className="relative block h-full w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_50%,#0b0f22_0%,#141b3d_45%,#05060c_70%)] ring-1 ring-white/5">
          {/* inner element + coating reflections */}
          <span className="absolute inset-[30%] rounded-full bg-[radial-gradient(circle,#1d2650,#070914)]" />
          <span className="absolute left-[18%] top-[16%] h-[26%] w-[26%] rounded-full bg-[radial-gradient(circle,rgba(160,190,255,0.55),transparent_70%)]" />
          <span className="absolute bottom-[18%] right-[20%] h-[18%] w-[18%] rounded-full bg-[radial-gradient(circle,rgba(200,110,220,0.45),transparent_70%)]" />
        </span>
      </span>
    </span>
  );
}

// The back of the phone, in the style of a Pro-model iPhone.
export function PhoneBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19.2] w-[300px] overflow-hidden rounded-[52px] bg-[linear-gradient(160deg,#3b4560_0%,#252c42_45%,#1c2135_100%)] shadow-[0_60px_120px_-30px_rgba(30,20,90,0.9),inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_0_0_7px_#2a3046] ${className}`}
    >
      {/* matte glass sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_55%_at_20%_10%,rgba(190,205,255,0.16),transparent_60%),radial-gradient(80%_50%_at_90%_95%,rgba(150,110,220,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.05)_48%,transparent_60%)]" />

      {/* camera plateau */}
      <div className="absolute left-[16px] top-[16px] h-[150px] w-[150px] rounded-[38px] bg-[linear-gradient(150deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] shadow-[0_10px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.4)] ring-1 ring-white/10">
        <Lens x={10} y={10} />
        <Lens x={10} y={82} />
        <Lens x={82} y={46} />
        {/* flash */}
        <span className="absolute left-[100px] top-[14px] h-[22px] w-[22px] rounded-full bg-[radial-gradient(circle,#fff6dc_0%,#e8d8a8_45%,#8a7f63_100%)] shadow-[inset_0_0_0_2px_rgba(0,0,0,0.25)]" />
        {/* LiDAR */}
        <span className="absolute left-[102px] top-[112px] h-[20px] w-[20px] rounded-full bg-[radial-gradient(circle,#2a2d38,#07080c)] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.08)]" />
        {/* mic */}
        <span className="absolute left-[130px] top-[76px] h-[5px] w-[5px] rounded-full bg-black/70" />
      </div>

      {/* brand */}
      <div className="absolute inset-x-0 top-[52%] flex -translate-y-1/2 flex-col items-center">
        <span
          aria-hidden
          className="block h-[84px] w-[108px]"
          style={{
            background: "linear-gradient(135deg, #f4f6ff 0%, #a9b0cc 40%, #ffffff 55%, #8e95b3 100%)",
            WebkitMask: "url(/horaizon-mark.png) center / contain no-repeat",
            mask: "url(/horaizon-mark.png) center / contain no-repeat",
            filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.35))",
          }}
        />
        <span
          aria-hidden
          className="mt-6 block h-[36px] w-[132px]"
          style={{
            background: "linear-gradient(90deg, #c9cee3, #ffffff 50%, #c9cee3)",
            WebkitMask: "url(/horaizon-wordmark.png) center / contain no-repeat",
            mask: "url(/horaizon-wordmark.png) center / contain no-repeat",
          }}
        />
        <span className="mt-2 pl-[0.62em] text-[13px] font-semibold tracking-[0.62em] text-white/75">BANK</span>
      </div>
    </div>
  );
}

const DEPTH = 26;
const LAYERS = 22;
const HEIGHT = 640; // 300px wide at 9:19.2

// Titanium rim colour for one layer of the extrusion, with the dark antenna
// bands real iPhones have near each corner.
function rimBackground(l: number) {
  const base = `hsl(228 10% ${l}%)`;
  const band = `hsl(228 12% ${Math.max(10, l - 22)}%)`;
  return `linear-gradient(180deg, transparent 0 8.4%, ${band} 8.4% 9.1%, transparent 9.1% 90.9%, ${band} 90.9% 91.6%, transparent 91.6%),
    linear-gradient(90deg, ${base} 0 20%, ${band} 20% 21.4%, ${base} 21.4% 78.6%, ${band} 78.6% 80%, ${base} 80%)`;
}

// A hardware button standing proud of the rim: an outer pill face plus the
// two small caps that show its thickness from the front and back.
function SideButton({ side, top, height, depth = 11 }: { side: "left" | "right"; top: number; height: number; depth?: number }) {
  const out = 3; // how far it sticks out of the frame
  const dir = side === "left" ? -1 : 1;
  const metal = "linear-gradient(90deg, #4f546a, #c4c9dc 45%, #eef0f8 55%, #4f546a)";
  return (
    <div
      aria-hidden
      className="absolute"
      style={{ top, height, left: side === "left" ? 0 : "100%", width: 0, transformStyle: "preserve-3d" }}
    >
      {/* outer face, perpendicular to the screen */}
      <div
        className="absolute top-0 rounded-[3px]"
        style={{
          width: depth,
          height,
          left: -depth / 2,
          background: metal,
          transform: `translateX(${dir * out}px) rotateY(${dir * 90}deg)`,
        }}
      />
      {/* front and back caps */}
      {[1, -1].map((f) => (
        <div
          key={f}
          className="absolute top-0 rounded-[2px]"
          style={{
            width: out,
            height,
            left: side === "left" ? -out : 0,
            background: "linear-gradient(180deg, #6b7088, #3a3e52 50%, #6b7088)",
            transform: `translateZ(${(f * depth) / 2}px)${f < 0 ? " rotateY(180deg)" : ""}`,
          }}
        />
      ))}
    </div>
  );
}

// Bottom edge details: USB-C port flanked by speaker and mic grilles.
function BottomEdge() {
  const holes = (n: number) =>
    Array.from({ length: n }, (_, i) => <span key={i} className="h-[4px] w-[4px] rounded-full bg-black/80" />);
  return (
    <div
      aria-hidden
      className="absolute left-1/2 flex items-center justify-center gap-[22px]"
      style={{
        top: HEIGHT,
        width: 200,
        height: DEPTH,
        marginLeft: -100,
        marginTop: -DEPTH / 2,
        transform: "translateY(0.5px) rotateX(-90deg)",
      }}
    >
      <span className="flex gap-[4px]">{holes(6)}</span>
      <span className="h-[8px] w-[30px] rounded-full bg-[#07080d] shadow-[inset_0_0_0_1.5px_#2a2e3c]" />
      <span className="flex gap-[4px]">{holes(6)}</span>
    </div>
  );
}

// A solid phone: front screen, titanium rim, buttons and back plate, all in
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
      {/* extruded rim */}
      {Array.from({ length: LAYERS }, (_, i) => {
        const z = -DEPTH / 2 + ((i + 0.5) * DEPTH) / LAYERS;
        // flat titanium sides with softly rounded front and back edges
        const t = Math.min(1, (1 - Math.abs((i + 0.5) / LAYERS - 0.5) * 2) * 3);
        const l = Math.round(26 + t * 36);
        return (
          <div
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-[52px]"
            style={{ transform: `translateZ(${z}px)`, background: rimBackground(l) }}
          />
        );
      })}

      {/* hardware buttons: Action, volume up/down on the left, side button on the right */}
      <SideButton side="left" top={112} height={30} />
      <SideButton side="left" top={166} height={58} />
      <SideButton side="left" top={236} height={58} />
      <SideButton side="right" top={186} height={94} />
      <BottomEdge />

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
