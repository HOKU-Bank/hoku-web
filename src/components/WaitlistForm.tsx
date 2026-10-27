"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

// Supabase project that stores sign-ups. The publishable key is public by
// design: the table only accepts inserts (RLS), nobody can read it back.
const SUPABASE_URL = "https://qubepslsvdxwkkihicmo.supabase.co";
const SUPABASE_KEY = "sb_publishable_gcLU2auUlyQo1wpi7tFOAA_gsHxnZ7D";

type Status = "idle" | "sending" | "done" | "error";

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/35 outline-none transition focus:border-[#b4a8ff]/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#8b7cff]/15";

export function WaitlistForm() {
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (hasBusiness === null) {
      setError("Let us know whether you run a business.");
      return;
    }
    setError("");
    setStatus("sending");

    const row = {
      name: String(form.get("name")).trim(),
      email: String(form.get("email")).trim().toLowerCase(),
      has_business: hasBusiness,
      company: hasBusiness ? String(form.get("company") ?? "").trim() || null : null,
      consent: form.get("consent") === "on",
      source: "website",
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      });
      // 409 = this e-mail is already on the list, which is fine
      if (!res.ok && res.status !== 409) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again in a moment.");
    }
  }

  return (
    <div className="glass relative mx-auto mt-12 w-full max-w-xl overflow-hidden rounded-[28px] p-6 text-left sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center py-10 text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
              className="grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15 text-2xl text-emerald-300"
            >
              ✓
            </motion.span>
            <p className="mt-6 text-2xl font-semibold tracking-tight">You&apos;re on the list.</p>
            <p className="mt-2 max-w-sm text-white/55">
              We&apos;ll be in touch as soon as early access opens.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-white/60">Name</span>
                <input name="name" required maxLength={120} autoComplete="name" placeholder="Jane Kowalska" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-white/60">Work e-mail</span>
                <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="jane@company.eu" className={inputClass} />
              </label>
            </div>

            <fieldset>
              <legend className="mb-1.5 text-sm text-white/60">Do you run a business?</legend>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                {[
                  [true, "Yes, I do"],
                  [false, "Not yet"],
                ].map(([val, label]) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => setHasBusiness(val as boolean)}
                    aria-pressed={hasBusiness === val}
                    className={`relative h-10 rounded-lg text-sm font-medium transition ${
                      hasBusiness === val ? "text-[#0a1030]" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {hasBusiness === val && (
                      <motion.span
                        layoutId="biz-pill"
                        className="absolute inset-0 rounded-lg bg-white"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{label as string}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <AnimatePresence initial={false}>
              {hasBusiness && (
                <motion.label
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="block overflow-hidden"
                >
                  <span className="mb-1.5 block pt-0.5 text-sm text-white/60">Company name</span>
                  <input name="company" maxLength={160} autoComplete="organization" placeholder="Acme Robotics" className={inputClass} />
                </motion.label>
              )}
            </AnimatePresence>

            <label className="flex items-start gap-3 pt-1 text-[13px] leading-relaxed text-white/50">
              <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#8b7cff]" />
              <span>
                I agree that Horaizon may store my details to contact me about early access. See our{" "}
                <Link href="/privacy" className="text-white/75 underline underline-offset-2 hover:text-white">
                  privacy policy
                </Link>
                .
              </span>
            </label>

            {error && <p className="text-sm text-[#ffb3dc]">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-[#0a1030] transition hover:bg-white/90 disabled:opacity-60"
            >
              {status === "sending" ? "Joining…" : "Get early access"}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
