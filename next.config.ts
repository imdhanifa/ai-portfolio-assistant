import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-portfolio-assistant",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
