"use client";

import { useVisualTimeline } from "./useVisualTimeline";

const steps = [
  { glyph: "PDF", label: "course PDFs", note: "extract the text" },
  { glyph: "[ ][ ]", label: "chunks", note: "split into passages" },
  { glyph: "0.1 0.7", label: "embeddings", note: "vectors stored in ChromaDB" },
  { glyph: "> _", label: "prompt", note: "strict, with retrieved context" },
  { glyph: "{ }", label: "curriculum JSON", note: "built as a Redis queue job" },
];
const STEP = 62; // vertical distance between rows

function build(tl: gsap.core.Timeline) {
  tl.set("[data-lit]", { opacity: 0 }, 0)
    .set("[data-token]", { opacity: 1, y: 0 }, 0)
    .to("[data-token]", { y: STEP * (steps.length - 1), duration: 0.9 * (steps.length - 1), ease: "none" }, 0)
    .to("[data-token]", { opacity: 0, duration: 0.3 }, 0.9 * (steps.length - 1) + 1.4);
  steps.forEach((_, i) => tl.to(`[data-lit="${i}"]`, { opacity: 1, duration: 0.25 }, i * 0.9));
  tl.to("[data-lit]", { opacity: 0, duration: 0.5 }, 0.9 * (steps.length - 1) + 1.6);
}

// PDF → chunks → embeddings → prompt → curriculum JSON. A token moves down the steps and each one lights up as it arrives.
export function CurriculumPipeline({ className = "" }: { className?: string }) {
  const ref = useVisualTimeline<SVGSVGElement>(build, { loop: true, repeatDelay: 0.4 });

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 330"
      role="img"
      aria-label="Pipeline diagram in five steps: course PDFs are turned into text, split into chunks, converted to embeddings stored in a vector database, combined with retrieved context in a strict prompt, and returned as structured curriculum JSON by a queued background job."
      className={`block h-auto w-full rounded-lg border border-line bg-panel ${className}`}
    >
      <path d={`M7 38 V${38 + STEP * (steps.length - 1)}`} className="fill-none stroke-line-strong" strokeWidth={1.5} />
      {steps.map(({ glyph, label, note }, i) => {
        const y = 16 + i * STEP;
        return (
          <g key={label}>
            <rect x={14} y={y} width={48} height={44} rx={6} className="fill-bg stroke-line-strong" />
            <rect data-lit={i} x={14} y={y} width={48} height={44} rx={6} className="fill-accent/10 stroke-accent" strokeWidth={1.5} />
            <text x={38} y={y + 26} textAnchor="middle" fontSize={i === 2 ? 8.5 : 11} className="fill-fg font-mono">
              {glyph}
            </text>
            <text x={78} y={y + 20} fontSize={13} className="fill-fg font-mono">
              {label}
            </text>
            <text x={78} y={y + 36} fontSize={10.5} className="fill-muted font-mono">
              {note}
            </text>
          </g>
        );
      })}
      <circle data-token opacity={0} cx={7} cy={38} r={4.5} className="fill-accent" />
    </svg>
  );
}
