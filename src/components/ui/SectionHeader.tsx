// Big display title on the left, monospace path label on the right, e.g. "About" + "(01) ~/about".
export function SectionHeader({ title, label, as: Tag = "h2" }: { title: string; label: string; as?: "h1" | "h2" }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-6 md:mb-14">
      <Tag className="font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">{title}</Tag>
      <span className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase md:text-xs">{label}</span>
    </div>
  );
}
