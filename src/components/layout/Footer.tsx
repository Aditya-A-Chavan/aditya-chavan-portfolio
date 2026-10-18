"use client";

import { profile } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getLenis } from "@/lib/scroll";
import { openTerminal } from "@/lib/terminal";
import { ButtonLink } from "@/components/ui/ButtonLink";

const label = "mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted";
const link = "inline-flex min-h-11 items-center text-soft transition-colors hover:text-accent";
const bottomButton = "inline-flex min-h-11 items-center transition-colors hover:text-accent";

export function Footer() {
  const reduced = usePrefersReducedMotion();

  const backToTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="border-t border-line">
      {/* Extra bottom padding below lg keeps the pinned button off the last line. */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-20 sm:px-6 md:pt-28 lg:px-10 lg:pb-10">
        <h2 className="max-w-4xl font-display text-[clamp(2.25rem,8vw,5.5rem)] leading-[0.95] tracking-tight">
          Let&apos;s build something that works properly.
        </h2>
        <div className="mt-8">
          <ButtonLink href="#contact" variant="primary" focusSelector="input">
            Start a project →
          </ButtonLink>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          <div>
            <h3 className={label}>Elsewhere</h3>
            <ul>
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={label}>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${profile.email}`} className={`${link} break-all`}>
                  {profile.email}
                </a>
              </li>
              <li>
                <a href={profile.phone.href} className={link}>
                  {profile.phone.display}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className={label}>Location</h3>
            <p className="text-soft">{profile.basedIn}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-1 border-t border-line pt-4 font-mono text-xs text-muted">
          <span>© 2026 {profile.name}</span>
          <span>Built with Next.js · deployed on Vercel</span>
          <button type="button" onClick={openTerminal} className={bottomButton}>
            &gt;_ open terminal
          </button>
          <button type="button" onClick={backToTop} className={bottomButton}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
