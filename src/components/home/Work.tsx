"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectBlock } from "./ProjectBlock";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = "inset(0 100% 0 0)";
const SHOWN = "inset(0 0% 0 0)";
const END_LINE = `request complete · ${projects.length} services · 0 errors`;
const READING_LINE = "60%"; // the request dot sits this far down the viewport

// Types a line out left to right (monospace, so one step per character). Uses clip-path so the text node is never touched.
const type = (text: string) => ({ clipPath: SHOWN, duration: text.length * 0.03, ease: `steps(${text.length})` }) satisfies gsap.TweenVars;

// (03) ~/work: the five project blocks plus the "request trace" (spec 8.3), a line and glowing dot that travel down
// the section with the scroll and light up each service. Decorative; reduced motion shows it fully lit and static.
export function Work() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = wrap.current;
    if (reduced || !root) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: `top ${READING_LINE}`, end: `bottom ${READING_LINE}`, scrub: 0.3 } })
        .fromTo("[data-trace-fill]", { scaleY: 0 }, { scaleY: 1, ease: "none" }, 0)
        .fromTo("[data-trace-head]", { top: "0%", xPercent: -50, yPercent: -50 }, { top: "100%", ease: "none" }, 0);

      gsap.utils.toArray<HTMLElement>("[data-trace-block]").forEach((block) => {
        const dot = block.querySelector("[data-health-dot]") as HTMLElement;
        const text = block.querySelector("[data-trace-text]") as HTMLElement;
        const glow = dot.dataset.health === "amber" ? "245,184,61" : "74,222,128";
        gsap.set(dot, { opacity: 0.3 });
        gsap.set(text, { clipPath: HIDDEN });
        const reach = gsap
          .timeline({ paused: true })
          .to(dot, { opacity: 1, duration: 0.2 }, 0)
          .fromTo(dot, { boxShadow: `0 0 0 0 rgba(${glow},0.7)` }, { boxShadow: `0 0 0 10px rgba(${glow},0)`, duration: 0.8 }, 0)
          .to(text, type(text.textContent ?? ""), 0.15);
        ScrollTrigger.create({
          trigger: block.querySelector("[data-trace-meta]"),
          start: `top ${READING_LINE}`,
          end: "max",
          onToggle: (self) => (self.isActive ? reach.play() : reach.reverse()),
        });
      });

      const end = root.querySelector("[data-trace-end]") as HTMLElement;
      gsap.set(end, { clipPath: HIDDEN });
      const finish = gsap
        .timeline({ paused: true })
        .to(end, type(END_LINE))
        .to("[data-trace-line]", { opacity: 0, duration: 1 }, "+=1.2");
      ScrollTrigger.create({
        trigger: end,
        start: `bottom ${READING_LINE}`,
        end: "max",
        onToggle: (self) => (self.isActive ? finish.play() : finish.reverse()),
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section id="work">
      <SectionHeader title="Work" label={`(03) ~/work · ${projects.length} services`} />
      <div ref={wrap} className="relative pl-6 sm:pl-8 lg:pl-12">
        <div data-trace-line aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-px bg-line-strong">
          <div data-trace-fill className="absolute inset-0 origin-top bg-accent" style={reduced ? { transform: "scaleY(1)" } : undefined} />
          <div
            data-trace-head
            className={`absolute left-0 size-2.5 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(74,222,128,0.7)] ${reduced ? "hidden" : ""}`}
          />
        </div>
        {projects.map((project) => (
          <ProjectBlock key={project.slug} project={project} />
        ))}
        <p aria-hidden="true" className="pb-2 font-mono text-xs text-accent md:text-sm">
          <span data-trace-end className="inline-block">
            {END_LINE}
          </span>
        </p>
      </div>
    </Section>
  );
}
