"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChipList } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { about, type Metric } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Console-style cell. Numeric metrics count up once when scrolled into view (the DOM text is updated
// directly so React doesn't re-render every frame); without motion they show their final value.
function MetricCell({ metric, highlight }: { metric: Metric; highlight: boolean }) {
  const reduced = usePrefersReducedMotion();
  const value = useRef<HTMLParagraphElement>(null);
  const { countTo, suffix = "", display } = metric;

  useEffect(() => {
    const el = value.current;
    if (reduced || !el || countTo === undefined) return;
    const fmt = (n: number) => n.toLocaleString("en-US") + suffix;
    const state = { v: 0 };
    el.textContent = fmt(0);
    const ctx = gsap.context(() => {
      gsap.to(state, {
        v: countTo,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = fmt(Math.round(state.v));
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
    return () => {
      ctx.revert();
      el.textContent = display;
    };
  }, [reduced, countTo, suffix, display]);

  return (
    <div className="min-w-0 rounded-md border border-line-strong bg-panel p-3 sm:p-5">
      <p className="font-mono text-[11px] tracking-[0.04em] break-words text-muted md:text-xs">{metric.label}</p>
      <p
        ref={value}
        className={`mt-3 font-display text-[clamp(1.75rem,4.2vw,3.75rem)] leading-none tracking-[-0.03em] tabular-nums ${highlight ? "text-accent" : "text-fg"}`}
      >
        {display}
      </p>
      <p className="mt-3 text-sm leading-snug text-muted">{metric.caption}</p>
    </div>
  );
}

export function About() {
  return (
    <Section id="about">
      <SectionHeader title="About" label="(01) ~/about" />
      <Reveal>
        <p className="max-w-5xl text-[clamp(1.5rem,3.4vw,2.75rem)] leading-[1.2] font-medium tracking-[-0.02em] text-fg">{about.intro}</p>
      </Reveal>
      <Reveal className="mt-8 grid max-w-5xl gap-5 text-base text-soft md:mt-12 md:grid-cols-2 md:gap-12 md:text-[17px]">
        {about.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-4">
        {about.metrics.map((m, i) => (
          <MetricCell key={m.label} metric={m} highlight={i === 0} />
        ))}
      </div>
      <Reveal className="mt-10">
        <ChipList items={about.chips} label="Tech stack" />
      </Reveal>
    </Section>
  );
}
