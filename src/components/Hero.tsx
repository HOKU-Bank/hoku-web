"use client";

import { Phone3D } from "./Phone3D";
import { animate, motion, useMotionValue, useSpring, useTransform, useScroll, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { Aurora } from "./Aurora";
import { Screen } from "./Phone";
import { HeroScreen } from "./screens";

const ease = [0.16, 1, 0.3, 1] as const;

function Chip({
  children,
  className,
  delay,
  float,
  depth,
  mx,
  my,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
  float: number;
  /** parallax strength in px; chips "nearer" the viewer move more */
  depth: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(my, [-0.5, 0.5], [-depth * 0.6, depth * 0.6]);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.9, ease }}
      className={`absolute z-30 ${className}`}
      style={{ x, y }}
    >
      <motion.div
        animate={{ y: [0, -float, 0] }}
        transition={{ duration: 5 + float / 4, repeat: Infinity, ease: "easeInOut" }}
        className="glass rounded-2xl px-4 py-3 text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 90, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), { stiffness: 90, damping: 18 });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scrollRotY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const scrollRotX = useTransform(scrollYProgress, [0, 1], [0, 28]);
  // resting pose is turned slightly so the phone's depth is always visible
  // entrance: the phone swings in from the side
  const intro = useMotionValue(-80);
  useEffect(() => {
    const c = animate(intro, 0, { duration: 1.8, ease, delay: 0.2 });
    return () => c.stop();
  }, [intro]);
  const stageRotY = useTransform([ry, scrollRotY, intro], ([a, b, c]: number[]) => -22 + a + b + c);
  const stageRotX = useTransform([rx, scrollRotX, intro], ([a, b, c]: number[]) => 6 + a + b - c * 0.25);
  const lift = useTransform(intro, [-80, 0], [-1.2, 0]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative isolate min-h-[100svh] overflow-hidden pt-32 lg:pt-28"
    >
      <Aurora />
      {/* perspective grid floor */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[45vh] [perspective:600px]">
        <div
          className="absolute inset-x-[-50%] bottom-[-20%] h-[160%] origin-bottom overflow-hidden [transform:rotateX(62deg)]"
          style={{
            maskImage: "linear-gradient(to top, black 10%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 80%)",
          }}
        >
          <div
            className="absolute inset-x-0 -top-16 bottom-0 will-change-transform"
            style={{
              backgroundImage:
                "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              animation: "grid-move 6s linear infinite",
            }}
          />
        </div>
      </div>
      {/* horizon line */}
      <div className="absolute inset-x-0 bottom-[-55vw] -z-10 mx-auto h-[80vw] w-[140vw] -translate-x-[14vw] rounded-[100%] border-t border-white/20 bg-[radial-gradient(ellipse_at_top,var(--orb),transparent_60%)]" />

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-6"
      >
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-white/80 lg:mx-0"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            Building the European Innovation Bank
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease }}
            className="mt-7 text-[clamp(2.75rem,7vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.045em]"
          >
            Banking that
            <br />
            <span className="text-gradient">
              runs itself.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease }}
            className="mx-auto mt-7 max-w-md text-lg leading-relaxed text-white/65 lg:mx-0"
          >
            Agentic banking and credit for Europe&apos;s innovators. Set the
            mandate once. Autopilot pays, collects, invests and finds you
            capital, around the clock.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#contact"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Get in touch
              <span className="transition group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#autopilot"
              className="inline-flex h-12 items-center rounded-full px-6 text-sm font-medium text-white/80 transition hover:text-white"
            >
              See Autopilot at work
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ y: phoneY }}
          className="relative mx-auto h-[660px] w-full max-w-[520px]">
          <Phone3D
            className="absolute inset-x-[-15%] inset-y-0"
            cameraZ={8.6}
            motion={{ rotateX: stageRotX, rotateY: stageRotY, lift }}
            screen={
              <Screen>
                <HeroScreen />
              </Screen>
            }
          />

          <Chip className="-left-40 top-16 hidden xl:block" depth={18} mx={mx} my={my} delay={1.3} float={10}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/50">Runway Autopilot</p>
            <p className="mt-1 text-sm font-medium">Venture debt offer ready</p>
            <p className="text-xs text-white/50">before you had to ask</p>
          </Chip>
          <Chip className="-right-16 top-72 hidden sm:block" depth={26} mx={mx} my={my} delay={1.6} float={14}>
            <p className="text-2xl font-semibold tracking-tight">24h</p>
            <p className="text-xs text-white/55">order → facility</p>
          </Chip>
          <Chip className="-left-32 bottom-28 hidden sm:block" depth={12} mx={mx} my={my} delay={1.9} float={8}>
            <p className="flex items-center gap-2 text-sm font-medium">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/20 text-[10px] text-emerald-300">✓</span>
              Within your mandate
            </p>
          </Chip>

          {/* phone shadow on the "floor" */}
          <motion.div
            animate={{ scale: [1, 0.85, 1], opacity: [0.6, 0.35, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/2 h-10 w-72 -translate-x-1/2 rounded-[100%] bg-[rgba(0,0,0,0.55)] blur-2xl"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
