import { Metadata } from "next";
import { notFound } from "next/navigation";
import { imageService } from "@/lib/services/image/imageService";
import { ImageDetail } from "@/components/gallery/ImageDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return {
      title: "이미지를 찾을 수 없습니다",
    };
  }

  try {
    const image = await imageService.getImageById(id);

    if (!image) {
      return {
        title: "이미지를 찾을 수 없습니다",
      };
    }

    const prompt = image.prompt || "AI 생성 이미지";
    const truncatedPrompt =
      prompt.length > 60 ? prompt.substring(0, 60) + "..." : prompt;
    const imageUrl = image.imageUrl;
    const creator = image.user?.nickname || "익명";

    return {
      title: `${truncatedPrompt} - AI 이미지 갤러리`,
      description: `AI로 생성된 이미지입니다. 프롬프트: ${prompt}. 생성자: ${creator}. 모델: ${image.model}`,
      openGraph: {
        title: `${truncatedPrompt} - AI 이미지 갤러리`,
        description: `AI로 생성된 이미지입니다. 생성자: ${creator}`,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 1200,
            alt: prompt,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${truncatedPrompt} - AI 이미지 갤러리`,
        description: `AI로 생성된 이미지입니다. 생성자: ${creator}`,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/image/${id}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "이미지를 찾을 수 없습니다",
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
  try {
    image = await imageService.getImageById(id);
    console.log(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    notFound();
  }

  if (!image) {
    notFound();
  }

  // imageService.getImageById가 이미 Image 타입을 반환하므로 변환 불필요
  return <ImageDetail image={image} />;
}
