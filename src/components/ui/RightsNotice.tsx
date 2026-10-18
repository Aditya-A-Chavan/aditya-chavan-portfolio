import { margRights } from "@/content/site";

// MARG ownership marker. "compact" is one line for the home-page block; "full" is the dated notice for the case study.
export function RightsNotice({ variant = "full" }: { variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return <p className="mt-6 font-mono text-[11px] tracking-[0.04em] text-muted md:text-xs">{margRights.short}</p>;
  }
  return (
    <aside aria-labelledby="marg-rights" className="rounded-md border border-amber/40 bg-panel p-5 md:p-6">
      <h2 id="marg-rights" className="font-mono text-xs tracking-[0.08em] text-amber uppercase">
        Ownership and rights · first documented <time dateTime={margRights.firstDocumented}>{margRights.firstDocumentedLabel}</time>
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-fg">{margRights.authorship}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-soft">{margRights.reservation}</p>
      <p className="mt-3 font-mono text-xs text-muted">{margRights.contact}</p>
    </aside>
  );
}
