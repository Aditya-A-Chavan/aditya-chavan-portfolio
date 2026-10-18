import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { About } from "@/components/home/About";
import { Experience } from "@/components/home/Experience";
import { Work } from "@/components/home/Work";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Stack } from "@/components/home/Stack";
import { Contact } from "@/components/home/Contact";
import { LegacyHashRedirect } from "@/components/seo/LegacyHashRedirect";

export default function Home() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Work />
      <Services />
      <Process />
      <Stack />
      <Contact />
    </>
  );
}
