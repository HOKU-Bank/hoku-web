"use client";

import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { Phone3D } from "./Phone";
import { ChatCard, ChatScreen, type ChatMsg } from "./screens";

type Scene = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  stat: [string, string];
  chatTitle: string;
  messages: ChatMsg[];
};

const SCENES: Scene[] = [
  {
    id: "payables",
    eyebrow: "Payables",
    title: "Invoices pay themselves.",
    body: "Autopilot matches every invoice, verifies the payee and pays on the due date. Never early, never late, always inside your approval rules.",
    stat: ["€13.5K", "saved a year at 200 invoices a month"],
    chatTitle: "Payables · active",
    messages: [
      { from: "user", text: "Pay this week's supplier invoices." },
      { from: "agent", text: "Found 12 approved invoices. All payees verified and within your mandate." },
      {
        from: "card",
        node: (
          <ChatCard
            label="Payment run · Friday"
            rows={[
              ["Invoices", "12"],
              ["Total", "€84,210.00"],
              ["Rail", "SEPA Instant"],
            ]}
            cta="Approve run"
            done="✓ Paid on due dates"
          />
        ),
      },
    ],
  },
  {
    id: "treasuries",
    eyebrow: "Treasuries Autopilot",
    title: "Idle cash goes to work.",
    body: "Anything above your operating buffer is swept into treasuries and hedged, then pulled back the moment you need it.",
    stat: ["€9K", "earned a year on €500K of surplus cash"],
    chatTitle: "Treasuries · active",
    messages: [
      { from: "agent", text: "Your balance is €500K above the buffer you set." },
      {
        from: "card",
        node: (
          <ChatCard
            label="Sweep to treasuries"
            rows={[
              ["Amount", "€500,000"],
              ["Yield", "2.3% p.a."],
              ["Liquidity", "Same day"],
            ]}
            done="✓ Swept · earning ~€9K/yr"
          />
        ),
      },
      { from: "user", text: "Keep €200K liquid for payroll." },
      { from: "agent", text: "Done. Buffer updated, I'll sweep around it from now on." },
    ],
  },
  {
    id: "contract",
    eyebrow: "Contract-to-Cash",
    title: "An order becomes capital.",
    body: "Win a contract and Autopilot turns it into a working-capital facility, a guarantee and an FX hedge, inside pre-approved limits.",
    stat: ["24h", "from order to facility"],
    chatTitle: "Contract-to-Cash · active",
    messages: [
      { from: "user", text: "We just won a €1.2M order from a German defence contractor." },
      { from: "agent", text: "Congratulations. Based on your ledger, here's what I can unlock today:" },
      {
        from: "card",
        node: (
          <ChatCard
            label="Financing offer"
            rows={[
              ["Working capital", "€400,000"],
              ["Performance guarantee", "€120,000"],
              ["FX hedge", "EUR/USD"],
            ]}
            cta="Review offer"
            done="✓ Facility live in 24h"
          />
        ),
      },
    ],
  },
  {
    id: "runway",
    eyebrow: "Runway Autopilot",
    title: "Capital, before you ask.",
    body: "When runway drops below the threshold you set, a pre-assessed venture debt offer is already waiting to bridge you to the next round.",
    stat: ["9 mo", "runway trigger, set by you"],
    chatTitle: "Runway · monitoring",
    messages: [
      { from: "agent", text: "Heads up: runway just dropped to 9 months, your trigger." },
      { from: "agent", text: "I've prepared a venture debt offer to bridge you to Series A:" },
      {
        from: "card",
        node: (
          <ChatCard
            label="Venture debt · pre-assessed"
            rows={[
              ["Amount", "€750,000"],
              ["Term", "36 months"],
              ["Runway after", "+7 months"],
            ]}
            cta="Accept & draw"
            done="✓ Offer accepted"
          />
        ),
      },
    ],
  },
];

function SceneText({ scene, index }: { scene: Scene; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  return (
    <div ref={ref} className="flex min-h-[85vh] flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-sm font-medium text-[#b4a8ff]">
          <span className="mr-3 font-mono text-white/35">0{index + 1}</span>
          {scene.eyebrow}
        </p>
        <h3 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">{scene.title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">{scene.body}</p>
        <div className="mt-8 flex items-baseline gap-3 border-t border-white/10 pt-6">
          <span className="text-3xl font-semibold tracking-tight text-gradient">{scene.stat[0]}</span>
          <span className="text-sm text-white/50">{scene.stat[1]}</span>
        </div>
      </motion.div>

      {/* mobile: each scene carries its own phone */}
      <div className="mt-12 flex justify-center [perspective:1400px] lg:hidden">
        <motion.div
          initial={{ rotateY: -50, rotateX: 12 }}
          whileInView={{ rotateY: -12, rotateX: 5 }}
          viewport={{ amount: 0.4 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="scale-[0.92]"
        >
          <Phone3D>
            {inView || index === 0 ? <ChatScreen title={scene.chatTitle} messages={scene.messages} /> : null}
          </Phone3D>
        </motion.div>
      </div>
    </div>
  );
}

const GLOWS = ["#3b4cc0", "#2a6fb0", "#7a4fd6", "#b04a90"];

// Desktop: a sticky phone that turns a full revolution between scenes.
// The screen swaps while its back is facing the viewer.
function SpinningPhone({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const n = SCENES.length;
  const input: number[] = [];
  const output: number[] = [];
  for (let i = 0; i < n; i++) {
    const start = i / n;
    const end = (i + 1) / n;
    input.push(i === 0 ? 0 : start + 0.06, i === n - 1 ? 1 : end - 0.06);
    output.push(i * 360, i * 360);
  }
  const raw = useTransform(progress, input, output);
  const rotateY = useSpring(raw, { stiffness: 70, damping: 18, mass: 0.6 });
  // lean back and shrink a touch while turning
  const turn = useTransform(rotateY, (a) => Math.abs(Math.sin((a * Math.PI) / 360)));
  const rotateX = useTransform(turn, [0, 1], [4, 14]);
  const scale = useTransform(turn, [0, 1], [1, 0.86]);
  const rotateZ = useTransform(progress, [0, 1], [-3, 3]);
  const orbit = useTransform(rotateY, (a) => a / 4);
  // rest a little turned so the phone's thickness stays visible
  const displayY = useTransform(rotateY, (a) => a - 24);
  const lift = useTransform(turn, [0, 1], [0, -30]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(rotateY, "change", (a) => {
    const idx = Math.min(n - 1, Math.max(0, Math.floor((a + 180) / 360)));
    setActive((cur) => (cur === idx ? cur : idx));
  });

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] transition-[background] duration-1000"
        style={{ background: `radial-gradient(closest-side, ${GLOWS[active]}, transparent)` }}
      />
      {/* orbit ring */}
      <motion.div
        aria-hidden
        style={{ rotateZ: orbit }}
        className="absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
      />

      <div className="[perspective:1600px]">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            style={{ rotateY: displayY, rotateX, rotateZ, scale, y: lift, transformStyle: "preserve-3d" }}
            className="relative"
          >
            <Phone3D angle={displayY}>
              <ChatScreen key={active} title={SCENES[active].chatTitle} messages={SCENES[active].messages} />
            </Phone3D>
          </motion.div>
        </motion.div>
      </div>

      {/* progress rail */}
      <div className="absolute -left-20 top-1/2 flex -translate-y-1/2 flex-col gap-3">
        {SCENES.map((s, i) => (
          <span
            key={s.id}
            className={`block w-1 rounded-full transition-all duration-500 ${i === active ? "h-10 bg-white" : "h-4 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function AgentStory() {
  const scenesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scenesRef, offset: ["start center", "end center"] });

  return (
    <section id="autopilot" className="relative py-32">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/45">Horaizon Autopilot</p>
          <h2 className="mt-5 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Your finance back office,{" "}
            <span className="font-serif font-normal italic text-gradient">on autopilot.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Tell it what you want in plain language. Agents act 24/7 within the
            mandate your CFO sets once, and every action is logged.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div ref={scenesRef}>
            {SCENES.map((s, i) => (
              <SceneText key={s.id} scene={s} index={i} />
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center">
              <SpinningPhone progress={scrollYProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
