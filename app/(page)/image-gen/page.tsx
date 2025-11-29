"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Download, RefreshCw } from "lucide-react";
import Image from "next/image";
import { Layout } from "@/components/layout/Layout";
import { useGenerateImageMutation } from "@/queries/image/mutations";
import { useHealthCheckQuery } from "@/queries/image/queries";
import { ModelSelect } from "@/components/image-gen/ModelSelect";
import { CreditDisplay } from "@/components/image-gen/CreditDisplay";
import { useGetUserCreditQuery } from "@/queries/auth/queries";
import { useQueryClient } from "@tanstack/react-query";

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: healthCheck, isLoading: isHealthCheckLoading } =
    useHealthCheckQuery();

  const { data: credit, isLoading: isCreditLoading } = useGetUserCreditQuery();

  // healthCheck에 따라 기본 모델 계산
  const defaultModel = useMemo(
    () => (healthCheck?.healthy ? "stable-diffusion-xl" : "dall-e-3"),
    [healthCheck?.healthy]
  );

  // 사용자가 수동으로 선택한 모델 (없으면 기본 모델 사용)
  const [manualModel, setManualModel] = useState<string | null>(null);

  // 실제 사용할 모델 (수동 선택이 있으면 그것을, 없으면 기본 모델 사용)
  const model = manualModel ?? defaultModel;

  const handleModelChange = (value: string) => {
    setManualModel(value);
  };

  const { mutate: generateImage, isPending } = useGenerateImageMutation(
    (data) => {
      setImageUrl(data.imageUrl!);
      toast.success("이미지 생성 완료!", {
        description: "AI가 이미지를 생성했습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["credit"] });
    },
    (error) => {
      toast.error(error.message);
      queryClient.invalidateQueries({ queryKey: ["credit"] });
    }
  );

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("프롬프트를 입력해주세요", {
        description: "이미지 생성을 위한 설명을 입력해주세요.",
      });
      return;
    }

    // 크레딧 체크
    if (credit && credit < 1) {
      toast.error("크레딧이 부족합니다", {
        description: "이미지 생성을 위해 크레딧이 필요합니다.",
      });
      return;
    }

    generateImage({
      prompt,
      model,
    });
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
    <Layout.Content className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4 gap-4 md:gap-8 md:p-8">
      {/* 크레딧 정보 섹션 */}
      <CreditDisplay credit={credit ?? 0} isLoading={isCreditLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* 입력 섹션 */}
        <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">
              이미지 생성 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-subtitle mb-2 block">
                  프롬프트
                </label>
                <Textarea
                  placeholder="원하는 이미지를 자세히 설명해주세요... 예: 귀여운 고양이가 라면을 먹는 모습, 카툰 스타일, 밝은 색상"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] resize-none border-2 focus:border-purple-500 transition-colors"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-subtitle">
                  AI 모델
                </label>
                <ModelSelect
                  model={model}
                  setModel={handleModelChange}
                  healthCheck={healthCheck}
                  isHealthCheckLoading={isHealthCheckLoading}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isPending || !prompt.trim() || (credit ?? 0) < 1}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isPending ? (
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
          </CardContent>
        </Card>

        {/* 결과 섹션 */}
        <Card className="shadow-xl border-0 bg-background/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-foreground">
              생성된 이미지
            </CardTitle>
          </CardHeader>
          <CardContent>
            {imageUrl ? (
              <div className="space-y-4">
                <div className="relative group">
                  <div className="border-2 border-border rounded-xl overflow-hidden bg-background">
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
                    disabled={isPending || (credit ?? 0) < 1}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    다시 생성
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-700/70 dark:to-blue-700/70 flex items-center justify-center mb-4">
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
    </Layout.Content>
  );
}
