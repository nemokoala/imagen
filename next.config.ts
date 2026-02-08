import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    // /api/uploads 경로의 이미지를 _next/image 최적화에서 허용
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image-gen.store",
        pathname: "/api/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/api/uploads/**",
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default pwaConfig(nextConfig);
