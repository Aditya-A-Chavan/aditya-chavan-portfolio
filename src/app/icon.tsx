import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// AC monogram: terminal green on near-black. Heavy weight is faked with a text stroke
// because only a regular-weight font is bundled with next/og.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0C0E",
          color: "#4ADE80",
          fontSize: 17,
          letterSpacing: -1,
          WebkitTextStroke: "1.2px #4ADE80",
        }}
      >
        AC
      </div>
    ),
    { ...size },
  );
}
