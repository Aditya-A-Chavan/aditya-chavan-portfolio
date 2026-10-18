"use client";

import { Suspense, useEffect, useReducer } from "react";
import { usePathname } from "next/navigation";
import { scrollToId } from "@/lib/scroll";

type State = { heroGone: boolean; contactInView: boolean; overlay: boolean; typing: boolean };

const FIELD = "input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select";

function PinnedButton() {
  const pathname = usePathname();
  const [s, patch] = useReducer((cur: State, p: Partial<State>) => ({ ...cur, ...p }), {
    heroGone: false,
    contactInView: false,
    overlay: false,
    typing: false,
  });

  // Page-specific watchers: re-run when the route changes. Without #hero-cta the button never shows.
  useEffect(() => {
    const hero = document.getElementById("hero-cta");
    const contact = document.getElementById("contact");
    const heroIo = new IntersectionObserver(([e]) => patch({ heroGone: !e.isIntersecting && e.boundingClientRect.top < 0 }));
    const contactIo = new IntersectionObserver(([e]) => patch({ contactInView: e.isIntersecting }));
    if (hero) heroIo.observe(hero);
    if (contact) contactIo.observe(contact);
    return () => {
      heroIo.disconnect();
      contactIo.disconnect();
      patch({ heroGone: false, contactInView: false });
    };
  }, [pathname]);

  // Page-independent watchers: an open overlay (menu, terminal) and the on-screen keyboard.
  useEffect(() => {
    const root = document.documentElement;
    const mo = new MutationObserver(() => patch({ overlay: "overlayOpen" in root.dataset }));
    mo.observe(root, { attributes: true, attributeFilter: ["data-overlay-open"] });
    const onIn = (e: FocusEvent) => patch({ typing: e.target instanceof Element && e.target.matches(FIELD) });
    const onOut = () => patch({ typing: false });
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      mo.disconnect();
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const shown = s.heroGone && !s.contactInView && !s.overlay && !s.typing;

  return (
    <button
      type="button"
      inert={!shown}
      onClick={() => scrollToId("contact", { focusSelector: "input" })}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-30 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-bg shadow-lg shadow-black/40 transition-[transform,opacity,visibility] duration-300 hover:bg-[#6ee7a0] focus-visible:outline-fg lg:hidden ${shown ? "visible translate-y-0 opacity-100" : "invisible translate-y-6 opacity-0"}`}
    >
      Start a project →
    </button>
  );
}

// Phones and tablets only (hidden from lg up).
export function PinnedCta() {
  return (
    <Suspense fallback={null}>
      <PinnedButton />
    </Suspense>
  );
}
