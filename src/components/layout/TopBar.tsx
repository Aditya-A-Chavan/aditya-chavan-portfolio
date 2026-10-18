"use client";

import { Suspense, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { nav } from "@/content/site";
import { scrollToId } from "@/lib/scroll";
import { useIstClock } from "@/lib/time";
import { StatusDot } from "@/components/ui/StatusDot";
import { MobileMenu } from "./MobileMenu";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

// Tracks which nav section crosses the middle of the viewport. Renders nothing. It lives in its own
// component so reading the pathname (which re-targets the observer after route changes) can suspend
// without touching the visible bar.
function SectionSpy({ setActive }: { setActive: React.Dispatch<React.SetStateAction<string | null>> }) {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          const id = target.id;
          if (isIntersecting) setActive(id);
          else setActive((cur) => (cur === id ? null : cur));
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      io.disconnect();
      setActive(null);
    };
  }, [pathname, setActive]);
  return null;
}

const mono = "font-mono text-xs uppercase tracking-[0.14em]";

export function TopBar() {
  const router = useRouter();
  const time = useIstClock();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 8, () => false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      {/* -mb-16 lets the hero slide under the transparent bar. */}
      <header
        className={`sticky top-0 z-40 -mb-16 border-b transition-colors duration-300 ${scrolled ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-4 xl:gap-8">
            <Link href="/" aria-label="Aditya Chavan, home" className="inline-flex min-h-11 items-center font-display text-xl tracking-tight">
              AC
            </Link>
            <nav aria-label="Primary" className="hidden items-center lg:flex">
              {nav.map(({ label, id }) => (
                <a
                  key={id}
                  href={`/#${id}`}
                  aria-current={active === id ? "location" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!scrollToId(id)) router.push(`/#${id}`);
                  }}
                  className={`${mono} relative inline-flex min-h-11 items-center px-3 text-soft transition-colors after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform hover:text-fg hover:after:scale-x-100 aria-[current=location]:text-fg aria-[current=location]:after:scale-x-100`}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className={`${mono} hidden items-center gap-4 text-muted md:flex`}>
              <span>Mumbai, IN</span>
              <span aria-hidden="true" className="inline-block min-w-[12ch] tabular-nums text-soft">
                {time && `${time} IST`}
              </span>
              <span className="inline-flex items-center gap-2 normal-case tracking-normal text-soft">
                <StatusDot pulse />
                operational
              </span>
            </div>
            <button
              ref={menuButton}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="dialog"
              onClick={() => setMenuOpen(true)}
              className={`${mono} inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line-strong px-4 text-fg hover:border-fg lg:hidden`}
            >
              Menu
            </button>
          </div>
        </div>
      </header>
      <Suspense fallback={null}>
        <SectionSpy setActive={setActive} />
      </Suspense>
      {/* Sibling of the header: the header's backdrop blur would otherwise trap this fixed overlay. */}
      <MobileMenu open={menuOpen} onClose={closeMenu} time={time} returnFocusRef={menuButton} />
    </>
  );
}
