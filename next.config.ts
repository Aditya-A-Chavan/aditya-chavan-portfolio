import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Old addresses from the previous site keep working (hash anchors are handled client-side
  // by LegacyHashRedirect, because the server never sees the part after "#").
  async redirects() {
    return [
      { source: "/about", destination: "/#about", permanent: true },
      { source: "/experience", destination: "/#experience", permanent: true },
      { source: "/allprojects", destination: "/#work", permanent: true },
    ];
  },
};

export default nextConfig;
