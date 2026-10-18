import { ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <div>
      <Section className="flex min-h-screen flex-col justify-center">
        <div className="max-w-3xl rounded-md border border-line bg-panel p-5 font-mono text-sm leading-7 sm:p-8 sm:text-base">
          <p>
            <span className="text-accent">$</span> cd /that-page
          </p>
          <p className="text-muted">bash: cd: /that-page: No such file or directory</p>
          <p aria-hidden="true" className="mt-1">
            <span className="text-accent">$</span>{" "}
            <span className="inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-accent" />
          </p>
        </div>
        <h1 className="mt-10 font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
          This page doesn&apos;t exist.
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Go home
          </ButtonLink>
          <ButtonLink href="/#work" variant="outline">
            See my work
          </ButtonLink>
        </div>
      </Section>
    </div>
  );
}
