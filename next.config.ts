import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  // The PDF fonts are read from disk at runtime, so ship them with the server code.
  outputFileTracingIncludes: { "/api/**": ["./lib/pdf/fonts/**"] },
};

export default nextConfig;
