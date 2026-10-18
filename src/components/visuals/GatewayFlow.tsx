"use client";

import { useVisualTimeline } from "./useVisualTimeline";

const rows = [
  { id: "a", y: 130, label: "field_a" },
  { id: "b", y: 160, label: "field_b" },
  { id: "c", y: 190, label: "field_c" },
];

// One request through the gateway: three fields are checked against the schema, then it is allowed or rejected with a reason.
function cycle(tl: gsap.core.Timeline, at: number, bad: boolean) {
  tl.set("[data-pk]", { x: 0, y: 0, opacity: 0 }, at)
    .set("[data-pk-ok],[data-pk-bad],[data-mark],[data-v]", { opacity: 0 }, at)
    .set(bad ? "[data-r3-ok]" : "[data-r3-bad]", { opacity: 0 }, at)
    .set(bad ? "[data-r3-bad]" : "[data-r3-ok]", { opacity: 1 }, at)
    .to("[data-pk]", { opacity: 1, duration: 0.3 }, at)
    .to("[data-pk]", { x: 56, duration: 0.6 }, at + 0.3)
    .to(["[data-mark=a]", "[data-mark=b]"], { opacity: 1, duration: 0.2, stagger: 0.3 }, at + 0.9)
    .to(bad ? "[data-mark=x]" : "[data-mark=c]", { opacity: 1, duration: 0.2 }, at + 1.5)
    .to(bad ? "[data-pk-bad]" : "[data-pk-ok]", { opacity: 1, duration: 0.2 }, at + 1.9)
    .to("[data-pk]", { x: 246, y: bad ? 68 : -52, duration: 0.8, ease: "power1.inOut" }, at + 2)
    .to(bad ? "[data-v=bad]" : "[data-v=ok]", { opacity: 1, duration: 0.3 }, at + 2.8)
    .to("[data-pk]", { opacity: 0, duration: 0.3 }, at + 3.6);
}

function build(tl: gsap.core.Timeline) {
  cycle(tl, 0, false);
  cycle(tl, 4, true);
}

// Animated request flow: a request enters the gateway, is checked against the live schema, then allowed or rejected with a reason.
export function GatewayFlow({ className = "" }: { className?: string }) {
  const ref = useVisualTimeline<SVGSVGElement>(build, { loop: true, repeatDelay: 0.6 });
  const check = (y: number) => `M246 ${y} l4 4 l8 -9`;

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 300"
      role="img"
      aria-label="Animated request flow: a write request enters the gateway, each field is checked against the organisation's live schema, and the request is either allowed through to the vendor or rejected with a reason such as an unknown field."
      className={`block h-auto w-full rounded-lg border border-line bg-panel ${className}`}
    >
      <rect x={8} y={120} width={66} height={44} rx={5} className="fill-bg stroke-line-strong" />
      <text x={41} y={147} textAnchor="middle" fontSize={12} className="fill-soft font-mono">
        client
      </text>
      <path d="M74 142 H130" className="fill-none stroke-line-strong" strokeWidth={1.5} />

      <rect x={130} y={50} width={140} height={200} rx={8} className="fill-bg stroke-soft" strokeWidth={1.5} />
      <text x={200} y={76} textAnchor="middle" fontSize={13} className="fill-fg font-mono">
        gateway
      </text>
      <text x={200} y={93} textAnchor="middle" fontSize={10.5} className="fill-muted font-mono">
        schema check
      </text>
      {rows.map(({ id, y, label }) => (
        <g key={id}>
          <text x={146} y={y + 4} fontSize={12} className="fill-soft font-mono" data-r3-ok={id === "c" ? "" : undefined}>
            {label}
          </text>
          <path data-mark={id} d={check(y)} className="fill-none stroke-accent" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <text data-r3-bad x={146} y={194} opacity={0} fontSize={12} className="fill-soft font-mono">
        field_x
      </text>
      <path data-mark="x" opacity={0} d="M246 185 l10 10 M256 185 l-10 10" className="fill-none stroke-danger" strokeWidth={2} strokeLinecap="round" />
      <text x={200} y={234} textAnchor="middle" fontSize={10.5} className="fill-muted font-mono">
        live schema
      </text>

      <path d="M270 130 C 295 130, 295 90, 320 90" className="fill-none stroke-accent/60" strokeWidth={1.5} />
      <path d="M270 154 C 295 154, 295 210, 320 210" className="fill-none stroke-danger/60" strokeWidth={1.5} />

      <rect x={320} y={66} width={72} height={48} rx={6} className="fill-accent/10 stroke-accent" strokeWidth={1.5} />
      <text x={356} y={86} textAnchor="middle" fontSize={12} className="fill-fg font-mono">
        vendor
      </text>
      <text data-v="ok" x={356} y={102} textAnchor="middle" fontSize={10.5} className="fill-accent font-mono">
        allowed
      </text>

      <rect x={320} y={186} width={72} height={48} rx={6} className="fill-danger/10 stroke-danger" strokeWidth={1.5} />
      <text x={356} y={206} textAnchor="middle" fontSize={12} className="fill-fg font-mono">
        caller
      </text>
      <text data-v="bad" x={356} y={222} textAnchor="middle" fontSize={10.5} className="fill-danger font-mono">
        rejected
      </text>
      <text data-v="bad" x={356} y={252} textAnchor="middle" fontSize={10.5} className="fill-danger font-mono">
        unknown field
      </text>

      <g data-pk>
        <circle cx={74} cy={142} r={6} className="fill-fg" />
        <circle data-pk-ok cx={74} cy={142} r={6} opacity={0} className="fill-accent" />
        <circle data-pk-bad cx={74} cy={142} r={6} opacity={0} className="fill-danger" />
      </g>
    </svg>
  );
}
