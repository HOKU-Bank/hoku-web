"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Aurora } from "./Aurora";

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const text = useTransform(v, (n) => prefix + n.toFixed(decimals) + suffix);
  useEffect(() => {
    if (!inView) return;
    const c = animate(v, to, { duration: 1.8, ease });
    return () => c.stop();
  }, [inView, to, v]);
  return <motion.span ref={ref}>{text}</motion.span>;
}

export function Stats() {
  const stats = [
    { node: <Counter to={13.5} prefix="€" suffix="K" decimals={1} />, label: "saved a year on 200 supplier invoices a month" },
    { node: <Counter to={9} prefix="€" suffix="K" />, label: "earned a year on €500K of surplus cash" },
    { node: <Counter to={24} suffix="h" />, label: "from a new order to a credit facility" },
    { node: <>24/7</>, label: "agents working within your mandate" },
  ];
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className="bg-ink p-8 sm:p-10">
            <p className="text-4xl font-semibold tracking-[-0.04em] text-gradient sm:text-5xl">{s.node}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const PILLARS = [
  {
    tag: "Banking",
    title: "Accounts, payments & treasuries",
    points: ["Business accounts & IBANs", "SEPA Instant & multi-currency", "Cards with spend controls", "Yield on idle cash"],
    accent: "from-sky/40",
  },
  {
    tag: "Credit",
    title: "Capital underwritten on live data",
    points: ["SME growth loans", "Venture debt", "Guarantees & FX hedging", "Decisions from your ledger, not property"],
    accent: "from-violet/50",
  },
  {
    tag: "Autopilot",
    title: "Agents that act within your mandate",
    points: ["Payables & receivables", "Contract-to-Cash & Runway", "Tender Agent & Grant Bridge", "Loan Conditions Guard"],
    accent: "from-magenta/45",
  },
];

export function Platform() {
  return (
    <section id="platform" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">One account</p>
          <h2 className="mt-5 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Banking and credit,{" "}
            <span className="font-serif font-normal italic text-gradient">finally in one place.</span>
          </h2>
          <p className="mt-6 text-lg text-white/60">
            Built for the technology SMEs and venture-backed startups that are too
            big for a neobank and too asset-light for a traditional bank.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.tag} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="glass group relative h-full overflow-hidden rounded-3xl p-8"
              >
                <div className={`absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${p.accent} to-transparent opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />
                <p className="relative font-mono text-xs uppercase tracking-[0.18em] text-white/50">0{i + 1} — {p.tag}</p>
                <h3 className="relative mt-6 text-2xl font-semibold tracking-tight">{p.title}</h3>
                <ul className="relative mt-8 space-y-3">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-[15px] text-white/70">
                      <span className="h-1 w-1 rounded-full bg-white/60" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-5 grid gap-5 rounded-3xl border border-white/10 p-8 sm:grid-cols-3">
            {[
              ["People own control", "Limits are enforced outside the AI model."],
              ["Every action logged", "Any agent can be paused at any moment."],
              ["Shadow mode first", "Agents prove themselves before they act."],
            ].map(([t, d]) => (
              <div key={t}>
                <p className="font-medium">{t}</p>
                <p className="mt-1 text-sm text-white/50">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const TEAM = [
  { name: "Maciej Jarząb", role: "CEO", photo: "/team/jarzab.jpg", bio: "Founded and sold Braight, AI credit scoring for 3 of Poland's 5 largest banks. Forbes 30 Under 30." },
  { name: "Tomasz Sekutowicz", role: "COO", photo: "/team/sekutowicz.jpg", bio: "Nearly 30 years in payments. Built the FUPS EMI licence in Vilnius; ex-Tietoevry Banking." },
  { name: "Maciej Żukowski", role: "CFO", photo: "/team/zukowski.jpg", bio: "Ex-Director of Tax at PKO BP, ex-President of PKO Finance AB, ex-Ministry of Finance." },
  { name: "Tomasz Mielnicki", role: "CCO", photo: "/team/mielnicki.jpg", bio: "20 years in bank compliance. Chairs the Polish Bank Association's identification group." },
];

export function Team() {
  return (
    <section id="team" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">Team</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            100+ years of banking,{" "}
            <span className="font-serif font-normal italic text-gradient">led by founders who scaled credit tech.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="glass group h-full rounded-3xl p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1030]/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
                    {m.role}
                  </span>
                </div>
                <div className="px-2 pb-3 pt-4">
                  <p className="text-lg font-semibold tracking-tight">{m.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{m.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const CONTACT = "m.jarzab@horaizonlabs.com";

export function Access() {
  return (
    <section id="access" className="relative isolate overflow-hidden px-6 py-40">
      <Aurora />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          The bank Europe&apos;s
          <br />
          <span className="font-serif font-normal italic text-gradient">innovators deserve.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
          We&apos;re building it now. Be among the first companies on Horaizon.
        </p>
        <a
          href={`mailto:${CONTACT}?subject=Horaizon%20early%20access`}
          className="group mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#0a1030] transition hover:bg-white/90"
        >
          Get early access
          <span className="transition group-hover:translate-x-0.5">→</span>
        </a>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-14 text-sm text-white/45">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-md">
          <img src="/horaizon-logo.png" alt="Horaizon" className="h-4 w-auto opacity-80" />
          <p className="mt-5 leading-relaxed">
            Horaizon is preparing an application for a credit institution licence
            and does not currently provide banking or other regulated services.
          </p>
        </div>
        <div className="flex gap-16">
          <div className="space-y-2">
            <p className="text-white/70">Company</p>
            <a href="#team" className="block hover:text-white">Team</a>
            <a href={`mailto:${CONTACT}`} className="block hover:text-white">Contact</a>
          </div>
          <div className="space-y-2">
            <p className="text-white/70">Legal</p>
            <a href="/privacy" className="block hover:text-white">Privacy policy</a>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl text-xs text-white/30">
        © 2026 Horaizon Group, Warsaw, Poland.
      </p>
    </footer>
  );
}
