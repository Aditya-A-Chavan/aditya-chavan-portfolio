import type { CaseStudy } from "@/content/case-studies/types";
import { projects } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NextProject } from "./NextProject";
import { ReadingProgress } from "./ReadingProgress";
import { TableOfContents } from "./TableOfContents";

// Default typography for plain elements inside a case study body. It lives in the components layer, so any
// utility class a case study puts on an element still wins.
const BODY_STYLES = `
@layer components {
  .cs-body :where(p) { margin-top: 1.15em; color: var(--color-soft); line-height: 1.75; }
  .cs-body :where(.cs-content > h3) { margin-top: 3rem; font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 1.9rem); line-height: 1.1; letter-spacing: -0.02em; color: var(--color-fg); scroll-margin-top: 6rem; }
  .cs-body :where(h3 + p) { margin-top: 0.9em; }
  .cs-body :where(ul:not([class]), ol:not([class])) { margin-top: 1.15em; padding-left: 1.4em; color: var(--color-soft); line-height: 1.7; }
  .cs-body :where(ul:not([class])) { list-style: disc; }
  .cs-body :where(ol:not([class])) { list-style: decimal; }
  .cs-body :where(ul:not([class]) > li, ol:not([class]) > li) { margin-top: 0.5em; padding-left: 0.25em; }
  .cs-body :where(ul:not([class]) > li)::marker, .cs-body :where(ol:not([class]) > li)::marker { color: var(--color-muted); }
  .cs-body :where(strong) { color: var(--color-fg); font-weight: 600; }
  .cs-body :where(a:not([class])) { color: var(--color-fg); text-decoration: underline; text-decoration-color: var(--color-line-strong); text-underline-offset: 4px; transition: color 0.15s, text-decoration-color 0.15s; }
  .cs-body :where(a:not([class]):hover) { color: var(--color-accent); text-decoration-color: var(--color-accent); }
  .cs-body :where(code:not([class])) { font-family: var(--font-mono); font-size: 0.86em; color: var(--color-fg); background: var(--color-panel); border: 1px solid var(--color-line); border-radius: 4px; padding: 0.1em 0.35em; overflow-wrap: anywhere; }
  .cs-body :where(.cs-content > :first-child) { margin-top: 0; }
}
`;

const LABEL = "font-mono text-[11px] tracking-[0.08em] text-muted uppercase md:text-xs";

export function CaseStudyLayout({ study }: { study: CaseStudy }) {
  const project = projects.find((p) => p.slug === study.slug);
  if (!project) return null;
  const { quickFacts } = study;
  const facts = [
    ["Role", quickFacts.role],
    ["Timeline", quickFacts.timeline],
    ["Team", quickFacts.team],
    ["Stack", quickFacts.stack],
  ];
  const toc = study.sections.map(({ id, title }) => ({ id, title }));

  return (
    <article className="pb-20 md:pb-28">
      <ReadingProgress />
      <style>{BODY_STYLES}</style>

      <header className="mx-auto w-full max-w-[1440px] px-4 pt-24 sm:px-6 md:pt-28 lg:px-10">
        <ButtonLink href="#work" variant="text" className="font-mono text-xs">
          ← Back to work
        </ButtonLink>
        <p className={`${LABEL} mt-8`}>{study.metaLine}</p>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.03em] [overflow-wrap:anywhere]">
          {project.name}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-soft md:text-xl">{project.summary}</p>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="bg-bg p-4 md:p-5">
              <dt className={LABEL}>{label}</dt>
              <dd className="mt-2 text-sm text-fg [overflow-wrap:anywhere] md:text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>

        <TableOfContents items={toc} variant="dropdown" />
      </header>

      {study.intro && <div className="mt-12 md:mt-16">{study.intro}</div>}

      <div className="mx-auto mt-14 w-full max-w-[1440px] px-4 sm:px-6 md:mt-20 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16 lg:px-10">
        <div>
          <TableOfContents items={toc} variant="sidebar" />
        </div>
        <div className="cs-body min-w-0 max-w-3xl">
          {study.sections.map(({ id, title, content }, i) => (
            <section key={id} aria-labelledby={id} className={i === 0 ? "" : "mt-16 border-t border-line pt-12 md:mt-20 md:pt-16"}>
              <span aria-hidden="true" className={`block ${LABEL}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 id={id} className="mt-3 scroll-mt-24 font-display text-[clamp(2rem,5vw,3.25rem)] leading-none tracking-[-0.03em]">
                {title}
              </h2>
              <div className="cs-content mt-6">{content}</div>
            </section>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <NextProject currentSlug={study.slug} />
      </div>
    </article>
  );
}
