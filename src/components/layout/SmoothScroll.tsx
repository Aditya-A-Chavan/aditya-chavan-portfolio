"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePrefersReducedMotion } from "@/lib/motion";
import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

// Weighted smooth scrolling. Lenis is driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
// Does nothing under reduced motion (native scrolling stays).
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ autoRaf: false });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    return () => {
      setLenis(null);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
