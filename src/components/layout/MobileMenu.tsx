"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { nav, profile } from "@/content/site";
import { getLenis, scrollToId } from "@/lib/scroll";
import { openTerminal } from "@/lib/terminal";

// Undoes everything the open menu did to the page. Safe to call twice.
function release() {
  const root = document.documentElement;
  delete root.dataset.overlayOpen;
  root.style.overflow = "";
  getLenis()?.start();
}

const itemClass =
  "flex min-h-11 w-full items-center gap-4 py-2 text-left font-display text-[clamp(2.25rem,11vw,4rem)] uppercase leading-none tracking-tight text-fg hover:text-accent";

type Props = {
  open: boolean;
  onClose: () => void; // must be referentially stable
  time: string;
  returnFocusRef: React.RefObject<HTMLElement | null>;
};

export function MobileMenu({ open, onClose, time, returnFocusRef }: Props) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.overlayOpen = "menu";
    root.style.overflow = "hidden";
    getLenis()?.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const items = panelRef.current?.querySelectorAll<HTMLElement>("a[href], button");
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panelRef.current?.contains(active) || (e.shiftKey && active === first) || (!e.shiftKey && active === last)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    // Rotating a tablet past the breakpoint swaps this menu for the desktop nav.
    const wide = window.matchMedia("(min-width: 1024px)");
    wide.addEventListener("change", onClose);
    document.addEventListener("keydown", onKey);

    const panel = panelRef.current;
    const returnTo = returnFocusRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onClose);
      release();
      // Return focus unless something else (the terminal) already took it.
      const active = document.activeElement;
      if (active === document.body || panel?.contains(active)) returnTo?.focus({ preventScroll: true });
    };
  }, [open, onClose, returnFocusRef]);

  // Close first, then scroll, so the page is free to move.
  const leave = (action: () => void) => {
    release();
    onClose();
    action();
  };

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-bg px-4 pb-[max(2rem,env(safe-area-inset-bottom))] transition-[opacity,visibility] duration-300 sm:px-6 lg:hidden ${open ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className="flex h-16 shrink-0 items-center justify-between">
        <span className="font-display text-xl">AC</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line-strong px-4 font-mono text-xs uppercase tracking-[0.14em] text-fg hover:border-fg"
        >
          Close
        </button>
      </div>

      <nav aria-label="Mobile" className="mt-6">
        <ul className="flex flex-col">
          {nav.map(({ label, id }, i) => (
            <li key={id}>
              <a
                href={`/#${id}`}
                className={itemClass}
                onClick={(e) => {
                  e.preventDefault();
                  leave(() => {
                    if (!scrollToId(id)) router.push(`/#${id}`);
                  });
                }}
              >
                <span className="font-mono text-xs tracking-[0.14em] text-muted">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" className={itemClass} onClick={() => leave(openTerminal)}>
              <span className="font-mono text-xs tracking-[0.14em] text-muted">&gt;_</span>
              Terminal
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-4 pt-12 font-mono text-xs uppercase tracking-[0.14em] text-muted">
        <span aria-hidden="true" className="tabular-nums">
          Mumbai, IN · {time ? `${time} IST` : "IST"}
        </span>
        <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center break-all normal-case tracking-normal text-soft hover:text-accent">
          {profile.email}
        </a>
        <ul className="flex flex-wrap gap-x-6">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-soft hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
