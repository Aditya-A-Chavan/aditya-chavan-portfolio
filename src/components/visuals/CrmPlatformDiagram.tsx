"use client";

import { isPhone, useVisualTimeline } from "./useVisualTimeline";

const orgs = [1, 2, 3, 4, 5, 6].map((n, i) => ({ n, y: 22 + i * 47 }));

function build(tl: gsap.core.Timeline, root: SVGSVGElement) {
  if (isPhone()) {
    tl.from(root.children, { opacity: 0, duration: 0.5 });
    return;
  }
  tl.from("[data-org]", { opacity: 0, x: -12, duration: 0.4, stagger: 0.08 })
    .from("[data-feed]", { strokeDashoffset: 1, duration: 0.5, stagger: 0.08 }, "-=0.3")
    .from("[data-api]", { opacity: 0, duration: 0.4 }, "-=0.2")
    .from("[data-out]", { strokeDashoffset: 1, duration: 0.5, stagger: 0.15 })
    .from("[data-key]", { opacity: 0, duration: 0.4, stagger: 0.15 }, "-=0.2")
    .fromTo("[data-hl]", { strokeWidth: 1.5 }, { strokeWidth: 3.5, duration: 0.35, yoyo: true, repeat: 3 });
}

// Sanitised architecture of the multi-org CRM platform: six orgs feed one API; the write fence and audit log are highlighted.
export function CrmPlatformDiagram({ className = "" }: { className?: string }) {
  const ref = useVisualTimeline<SVGSVGElement>(build);
  const line = "fill-none stroke-line-strong";
  const draw = { strokeDasharray: 1 };

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 320"
      role="img"
      aria-label="Architecture diagram: six separate CRM organisations feed one API. Writes pass through a write fence that checks versions before saving, and every write is recorded in an audit log."
      className={`block h-auto w-full rounded-lg border border-line bg-panel ${className}`}
    >
      {orgs.map(({ n, y }, i) => (
        <g key={n}>
          <path data-feed pathLength={1} style={draw} className={line} strokeWidth={1.5} d={`M96 ${y + 16} C 132 ${y + 16}, 132 ${125 + i * 14}, 168 ${125 + i * 14}`} />
          <g data-org>
            <rect x={12} y={y} width={84} height={32} rx={5} className="fill-bg stroke-line-strong" />
            <text x={54} y={y + 20} textAnchor="middle" fontSize={12} className="fill-soft font-mono">
              org {n}
            </text>
          </g>
        </g>
      ))}

      <g data-api>
        <rect x={168} y={95} width={76} height={130} rx={6} className="fill-bg stroke-soft" strokeWidth={1.5} />
        <text x={206} y={156} textAnchor="middle" fontSize={13} className="fill-fg font-mono">
          ONE
        </text>
        <text x={206} y={174} textAnchor="middle" fontSize={13} className="fill-fg font-mono">
          API
        </text>
      </g>

      <path data-out pathLength={1} style={draw} className="fill-none stroke-accent" strokeWidth={1.5} d="M244 135 C 268 135, 268 90, 292 90" />
      <path data-out pathLength={1} style={draw} className="fill-none stroke-accent" strokeWidth={1.5} d="M244 185 C 268 185, 268 230, 292 230" />

      <g data-key>
        <rect data-hl x={292} y={62} width={96} height={56} rx={6} className="fill-accent/10 stroke-accent" strokeWidth={1.5} />
        <text x={340} y={87} textAnchor="middle" fontSize={12} className="fill-accent font-mono">
          write fence
        </text>
        <text x={340} y={104} textAnchor="middle" fontSize={10.5} className="fill-muted font-mono">
          version check
        </text>
      </g>
      <g data-key>
        <rect data-hl x={292} y={202} width={96} height={56} rx={6} className="fill-accent/10 stroke-accent" strokeWidth={1.5} />
        <text x={340} y={227} textAnchor="middle" fontSize={12} className="fill-accent font-mono">
          audit log
        </text>
        <text x={340} y={244} textAnchor="middle" fontSize={10.5} className="fill-muted font-mono">
          every write
        </text>
      </g>

      <text x={200} y={309} textAnchor="middle" fontSize={11} className="fill-muted font-mono">
        6 orgs · 1 API · crash-safe writes
      </text>
    </svg>
  );
}
