import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy | Horaizon",
};

// TODO: replace with the final policy approved by legal (controller details, KRS, DPO contact).
export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-32 text-white/70">
      <Link href="/" className="text-sm text-white/45 hover:text-white">← Back</Link>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white">Privacy policy</h1>
      <div className="mt-8 space-y-5 leading-relaxed">
        <p>
          The controller of personal data processed through this website is
          Horaizon Group, Warsaw, Poland.
        </p>
        <p>
          This website does not use tracking cookies. If you contact us by e-mail,
          we process your name, e-mail address and the content of your message
          solely to respond to your enquiry (Art. 6(1)(f) GDPR) and keep it for
          no longer than necessary for that purpose.
        </p>
        <p>
          You have the right to access, rectify and erase your data, to restrict
          or object to its processing, and to lodge a complaint with the
          President of the Personal Data Protection Office (UODO).
        </p>
      </div>
    </main>
  );
}
