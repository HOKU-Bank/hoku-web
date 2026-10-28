import type { ReactNode } from "react";

// The phone's display: status bar, Dynamic Island and home indicator around
// live content. It is drawn onto the 3D model's screen (see PhoneModel), so it
// has no frame of its own. Always dark, whatever the page theme.
export function Screen({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="dark"
      className="relative h-[640px] w-[300px] overflow-hidden rounded-[40px] bg-[#050507] text-white"
    >
      {/* screen glow */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]" />

      {/* status bar */}
      <div className="relative z-20 flex items-center justify-between px-8 pt-4 text-[11px] font-semibold">
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
      <div className="absolute left-1/2 top-3 z-30 h-[27px] w-[94px] -translate-x-1/2 rounded-full bg-black" />

      <div className="relative z-10 h-[calc(100%-32px)] px-1">{children}</div>

      {/* home indicator */}
      <div className="absolute bottom-2 left-1/2 z-20 h-[4px] w-[110px] -translate-x-1/2 rounded-full bg-white/70" />

      {/* glass reflection */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.07)_42%,transparent_55%)]" />
    </div>
  );
}
