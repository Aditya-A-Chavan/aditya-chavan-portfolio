import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 96,
          letterSpacing: -5,
          WebkitTextStroke: "6px #4ADE80",
        }}
      >
        AC
      </div>
    ),
    { ...size },
  );
}
