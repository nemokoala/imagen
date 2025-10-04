"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetImageByIdQuery } from "@/queries/image/queries";
import { useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";

export default function EditorPage() {
  const { id } = useParams();
  const { data: image } = useGetImageByIdQuery(parseInt(id as string));
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);

  // 3. 스케일 계산 함수
  const calcScale = () => {
    const img = contentRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    // 이미지 자연 크기
    const imgW = 1024;
    const imgH = 1024;

    // 컨테이너 크기
    const containerRect = container.getBoundingClientRect();
    const { width: containerW, height: containerH } = containerRect;

    // 비율 계산 → 가장 작은 값이 전부 들어가게 함
    const scaleX = containerW / imgW;
    const scaleY = containerH / imgH;
    const newScale = Math.min(scaleX, scaleY);

    setScale(newScale);
  };
  return (
    <Layout.Content>
      <div
        className="w-full h-full relative bg-red-400 flex justify-center items-center"
        ref={containerRef}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 1024,
            height: 1024,
          }}
          ref={contentRef}
        >
          {image?.imageUrl && (
            <Image
              src={image?.imageUrl}
              alt="Image"
              width={1024}
              height={1024}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </Layout.Content>
  );
}
