"use client";

import { useEffect, useRef } from "react";

const LINES = [
  "> booting aditya-chavan-portfolio ...",
  "> loading modules: backend, cloud, systems ......... ok",
  "> checking availability ............................ available",
  "> welcome.",
];
const STEP = 0.0075; // seconds per typed character
const GAP = 0.06; // pause between lines

// Each character fades in on its own delay, so the typing runs from CSS alone (before hydration)
// and wraps normally on narrow screens.
let at = 0.1;
const typed = LINES.map((text) => {
  const start = at;
  at += text.length * STEP + GAP;
  return { text, start };
});
const END = at;
const FINISH_MS = Math.round(END * 1000) + 150;

// Runs before first paint. Decides whether the overlay shows: first visit in this browser session,
// reduced motion off. Without JS the attribute is never set and the overlay stays hidden.
const DECIDE = `try{var d=document.documentElement,s=sessionStorage;if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!s.getItem("boot-seen")){s.setItem("boot-seen","1");d.dataset.boot="show"}}catch(e){}`;

const CSS = `
.boot{display:none;position:fixed;inset:0;z-index:100;flex-direction:column;justify-content:center;padding:2rem max(1rem,env(safe-area-inset-right)) 2rem max(1rem,env(safe-area-inset-left));background:var(--color-bg,#0b0c0e);color:var(--color-soft,#c9c6bf);font-family:var(--font-mono,ui-monospace,monospace);font-size:clamp(.8rem,3.2vw,1rem);line-height:1.9;transition:transform .6s cubic-bezier(.76,0,.24,1)}
html[data-boot="show"] .boot{display:flex}
html[data-boot="show"]{overflow:hidden}
.boot[data-leaving]{transform:translateY(-100%)}
.boot-lines{width:100%;max-width:40rem;margin:0 auto}
.boot-lines p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.boot-c{opacity:0;animation:boot-show 1ms forwards}
.boot-cursor{display:inline-block;width:.6em;height:1em;margin-left:.2em;vertical-align:text-bottom;background:var(--color-accent,#4ade80);opacity:0;animation:boot-blink 1s steps(1) infinite}
.boot-hint{position:absolute;right:max(1rem,env(safe-area-inset-right));bottom:max(1rem,env(safe-area-inset-bottom));font-size:.75rem;color:var(--color-muted,#8a8f98)}
@keyframes boot-show{to{opacity:1}}
@keyframes boot-blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}
`;

export function BootScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (root.dataset.boot !== "show" || !el) return;
    let leaving = false;
    let hide: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (leaving) return;
      leaving = true;
      el.dataset.leaving = "";
      hide = setTimeout(() => {
        root.dataset.boot = "done";
      }, 650);
    };
    // Count from page start, so a slow hydration doesn't stretch the boot.
    const auto = setTimeout(finish, Math.max(0, FINISH_MS - performance.now()));
    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    return () => {
      clearTimeout(auto);
      clearTimeout(hide);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DECIDE }} />
      <style>{CSS}</style>
      <div ref={ref} className="boot" aria-hidden="true">
        <div className="boot-lines">
          {typed.map(({ text, start }, line) => (
            <p key={text} className={line === typed.length - 1 ? "text-accent" : undefined}>
              {[...text].map((ch, i) => (
                <span key={i} className="boot-c" style={{ animationDelay: `${(start + i * STEP).toFixed(3)}s` }}>
                  {ch}
                </span>
              ))}
              {line === typed.length - 1 && <span className="boot-cursor" style={{ animationDelay: `${END.toFixed(2)}s` }} />}
            </p>
          ))}
        </div>
        <span className="boot-hint">skip ↵</span>
      </div>
    </>
  );
}
