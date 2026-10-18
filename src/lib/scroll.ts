import type Lenis from "lenis";

let lenis: Lenis | null = null;

// Called by the SmoothScroll provider when Lenis starts and stops.
export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

// Smooth-scrolls to a section by id (Lenis when active, native otherwise).
// With focusSelector, focuses the first matching element inside the target afterwards.
export function scrollToId(id: string, opts: { focusSelector?: string } = {}) {
  const target = document.getElementById(id);
  if (!target) return false;
  const focus = () => {
    const el = opts.focusSelector ? target.querySelector<HTMLElement>(opts.focusSelector) : null;
    el?.focus({ preventScroll: true });
  };
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, onComplete: focus });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    focus();
  }
  return true;
}
