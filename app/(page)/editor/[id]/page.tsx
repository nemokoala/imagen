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
  const [scale] = useState<number>(1);

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
