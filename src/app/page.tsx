import { AgentMarquee } from "@/components/AgentMarquee";
import { AgentStory } from "@/components/AgentStory";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Access, Footer, Platform, Stats, Team } from "@/components/Sections";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <SmoothScroll />
      <Nav />
      <Hero />
      <AgentMarquee />
      <AgentStory />
      <Stats />
      <Platform />
      <Team />
      <Access />
      <Footer />
      <ThemeSwitcher />
    </main>
  );
}
