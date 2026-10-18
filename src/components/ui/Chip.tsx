// Small outlined pill for tech stacks and tags. Render a list inside <ChipList>.
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] text-soft md:text-xs">{children}</li>
  );
}

export function ChipList({ items, label }: { items: readonly string[]; label?: string }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ul>
  );
}
