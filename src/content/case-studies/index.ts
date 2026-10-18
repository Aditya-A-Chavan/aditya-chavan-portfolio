import type { CaseStudy } from "./types";
import crmPlatform from "./crm-platform";
import apiGateway from "./api-gateway";
import notibridge from "./notibridge";
import marg from "./marg";
import curriculumGenerator from "./curriculum-generator";

// Every case study keyed by slug, in the order of `projects` in src/content/site.ts.
export const caseStudies: Record<string, CaseStudy> = Object.fromEntries(
  [crmPlatform, apiGateway, notibridge, marg, curriculumGenerator].map((study) => [study.slug, study]),
);
