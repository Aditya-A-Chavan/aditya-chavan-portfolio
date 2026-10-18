import Link from "next/link";
import { projects } from "@/content/site";
import { ChipList } from "@/components/ui/Chip";

// Card linking to the next project in site order. The last project wraps to the first.
export function NextProject({ currentSlug }: { currentSlug: string }) {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return null;
  const next = projects[(index + 1) % projects.length];

  return (
    <section aria-labelledby="next-project-label" className="mt-24 border-t border-line pt-10 md:mt-32">
      <p id="next-project-label" className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase md:text-xs">
        Next project →
      </p>
      <Link
        href={`/work/${next.slug}`}
        className="group mt-5 grid gap-6 rounded-md border border-line-strong bg-panel p-5 transition-colors hover:border-accent sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end"
      >
        <span className="block">
          <span className="font-mono text-xs text-muted">{next.number}</span>
          <span className="mt-2 block font-display text-[clamp(1.75rem,5vw,3.5rem)] leading-[1] tracking-[-0.03em] text-fg transition-colors group-hover:text-accent">
            {next.name}
          </span>
          <span className="mt-3 block max-w-xl text-soft">{next.summary}</span>
        </span>
        <span aria-hidden="true" className="font-mono text-sm text-accent lg:pb-1">
          {next.caseStudyLabel} →
        </span>
      </Link>
      <div className="mt-5">
        <ChipList items={next.stack} label={`${next.name} stack`} />
      </div>
    </section>
  );
}
