import type { Health } from "@/content/site";

// Green = production/working, amber = in design. `pulse` adds a soft ping (disabled by reduced motion via globals.css).
export function StatusDot({ health = "green", pulse = false, className = "" }: { health?: Health; pulse?: boolean; className?: string }) {
  const color = health === "green" ? "bg-accent" : "bg-amber";
  return (
    <span className={`relative inline-flex size-2 shrink-0 ${className}`} aria-hidden="true">
      {pulse && <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${color}`} />}
      <span className={`relative inline-flex size-2 rounded-full ${color}`} />
    </span>
  );
}
