import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  experimental: { workerThreads: true, cpus: 2, useTypeScriptCli: false },
  images: { formats: ["image/avif", "image/webp"] },
};
export default nextConfig;
