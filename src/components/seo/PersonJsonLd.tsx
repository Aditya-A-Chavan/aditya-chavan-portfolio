import { profile, skills } from "@/content/site";

// Structured data for search engines. Render once in the root layout, inside <body>.
export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    jobTitle: profile.role,
    description:
      "Mumbai-based software developer building reliable backend systems, APIs and cloud services. AI Engineer at AllHome.",
    email: `mailto:${profile.email}`,
    worksFor: { "@type": "Organization", name: "AllHome" },
    address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "IN" },
    sameAs: profile.socials.map((s) => s.href),
    knowsAbout: skills.filter((g) => g.group !== "Practices").flatMap((g) => g.items),
  };

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so the JSON can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
