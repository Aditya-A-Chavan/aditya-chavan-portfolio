"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";
import { MargMap } from "@/components/visuals/MargMap";

gsap.registerPlugin(ScrollTrigger);

const ANSWER =
  "MARG is my answer: give traffic police a warning before the ambulance reaches them, so the road is already clearing when it arrives.";

// The canonical story lives in site.ts; the intro tells it one sentence at a time.
const story = projects.find((p) => p.slug === "marg")?.story ?? "";
const SENTENCES = [...story.split(/(?<=[.!?])\s+/).filter(Boolean), ANSWER];

const TEXT = "font-sans font-light text-fg italic";
const TEXT_PINNED = `${TEXT} text-[1.65rem] leading-[1.3] sm:text-4xl md:text-5xl lg:text-6xl`;
const TEXT_STATIC = `${TEXT} text-2xl leading-[1.45] sm:text-3xl md:text-4xl`;

function Backdrop() {
  return (
    <>
      <div className="absolute inset-0 opacity-45" aria-hidden="true">
        <MargMap variant="background" />
      </div>
      <div
        className="absolute inset-0 bg-linear-to-b from-bg/60 via-transparent to-bg"
        aria-hidden="true"
      />
    </>
  );
}

// Full-width opening for the MARG case study. Pinned while the story plays on scroll;
// with reduced motion it is an ordinary section with the whole story as one paragraph.
export function MargIntro() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const lines = lineRefs.current.filter((el): el is HTMLParagraphElement => el !== null);
    if (!section || !stage || lines.length === 0) return;

    const ctx = gsap.context(() => {
      const last = lines.length - 1;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Shorter scroll distance per sentence on phones.
          end: () => `+=${Math.round(window.innerHeight * lines.length * (window.innerWidth < 768 ? 0.45 : 0.7))}`,
          pin: stage,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      lines.forEach((el, i) => {
        tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, i * 2);
        if (i < last) tl.to(el, { opacity: 0, y: -24, duration: 0.6 }, i * 2 + 1.4);
      });
      tl.to({}, { duration: 1 }, last * 2 + 0.6);
      tl.to(cueRef.current, { opacity: 0, duration: 0.4 }, 0);
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section aria-label="Why I designed MARG" className="relative isolate overflow-hidden border-b border-line">
        <Backdrop />
        <div className="relative mx-auto max-w-4xl px-6 py-24 md:px-10 md:py-32">
          <p className={TEXT_STATIC}>
            {SENTENCES.slice(0, -1).join(" ")} <span className="text-accent not-italic">{ANSWER.slice(0, 4)}</span>
            {ANSWER.slice(4)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="Why I designed MARG" className="relative border-b border-line">
      <div ref={stageRef} className="relative isolate flex h-svh w-full items-center overflow-hidden">
        <Backdrop />
        <div className="relative mx-auto grid w-full max-w-4xl px-6 md:px-10">
          {SENTENCES.map((sentence, i) => (
            <p
              key={sentence}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className={`${TEXT_PINNED} col-start-1 row-start-1 wrap-break-word`}
              style={{ opacity: 0 }}
            >
              {i === SENTENCES.length - 1 ? (
                <>
                  <span className="text-accent not-italic">{sentence.slice(0, 4)}</span>
                  {sentence.slice(4)}
                </>
              ) : (
                sentence
              )}
            </p>
          ))}
        </div>
        <div
          ref={cueRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-8 text-center font-mono text-[11px] tracking-[0.2em] text-muted uppercase"
        >
          Scroll
        </div>
      </div>
    </section>
  );
}

export default MargIntro;
