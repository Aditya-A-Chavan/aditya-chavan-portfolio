"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export const isPhone = () => window.matchMedia("(max-width: 767px)").matches;

type Options = {
  loop?: boolean; // repeat forever while on screen
  repeatDelay?: number;
  start?: string; // ScrollTrigger start for the visual (default: when its top is 85% down the viewport)
};

// Shared by the project visuals. Builds a paused GSAP timeline scoped to the returned ref and plays it only
// while the element is on screen (one-shot visuals just stay finished). `build` must be a stable, module-level
// function. Under reduced motion nothing is built, so the SVG shows its complete static state.
export function useVisualTimeline<T extends Element>(build: (tl: gsap.core.Timeline, root: T) => void, { loop = false, repeatDelay = 0, start = "top 85%" }: Options = {}) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (reduced || !root) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, repeat: loop ? -1 : 0, repeatDelay });
      build(tl, root);
      ScrollTrigger.create({
        trigger: root,
        start,
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    }, root);
    return () => ctx.revert();
  }, [reduced, build, loop, repeatDelay, start]);

  return ref;
}
