import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study/CaseStudyLayout";
import { caseStudies } from "@/content/case-studies";
import { margRights, profile, projects } from "@/content/site";

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
    // MARG carries an explicit ownership marker and a text-and-data-mining (AI) rights reservation.
    ...(slug === "marg" && {
      authors: [{ name: profile.name, url: profile.siteUrl }],
      other: { copyright: margRights.reservation, "tdm-reservation": "1" },
    }),
  };
}

// Machine-readable authorship and copyright for MARG (schema.org CreativeWork).
function MargJsonLd() {
  const author = { "@type": "Person", name: profile.name, url: profile.siteUrl };
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "MARG — Mumbai Ambulance Rapid Gateway",
    url: `${profile.siteUrl}/work/marg`,
    description: margRights.authorship,
    author,
    creator: author,
    copyrightHolder: author,
    copyrightYear: 2026,
    dateCreated: margRights.firstDocumented,
    copyrightNotice: margRights.reservation,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = Object.hasOwn(caseStudies, slug) ? caseStudies[slug] : undefined;
  if (!study) notFound();
  return (
    <>
      {slug === "marg" && <MargJsonLd />}
      <CaseStudyLayout study={study} />
    </>
  );
}
