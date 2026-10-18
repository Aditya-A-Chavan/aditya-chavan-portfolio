import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/seo/OgCard";
import { projects } from "@/content/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Case study by Aditya Chavan";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const titleSize = project.name.length > 28 ? 76 : project.name.length > 14 ? 96 : 128;
  return new ImageResponse(<OgCard title={project.name} subtitle={project.summary} titleSize={titleSize} />, { ...size });
}
