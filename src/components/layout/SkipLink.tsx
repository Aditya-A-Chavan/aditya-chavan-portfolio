// First tab stop on every page. Visible only on keyboard focus.
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only rounded-md bg-accent px-4 py-3 text-sm font-medium text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus-visible:outline-fg"
    >
      Skip to main content
    </a>
  );
}
