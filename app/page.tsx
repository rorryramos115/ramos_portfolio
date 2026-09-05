import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { BentoAbout } from "@/components/bento-about";
import { Education } from "@/components/education";
import { ProjectCarousel } from "@/components/project-carousel";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BentoAbout />
        <ProjectCarousel />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}