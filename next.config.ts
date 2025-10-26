import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  assetPrefix: ".",
};

export default nextConfig;
