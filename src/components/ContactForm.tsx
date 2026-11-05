"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

// Supabase project that stores contact requests. The publishable key is
// public by design: the table only accepts inserts (RLS), nobody can read it.
const SUPABASE_URL = "https://qubepslsvdxwkkihicmo.supabase.co";
const SUPABASE_KEY = "sb_publishable_gcLU2auUlyQo1wpi7tFOAA_gsHxnZ7D";

type Status = "idle" | "sending" | "done" | "error";

const ROLES = [
  ["investor", "Investor"],
  ["partner", "Partner"],
  ["press", "Press"],
  ["other", "Other"],
] as const;

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/35 outline-none transition focus:border-[#e4e6ec]/60 focus:bg-white/[0.07] focus:ring-4 focus:ring-[#ffffff]/15";

// A short, direct line to the founders for investors and partners.
export function ContactForm() {
  const [role, setRole] = useState<string>("investor");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError("");
    setStatus("sending");

    const row = {
      name: String(form.get("name")).trim(),
      email: String(form.get("email")).trim().toLowerCase(),
      organisation: String(form.get("organisation") ?? "").trim() || null,
      role,
      message: String(form.get("message") ?? "").trim() || null,
      consent: form.get("consent") === "on",
      source: "website",
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error(String(res.status));
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
            <p className="mt-6 text-2xl font-semibold tracking-tight">Thank you.</p>
            <p className="mt-2 max-w-sm text-white/55">
              One of the founders will get back to you personally.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0, scale: 0.98 }} className="space-y-4">
            <fieldset>
              <legend className="mb-1.5 text-sm text-white/60">I&apos;m reaching out as</legend>
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 sm:grid-cols-4">
                {ROLES.map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRole(val)}
                    aria-pressed={role === val}
                    className={`relative h-10 rounded-lg text-sm font-medium transition ${
                      role === val ? "text-black" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {role === val && (
                      <motion.span
                        layoutId="role-pill"
                        className="absolute inset-0 rounded-lg bg-white"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm text-white/60">Name</span>
                <input name="name" required maxLength={120} autoComplete="name" placeholder="Jane Kowalska" className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-white/60">E-mail</span>
                <input name="email" type="email" required maxLength={254} autoComplete="email" placeholder="jane@fund.eu" className={inputClass} />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm text-white/60">Organisation</span>
              <input name="organisation" maxLength={160} autoComplete="organization" placeholder="Fund, company or publication" className={inputClass} />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm text-white/60">Message</span>
              <textarea
                name="message"
                maxLength={2000}
                rows={4}
                placeholder="A few words on what you'd like to discuss"
                className={`${inputClass} h-auto resize-none py-3`}
              />
            </label>

            <label className="flex items-start gap-3 pt-1 text-[13px] leading-relaxed text-white/50">
              <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-white" />
              <span>
                I agree that Hoku Bank may store my details to reply to this message. See our{" "}
                <Link href="/privacy" className="text-white/75 underline underline-offset-2 hover:text-white">
                  privacy policy
                </Link>
                .
              </span>
            </label>

            {error && <p className="text-sm text-[#ff9d9d]">{error}</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Get in touch"}
              <span className="transition group-hover:translate-x-0.5">→</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
