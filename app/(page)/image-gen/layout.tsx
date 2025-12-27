import { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "이미지 생성",
  description: "AI를 사용하여 원하는 이미지를 생성하세요. Stable Diffusion, DALL-E 등 다양한 AI 모델을 지원합니다.",
  path: "/image-gen",
});

