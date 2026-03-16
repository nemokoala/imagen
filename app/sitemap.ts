import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://image-gen.store";

  // 정적 페이지들
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 동적 이미지 페이지들
  try {
    const images = await prisma.generatedImage.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 1000, // 최대 1000개 이미지만 포함
    });

    const imagePages: MetadataRoute.Sitemap = images.map(
      (image: { id: number; updatedAt: Date }) => ({
        url: `${baseUrl}/image/${image.id}`,
        lastModified: image.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }),
    );

    return [...staticPages, ...imagePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // 에러 발생 시 정적 페이지만 반환
    return staticPages;
  }
}
