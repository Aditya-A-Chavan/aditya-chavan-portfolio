"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marquee } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const tokens = marquee.flatMap(({ lead, rest }) => [
  { text: lead, lead: true },
  ...(rest ? [{ text: rest, lead: false }] : []),
]);

// One half of the loop. Two copies of the sequence keep it wider than ultrawide screens.
function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {[...tokens, ...tokens].map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className={t.lead ? "text-fg" : "text-muted"}>{t.text}</span>
          <span className="px-4 text-accent md:px-6">✦</span>
        </span>
      ))}
    </div>
  );
}

// Decorative band: the same facts appear in About and Skills, so it is hidden from screen readers.
export function Marquee() {
  const reduced = usePrefersReducedMotion();
  const band = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !band.current || !track.current) return;
    const ctx = gsap.context(() => {
      const loop = gsap.to(track.current, { xPercent: -50, ease: "none", duration: 45, repeat: -1 });
      ScrollTrigger.create({
        trigger: band.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const boost = Math.min(Math.abs(self.getVelocity()) / 250, 8);
          gsap.killTweensOf(loop);
          gsap.to(loop, { timeScale: 1 + boost, duration: 0.15 });
          gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.15, ease: "power2.out" });
        },
      });
    }, band);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={band} aria-hidden="true" className="overflow-hidden border-y border-line-strong bg-panel py-3 select-none md:py-5">
      <div ref={track} className="flex w-max font-mono text-[11px] tracking-[0.14em] uppercase md:text-sm">
        <Group />
        <Group />
      </div>
    </div>
  );
}
