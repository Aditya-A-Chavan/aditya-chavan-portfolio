"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { getLenis, scrollToId } from "@/lib/scroll";
import { usePrefersReducedMotion } from "@/lib/motion";
import { TERMINAL_OPEN_EVENT } from "@/lib/terminal";
import { CLEAR, PROMPT, SUGGESTIONS, WELCOME, complete, run, type Actions, type Entry } from "./commands";

const HISTORY_KEY = "terminal:history";
const HINT_KEY = "terminal:hint-seen";
const FOCUSABLE = 'button, a[href], input, [tabindex]:not([tabindex="-1"])';

function readHistory(): string[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function Terminal() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  const titleId = useId();

  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState<"hidden" | "in" | "out">("hidden");
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, cmd: null, out: WELCOME }]);
  const [value, setValue] = useState("");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const historyRef = useRef<string[] | null>(null);
  const historyPos = useRef<number | null>(null);
  const draft = useRef("");
  const nextId = useRef(1);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const show = useCallback(() => {
    if (panelRef.current) return;
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : buttonRef.current;
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Opening: custom event from other components, and the backtick shortcut.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "`" || e.ctrlKey || e.metaKey || e.altKey || panelRef.current) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      show();
    };
    window.addEventListener(TERMINAL_OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(TERMINAL_OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  // One-time hint beside the button: appears after 2s, fades after 5s more, once per session.
  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(HINT_KEY) === "1";
    } catch {}
    if (seen || !window.matchMedia("(min-width: 768px)").matches) return;
    const timers = [
      window.setTimeout(() => {
        try {
          sessionStorage.setItem(HINT_KEY, "1");
        } catch {}
        setHint("in");
      }, 2000),
      window.setTimeout(() => setHint("out"), 7000),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // While open: flag the page, pause smooth scroll, focus the input, animate in, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.overlayOpen = "terminal";
    getLenis()?.stop();
    inputRef.current?.focus({ preventScroll: true });
    if (!reducedRef.current) {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const options = { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
      panelRef.current?.animate(
        [{ transform: `translateY(${desktop ? "24px" : "100%"})`, opacity: desktop ? 0 : 1 }, { transform: "none", opacity: 1 }],
        options,
      );
      backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], options);
    }
    return () => {
      if (root.dataset.overlayOpen === "terminal") delete root.dataset.overlayOpen;
      getLenis()?.start();
      const active = document.activeElement;
      if (!active || active === document.body) openerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, open]);

  const actions: Actions = {
    close,
    navigate: (href) => {
      setOpen(false);
      router.push(href);
    },
    hire: () => {
      window.setTimeout(() => {
        setOpen(false);
        if (window.location.pathname !== "/" || !scrollToId("contact", { focusSelector: "input" })) {
          router.push("/#contact");
        }
      }, 600);
    },
  };

  const submit = async (raw: string) => {
    const text = raw.trim();
    historyPos.current = null;
    setValue("");
    if (text) {
      const history = (historyRef.current ??= readHistory());
      if (history[history.length - 1] !== text) history.push(text);
      history.splice(0, history.length - 100);
      try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch {}
    }
    const id = nextId.current++;
    const out = await run(text, actions);
    if (out === CLEAR) setEntries([]);
    else setEntries((prev) => [...prev, { id, cmd: text, out }]);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && !e.shiftKey) {
      const completed = complete(value);
      if (completed !== value) {
        e.preventDefault();
        setValue(completed);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      const history = (historyRef.current ??= readHistory());
      if (!history.length) return;
      e.preventDefault();
      let i = historyPos.current;
      if (i === null) {
        draft.current = value;
        i = history.length;
      }
      i = e.key === "ArrowUp" ? Math.max(0, i - 1) : Math.min(history.length, i + 1);
      historyPos.current = i === history.length ? null : i;
      setValue(i === history.length ? draft.current : history[i]);
    }
  };

  // Escape closes; Tab cycles inside the dialog.
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40 hidden items-center gap-3 md:flex">
        <button
          ref={buttonRef}
          type="button"
          onClick={show}
          aria-label="Open terminal"
          aria-haspopup="dialog"
          className="grid size-11 place-items-center rounded-full border border-line-strong bg-panel font-mono text-sm text-accent transition-colors hover:border-accent"
        >
          &gt;_
        </button>
        <span
          aria-hidden="true"
          className={`rounded-full border border-line-strong bg-panel px-3 py-1 font-mono text-xs text-soft transition-opacity duration-500 ${
            hint === "in" && !open ? "opacity-100" : "opacity-0"
          } pointer-events-none`}
        >
          psst… try the terminal
        </span>
      </div>

      {open && (
        <div className="fixed inset-0 z-[90]">
          <div ref={backdropRef} aria-hidden="true" onClick={close} className="absolute inset-0 bg-black/50" />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onKeyDown={onPanelKeyDown}
            className="absolute inset-x-0 bottom-0 flex h-[70dvh] flex-col overflow-hidden rounded-t-2xl border border-line-strong bg-panel font-mono text-fg shadow-2xl md:inset-x-auto md:bottom-[4.5rem] md:left-4 md:h-[min(400px,calc(100dvh-6rem))] md:w-[min(640px,calc(100vw-2rem))] md:rounded-xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close terminal"
              className="grid h-6 shrink-0 place-items-center md:hidden"
            >
              <span className="h-1 w-10 rounded-full bg-line-strong" />
            </button>
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2 md:py-2.5">
              <span id={titleId} className="text-xs text-muted">
                aditya@portfolio: ~
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close terminal"
                className="hidden size-6 place-items-center rounded text-lg leading-none text-muted hover:text-fg md:grid"
              >
                ×
              </button>
            </div>

            <div
              ref={scrollerRef}
              data-lenis-prevent
              aria-live="polite"
              aria-relevant="additions"
              onClick={(e) => {
                if (!window.getSelection()?.toString() && !(e.target as HTMLElement).closest("a")) inputRef.current?.focus();
              }}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 text-[13px] leading-relaxed text-soft"
            >
              {entries.map((entry) => (
                <div key={entry.id} className="mb-2">
                  {entry.cmd !== null && (
                    <p className="text-fg">
                      <span className="text-accent">{PROMPT}</span> {entry.cmd}
                    </p>
                  )}
                  {entry.out !== null && <div>{entry.out}</div>}
                </div>
              ))}
            </div>

            <div className="flex shrink-0 gap-2 overflow-x-auto px-4 pt-1 pb-2 md:hidden">
              {SUGGESTIONS.map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => submit(cmd)}
                  className="shrink-0 rounded-full border border-line-strong px-3 py-1.5 text-xs text-soft active:border-accent active:text-accent"
                >
                  {cmd}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(value);
              }}
              className="flex shrink-0 items-center gap-2 border-t border-line px-4 py-2.5"
            >
              <label htmlFor={`${titleId}-input`} className="shrink-0 text-[13px] text-accent">
                {PROMPT}
              </label>
              <input
                id={`${titleId}-input`}
                ref={inputRef}
                value={value}
                onChange={(e) => {
                  historyPos.current = null;
                  setValue(e.target.value);
                }}
                onKeyDown={onInputKeyDown}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                className="min-w-0 flex-1 bg-transparent text-base text-fg caret-accent outline-none [caret-shape:block]"
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
