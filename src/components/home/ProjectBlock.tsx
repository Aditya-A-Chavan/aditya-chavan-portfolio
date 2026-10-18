import Link from "next/link";
import type { ComponentType } from "react";
import type { Project } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChipList } from "@/components/ui/Chip";
import { RightsNotice } from "@/components/ui/RightsNotice";
import { StatusDot } from "@/components/ui/StatusDot";
import { CrmPlatformDiagram } from "@/components/visuals/CrmPlatformDiagram";
import { CurriculumPipeline } from "@/components/visuals/CurriculumPipeline";
import { GatewayFlow } from "@/components/visuals/GatewayFlow";
import { MargMap } from "@/components/visuals/MargMap";
import { NotiBridgeVisual } from "@/components/visuals/NotiBridgeVisual";

const visuals: Record<string, ComponentType> = {
  "crm-platform": CrmPlatformDiagram,
  "api-gateway": GatewayFlow,
  notibridge: NotiBridgeVisual,
  marg: MargMap,
  "curriculum-generator": CurriculumPipeline,
};

// One project in the Work section. The data-trace-* attributes are the hooks Work.tsx uses for the request trace.
export function ProjectBlock({ project }: { project: Project }) {
  const { slug, number, name, meta, health, status, trace, summary, story, parts, stack, caseStudyLabel, source, live } = project;
  const Visual = visuals[slug];
  const inDesign = health === "amber";
  const href = `/work/${slug}`;

  return (
    <article data-trace-block className="grid gap-8 border-t border-line py-12 first:border-t-0 first:pt-0 md:py-16 lg:grid-cols-2 lg:items-start lg:gap-14 lg:py-20">
      <div className="min-w-0">
        <div data-trace-meta className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-[0.08em] text-muted uppercase md:text-xs">
          <span data-health-dot data-health={health} className="inline-flex rounded-full">
            <StatusDot health={health} />
          </span>
          <span className="sr-only">{status}</span>
          <span>
            {number} · {meta}
          </span>
          {inDesign && <span className="rounded border border-amber/40 px-2 py-0.5 text-[11px] text-amber">{status}</span>}
          <span aria-hidden="true" data-trace-text className={`inline-block text-xs tracking-normal normal-case ${inDesign ? "text-amber" : "text-accent"}`}>
            {trace}
          </span>
        </div>

        <h3 className="mt-5 font-display text-[clamp(1.875rem,4.4vw,4rem)] leading-[0.98] tracking-[-0.03em] text-balance">
          <Link href={href} className="group inline-block">
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2">{name}</span>
            <span
              aria-hidden="true"
              className="ml-3 inline-block -translate-x-2 text-accent opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 pointer-coarse:translate-x-0 pointer-coarse:opacity-100"
            >
              →
            </span>
          </Link>
        </h3>

        <p className="mt-4 text-lg text-soft md:text-xl">{summary}</p>
        {story && <p className="mt-6 border-l-2 border-amber/60 pl-5 text-xl leading-snug text-fg italic md:text-2xl">{story}</p>}

        <dl className="mt-8 space-y-5">
          {parts.map(({ label, text }) => (
            <div key={label} className="grid gap-1 md:grid-cols-[7.5rem_1fr] md:gap-6">
              <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase md:pt-1">{label}</dt>
              <dd className="text-[15px] leading-relaxed text-soft md:text-base">{text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <ChipList items={stack} label="Stack" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={href} variant="primary">
            {caseStudyLabel} →
          </ButtonLink>
          {source && (
            <ButtonLink href={source}>
              Source<span className="sr-only"> (opens in a new tab)</span>
            </ButtonLink>
          )}
          {live && (
            <ButtonLink href={live}>
              Live site<span className="sr-only"> (opens in a new tab)</span>
            </ButtonLink>
          )}
        </div>
        {slug === "marg" && <RightsNotice variant="compact" />}
      </div>

      <div className="order-first min-w-0 lg:order-none">
        <Visual />
      </div>
    </article>
  );
}
