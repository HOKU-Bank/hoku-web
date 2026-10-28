"use client";

import { AnimatePresence, motion, animate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Hero screen: balance + live feed of things agents just did          */
/* ------------------------------------------------------------------ */

type FeedItem = { icon: string; title: string; meta: string; amount?: string; tone: "sky" | "violet" | "magenta" | "green" };

const FEED: FeedItem[] = [
  { icon: "✓", title: "12 supplier invoices paid", meta: "Payables · on due date", amount: "−€84,210", tone: "green" },
  { icon: "↗", title: "€500K swept to treasuries", meta: "Treasuries · 2.3% yield", amount: "+€9K/yr", tone: "sky" },
  { icon: "€", title: "Invoice #2291 collected", meta: "Receivables · Berlin GmbH", amount: "+€12,400", tone: "green" },
  { icon: "◆", title: "Working-capital offer ready", meta: "Contract-to-Cash · €1.2M order", amount: "24h", tone: "magenta" },
  { icon: "⇄", title: "EUR/USD hedge placed", meta: "FX · within mandate", amount: "$340K", tone: "violet" },
  { icon: "★", title: "Matching NATO tender found", meta: "Tender Agent · bid guarantee drafted", tone: "sky" },
];

const toneClass: Record<FeedItem["tone"], string> = {
  sky: "bg-sky/20 text-sky",
  violet: "bg-violet/25 text-[#e4e6ec]",
  magenta: "bg-magenta/30 text-[#e4e6ec]",
  green: "bg-emerald-400/20 text-emerald-300",
};

function Balance() {
  const v = useMotionValue(2_398_400);
  const text = useTransform(v, (n) =>
    "€" + Math.round(n).toLocaleString("en-US"),
  );
  useEffect(() => {
    const controls = animate(v, 2_481_920, { duration: 2.4, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [v]);
  return <motion.span>{text}</motion.span>;
}

export function HeroScreen() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, []);
  const items = Array.from({ length: 4 }, (_, i) => {
    const idx = (tick + 3 - i + FEED.length * 10) % FEED.length;
    return { ...FEED[idx], key: tick - i };
  });

  return (
    <div className="flex h-full flex-col px-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/horaizon-mark.png" alt="" className="h-3.5 w-auto" />
          <span className="text-[13px] font-semibold tracking-wide">Business</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </span>
          Autopilot on
        </span>
      </div>

      <div className="mt-5">
        <p className="text-[11px] text-white/50">Total balance</p>
        <p className="mt-0.5 text-[30px] font-semibold tracking-tight tabular-nums">
          <Balance />
        </p>
        <div className="mt-3 h-12">
          <svg viewBox="0 0 240 48" className="h-full w-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 40 C 30 36, 40 30, 60 32 S 100 20, 120 24 S 160 10, 180 14 S 220 6, 240 4"
              fill="none"
              stroke="#d7dae3"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <path
              d="M0 40 C 30 36, 40 30, 60 32 S 100 20, 120 24 S 160 10, 180 14 S 220 6, 240 4 L 240 48 L 0 48 Z"
              fill="url(#spark)"
            />
          </svg>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
        {[
          ["Runway", "14 mo"],
          ["Treasuries", "2.3%"],
          ["Credit line", "€750K"],
        ].map(([k, val]) => (
          <div key={k} className="rounded-xl bg-white/[0.06] py-2">
            <p className="text-white/45">{k}</p>
            <p className="mt-0.5 text-[12px] font-semibold">{val}</p>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-4 text-[11px] font-medium text-white/50">Done for you · just now</p>
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((it) => (
            <motion.div
              key={it.key}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="mb-2 flex items-center gap-2.5 rounded-2xl bg-white/[0.06] px-3 py-2.5"
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] ${toneClass[it.tone]}`}>
                {it.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-medium">{it.title}</span>
                <span className="block truncate text-[10px] text-white/45">{it.meta}</span>
              </span>
              {it.amount && <span className="text-[11px] font-semibold tabular-nums text-white/85">{it.amount}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050507] to-transparent" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chat screen: a conversation with the Autopilot agent                */
/* ------------------------------------------------------------------ */

export type ChatMsg =
  | { from: "user"; text: string }
  | { from: "agent"; text: string }
  | { from: "card"; node: ReactNode };

function TypingDots() {
  return (
    <div className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-white/[0.08] px-3 py-2.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white/60"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function ChatScreen({ title, messages }: { title: string; messages: ChatMsg[] }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= messages.length) return;
    const next = messages[shown];
    const id = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 600 : next.from === "user" ? 1500 : 2100);
    return () => clearTimeout(id);
  }, [shown, messages]);

  const typing = shown < messages.length && messages[shown].from !== "user";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 pb-3 pt-6">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/12 ring-1 ring-white/25">
          <img src="/horaizon-mark.png" alt="" className="h-3 w-auto" />
        </span>
        <div>
          <p className="text-[12.5px] font-semibold leading-tight">Autopilot</p>
          <p className="text-[10px] leading-tight text-emerald-300/90">{title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden px-3.5 pb-8 pt-3">
        <AnimatePresence initial={false}>
          {messages.slice(0, shown).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={m.from === "user" ? "self-end" : "self-start"}
            >
              {m.from === "user" && (
                <p className="max-w-[210px] rounded-2xl rounded-br-md bg-white text-black px-3 py-2 text-[11.5px] leading-snug">
                  {m.text}
                </p>
              )}
              {m.from === "agent" && (
                <p className="max-w-[230px] rounded-2xl rounded-bl-md bg-white/[0.08] px-3 py-2 text-[11.5px] leading-snug text-white/90">
                  {m.text}
                </p>
              )}
              {m.from === "card" && <div className="w-[240px]">{m.node}</div>}
            </motion.div>
          ))}
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="self-start">
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-3 mb-6 flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-2 text-[11px] text-white/35">
        Instruct Autopilot…
        <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[10px] text-white/70">↑</span>
      </div>
    </div>
  );
}

/* Small card used inside the chat */
export function ChatCard({
  label,
  rows,
  cta,
  done,
}: {
  label: string;
  rows: [string, string][];
  cta?: string;
  done?: string;
}) {
  const [tapped, setTapped] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  // Give people time to read the card, then "tap" the button (a ripple, no
  // finger) and let the agent confirm.
  useEffect(() => {
    if (!done) return;
    const tap = setTimeout(() => setTapped(true), cta ? 2400 : 2000);
    const ok = setTimeout(() => setConfirmed(true), cta ? 3300 : 2400);
    return () => {
      clearTimeout(tap);
      clearTimeout(ok);
    };
  }, [done, cta]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#e4e6ec]">{label}</p>
      <div className="mt-2 space-y-1.5">
        {rows.map(([k, val]) => (
          <div key={k} className="flex justify-between text-[11px]">
            <span className="text-white/55">{k}</span>
            <span className="font-medium tabular-nums">{val}</span>
          </div>
        ))}
      </div>
      {(cta || done) && (
        <motion.div
          animate={tapped && cta && !confirmed ? { scale: [1, 0.95, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
          className={`relative mt-2.5 rounded-xl py-1.5 text-center text-[11px] font-semibold transition-colors duration-500 ${
            confirmed ? "bg-emerald-400/20 text-emerald-300" : cta ? "bg-white text-black" : "bg-white/10 text-white/60"
          }`}
        >
          {/* tap ripple: rings spreading like a stone dropped in water */}
          {tapped && cta && (
            <span aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
              {[0, 0.2].map((d) => (
                <motion.span
                  key={d}
                  initial={{ scale: 0, opacity: 0.7 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ duration: 0.9, delay: d, ease: "easeOut" }}
                  className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border-[1.5px] border-white/80"
                />
              ))}
              <motion.span
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-white/70"
              />
            </span>
          )}
          <span className="relative">{confirmed ? done : cta ?? "Working…"}</span>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agents screen: the roster switching on, with more on the way        */
/* ------------------------------------------------------------------ */

const AGENTS: { name: string; status: "Live" | "Next" | "Soon" }[] = [
  { name: "Payables", status: "Live" },
  { name: "Treasuries Autopilot", status: "Live" },
  { name: "Contract-to-Cash", status: "Live" },
  { name: "Runway Autopilot", status: "Live" },
  { name: "Receivables", status: "Next" },
  { name: "Tender Agent", status: "Next" },
  { name: "Dual-Use Co-pilot", status: "Soon" },
  { name: "Loan Conditions Guard", status: "Soon" },
];

export function AgentsScreen() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (on >= AGENTS.length) return;
    const id = setTimeout(() => setOn((n) => n + 1), on === 0 ? 700 : 420);
    return () => clearTimeout(id);
  }, [on]);

  return (
    <div className="flex h-full flex-col px-4 pt-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/12 ring-1 ring-white/25">
          <img src="/horaizon-mark.png" alt="" className="h-3 w-auto" />
        </span>
        <div>
          <p className="text-[12.5px] font-semibold leading-tight">Autopilot agents</p>
          <p className="text-[10px] leading-tight text-white/50">{Math.min(on, 4)} live · more joining</p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        {AGENTS.map((a, i) => {
          const active = i < on;
          return (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: active ? 1 : 0.35, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2"
            >
              <span className="text-[11.5px] font-medium">{a.name}</span>
              <span className="flex items-center gap-2">
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                    a.status === "Live" ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/55"
                  }`}
                >
                  {a.status}
                </span>
                <span className={`relative h-[18px] w-[30px] rounded-full transition-colors duration-300 ${active && a.status === "Live" ? "bg-emerald-400/80" : "bg-white/15"}`}>
                  <motion.span
                    animate={{ x: active && a.status === "Live" ? 12 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-[2px] top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow"
                  />
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: on >= AGENTS.length ? 1 : 0, y: on >= AGENTS.length ? 0 : 8 }}
        transition={{ duration: 0.5 }}
        className="mt-3 rounded-xl border border-dashed border-white/20 px-3 py-2.5 text-center text-[11px] text-white/60"
      >
        + much more coming
      </motion.div>
    </div>
  );
}
