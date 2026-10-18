"use client";

import { isPhone, useVisualTimeline } from "./useVisualTimeline";

// Road route as a polyline in a 400×320 map space (a city grid, so distances are plain geometry).
const route = [[20, 280], [20, 200], [110, 200], [110, 120], [220, 120], [220, 60], [370, 60]];
const RANGE = 34; // "100 metres" in map units
const STATIC_PROGRESS = 0.5; // where the ambulance sits when nothing animates

const lengths = route.slice(1).map(([x, y], i) => Math.hypot(x - route[i][0], y - route[i][1]));
const total = lengths.reduce((a, b) => a + b, 0);

function pointAt(progress: number) {
  let d = progress * total;
  for (let i = 0; i < lengths.length; i++) {
    if (d <= lengths[i]) {
      const t = d / lengths[i];
      const [x1, y1] = route[i];
      const [x2, y2] = route[i + 1];
      return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
    }
    d -= lengths[i];
  }
  return route[route.length - 1];
}

// Each officer lights up from the first point of the route that comes within range.
const officers = [[62, 184], [128, 160], [165, 104], [238, 90], [300, 76]].map(([x, y]) => {
  let alertAt = 1;
  for (let p = 0; p <= 1; p += 0.002) {
    const [px, py] = pointAt(p);
    if (Math.hypot(px - x, py - y) < RANGE) {
      alertAt = p;
      break;
    }
  }
  return { x, y, alertAt };
});

const routePath = `M${route.map(([x, y]) => `${x} ${y}`).join(" L")}`;
const gridPath =
  Array.from({ length: 31 }, (_, i) => `M${-400 + i * 40} -400V720`).join("") +
  Array.from({ length: 29 }, (_, i) => `M-400 ${-400 + i * 40}H800`).join("");

function build(tl: gsap.core.Timeline, root: SVGSVGElement) {
  const ambulance = root.querySelector("[data-amb]")!;
  const trail = root.querySelector<SVGPathElement>("[data-trail]")!;
  const alerts = [...root.querySelectorAll<SVGGElement>("[data-officer]")];
  const state = { p: 0 };

  tl.to(
    state,
    {
      p: 1,
      duration: 10,
      ease: "none",
      onUpdate: () => {
        const [x, y] = pointAt(state.p);
        ambulance.setAttribute("transform", `translate(${x} ${y})`);
        trail.style.strokeDashoffset = String(1 - state.p);
        alerts.forEach((el, i) => (el.dataset.lit = String(state.p >= officers[i].alertAt)));
      },
    },
    0,
  );
  if (!isPhone()) tl.fromTo("[data-siren]", { attr: { r: 7 }, opacity: 0.7 }, { attr: { r: 18 }, opacity: 0, duration: 0.9, repeat: 10, ease: "power1.out" }, 0);
}

type Props = { className?: string; variant?: "card" | "background" };

// A dark map with a road route: the ambulance dot drives along it and each traffic officer lights up green as it comes within 100 m.
// "card" is a bordered panel for the project block; "background" fills its container (the map extends past the edges) for the case-study intro.
export function MargMap({ className = "", variant = "card" }: Props) {
  const ref = useVisualTimeline<SVGSVGElement>(build, { loop: true, repeatDelay: 1, start: "top bottom" });
  const card = variant === "card";
  const [ax, ay] = pointAt(STATIC_PROGRESS);

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 320"
      role="img"
      aria-label="Map concept: an ambulance, shown as an amber dot, moves along a road route. Traffic officers near the route light up green as the ambulance comes within 100 metres, so they know it is coming before it arrives."
      className={`block ${card ? "h-auto w-full rounded-lg border border-line bg-bg" : "h-full w-full overflow-visible"} ${className}`}
    >
      <path d={gridPath} className="fill-none stroke-line" strokeWidth={1} />
      <path d={routePath} className="fill-none stroke-line-strong" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path
        data-trail
        d={routePath}
        pathLength={1}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 - STATIC_PROGRESS }}
        className="fill-none stroke-amber"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x={362} y={44} width={16} height={16} rx={3} className="fill-bg stroke-muted" strokeWidth={1.5} />
      <path d="M370 48V56M366 52H374" className="fill-none stroke-muted" strokeWidth={1.5} />

      {officers.map(({ x, y, alertAt }, i) => (
        <g key={i} data-officer data-lit={String(STATIC_PROGRESS >= alertAt)} className="group">
          <circle cx={x} cy={y} r={RANGE} className="fill-none stroke-accent opacity-0 transition-opacity duration-300 group-data-[lit=true]:opacity-40" strokeDasharray="3 4" />
          <circle cx={x} cy={y} r={5.5} className="fill-bg stroke-muted transition-colors duration-300 group-data-[lit=true]:fill-accent group-data-[lit=true]:stroke-accent" strokeWidth={1.5} />
        </g>
      ))}

      <g data-amb transform={`translate(${ax} ${ay})`}>
        <circle data-siren r={7} opacity={0} className="fill-none stroke-amber" strokeWidth={1.5} />
        <circle r={6.5} className="fill-amber" />
      </g>

      {card && (
        <g className="font-mono" fontSize={10.5}>
          <circle cx={14} cy={306} r={4} className="fill-amber" />
          <text x={24} y={310} className="fill-muted">
            ambulance
          </text>
          <circle cx={112} cy={306} r={4} className="fill-accent" />
          <text x={122} y={310} className="fill-muted">
            officer alerted within 100 m
          </text>
        </g>
      )}
    </svg>
  );
}
