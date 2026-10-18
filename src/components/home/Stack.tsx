import { certifications, skills } from "@/content/site";
import { ChipList } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Stack() {
  return (
    <Section id="skills">
      <SectionHeader title="Stack" label="(06) ~/stack" />
      <div className="grid gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
        <Reveal>
          <h3 className="mb-6 font-mono text-xs tracking-[0.08em] text-muted uppercase">Skills</h3>
          <div className="space-y-6">
            {skills.map((g) => (
              <div key={g.group}>
                <h4 className="mb-3 font-mono text-sm text-accent">{g.group}</h4>
                <ChipList items={g.items} label={g.group} />
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="mb-6 font-mono text-xs tracking-[0.08em] text-muted uppercase">Certifications</h3>
          <ul className="space-y-3">
            {certifications.map((c) => (
              <li key={c.name} className="flex flex-col gap-3 rounded-md border border-line-strong bg-panel p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:p-5">
                <div className="min-w-0">
                  <p className="font-mono text-xs tracking-[0.08em] text-muted uppercase">
                    {c.issuer} · {c.date}
                  </p>
                  <p className="mt-1 text-fg">{c.name}</p>
                </div>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${c.name} (opens in a new tab)`}
                  className="inline-flex min-h-11 shrink-0 items-center self-start font-mono text-sm text-accent hover:underline hover:underline-offset-4 sm:self-auto"
                >
                  Verify ↗
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
