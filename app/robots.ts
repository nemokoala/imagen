import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://image-gen.store";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/uploads/"],
        disallow: ["/api/", "/admin/", "/auth/", "/editor/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/api/uploads/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
