import type { NextConfig } from "next";

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

export default nextConfig;
