"use client";

import { useEffect } from "react";
import { scrollToId } from "@/lib/scroll";

// Old section anchors from the previous site, mapped to the current section ids.
const legacyHashes: Record<string, string> = {
  "#projects": "#work",
  "#skillset": "#skills",
};

// Renders nothing. Mount on the home page: rewrites a legacy hash in place, then scrolls to the new section.
export function LegacyHashRedirect() {
  useEffect(() => {
    const next = legacyHashes[window.location.hash];
    if (!next) return;
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
    scrollToId(next.slice(1));
  }, []);

  return null;
}
