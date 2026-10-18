"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { StatusDot } from "@/components/ui/StatusDot";
import { hero, profile } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";
import { istTime } from "@/lib/time";

const COMMAND = "$ whoami";
const LINE_HEIGHT = 24; // px, matches the log row height (h-6)
const nameLines = profile.name.toUpperCase().split(" ");

const noopSubscribe = () => () => {};
// False during server render and hydration, true afterwards.
const useMounted = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

// `at` is an epoch ms timestamp, or (for the first three rows) an offset (≤ 0) from mount time.
type Log = { id: number; at: number; msg: string };

// Read the clock only on the client: prerendering must not depend on the current time.
let mountTime: number | null = null;
const getMountTime = () => (mountTime ??= Date.now());
const useMountTime = () => useSyncExternalStore(noopSubscribe, getMountTime, () => 0);

function LogPanel({ reduced }: { reduced: boolean }) {
  const mounted = useMounted();
  const start = useMountTime();
  const [lines, setLines] = useState<Log[]>(() => [0, 1, 2].map((i) => ({ id: i, at: -(2 - i) * 2000, msg: hero.logLines[i] })));
  const nextId = useRef(3);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      const id = nextId.current++;
      const line = { id, at: Date.now(), msg: hero.logLines[id % hero.logLines.length] };
      setLines((prev) => [...prev, line].slice(-4));
    }, 2000);
    return () => clearInterval(timer);
  }, [reduced]);

  // Bottom-anchored list: a new row pushes everything up one row; ease it from where it was.
  useLayoutEffect(() => {
    if (reduced || lines.length < 4 || !list.current) return;
    gsap.fromTo(list.current, { y: LINE_HEIGHT }, { y: 0, duration: 0.45, ease: "power2.out", overwrite: true });
  }, [lines, reduced]);

  return (
    <div aria-hidden="true" className="rounded-md border border-line-strong bg-panel p-4 font-mono text-xs">
      <div className="mb-3 flex items-center justify-between text-[11px] tracking-[0.08em] text-muted uppercase">
        <span>~/logs · tail -f</span>
        <span className="flex items-center gap-2">
          <StatusDot pulse />
          live
        </span>
      </div>
      <div className="relative h-18 overflow-hidden">
        <div ref={list} className="absolute inset-x-0 bottom-0">
          {lines.map((l) => (
            <p key={l.id} className="flex h-6 items-center gap-3 whitespace-nowrap">
              <span className="text-muted tabular-nums">{mounted ? istTime(new Date(l.at <= 0 ? start + l.at : l.at)) : "--:--:--"}</span>
              <span className="text-accent">INFO</span>
              <span className="min-w-0 truncate text-soft">{l.msg}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [typedCount, setTypedCount] = useState(0);
  const typed = reduced ? COMMAND : COMMAND.slice(0, typedCount);

  useEffect(() => {
    if (reduced) return;
    let ticker: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      let n = 0;
      ticker = setInterval(() => {
        setTypedCount(++n);
        if (n >= COMMAND.length) clearInterval(ticker);
      }, 90);
    }, 400);
    return () => {
      clearTimeout(start);
      clearInterval(ticker);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !root.current) return;
    let onMove: ((e: MouseEvent) => void) | undefined;
    let bootWatch: MutationObserver | undefined;
    const ctx = gsap.context(() => {
      // On a first visit the boot screen covers the hero; hold the letters until it has gone.
      const html = document.documentElement;
      const booting = html.dataset.boot === "show";
      const letters = gsap.from("[data-letter]", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.045, delay: 0.15, paused: booting });
      if (booting) {
        bootWatch = new MutationObserver(() => {
          if (html.dataset.boot === "show") return;
          bootWatch?.disconnect();
          letters.play();
        });
        bootWatch.observe(html, { attributes: true, attributeFilter: ["data-boot"] });
      }
      gsap.to("[data-cursor]", { opacity: 0, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true });
      gsap
        .timeline({ repeat: -1 })
        .fromTo("[data-scroll-line]", { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.9, ease: "power2.inOut" })
        .to("[data-scroll-line]", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, ease: "power2.inOut" });

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const movers = gsap.utils.toArray<HTMLElement>("[data-name-line]").map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
          depth: 1 + i * 0.7,
        }));
        onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * -16 * m.depth);
            m.y(ny * -8 * m.depth);
          });
        };
        window.addEventListener("mousemove", onMove);
      }
    }, root);
    return () => {
      if (onMove) window.removeEventListener("mousemove", onMove);
      bootWatch?.disconnect();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <Section id="top" className="flex min-h-svh flex-col">
      <div ref={root} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center gap-5 pt-4 md:gap-7 md:pt-8">
          <p className="inline-flex min-h-8 items-center gap-2.5 self-start rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-soft md:text-xs">
            <StatusDot pulse />
            {profile.availability}
          </p>

          <p className="font-mono text-sm text-muted md:text-base">
            <span className="sr-only">{COMMAND}</span>
            <span aria-hidden="true">
              {typed}
              <span data-cursor className="ml-1.5 inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-accent" />
            </span>
          </p>

          <h1
            aria-label={profile.name}
            className="font-display text-[clamp(3rem,13.2vw,11.25rem)] leading-[0.9] font-extrabold tracking-[-0.04em] uppercase"
          >
            {nameLines.map((word) => (
              <span key={word} data-name-line aria-hidden="true" className="block">
                <span className="block overflow-hidden py-[0.03em]">
                  {word.split("").map((ch, i) => (
                    <span key={i} data-letter className="inline-block">
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <p className="text-[clamp(1rem,1.6vw,1.375rem)] text-soft">{hero.roleLine}</p>

          <div className="mt-2 grid items-end gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
            <div className="space-y-8">
              <p className="max-w-3xl text-[clamp(1.125rem,2vw,1.75rem)] leading-snug text-soft">
                {hero.pitchBefore}
                <strong className="font-semibold text-accent">{hero.pitchAccent}</strong>
                {hero.pitchAfter}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div id="hero-cta" className="w-full sm:w-auto">
                  <ButtonLink href="#contact" variant="primary" focusSelector="input" className="w-full sm:w-auto">
                    Start a project →
                  </ButtonLink>
                </div>
                <ButtonLink href="#work" variant="outline" className="w-full sm:w-auto">
                  See my work
                </ButtonLink>
              </div>
            </div>
            <LogPanel reduced={reduced} />
          </div>
        </div>

        <div aria-hidden="true" className="mt-10 flex items-center gap-3 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          <span data-scroll-line className="block h-10 w-px bg-accent" />
          scroll
        </div>
      </div>
    </Section>
  );
}
