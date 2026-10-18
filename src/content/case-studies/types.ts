import type { ReactNode } from "react";

// Contract every case study file in this folder exports as `default`.
// The route at src/app/work/[slug]/page.tsx renders it with the shared case-study layout.
export type CaseStudy = {
  slug: string; // must match a slug in projects (src/content/site.ts)
  metaLine: string; // e.g. "ALLHOME · 2026 · PRODUCTION · ROLE: BUILT & OPERATED"
  quickFacts: { role: string; timeline: string; team: string; stack: string };
  intro?: ReactNode; // optional full-width opening rendered before the body (MARG story intro)
  sections: { id: string; title: string; content: ReactNode }[]; // body, in order; ids feed the table of contents
};
