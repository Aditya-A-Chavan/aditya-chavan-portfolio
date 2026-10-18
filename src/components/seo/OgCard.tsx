// Shared 1200×630 link-preview card for opengraph-image files (ImageResponse markup, inline styles only).
// Only a regular-weight font ships with next/og, so the heavy display look comes from a text stroke;
// this keeps the build free of font downloads.
export const ogSize = { width: 1200, height: 630 };

export function OgCard({ title, subtitle, titleSize = 132 }: { title: string; subtitle: string; titleSize?: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0B0C0E",
        color: "#EDEBE6",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#8A8F98" }}>
        ADITYA-CHAVAN-PORTFOLIO.VERCEL.APP
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1,
            letterSpacing: -5,
            WebkitTextStroke: "5px #EDEBE6",
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 36 }}>
          <div style={{ display: "flex", fontSize: 38, color: "#C9C6BF", maxWidth: 980 }}>{subtitle}</div>
          <div style={{ display: "flex", width: 24, height: 44, marginLeft: 18, background: "#4ADE80", flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}
