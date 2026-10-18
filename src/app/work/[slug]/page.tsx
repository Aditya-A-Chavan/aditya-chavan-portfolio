import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { caseStudies } from "@/content/case-studies";
import { projects } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  // Tab title reads "NotiBridge — Aditya Chavan" (spec 11); long names keep the part before the dash.
  const name = project.name.split(" — ")[0];
  return {
    title: { absolute: `${name} — Aditya Chavan` },
    description: project.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = Object.hasOwn(caseStudies, slug) ? caseStudies[slug] : undefined;
  if (!study) notFound();
  return <CaseStudyLayout study={study} />;
}
