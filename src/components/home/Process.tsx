"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Each step owns one segment of the connecting line (vertical on phones, horizontal from md up).
// Its fill is driven by the --p custom property, which defaults to 1 so the line is fully green without motion.
export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (reduced || !list) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 55%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("li", list).forEach((li) => {
        tl.fromTo(li, { "--p": 0 }, { "--p": 1 });
      });
    }, list);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section id="process">
      <SectionHeader title="Process" label="(05) ~/process" />
      <ol ref={listRef} className="grid md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((s, i) => (
          <li key={s.step} className="relative pb-10 pl-8 last:pb-0 md:px-0 md:pt-8 md:pr-8 md:pb-10 lg:pb-0">
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-line-strong md:inset-x-0 md:bottom-auto md:left-0 md:h-px md:w-auto" />
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-accent [transform:scaleY(var(--p,1))] md:inset-x-0 md:bottom-auto md:left-0 md:h-px md:w-auto md:origin-left md:[transform:scaleX(var(--p,1))]"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 size-[11px] rounded-full bg-accent md:-top-[5px]"
              style={{ opacity: "calc(0.3 + 0.7 * var(--p, 1))" }}
            />
            <span className="font-mono text-xs tracking-[0.08em] text-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-mono text-xl text-accent">{s.step}</h3>
            <p className="mt-3 text-soft">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
