"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FetchUtil } from "@/lib/Fetch.util";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("프롬프트를 입력해주세요", {
        description: "이미지 생성을 위한 설명을 입력해주세요.",
      });
      return;
    }

    setLoading(true);

    try {
      const data = await FetchUtil.post("/api/generate-image", {
        prompt,
      });

      setImageUrl(data.imageUrl);

      // 성공 토스트 표시
      toast.success("이미지 생성 완료!", {
        description: "AI가 이미지를 생성했습니다.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "이미지 생성 중 오류가 발생했습니다.";

      // 에러 토스트 표시
      toast.error("이미지 생성 실패", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            AI 이미지 생성
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="원하는 이미지를 설명해주세요... (예: 귀여운 고양이가 라면을 먹는 모습)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8"
            >
              {loading ? "생성 중..." : "이미지 생성"}
            </Button>
          </div>

          {imageUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">생성된 이미지</h3>
              <div className="border rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="생성된 이미지"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
