"use client";

import { animate, motion, useInView, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Aurora } from "./Aurora";
import { ContactForm } from "./ContactForm";

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
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

type Bar = { label: string; value: number; display: string; strong?: boolean };

const WHY_NOW: { k: string; title: string; body: string; caption: string; bars: Bar[]; max: number }[] = [
  {
    k: "10×",
    title: "CEE credit is wide open",
    body: "Private debt in Central and Eastern Europe is a tenth of the Western European level. No institution in the region specialises in the €100k to €2M tickets technology SMEs actually need.",
    caption: "Private debt as a share of GDP",
    max: 4,
    bars: [
      { label: "Western Europe", value: 3, display: "2–4%" },
      { label: "CEE", value: 0.35, display: "0.2–0.5%", strong: true },
    ],
  },
  {
    k: "€150B",
    title: "Europe is reindustrialising",
    body: "The SAFE defence programme funds the orders. The thousands of SME suppliers who deliver them still need the working capital, guarantees and FX that only a bank provides.",
    caption: "SAFE defence loans, € billions",
    max: 150,
    bars: [
      { label: "SAFE total", value: 150, display: "€150B" },
      { label: "Poland", value: 43.7, display: "€43.7B", strong: true },
      { label: "Latvia", value: 3.49, display: "€3.5B", strong: true },
    ],
  },
  {
    k: "5%",
    title: "Payments alone don't pay",
    body: "Digital banks proved the stack but not the economics. Credit is what pays, which is why Qonto and Mercury are now chasing bank licences. We start with one.",
    caption: "Digital banks' share of EU retail banking",
    max: 20,
    bars: [
      { label: "Accounts", value: 19, display: "19%" },
      { label: "Revenue", value: 5, display: "5%", strong: true },
    ],
  },
  {
    k: "43%",
    title: "AI made underwriting cheap",
    body: "Agents handle onboarding, credit memos and AML triage for cents. Small-ticket business lending becomes profitable, and the bank runs leaner than any incumbent.",
    caption: "Cost-to-income ratio",
    max: 60,
    bars: [
      { label: "EU bank average", value: 52.3, display: "52.3%" },
      { label: "Hoku Bank, Year 5 plan", value: 43, display: "43%", strong: true },
    ],
  },
];

function BarChart({ bars, max, caption }: { bars: Bar[]; max: number; caption: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs text-white/50">{caption}</p>
      <div className="mt-4 space-y-3.5">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="flex items-baseline justify-between text-[13px]">
              <span className={b.strong ? "text-white/85" : "text-white/50"}>{b.label}</span>
              <span className={`whitespace-nowrap font-semibold tabular-nums ${b.strong ? "text-white" : "text-white/55"}`}>{b.display}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.15, ease }}
                className={`h-full rounded-full ${b.strong ? "bg-[linear-gradient(90deg,var(--accent),var(--accent-strong))]" : "bg-white/25"}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyNow() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="mt-28 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
      <div className="lg:sticky lg:top-32 lg:self-start">
        <Reveal>
          <p className="accent-text text-sm font-medium uppercase tracking-[0.2em]">Why now</p>
          <h3 className="mt-5 text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Four windows,
            <br />
            <span className="text-gradient">open at once.</span>
          </h3>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-white/60">
            An open market, fresh capital, broken incumbent economics and
            cheap AI have lined up for the first time. Each one alone would be an opening. Together
            they are the moment.
          </p>
        </Reveal>
      </div>

      <div ref={ref} className="relative space-y-6 pl-8 sm:pl-10">
        {/* progress rail */}
        <div aria-hidden className="absolute bottom-4 left-0 top-4 w-px bg-white/10">
          <motion.div style={{ height: lineH }} className="w-px bg-[linear-gradient(180deg,transparent,var(--accent-strong))] shadow-[0_0_12px_var(--accent)]" />
        </div>

        {WHY_NOW.map((w, i) => (
          <Reveal key={w.title}>
            <div className="relative">
              <span aria-hidden className="absolute -left-8 top-9 grid h-4 w-4 -translate-x-1/2 place-items-center sm:-left-10">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent-strong)] shadow-[0_0_14px_var(--accent)]" />
              </span>
              <div className="liquid-glass grid gap-6 rounded-[28px] p-7 sm:p-8 md:grid-cols-[1fr_0.95fr] md:items-center">
                <div className="relative">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                    <span className="text-5xl font-semibold tracking-[-0.045em] text-gradient">{w.k}</span>
                  </div>
                  <h4 className="mt-4 text-xl font-semibold tracking-tight">{w.title}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/60">{w.body}</p>
                </div>
                <div className="relative">
                  <BarChart bars={w.bars} max={w.max} caption={w.caption} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Vision() {
  return (
    <section id="vision" className="relative overflow-x-clip px-6 py-36">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[640px] rounded-full bg-[var(--orb)] blur-[130px]" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-end">
          <Reveal>
            <p className="accent-text text-sm font-medium uppercase tracking-[0.2em]">Our vision</p>
            <h2 className="mt-5 text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.045em]">
              Europe doesn&apos;t lack innovation.
              <br />
              <span className="text-gradient">It lacks a bank built for it.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-white/65">
              Technology SMEs are too big for a neobank, too small for a debt
              fund and too asset-light for a traditional bank. We are building
              the licensed European bank that finances them on live data, run by
              AI agents from day one.
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-[-0.04em] text-gradient">€39B</span>
              <span className="text-sm text-white/55">SME financing gap in Europe, every year</span>
            </div>
          </Reveal>
        </div>

        <WhyNow />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const ICONS: Record<string, React.ReactNode> = {
  Banking: (
    <path d="M3 10.5 12 5l9 5.5M5 10.5V18m4.67-7.5V18m4.66-7.5V18M19 10.5V18M3.5 19.5h17" />
  ),
  Credit: <path d="M4 17.5 9.5 12l3.5 3.5L20 8.5M14.5 8.5H20V14" />,
  Autopilot: (
    <path d="M12 3.5v3m0 11v3m8.5-8.5h-3m-11 0h-3m14.01-6.01-2.12 2.12M7.61 16.39l-2.12 2.12m13.02 0-2.12-2.12M7.61 7.61 5.49 5.49M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
  ),
};

const PILLARS = [
  {
    tag: "Banking",
    title: "Accounts, payments & treasuries",
    points: ["Business accounts & IBANs", "SEPA Instant & multi-currency", "Cards with spend controls", "Yield on idle cash"],
    chip: "Free account · live the same day",
  },
  {
    tag: "Credit",
    title: "Capital underwritten on live data",
    points: ["SME growth loans", "Venture debt", "Guarantees & FX hedging", "Decisions from your ledger, not property"],
    chip: "Credit from our own balance sheet",
  },
  {
    tag: "Autopilot",
    title: "Agents that act within your mandate",
    points: ["Payables & receivables", "Contract-to-Cash & Runway", "Tender Agent & Grant Bridge", "Loan Conditions Guard"],
    chip: "100+ agents planned · working 24/7",
  },
];

export function Platform() {
  return (
    <section id="platform" className="relative overflow-hidden px-6 py-36">
      {/* light behind the glass */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--orb)] opacity-70 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="accent-text text-sm font-medium uppercase tracking-[0.2em]">One account</p>
          <h2 className="mt-5 text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1] tracking-[-0.045em]">
            Banking and credit,
            <br />
            <span className="text-gradient">finally in one place.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            Built for the technology SMEs and venture-backed startups that are too
            big for a neobank and too asset-light for a traditional bank.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.tag} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                className="liquid-glass group flex h-full flex-col overflow-hidden rounded-[32px] p-8 sm:p-9"
              >
                <div className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                    <svg viewBox="0 0 24 24" className="accent-text h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {ICONS[p.tag]}
                    </svg>
                  </span>
                  <span className="font-mono text-xs text-white/40">0{i + 1}</span>
                </div>
                <p className="accent-text relative mt-8 text-sm font-medium uppercase tracking-[0.18em]">{p.tag}</p>
                <h3 className="relative mt-3 text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em]">{p.title}</h3>
                <ul className="relative mt-8 space-y-3.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-3 text-[15px] text-white/80">
                      <span className="accent-pill grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px]">✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <p className="relative mt-auto pt-10 text-sm text-white/55">
                  <span className="inline-block rounded-full border border-white/12 bg-black/25 px-3.5 py-1.5">{p.chip}</span>
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="liquid-glass mt-6 grid gap-6 rounded-[28px] p-8 sm:grid-cols-3">
            {[
              ["People own control", "Limits are enforced outside the AI model."],
              ["Every action logged", "Any agent can be paused at any moment."],
              ["Shadow mode first", "Agents prove themselves before they act."],
            ].map(([t, d]) => (
              <div key={t} className="relative">
                <p className="text-lg font-medium">{t}</p>
                <p className="mt-1 text-sm text-white/55">{d}</p>
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
  { name: "Maciej Jarząb", role: "Co-founder & CEO", photo: "/team/jarzab.jpg", bio: "Founded and sold Braight, AI credit scoring for 3 of Poland's 5 largest banks. Forbes 30 Under 30." },
  { name: "Tomasz Sekutowicz", role: "Co-founder & COO", photo: "/team/sekutowicz.jpg", bio: "Nearly 30 years in payments. Built the FUPS EMI licence in Vilnius; ex-Tietoevry Banking." },
  { name: "Maciej Żukowski", role: "CFO", photo: "/team/zukowski.jpg", bio: "Ex-Director of Tax at PKO BP, ex-President of PKO Finance AB, ex-Ministry of Finance." },
  { name: "Tomasz Mielnicki", role: "CCO", photo: "/team/mielnicki.jpg", bio: "20 years in bank compliance. Chairs the Polish Bank Association's identification group." },
];

export function Team() {
  return (
    <section id="team" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="accent-text text-sm font-medium uppercase tracking-[0.2em]">Team</p>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            100+ years of banking,{" "}
            <span className="text-gradient">led by founders who scaled credit tech.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <div className="glass group h-full rounded-3xl p-3">
                <div data-theme="dark" className="relative aspect-[4/5] overflow-hidden rounded-2xl text-white">
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f]/80 via-transparent to-transparent" />
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
    <section id="contact" className="relative isolate overflow-hidden px-6 py-40">
      <Aurora />
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          The bank Europe&apos;s
          <br />
          <span className="text-gradient">innovators deserve.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-white/60">
          We&apos;re building it now. Investors and partners, talk to the
          founders directly.
        </p>
        <ContactForm />
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-14 text-sm text-white/45">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-md">
          <img src="/brand/hoku-bank-logo-dark.svg" alt="Hoku Bank" className="h-14 w-auto opacity-90" />
          <p className="mt-5 leading-relaxed">
            Hoku Bank is preparing an application for a credit institution licence
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
        © 2026 Hoku Group, Warsaw, Poland.
      </p>
    </footer>
  );
}
