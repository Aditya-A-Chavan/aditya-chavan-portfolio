import { ImageResponse } from "next/og";
import { OgCard, ogSize } from "@/components/seo/OgCard";
import { profile } from "@/content/site";

export const alt = `${profile.name} — ${profile.role}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<OgCard title={profile.name} subtitle={profile.role} titleSize={150} />, { ...size });
}
