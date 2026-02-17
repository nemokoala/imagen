import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { imageService } from "@/lib/services/image/imageService";
import { ImageDetail } from "@/components/gallery/ImageDetail";
import { StructuredData } from "@/components/seo/StructuredData";

interface PageProps {
  params: Promise<{ id: string }>;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://image-gen.store";

// 이미지 URL을 절대 경로로 변환
function getAbsoluteImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

// 같은 요청 내에서 getImageById 호출을 캐싱
const getCachedImage = cache(async (id: number) => {
  return await imageService.getImageById(id);
});

// 같은 요청 내에서 getAdjacentImages 호출을 캐싱
const getCachedAdjacentImages = cache(async (id: number) => {
  return await imageService.getAdjacentImages(id, 3, 3);
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return {
      title: "이미지를 찾을 수 없습니다",
      metadataBase: new URL(baseUrl),
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const image = await getCachedImage(id);

    if (!image) {
      return {
        title: "이미지를 찾을 수 없습니다",
        metadataBase: new URL(baseUrl),
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const prompt = image.prompt || "AI 생성 이미지";
    const truncatedPrompt =
      prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
    const absoluteImageUrl = getAbsoluteImageUrl(image.imageUrl);
    const creator = image.user?.nickname || "익명";
    const pageUrl = `${baseUrl}/image/${id}`;

    // 키워드 생성
    const keywords = [
      "AI 이미지",
      "ImageGen",
      "Stable Diffusion",
      "AI Art",
      image.model,
      creator,
      ...prompt.split(" ").slice(0, 10), // 프롬프트 앞부분을 키워드로 추가
    ].filter(Boolean);

    return {
      title: `${truncatedPrompt} - AI Image ${id} | ImageGen`,
      description: `AI로 생성된 고해상도 이미지입니다. 프롬프트: "${prompt}". 생성자: ${creator}, 모델: ${image.model}. ImageGen에서 더 많은 AI 아트를 확인하세요.`,
      keywords: keywords,
      metadataBase: new URL(baseUrl),
      openGraph: {
        title: `${truncatedPrompt} - AI Image ${id} | ImageGen`,
        description: `AI로 생성된 이미지입니다. 생성자: ${creator}. 프롬프트: ${prompt}`,
        type: "website",
        url: pageUrl,
        siteName: "ImageGen",
        locale: "ko_KR",
        images: [
          {
            url: absoluteImageUrl,
            width: 1024,
            height: 1024,
            alt: prompt,
            type: "image/png",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${truncatedPrompt} - AI Image ${id} | ImageGen`,
        description: `AI로 생성된 이미지입니다. 생성자: ${creator}`,
        images: [absoluteImageUrl],
      },
      alternates: {
        canonical: pageUrl,
      },
      icons: {
        icon: [
          { url: absoluteImageUrl, sizes: "1024x1024", type: "image/png" },
        ],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
      other: {
        image_src: absoluteImageUrl,
        "og:image:secure_url": absoluteImageUrl,
        "og:image:width": "1024",
        "og:image:height": "1024",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "이미지를 찾을 수 없습니다",
      metadataBase: new URL(baseUrl),
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function ImagePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  let image;
  let adjacentImages;
  try {
    image = await getCachedImage(id);
    adjacentImages = await getCachedAdjacentImages(id);
    console.log(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    notFound();
  }

  if (!image) {
    notFound();
  }

  // imageService.getImageById가 이미 Image 타입을 반환하므로 변환 불필요
  const absoluteImageUrl = getAbsoluteImageUrl(image.imageUrl);
  const pageUrl = `${baseUrl}/image/${image.id}`;

  return (
    <>
      <StructuredData
        type="ImageObject"
        imageObject={{
          contentUrl: absoluteImageUrl,
          url: pageUrl,
          name: image.prompt || "AI 생성 이미지",
          description: `AI로 생성된 이미지입니다. 프롬프트: ${
            image.prompt
          }. 생성자: ${image.user?.nickname || "익명"}. 모델: ${image.model}`,
          creator: {
            "@type": "Person",
            name: image.user?.nickname || "익명",
          },
          dateCreated: image.createdAt,
          encodingFormat: "image/png",
          width: 1024,
          height: 1024,
          license: "https://creativecommons.org/licenses/by/4.0/",
        }}
      />
      <ImageDetail
        image={image}
        prevImages={adjacentImages?.prevImages || []}
        nextImages={adjacentImages?.nextImages || []}
      />
    </>
  );
}
