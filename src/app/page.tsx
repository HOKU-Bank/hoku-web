import { AgentStory } from "@/components/AgentStory";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Access, Footer, Platform, Stats, Team } from "@/components/Sections";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Nav />
      <Hero />
      <AgentStory />
      <Stats />
      <Platform />
      <Team />
      <Access />
      <Footer />
    </main>
  );
}
