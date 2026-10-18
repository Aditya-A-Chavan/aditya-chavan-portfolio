"use client";

import { useEffect, useRef, useState } from "react";
import { contact, profile } from "@/content/site";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "./ContactForm";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

const label = "font-mono text-xs tracking-[0.08em] text-muted uppercase";
const link = "inline-flex min-h-11 items-center text-fg underline decoration-line-strong underline-offset-4 hover:text-accent hover:decoration-accent";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    if (!(await copyText(profile.email))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  // The last headline line ends with the accented word ("WORK?").
  const last = contact.headline.length - 1;
  const lastLine = contact.headline[last];
  const split = lastLine.lastIndexOf(" ") + 1;

  return (
    <Section id="contact">
      <p className={label}>(07) $ ./contact</p>
      <h2 className="mt-4 font-display text-[clamp(2rem,8vw,7.5rem)] leading-[0.92] tracking-[-0.03em] break-words">
        {contact.headline.slice(0, last).map((line) => (
          <span key={line} className="block">{line}</span>
        ))}
        <span className="block">
          {lastLine.slice(0, split)}
          <span className="text-accent">{lastLine.slice(split)}</span>
        </span>
      </h2>
      <div className="mt-6 mb-12 md:mb-16">
        <ButtonLink href="#contact-form" variant="text" focusSelector="input" className="font-mono">
          Start a project ↓
        </ButtonLink>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal>
          <dl className="space-y-8">
            <div>
              <dt className={label}>Email</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                <a href={`mailto:${profile.email}`} className={`${link} break-all`}>{profile.email}</a>
                <button
                  type="button"
                  onClick={copy}
                  aria-label="Copy email address"
                  className="inline-flex min-h-11 min-w-20 items-center justify-center rounded-md border border-line-strong px-3 font-mono text-xs text-fg hover:border-fg"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
                <span className="sr-only" role="status">{copied ? "Email address copied" : ""}</span>
              </dd>
            </div>
            <div>
              <dt className={label}>Phone</dt>
              <dd className="mt-2"><a href={profile.phone.href} className={link}>{profile.phone.display}</a></dd>
            </div>
            <div>
              <dt className={label}>Elsewhere</dt>
              <dd className="mt-2 flex flex-wrap gap-x-6">
                {profile.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {s.label} ↗
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className={label}>Based in</dt>
              <dd className="mt-2 text-soft">{profile.basedIn} (IST)</dd>
            </div>
          </dl>
        </Reveal>
        <div id="contact-form" className="scroll-mt-24">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
