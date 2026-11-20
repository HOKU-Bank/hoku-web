import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Hoku Bank handles personal data sent through hokubank.com: what the contact form collects, why, where it is stored and your rights under GDPR.",
  alternates: { canonical: "/privacy" },
  // A page-level openGraph replaces the root one, so the share image is repeated here.
  openGraph: { url: "/privacy", title: "Privacy policy | Hoku Bank", images: ["/opengraph-image.png"] },
  twitter: { card: "summary_large_image", title: "Privacy policy | Hoku Bank", images: ["/twitter-image.png"] },
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
          Hoku Group, Warsaw, Poland.
        </p>
        <p>
          This website does not use tracking cookies. We count page views with
          Vercel Web Analytics, which works without cookies and does not
          identify individual visitors.
        </p>
        <p>
          <strong className="text-white">Contact form.</strong> When you write to
          us through the contact form we process your name, e-mail address,
          organisation, the capacity in which you contact us and your message.
          We use this data only to reply to you, on the basis of your consent
          (Art. 6(1)(a) GDPR). You can withdraw consent at any time by writing to
          us, and we will delete your data. Otherwise we keep it no longer than
          24 months.
        </p>
        <p>
          The data is stored with our processor Supabase in the European Union
          (Frankfurt) and forwarded to our team by e-mail through our processor
          Resend. The website is hosted by Vercel.
        </p>
        <p>
          If you contact us by e-mail, we process your name, e-mail address and
          the content of your message solely to respond to your enquiry (Art.
          6(1)(f) GDPR).
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
