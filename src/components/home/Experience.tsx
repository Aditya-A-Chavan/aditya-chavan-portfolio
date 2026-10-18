"use client";

import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ChipList } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { experience } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const [openId, setOpenId] = useState<string | null>(experience[0].id);

  return (
    <Section id="experience">
      <SectionHeader title="Experience" label="(02) ~/experience" />
      <Reveal>
        <ul className="border-b border-line-strong">
          {experience.map((item) => {
            const open = openId === item.id;
            const buttonId = `exp-btn-${item.id}`;
            const panelId = `exp-panel-${item.id}`;
            return (
              <li key={item.id} className="border-t border-line-strong">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="group grid min-h-11 w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-5 text-left transition-colors hover:bg-panel lg:grid-cols-[220px_1fr_1fr_auto] lg:py-7"
                  >
                    <span className="font-mono text-[11px] tracking-[0.08em] text-muted md:text-xs">{item.dates}</span>
                    <span className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] leading-tight tracking-[-0.01em]">{item.org}</span>
                    <span className="text-base text-soft">{item.role}</span>
                    <span
                      aria-hidden="true"
                      className="col-start-2 row-span-3 row-start-1 flex size-11 items-center justify-center font-mono text-2xl text-muted transition-colors group-hover:text-accent lg:col-start-4 lg:row-span-1"
                    >
                      {open ? "×" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  onTransitionEnd={(e) => {
                    if (e.target === e.currentTarget) ScrollTrigger.refresh();
                  }}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pt-2 pb-8 md:grid-cols-[1fr_2fr] md:gap-10 lg:pb-12">
                      {item.figure && (
                        <div>
                          <p className="font-display text-[clamp(5rem,16vw,10rem)] leading-[0.85] tracking-[-0.04em] text-accent">{item.figure}</p>
                          <p className="mt-3 max-w-[16rem] text-sm text-muted italic">{item.figureCaption}</p>
                        </div>
                      )}
                      <div className={`space-y-6 ${item.figure ? "" : "md:col-start-2"}`}>
                        {item.summary && <p className="text-base text-soft md:text-[17px]">{item.summary}</p>}
                        {item.bullets.length > 0 && (
                          <ul className="space-y-3 text-base text-soft md:text-[17px]">
                            {item.bullets.map((b) => (
                              <li key={b} className="relative pl-5 before:absolute before:left-0 before:font-mono before:text-accent before:content-['>']">
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.chips.length > 0 && <ChipList items={item.chips} label="Technologies" />}
                        {item.figure && <ButtonLink href="#work" variant="text">Read the case studies ↓</ButtonLink>}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
