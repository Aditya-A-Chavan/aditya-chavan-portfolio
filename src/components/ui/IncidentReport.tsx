"use client";

import { useState } from "react";

export type IncidentReportProps = {
  title: string;
  status: "RESOLVED" | "PARTIAL";
  impact: React.ReactNode;
  detection: React.ReactNode;
  investigation: React.ReactNode[];
  rootCause: React.ReactNode;
  fix: React.ReactNode;
  followUps: React.ReactNode;
  defaultOpen?: boolean;
};

// Postmortem-style block for case-study debugging stories (spec section 8.4). Collapsible to its header row.
export function IncidentReport({ title, status, impact, detection, investigation, rootCause, fix, followUps, defaultOpen = false }: IncidentReportProps) {
  const [open, setOpen] = useState(defaultOpen);
  const statusColor = status === "RESOLVED" ? "text-accent border-accent/40" : "text-amber border-amber/40";
  const row = "grid gap-1 border-t border-line py-4 md:grid-cols-[160px_1fr] md:gap-6";
  const label = "font-mono text-[11px] tracking-[0.08em] text-muted uppercase";

  return (
    <div className="my-8 rounded-md border border-line-strong bg-panel">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-3 text-left font-mono text-xs md:px-5"
        >
          <span>
            <span className="text-muted">INCIDENT · </span>
            <span className="text-fg">{title}</span>
          </span>
          <span className="flex items-center gap-3">
            <span className={`rounded border px-2 py-0.5 text-[11px] ${statusColor}`}>{status}</span>
            <span aria-hidden="true" className="text-muted">{open ? "×" : "+"}</span>
          </span>
        </button>
      </h3>
      {open && (
        <div className="px-4 pb-2 text-[15px] text-soft md:px-5">
          <div className={row}><span className={label}>Impact</span><div>{impact}</div></div>
          <div className={row}><span className={label}>Detection</span><div>{detection}</div></div>
          <div className={row}>
            <span className={label}>Investigation</span>
            <ol className="list-decimal space-y-1 pl-5">{investigation.map((step, i) => <li key={i}>{step}</li>)}</ol>
          </div>
          <div className={row}><span className={label}>Root cause</span><div className="text-fg">{rootCause}</div></div>
          <div className={row}><span className={label}>Fix</span><div>{fix}</div></div>
          <div className={row}><span className={label}>Follow-ups</span><div>{followUps}</div></div>
        </div>
      )}
    </div>
  );
}
