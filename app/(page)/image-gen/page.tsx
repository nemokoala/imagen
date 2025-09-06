"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FetchUtil } from "@/lib/Fetch.util";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Download, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Layout } from "@/components/layout/Layout";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("dall-e-3");

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
        model,
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

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `ai-generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRegenerate = () => {
    setImageUrl(null);
    handleGenerate();
  };

  return (
    <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold gradient-purple-text">
              AI 이미지 생성기
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            상상력을 현실로 만들어보세요. AI가 당신의 아이디어를 아름다운
            이미지로 변환합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 섹션 */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                이미지 생성 설정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    프롬프트
                  </label>
                  <Textarea
                    placeholder="원하는 이미지를 자세히 설명해주세요...&#10;예: 귀여운 고양이가 라면을 먹는 모습, 카툰 스타일, 밝은 색상"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none border-2 focus:border-purple-500 transition-colors"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    AI 모델
                  </label>
                  <Select
                    value={model}
                    onValueChange={(value) => setModel(value)}
                  >
                    <SelectTrigger className="border-2 focus:border-purple-500 transition-colors">
                      <SelectValue placeholder="모델 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dall-e-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            추천
                          </Badge>
                          Dall-E 3
                        </div>
                      </SelectItem>
                      <SelectItem value="stable-diffusion-xl">
                        Stable Diffusion XL
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      이미지 생성
                    </>
                  )}
                </Button>
              </div>

              {loading && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-purple-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">
                      AI가 이미지를 생성하고 있습니다...
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결과 섹션 */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">
                생성된 이미지
              </CardTitle>
            </CardHeader>
            <CardContent>
              {imageUrl ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <Image
                        src={imageUrl}
                        alt="생성된 이미지"
                        width={800}
                        height={600}
                        className="w-full h-auto max-h-[400px] object-contain transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-xl" />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      다운로드
                    </Button>
                    <Button
                      onClick={handleRegenerate}
                      variant="outline"
                      className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                      disabled={loading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      다시 생성
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                    <Sparkles className="h-12 w-12 text-purple-400" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    이미지가 생성되면 여기에 표시됩니다
                  </p>
                  <p className="text-sm text-gray-400">
                    프롬프트를 입력하고 생성 버튼을 눌러보세요
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>AI 이미지 생성 서비스가 정상 작동 중입니다</span>
          </div>
        </div>
      </div>
    </Layout.Content>
  );
}
