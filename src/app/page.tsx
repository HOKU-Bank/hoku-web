import type { Metadata } from "next";
import { AgentMarquee } from "@/components/AgentMarquee";
import { AgentStory } from "@/components/AgentStory";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Access, Footer, Platform, Stats, Team, Vision } from "@/components/Sections";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LINKEDIN_URL, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Structured data for search engines. Kept to plain facts about the company:
// no licence status, deposit protection, rates or product promises.
// TODO(legal): have compliance approve `description` before adding anything
// regulatory (licence number, supervisor, deposit guarantee scheme).
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/brand/hoku-icon-512.png`,
  description:
    "Hoku is a Warsaw-based company building an agentic neobank for Europe's innovative companies. Hoku is not a bank and does not provide regulated services.",
  address: { "@type": "PostalAddress", addressLocality: "Warsaw", addressCountry: "PL" },
  ...(LINKEDIN_URL ? { sameAs: [LINKEDIN_URL] } : {}),
};

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
      />
      <SmoothScroll />
      <Nav />
      <Hero />
      <AgentMarquee />
      <AgentStory />
      <Stats />
      <Vision />
      <Platform />
      <Team />
      <Access />
      <Footer />
    </main>
  );
}
