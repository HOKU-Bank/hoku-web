import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[80svh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="accent-text text-sm font-medium uppercase tracking-[0.2em]">404</p>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">This page doesn&apos;t exist.</h1>
      <p className="mt-4 text-white/60">The link may be broken, or the page may have moved.</p>
      <Link
        href="/"
        className="mt-9 inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        Back to Hoku
      </Link>
    </main>
  );
}
