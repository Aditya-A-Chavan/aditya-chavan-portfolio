import type { Metadata, Viewport } from "next";
import { profile } from "@/content/site";

const title = `${profile.name} — ${profile.role}`;

export const siteDescription =
  "Aditya Chavan is a Mumbai-based software developer building reliable backend systems, APIs and cloud services. AI Engineer at AllHome. Available for freelance projects.";

// Assign to `export const metadata` in the root layout. Child pages override per field,
// and the opengraph-image files add the link-preview images automatically.
export const siteMetadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s — ${profile.name}` },
  description: siteDescription,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteDescription,
  },
  verification: { google: "0RVhCFb36QxPoZZgBfDw-zhWeSZzbXurRGnp_1EtfZY" },
};

export const siteViewport: Viewport = {
  themeColor: "#0B0C0E",
  colorScheme: "dark",
};
