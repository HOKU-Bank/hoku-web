import { AgentMarquee } from "@/components/AgentMarquee";
import { AgentStory } from "@/components/AgentStory";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Access, Footer, Platform, Stats, Team, Vision } from "@/components/Sections";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Home() {
  return (
    <main className="overflow-x-clip">
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
