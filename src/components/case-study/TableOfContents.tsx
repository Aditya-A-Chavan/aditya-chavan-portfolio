"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToId } from "@/lib/scroll";

type Item = { id: string; title: string };

// Id of the last heading that has scrolled past the line just under the sticky top bar.
function useActiveId(items: Item[]) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return active;
}

function go(e: React.MouseEvent, id: string) {
  if (!scrollToId(id)) return;
  e.preventDefault();
  history.replaceState(null, "", `#${id}`);
}

const link = "flex min-h-11 items-center gap-3 py-1 font-mono text-xs transition-colors lg:min-h-0 lg:py-1.5";

// variant "sidebar": sticky list for lg and up. variant "dropdown": `Contents ▾` disclosure for smaller screens.
export function TableOfContents({ items, variant }: { items: Item[]; variant: "sidebar" | "dropdown" }) {
  const active = useActiveId(items);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  if (variant === "sidebar") {
    return (
      <nav aria-label="Contents" className="hidden lg:sticky lg:top-24 lg:block">
        <p className="mb-3 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Contents</p>
        <ol className="border-l border-line">
          {items.map((item, i) => {
            const current = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  aria-current={current ? "location" : undefined}
                  className={`${link} -ml-px border-l pl-4 ${current ? "border-accent text-accent" : "border-transparent text-muted hover:text-fg"}`}
                >
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {item.title}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Contents"
      className="mt-8 lg:hidden"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="toc-list"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 w-full items-center justify-between rounded-md border border-line-strong px-4 font-mono text-xs text-fg"
      >
        Contents
        <span aria-hidden="true" className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <ol id="toc-list" className="mt-1 rounded-md border border-line-strong bg-panel px-4 py-2">
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={item.id === active ? "location" : undefined}
                onClick={(e) => {
                  go(e, item.id);
                  setOpen(false);
                }}
                className={`${link} ${item.id === active ? "text-accent" : "text-soft hover:text-fg"}`}
              >
                <span aria-hidden="true" className="text-muted">{String(i + 1).padStart(2, "0")}</span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
