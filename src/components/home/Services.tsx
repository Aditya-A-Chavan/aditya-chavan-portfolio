import Link from "next/link";
import { services } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Services() {
  return (
    <Section id="services">
      <SectionHeader title="Work with me" label="(04) ~/services" />
      <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
        {services.map((s, i) => (
          <li key={s.code}>
            <Reveal delay={(i % 2) * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-md border border-line-strong bg-panel p-6 transition duration-300 hover:-translate-y-1 hover:border-fg/50 focus-within:-translate-y-1 focus-within:border-accent md:p-8">
                <span className="font-mono text-xs tracking-[0.08em] text-muted">{s.code}</span>
                <h3 className="mt-4 font-display text-2xl leading-tight tracking-[-0.02em] md:text-3xl">{s.title}</h3>
                <p className="mt-3 mb-6 text-soft">{s.text}</p>
                <Link href={s.href} className="mt-auto inline-flex min-h-11 items-center self-start font-mono text-sm text-accent hover:underline hover:underline-offset-4">
                  {s.proof}
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
